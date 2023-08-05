const mongoose = require('mongoose');
const messagesJoiSchema = require('../models/messages.model');
const messages = mongoose.model("Messages");
const User = mongoose.model("Users")
const IndexFinder = require('../services/indexFinder');

// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

// upload.single('avatar')

var onlineUsers =[];
exports = module.exports = (socket,io)=>{

    // console.log("uuuuuuuuuuuuuuuuuuuuu")
    console.log("user connected \n");
    socket.on('connected',user=>{
        onlineUsers.push(String(user.user));
        console.log("yyyyyyyyyyyyyyyyyyyyyyyyy",onlineUsers,user.user);
        
        io
        .of('/messageSocket/connect')
        .emit(`onlineUsers`,onlineUsers)
    });

    socket.on('seenMssgLength',obj=>{
        const arrayLength = obj.mssgLength;
        const to = obj.to;
        const from = obj.from;

        io
        .of('/messageSocket/connect')
        .emit(`seenMssgLength ${from} ${to}`,arrayLength)

        messages.findOne({_id:from},async(err,message)=>{
            if (!err){
                if (message){
                    if (message.seenLength[to]){
                        message.seenLength[to]=arrayLength;
                    }
                    else{
                        message.seenLength[to]=arrayLength
                    }
                    message.markModified("seenLength");
                    message.save((err,doc)=>{
                        if (!err){
                            console.log("yes seen")
                        }
                    })
                }
            }
        })
    

       

    })
    

    socket.on('changeStarMessageStatus',obj=>{
        const from = obj.from;
        const to = obj.to;
        const element = obj.mssg;
        const {error,value} = messagesJoiSchema.messagesJoiSchema.validate(element);
        if (!error){
            console.log("two")
            messages.findOne({_id:to},async(err,message)=>{
                if (!err){
                    console.log("three")
                    const index =await IndexFinder(element,message.messagesList[from]);
                    if (index!==-1){
                        console.log("four")
                        message.messagesList[from][index].starredMessage =await false;
                        await message.markModified("messagesList");
                        await message.save((err,doc)=>{
                            if (!err){
                                console.log("success changed starredStatus");
                            }
                        })

                    }
                } 
        })}

        io
        .of('/messageSocket/connect')
        .emit(`Recieve changeStarMessageStatus ${to} ${from}`,element)
    });

    //listening for typing status
    socket.on('typingStatus',details=>{
        console.log("typing statuschedck dissssssssssconecetdddddddddddddddd ");
        // for (const user of details.contacts){
            console.log(details.tonumber)
            io
            .of('/messageSocket/connect')
            .emit(`typingStatusChecked ${details.tonumber} ${details.user}`,{typing:details.typing,fromUser:details.user,toUser:details.tonumber});
        // }
    });
     //listening to typing status for users asked
     socket.on('typingStatusForUser',user=>{
        io
        .of('/messageSocket/connect')
        .emit(`typingStatusCheck ${user.tonumber} ${user.userNumber}`,{askedUser:user.userNumber,checkNumber:user.tonumber});
    })

    socket.on('typingStatusChecked',statusObject=>{
        console.log("typing statusssssssssssssssssssssssssssssssssssssss ");
        io
        .of('/messageSocket/connect')
        .emit(`typingStatusChecked ${statusObject.user} ${statusObject.ofUser}`,statusObject);
    });

        // recording status
    socket.on('recordingStatus',details=>{
        console.log("recordingStatus statuschedck dissssssssssconecetdddddddddddddddd ");
        // for (const user of details.contacts){
            io
            .of('/messageSocket/connect')
            .emit(`recordingStatusChecked ${details.tonumber} ${detials.user}`,{recording:details.recording,fromUser:details.user,toUser:detials.tonumber});
        // }
    });
     //listening to recording status for users asked
     socket.on('recordingStatusForUser',user=>{
        io
        .of('/messageSocket/connect')
        .emit(`recordingStatusCheck ${user.tonumber} ${user.userNumber}`,{askedUser:user.userNumber,checkNumber:user.tonumber});
    })

    socket.on('recordingStatusChecked',statusObject=>{
        // console.log("typing statusssssssssssssssssssssssssssssssssssssss ");
        io
        .of('/messageSocket/connect')
        .emit(`recordingStatusChecked ${statusObject.user} ${statusObject.ofUser}`,statusObject);
    });



    //listening to online status
    socket.on('onlineStatusForUser',user=>{
        console.log("uuuuuuuuuurrrrrrrrrrrrrrrrrrrrrrrr")
        io
        .of('/messageSocket/connect')
        .emit(`onlineStatusCheck ${user.tonumber}`,{askedUser:user.userNumber});
    })

    
   

    socket.on('onlineStatusChecked',statusObject=>{
        io
        .of('/messageSocket/connect')
        .emit(`onlineStatusChecked ${statusObject.user}`,statusObject);
    });

    socket.on('userDisconnected',details=>{
        console.log(details.timeObject)
        User.findOneAndUpdate({phoneNumber:details.user},{$set:{lastSeen:details.timeObject}},{new:true,useFindAndModify:false},(err,doc)=>{
            if (doc){
                console.log("success profileeeeee",err,doc)
            }
        })
        console.log("disconnectedd")
        for (const user of details.contacts){
            io
            .of('/messageSocket/connect')
            .emit(`onlineStatusChecked ${user.phoneNumber}`,{online:details.online,lastSeenObj:details.timeObject});
        }
    });
    socket.on('userConnected',details=>{
        for (const user of details.contacts){
            io
            .of('/messageSocket/connect')
            .emit(`onlineStatusChecked ${user.phoneNumber}`,{online:details.online});
        }
    });

    socket.on('disconnected',user=>{
        console.log("disconnected.....................",user);
        var index = onlineUsers.indexOf(user.user);
        if (index>-1){
            onlineUsers.splice(index,1);
        }
        io
        .of('/messageSocket/connect')
        .emit(`onlineStatus`,onlineUsers)
    })
    socket.on(`Send Message`,mssg=>{
        io
        .of('/messageSocket/connect')
        .emit(`Recieve Message ${mssg.to.userNumber} ${mssg.from.userNumber}`,mssg);
        io
        .of('/messageSocket/connect')
        .emit(`Recieve Message ${mssg.to.userNumber}`,mssg);
        console.log(mssg)
    const {error,value} = messagesJoiSchema.messagesJoiSchema.validate(mssg);
    // console.log("yesss1")
    if(!error){
        // var message = new messages();
        // message._id=mssg.to.userNumber;
        // message.message=mssg;
        // console.log("yesss")
        // messages.findOneAndUpdate({_id:mssg.to.userNumber},
        //     {$push:{'messages'}})
        messages.findOne({_id:mssg.to.userNumber},(err,message)=>{
            // const from ="+918888888888";
            const from = mssg.from.userNumber;
            

            if (!err){
                console.log("yesss100000000000000000000000")
                if (message){
                    if (message.messagesList[from]){
                        console.log("yesss100000000000000000000000")
                        // messagesList[from]=mssg;
                        // const mssgToInsert = messagesList[o][from]
                        messages.findOne({_id: mssg.to.userNumber}, 
                            (err,doc)=>{
                                if (doc){
                                    doc.messagesList[from].push(mssg);
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
                        messages.findOne({_id: mssg.to.userNumber},
                            (err,doc)=>{
                                if (doc){
                                    doc.messagesList[from]=mssgFrom;
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
                    mssgFrom[from]=[mssg];
                    var message = new messages();
                    message._id=mssg.to.userNumber;
                    var obj = {};
                    obj[from]=0;
                    message.seenLength=obj;
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
     // console.log("success",req.body.phoneNumber)
    }
    else{
        console.log(error)
    }
    })


}