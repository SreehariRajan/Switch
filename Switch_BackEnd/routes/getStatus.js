const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const Status = mongoose.model("Status");
const User = mongoose.model("Users");

router.post("/" ,verifyToken,async (req,res)=>{

    const from = await req.authData.user.phoneNumber;
    if (req.body.usersList && req.body.from && req.body.from===from){
        var matchedStatus = [];
        for (const Contactuser of req.body.usersList){
                const status = await Status.findOne({_id:Contactuser.phoneNumber});
                    if (status && status.statusList.length>0){
                        console.log(status,"thi is status")
                        const user = await User.findOne({phoneNumber:Contactuser.phoneNumber});
                        if (user){
                            const statusObject =await {_id:status._id,statusList:status.statusList,profilePic:user.imageLocation,contactName:Contactuser.name};
                            await matchedStatus.push(statusObject);
                        } 
                    }
                    else{
                        continue;
                    }
        }
        const sortedStatusList1 =await matchedStatus.sort(
            (prev,next)=>{
                if (next.statusList[next.statusList.length-1].timeObject.year===prev.statusList[prev.statusList.length-1].timeObject.year){
                    if (next.statusList[next.statusList.length-1].timeObject.month===prev.statusList[prev.statusList.length-1].timeObject.month){
                        if (next.statusList[next.statusList.length-1].timeObject.day===prev.statusList[prev.statusList.length-1].timeObject.day){
                            if (next.statusList[next.statusList.length-1].timeObject.hours===prev.statusList[prev.statusList.length-1].timeObject.hours){
                                if (next.statusList[next.statusList.length-1].timeObject.minutes===prev.statusList[prev.statusList.length-1].timeObject.minutes){
                                    if (next.statusList[next.statusList.length-1].timeObject.seconds===prev.statusList[prev.statusList.length-1].timeObject.seconds){
                                        return prev.statusList[prev.statusList.length-1].timeObject.seconds-next.statusList[next.statusList.length-1].timeObject.seconds;
                                    }
                                    else{
                                        return prev.statusList[prev.statusList.length-1].timeObject.seconds-next.statusList[next.statusList.length-1].timeObject.seconds; 
                                    }
                                }
                                else{
                                    return prev.statusList[prev.statusList.length-1].timeObject.minutes-next.statusList[next.statusList.length-1].timeObject.minutes;  
                                }
                            }
                            else{
                                return prev.statusList[prev.statusList.length-1].timeObject.hours-next.statusList[next.statusList.length-1].timeObject.hours; 
                            }
                        }
                        else{
                            return prev.statusList[prev.statusList.length-1].timeObject.day-next.statusList[next.statusList.length-1].timeObject.day; 
                        }
                    }
                    else{
                        return prev.statusList[prev.statusList.length-1].timeObject.month-next.statusList[next.statusList.length-1].timeObject.month; 
                    }
                }
                else{
                    return prev.statusList[prev.statusList.length-1].timeObject.year-next.statusList[next.statusList.length-1].timeObject.year; 
                }
                });


        const sortedStatusList2 = await sortedStatusList1.sort((prev,next)=>{
            var flag=0;
            var index = 0;
            for (var i;i<prev.statusList.length;i++){
                for (var j;j<prev.statusList[i].seen.length;j++){
                    if (prev.statusList[i].seen[j].userNumber===from){
                        flag=1;
                    }
                    
                }
                if (flag=0){
                    index = i;
                    break;
                }
                else{
                    index = prev.statusList.length-1;
                }
            }
            if (flag===0){
                // return prev.statusList[index].statusList[statusList.length-1].timeObject.Time-next.statusList[next.statusList.length-1].statusList[statusList.length-1].timeObject.Time;
                return 1;
            }
            else{
                return -1;
            }
        });
        console.log(sortedStatusList2,"matheccccc");
        res.status(200).json(sortedStatusList2);
    }
    else{
        res.status(400).json({message:"bad request"})
    }
})



module.exports = router;