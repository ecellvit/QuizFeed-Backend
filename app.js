const express = require("express"); //acquire express
const bodyParser = require("body-parser"); //acquire bodyParser
const mySql = require("mysql");

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
                //TODO:CHECK HASHING PASSWORD
                if(rows[0].password===req.body.password)
                {
                    res.render("dashboard_student");
                }
                else
                {
                    console.log("Incorrect Username or Password 2");
                    res.redirect("/");
                }
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
    //TODO: Password hashing
    con.query("INSERT INTO users (name,email,password) values(?,?,?)",[req.body.name,req.body.email,req.body.password],function(error,rows,fields)
    {
        if(error)
        {
            console.log("Error3");
        }
        else
        {
            console.log("Entered New Data");
        }
    });

    res.redirect("/");
});

app.listen(3000, function() //start listening on port 3000
{
    console.log("Server Up and Running on Port 3000")
});
