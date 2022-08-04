const inquirer = require('inquirer');
const db = require('./db/connection');
const consoleTable = require('console.table');
const confirm = require('inquirer-confirm');

//sql database
db.connect(function (error) {
    if (error) throw error;
    console.log("Welcome to Employee Track Manager");

    //DB query roles
    db.query("SELECT * from role", function (error, res) {
        roles = res.map(role => ({
            name: role.title,
            value: role.id
        }));
    });

    //DB query departments
    db.query("SELECT * from department", function (error, res) {
        departments = res.map(dep => ({
            name: dep.name,
            value: dep.id
        }));
    });

    //DB query employees
    db.query("SELECT * from employee", function (error, res) {
        employees = res.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));
    });

    taskSelect();
});




//option prompt
function taskSelect() {
    inquirer.prompt({
        name: 'Tracker Menu',
        type: 'list',
        message: 'Welcome to our employee database. Please select one of the options listed below.',
        choices: [{
                name: "View all departments",
                value: "viewAllDepartments"
            },
            {
                name: "View all roles",
                value: "viewAllRoles"
            },
            {
                name: "View all employees",
                value: "viewAllEmployees"
            },
            {
                name: "Add departments",
                value: "addDepartments"
            },
            {
                name: "Add roles",
                value: "addRoles"
            },
            {
                name: "Add employees",
                value: "addEmployees"
            },
            {
                name: "Update employee role",
                value: "updateEmployeeRole"
            },
            {
                name: "End",
                value: "end"
            }
        ]
    }).then(function (res) {
        taskMenu(res.choices)
    });
}
    
function taskMenu(options){
    switch (options) {
        case "viewAllDepartments":
            viewAllDepartments();
            break;
        case "viewAllRoles":
            viewAllRoles();
            break;
        case "viewAllEmployees":
            viewAllEmployees();
            break;
        case "addDepartments":
            addDepartments();
            break;
        case "addRoles":
            addRoles();
            break;
        case "addEmployees":
            addEmployees();
            break;
        case "updateEmployeeRole":
            updateEmployeeRole();
            break;
        case "end":
            end();
    };
};

// View Employees
viewAllEmployees = () => {
    db.query("SELECT * FROM employee", function (error, res) {
        console.table(res);
        endorMain();
    });
};

// Add Employee
addEmployees = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is your first name?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is your last name?',
        },
        {
            type: "list",
            name: "title",
            message: "What is this employee's title?",
            choices: roles
        },
        {
            type: "list",
            name: "manager",
            message: "Who is this employee's manager",
            choices: employees
        }
    ])
    .then(function (response) {
        newEmployee(response);
    });
};

// Update Employee
function updateEmployeeRole(data) {
    db.query(`UPDATE employee SET role_id = ${data.titleID} WHERE id = ${data.employeeID}`,
        function (error, res) {
            if (error) throw error;
        });
    endorMain();
};

// View Departments
viewAllDepartments = () => {
    db.query("SELECT * FROM department", function (error, res) {
        console.table(res);
        endorMain();
    });
};

// Add Departments
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Which department do you want to add?',
        }
    ])
        .then(function (response) {
            newDepartment(response);
        });
};

function newDepartment (data) {
    db.query("INSERT INTO department SET?", {
            name: data.name
        },
        function (error, res) {
            if (error) throw error;
        });
    endorMain();
};

// View Roles
viewAllRoles() = () => {
    db.query("SELECT * FROM role", function (error, res) {
        console.table(res);
        endorMain();
    });
};

// Add roles
addRoles = () => {
    inquirer.prompt([
        {
            type:'input',
            name: 'name',
            message: "What role do you want to add?",
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is your yearly salary?'
        },
        {
            type: "list",
            message: "Which department is the new role in?",
            choices: departments
        }
    ])
        .then(function (response) {
            addNewRole(response);
        });
};

function addNewRole(data) {
    db.query("INSERT INTO role SET ?", {
        title: data.title,
        salary: data.salary,
        department_id: data.id
    }, function (error, res) {
        if (error) throw error;
    });
    endorMain();
};
//Exit or Main Menu
function endorMain() {
    confirm("Do you want to continue?")
        .then(function confirmed() {
            taskSelect();
        }, function cancelled() {
            end();
        });
};

function end() {
    console.log("Ending Program");
    db.end();
    process.exit();
};