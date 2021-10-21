import express from "express";
import jira from "../../jiraAPI";

var router = express.Router();

// getSprintIssues(boardId,spintId)

router.post("/", async function (req, res) {
  const { spintId, boardId } = req.body;

  let issues = [];
  let chunk_size = 100;

  while (true) {
    let chunkData = await jira
      .searchJira(
        `Sprint = ${spintId} order by resolutiondate ASC`,
        {
          startAt: issues.length,
          maxResults: chunk_size,
          fields: [
            "customfield_10004",
            "customfield_12315",
            "customfield_10007",
            "resolution", "resolutiondate"
          ],
        }
      )
      .catch((err) => {
        res.status(500).send(err);
      });

    issues = issues.concat(chunkData.issues);
    chunk_size = Math.abs(chunk_size - chunkData.total);
    if (issues.length >= chunkData.total) {
      break;
    }
  }

  await jira
    .getSprintIssues(boardId, spintId)
    .then(data => {
      res.status(200).send({contents: data.contents, issues: issues, sprint: data.sprint});
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

export default router;
