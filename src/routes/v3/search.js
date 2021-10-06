import express from 'express';
import jira from '../../jiraClient';

const router = express.Router();

router.post('/', (req, res) => {
    const { startDate, endDate, projectKey } = req.body;
  
    let totalSP = 0;
    let totalSChange = 0;
    let totalSCreep = 0;
    let issues = [];
    let i = 0;
    let chunk_size = 100;

    jira.search.search({
        jql: `resolved >= ${startDate} AND resolved <= ${endDate} AND project = ${projectKey} AND resolution = Done ORDER BY cf[10004] DESC, created DESC`,
        startAt: 0,
        maxResults: 1000
      },(err,resp)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(resp);
        }
    })
})

export default router;