import { createServer } from "node:http";
import express, { Express } from "express";
import { initDatabase } from "./db";
import initRouter from "./router";
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // Allow all origins for development
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "timezone", "utc-offset"],
}));

const main = async () => {
  // Initialize the database connection
  await initDatabase();
  const server = createServer(app);

  // Initialize the router
  await initRouter(app);

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();