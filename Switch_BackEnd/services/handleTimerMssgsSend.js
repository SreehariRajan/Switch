const mongoose = require('mongoose');
const timerMessages = mongoose.model("TimerMessages");
const messages = mongoose.model("Messages");

function handleTimerMssgsSend(io){
    console.log("ii")
    const Time = new Date();
    const year = Number(Time.getFullYear());
    const month = Number(Time.getMonth()+1);
    const day = Number(Time.getDate());
    const hours = Number(Time.getHours());
    const minutes = Number(Time.getMinutes());
    const seconds = Number(Time.getSeconds());
    // Status.find().then((item)=>{item.forEach((status)=>{
    timerMessages.find().then((item)=>{item.forEach(async(mssgs)=>{
        for (const property in mssgs.messagesList){
            const mssgss =await mssgs.messagesList[property];
        // mssgs?.messagesList?.forEach(mssg=>{
            mssgss.forEach(async(mssg,index)=>{
        
            console.log("wyyy")
            // const mssg = await mssgs[i];
            if (year===mssg.timeObject.year && month===mssg.timeObject.month && day===mssg.timeObject.day && hours===mssg.timeObject.hours && minutes>=mssg.timeObject.minutes && minutes<=mssg.timeObject.minutes+1){ //check condition here
                console.log("yes sending")
                io
                .of('/messageSocket/connect')
                .emit(`Recieve Message ${mssg.to.userNumber}`,mssg);

                io
                .of('/messageSocket/connect')
                .emit(`Recieve Message ${mssg.from.userNumber}`,mssg);



                await messages.findOne({_id:mssg.to.userNumber},async(err,message)=>{
                    // const from ="+918888888888";
                    const from = mssg.from.userNumber;
                    if (!err){
                        console.log("yesss100000000000000000000000")
                        if (message){
                            if (message.messagesList[from]){
                                console.log("yesss100000000000000000000000")
                                // messagesList[from]=mssg;
                                // const mssgToInsert = messagesList[o][from]
                                await messages.findOne({_id: mssg.to.userNumber}, 
                                    async(err,doc)=>{
                                        if (doc){
                                            await doc.messagesList[from].push(mssg);
                                            await doc.markModified('messagesList');
                                            await doc.save((err,doc)=>{
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
                                await messages.findOne({_id: mssg.to.userNumber},
                                    async(err,doc)=>{
                                        if (doc){
                                            doc.messagesList[from]=await mssgFrom;
                                            await doc.markModified("messagesList")
                                            await doc.save((err,doc)=>{
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
                            await message.save((err,doc)=>{
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
                
            //delet mssghere   
            
                await mssgss.splice(index,1);
                await mssgs.markModified("messagesList");
                mssgs.save((err,doc)=>{
                    if (doc){
                        console.log("deleted after sending")
                    }
                })
            }
        
        })
        }
    })})
}

module.exports = handleTimerMssgsSend