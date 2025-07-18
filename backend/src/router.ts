import { Express } from "express";
import AdminRouter from "./routes/admin";
import SecretRouter from "./routes/rest/secrets";
import express from "express";
import path from "path";
import AuthRouter from "./routes/auth";



export default async function initRouter(app: Express) {
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/admin", AdminRouter);
  app.use("/api/v1/rest/secrets", SecretRouter);


  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

}
