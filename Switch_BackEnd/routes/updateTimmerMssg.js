const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');

const timerMessagesJoiSchema = require('../models/timerMessages.model');
const IndexFinder = require('../services/indexFinder');
const timerMessages = mongoose.model("TimerMessages");


router.post('/',verifyToken,(req,res)=>{
    console.log(req.body.newMssg.timeObject,req.body.newMssg.message);
    const {error1,value1} = timerMessagesJoiSchema.timerMessagesJoiSchema.validate(req.body.mssg);
    const {error2,value2} = timerMessagesJoiSchema.timerMessagesJoiSchema.validate(req.body.newMssg);
    // const from = req.body.userNumber;
    
    if(req.body.userNumber && req.body.userNumber===req.authData.user.phoneNumber){ 
        if (error1 || error2){
            return res.status(400).send(error);
        }
        else{
            console.log("double yes")
            timerMessages.findById({_id:req.body.userNumber},
            async(doc,err)=>{
                if (doc){
                    const index =await IndexFinder(req.body.mssg,doc.messagesList[req.body.mssg.to.userNumber]);
                    console.log("index",index)
                    if (index!==-1){
                        doc.messagesList[req.body.mssg.to.userNumber][index]=await req.body.newMssg;
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
    }
    // res.send("adipoliiii")
});


module.exports = router;