const mongoose = require('mongoose');
const joi = require('Joi');

joi.objectId = require('joi-objectid')(joi);

const userJoiSchema = joi.object({
    phoneNumber:joi.string().required(),
    userName:joi.string().required(),
    imageLocation:joi.string().required(),
    lastSeen:joi.object()
});

const userMongooseSchema = new mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    imageLocation:{
        type:String,
        required:true
    },
    lastSeen:{
        type:Object
    }
});

module.exports.userJoiSchema = userJoiSchema;
// module.exports.createAccMongooseSchema = createAccMongooseSchema;
mongoose.model("Users",userMongooseSchema);
