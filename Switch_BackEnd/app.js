const connection = require('./models');
const express = require('express');
const App = express();
const server = require('http').createServer(App);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const Cors = require('cors');

require('dotenv').config();

const jwt = require("jsonwebtoken");

const socketioJwt = require('socketio-jwt');

const mongoose = require('mongoose');
const messagesJoiSchema = require('./models/messages.model');
// const messagesMongooseSchema = mongoose.model("Messages")
const messages = mongoose.model("Messages")
// mongod --dbpath F:\Softwares\mongodb\datas\db


const createAcc = require('./routes/createAcc');
const updateAcc = require('./routes/updateAcc');
const getUsers = require('./routes/getUsers');
const getUser = require('./routes/getUser');
const getStatus = require('./routes/getStatus');
const getMessages = require('./routes/getMessages');
const getTimerMessages = require('./routes/getTimerMssgs');
const getUserStatus = require('./routes/getUserStatus');
const getMssgsLength = require('./routes/getMssgsLength');
const getMssgDemo = require('./routes/getMssgDemo');
const getSeenLength = require('./routes/getSeenLength');
const getLastSeen = require('./routes/getLastSeen');
const deleteMssgs = require('./routes/deleteMssgs');
const deleteStatus = require('./routes/deleteStatus');
const deleteTimmerMssgs = require('./routes/deleteTimerMessage');
const addTimerMssgs = require('./routes/addTimerMessages');
const updateTimmerMssg = require('./routes/updateTimmerMssg');
const getOtp = require("./routes/getOtp");
const verifyOtp = require("./routes/verifyOtp");

const handleDeleteStatus = require('./services/handleDeleteStatus');
const handleTimerMssgsSend = require('./services/handleTimerMssgsSend');
//
App.use(Cors());
App.use(bodyParser.json());

// setInterval(()=>handleDeleteStatus(),60000);
// setInterval(()=>handleTimerMssgsSend(io),1000);

// App.use(bodyParser.urlencoded({
//     extended:true
// }));

//socket function 
// io
//     .of('/messageSocket/connect')
//     .on("connection",socket=>{
//         require('./socketio/messageSocket')(socket,io);
io
    .of('/messageSocket/connect')
    .use(async(socket,next)=>{
        console.log(socket.handshake.auth.token)
        const token = await socket.handshake.auth.token;
        // console.log(token)
        if (typeof(token)==="string" && socket.handshake.query?.userNumber){
            jwt.verify(token,process.env.JWT_SECRET,(err,authData)=>{
                if (!err && authData){
                    console.log("what yes")
                    if (authData.user.phoneNumber===socket.handshake.query.userNumber){
                        socket.authData=authData;
                        console.log("watyes nooo")
                        next();
                    }
                    else{
                        console.log("failed")
                        return next(new Error("Authentication error"))
                    }
                }
                else{
                    console.log("what nooo",err)
                    return next(new Error("Authentication error"))
                }
            })
        }
        else{
            console.log("no jwt")
        }
    })
    .on("connection",socket=>{
    require('./socketio/messageSocket')(socket,io);
})

io
    .of('/statusSocket/connect')
    .use(async(socket,next)=>{
        const token = await socket.handshake.auth.token;

        if (typeof(token)==="string" && socket.handshake.query?.userNumber){
            jwt.verify(token,process.env.JWT_SECRET,(err,authData)=>{
                if (!err && authData){
                    if (authData.user.phoneNumber===socket.handshake.query.userNumber){
                        socket.authData=authData;
                        next();
                    }
                    else{
                        return next(new Error("Authentication error"))
                    }
                }
                else{
                    return next(new Error("Authentication error"))
                }
            })
        }
        else{
            console.log("no jwt")
        }
    })
    .on("connection",socket=>{
    require('./socketio/statusSocket')(socket,io);
})

App.use('/getOtp',getOtp);
App.use('/verifyOtp',verifyOtp);
App.use('/createAcc',createAcc);
App.use('/updateAcc',updateAcc);
App.use('/getUsers',getUsers);
App.use('/getUser',getUser);
App.use('/getStatus',getStatus);
App.use('/getUserStatus',getUserStatus);
App.use('/getMessages',getMessages);
App.use('/getMessagesLength',getMssgsLength);
App.use('/getSeenLength',getSeenLength);
App.use('/getLastSeen',getLastSeen);
App.use('/getMessageDemo',getMssgDemo);
App.use('/deleteMssgs',deleteMssgs);
App.use('/deleteStatus',deleteStatus);
App.use('/deleteTimmerMssgs',deleteTimmerMssgs);
App.use('/addTimmerMessages',addTimerMssgs);
App.use('/getTimmerMessages',getTimerMessages);
App.use('/updateTimmerMssg',updateTimmerMssg);

const port = 3000;
server.listen(port,()=>{console.log("Server started")});
// App.listen(port,()=>{
//     console.log('server started at'+port)
// })