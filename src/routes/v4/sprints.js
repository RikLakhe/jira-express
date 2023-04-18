import express from "express";
import jira from "../../jiraClient";
import jiraAPI from '../../jiraAPI';
import jiraConnector from "../../jiraConnector";

var router = express.Router();

// getSprintIssues(boardId,spintId)

router.post("/", async function (req, res) {
  const { spintId, boardId } = req.body;

  let issues = [];
  let chunk_size = 100;

  while (true) {
    let chunkData = await jira
      .issueSearch.searchForIssuesUsingJqlPost( 
        {jql:`Sprint = ${spintId} order by resolutiondate ASC`, maxResults: chunk_size, startAt: issues.length, 
        fields: ["customfield_10004",
        "customfield_12315",
        "customfield_10007",
        "resolution", "resolutiondate"] }
      ,
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

const jql = `Sprint=${spintId} and board=${boardId}`;


  await jira.issueSearch.searchForIssuesUsingJqlPost({jql, fields: ['summary', 'contents', 'sprint', 'status'] })
    .then(data => {
      res.status(200).send({contents: data.contents, issues: issues, sprint: data.sprint});
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

export default router;
