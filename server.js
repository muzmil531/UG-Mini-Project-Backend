
var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


var corsOptions = {
    origin: ["http://localhost:4200"], //angular url
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// app.use(bodyParser.json({
//     limit: "50mb",
//     type: "application/json"
// }));

// app.use(bodyParser.urlencoded({extended: false}));

app.use(cors(corsOptions))

var port = process.env.port || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));



//Import the mongoose module
// var mongoose = require('mongoose');

//Set up default mongoose connection
// var mongoDB = 'mongodb://127.0.0.1/AlumniManagementSystem';

// var mongoDB="mongodb+srv://cluster0.y4jpq.mongodb.net/AlumniManagementSystem --alumnimanagementsystem alumnimanagementsystem"

mongoose.connect('mongodb+srv://alumnimanagementsystem:Mits1234@cluster0.y4jpq.mongodb.net/AlumniManagementSystem?retryWrites=true&w=majority', {
  useNewUrlParser: true
},{ useUnifiedTopology: true } );

// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
var db = mongoose.connection;

mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
})

const rtsIndex=require('./routes/indexroutes')

app.use('/api',rtsIndex)




//Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.on('connected', console.log('MongoDB connection success:'));


// mongoose.connect('mongodb://127.0.0.1/AlumniManagementSystem');
// const connection=mongoose.connection;
// connection.once('open',()=>{
// 	console.log('Connection established Successfully');
// });


app.listen(port, function () {
    console.log("Server is running in the port " + port)
})