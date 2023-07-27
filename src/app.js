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

db.sync()
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
