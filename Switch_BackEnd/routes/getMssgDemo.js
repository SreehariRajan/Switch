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
        const fromMessage =await messages.findById(from);
        var combinedMssgList = [];
        var combinedMssgsList = [];
        if (toMessage || fromMessage){
            if (toMessage?.messagesList[from]){
                combinedMssgList = toMessage.messagesList[from];
            }
            if (fromMessage?.messagesList[to]){
                combinedMssgsList=await combinedMssgList.concat(fromMessage.messagesList[to]);
                // console.log(combinedMssgList);
            }
            else{
                combinedMssgsList =await combinedMssgList;
            }
            if (combinedMssgsList){
                const sortedMessages =await combinedMssgsList.sort(
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
                const lengthofArray = sortedMessages.length;
                console.log(lengthofArray)
                if (sortedMessages){
                    // for (var i=lengthofArray-1;i>=0;i--){
                    //     if (sortedMessages[i].from.userNumber===to){
                    //         console.log("soooorteddd",sortedMessages[i]);
                    res.json(sortedMessages[lengthofArray-1]);
                        //     break

                        // }
                    // }
                }
                // if ()
                //     res.json({message:""})
                // }
                // res.json(sortedMessages[lengthofArray-1]);
            }
        }
    }
    // res.send("adipoliiii")
});


module.exports = router;