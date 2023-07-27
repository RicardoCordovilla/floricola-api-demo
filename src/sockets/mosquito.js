const registersServices = require('../mvc/registers/registers.services')

const express = require('express')
const app = express()
app.use(express.json())

const mqtt = require('mqtt')
const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt')

client.on('connect', function () {
    client.subscribe('vite3-notification-test', function (err) {
        if (!err) {
            client.publish('vite3-notification-test', 'Ricardo 💛')
        }
    })
})

client.on('message', async function (topic, message) {
    // message is Buffer
    // console.log("message recived: ", message.toString())
    const register = await registersServices.createRegister()
    // console.log(register)
    // client.end()
})