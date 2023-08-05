const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const timerMessagesJoiSchema = require('../models/timerMessages.model');
const timerMessages = mongoose.model("TimerMessages");

router.post('/',verifyToken,async(req,res)=>{
    
    const mssg =await req.body.mssg;
    const from = await req.authData.user.phoneNumber;

    console.log(mssg);
    const {error,value} =await timerMessagesJoiSchema.timerMessagesJoiSchema.validate(mssg);
    if (error){
        console.log("joi validation failed")
        return res.status(400).send(error);
    }
    else{
        timerMessages.findOne({_id:from},(err,message)=>{
            // const from ="+918888888888";
            // const from = mssg.from.userNumber;
            const to = mssg.to.userNumber;
            if (!err){
                console.log("yesss100000000000000000000000")
                if (message){
                    if (message.messagesList[to]){
                        console.log("yesss100000000000000000000000")
                        // messagesList[from]=mssg;
                        // const mssgToInsert = messagesList[o][from]
                        timerMessages.findOne({_id: from}, 
                            (err,doc)=>{
                                if (doc){
                                    doc.messagesList[to].push(mssg);
                                    doc.markModified('messagesList');
                                    doc.save((err,doc)=>{
                                        if (err){
                                            console.log(err)
                                        }
                                        else{
                                            
                                        }
                                    })
                                }
                            }
                        )  
                    }
                    else{
                        console.log("hngzsfdhjsdzjhgsjgdjsgdjhgjhg")
                        const mssgFrom=[mssg];
                        timerMessages.findOne({_id: from},
                            (err,doc)=>{
                                if (doc){
                                    doc.messagesList[to]=mssgFrom;
                                    doc.markModified("messagesList")
                                    doc.save((err,doc)=>{
                                        if (err){
                                            console.log(err)
                                        }
                                        else{
                                            // console.log(doc)
                                        }
                                    })
                                }
                            })
                    }
                }
                else{
                    // console.log("error",err)
                    const mssgFrom = {};
                    mssgFrom[to]=[mssg];
                    var message = new timerMessages();
                    message._id=from;
                    message.messagesList=mssgFrom;
                    // message.messagesList[from]=mssg;
                    message.save((err,doc)=>{
                        if (!err){
                            console.log("added new field");
                        }
                        else{
                            console.log("some probs",err);
                        }
                    })
                }
            }
            else{
                console.log("yesss100000000000000000000000")
                console.log("error",err)
            }
            })
    }
    // res.send("adipoliiii")
});


module.exports = router;