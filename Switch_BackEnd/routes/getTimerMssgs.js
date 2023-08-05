const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const timerMessages = mongoose.model("TimerMessages");

router.get('/:fromNumber',verifyToken,async (req,res)=>{
    const from = await req.authData.user.phoneNumber;
    if (req.params.fromNumber && req.params.fromNumber===from){
        console.log("yessss")

        // const from = req.params.fromNumber;
        const from = await req.authData.user.phoneNumber;

        const TimerMessage =await timerMessages.findById(from);
        // console.log(TimerMessage.messagesList.length)
        let mssgs=[];
        if (TimerMessage?.messagesList){
                for(const ele in TimerMessage.messagesList){
                    // console.log(TimerMessage.messagesList[ele])
                    await mssgs.push(...TimerMessage.messagesList[ele]);
                }
                // TimerMessage.messagesList.forEach((item,index)=>{mssgs.concat(item)});
                console.log(mssgs);
                const sortedMessages = mssgs?.sort(
                    (b,a)=>{
                        if (a.timeObject.year===b.timeObject.year){
                            if (a.timeObject.month===b.timeObject.month){
                                if (a.timeObject.day===b.timeObject.day){
                                    if (a.timeObject.hours===b.timeObject.hours){
                                        if (a.timeObject.minutes===b.timeObject.minutes){
                                            if (a.timeObject.seconds===b.timeObject.seconds){
                                                return b.timeObject.seconds-a.timeObject.seconds;
                                            }
                                            else{
                                                return b.timeObject.seconds-a.timeObject.seconds; 
                                            }
                                        }
                                        else{
                                            return b.timeObject.minutes-a.timeObject.minutes;  
                                        }
                                    }
                                    else{
                                        return b.timeObject.hours-a.timeObject.hours; 
                                    }
                                }
                                else{
                                    return b.timeObject.day-a.timeObject.day; 
                                }
                            }
                            else{
                                return b.timeObject.month-a.timeObject.month; 
                            }
                        }
                        else{
                            return b.timeObject.year-a.timeObject.year; 
                        }
                        });
                // console.log("sdjhgsdkjhdkfjhgkjdfhkjfdhgjhf",sortedMessages);
                // console.log("sliceddddddddddddddd",slicedarray)
                res.status(200).json({timmerMssgs:sortedMessages,message:"not empty"});
            
            
        }
        else{
            res.status(200).json({message:"empty"})
        }
    }
    res.status(400).json({message:"bad request"});
});


module.exports = router;