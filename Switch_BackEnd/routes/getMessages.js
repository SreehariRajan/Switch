const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const messages = mongoose.model("Messages");

router.get('/:fromNumber/:toNumber/:arrayLength',verifyToken,async (req,res)=>{
    const from = await req.authData.user.phoneNumber;
    if (req.params.fromNumber && req.params.toNumber && from===req.params.fromNumber){
        console.log("yessss")
        // const from = req.params.fromNumber;
        const to = req.params.toNumber;
        const arrayLength = req.params.arrayLength;

        var combinedMssgList = [];
        var combinedMssgsList = [];
        const toMessage =await  messages.findById(to);
        const fromMessage =await messages.findById(from);
        if (toMessage || fromMessage){
            if (toMessage?.messagesList[from]){
                combinedMssgList = toMessage.messagesList[from];
            }
            if (fromMessage?.messagesList[to]){
                combinedMssgsList= await combinedMssgList.concat(fromMessage.messagesList[to]);
                // console.log(combinedMssgList);
            }
            else{
                combinedMssgsList = await combinedMssgList;
            }
            if (combinedMssgsList){
                const sortedMessages = combinedMssgsList.sort(
                    (prev,next)=>{
                        if (next.timeObject.year===prev.timeObject.year){
                            if (next.timeObject.month===prev.timeObject.month){
                                if (next.timeObject.day===prev.timeObject.day){
                                    if (next.timeObject.hours===prev.timeObject.hours){
                                        if (next.timeObject.minutes===prev.timeObject.minutes){
                                            if (next.timeObject.seconds===prev.timeObject.seconds){
                                                return prev.timeObject.seconds-next.timeObject.seconds;
                                            }
                                            else{
                                                return prev.timeObject.seconds-next.timeObject.seconds; 
                                            }
                                        }
                                        else{
                                            return prev.timeObject.minutes-next.timeObject.minutes;  
                                        }
                                    }
                                    else{
                                        return prev.timeObject.hours-next.timeObject.hours; 
                                    }
                                }
                                else{
                                    return prev.timeObject.day-next.timeObject.day; 
                                }
                            }
                            else{
                                return prev.timeObject.month-next.timeObject.month; 
                            }
                        }
                        else{
                            return prev.timeObject.year-next.timeObject.year; 
                        }
                        });
                // console.log("sdjhgsdkjhdkfjhgkjdfhkjfdhgjhf",sortedMessages);
                const slicedarray = sortedMessages.slice(arrayLength);
                // console.log("sliceddddddddddddddd",slicedarray)
                res.json(slicedarray);
            }
            
        }
    }
    // res.send("adipoliiii")
});


module.exports = router;