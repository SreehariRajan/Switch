const mongoose = require('mongoose');
const joi = require('Joi');

joi.objectId = require('joi-objectid')(joi);

const messagesJoiSchema = joi.object({
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

const messagesSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    seenLength:{
        type:Object,
        require:true
    },
    messagesList:{
        type:Object,
    },
});

module.exports.messagesJoiSchema = messagesJoiSchema;
// module.exports.messagesMongooseSchema = messagesSchema;
mongoose.model("Messages",messagesSchema);