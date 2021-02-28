require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoutes = require("./api/routes/user");
const quizRoutes = require("./api/routes/quiz");
const answerRoutes = require("./api/routes/answer");
const marksRoutes = require("./api/routes/marks");

const app = express();

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//adding required headers to prevent CORS(Cross Origin Resourse Sharin) Error
app.use((req,res,next)=>
{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method === "OPTIONS")
    {
        res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle Requests
app.use('/user',userRoutes);
app.use('/quiz',quizRoutes);
app.use('/answer',answerRoutes);
app.use('/marks', marksRoutes);

app.get("/",(req,res)=>{
    res.send("QUIZFEED API: REFER TO DOCUMENTATION FOR USAGE");
});

app.listen(port,()=>{
    console.log("Server Up and Running at 3000");
});
