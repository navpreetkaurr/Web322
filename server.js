/*********************************************************************************
* WEB322 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* Name: Navpreet Kaur Student ID: 148332182 Date: 
* Online (Heroku) URL: 
********************************************************************************/ 

var dataFile = require("./data-service.js");
var express = require("express");
var app = express();
var multer=require("multer");
var bodyParser = require('body-parser');
const path=require('path');
const fs=require('fs');
const exphbs = require('express-handlebars');

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons( **copied comment from notes [just for knowledge])

const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // tell multer to use the diskStorage function for naming files instead of the default.
  var upload = multer({ storage: storage });

  //set the middleware for “urlencoded” form data
app.use(bodyParser.urlencoded({ extended: true }));

// setup a 'route' to listen on the default url path
app.use(express.static('public'));

//telling server that any file with the “.hbs” extension will use the handlebars “engine” (template engine)

app.engine('.hbs', exphbs({
    extname:'.hbs', 
    defaultLayout:'main',
    helpers:{
        navLink:function(url, options){
            return '<li' + ((url==app.locals.activeRoute)? ' class="active"':'')
                +'><a href="'+url+'">'+options.fn(this)+'</a></li>'
        },
        equal:function(lvalue, rvalue, options){
            if(arguments.length<3)
                throw new Error("Handlerbars Helper equal needs 2 parameters");
            if(lvalue != rvalue){
                return options.inverse(this);
            }else{
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
app.get("/", function(req,res){
    res.render("home");
});

// setup another route to listen on /about
app.use(express.static('public')); 
app.get("/about", function(req,res){
    res.render("about");
});

  //-------------------GET--------------------//

  //---------Get route to get images---------//
app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function(err, imageFile){
        res.json(imageFile);
    })
});

//---------set route to listen employees---------//
app.use(express.static('public')); 
app.get("/employees", function(req,res){
    dataFile.getAllEmployees()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});

//---------Gset route to listen managers---------//
/*app.use(express.static('public')); 
app.get("/managers", (req,res)=>{
    dataFile.getManagers()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});
*/
//---------set route to listen departments---------//
app.use(express.static('public')); 
app.get("/departments", function (req, res) {
    dataFile.getDepartments()
    .then((data) => res.render("departments",{departments:data}))
    .catch(() => res.render("departments",{"message": "error"}))
});

//---------set route to get added employees---------//
app.get("/employees/add", function(req,res){
    res.render("addEmployee");
});

//---------set route to get added images---------//
app.get("/images/add", (req,res)=>{
    res.render("addImage");
});

app.get("/employees", (req, res) => {
    if(req.query.status) {
        dataFile.getEmployeesByStatus(req.query.status)
            .then((data) => res.render("employees",{employees:data}))
            .catch(() => res.render("employees",{message: "error"}))
    }else if(req.query.manager){
        dataFile.getEmployeesByManager(req.query.manager)
            .then((data) => res.render("employees",{employees:data}))
            .catch(() => res.render("employees",{message: "error"}))
    }else if(req.query.department){
        dataFile.getEmployeesByDepartment(req.query.department)
            .then((data) => res.render("employees",{employees:data}))
            .catch(() => res.render("employees",{message: "error"}))
    }else{
        dataFile.getAllEmployees()
            .then((data) => res.render("employees",{employees:data}))
            .catch(() => res.render("employees",{message: "error"}))
    }
});

//--------route to get employees by number-----------//
app.get("/employee/:employeeNum", (req, res) => {
    dataFile.getEmployeesByNum(req.params.employeeNum)
    .then((data) => res.render("employee",{employee:data}))
    .catch(()=>{res.render("employee",{message:"error"})
    })
});

// -----------------------Post -----------------------//

// ------------post Route to add image-----------//
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });

// ------------Post Route to add Employees--------//
app.post("/employees/add", (req, res) => {
    dataFile.addEmployee(req.body)
    .then(res.redirect('/employees'))
    .catch((err) => res.json({"message": err}))   
});


app.post("/employee/update", (req, res) => {
    dataFile.updateEmployee(req.body)
    .then(res.redirect('/employees'))
   });

//seting an error if page not found
app.use(express.static('public')); 
app.use(function(req, res, next) {
    return res.status(404).send("Page Not Found");
  });

// setup http server to listen on HTTP_PORT
return new Promise(function(resolve,reject){
    dataFile.initialize()
    .then(function(data){
    app.listen(HTTP_PORT, onHttpStart); 
})
.catch(function(err){
    console.log(err);
})
})
