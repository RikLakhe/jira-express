const getLatestSprint = (sprintArray) => {
  return sprintArray.reduce((prev, current) =>
    prev.id > current.id ? prev : current
  );
};

export const processIssues = (issueArray) => {
  let sprint = {};
  let totalSP = 0;
  let totalSPCompleted = 0;
  let totalSChange = 0;
  let totalSCreep = 0;

  issueArray.forEach((issue, index) => {
    if (issue.fields.customfield_10004) {
      totalSP += issue.fields.customfield_10004;

      if(issue.fields.resolutiondate){
        totalSPCompleted += issue.fields.customfield_10004;
      }

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
        let tempSprintData = getLatestSprint(issue.fields.customfield_10007);

        if (tempSprintData && tempSprintData.id in sprint) {
          sprint[tempSprintData.id].issues = [
            ...sprint[tempSprintData.id]?.issues,
            issue,
          ];
          sprint[tempSprintData.id].totalStoryPoint =
            sprint[tempSprintData.id].totalStoryPoint +
            issue.fields.customfield_10004;

            if(issue.fields.resolutiondate){
              sprint[tempSprintData.id].totalStoryPointComplete =
            sprint[tempSprintData.id].totalStoryPointComplete +
            issue.fields.customfield_10004;
            }

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
            totalStoryPointComplete: issue.fields.resolutiondate ? issue.fields.customfield_10004 : 0,
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
    totalSPCompleted
  };
};
