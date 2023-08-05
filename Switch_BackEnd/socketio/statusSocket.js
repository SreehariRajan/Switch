const mongoose = require('mongoose');
const statusJoiSchema = require('../models/status.model');
const Status = mongoose.model("Status");
const User = mongoose.model("Users");

exports = module.exports = (socket,io)=>{
    socket.on('Send seenMyStatus',object=>{
        Status.findOne({_id:object.from.userNumber},async(err,status)=>{
            if (!err){
                // console.log(status,"this is status")
                if (status){
                    // console.log("status",status)
                    if (status?.statusList?.length!==0){
                        const index = await status?.statusList?.findIndex((ele,ind)=>ele.imageLocation === object.item);
                        console.log(index,"ppppppppppppppppp")
                        if (status.statusList[index].seenMySelf===false){
                            console.log("00000000000000000000")
                            status.statusList[index].seenMySelf = true;
                            console.log("ooyy")
                            status.markModified("statusList")
                            status.save((err,doc)=>{
                                console.log("yess",err,doc)
                            }
                            )
                        }
                    }
                }
            }
        })
    });
    socket.on('Send seenStatus',object=>{
        console.log("seeeeeneneneen")
            Status.findOne({_id:object.to.userNumber},async(err,status)=>{
                if (!err){
                    // console.log(status,"this is status")
                    if (status?.statusList?.length!==0){
                        const index = await status.statusList.findIndex((ele,ind)=>ele.imageLocation === object.item)
                        const checkUser = await status.statusList[index]?.seen.findIndex((ele,doc)=>
                                ele.userNumber === object.from.userNumber
                            )
                        if (checkUser === -1){
                            io
                            .of('/statusSocket/connect')
                            .emit(`Recieve seenStatus ${object.to.userNumber} for ${object.item}`,object);
                            
                            console.log("yesss")
                            const obj = await {userNumber:object.from.userNumber,timeObject:object.timeObject}
                            await status.statusList[index]?.seen.push(obj);
                            status.markModified("statusList")
                            status.save((err,doc)=>{
                                console.log("yess")
                            })
                            console.log("over")
                        }
                    }
                }
            })


    });
    socket.on(`Send Status`,statusObject=>{
        for (const contact of statusObject.contacts){

            const user = User.findOne({phoneNumber:statusObject.phoneNumber});
            if (user){
                            
                // 
                // await matchedStatus.push(statusObject);
                const status = {content:statusObject.content,imageLocation:statusObject.imageLocation,phoneNumber:statusObject.phoneNumber,time:statusObject.time,timeObject:statusObject.timeObject}
                const statusObjectToSend ={...status,profilePic:user.imageLocation,contactName:statusObject.userName};
                io
                .of('/statusSocket/connect')
                .emit(`Recieve Status ${contact.phoneNumber}`,statusObjectToSend);
            }
        }   
    const {error,value} = statusJoiSchema.statusJoiSchema.validate(statusObject);
    // console.log("yesss1")
    if(!error){
        Status.findOne({_id:statusObject.phoneNumber},async(err,status)=>{
            if (!err){
                console.log("yesss100000000000000000000000")
                if (status){
                    if (status.statusList){
                        console.log("yesss100000000000000000000000")
                        await Status.findOne({_id: statusObject.phoneNumber}, 
                            (err,doc)=>{
                                if (doc){
                                    const statusObj = {content:statusObject.content,imageLocation:statusObject.imageLocation,phoneNumber:statusObject.phoneNumber,userName:statusObject.userName,time:statusObject.time,timeObject:statusObject.timeObject,seen:[],seenMySelf:false}
                                    doc.statusList.push(statusObj);
                                    doc.markModified('statusList');
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
                        await Status.findOne({_id: statusObject.phoneNumber},
                            (err,doc)=>{
                                if (doc){
                                    const statusObj = {content:statusObject.content,imageLocation:statusObject.imageLocation,phoneNumber:statusObject.phoneNumber,userName:statusObject.userName,time:statusObject.time,timeObject:statusObject.timeObject,seen:[],seenMySelf:false}
                                    doc.statusList=statusObj;
                                    doc.markModified("statusList")
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
                    var status =await new Status();
                    status._id=statusObject.phoneNumber;
                    const statusObj = {content:statusObject.content,imageLocation:statusObject.imageLocation,phoneNumber:statusObject.phoneNumber,userName:statusObject.userName,time:statusObject.time,timeObject:statusObject.timeObject,seen:[],seenMySelf:false}

                    status.statusList=[statusObj];
                    status.seen = [];
                    // message.messagesList[from]=mssg;
                    status.save((err,doc)=>{
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
     // console.log("success",req.body.phoneNumber)
    }
    else{
        console.log(error)
    }
    })
}