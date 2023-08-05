const mongoose = require('mongoose');
const joi = require('Joi');

joi.objectId = require('joi-objectid')(joi);

const timerMessagesJoiSchema = joi.object({
    to:joi.object().required(),
    message:joi.string().required(),
    starredMessage:joi.boolean().required(),
    replyStatus:joi.boolean().required(),
    DocumentStatus:joi.boolean().required(),
    forwardStatus:joi.boolean().required(),
    repliedFor:joi.object().required(),
    timeObject:joi.object().required(),
    from:joi.object().required(),
    time:joi.string(),
    ImageStatus:joi.boolean().required(),
    image:joi.object().required(),
    document:joi.object().required(),
    audio:joi.object().required(),
    AudioStatus:joi.boolean().required(),
});

const timerMessagesSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    messagesList:{
        type:Object,
    },
});

module.exports.timerMessagesJoiSchema = timerMessagesJoiSchema;
// module.exports.messagesMongooseSchema = messagesSchema;
mongoose.model("TimerMessages",timerMessagesSchema);