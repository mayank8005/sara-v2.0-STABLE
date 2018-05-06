//this class contain all helper functions related to server
/*
    functions like 
    Login
    check IOT device connected
    etc
*/
import SocketClient from 'socket.io-client'

export default class ServerSupoort{
    
    constructor(){

        this.isLogin = false    //tells if we are login or not(initially false)
        
        this.connection = false    //will store connection status
                                    //ie true if connected else flase

        this.id = null          //will store device id of the user
        
        this.password = null    //will store password of the user
        
        this.socket = null      //will store socket connected to server
        
        this.SERVER_ADDRESS = 'http://192.168.1.5:3000' ////address of the server we are connecting
        
        this.moduleConnected = false //will store connection status of IoT module
                                        //ie true if connected else flase

        this.count = 0  //this variable will keep track of multiple responses
                        //only if its value is <2 then only login success we get called

        this.autoPilotOnCallback = null //will store callback func that is to be run when 
                                        //auto-pilot-confirmation recieved
        
        this.autoPilotOFFCallback = null //will store callback func that is to be run when 
                                        //auto-pilot-disable-confirmation recieved
    }

    //this function will connect our application to the server
    connect(){
        //estabilishing connection
        this.socket = SocketClient(this.SERVER_ADDRESS)

        //setting on connect action listener
        this.socket.on('connect', ()=>{
            //setting connection status to connected
            this.connection = true
        })

        //setting on disconnect action listener
        this.socket.on('disconnect', ()=>{
            //setting connection status to false
            this.connection = false
        })

        //setting up event listener for auto-pilot-enable response
        this.socket.on('auto-pilot-response', (response)=>{
            console.log('auto pilot response recived')
            //checking response exist or not
            if(!response){
                console.log('error: invalid auto pilot response')
                return false
            }
            
            console.log('auto pilot response recived without error')
            
            //checking if callback exist
            if(this.autoPilotOnCallback){
                
                //calling up callback
                this.autoPilotOnCallback(response.result)
            } 
        })

        //setting up event listener for response for auto pilot disable or off response
        this.socket.on('auto-pilot-off-response', (response)=>{
            console.log('auto pilot off response recived')
            //checking response exist or not
            if(!response||!response.GPIO){
                console.log('error: invalid auto pilot off response')
                return false
            }
            
            console.log('auto pilot response off recived without error')
            
            //checking if callback exist
            if(this.autoPilotOFFCallback){
                
                //calling up callback
                this.autoPilotOFFCallback(response.GPIO)
            } 
        })
    }

    //this function will be used to handle login
    /*
        required 4 parameter 
        1. deviceId: id enter by user
        2. password: password enter by user
        3. loginFailed: function to be called upon login failture
        4. LoginSuccess: function to be called upon login completion
    */
    login(deviceId, password, loginFailed, loginSuccess){
        
        //checking if app is connected to server or not
        if(!this.connection||!this.socket){
            loginFailed('server down')
        }

        //setting up login response listener
        this.socket.on('login-response', (data)=>{
            //checking if login successfull or not
            if(data.result){
                //setting up login configuration
                this.isLogin = true
                this.moduleConnected = data.module
                this.id = deviceId
                this.password = true
                if(this.count<1)
                    loginSuccess()
                this.count++
            }
            else{
                //in case of wrong password
                loginFailed('access denied')
            }
        })

        //initiating login request
        this.socket.emit('login-request', {
            deviceId,
            password
        })
    }

    //this function will change GPIO pin status of IoT module
    changeGPIO(portNo, changeTo){

        //sending data to server
        this.socket.emit('GPIO-change', {
            portNo,
            changeTo,
            deviceId: this.id 
        })
    }

    //this function will request logs from the server
    //this function required one parameter ie. a callback function
    //that function will be called when response is giving by the server
    //result/response will be passed as parameter to that function
    requestLogs(callback){

        //setting up response actin listener
        this.socket.on('log-response', (response)=>{

            //checking if response exist or not
            if(!response){
                console.log('error: invalid log response')
                return false
            }
            
            //calling up callback function
            callback(response.result) 
        })

        console.log('init log request')
        //initializing log request
        this.socket.emit('log-request', {deviceId: this.id})
    }

    //this function will request server to start auto pilot in our IoT module
    requestAutoPilot(callback){

        //setting aauto-pilot-enable callback
        this.autoPilotOnCallback = callback

        console.log(this.autoPilotOnCallback)

        //init auto-pilot request
        console.log('initializing auto pilot request')
        this.socket.emit('auto-pilot-request', {deviceId: this.id})
    }

    //this function will request server to start auto pilot in our IoT module
    requestAutoPilotOff(callback){

        //setting auto-pilot disable callback
        this.autoPilotOFFCallback = callback

        console.log(this.autoPilotOFFCallback)

        //init auto-pilot request
        console.log('initializing auto pilot off request')
        this.socket.emit('auto-pilot-disable-request', {deviceId: this.id})
    }    

}