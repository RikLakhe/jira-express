import express from "express";
import bodyParser from "body-parser"
import cors from 'cors'
import path from 'path'

const app = express();

const port = process.env.PORT || "3001";

app.use(
    // logger('dev'),
    cors({
        exposedHeaders: 'XSRF-TOKEN',
    }),
    express.json(),
    express.static(path.resolve(__dirname, '../', 'app', 'build'))
)

app.get('/api', (request, response) => {
    response.json({info: 'Company server up and running !!!!'})
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../','app', 'build', 'index.html'));
    // res.sendFile(path.join(__dirname, "testST", "index.html"));s
  });

// app.use(function (err, req, res, next) {
    // const error = buildError(err);
    // res.status(error.code).json({error});
// });


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})