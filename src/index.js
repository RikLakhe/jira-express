import "@babel/polyfill";
import "dotenv/config";

import express from "express";
import logger from "morgan";
import cors from 'cors'
import path from 'path'

import indexRouter from "./routes/index";
import v2Router from "./routes/v2";
import v3Router from "./routes/v3";

const app = express();

const port = process.env.PORT || "3001";

app.use(
    logger('dev'),
    cors(),
    express.urlencoded(),
    express.json(),
    express.static(path.resolve(__dirname,'..','jira-client','build'))
)
app.disable('etag');

app.use('/api', indexRouter)
app.use('/api/v2', v2Router)
app.use('/api/v3', v3Router)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'..' ,'jira-client','build', 'index.html'));
  });

app.use((req,res,next)=>{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error:{
            message:err.message
        }
    })
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})