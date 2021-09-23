import express from "express";
import jira from "../jiraAPI";

var router = express.Router();

// "customfield_10004": 8 (aka Story point)
// "customfield_12315": [
//     {
//         "self": "https://lftechnology.atlassian.net/rest/api/2/customFieldOption/10931",
//         "value": "Scope Change",
//         "id": "10931"
//     },
//     {
//         "self": "https://lftechnology.atlassian.net/rest/api/2/customFieldOption/10932",
//         "value": "Scope Creep",
//         "id": "10932"
//     }
// ],

router.post("/", async function (req, res) {
  const { startDate, endDate, projectKey } = req.body;

  let totalSP = 0;
  let totalSChange = 0;
  let totalSCreep = 0;
  let issues = [];
  let i = 0;
  let chunk_size = 100;

  while (true) {
    let chunkData = await jira
      .searchJira(
        `resolved >= ${startDate} AND resolved <= ${endDate} AND project = ${projectKey} AND resolution = Done ORDER BY cf[10004] DESC, created DESC`,
        {
          startAt: i,
          maxResults: chunk_size,
        }
      )
      .catch((err) => {
        res.status(500).send(err);
      });

    chunkData.issues.forEach((issue) => {
      if (issue.fields.customfield_10004) {
        totalSP += issue.fields.customfield_10004;

        if (
          issue.fields.customfield_12315 &&
          issue.fields.customfield_12315.length > 0
        ) {
          issue.fields.customfield_12315.map((scope) => {
            // Scope change calculation id:10931
            if (scope.id === "10931") {
              totalSChange += issue.fields.customfield_10004;
            }
            // Scope creep calculation id:10932
            if (scope.id === "10932") {
              totalSCreep += issue.fields.customfield_10004;
            }
          });
        }
      }
    });

    i += 1;
    issues = issues.concat(chunkData.issues);
    chunk_size = chunkData.total - chunk_size;
    if (issues.length >= chunkData.total) {
      break;
    }
  }
  res.status(200).send({
    total: issues.length,
    totalSP,
    totalSChange,
    totalSCreep,
    issues,
  });
});

export default router;
