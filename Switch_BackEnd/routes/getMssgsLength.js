const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/auth');
const messages = mongoose.model("Messages");
router.get('/:fromNumber/:toNumber',verifyToken,async (req,res)=>{

    const from = await req.authData.user.phoneNumber;
    console.log(req.params.fromNumber,req.params.toNumber)

    if (req.params.fromNumber && req.params.toNumber && from===req.params.fromNumber){
        // const from = req.params.fromNumber;
        const to = req.params.toNumber;


        const toMessage =await  messages.findById(to);
        const fromMessage =await messages.findById(from);
        var combinedMssgList = [];
        var combinedMssgsList = [];
        if (toMessage || fromMessage){
            if (toMessage?.messagesList[from]){
                combinedMssgList = toMessage.messagesList[from];
            }
            if (fromMessage?.messagesList[to]){
                combinedMssgsList= combinedMssgList.concat(fromMessage.messagesList[to]);
                // console.log(combinedMssgList);
            }
            else{
                combinedMssgsList = combinedMssgList;
            }
            if (combinedMssgsList){
                const lengthofArray = combinedMssgsList.length;
                // const toMessageArray = 
                console.log("yessssppppppppppppppppppppppppppppppppppppppppppp",lengthofArray)
                res.json(lengthofArray);
            }
        }
    }
    // res.send("adipoliiii")
});


module.exports = router;