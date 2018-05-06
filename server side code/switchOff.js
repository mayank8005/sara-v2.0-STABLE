//requiring socket client for socket connection
const socketClient = require('socket.io-client')

//server address
const SERVER_ADDRESS = 'http://192.168.1.5:3000'

//id of device
const ID = '0000'

//estabilishing connection
const socket = socketClient(SERVER_ADDRESS)

//setting up connect action listener
socket.on('connect', ()=>{

    console.log('connected to server')

    socket.emit('login-request', {
        deviceId: ID,
        password: 'sara'
    })

    socket.on('login-response', (data)=>{

        console.log('fuck')

        //changing device state to off
        //device 1
        socket.emit('GPIO-change', {
            portNo: 1,
            changeTo: 1,
            deviceId: ID 
        })
        //device 2
        socket.emit('GPIO-change', {
            portNo: 2,
            changeTo: 1,
            deviceId: ID 
        })

        //disabling auto pilot
        socket.emit('auto-pilot-disable-request', {deviceId: ID})


        //exiting process
        setTimeout(()=>{process.exit(0)}, 3000)

    })
})

