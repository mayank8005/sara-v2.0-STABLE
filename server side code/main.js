//This file will create and handle all task
/*This is the driver file which controls every server side task like starting a 
server and creating database etc...*/

//importing mysql for connecting to mysql
const mysql = require('mysql')
//importing server from server.js to start server
const ServerCreator = require('./server')
//importing database support from databaseSupport.js to use databse related function
const DatabaseSupport = require('./databaseSupport')

//database related constant
const DATABASE_USERNAME = 'root'        //username for database user
const DATABASE_PASSWORD = ''            //password for database user
const DATABASE_HOST = 'localhost'       //host name of database user
const DATABASE_NAME = 'sara'            //name of the database

//craeting database connection
const conn = mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    timezone: 'utc'
})

//when database is connected
conn.connect((err)=>{
    //if error occur while connecting to database
    if(err){
        console.log('DATABASE CONNECTION ERROR')
        return
    }

    console.log('database connected')
    //creating and starting server
    //we are also creating and passing database support object to add 
    //databse related functionality
    const server = new ServerCreator(new DatabaseSupport(conn))
    server.setUpServer()

})