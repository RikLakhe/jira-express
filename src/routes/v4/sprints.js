import express from "express";
import * as sprintService from "../../service/sprint";

var router = express.Router();

router.post("/", async function (req, res) {
  const { spintId } = req.body;
  let responseData = {}
  let totalSp = 0
  let completedSp = 0
  let remainingSp = 0
  let completedKeys = []
  let remainingKeys = []
  let sprint = await sprintService.getSprintDetails(spintId);
  let issues = await sprintService.getAllIssueOfSprint(spintId);
  if (sprint.status != 200) {
    res.status(500).send(sprint)
  }
  if (issues.status != 200) {
    res.status(500).send(issues)
  }
  responseData.sprint = sprint.data
  responseData.issues = issues.data
  issues.data.issues.map(item => {
    totalSp += (item.fields.customfield_10004 ?? 0)
    if (item.fields.status.name === "Done") {
      completedSp += (item.fields.customfield_10004 ?? 0)
      completedKeys.push(item.key)
    } else {
      remainingSp += (item.fields.customfield_10004 ?? 0)
      remainingKeys.push(item.key)
    }
    console.log(`${item.key}:${item.fields.status.name}`)
  })
  responseData.totalSp = totalSp
  responseData.completedSp = completedSp
  responseData.remainingSp = remainingSp
  responseData.completedKeys = completedKeys
  responseData.remainingKeys = remainingKeys
  res.status(200).send(responseData)
})



export default router;
