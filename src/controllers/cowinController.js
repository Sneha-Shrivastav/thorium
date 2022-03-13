let axios = require("axios")


let getStates = async function (req, res) {

    try {
        let options = {
            method: 'get',
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


let getDistricts = async function (req, res) {
    try {
        let id = req.params.stateId
        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getByPin = async function (req, res) {
    try {
        let pin = req.query.pincode
        let date = req.query.date
        console.log(`query params are: ${pin} ${date}`)
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getOtp = async function (req, res) {
    try {
        let blahhh = req.body

        console.log(`body is : ${blahhh} `)
        var options = {
            method: "post",
            url: `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,
            data: blahhh
        }

        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}




let getByDistrictId = async function (req, res) {
    try {
        let id = req.query.districtId
        let date = req.query.date
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${id}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let temperature = async function (req, res) {
    try {
        let options = {
            method: "get",
            url: `http://api.openweathermap.org/data/2.5/weather?q=London&appid=66acaf3f5f0cca30e913bb5706d9f32b`
        }
        let result = await axios(options)
        console.log(result.data.main.temp)
        res.status(200).send({ temperature: result.data.main.temp })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let citiesTemperature = async function (req, res) {
    try {
        let cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
        let arr = []
        for (let i = 0; i < cities.length; i++) {
            let object = { cities: cities[i] }
            let options = {
                method: "get",
                url: `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=66acaf3f5f0cca30e913bb5706d9f32b`
            }
            let result = await axios(options)

            object.temp = result.data.main.temp
            arr.push(object)
        }
        let sortedArray = arr.sort(function (a, b) { return a.temp - b.temp })

        res.status(200).send({ status: true, data: sortedArray })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let memeCreation = async function (req, res) {
    try {
        let id = req.query.tempId
        let text0 = req.query.text0
        let text1 = req.query.text1

        let options = {
            method:"post",
            url: `https://api.imgflip.com/caption_image?template_id=${id}&text0=${text0}&text1=${text1}&username=payal123&password=FvU9pkj4Jwu7ce*`
        }
        let result = await axios(options)
        res.status(200).send({ data: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}




module.exports.getStates = getStates
module.exports.getDistricts = getDistricts
module.exports.getByPin = getByPin
module.exports.getOtp = getOtp
module.exports.getByDistrictId = getByDistrictId
module.exports.temperature = temperature
module.exports.citiesTemperature = citiesTemperature
module.exports.memeCreation = memeCreation





//payal123
//FvU9pkj4Jwu7ce*
//181913649