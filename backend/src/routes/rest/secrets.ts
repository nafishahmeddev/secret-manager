import { Project } from "@app/db";
import { Router } from "express";
const router = Router({
  mergeParams: true,
});
router.get("/:key", async (req, res) => {
  const { key } = req.params;
  const project = await Project.findByPk(key);
  if (project) {
    const secrets = project.secrets || {};
    res.json({
      code: "SUCCESS",
      message: `Secrets fetched successfully`,
      result: secrets,
    });
  } else {
    res.status(404).json({
      code: "ERROR",
      message: "Project not found",
    });
  }
});
export default router;
