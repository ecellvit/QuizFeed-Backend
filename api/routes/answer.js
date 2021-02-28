const express = require('express');
const jwt = require('jsonwebtoken');
const mySql = require('mysql');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const { route } = require('./user');

//create connection Pool
const pool = mySql.createPool({
  host     : process.env.SQL_HOST,
  user     : process.env.SQL_USER,
  password : process.env.SQL_PASSWORD,
  database : process.env.SQL_DATABASE
});

router.post("/",checkAuth,(req,res,next)=>{
    
    if(!req.body.quiz_id)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(!req.body.question_ids)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(!req.body.answers)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(req.userData.access == "student")
    {
        pool.getConnection((err,con)=>{
            if(err)
            {
                res.status(500).json({
                    error:err,
                    message:"Db Connection Error"
                });
            }
            else
            {
                console.log("\nDatabase Connection Established Successfully");
                console.log("-----------------------------------------------");

                con.query("SELECT * FROM  student_attempted_quiz WHERE (p_id = ? AND quiz_id = ?)",[req.userData.p_id, req.body.quiz_id],(err,rows1,fields)=>{
                    if(err)
                    {
                        con.release();
                        return res.status(500).json({
                            error:err
                        });
                    }
                    else
                    {
                        if(rows1.length >= 1)
                        {
                            return res.status(400).json({
                                message:"Quiz already attempted by Student. Multiple attempts not allowed"
                            });
                        }
                        else
                        {
                            con.query("INSERT INTO student_attempted_quiz (p_id,quiz_id) VALUES (?,?)",[req.userData.p_id,req.body.quiz_id],(err,rows,fields)=>{
                                if(err)
                                {
                                    con.release();
                                    return res.status(500).json({
                                        error:err
                                    });
                                }
                                else
                                {
                                    let entry_data = [];
                                    for(var i=0;i<req.body.answers.length;i++)
                                    {
                                        let data=[];
                                        data.push(req.body.answers[i]);
                                        entry_data.push(data);
                                    }
            
                                    con.query("INSERT INTO answer_details (answer) VALUES ?",[entry_data],(err,rows,fields)=>{
                                        if(err)
                                        {
                                            con.release();
                                            return res.status(500).json({
                                                error:err
                                            });
                                        }
                                        else
                                        {
                                            con.query("SELECT answer_id FROM answer_details WHERE answer IN ?",[[req.body.answers]],(err,rows3,fields)=>{
                                                if(err)
                                                {
                                                    con.release();
                                                      return res.status(500).json({
                                                          error:err
                                                      });
                                                }
                                                else
                                                {
                                                    let answer_data = [];
                                                    for(var i=0;i<rows3.length;i++)
                                                    {
                                                        var data = [];
                                                        data.push(req.userData.p_id);
                                                        data.push(req.body.question_ids[i]);
                                                        data.push(rows3[i].answer_id);
                                                        answer_data.push(data);
                                                    }
            
                                                    con.query("INSERT INTO question_answer (p_id, question_id, answer_id) VALUES ?",[answer_data],(err,rows,fields)=>{
            
                                                        if(err)
                                                        {
                                                            con.release();
                                                            return res.status(500).json({
                                                                error:err
                                                            });
                                                        }
                                                        else
                                                        {
                                                            res.status(200).json({
                                                                message: "Answers Entered Successfully"
                                                            })
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });

                
            }
        });
    }
    else
    {
        res.status(500).json({
            message: "Unauthorized Access of Route"
        })
    }
});

module.exports = router;