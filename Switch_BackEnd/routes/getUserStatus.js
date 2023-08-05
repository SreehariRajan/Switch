const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const Status = mongoose.model("Status");

router.get('/:fromNumber',verifyToken,async (req,res)=>{


    const from = await req.authData.user.phoneNumber;

    if (req.params.fromNumber && req.params.fromNumber===from){
        const from = req.params.fromNumber;
        const userStatus =await  Status.findById(from);

        if (userStatus?.statusList){
            const sortedStatusList = userStatus.statusList.sort(
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
            res.status(200).json(sortedStatusList);   
        }
    }
    else{
        res.status(400).json({message:"bad request"})
    }
    // res.send("adipoliiii")
});


module.exports = router;