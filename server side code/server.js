const io = require('socket.io')

class Server{

    //constructor require single parameter called database
    //database: DatabaseSupport object
    constructor(database){

        //this object contain all required database operation
        //this object is a instantance of DatabaseSupport Class
        this.database = database
        //this array will keep tract of connected IOT devices in object format
        /*
            format:
            {socket, deviceInfo{id, GPIO:[{id name status}], auto}}
        */ 
        this.devices = []

        /*this array will store object in format
                {device_id, socket, sessionId}
          this array will be used to track connected clients
        */
        this.client = []
    }

    //this function send data to change GPIO pin status
    changePin(socket, GPIOPinNo, changeTo, deviceId){

        //changing status in server
        this.devices = this.devices.map((device)=>{
            
            //returning same if device id does not match
            if(device.deviceInfo.id!==deviceId)
                return device
            else{
                //creating new GPIO status for that device
                //this will basically create updated GPIO 
                //pin status array so later we can replace 
                //that array and update state
                const newDeviceGPIO = device.deviceInfo.GPIO.map((GPIO)=>{
                    //returning same status in case og different GPIO id
                    if(GPIO.id!==GPIOPinNo){
                        return GPIO
                    }else{
                        //inverting status
                        GPIO.status = GPIO.status===0?1:0
                        return GPIO
                    }
                })

                //changing status of GPIO by replacing our new status array
                device.deviceInfo.GPIO = newDeviceGPIO
                return device 

            }
        })

        //logging changes
        this.database.addLog(deviceId, GPIOPinNo, changeTo)

        socket.emit('change pin status', {
            GPIOPinNo,      //pin that is to be change
            changeTo,        //new status of that pin
        })
    }

    //this function will register device object ie. store in our array
    registerDevice(socket, deviceInfo){
        
        this.devices = [...this.devices, {socket, deviceInfo}]
    
    }

    //this function will register client object ie.store in our client array
    registerClient(socket, clientDeviceId){

        this.client = [...this.client, {socket, clientDeviceId}]
    
    }

    //this method will de-register our device object by removing object from device array
    deRegisterDevice(id){

        this.devices = this.devices.filter((device)=>device.deviceInfo.id!==id)
    
    }

    //this method will de-register our client by removing client from client array
    deRegisterClient(socketId){
    
        this.client = this.client.filter((client)=>(client.socketId !== socketId))
    
    } 

