import express from "express";
import jira from "../../jiraAPI";

var router = express.Router();

// getSprintIssues(boardId,spintId)

router.post("/", async function (req, res) {
  const { boardId, spintId } = req.body;

  await jira
    .getSprintIssues(boardId, spintId)
    .then(data => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

export default router;
