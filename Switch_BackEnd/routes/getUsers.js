const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const User = mongoose.model("Users")

const numberCheckForGetUser = require('../middlewares/numberCheckForGetUser');
const getLatestMssg = require('../services/getLatestMssg');

router.post("/" ,verifyToken,numberCheckForGetUser,async (req,res)=>{

    const from = await req.authData.user.phoneNumber;
    console.log("users not getting")
    if (req.usersList && req.body.from && req.body.from===from){
        var matchedUsers = [];
        for (const Contactuser of req.usersList){
                await User.findOne({phoneNumber:Contactuser.phoneNumber},async(err,user)=>{
                    if (user){
                        const latestMssg =await getLatestMssg(from,Contactuser.phoneNumber);
                        console.log(latestMssg,"sdjfygskfhgjsdfgkjdhfkfhlkjdfh");
                        if (latestMssg){
                            const userObject =await {name:Contactuser.name,phoneNumber:Contactuser.phoneNumber,imageLocation:user.imageLocation,latestMssg};
                            matchedUsers.push(userObject);
                        }
                        else{
                            const userObject =await {name:Contactuser.name,phoneNumber:Contactuser.phoneNumber,imageLocation:user.imageLocation};
                            matchedUsers.push(userObject);

                        }
                        
                    }
                })
            

        }
        console.log(matchedUsers);
        const sortedUsersList =await matchedUsers.sort(
            (a,b)=>{
                if (b.latestMssg?.timeObject !==undefined && a.latestMssg?.timeObject !==undefined){
                if (a.latestMssg?.timeObject?.year===b.latestMssg.timeObject.year){
                    if (a.latestMssg.timeObject.month===b.latestMssg.timeObject.month){
                        if (a.latestMssg.timeObject.day===b.latestMssg.timeObject.day){
                            if (a.latestMssg.timeObject.hours===b.latestMssg.timeObject.hours){
                                if (a.latestMssg.timeObject.minutes===b.latestMssg.timeObject.minutes){
                                    if (a.latestMssg.timeObject.seconds===b.latestMssg.timeObject.seconds){
                                        return b.latestMssg.timeObject.seconds-a.latestMssg.timeObject.seconds;
                                    }
                                    else{
                                        return b.latestMssg.timeObject.seconds-a.latestMssg.timeObject.seconds; 
                                    }
                                }
                                else{
                                    return b.latestMssg.timeObject.minutes-a.latestMssg.timeObject.minutes;  
                                }
                            }
                            else{
                                return b.latestMssg.timeObject.hours-a.latestMssg.timeObject.hours; 
                            }
                        }
                        else{
                            return b.latestMssg.timeObject.day-a.latestMssg.timeObject.day; 
                        }
                    }
                    else{
                        return b.latestMssg.timeObject.month-a.latestMssg.timeObject.month; 
                    }
                }
                else{
                    return b.latestMssg?.timeObject?.year-a.latestMssg.timeObject.year; 
                }
            }
            else{
                if (b.latestMssg){
                    return 1
                }
                else if(a.latestMssg){
                    return -1
                }
                else{
                    return 1
                }
            }
                });
        console.log("yeeeepzsmjhgzkjfyhlikulkdjuf")
        res.status(200).json(sortedUsersList);
    }
    else{
        res.status(400).json({message:"bad request"})
    }
})



module.exports = router;