const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRouter = require("./routes/products");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({status: "ok"});
});

app.use("/api/products", productsRouter);

app.use((req, res) => {
  res.status(404).json({message: "not found"});
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({message: "internal server error"});
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API server listening on port ${port}`);
});
