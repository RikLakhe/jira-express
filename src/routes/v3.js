import express from "express";
import jira from "../jiraClient";

var router = express.Router();

router.get("/", function (req, res) {
  const { boardId, sprintId } = req.query;

  console.log(`[v3] /board/${boardId}/sprint/${sprintId}`);

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

export default router;
