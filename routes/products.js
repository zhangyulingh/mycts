const express = require("express");
const pool = require("../db");

const router = express.Router();

const PRODUCT_FIELDS = [
  "barcode",
  "product_name",
  "model",
  "power",
  "specification",
  "speed_control",
  "speed_type",
  "color",
  "weight",
  "packaging",
];

function normalizeProduct(input) {
  const product = {};
  for (const field of PRODUCT_FIELDS) {
    product[field] = input[field] == null ? "" : String(input[field]).trim();
  }
  return product;
}

function validateProduct(product) {
  if (!product.barcode) return "barcode is required";
  return "";
}

function isDuplicateBarcodeError(error) {
  return error && error.code === "23505";
}

router.post("/", async (req, res, next) => {
  try {
    const product = normalizeProduct(req.body || {});
    const validationError = validateProduct(product);

    if (validationError) {
      return res.status(400).json({message: validationError});
    }

    const placeholders = PRODUCT_FIELDS.map((_, index) => `$${index + 1}`).join(", ");
    const values = PRODUCT_FIELDS.map((field) => product[field]);

    const {rows} = await pool.query(
      `INSERT INTO products (${PRODUCT_FIELDS.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    if (isDuplicateBarcodeError(error)) {
      return res.status(409).json({message: "barcode already exists"});
    }
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 10000) : 20;

    const {rows} = await pool.query("SELECT * FROM products ORDER BY created_at DESC LIMIT $1", [limit]);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.get("/:barcode", async (req, res, next) => {
  try {
    const {rows} = await pool.query("SELECT * FROM products WHERE barcode = $1 LIMIT 1", [req.params.barcode]);

    if (rows.length === 0) {
      return res.status(404).json({message: "product not found"});
    }

    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.put("/:barcode", async (req, res, next) => {
  try {
    const product = normalizeProduct({...req.body, barcode: req.body?.barcode || req.params.barcode});
    const validationError = validateProduct(product);

    if (validationError) {
      return res.status(400).json({message: validationError});
    }

    const assignments = PRODUCT_FIELDS.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = [...PRODUCT_FIELDS.map((field) => product[field]), req.params.barcode];

    const {rows} = await pool.query(
      `UPDATE products SET ${assignments} WHERE barcode = $${PRODUCT_FIELDS.length + 1} RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({message: "product not found"});
    }

    return res.json(rows[0]);
  } catch (error) {
    if (isDuplicateBarcodeError(error)) {
      return res.status(409).json({message: "barcode already exists"});
    }
    return next(error);
  }
});

router.delete("/:barcode", async (req, res, next) => {
  try {
    const {rowCount} = await pool.query("DELETE FROM products WHERE barcode = $1", [req.params.barcode]);

    if (!rowCount) {
      return res.status(404).json({message: "product not found"});
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
