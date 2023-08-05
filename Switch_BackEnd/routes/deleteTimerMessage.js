const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');

const timerMessagesJoiSchema = require('../models/timerMessages.model');
const IndexFinder = require('../services/indexFinder');
const timerMessages = mongoose.model("TimerMessages");


router.post('/',verifyToken,async(req,res)=>{
    const {error1,value1} = timerMessagesJoiSchema.timerMessagesJoiSchema.validate(req.body.mssg);
    const from = await req.authData.user.phoneNumber; 
    // const from = req.body.userNumber;
    if (error1 ){
        return res.status(400).send(error);
    }
    else{
        console.log("double yes")
        timerMessages.findById({_id:from},
        async(err,doc)=>{
            if (doc){
                const index =await IndexFinder(req.body.mssg,doc.messagesList[req.body.mssg.to.userNumber]);
                console.log("index",index)
                if (index!==-1){
                    await doc.messagesList[req.body.mssg.to.userNumber].splice(index,1);
                    await doc.markModified("messagesList");
                    doc.save((err,doc)=>{
                        if (doc){
                            res.json("success")
                            console.log("deleted successfully")
                        }
                    })
                }
            }
            else{
                console.log("err",err)
            }
        })
    }
    // res.send("adipoliiii")
});


module.exports = router;