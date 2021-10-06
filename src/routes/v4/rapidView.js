import express from "express";
import jira from "../../jiraAPI";

var router = express.Router();

router.get("/", async function (req, res) {
  const { projectKey } = req.query;
  console.log(`/rapidView/${projectKey}`, projectKey);
  let chunkData = await jira
      .findRapidView(projectKey)
      .then((data) => {
        console.log(data);
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });

      console.log(chunkData);
});

export default router;
