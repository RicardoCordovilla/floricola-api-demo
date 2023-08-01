const cors = require('cors')
const registersRouter = require('./mvc/registers/registers.routes')
const stationsRouter = require('./mvc/stations/stations.routes')
const initModels = require('./mvc/initModels')

const db = require('./dabase')
const express = require('express')
const app = express()



app.use(express.json())

const corsOption = {
    credentials: true,
    origin: '*'
}

app.use(cors(corsOption));

db.authenticate()
    .then(() => { console.log('DB authenticated') })
    .catch(err => { console.log(err) })

db.sync({ alter: true })
    .then(() => { console.log('DB synced') })
    .catch(err => { console.log(err) })

initModels()

const { port } = require('./config')
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'OK',
        users: `localhost:${port}/api/v1`
    })
})


app.use('/api/v1/registers', registersRouter)
app.use('/api/v1/stations', stationsRouter)


app.listen(port, () => {
    console.log(`server started at ${port}`)
})




// ----------  MOSQUITO -----------

// const registersServices = require('../mvc/registers/registers.services')

const { default: axios } = require('axios')
// const express = require('express')
// const app = express()
// app.use(express.json())

const mqtt = require('mqtt')
const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt')

client.on('connect', function () {
    client.subscribe('miracleF01/devices', function (err) {
        // if (!err) {
        //     client.publish('vite3-notification-test',
        //         JSON.stringify({ "station": "ESP1", "values": { "H": 74.2, "T": 25.5 }, "createdAt": new Date() })
        //         // "gdfg"
        //     )

        // }

    })
})

client.on('message', async function (topic, message) {
    // message is Buffer
    console.log("message recived: ", message.toString())
    jsonMessage = JSON.parse(message)
    console.log(jsonMessage)

    jsonMessage.forEach(element => {
        const body = element
        // axios.post('https://floricola-api-demo-production.up.railway.app/api/v1/registers',
        axios.post('http://localhost:9000/api/v1/registers',
            body
        )
            .then(response => console.log(response.data))
            .catch(err => console.log(err))
    });
    // client.end()
})


