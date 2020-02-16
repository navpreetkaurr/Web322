/*********************************************************************************
* WEB322 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* Name: Navpreet Kaur Student ID: 148332182 Date: 11 feb,2020
* Online (Heroku) URL: https://pacific-meadow-80030.herokuapp.com
********************************************************************************/ 

var data = require("./data-service.js");
var express = require("express");
var app = express();
var multer=require("multer");
var bodyParser = require('body-parser');
const path=require('path');
const fs=require('fs');

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

  //-------------------GET--------------------//

//---------set route to listen home page---------//
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,'/views/home.html'));
});

//---------set route to listen about page---------//
app.get("/about", (req,res)=>{
    res.sendFile(path.join(__dirname,'/views/about.html'));
});

//---------Get route to get images---------//
app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function(err, imageFile){
        res.json(imageFile);
    })
});

//---------set route to listen employees---------//
app.use(express.static('public')); 
app.get("/employees", function(req,res){
    data.getAllEmployees()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});
//---------Gset route to listen managers---------//
app.use(express.static('public')); 
app.get("/managers", (req,res)=>{
    data.getManagers()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});

//---------set route to listen departments---------//
app.use(express.static('public')); 
app.get("/departments", (req,res)=>{
    data.getDepartments()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});

//---------set route to get added employees---------//
app.get("/employees/add", (req,res)=>{
    res.sendFile(path.join(__dirname,'/views/addEmployee.html'));
});

//---------Get route to get added images---------//
app.get("/images/add", (req,res)=>{
    res.sendFile(path.join(__dirname,'/views/addImage.html'));
});



// -----------------------Post -----------------------//

// ------------post Route to add image-----------//
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });

// ------------Post Route to add Employees--------//
app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body)
    .then(res.redirect('/employees'))
    .catch((err) => res.json({"message": err}))   
});

app.get("/employees", (req, res) => {
    if(req.query.status) {
        data.getEmployeesByStatus(req.query.status)
            .then((data) => res.json(data))
            .catch((err) => res.json({"message": err}))
    }else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager)
            .then((data) => res.json(data))
            .catch((err) => res.json({"message": err}))
    }else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department)
            .then((data) => res.json(data))
            .catch((err) => res.json({"message": err}))
    }else{
        data.getAllEmployees()
            .then((data) => res.json(data))
            .catch((err) => res.json({"message": err}))
    }
});

app.get("/employee/:num", (req, res) => {
    data.getEmployeesByNum(req.params.num)
    .then((data) => {
        res.json(data);
    })
});

//seting an error if page not found
app.use(express.static('public')); 
app.use(function(req, res, next) {
    return res.status(404).send("Page Not Found");
  });

// setup http server to listen on HTTP_PORT
return new Promise(function(resolve,reject){
    data.initialize()
    .then(function(data){
    app.listen(HTTP_PORT, onHttpStart); 
})
.catch(function(err){
    console.log(err);
})
})
