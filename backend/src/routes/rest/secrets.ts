import { Project } from "@app/db";
import { Request, Response, Router } from "express";
const router = Router({
  mergeParams: true,
});


router.post("/:key", async (req: Request, res: Response) => {
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
    attributes: ["secrets", "allowedIps"],
  })

  if (!project) {
    return res.status(404).json({
      code: "ERROR",
      message: "Project not found or API key is invalid",
    });
  }
  //check ip
  const ip  = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("IP Address:", ip);
  console.log("Allowed IPs:", project.allowedIps);
  if (project.allowedIps && project.allowedIps.length > 0 && !project.allowedIps.includes(ip as string)) {
    return res.status(403).json({
      code: "ERROR",
      message: "Access denied",
    });
  }
  const secrets = project.secrets || {};

  return res.json({
    code: "SUCCESS",
    message: `Secrets fetched successfully`,
    result: secrets,
  });

});
export default router;
