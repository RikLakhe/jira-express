import express from "express";
import jira from "../../jiraClient";
import { processIssues } from "../../utils/commonUtils";

var router = express.Router();

router.post("/", async function (req, res) {
  const { startDate, endDate, projectKey } = req.body;

  let issues = [];
  let chunk_size = 100;

  while (true) {
    let chunkData = await jira.issueSearch.searchForIssuesUsingJqlPost({jql: `created >= ${startDate} AND created <= ${endDate} AND project = ${projectKey} ORDER BY cf[10004] DESC, created DESC`, maxResults: chunk_size, startAt: issues.length, 
    fields: ["customfield_10004",
        "customfield_12315",
        "customfield_10007",
        "resolution", "resolutiondate"] }
      ,
        // `resolved >= ${startDate} AND resolved <= ${endDate} AND project = ${projectKey} AND resolution = Done ORDER BY cf[10004] DESC, created DESC`,
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

  const { sprint, totalSP, totalSChange, totalSCreep, totalSPCompleted } = processIssues(issues);

  res.status(200).send({
    total: issues.length,
    totalSP,
    totalSPCompleted,
    totalSChange,
    totalSCreep,
    sprint,
    issues,
  });
});

export default router;
