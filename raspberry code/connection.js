//requiring GPIO and storing it in variable
const GPIO = require('onoff').Gpio
//requiring socket client for socket connection
const socketClient = require('socket.io-client')
const AutoPilot = require('./AutoPilot')

class IOTconnection{

    constructor(){

        //setting up id of the device
        this.DEVICE_ID = '0000'

        //variable which will hold no of active ports
        this.NO_OF_PORTS = 2

        //address of the server we are connecting
        this.SERVER_ADDRESS = 'http://localhost:3000'

        //this variable will store auto mode status
        this.AUTO = false 

        //this array will store all interval in auto mode
        this.autoArray = []

        //GPIO1 = pin 11::::GPIO17
        this.GPIO1 = new GPIO(17, 'out')
        
        //GPIO2 = pin 22::::GPIO25
        this.GPIO2 = new GPIO(25, 'out')
    }

    //this function will write/change status of our GPIO pin
    //this function required 2 arguments
    //1: GPIO: GPIO variable
    //2: changeTo : possible value 0/1
    changeGPIOStatus(GPIO, changeTo){
        console.log('changing GPIO status')
        GPIO.writeSync(changeTo)
    }

    //this function will clear AutoArray which contain all timeout related to prediction
    clearAutoArray(){

        //diabling all intervales from auto array
        this.autoArray.map((interval)=>{
            clearInterval(interval)
        })

        //making auto array empty
        this.autoArray = []
    }

    //this will format time for our project using date-time string given by database
    timeFormatter(dateTimestring){
        
        //converting string to array
        let dateTimeArray = dateTimestring.split('')

        //slicing out important parts for extracing time
        dateTimeArray = dateTimeArray.slice(dateTimestring.indexOf('T')+1, dateTimestring.indexOf('T')+6)

        //blank string which we will append to get the result
        let resultString = ''

        //appending int in char format in the string
        //format of string hhmm for ek 12:00 = 1200 
        resultString = resultString + dateTimeArray[0] + dateTimeArray[1] + dateTimeArray[3] + dateTimeArray[4]

        //converting and returning int 
        return parseInt(resultString)
    }

    connect(){
        //estabilishing connection
        const socket = socketClient(this.SERVER_ADDRESS)

        //setting up event listener when socket is connected
        socket.on('connect', ()=>{
            
            console.log('connected to server')
            
            //will send data to the server to register our device
            //we are also sending device current GPIO config so that
            //server can know about our current/initial status
            socket.emit('device register', {
                id: this.DEVICE_ID,
                GPIO: [
                {status: this.GPIO1.readSync(), name: 'light 1', id: 1},
                {status: this.GPIO2.readSync(), name: 'light 2', id: 2}
                ],
                auto: this.AUTO
            })

            //setting up event listener which will trigger when
            //server fire auto mode
           socket.on('enable-auto-pilot', ()=>{

                //checking if auto pilot is already on
                if(this.AUTO){
                    console.log('auto mode already exist')
                    socket.emit('auto-pilot-confirmation', 
                                {result: true, deviceId: this.DEVICE_ID})
                    return true
                }

                //requesting for log enteries
                socket.emit('log-request', {
                    deviceId: this.DEVICE_ID
                })
            })

            //setting up event listener for log-response
            socket.on('log-response', (data)=>{

                //claering auto array
                this.clearAutoArray()

                //will loop for each port
                for(let i = 1; i <= this.NO_OF_PORTS; i++){
                    //array of trainning data
                    let trainingData = []
                    //result of each traing data
                    let trainingResult = []

                 
                    //extracing log data
                    data.result.map(entry=>{
                        if(entry.GPIO === i){
                            trainingData = [...trainingData, [1, this.timeFormatter(entry.time)]]
                            trainingResult = [...trainingResult, entry.changeTo===0?false:true]
                        }
                    })

                    //console.log(trainingData)
                    //console.log(trainingResult)

                    //creating auto pilot instance for port 
                    const pilot = new AutoPilot(trainingData, trainingResult)                    

                    //setting up interval for 1 min to check predict and act
                    //adding this into auto array
                   
                    this.autoArray = [ ...this.autoArray,
                        setInterval(()=>{
                            
                            //creating date/time object for time
                            const dateTime = new Date()

                            //checking prediction is true or false
                            //currently day is hard coded
                            //time is in hhmm format 12:00 = 1200 
                            if(pilot.predict(1, (dateTime.getHours()*100) + dateTime.getMinutes())){
                                console.log(`prediction: port ${i} status shoult be true`)
                                this.changeGPIOStatus(i==1?this.GPIO1:this.GPIO2, 1)
                            }
                            else{
                                console.log(`prediction: port ${i} status shoult be false`)
                                this.changeGPIOStatus(i==1?this.GPIO1:this.GPIO2, 0)
                            }
                            

                        }, 60000)
                    ]
                    console.log(`auto pilot for port ${i} enabled`)
                }

                    console.log('auto pilot enabled')
                    //sending confirmation to user/client
                    socket.emit('auto-pilot-confirmation', 
                            {result: true, deviceId: this.DEVICE_ID})
                    
                    //setting Auto variable to true
                    this.AUTO = true
            })

            //code that will recieve auto pilot off request
            socket.on('disable-auto-pilot', ()=>{

                //cheking if auto pilot is on or off
                if(!this.AUTO){
                    console.log('auto pilot is already off')

                    //emiting auto-pilot off confirmation 
                    socket.emit('auto-pilot-off-confimation', {
                        deviceId: this.DEVICE_ID,
                        GPIO: [
                            {status: this.GPIO1.readSync(), name: 'light 1', id: 1},
                            {status: this.GPIO2.readSync(), name: 'light 2', id: 2}
                        ]
                    })

                    return true                    
                }

                this.clearAutoArray()

                //making auto variable false
                this.AUTO = false

                console.log('auto pilot disabled')

                //emiting auto-pilot off confirmation 
                socket.emit('auto-pilot-off-confimation', {
                    deviceId: this.DEVICE_ID,
                    GPIO: [
                        {status: this.GPIO1.readSync(), name: 'light 1', id: 1},
                        {status: this.GPIO2.readSync(), name: 'light 2', id: 2}
                    ]
                })

            })

            //setting up event listener which will be triggered when 
            //server want to change our GPIO pin status 
            socket.on('change pin status', (data)=>{
                
                //checking if data exist of not
                if(!data){
                    console.log('change pin socket error(No Data Found)!')
                    return
                }
                
                //creating switch to call function and pass particular 
                //GPIO server wants to change
                switch(data.GPIOPinNo){  
                    case 1: 
                        this.changeGPIOStatus(this.GPIO1, data.changeTo)
                        break
                    case 2:
                        this.changeGPIOStatus(this.GPIO2, data.changeTo)
                        break
                    default:
                        //GPOI const not found/ not configured
                        console.log('GPOI requested is not yet configured')
                }
            })

        })
    }
}

const IoT = new IOTconnection()
IoT.connect()
