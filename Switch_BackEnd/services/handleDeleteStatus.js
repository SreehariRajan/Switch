const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Status = mongoose.model("Status");

function handleDeleteStatus(){
    console.log("yesss enetered")
    const Time = new Date();

    Status.find().then((item)=>{item.forEach((status)=>{
        // console.log("item",status)
        for (var i = 0;i<status.statusList?.length;i++){
            const differenceInMilliSec =Time.getTime()-status.statusList[i].timeObject.Time;
            if (differenceInMilliSec>=86400000){
                status.statusList.splice(i,1);
                console.log("one two three")
                status.markModified("statusList");
                status.save((err,doc)=>{
                    if (!err){
                        console.log("removed after aging")
                    }
                    else{
                        console.log(err)
                    }
                })
            }
        }
    })})
}

module.exports = handleDeleteStatus;