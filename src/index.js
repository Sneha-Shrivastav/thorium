const express = require('express');
var moment = require('moment');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://functionup-cohort:G0Loxqc9wFEGyEeJ@cluster0.rzotr.mongodb.net/Sneha4567-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

  const m1 =   function (req, res, next){
          let time =  moment().format('DD-MM-YY h:mm:ss a')
          let ip = req.socket.remoteAddress
          let path = req.path
          console.log(time, ip, path)
          next()
    }



app.use(m1);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
