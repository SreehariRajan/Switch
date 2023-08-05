const mongoose = require('mongoose'); //connect mongobd
mongoose.connect("mongodb://localhost:27017/Connect_In",{useNewUrlParser: true,useUnifiedTopology: true},(err)=>{
    if (!err){
        console.log("Successfully connected");

    }
    else{
        console.log("Failed to connect databsase")
    }
});

const user = require('./user.model');
const messages = require('./messages.model');
const Status = require('./status.model');
const timerMessages = require('./timerMessages.model');
const otp = require('./otp.model');