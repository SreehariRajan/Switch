const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userJoiSchema = require('../models/user.model');

const User = mongoose.model("Users");

const jws = require('jsonwebtoken');

router.post('/',(req,res)=>{
    const {error,value} = userJoiSchema.userJoiSchema.validate(req.body);
    if (error){
        return res.status(400).send(error);
    }
    else{
        User.findOne({phoneNumber:req.body.phoneNumber},(err,user)=>{
            if (!user){
                var user = new User();
                user.phoneNumber=req.body.phoneNumber;
                user.userName=req.body.userName;
                user.imageLocation=req.body.imageLocation;
                user.save(async(err,doc)=>{
                    if (!err){
                        
                        const user = {
                            phoneNumber:doc.phoneNumber,
                            userName:doc.userName,
                            // imageLocation:doc.imageLocation
                        }
                        // const token = await jws.sign({user},process.env.JWT_SECRET,{expiresIn:"15d"});
                        const token = await jws.sign({user},process.env.JWT_SECRET);
                        // const refreshToken = await jws.sign({user},process.env.JWT_REFRESH_SECRET);
                        res.status(200).json({token});
                        // res.redirect("/user/chatScreen")
                    }
                    else{
                        res.status(404).send(err)
                    }
                })
            }
            else if(user){
                User.findOneAndUpdate({phoneNumber:req.body.phoneNumber},{$set:{userName:req.body.userName,imageLocation:req.body.imageLocation}},{new:true,useFindAndModify:false},async(err,doc)=>{
                    if (doc){
                        console.log("success profileeeeee")
                        const user = {
                            phoneNumber:doc.phoneNumber,
                            userName:doc.userName,
                            // imageLocation:doc.imageLocation
                        }
                        const token = await jws.sign({user},process.env.JWT_SECRET);
                        // const token = await jws.sign({user},process.env.JWT_SECRET,{expiresIn:"15d"});
                        // const refreshToken = await jws.sign({user},process.env.JWT_REFRESH_SECRET);

                        res.status(200).json({token});
                    }
                    else{
                        res.status(404).send(err)
                    }
                })
            }
            else{
                res.status(400).send(err)
            }
        })
    }
    // res.send("adipoliiii")
});


module.exports = router;