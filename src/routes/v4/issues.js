import express from "express";
import jira from "../../jiraAPI";

var router = express.Router();

router.post("/", async function (req, res) {
  const { startDate, endDate, projectKey } = req.body;

  let sprint = {};
  let totalSP = 0;
  let totalSChange = 0;
  let totalSCreep = 0;
  let issues = [];
  let i = 0;
  let chunk_size = 100;
  let chunkData = undefined
  while (true) {
    chunkData = await jira
      .searchJira(
        `resolved >= ${startDate} AND resolved <= ${endDate} AND project = ${projectKey} AND resolution = Done ORDER BY cf[10004] DESC, created DESC`,
        {
          startAt: i,
          maxResults: chunk_size,
          fields: ["customfield_10004","customfield_12315","customfield_10007"]
        }
      )
      .catch((err) => {
        res.status(500).send(err);
      });

    i += 1;
    issues = issues.concat(chunkData.issues);
    chunk_size = Math.abs(chunkData.total - chunk_size);

    
    if (issues.length >= chunkData.total) {
      break;
    }
  }

  issues.forEach((issue,index) => {
    console.log("issue",issue.fields);
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
        let tempSprintData = issue.fields.customfield_10007[0];

        if(tempSprintData.id in sprint){
          sprint[tempSprintData.id].issues = [...sprint[tempSprintData.id]?.issues, issue];
          sprint[tempSprintData.id].totalStoryPoint = sprint[tempSprintData.id].totalStoryPoint + issue.fields.customfield_10004;

          if (
            issue.fields.customfield_12315 &&
            issue.fields.customfield_12315.length > 0
          ) {
            issue.fields.customfield_12315.map((scope) => {
              // Scope change calculation id:10931
              if (scope.id === "10931") {
                sprint[tempSprintData.id].scopeChange = issue.fields.customfield_10004 + (sprint[tempSprintData.id].scopeChange || 0);
              }
              // Scope creep calculation id:10932
              if (scope.id === "10932") {
                sprint[tempSprintData.id].scopeCreep = issue.fields.customfield_10004 + (sprint[tempSprintData.id].scopeCreep || 0);
              }
            });
          }
        }else{
          sprint[tempSprintData.id] = {
            ...tempSprintData,
            issues: [issue],
            scopeChange: 0,
            scopeCreep: 0,
            totalStoryPoint: (issue.fields.customfield_10004 || 0),
          };

          if (
            issue.fields.customfield_12315 &&
            issue.fields.customfield_12315.length > 0
          ) {
            issue.fields.customfield_12315.map((scope) => {
              // Scope change calculation id:10931
              if (scope.id === "10931") {
                sprint[tempSprintData.id].scopeChange = issue.fields.customfield_10004;
              }
              // Scope creep calculation id:10932
              if (scope.id === "10932") {
                sprint[tempSprintData.id].scopeCreep = issue.fields.customfield_10004;
              }
            });
          }
        
        }
      }
    }
  });

  console.log('here',chunk_size, chunkData.total,issues.length,sprint);
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
