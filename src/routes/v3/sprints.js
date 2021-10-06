import express from 'express';
import jira from '../jiraClient';

const router = express.Router();

router.post('/', (req, res) => {
    const {sprintId} = req.body

    jira.sprint.getSprint({
        sprintId
    },(err,resp)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(resp);
        }
    })
})

router.post('/issues', (req, res) => {
    const {sprintId} = req.body

    jira.sprint.getSprintIssues({
        sprintId
    },(err,resp)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(resp);
        }
    })
})

export default router;