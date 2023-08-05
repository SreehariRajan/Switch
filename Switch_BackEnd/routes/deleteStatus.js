const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const Status = mongoose.model("Status");

router.post('/',verifyToken,(req,res)=>{
    console.log("entered deletinmg");
    // const {error,value} = userJoiSchema.userJoiSchema.validate(req.body);
    if (req.authData.user.phoneNumber===req.body.from && req.body.statusObject)
    // if (req.body.from && req.body.to && req.body.mssgList)
    {
           Status.findById({_id:req.body.from},
            async(err,doc)=>{
                if (doc){
                    const element =await req.body.statusObject;
                    console.log("hereeeeeeeeeeeeeeeeeeeeee",element)
                    const from = await req.body.from;
                    console.log(from)
                    const index =await doc.statusList.findIndex((ele,ind)=>
                        ele.timeObject.Time===element.timeObject.Time && 
                        ele.imageLocation===element.imageLocation
                    );
                    console.log("indddddddddddddddddddd",index);
                    if (index !==-1){

                        await doc.statusList.splice(index,1);
                        // await doc.messagesList[from].splice(index,1);
                        doc.markModified("statusList");
                        doc.save((err,doc)=>{
                            if (doc){
                                res.status(200).json({message:"deleted successfully"})
                                console.log("deleted successfully")
                            }
                        })
                    }
                    else{
                        res.status(200).json({message:"Status Not Found"})
                    }
                }
                else{
                    res.status(200).json({message:"Status Not Found"})
                }
            })
       
    }
    else{
        res.status(400).json({message:"bad request"})
    }
    // res.send("adipoliiii")
});


module.exports = router;