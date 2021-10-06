import express from "express";
import jira from "../../jiraClient";

import projectRouter from './projects'
import boardRouter from './boards'
import issuesRouter from './issues'
import searchRouter from './search'

var router = express.Router();

router.get("/", function (req, res) {
  const { boardId, sprintId } = req.query;

  jira.board.getIssuesForSprint(
    {
      boardId,
      sprintId,
      maxResults: 100,
    },
    (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resp);
      }
    }
  );
});

router.use("/projects", projectRouter);
router.use("/boards", boardRouter);
router.use("/issues", issuesRouter);
router.use("/search", searchRouter);

export default router;
