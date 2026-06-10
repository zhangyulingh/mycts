#!/bin/bash
# 在阿里云 ECS（Alibaba Cloud Linux 2）安装 PostgreSQL，与现有 MySQL 共存
# 用法：sudo bash setup-postgresql.sh '你的强密码'

set -e

DB_PASS="${1:-}"
if [ -z "$DB_PASS" ]; then
  echo "用法: sudo bash setup-postgresql.sh '数据库密码'"
  exit 1
fi

echo "==> 安装 PostgreSQL..."
yum install -y postgresql-server postgresql-contrib

if [ ! -f /var/lib/pgsql/data/PG_VERSION ]; then
  postgresql-setup initdb
fi

systemctl enable postgresql
systemctl start postgresql

echo "==> 创建用户和数据库..."
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'mycts_user') THEN
    CREATE USER mycts_user WITH PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE mycts OWNER mycts_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mycts')\gexec
GRANT ALL PRIVILEGES ON DATABASE mycts TO mycts_user;
SQL

echo "==> 允许本机密码登录..."
PG_HBA="/var/lib/pgsql/data/pg_hba.conf"
if ! grep -q "127.0.0.1/32.*mycts\|127.0.0.1/32.*md5\|127.0.0.1/32.*scram" "$PG_HBA"; then
  echo "host    all             all             127.0.0.1/32            md5" >> "$PG_HBA"
fi
systemctl restart postgresql

echo "==> PostgreSQL 就绪。MySQL(3306) 不受影响，PostgreSQL 监听 5432 仅本机。"
echo "下一步: psql -h 127.0.0.1 -U mycts_user -d mycts -f products.sql"
