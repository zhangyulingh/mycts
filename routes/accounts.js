const express = require("express");
const crypto = require("crypto");
const pool = require("../db");

const PRIMARY_ADMIN_USERNAME = "admin";

function getOperatorUsername(req) {
  return String(req.headers["x-operator-username"] || "").trim();
}

function isPrimaryAdminUsername(username) {
  return username === PRIMARY_ADMIN_USERNAME;
}

async function getOperatorAccount(req) {
  const username = getOperatorUsername(req);
  if (!username) return null;
  const { rows } = await pool.query(
    "SELECT id, username, role FROM accounts WHERE username = $1 LIMIT 1",
    [username]
  );
  return rows[0] || null;
}

function isSelfAccount(operatorAccount, operatorUsername, target) {
  if (operatorAccount && operatorAccount.id === target.id) return true;
  if (operatorUsername && operatorUsername === target.username) return true;
  return false;
}

// 自动建表 + 初始化默认管理员
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(100) DEFAULT '',
      role VARCHAR(50) DEFAULT 'user',
      phone VARCHAR(20) DEFAULT '',
      status INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_accounts_username ON accounts (username);
    CREATE INDEX IF NOT EXISTS idx_accounts_phone ON accounts (phone);
  `);
}

async function ensureDefaultAdmin() {
  const { rows } = await pool.query("SELECT id FROM accounts WHERE username = $1 LIMIT 1", ["admin"]);
  if (rows.length > 0) return;

  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin@2023";
  const hashedPassword = hashPassword(defaultPassword);
  await pool.query(
    `INSERT INTO accounts (username, password, nickname, role, status)
     VALUES ($1, $2, $3, $4, 1)`,
    ["admin", hashedPassword, "管理员", "admin"]
  );
  console.log("[accounts] 已创建默认管理员账号 admin，请登录后尽快修改密码");
}

async function initAccounts() {
  await ensureTable();
  await ensureDefaultAdmin();
}
initAccounts().catch((err) => console.error("initAccounts error:", err));

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, key] = stored.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return key === hash;
}

const router = express.Router();

// 登录（支持用户名或手机号）
router.post("/login", async (req, res, next) => {
  try {
    const { account, password } = req.body || {};
    if (!account || !password) {
      return res.status(400).json({ success: false, message: "账号和密码不能为空" });
    }
    const { rows } = await pool.query(
      "SELECT * FROM accounts WHERE (username = $1 OR phone = $1) LIMIT 1",
      [account.trim()]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "账号或密码错误" });
    }
    if (!verifyPassword(password, rows[0].password)) {
      return res.status(401).json({ success: false, message: "账号或密码错误" });
    }
    const { password: _, ...safeUser } = rows[0];
    return res.json({ success: true, data: safeUser, message: "登录成功" });
  } catch (error) {
    return next(error);
  }
});

// 获取账号分页列表
router.get("/", async (req, res, next) => {
  try {
    const pageIndex = Math.max(Number(req.query.pageIndex) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 100);
    const keyword = (req.query.keyword || "").trim();
    const offset = (pageIndex - 1) * pageSize;

    const whereClauses = [];
    const params = [];
    let paramIndex = 1;

    if (keyword) {
      whereClauses.push(`(username ILIKE $${paramIndex} OR nickname ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`);
      params.push(`%${keyword}%`);
      paramIndex++;
    }

    const excludeAdmin = req.query.excludeAdmin === "true" || req.query.excludeAdmin === "1";
    if (excludeAdmin) {
      whereClauses.push(`role <> 'admin'`);
    }

    const whereSQL = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";
    const countResult = await pool.query(`SELECT COUNT(*) FROM accounts ${whereSQL}`, params);
    const total = Number(countResult.rows[0].count);

    params.push(pageSize);
    params.push(offset);
    const { rows } = await pool.query(
      `SELECT id, username, nickname, role, phone, created_at, updated_at FROM accounts ${whereSQL} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );
    return res.json({ success: true, total, data: rows });
  } catch (error) {
    return next(error);
  }
});

// 获取单个账号
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, username, nickname, role, phone, created_at, updated_at FROM accounts WHERE id = $1 LIMIT 1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "账号不存在" });

    const operatorUsername = getOperatorUsername(req);
    const operatorAccount = await getOperatorAccount(req);
    const target = rows[0];
    const isSelf = isSelfAccount(operatorAccount, operatorUsername, target);

    if (target.role === "admin" && !isPrimaryAdminUsername(operatorUsername) && !isSelf) {
      return res.status(403).json({ success: false, message: "无权限查看该账号" });
    }

    return res.json({ success: true, data: target });
  } catch (error) {
    return next(error);
  }
});

