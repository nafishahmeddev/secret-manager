import { Project } from "@app/db";
import EncryptionUtils from "@app/utils/encryption";
import { Router, Request, Response, NextFunction } from "express";
const router = Router({
  mergeParams: true,
});

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) {
    return res.status(401).json({
      code: "ERROR",
      message: "API key is required",
    });
  }
  try {
    const decrypted = EncryptionUtils.decrypt(apiKey, process.env.API_ENCRYPTION_KEY  as string);
    const data = JSON.parse(decrypted);
    if (!data.id || !data.key) {
      return res.status(401).json({
        code: "ERROR",
        message: "Invalid API key",
      });
    }
    res.locals.project = data;
  } catch (error) {
    return res.status(401).json({
      code: "ERROR",
      message: "Invalid API key",
    });
  }
  // Middleware logic here
  next();
};
router.post("/:key", authenticate, async (req, res) => {
  const { key } = req.params;
  if (!key) {
    return res.status(400).json({
      code: "ERROR",
      message: "Project key is required",
    });
  }
  if(!res.locals.project || res.locals.project.key !== key) {
    return res.status(403).json({
      code: "ERROR",
      message: "Forbidden: Invalid project key",
    });
  }
  // Find the project by key
  const project = await Project.findOne({
    where: { key },
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
