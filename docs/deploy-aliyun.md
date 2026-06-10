# 阿里云部署：Vue 前端 + Node 后端 + PostgreSQL

> **Xshell 逐步操作、与现有 MySQL/Nginx 共存**：见 [deploy-aliyun-xshell.md](./deploy-aliyun-xshell.md)

## 架构

```
用户浏览器
  ├─ 管理端 / 扫码页  →  Nginx 静态文件（dist）
  └─ 条码 CRUD API    →  Nginx 反代 → Node(Express:3000) → PostgreSQL
```

数据库使用 PostgreSQL，后端入口为项目根目录 `app.js`。

---

## 1. 安装 PostgreSQL（Alibaba Cloud Linux 2）

Xshell 连接服务器后执行：

```bash
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

创建数据库和用户：

```bash
sudo -u postgres psql
```

```sql
CREATE USER mycts_user WITH PASSWORD '你的强密码';
CREATE DATABASE mycts OWNER mycts_user;
GRANT ALL PRIVILEGES ON DATABASE mycts TO mycts_user;
\q
```

允许本机密码登录（默认仅 peer）：

```bash
sudo sed -i "s/^host.*127.0.0.1\/32.*ident/host    all             127.0.0.1\/32            md5/" /var/lib/pgsql/data/pg_hba.conf
sudo sed -i "s/^host.*127.0.0.1\/32.*scram-sha-256/host    all             127.0.0.1\/32            md5/" /var/lib/pgsql/data/pg_hba.conf
sudo systemctl restart postgresql
```

---

## 2. 建表

上传项目后执行：

```bash
psql -h 127.0.0.1 -U mycts_user -d mycts -f products.sql
```

---

## 3. 后端部署（Node）

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

在服务器创建 `.env`：

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=mycts_user
DB_PASSWORD=你的强密码
DB_NAME=mycts
```

### 启动 API

```bash
pnpm run start:api
```

生产环境建议 pm2：

```bash
npm install -g pm2
pm2 start app.js --name mycts-api
pm2 save
pm2 startup
```

验证：

```bash
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/api/products?limit=1
```

---

## 4. 前端构建

```env
VITE_API_BASE_URL=https://你的域名/api
VITE_APP_SCAN_BASE_URL=https://你的域名
```

```bash
pnpm run build
```

将 `dist/` 上传到服务器，例如 `/var/www/mycts/dist`。

---

## 5. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/mycts/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
nginx -t && nginx -s reload
```

---

## 6. 本地开发

终端 1（后端）：

```bash
pnpm run start:api
```

终端 2（前端），`.env.local`：

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://127.0.0.1:3000
```

```bash
pnpm run dev
```

本地 PostgreSQL 建库：

```bash
psql -U postgres -c "CREATE DATABASE mycts;"
psql -U postgres -d mycts -f products.sql
```

---

## 7. 安全组

| 端口 | 用途 |
|---|---|
| 80 / 443 | 网站访问 |
| 5432 | 仅本机，不要对公网开放 |

Node 3000 端口只需本机访问，由 Nginx 反代即可。
