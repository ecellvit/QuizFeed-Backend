const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const mySql = require("mysql");

//creating  Pooling DataBase connection

const pool = mySql.createPool({
  host     : process.env.SQL_HOST,
  user     : process.env.SQL_USER,
  password : process.env.SQL_PASSWORD,
  database : process.env.SQL_DATABASE
});

router.get("/signup",(req,res,next)=>{
      res.status(404).json({
      error:"REQUEST FAILED",
      message:"No GET Request for user/Signup. Refer Documentation",
      request:{
        type :"POST",
        url:"https://...../user/signup"
      }
    });

});

router.post("/signup",(req,res,next) =>{

    if(!req.body.name)
    {
      return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        });
    }
    if(!req.body.email)
    {
      return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }
    if(!req.body.password)
    {
      return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }
    if(!req.body.access)
    {
      return res.status(400).json({
            Message: "Required Data to be Sent Missing Please Refer Documentation"
        })
    }

    //connectiong to database and returning back connection as con
    pool.getConnection((err,con) =>{
        if(err)
        {
          console.log("Error");
          res.status(500).json({
            error:err,
            message:"DB Connection Error"
          });
        }
        else
        {
          console.log("\nDatabase Connection Established Successfully");
          console.log("-----------------------------------------------");
          con.query("SELECT * FROM users WHERE email=?",[req.body.email],(err,rows,fields) =>{

              if(err)
              {
                  con.release();  // return the connection to pool
                  console.log("Error");
                  res.status(500).json({
                    error:err,
                    message:"SignUp Query Error"
                  });
              }
              else
              {
                  //if mail exists
                  if(rows.length >= 1)
                  {
                      con.release();  // return the connection to pool
                      return res.status(409).json({
                            message:"Mail exists"
                        });
                  }

                  else
                  {
                      //Hashing password using bcrypt
                      bcrypt.hash(req.body.password,10,(err,hash)=>{
                          if(err)
                          {
                              con.release();  // return the connection to pool
                              return res.status(500).json({
                                error:err
                              });
                          }
                          else
                          {
                              //Insert Data to Database
                              con.query("INSERT INTO users (name,email,password,access) values(?,?,?,?)",[req.body.name,req.body.email,hash,req.body.access],(err,rows,fields) => {
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
                                      con.release();  // return the connection to pool
                                      res.status(200).json({
                                          message:"Signed Up Successful",
                                          name: req.body.name,
                                          email: req.body.email,
                                          access: req.body.access,
                                          request:{
                                            type:"POST",
                                            url:"https://localhost:3000/user/login"
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


});


router.get("/login",(req,res,next)=>{
      res.status(404).json({
      Error:"REQUEST FAILED",
      Message:"No GET Request for user/login. Refer Documentation",
      Request:{
        Type :"POST",
        url:"https://...../user/login"
      }
    });

});

router.post("/login",(req,res,next)=>{
      if(!req.body.email)
      {
        return res.status(400).json({
              Message: "Required Data to be Sent Missing Please Refer Documentation"
          })
      }
      if(!req.body.password)
      {
        return res.status(400).json({
              Message: "Required Data to be Sent Missing Please Refer Documentation"
          })
      }

      pool.getConnection((err,con)=>{
          if(err)
          {
              console.log("Error");
              res.status(500).json({
                Error:err,
                Message:"DB Connection Error"
              });
          }
          else
          {
            console.log("\nDatabase Connection Established Successfully");
            console.log("-----------------------------------------------");
            con.query("SELECT * FROM users WHERE email=?",[req.body.email],(err,rows,fields)=>{
              if(err)
              {
                  con.release();  // return the connection to pool
                  console.log("Error");
                  res.status(500).json({
                    Error:err,
                    Message:"Login Query Error"
                  });
              }
              else
              {
                  if(rows.length<1)
                  {
                      con.release();  // return the connection to pool
                      return res.status(401).json({
                        message:"Auth Failed"
                      });
                  }
                  //comparing passwords
                  bcrypt.compare(req.body.password,rows[0].password,(error,result)=>{
                      if(error)
                      {
                          con.release();  // return the connection to pool
                          return res.status(401).json({
                            message:"Auth Failed"
                          });
                      }

                      if(result)
                      {
                          //create token(payload,key,options)
                          const token = jwt.sign(
                            {
                               name: rows[0].name,
                               email: rows[0].email,
                               p_id: rows[0].p_id,
                               access:rows[0].access
                            },
                            process.env.JWT_KEY,
                            {
                              expiresIn:"1h"
                            }
                          );
                          con.release();  // return the connection to pool
                          return res.status(200).json({
                              message:"Auth Successfull",
                              name:rows[0].name,
                              access:rows[0].access,
                              token:token
                          });
                      }

                      con.release();  // return the connection to pool
                      return res.status(401).json({
                          message:"Auth Failed"
                          });
                  });

              }
            });

          }
      });

});


router.delete("/:userId",(req,res,next) =>{
    res.status(200).json({
        Message:"User Delete user id: "+req.params.userId
    });
});

module.exports = router;