    //this function will set up our server and all required listeners
    setUpServer(){

        //setting up our server on port 3000 and setting up socket connection
        //we are storing socket object in client variable 
       const client = io.listen(3000).sockets

       console.log('server is up and running @ port 3000')

       //on connection action listener
       //when client is connected it will pass a socket object defining that socket connection 
       client.on('connection', (socket)=>{

            //this variable will store device id (if iot module is connected)
            let deviceId = null

            //this variable will store randomly genrated sessionId of connected socket
            //connection 
            const sessionId =  

            console.log('something is connected')

            // this event will register our iot device
            socket.on('device register', (data)=>{
                
                //if data is inavlid
                if(!data.id){
                    console.log('device is not sending proper data(ID-ERROR)')
                    return
                }
                
                //console logging current status of IOT module
                console.log(`current status of IOT module \n
                            data: ${JSON.stringify(data)}`) 

                deviceId = data.id
                this.registerDevice(socket, data)
                console.log('IOT module is now registered/connected')

                /*temporary------------------AREA
                let temp=true
                setInterval(()=>{
                    if(temp){
                        this.changePin(socket, 2, 1)
                        this.changePin(socket, 1, 0)
                        temp = false
                    }
                    else{
                        this.changePin(socket, 2, 0)
                        this.changePin(socket, 1, 1)
                        temp = true
                    }
                },1000)
                //------------------------------*/
            })

            //this method will disconnect and will update our device array if required
            socket.on('disconnect', ()=>{
                //checking if we have to deregister device
                //or basically device that is disconnected is IOT module
                if(deviceId){
                    this.deRegisterDevice(deviceId)
                    console.log('IOT module is now disconnected')
                }else{
                    this.deRegisterClient(socket.id)
                    console.log('client disconnected')
                }
            })

            //this method will handle log request 
            //client have to send 1 parameter 
            //1. device_id : id of the device
            socket.on('log-request', ({deviceId})=>{

                //checking if device id is passed or not
                if(!deviceId){
                    console.log('error: invalid log request')
                    return false
                }

                //declaring a callback function for response
                const callback = (result)=>{
                    
                    //giving response back to the client
                    socket.emit('log-response', {
                        result: result
                    })
                }

                //initializing request from database
                this.database.getLogs(deviceId, callback)
            })

            //this method will handle login request
            //it required 2 parameter 
            //1. device id: id passed by client
            //2.password: password passed by client
            socket.on('login-request', ({deviceId, password})=>{

                //checking if device id and password parameter exist or not
                if(!deviceId||!password){
                    console.log('error: invalid login request')
                    return false
                }


                //declaring callback function
                const callback = (result)=>{

                    /*
                        if result is true we will register client to our server
                        for that we are checking login result and if its true we will
                        register client 
                    */
                    if(result)
                        this.registerClient(socket, deviceId)

                    //will store Iot module connected 
                    //if required module not connected
                    //will return undefined in case of login failture 
                    //it will return store null for security issues
                 
                    const IoTmoduleConnected = result?this.devices.find(
                                    (device)=>(device.deviceInfo.id===deviceId))
                                    :null 
                                 
                    //sending response                                                
                    socket.emit('login-response', {
                        result: result,    //will send login result ie. true/false
                        //will send module id, config etc when everything went well 
                        //undefined if module not connected 
                        //null in case of login failture
                        module: IoTmoduleConnected?IoTmoduleConnected.deviceInfo:null  
                    })
                    
                }
                
                //verifying credentials
                this.database.verifyUserPassword(deviceId, password, callback)
               
            })

            //this code will handle auto-pilot request
            socket.on('auto-pilot-request', (data)=>{

                //checking data
                if(!data){
                    console.log('error: invalid auto-pilot request')
                    return false
                }

                console.log('request to enable auto pilot recieved')

                //extracting variable/data
                const {deviceId} = data

                //finding device
                const device = this.devices.find(
                    (device)=>(device.deviceInfo.id===deviceId))
            
                //checking if device exist
                if(!device){
                    console.log('device got disconnected')
                    return false
                }

                const IoTsocket = device.socket

                IoTsocket.emit('enable-auto-pilot', {})

            })

            //this code will handle auto-pilot-disable request
            socket.on('auto-pilot-disable-request', (data)=>{

                //checking data
                if(!data){
                    console.log('error: invalid auto-pilot disable request')
                    return false
                }

                //extracting variable/data
                const {deviceId} = data

                //finding device
                const device = this.devices.find(
                    (device)=>(device.deviceInfo.id===deviceId))
            
                //checking if device exist
                if(!device){
                    console.log('device got disconnected')
                    return false
                }

                const IoTsocket = device.socket

                IoTsocket.emit('disable-auto-pilot', {})
                
                console.log('auto pilot disable req sent to iot module')

            })

            socket.on('auto-pilot-confirmation', (data)=>{

                
                console.log('auto pilot confirmation recieved')

                //checking data
                if(!data){
                    console.log('error: invalid auto-pilot confirmation')
                    return false
                }

                const {deviceId, result} = data

                //finding device
                const device = this.devices.find(
                    (device)=>(device.deviceInfo.id===deviceId))
            
                //checking if device exist
                if(!device){
                    console.log('device got disconnected')
                    return false
                }

                //changing device status to auto in server
                device.deviceInfo.auto = true 

                console.log('sending auto pilot confirmation to client')

                //sending confirmation to all the related clients
                this.client.map(client=>{

                    
                    //if client id is same send that client confirmation
                    if(client.clientDeviceId===deviceId){
                        client.socket.emit('auto-pilot-response', {result})
                    }
                })
                
            })

            //this socket will send confirmation to client about auto pilot off
            socket.on('auto-pilot-off-confimation', (data)=>{

                
                console.log('auto pilot off confirmation recieved')

                //checking data
                if(!data){
                    console.log('error: invalid auto-pilot off confirmation')
                    return false
                }

                const {deviceId, GPIO} = data

                //finding device
                const device = this.devices.find(
                    (device)=>(device.deviceInfo.id===deviceId))
            
                //checking if device exist
                if(!device){
                    console.log('device got disconnected')
                    return false
                }

                //changing device status to auto in server
                device.deviceInfo.auto = false 
                
                console.log('sending auto pilot off confirmation to client')

                //sending confirmation to all the related clients
                this.client.map((client)=>{

                    //if client id is same send that client confirmation
                    if(client.clientDeviceId===deviceId){
                        client.socket.emit('auto-pilot-off-response', {GPIO})
                    }
                })
    
            })

            //code that receive GPIO change updates sent by client-side
            socket.on('GPIO-change', (data)=>{

                console.log('req')
                //extracting variables
                const { portNo, changeTo, deviceId } = data

                const device = this.devices.find(
                    (device)=>(device.deviceInfo.id===deviceId))

                if(!device){
                    console.log('device got disconnected')
                    return false
                }
                
                const socket = device.socket

                //changing port status
                this.changePin(socket, portNo, changeTo, deviceId)
            
            })

       })

    } 
}

//exporting Server class
module.exports = Server