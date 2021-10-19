import express from "express"
import sprints from "./sprints"
import issues from "./issues"
import search from "./search"

var router = express.Router();

router.use("/sprints", sprints);
router.use("/issues", issues);
router.use("/search", search);

export default router;
