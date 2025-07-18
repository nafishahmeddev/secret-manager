import { Router } from "express";
import ProjectsRouter from "./projects";
import AuthMiddleware from "@app/middleware/auth";

const router   = Router(
  {
    mergeParams: true,
  }
)

router.use(AuthMiddleware);

router.use("/projects", ProjectsRouter);

const AdminRouter = router;
export default AdminRouter;