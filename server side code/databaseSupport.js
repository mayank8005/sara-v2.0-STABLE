//package to hash password
const passwordHash = require('password-hash')

/* this class have nessasary functions related to database
which we goona need
function like :- add user
                find user
                add logs
                get logs 
it contain all the function which are related to the database
*/
class DatabaseSupport{

    //constructor have a parameter name connection 
    //which is a connection object which is connected to database
    constructor(connection){

        this.connection = connection    //database connection object 
        //console logging about creation of database support object
        console.log('database support object active')
    }

    //This function will add user to the database
    //it will return true if all went well
    //in case of error it will return false
    registerUser(deviceId, password){
        
        //checking if device id and password are passed to the function
        if(!deviceId||!password){
            console.log('ERROR: device id and password must be their to register a user')
            return false
        }

        //hashing password
        const hashedPassword =  passwordHash.generate(password)
        
        //sql to add user into database
        const addUserSQL = `INSERT INTO users (Device_ID, password) VALUES ('${deviceId}','${hashedPassword}')`

        //executing sql 
        this.connection.query(addUserSQL, (err)=>{
            //checking for errors
            if(err){
                console.log('ERROR: error while executing addUserSQL query')
                return false
            }
            console.log('1 user added')
            return true
        })
    }

    //this function checks if password is correct or not
    //it runs call back function and pass true and false as its parameter
    //true: login successfull
    //false: login failed
    //in other type of failture it will return false
    verifyUserPassword(deviceId, unverifiedPassword, callback){

        //checking if device-id and unverified password are passed or not
        if(!deviceId||!unverifiedPassword){
            console.log('ERROR: device-id or password not passed to vreifyUserPass func')
            return false
        }

        //sql for retriving password from database
        const getPasswordSQL = `SELECT password FROM users WHERE Device_ID = '${deviceId}'`

        //getting password from database
        this.connection.query(getPasswordSQL, (err, result)=>{
           
            //checking for error
            if(err){
                console.log('ERROR: error while executing getPasswordSQL query')
                return false
            }

            //if no user found and result is undefined/lenght is 0 so giving back false
            if(!result||result.length === 0){
                callback(false)
                return false
            }
            //this variable will store password hash from database 
            let verifiedPasswordHash = result[0].password||null

            //verifying password and it in result
            const loginResult = passwordHash.verify(unverifiedPassword, verifiedPasswordHash)

            //calling callback function with result as parameter
            callback(loginResult)
        })

    }

    //this function will add log to the database
    //if log is added/ no error situation: return TRUE
    //in case of error: return FALSE
    //deviceId: varchar
    //GPIO: int
    //changeTo: 0/1
    addLog(deviceId, GPIO, chnageTo){

        //sql for adding log
        const addLogSQL = `INSERT INTO logs (Device_ID, GPIO, changeTo) VALUES ('${deviceId}', ${GPIO}, ${chnageTo})`
    
        //executing addLogSQL query
        this.connection.query(addLogSQL, (err)=>{
            
            //checking for errors
            if(err){
                console.log('ERROR: error while executing addLogSQL query')
                return false
            }

            //no error means log added...returning true
            console.log('1 log entry added')
            return true 
        })
    }

    //this function returns array of logs of particular device
    //deviceId: varchar/String
    //callback function will be called when result is ready and pass result as parameter
    getLogs(deviceId, callback){

        //checking for parameter
        if(!deviceId){
            console.log('ERROR: parameter error in getLogs')
            return false
        }

        //sql query for getting logs of particular device
        const getLogsSQL = `SELECT id ,GPIO, changeTo, time  FROM logs WHERE Device_ID = '${deviceId}' ORDER BY id`

        //executing getLogsSQL query
        this.connection.query(getLogsSQL, (err, result)=>{

            //checking for errors
            if(err){
                console.log('ERROR: error executing getLogsSQL query')
                return false
            }
            //as no error found returning result 
            callback(result)
        })
    }
}

//exporting module
module.exports = DatabaseSupport