# Xshell 部署指南（与现有 MySQL + Nginx 共存）

适用场景：服务器上**已有其他项目（MySQL）和 Nginx**，本系统单独使用 **PostgreSQL**，互不影响。

```
浏览器
  → Nginx（已有，新增一个 server 块）
      ├─ /          → /var/www/mycts/dist（Vue 静态页）
      └─ /api/      → Node :3001 → PostgreSQL :5432（仅本机）
```

| 服务 | 端口 | 说明 |
|---|---|---|
| MySQL（同事现有项目） | 3306 | **不动** |
| PostgreSQL（本系统） | 5432 | 仅 127.0.0.1，不对公网 |
| Node API（本系统） | **3001** | 避免与现有 3000 冲突 |
| Nginx | 80/443 | 新增配置文件，不重写旧站 |

---

## 第 0 步：Xshell 连接服务器

1. 打开 Xshell → 新建会话
2. 主机：`118.31.121.169`（你的 ECS 公网 IP）
3. 用户名：一般是 `root` 或同事给你的账号
4. 认证：密码或密钥

连接成功后执行：

```bash
# 查看环境（把结果记下来，有问题发给同事）
node -v || echo "需要安装 Node"
npm -v
nginx -v
pm2 -v || echo "需要安装 pm2"
ss -tlnp | grep -E '3000|3001|5432|3306'
ls /etc/nginx/conf.d/ 2>/dev/null || ls /etc/nginx/sites-enabled/ 2>/dev/null
```

---

## 第 1 步：安装 PostgreSQL（不影响 MySQL）

**方式 A：一键脚本（推荐）**

先把项目上传到服务器后：

```bash
cd /var/www/mycts
sudo bash deploy/setup-postgresql.sh 'Mycts@2026Strong'
```

把 `Mycts@2026Strong` 换成你自己的强密码，后面 `.env` 里要用同一个。

**方式 B：手动执行**

```bash
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

sudo -u postgres psql
```

```sql
CREATE USER mycts_user WITH PASSWORD 'Mycts@2026Strong';
CREATE DATABASE mycts OWNER mycts_user;
GRANT ALL PRIVILEGES ON DATABASE mycts TO mycts_user;
\q
```

```bash
echo "host    all             all             127.0.0.1/32            md5" | sudo tee -a /var/lib/pgsql/data/pg_hba.conf
sudo systemctl restart postgresql
```

---

## 第 2 步：上传项目代码

**方式 A：Xshell 自带 Xftp / Xftp 工具**

1. Xshell 菜单：工具 → 传输新建文件（或 Alt+P 打开 Xftp）
2. 本地选 `D:\webPro\MYCTS`
3. 服务器目录建：`/var/www/mycts`
4. 上传整个项目（可不上传 `node_modules`、`.git`）

**方式 B：Git（若代码在仓库）**

```bash
# /var 下没有 www 时，手动创建即可
sudo mkdir -p /var/www/mycts
sudo chown -R $USER:$USER /var/www/mycts
cd /var/www/mycts
git clone 你的仓库地址 .
```

若不想用 `/var/www`，也可放到用户目录，例如 `/home/你的用户名/mycts`（后面 Nginx 的 `root` 改成对应路径）。

---

## 第 3 步：建表

```bash
cd /var/www/mycts
PGPASSWORD='Mycts@2026Strong' psql -h 127.0.0.1 -U mycts_user -d mycts -f products.sql
```

---

## 第 4 步：配置后端并启动

```bash
cd /var/www/mycts
cp deploy/server.env.example .env
vi .env   # 或用 nano .env，填写 DB_PASSWORD
```

`.env` 内容示例：

```env
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=mycts_user
DB_PASSWORD=Mycts@2026Strong
DB_NAME=mycts
```

安装依赖并启动：

```bash
npm install
# 若无 pnpm：npm install -g pnpm && pnpm install

npm install -g pm2
pm2 start app.js --name mycts-api
pm2 save
pm2 startup   # 按提示执行它输出的那条命令
```

验证：

```bash
curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3001/api/products?limit=1
```

应返回 `{"status":"ok"}` 和 `[]`。

---

## 第 5 步：构建前端

在**本地 Windows** 先构建（把域名换成你实际访问地址）：

```env
# 本地新建 .env.production.local 或在构建前临时设置：
VITE_API_BASE_URL=http://mycts.你的域名.com/api
VITE_APP_SCAN_BASE_URL=http://mycts.你的域名.com
```

```powershell
cd D:\webPro\MYCTS
pnpm run build
```

用 Xftp 把本地 `dist/` 上传到服务器 `/var/www/mycts/dist/`。

**或在服务器上构建**（需 Node 16+）：

```bash
cd /var/www/mycts
echo "VITE_API_BASE_URL=http://mycts.你的域名.com/api" > .env.production
echo "VITE_APP_SCAN_BASE_URL=http://mycts.你的域名.com" >> .env.production
pnpm run build   # 或 npm run build
```

---

## 第 6 步：Nginx 新增站点（不动旧配置）

```bash
sudo cp /var/www/mycts/deploy/nginx-mycts.conf /etc/nginx/conf.d/mycts.conf
sudo vi /etc/nginx/conf.d/mycts.conf
```

修改两处：

1. `server_name` → 你的子域名或 IP，例如 `mycts.mingye.com` 或 `118.31.121.169`
2. 确认 `root /var/www/mycts/dist;` 和 `proxy_pass http://127.0.0.1:3001/api/;`

检查并重载（**不会停掉其他站点**）：

```bash
sudo nginx -t
sudo nginx -s reload
```

若同事用的是 `sites-enabled` 目录，把文件放到那里即可：

```bash
sudo cp /var/www/mycts/deploy/nginx-mycts.conf /etc/nginx/sites-enabled/mycts.conf
```

---

## 第 7 步：域名与防火墙

1. **域名**：在域名 DNS 添加 A 记录 `mycts` → `118.31.121.169`（问同事要子域名策略）
2. **安全组**：确保 80（和 443 如有 HTTPS）已开放；**不要**开放 5432、3001
3. 浏览器访问：`http://mycts.你的域名.com`，登录 `admin` / `admin@2023`

---

## 常见问题

**Q：3001 也被占用了？**

```bash
ss -tlnp | grep 300
```

把 `.env` 的 `PORT` 和 `nginx-mycts.conf` 里的 `proxy_pass` 改成空闲端口，例如 `3002`。

**Q：/api 返回 502？**

```bash
pm2 status
pm2 logs mycts-api
curl http://127.0.0.1:3001/health
```

**Q：数据库连不上？**

```bash
sudo systemctl status postgresql
PGPASSWORD='你的密码' psql -h 127.0.0.1 -U mycts_user -d mycts -c "SELECT 1"
```

**Q：会影响同事的 MySQL 项目吗？**

不会。MySQL 和 PostgreSQL 是两套独立服务；Nginx 只是新增一个 `server` 配置文件。

---

## 部署检查清单

- [ ] PostgreSQL 已安装，`products` 表已创建
- [ ] `pm2 status` 显示 `mycts-api` online
- [ ] `curl 127.0.0.1:3001/health` 正常
- [ ] `dist/` 已上传到 `/var/www/mycts/dist`
- [ ] Nginx `nginx -t` 通过并已 reload
- [ ] 浏览器能打开页面并录入条码
