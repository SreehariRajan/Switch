const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const userJoiSchema = require('../models/user.model');

const IndexFinder = require('../services/indexFinder');

const messages = mongoose.model("Messages");

router.post('/',verifyToken,(req,res)=>{
    console.log("entered deletinmg");
    // const {error,value} = userJoiSchema.userJoiSchema.validate(req.body);
    if (req.authData.user.phoneNumber===req.body.from && req.body.to && req.body.mssgList)
    // if (req.body.from && req.body.to && req.body.mssgList)
    {
       for (let i =0;i<req.body.mssgList.length;i++){
           messages.findById({_id:req.body.mssgList[i].to.userNumber},
            async(err,doc)=>{
                if (doc){
                    const element = req.body.mssgList[i];
                    console.log("hereeeeeeeeeeeeeeeeeeeeee",element)
                    const from = await req.body.mssgList[i].from.userNumber;
                    console.log(from)
                    const index =await IndexFinder(element,doc.messagesList[from]);
                    if (index !==-1){

                        await doc.messagesList[req.authData.user.phoneNumber].splice(index,1);
                        // await doc.messagesList[from].splice(index,1);

                        doc.markModified("messagesList");
                        doc.save((err,doc)=>{
                            if (doc){
                                res.json("success")
                                console.log("deleted successfully")
                            }
                        })
                    }
                }
            })
       }
    }
    else{
        console.log("handle req body err")
    }
    // res.send("adipoliiii")
});


module.exports = router;