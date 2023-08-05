const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const messages = mongoose.model("Messages");

async function getLatestMssg(from,to){

        const fromMessage =await  messages.findById(from);
        const toMessage =await  messages.findById(to);
        var combinedList=[];
        if (fromMessage && fromMessage.messagesList[to]){
                const fromSortedMessages =await fromMessage.messagesList[to].sort(
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
            const fromLengthofArray = fromSortedMessages.length;
            if (fromSortedMessages){
                combinedList.push(fromSortedMessages[fromLengthofArray-1]);
            }      
        }
        if(toMessage && toMessage.messagesList[from]){
            const toSortedMessages =await toMessage.messagesList[from].sort(
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
            const toLengthofArray = toSortedMessages.length;
            if (toSortedMessages){
                combinedList.push(toSortedMessages[toLengthofArray-1]);
            }     
        }
        const sortedMessages =await combinedList.sort(
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
                if (sortedMessages){
                    return sortedMessages[lengthofArray-1];
                }    
};


module.exports = getLatestMssg;