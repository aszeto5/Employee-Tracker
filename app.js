const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

//sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3300,
    user: 'root',
    password: '123',
    database: 'employee_db',
});

//connect to sql server and database
connection.connect(function (err) {
    if (err) throw err;
    options();
});

//option prompt
function options() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Welcome to our employee databse. Please select one of the options listed below.',
            choices: [
                'View all employees',
                'View all departments',
                'View all roles',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update employee role',
                'Delete an employee',
                'Exit'
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'Add an employee':
                    addEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'Exit':
                    exitApp();
                    break;
                default:
                    break;
            }
        })
};