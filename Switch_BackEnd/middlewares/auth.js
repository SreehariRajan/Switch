const jwt = require('jsonwebtoken');

async function verifyToken(req,res,next){
    //get auth header value
    // console.log("check plsss",req.body,req.params)
    
    const bearerHeader =await req.headers['authorization'];
    if (bearerHeader !==undefined){
        const bearer =await bearerHeader.split(" ");
        const bearerToken =await bearer[1];
        // req.token = bearerToken;
        // console.log("yesss",bearerToken)
        jwt.verify(bearerToken,process.env.JWT_SECRET,(err,authData)=>{
            if (err){
                console.log("pppppppppppp",err,bearerHeader)
                res.status(403);
            }
            else{
                req.authData = authData;
                console.log(authData);
                next();
            }
        })

    }
    else{
        //forbidden
        console.log("not")
        res.status(403);
    }
}

module.exports=verifyToken;