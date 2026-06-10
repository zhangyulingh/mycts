-- PostgreSQL 建表脚本

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  barcode VARCHAR(100) NOT NULL UNIQUE,
  product_name VARCHAR(200) DEFAULT '',
  model VARCHAR(100) DEFAULT '',
  power VARCHAR(100) DEFAULT '',
  specification VARCHAR(500) DEFAULT '',
  speed_control VARCHAR(100) DEFAULT '',
  speed_type VARCHAR(100) DEFAULT '',
  color VARCHAR(100) DEFAULT '',
  weight VARCHAR(100) DEFAULT '',
  packaging VARCHAR(200) DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

COMMENT ON TABLE products IS '条码产品追溯表';
COMMENT ON COLUMN products.barcode IS '条码编号';
COMMENT ON COLUMN products.product_name IS '产品名称';
COMMENT ON COLUMN products.model IS '型号';
COMMENT ON COLUMN products.power IS '功率';
COMMENT ON COLUMN products.specification IS '规格';
COMMENT ON COLUMN products.speed_control IS '调速方式';
COMMENT ON COLUMN products.speed_type IS '转速方式';
COMMENT ON COLUMN products.color IS '颜色';
COMMENT ON COLUMN products.weight IS '重量';
COMMENT ON COLUMN products.packaging IS '包装';
