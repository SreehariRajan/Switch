const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const User = mongoose.model("Users");

router.get('/:toNumber',verifyToken,async (req,res)=>{
    console.log(req.params.fromNumber,req.params.toNumber)
    if (req.params.toNumber){
        const to = req.params.toNumber;
        const toUserLastSeen =await  User.findOne({phoneNumber:to},{lastSeen:1});
        if (toUserLastSeen){
            console.log(toUserLastSeen);
            res.json(toUserLastSeen);
        }
    }
    // res.send("adipoliiii")
});


module.exports = router;