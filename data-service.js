var employees=new Array();
var departments=new Array();
const fs=require('fs');

module.exports.initialize=function(){
               fs.readFile('./data/employees.json',function(err,json){
                employees=JSON.parse(json);
            });
            fs.readFile('./data/departments.json',function(err,json){
                departments=JSON.parse(json);
            });
        
            return new Promise(function(resolve,reject){
                resolve("JSON FILE SUCCESSFULLY READ.");
                reject("Read File Error!");
            });
}

module.exports.getAllEmployees=function(){
    return new Promise(function(resolve,reject){
        if(employees.length!=0){
            resolve(employees);
        }
        if(employees.length==0)
        {
            reject("NO DATA AVAILABLE");
        }
    });
}


module.exports.getManagers = function() {
    var Manager=[];
    return new Promise(function(resolve, reject) {
        for(let i=0;i<employees.length;i++){
            if (employees[i].isManager === true) {
                Manager.push(employees[i]);
            }
        }
        if(Manager.length==0) {
            reject("No Data available");
        }
        resolve(Manager);
    });
}

module.exports.getDepartments = function() {
    return new Promise(function(resolve,reject){
        if(departments.length!=0){
            resolve(departments);
        }
        else
        {
        reject("NO DATA AVAILABLE");
        }
    });
}