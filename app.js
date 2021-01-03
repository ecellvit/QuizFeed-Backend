const express = require("express"); //acquire express
const bodyParser = require("body-parser"); //acquire bodyParser
const mySql = require("mysql");
const bcrypt =  require("bcrypt");

const saltRounds = 10;

const app = express(); //initialize express
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //static pages
app.set("view engine","ejs"); //ejs view

//creating connection
var con = mySql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"quizfeed"
});

con.connect(function(err) //connect to db
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

app.get("/", function(req,res)
{
    res.render("login",{Name:"Rehaan"});
});

app.post("/", function(req,res)
{
    con.query("SELECT * FROM users WHERE email=?",[req.body.email],function(error,rows,fields)
    {
        if(error)
        {
            console.log("Error3");
        }
        else
        {
            if(rows.length===0)
            {
                console.log("Incorrect Username or Password 1");
                res.redirect("/");
            }
            else
            {
                bcrypt.compare(req.body.password,rows[0].password,function(err,result)
                {
                    if(err)
                    {
                        console.log("Error Comparing Hashed Password from database: "+err);
                    }
                    else if(result)
                    {
                        res.render("dashboard_student");
                    }
                    else
                    {
                        console.log("Incorrect Username or Password 2");
                        res.redirect("/");
                    }
                });
            }
        }
    });

});

app.get("/register", function(req,res)
{
    res.render("register");
});

app.post("/register", function(req,res)
{
    let password = req.body.password;

    bcrypt.hash(password,saltRounds,function(err,hash) //hashing the password
    {
        if(err)
        {
            console.log("Error Hashing: "+err);
        }
        else
        {   //inserting into database
            con.query("INSERT INTO users (name,email,password) values(?,?,?)",[req.body.name,req.body.email,hash],function(error,rows,fields)
            {
                if(error)
                {
                    console.log("Error3: "+error);
                }
                else
                {
                    console.log("Entered New Data");
                }
            });

            res.redirect("/");
        }
    });


});

app.listen(3000, function() //start listening on port 3000
{
    console.log("Server Up and Running on Port 3000")
});
