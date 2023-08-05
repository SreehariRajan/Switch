const mongoose = require('mongoose');
const joi = require('Joi');

joi.objectId = require('joi-objectid')(joi);

const statusJoiSchema = joi.object({
    phoneNumber:joi.string().required(),
    userName:joi.string().required(),
    imageLocation:joi.string(),
    content:joi.string(),
    time:joi.string(),
    timeObject:joi.object(),
    contacts:joi.array()
});

const statusMongooseSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    statusList:{
        type:Array,
    },
    // seen:{
    //     type:Array
    // }
    // userName:{
    //     type:String,
    //     required:true
    // },
    // imageLocation:{
    //     type:String,
    // },
    // content:{
    //     type:String
    // },
});

module.exports.statusJoiSchema = statusJoiSchema;
mongoose.model("Status",statusMongooseSchema);
