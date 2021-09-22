import express from 'express';
import jira from '../jiraClient';

const router = express.Router();

router.post('/', (req, res) => {
    const {startDate, endDate, boardId} = req.body;
    
    jira.board.getIssuesForBoard({
        boardId,
        maxResults: 1000,
    },(err,resp)=>{
        if(err){
            res.status(500).send(err);
        }else{
            let totalSP = 0;
            let temp = resp.issues.filter(issue=>{
                let checker = issue.fields.statuscategorychangedate >= startDate && issue.fields.statuscategorychangedate <= endDate
                if(checker){
                    if(issue.fields.customfield_10004){
                        totalSP += issue.fields.customfield_10004;
                    }
                }
                return checker;
            })
            res.status(200).send({
                issues: temp,
                totalSP: totalSP
            });
        }
    })
})

export default router;