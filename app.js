const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

require('dotenv').config();


//sql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'employee_db',
});

//connect to sql server and database
connection.connect(function (err) {
    if (err) throw err;
    taskSelect();
});

//option prompt
function taskSelect() {
    inquirer.prompt([
        {
            name: 'Tracker Menu',
            type: 'list',
            message: 'Welcome to our employee databse. Please select one of the options listed below.',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update employee role',
                'Exit'
            ]
        }
    ])
    
        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                viewDepartments();
            }
            
            if (choices === "View all roles") {
                viewRoles();
            }

            if (choices === "View all employees") {
                viewEmployees();
            }

            if (choices === "Add a department") {
                addDepartment();
            }

            if (choices === "Add a role") {
                addRoles();
            }

            if (choices === "Add an employee") {
                addEmployees();
            }

            if (choices === "Update an employee's role") {
                updateEmployeeRole();
            }

            if (choices === "Exit") {
                exitApp();
            }
        });
};

// View Employees
viewEmployees = () => {
    const mysql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(mgr.first_name, mgr.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee mgr ON employee.manager_id = mgr.id`;

    connection.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        taskSelect();
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
        }
    ])
    .then(answer => {
        const parameters = [answer.firstName, answer.lastName]
        const roles_var = `SELECT roles.id, roles.title FROM roles`;

        connection.query(roles_var, (err, data) => {
            if(err) return console.log(err);
            const roles = data.map(({ id, title }) => ({ name:title, value:id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is your role?',
                    choices: 'roles'
                }
            ])
            .then(rolesChoices => {
                const role = rolesChoice.roles;
                parameters.push(roles);

                viewEmployees();
            });
        });
    });
};

// Update Employee
updateEmployeeRole = () => {
    const employeeMysql = `SELECT * FROM employee`;
    connection.query(employeeMysql, (err, data) => {
        const employee = data.map(({ id, firstName, lastName }) => ({ name: firstName + "" + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do we want to update?',
                choices: employees,
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.name;
                const parameters = [];
                parameters.push(employee);

                const role_var = `SELECT * FROM role`;

                connection.query(role_var, (err, data) => {
                    if (err) return console.log(err);
                    const roles = data.map(({ id, title }) => ({ name: title, vlaue: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the new role?',
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            parameters.push(role);
                            let employee = parameters[0]
                            parameters[0] = role
                            parameters[1] = employee
                            const mysql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                            
                            connection.query(mysql, parameters, (err, result) => {
                                if (err) console.log(err);

                                viewEmployees();
                            });
                        });
                });
            });
    });
};

// View Departments
viewDepartments = () => {
    const mysql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        taskSelect();
    });
};

// Add Departments
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Which department do you want to add?',
        }
    ])
        .then(answer => {
            const mysql = `INSERT into department (name) VALUES (?)`;
            connection.query(mysql, answer.department, (err, resutls) => {
                if (err) console.log(err);

                viewDepartments();
            });
        });
};

// View Roles
viewRoles() = () => {
    const mysql = `SELECT roles.id, roles.title, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`;

    connection.query(mysql, (err, rows) => {
        console.table(rows);
        taskSelect();
    });
};

// Add roles
addRoles = () => {
    inquirer.prompt([
        {
            type:'input',
            name: 'roles',
            message: "What do you want to add?",
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is your yearly salary?'
        }
    ])
        .then(answer => {
            const parameters = [answer.roles, answer.salary];
            const roles_var = `SELECT name, id FROM department`;

            connection.query(roles_var, (err, data) => {
                if (err) return console.log(err);
                const department_var = data.map(({ name, id }) => ({ name: name, value:id }));

                inquirer.prompt([
                    {
                        type:'list',
                        name:'department_var',
                        message: 'What department is this role in?',
                        choices: 'department_var',
                    }
                ])
                    .then(department_varChoice => {
                        const department_var = department_varChoice.department_var;
                        parameters.push(department_var);
                        const mysql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

                        connection.query(mysql, parameters, (err, result) => {
                            if (err) return console.log(err);
                            
                            viewRoles();
                        });
                    });
            });
        });
};

// Exit
exitApp = () => {
    connection.end();
};