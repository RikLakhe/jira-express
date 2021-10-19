import express from "express";
import jira from "../../jiraAPI";
import { processIssues } from "../../utils/commonUtils";

var router = express.Router();

router.post("/", async function (req, res) {
  const { startDate, endDate, projectKey } = req.body;

  let issues = [];
  let chunk_size = 100;

  while (true) {
    let chunkData = await jira
      .searchJira(
        `resolved >= ${startDate} AND resolved <= ${endDate} AND project = ${projectKey} AND resolution = Done ORDER BY cf[10004] DESC, created DESC`,
        {
          startAt: issues.length,
          maxResults: chunk_size,
          fields: [
            "customfield_10004",
            "customfield_12315",
            "customfield_10007",
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

  const { sprint, totalSP, totalSChange, totalSCreep } = processIssues(issues);

  res.status(200).send({
    total: issues.length,
    totalSP,
    totalSChange,
    totalSCreep,
    sprint,
    issues,
  });
});

export default router;
