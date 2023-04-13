import express from 'express';
import jira from '../../jiraClient';

const router = express.Router();

router.get('/', (req, res) => {
    jira.projects.getAllProjects({
        maxResults: 500
    },(err,resp)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(resp);
        }
    })
})

export default router;