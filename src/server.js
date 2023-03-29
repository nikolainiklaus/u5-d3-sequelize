import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { pgConnect } from "./db.js";
import productsRouter from "./products/index.js";

const server = express();
const port = process.env.PG_Port || 3001;

// Middleware
server.use(cors());
server.use(express.json());

// Endpoints
server.use("/products", productsRouter);
// Error handlers

await pgConnect();

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on ${port}`);
});
