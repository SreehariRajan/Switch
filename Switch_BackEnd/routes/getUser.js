const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("Users")

router.get("/:fromNumber" ,async (req,res)=>{
    console.log("users");
    const userNumber = await req.params.fromNumber;
    // const from = await req.authData.user.phoneNumber;

    if (userNumber){
        
        await User.findOne({phoneNumber:userNumber},(err,user)=>{
            if (user){
                res.status(200).json({message:"exists",details:user})
            }
            else{
                res.status(200).json({message:"does not exists"})
            }
        })
    

        
        // console.log("yeeeep",matchedUsers)
    }
    else{
        res.status(400).json("something")
    }
})



module.exports = router;