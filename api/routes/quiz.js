const express = require('express');
const jwt = require('jsonwebtoken');
const mySql = require('mysql');
const router = express.Router();

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

router.post("/createquiz",(req,res,next)=>{

      pool.getConnection((err,con) => {
          if(err)
          {
              console.log("Error");
              res.status(500).json({
                Error:err,
                Message:"Db Connection Error"
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
                          console.log(entry_data);

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
                                                con.release();  // return the connection to pool
                                                res.status(200).json({
                                                    Message:"Quiz Entered Successful",
                                                    quiz_id: quiz_id,
                                                    Request:{
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
});



module.exports = router;
