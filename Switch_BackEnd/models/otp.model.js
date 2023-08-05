const mongoose = require('mongoose');
// const joi = require('Joi');

// joi.objectId = require('joi-objectid')(joi);

// const userJoiSchema = joi.object({
//     phoneNumber:joi.string().required(),
//     userName:joi.string().required(),
//     imageLocation:joi.string().required(),
//     lastSeen:joi.object()
// });

const otpMongooseSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    time:{
        type:Number,
        required:true
    }
});

// module.exports.userJoiSchema = userJoiSchema;
// module.exports.createAccMongooseSchema = createAccMongooseSchema;
mongoose.model("Otp",otpMongooseSchema);
