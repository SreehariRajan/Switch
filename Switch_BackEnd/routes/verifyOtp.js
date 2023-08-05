const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Otp = mongoose.model("Otp");


router.post("/",async(req,res)=>{
    // verify otp
    console.log("verifuehjgh")
    const phoneNumber = await req.body.phoneNumber;
    const otp = await req.body.otp;
    if (phoneNumber && otp){
        //verify otp
        const Time = new Date();
        console.log("oooooooo")
        Otp.findOne({_id:phoneNumber},async(err,doc)=>{
            console.log(doc,err,phoneNumber)
            if (doc){
                console.log(doc.time,doc.otp);
                const currentTime = await Time.getTime();
                const docTime = await doc.time;
                console.log(currentTime,docTime)
                console.log(currentTime-docTime);
                if (currentTime-doc.time<180000){
                    if (doc.otp === otp){
                        res.json({message:"verified"});
                        console.log("deleted")
                        await Otp.deleteOne({_id:phoneNumber});
                    }
                    else{
                        res.status(200).json({message:"Invalid OTP"})
                    }
                }
                else{
                    console.log("deleted")

                    res.status(200).json({message:"OTP expired"});
                    await Otp.deleteOne({_id:phoneNumber});
                }
            }
            else{
                res.status(200).json({message:"OTP expired"});
            }
        })
    }
})

module.exports = router;