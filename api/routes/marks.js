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

router.post("/enter",checkAuth,(req,res)=>{
    
    if(!req.body.quiz_id)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(!req.body.p_id)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(!req.body.mark)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(req.userData.access == "teacher")
    {
        pool.getConnection((err,con)=>{
            if(err)
            {
                res.status(500).json({
                    error: err,
                    message: "Db Connection Error"
                });
            }
            else
            {
                con.query("SELECT * FROM quiz_mark WHERE (p_id = ? AND quiz_id = ?)",[req.body.p_id, req.body.quiz_id],(err,rows1,fields)=>{
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
                                message:"Marks for Quiz for this person already entered. Multiple attempts not allowed"
                            });
                        }
                        else
                        {
                            con.query("INSERT INTO mark_details (p_id, mark) VALUES (?,?)",[req.body.p_id,req.body.mark],(err,rows,fields)=>{
                                if(err)
                                {
                                    con.release();
                                    return res.status(500).json({
                                        error:err
                                    });
                                }   
                                else
                                {
                                    con.query("SELECT mark_id FROM mark_details WHERE (mark = ? AND p_id = ?)",[req.body.mark,req.body.p_id],(err,rows3,fields)=>{
                                        if(err)
                                        {
                                            con.release();
                                              return res.status(500).json({
                                                  error:err
                                              });
                                        }
                                        else
                                        {
                                            con.query("INSERT INTO quiz_mark (p_id, quiz_id, mark_id) VALUES (?,?,?)",[req.body.p_id,req.body.quiz_id,rows3[0].mark_id],(err,rows,fields)=>{
                                                if(err)
                                                {
                                                    con.release();
                                                    return res.status(500).json({
                                                        error:err
                                                    });
                                                }
                                                else
                                                {
                                                    con.release();
                                                    res.status(200).json({
                                                        message: "Mark Entered Successfully"
                                                    })
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

router.get("/getStudentMarks",checkAuth,(req,res)=>{
    pool.getConnection((err,con)=>{
        if(err)
        {
            res.status(500).json({
                error: err,
                message: "Db Connection Error"
            });
        }
        else
        {
            con.query("SELECT quiz_id, mark FROM quiz_mark JOIN mark_details ON quiz_mark.mark_id = mark_details.mark_id WHERE quiz_mark.p_id = ?",[req.userData.p_id],(err,rows,fields)=>{
                if(err)
                {
                    con.release();
                    return res.status(500).json({
                        error:err
                    });   
                }
                else
                {
                    let data = {};
                    for(var i = 0;i<rows.length;i++)
                    {
                        data[rows[i].quiz_id]= rows[i].mark;
                    }
                    con.release();
                    return res.status(200).json({
                         all_marks: data
                    }); 
                }
            });
        }   
    });
});

router.post("/getStudentMarksByPID",checkAuth,(req,res)=>{
    if(!req.body.p_id)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }
    if(req.userData.access == "teacher")
    {
        pool.getConnection((err,con)=>{
            if(err)
            {
                res.status(500).json({
                    error: err,
                    message: "Db Connection Error"
                });
            }
            else
            {
                con.query("SELECT quiz_id, mark FROM quiz_mark JOIN mark_details ON quiz_mark.mark_id = mark_details.mark_id WHERE quiz_mark.p_id = ?",[req.body.p_id],(err,rows,fields)=>{
                    if(err)
                    {
                        con.release();
                        return res.status(500).json({
                            error:err
                        });   
                    }
                    else
                    {
                        let data = {};
                        for(var i = 0;i<rows.length;i++)
                        {
                            data[rows[i].quiz_id]= rows[i].mark;
                        }
                        con.release();
                        return res.status(200).json({
                            all_marks: data
                        }); 
                    }
                });
            }   
        });
    }
});



module.exports = router;