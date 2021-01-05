const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const mySql = require("mysql");

//creating  DataBase connection
const con = mySql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
});

//connect to  DataBase
con.connect(function(err)
{
  if(err)
  {
      console.log("Error Connecting to Database: "+err);
  }
  else
  {
      console.log("Connected to Database: Successful");
  }
});

router.post("/signup",(req,res,next) =>{

    con.query("SELECT * FROM users WHERE email=?",[req.body.email],(err,rows,fields) =>{

        if(err)
        {
            console.log("Error");
            res.status(500).json({
              Error:err,
              Message:"SignUp Query Error"
            });
        }
        else
        {
            //if mail exists
            if(rows.length >= 1)
            {
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
                                console.log("Error");
                                return res.status(500).json({
                                  error:err
                                });
                            }
                            else
                            {
                                res.status(200).json({
                                    Message:"Signed Up Successful",
                                    Name: req.body.name,
                                    Email: req.body.email,
                                    Access: req.body.access,
                                    Request:{
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
});

router.post("/login",(req,res,next)=>{

      con.query("SELECT * FROM users WHERE email=?",[req.body.email],(err,rows,fields)=>{
        if(err)
        {
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
                return res.status(401).json({
                  message:"Auth Failed"
                });
            }
            //comparing passwords
            bcrypt.compare(req.body.password,rows[0].password,(error,result)=>{
                if(error)
                {
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

                    return res.status(200).json({
                        message:"Auth Successfull",
                        token:token
                    });
                }

                return res.status(401).json({
                    message:"Auth Failed"
                });
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
