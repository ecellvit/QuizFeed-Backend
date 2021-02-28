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

router.get("/createquiz",(req,res,next)=>{

      return res.status(404).json({
        Message:"No Get Request for /createquiz",
        Request:{
          type:"POST",
          url:"https://...../quiz/createquiz",
          expected_Data:{
            quizname:"quizname",
            questions:"Array of questions ['H1','H2']"
          },
         expected_returned_Data:{
           quiz_id:"quiz_id",
           url:"url to access quiz"
         }
        }
      });

});

router.get("/showAllQuizes",checkAuth,(req,res,next)=>{
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
                con.query("SELECT * FROM quiz_details",(err,rows,fields)=>{
                    if(err)
                    {
                        con.release();  // return the connection to pool
                        console.log("Error");
                        return res.status(500).json({
                            error:err
                        });
                    }
                    else
                    {
                        let quiz = {}
                        for(var i=0; i<rows.length; i++ )
                        {
                            quiz[rows[i].quiz_name] = rows[i].quiz_id;
                        }
                        res.status(200).json(quiz);
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

router.post("/createquiz",checkAuth,(req,res,next)=>{

    if(!req.body.quizname)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(!req.body.questions)
    {
        return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    if(req.userData.access == "teacher")
    {

      pool.getConnection((err,con) => {
          if(err)
          {
              console.log("Error");
              res.status(500).json({
                error:err,
                message:"Db Connection Error"
              });
          }
          else
          {
            console.log("\nDatabase Connection Established Successfully");
            console.log("-----------------------------------------------");

            con.query("INSERT INTO quiz_details (quiz_name) VALUES (?)",[req.body.quizname],(err,rows,fields) =>{
                if(err)
                {
                    con.release();  // return the connection to pool
                    console.log("Error");
                    return res.status(500).json({
                      error:err
                    });
                }
                else
                {
                    con.query("SELECT quiz_id FROM quiz_details WHERE quiz_name = ? ORDER BY quiz_id DESC",[req.body.quizname],(err,rows2,fields)=>{
                      if(err)
                      {
                          con.release();  // return the connection to pool
                          console.log("Error");
                          return res.status(500).json({
                            error:err
                          });
                      }
                      else
                      {
                          const quiz_id = rows2[0].quiz_id;
                          console.log(quiz_id);

                          let entry_data=[];
                          for(var i=0;i<req.body.questions.length;i++)
                          {
                             let data=[];
                             data.push(req.body.questions[i]);
                             entry_data.push(data);
                          }

                          con.query("INSERT INTO question_details (question) VALUES ?",[entry_data],(err,rows,fields)=>{
                              if(err)
                              {
                                  con.release();
                                  console.log("Error");
                                  return res.status(500).json({
                                      error:err
                                  });
                              }
                              else
                              {
                                  con.query("SELECT question_id FROM question_details WHERE question IN ?",[[req.body.questions]],(err,rows3,fields)=>{
                                      if(err)
                                      {
                                          con.release();
                                          return res.status(500).json({
                                              error:err
                                          });
                                      }
                                      else
                                      {
                                         let question_data = [];
                                         for(var i=0;i<rows3.length;i++)
                                         {
                                              var data = [];
                                              data.push(quiz_id);
                                              data.push(rows3[i].question_id);
                                              question_data.push(data);
                                         }

                                         con.query("INSERT INTO quiz_questions (quiz_id,question_id) VALUES ?",[question_data],(err,rows,fields)=>{
                                            if(err)
                                            {
                                              con.release();
                                              return res.status(500).json({
                                                  error:err
                                              });
                                            }
                                            else
                                            {
                                                con.query("INSERT INTO person_quiz (p_id,quiz_id) VALUES (?,?)",[req.userData.p_id,quiz_id],(err,rows,fields)=>{
                                                  if(err)
                                                  {
                                                      con.release();
                                                      return res.status(500).json({
                                                          error:err
                                                      });
                                                  }
                                                  else
                                                  {
                                                      con.release();  // return the connection to pool
                                                      res.status(200).json({
                                                          message:"Quiz Entered Successful",
                                                          quiz_id: quiz_id,
                                                          request:{
                                                            type:"POST",
                                                            url:"https://....../quiz/givequiz/"+quiz_id
                                                          }
                                                      });
                                                  }
                                                });
                                            }
                                         });
                                      }
                                  });
                              }
                          });

                      }
                    });

                }
            });
          }
      });

    }
    else
    {
        res.status(500).json({
            message:"Unauthorized access"
          });
    }
});

router.get("/getQuizName/:quizId",checkAuth,(req,res)=>{
        
    pool.getConnection((err,con)=>{
        if(err)
        {
            console.log("Error");
              res.status(500).json({
                error:err,
                message:"Db Connection Error"
              });
        }
        else
        {
            console.log("\nDatabase Connection Established Successfully");
            console.log("-----------------------------------------------");
            con.query("SELECT quiz_name FROM quiz_details WHERE quiz_id = ?",[req.params.quizId],(err,rows,fields)=>
            {
                if(err)
                {
                    con.release();
                    return res.status(500).json({
                            error:err
                            });
                }
                else
                {
                    res.json({
                        quiz_name : rows[0].quiz_name
                    })
                }
            });
        }
    });
});

router.get("/showAllCreatedQuizes",checkAuth,(req,res)=>
{
    if(req.userData.access == "teacher")
    {
        pool.getConnection((err,con)=>
        {
            if(err)
            {
              console.log("Error");
              res.status(500).json({
                error:err,
                message:"Db Connection Error"
              });
            }
            
            else
            {
                console.log("\nDatabase Connection Established Successfully");
                console.log("-----------------------------------------------");
                con.query("SELECT quiz_name, quiz_details.quiz_id FROM quiz_details JOIN person_quiz ON person_quiz.quiz_id = quiz_details.quiz_id WHERE p_id = ?",[req.userData.p_id],(err,rows,fields)=>
                {
                    if(err)
                    {
                        con.release();
                        return res.status(500).json({
                                error:err
                                });
                    }
                    else
                    {
                        let quiz = {}
                        for(var i=0; i<rows.length; i++ )
                        {
                            quiz[rows[i].quiz_name] = rows[i].quiz_id;
                        }
                        res.status(200).json(quiz);

                    }


                });
            }
        });
    }

    else
    {
        res.status(500).json({
            message:"Unauthorized Access"
        });
    }
});

router.get("/checkAccess",checkAuth,(req,res,next)=>{
    res.json({
        Access: req.userData.access
    });
});

router.get("/:quizId",checkAuth,(req,res,next)=>{
      pool.getConnection((err,con)=>{
          if(err)
          {
              console.log("Error");
              res.status(500).json({
                Error:err,
                message:"Db Connection Error"
              });
          }
          else
          {
              const sql = "SELECT quiz_name, quiz_details.quiz_id, question_details.question_id, question FROM quiz_details JOIN quiz_questions ON quiz_details.quiz_id = quiz_questions.quiz_id JOIN question_details ON quiz_questions.question_id = question_details.question_id WHERE quiz_details.quiz_id = "+req.params.quizId;
              con.query(sql,(err,rows,fields)=>{
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
                      if(rows.length > 0)
                      {
                          const quizname = rows[0].quiz_name;
                          const quizId = rows[0].quiz_id;
                          let questions = {};
                          for(var i=0;i<rows.length;i++)
                          {
                              questions[rows[i].question_id] = rows[i].question;
                          }
                          return res.status(200).json({
                              quiz_name: quizname,
                              quiz_id : quizId,
                              questions: questions
                          });
                      }
                      else
                      {
                          return res.status(409).json({
                              message: "FAILED: No Such Quiz"
                          });
                      }
                  }
              });
          }
      });
});



module.exports = router;
