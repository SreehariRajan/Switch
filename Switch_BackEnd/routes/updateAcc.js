const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const userJoiSchema = require('../models/user.model');

const User = mongoose.model("Users")

router.post('/',verifyToken,(req,res)=>{
    console.log(req.body,"jjjjjjjjjjjjjjjj");
    const {error,value} = userJoiSchema.userJoiSchema.validate(req.body);

    if (req.body.phoneNumber===req.authData.user.phoneNumber){
        if (error){
            return res.status(400).send(error);
        }
        else{
            console.log("pp",req.body.phoneNumber)
            User.findOneAndUpdate({phoneNumber:req.body.phoneNumber},{$set:{userName:req.body.userName,imageLocation:req.body.imageLocation}},{new:true,useFindAndModify:false},(err,doc)=>{
                if (doc){
                    console.log("success profileeeeee")
                    res.status(200).json({message:"success"});
                }
                else{
                    console.log(err)
                }
            })
        }
    }
    else{
        res.status(400).json({message:"bad request"});
    }
    // res.send("adipoliiii")
});


module.exports = router;