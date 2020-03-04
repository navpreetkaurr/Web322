var employees=new Array();
var departments=new Array();
const fs=require('fs');

module.exports.initialize=()=>{
               fs.readFile('./data/employees.json',(err,json)=>{
                employees=JSON.parse(json);
            });
            fs.readFile('./data/departments.json',(err,json)=>{
                departments=JSON.parse(json);
            });
        
            return new Promise((resolve,reject)=>{
                resolve("JSON FILE SUCCESSFULLY READ.");
                reject("Read File Error!");
            })
}

// function to get all Employees's list//
module.exports.getAllEmployees=function(){
    return new Promise((resolve,reject)=>{
        if(employees.length!=0){
            resolve(employees);
        }
        if(employees.length==0)
        {
            reject("NO DATA AVAILABLE");
        }
    })
}

// function to get all manager's list//
/*module.exports.getManagers =function() {
    var Manager=[];
    return new Promise((resolve, reject)=> {
        for(let i=0;i<employees.length;i++){
            if (employees[i].isManager === true) {
                Manager.push(employees[i]);
            }
        }
        if(Manager.length==0) {
            reject("No Data available");
        }
        resolve(Manager);
    })
}
*/
// function to get all department's list//
module.exports.getDepartments = function() {
    return new Promise((resolve,reject)=>{
        if(departments.length!=0){
            resolve(departments);
        }
       else
       {
          reject("NO DATA AVAILABLE");
       }
    })
}

//module to add employees---//
module.exports.addEmployee = function(employeeData){
    if(!employeeData.isManager)
    {
        employeeData.isManager=false;
    } 
    else 
    {
        employeeData.isManager = true;
    }
    employeeData.employeeNum = employees.length+1;
    employees.push(employeeData);
    return new Promise((resolve, reject) => {
        resolve(employees);
        if(employees.length == 0)
        reject("no results returned");
    });
}

module.exports.getEmployeesByNum = function(num){
    return new Promise((resolve, reject) => {
        let E;
        for(let i=0;i<employees.length;i++){
            if(employees[i].employeeNum==num){
                E=employees[i];
                i=employees.length;
            }
        }

      /*  let filteredEmployees = employees.filter(employees => employees.employeeNum == num);
        resolve(filteredEmployees);*/
        if(E.length == 0)
        {
        reject("no results returned");
        }
        resolve(E);
    });
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        let filteredEmployees = employees.filter(employees => employees.status == status);
        resolve(filteredEmployees);
        if(filteredEmployees.length == 0)
        reject("no results returned");
    });
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        let filteredEmployees = employees.filter(employees => employees.department == department);
        resolve(filteredEmployees);
        if(filteredEmployees.length == 0)
        reject("no results returned");
    });
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        let filteredEmployees = employees.filter(employees => employees.employeeManagerNum == manager);
        resolve(filteredEmployees);
        if(filteredEmployees.length == 0)
        reject("no results returned");
    });
}
module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        return new Promise((resolve, reject) => {
            employees.forEach(employee => {
                if (employee.employeeNum == employeeData.employeeNum) {
                    employees.splice(employeeData.employeeNum - 1, 1, employeeData);
                }
            });
            resolve();
        });
    });
}