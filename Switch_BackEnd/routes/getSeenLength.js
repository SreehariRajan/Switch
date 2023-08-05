const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const messages = mongoose.model("Messages");
router.get('/:fromNumber/:toNumber',verifyToken,async (req,res)=>{

    const from = await req.authData.user.phoneNumber;

    console.log(req.params.fromNumber,req.params.toNumber)
    if (req.params.fromNumber && req.params.toNumber && from === req.params.fromNumber){
        // const from = req.params.fromNumber;
        const to = req.params.toNumber;


        const toMessage =await  messages.findById(to);
        if (toMessage){
            if (toMessage?.seenLength[from]){
                res.json(toMessage.seenLength[from]);
            }
            else{
                res.json(0);
            }
        }
    }
    // res.send("adipoliiii")
});


module.exports = router;