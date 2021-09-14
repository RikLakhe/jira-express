import "@babel/polyfill";
import "dotenv/config";

import express from "express";
import logger from "morgan";
import cors from 'cors'
import path from 'path'

const app = express();

const port = process.env.PORT || "3001";

app.use(
    logger('dev'),
    cors({
        exposedHeaders: 'XSRF-TOKEN',
    }),
    express.static(path.resolve(__dirname,'..','jira-client','build'))
)

app.get('/api', (request, response) => {
    response.json({info: 'Company server up and running !!!!'})
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'..' ,'jira-client','build', 'index.html'));
  });


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})