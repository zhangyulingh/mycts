-- 账号管理表

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
CREATE INDEX IF NOT EXISTS idx_accounts_created_at ON accounts (created_at DESC);

COMMENT ON TABLE accounts IS '账号管理表';
COMMENT ON COLUMN accounts.username IS '用户名';
COMMENT ON COLUMN accounts.password IS '密码';
COMMENT ON COLUMN accounts.nickname IS '昵称';
COMMENT ON COLUMN accounts.role IS '角色：admin管理员, user普通用户';
COMMENT ON COLUMN accounts.phone IS '手机号';
COMMENT ON COLUMN accounts.status IS '状态：1启用 2禁用';

-- 默认管理员由后端启动时自动创建（routes/accounts.js）
-- 用户名：admin  初始密码：admin@2023
-- 可通过环境变量 DEFAULT_ADMIN_PASSWORD 修改初始密码
-- 首次登录后请在「账号管理 → 修改我的账号」中修改用户名和密码

