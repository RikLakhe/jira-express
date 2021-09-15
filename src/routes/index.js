import express from "express";

import projectRouter from './projects'
import boardRouter from './boards'
import sprintRouter from './sprints'

var router = express.Router();


router.use("/boards", boardRouter);
router.use("/projects", projectRouter);
router.use("/sprints", sprintRouter);

export default router;