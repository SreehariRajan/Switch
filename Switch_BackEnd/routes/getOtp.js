const express = require('express');
const router = express.Router();
const fast2sms = require('fast-two-sms');
const mongoose = require('mongoose');
const Otp = mongoose.model("Otp");

// const mongoose = require('mongoose');
// const verifyToken = require('../middlewares/auth');
// const User = mongoose.model("Users");

router.get("/:phoneNumber",async(req,res)=>{
    // send otp here
    const phoneNumber = req.params.phoneNumber;

    if (phoneNumber){
        //send otp 
        const Time = new Date();
        console.log("sending",phoneNumber);
        const generatedOtp = Math.floor(Math.random()*90000)+10000;
        var options =await {authorization :process.env.OTP_API_KEY , message : `One Time Password for account creation is ${generatedOtp}` ,  numbers : [phoneNumber]} 
        try{
            await fast2sms.sendMessage(options);
        }
        catch(e){
            console.log(e)
            res.status(503)
        }
        
        try{
            const doc = await Otp.findById(phoneNumber);
            if (doc){
                doc.otp=generatedOtp;
                doc.time=Time.getTime();
                doc.save((err,doc)=>{
                    console.log("changes saved ");
                })
            }
            else{
                var otp = new Otp;
                otp._id= phoneNumber;
                otp.otp= generatedOtp;
                otp.time = Time.getTime();
                otp.save((er,doc)=>{
                if (doc){
                    console.log("seccess addede otp")
                }
            })
            }
        }
        catch(e){
            res.status(503)
        }
        res.status(200).json({message:"OTP send successfully"})
    }
})

module.exports = router;