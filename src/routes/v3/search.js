import express from "express";
import jira from "../../jiraClient";

const router = express.Router();

const getResolvedSprint = (sprintArray) =>
  sprintArray.reduce((prev, current) =>
    prev.id > current.id ? prev : current
  );

const processIssues = (issueArray) => {
  let sprint = {};
  let totalSP = 0;
  let totalSChange = 0;
  let totalSCreep = 0;

  issueArray.forEach((issue, index) => {
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

      if (
        issue.fields.customfield_10007 &&
        issue.fields.customfield_10007.length > 0
      ) {
        // Get Last resolved sprint
        let tempSprintData = getResolvedSprint(issue.fields.customfield_10007);

        if (tempSprintData.id in sprint) {
          sprint[tempSprintData.id].issues = [
            ...sprint[tempSprintData.id]?.issues,
            issue,
          ];
          sprint[tempSprintData.id].totalStoryPoint =
            sprint[tempSprintData.id].totalStoryPoint +
            issue.fields.customfield_10004;

          if (
            issue.fields.customfield_12315 &&
            issue.fields.customfield_12315.length > 0
          ) {
            issue.fields.customfield_12315.map((scope) => {
              // Scope change calculation id:10931
              if (scope.id === "10931") {
                sprint[tempSprintData.id].scopeChange =
                  issue.fields.customfield_10004 +
                  (sprint[tempSprintData.id].scopeChange || 0);
              }
              // Scope creep calculation id:10932
              if (scope.id === "10932") {
                sprint[tempSprintData.id].scopeCreep =
                  issue.fields.customfield_10004 +
                  (sprint[tempSprintData.id].scopeCreep || 0);
              }
            });
          }
        } else {
          sprint[tempSprintData.id] = {
            ...tempSprintData,
            issues: [issue],
            scopeChange: 0,
            scopeCreep: 0,
            totalStoryPoint: issue.fields.customfield_10004 || 0,
          };

          if (
            issue.fields.customfield_12315 &&
            issue.fields.customfield_12315.length > 0
          ) {
            issue.fields.customfield_12315.map((scope) => {
              // Scope change calculation id:10931
              if (scope.id === "10931") {
                sprint[tempSprintData.id].scopeChange =
                  issue.fields.customfield_10004;
              }
              // Scope creep calculation id:10932
              if (scope.id === "10932") {
                sprint[tempSprintData.id].scopeCreep =
                  issue.fields.customfield_10004;
              }
            });
          }
        }
      }
    }
  });

  return {
    sprint,
    totalSP,
    totalSChange,
    totalSCreep,
  };
};

router.post("/", async (req, res) => {
  const { startDate, endDate, projectKey } = req.body;

  let issues = [];
  let chunk_size = 100;

  while (true) {
    let chunkData = await jira.search.search({
      method: "POST",
      jql: `resolved >= ${startDate} AND resolved <= ${endDate} AND project = ${projectKey} AND resolution = Done ORDER BY cf[10004] ASC`,
      startAt: issues.length,
      maxResults: chunk_size,
      fields: ["customfield_10004", "customfield_12315", "customfield_10007"],
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
