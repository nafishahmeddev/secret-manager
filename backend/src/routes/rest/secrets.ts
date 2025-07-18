import { Project } from "@app/db";
import { Router } from "express";
const router = Router({
  mergeParams: true,
});


router.post("/:key", async (req, res) => {
  const apiSecret = req.headers['x-api-key'] as string;
  if (!apiSecret) {
    return res.status(401).json({
      code: "ERROR",
      message: "API key is required",
    });
  }
  const { key } = req.params;
  if (!key) {
    return res.status(400).json({
      code: "ERROR",
      message: "Project key is required",
    });
  }

  // Find the project by key
  const project = await Project.findOne({
    where: { key, apiSecret: apiSecret },
    attributes: ["secrets"],
  })
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
