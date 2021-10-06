import express from "express"
import rapidView from "./rapidView"
import issues from "./issues"

var router = express.Router();

router.use("/rapidView", rapidView);
router.use("/issues", issues);

export default router;