// 新增账号（管理员可操作；仅超级管理员 admin 可创建管理员角色）
router.post("/", async (req, res, next) => {
  try {
    const operator = await getOperatorAccount(req);
    if (!operator || operator.role !== "admin") {
      return res.status(403).json({ success: false, message: "无权限新增账号" });
    }

    const { username, password, nickname, role, phone } = req.body || {};
    if (!username) return res.status(400).json({ success: false, message: "用户名不能为空" });
    if (!password) return res.status(400).json({ success: false, message: "密码不能为空" });

    const operatorIsPrimary = isPrimaryAdminUsername(operator.username);
    let accountRole = (role || "user").trim();
    if (!operatorIsPrimary) {
      if (accountRole === "admin") {
        return res.status(403).json({ success: false, message: "无权限创建管理员账号" });
      }
      accountRole = "user";
    }

    const hashedPassword = hashPassword(password);
    const { rows } = await pool.query(
      `INSERT INTO accounts (username, password, nickname, role, phone, status)
       VALUES ($1, $2, $3, $4, $5, 1)
       RETURNING id, username, nickname, role, phone, created_at`,
      [username.trim(), hashedPassword, (nickname || "").trim(), accountRole, (phone || "").trim()]
    );
    return res.status(201).json({ success: true, data: rows[0], message: "新增成功" });
  } catch (error) {
    if (error && error.code === "23505") return res.status(409).json({ success: false, message: "用户名已存在" });
    return next(error);
  }
});

// 修改账号
router.put("/:id", async (req, res, next) => {
  try {
    const operatorUsername = getOperatorUsername(req);
    const { rows: existingRows } = await pool.query(
      "SELECT id, username, role, password FROM accounts WHERE id = $1 LIMIT 1",
      [req.params.id]
    );
    if (existingRows.length === 0) return res.status(404).json({ success: false, message: "账号不存在" });

    const target = existingRows[0];
    const operatorAccount = await getOperatorAccount(req);
    const operatorIsPrimary = isPrimaryAdminUsername(operatorUsername);
    const isSelf = isSelfAccount(operatorAccount, operatorUsername, target);

    const { username, password, oldPassword, nickname, role, phone } = req.body || {};
    const trimmedPassword = typeof password === "string" ? password.trim() : "";
    const trimmedOldPassword = typeof oldPassword === "string" ? oldPassword.trim() : "";
    if (!username) return res.status(400).json({ success: false, message: "用户名不能为空" });

    if (target.role === "admin" && !operatorIsPrimary && !isSelf) {
      return res.status(403).json({ success: false, message: "无权限修改管理员账号" });
    }
    if (!operatorIsPrimary && req.body?.role === "admin") {
      return res.status(403).json({ success: false, message: "无权限设置管理员角色" });
    }
    if (isSelf && !operatorIsPrimary) {
      const passwordOnlySelfUpdate =
        trimmedPassword &&
        String(username).trim() === target.username &&
        nickname === undefined &&
        role === undefined &&
        phone === undefined;
      if (!passwordOnlySelfUpdate) {
        return res.status(403).json({ success: false, message: "仅可修改自己的密码，其他资料请联系超级管理员" });
      }
    }

    if (trimmedPassword && isSelf) {
      if (!trimmedOldPassword) {
        return res.status(400).json({ success: false, message: "请输入原密码" });
      }
      if (!verifyPassword(trimmedOldPassword, target.password)) {
        return res.status(400).json({ success: false, message: "原密码错误" });
      }
    }

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    const fields = { username, nickname, role, phone };
    for (const [key, val] of Object.entries(fields)) {
      if (val !== undefined) {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(typeof val === "string" ? val.trim() : val);
        paramIndex++;
      }
    }
    if (trimmedPassword) {
      setClauses.push(`password = $${paramIndex}`);
      values.push(hashPassword(trimmedPassword));
      paramIndex++;
    }
    setClauses.push("updated_at = NOW()");
    values.push(req.params.id);

    const { rows } = await pool.query(
      `UPDATE accounts SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING id, username, nickname, role, phone, created_at, updated_at`,
      values
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "账号不存在" });
    return res.json({ success: true, data: rows[0], message: "修改成功" });
  } catch (error) {
    if (error && error.code === "23505") return res.status(409).json({ success: false, message: "用户名已存在" });
    return next(error);
  }
});

// 删除账号（管理员可删普通用户；不能删管理员账号和自己）
router.delete("/:id", async (req, res, next) => {
  try {
    const operator = await getOperatorAccount(req);
    if (!operator || operator.role !== "admin") {
      return res.status(403).json({ success: false, message: "无权限删除账号" });
    }

    const { rows } = await pool.query(
      "SELECT id, username, role FROM accounts WHERE id = $1 LIMIT 1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "账号不存在" });

    const target = rows[0];
    if (target.username === PRIMARY_ADMIN_USERNAME) {
      return res.status(403).json({ success: false, message: "不能删除超级管理员账号" });
    }
    if (target.id === operator.id) {
      return res.status(403).json({ success: false, message: "不能删除当前登录账号" });
    }
    if (target.role === "admin" && !isPrimaryAdminUsername(operator.username)) {
      return res.status(403).json({ success: false, message: "无权限删除管理员账号" });
    }

    const { rowCount } = await pool.query("DELETE FROM accounts WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ success: false, message: "账号不存在" });
    return res.json({ success: true, message: "删除成功" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

