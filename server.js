/*********************************************************************************
* WEB322 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* Name: Navpreet Kaur Student ID: 148332182 Date: 31 Jan,2020
* Online (Heroku) URL: https://dry-dawn-70570.herokuapp.com/
********************************************************************************/ 

var data = require("./data-service.js");
var express = require("express");
var app = express();
const path=require('path');

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path
app.use(express.static('public'));
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,'/views/home.html'));
});
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,'/views/about.html'));
});
app.get("/add", function(req,res){
    res.sendFile(path.join(__dirname,'/views/addEmployee.html'));
});
app.get("/add", function(req,res){
    res.sendFile(path.join(__dirname,'/views/addImage.html'));
});
app.get("/employees", function(req,res){
    data.getAllEmployees()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});
app.get("/managers", function(req,res){
    data.getManagers()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});
app.get("/departments", function(req,res){
    data.getDepartments()
    .then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json({ message: err });
    });
});

// setup http server to listen on HTTP_PORT
return new Promise(function(resolve,reject){
    data.initialize().then(function(data){
    app.listen(HTTP_PORT, onHttpStart); 
}).catch(function(err){
    console.log(err);
})
})
