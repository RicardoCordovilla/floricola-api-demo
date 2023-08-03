const { Op } = require("sequelize")
const Registers = require("./registers.model")
const Stations = require("../stations/stations.model")


const accountSid = 'ACfed414e11afb8f5d886977865f92f466';
const authToken = '69ede12d7a7b2a55177d266cc5b18a42';
const client = require('twilio')(accountSid, authToken);

// client.messages
// .create({
//     body: 'Hello from twilio-node',
//     to: 'whatsapp:+593989429874', // Text your number
//     from: 'whatsapp:+17692103650', // From a valid Twilio number
// })
// .then((message) => console.log(message.sid));


const currentDate = new Date()
const currentLocalDate = currentDate.toLocaleDateString("es-EC",
    {
        year: 'numeric', month: '2-digit', day: '2-digit',
        timeZone: 'US/Hawaii'
    // }).split('/').reverse().join('-')
    })


const digits = (num) => {
    let digit = num < 10 ? '0' + num : num + ''
    return digit
}

const formatDate = (date) => {
    const fecha = new Date(date)
    let stringDate = fecha.getFullYear() + '-' + digits(fecha.getMonth() + 1) + '-' + digits(fecha.getDate())
    return stringDate
}

const formatTime = (date) => {
    const time = new Date(date)
    let stringTime = digits(time.getHours() + ':' + digits(time.getMinutes()))
    return stringTime
}


const currentLocalTime = currentDate.toLocaleTimeString("es-EC",
    {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'America/Lima'
    })



const sendAlert = (message) => {
    client.messages
        .create({
            body: message,
            // to: '+593984879499', // Text your number
            to: '+593989429874', // Text your number
            from: '+17692103650', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
}


const promedio = async (stationtitle, type) => {
    const sum = await Registers.sum(type, {
        where: {
            stationtitle,
            type: 'hour',
            date: {
                [Op.between]: [currentLocalDate, currentLocalDate]
            }
        }
    })

    const count = await Registers.count({
        where: {
            stationtitle,
            type: 'hour',
            date: {
                [Op.between]: [currentLocalDate, currentLocalDate]
            }
        }
    })

    return (sum / count).toFixed(2)

}

const updateRegisterDay = async (date, stationtitle) => {
    const updateRegisterDay = await Registers.update(
        {
            hum: await promedio(stationtitle, 'hum'),
            temp: await promedio(stationtitle, 'temp')
        }, {
        where: {
            stationtitle,
            date,
            type: 'day'
        }
    })
    return updateRegisterDay
}

const createRegister = async (data) => {

    const getMaxMinRange = await Stations.findOne({
        where: { title: data.station }

    })
    const tempRange = getMaxMinRange.tempRange
    const humRange = getMaxMinRange.humRange

    // console.log('===================', getMaxMinRange)



    // if (data.temp > tempRange.max) sendAlert(`Temperatura ${data.temp}°C alta en:  
    // Equipo: ${data.station},
    // Secction: ${getMaxMinRange.alias}, 
    // Camas: ${getMaxMinRange.beds}    
    // `)

    const currentDate = new Date()
    // currentDate.setDate(currentDate.getDate() - 1)
    // console.log(currentDate.toLocaleDateString("es-EC", { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'))
    // console.log(currentDate.toLocaleTimeString("es-EC", { hour: '2-digit', minute: '2-digit' }))


    const newRegisterDay = await Registers.findOrCreate({
        where: { type: 'day', date: currentLocalDate, stationtitle: data.station },
        defaults: {
            stationtitle: data.station,
            temp: data.temp,
            hum: data.hum,
            date: formatDate(currentLocalDate),
            time: formatTime(currentLocalDate),
            type: 'day'
        }
    })

    const newRegister = await Registers.create({
        stationtitle: data.station,
        temp: data.temp,
        hum: data.hum,
        date: formatDate(currentLocalDate),
        time: formatTime(currentLocalDate),
    })

    updateRegisterDay(currentLocalDate, data.station)

    return newRegister
}

const getAllRegisters = async () => {
    const data = await Registers.findAll({
        // include: [
        //     {
        //         model: Stations,
        //         as: "station"
        //     }
        // ]
    })
    return data
}
const getRegisters = async (stationtitle) => {
    const data = await Registers.findAll({
        where: {
            stationtitle
        },
        // include: [
        //     {
        //         model: Stations,
        //         as: "station"
        //     }
        // ]
    })
    return data
}

const getRegistersByDate = async (startDate, endDate, stationtitle) => {

    if (startDate === endDate) {
        const data = await Registers.findAll(
            {
                where: {
                    stationtitle,
                    type: 'hour',
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }
        )
        return data
    }

    else {
        const data = await Registers.findAll(
            {
                where: {
                    stationtitle,
                    type: 'day',
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }
        )
        return data
    }


}

const getLast = async (stationtitle) => {
    const data = await Registers.findOne({
        limit: 1,
        where: {
            stationtitle,
            createdAt: { [Op.not]: null }
        },
        order: [['createdAt', 'DESC']]
    })
    return data
}

const deleteRegister = async (id) => {
    const data = await Registers.destroy({
        where: { id },
        force: true
    })
    return data
}

module.exports = {
    createRegister,
    getAllRegisters,
    getRegisters,
    getLast,
    getRegistersByDate,
    deleteRegister
}