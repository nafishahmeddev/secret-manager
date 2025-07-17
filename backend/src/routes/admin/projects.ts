import { Project } from "@app/db";
import { Router } from "express";
import bcrypt from "bcrypt";
const router = Router({
  mergeParams: true,
});
router.get("/", async (req, res) => {
  const projects = await Project.findAll({
    attributes: { exclude: ['secrets'] },
  });
  res.json({
    code: "SUCCESS",
    message: "Projects fetched successfully",
    result: projects,
  });
});

//create project
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({
      code: "ERROR",
      message: "Project name is required",
    });
  }
  const project = await Project.create({ name, description});
  res.status(201).json({
    code: "SUCCESS",
    message: `Project ${project.id} created successfully`,
    result: project,
  });
});


//get project by id
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  const project = await Project.findByPk(_id);
  if (project) {
    res.json({
      code: "SUCCESS",
      message: `Project ${_id} fetched successfully`,
      result: { ...project.toJSON(), secrets: undefined }, // Convert to JSON to avoid circular references
    });
  } else {
    res.status(404).json({
      code: "ERROR",
      message: "Project not found",
    });
  }
});



//update project
router.put("/:_id", async (req, res) => {
  const { _id } = req.params;
  const { name, description } = req.body;
  const project = await Project.findByPk(_id);
  if (!project) {
    return res.status(404).json({
      code: "ERROR",
      message: "Project not found",
    });
  }
  project.name = name || project.name;
  project.description = description || project.description;
  await project.save();
  res.status(200).json({
    code: "SUCCESS",
    message: `Project ${_id} updated successfully`,
    result: { ...project.toJSON(), secrets: undefined },
  });
});

router.delete("/:_id", async (req, res) => {
  const { _id } = req.params;
  const project = await Project.findByPk(_id);
  if (project) {
    await project.destroy();
    res.status(200).json({
      code: "SUCCESS",
      message: `Project ${_id} deleted successfully`,
      result: null,
    });
  } else {
    res.status(404).json({
      code: "ERROR",
      message: "Project not found",
    });
  }
});

//secrets routes
//get secrets by project id
router.get("/:_id/secrets", async (req, res) => {
  const { _id } = req.params;
  const project = await Project.findByPk(_id);
  if (project) {
    res.json({
      code: "SUCCESS",
      message: `Secrets for project ${_id} fetched successfully`,
      result: project.secrets || {},
    });
  } else {
    res.status(404).json({
      code: "ERROR",
      message: "Project not found",
    });
  }
});

//update secrets of a project
router.post("/:_id/secrets", async (req, res) => {
  const { _id } = req.params;
  const value: Record<string, string> = req.body;
  if (!value || typeof value !== 'object') {
    return res.status(400).json({
      code: "ERROR",
      message: "Invalid secrets format",
    });
  }
  const project = await Project.findByPk(_id);
  if (!project) {
    return res.status(404).json({
      code: "ERROR",
      message: "Project not found",
    });
  }
  // Update the secrets in the project
  project.secrets = value;
  await project.save();
  res.status(201).json({
    code: "SUCCESS",
    message: `Secrets for project ${_id} updated successfully`,
    result: project.secrets,
  });
});

//create api key for project
router.post("/:_id/regenerate-api-key", async (req, res) => {
  const { _id } = req.params;
  const project = await Project.findByPk(_id);
  if (!project) {
    return res.status(404).json({
      code: "ERROR",
      message: "Project not found",
    });
  }

  await project.generateApiSecret(); // Call the method to generate a new API key

  await project.save();
  res.status(201).json({
    code: "SUCCESS",
    message: `API key for project ${_id} created successfully`,
    result: project
  });
});

export default router;
