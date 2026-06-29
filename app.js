const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRouter = require("./routes/products");
const accountsRouter = require("./routes/accounts");

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
app.use("/api/accounts", accountsRouter);

app.use((req, res) => {
  res.status(404).json({message: "not found"});
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({message: "internal server error"});
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`API server listening on port ${port}`);
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(`端口 ${port} 已被占用，请先关闭其他 node 进程后再启动`);
    console.error("PowerShell 可执行: Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess");
  } else {
    console.error("API server failed to start:", error);
  }
  process.exit(1);
});

