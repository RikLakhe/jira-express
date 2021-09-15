import express from "express";
import {jira2} from "../jiraClient"

var router = express.Router();

router.post("/", function(req, res) {
    const {issueNumber} = req.body

    jira2.findIssue(issueNumber)
    .then(issue => {
        res.status(200).send(issue);
      })
      .catch(err => {
        res.status(500).send(err);
      });
})

// findRapidView
router.post("/rapid", function(req, res) {
    const {projectName} = req.body

    jira2.findRapidView(projectName)
    .then(issue => {
        console.log(issue);
        res.status(200).send(issue);
      })
      .catch(err => {
        res.status(500).send(err);
      });
})


export default router;