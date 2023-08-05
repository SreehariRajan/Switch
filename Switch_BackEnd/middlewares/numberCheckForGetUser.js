

function CheckNumber(req,res,next){
    console.log("entered");
    var usersList = [];
    if (req.body.users){
        for (const Contactuser of req.body.users){
            if (Contactuser.phoneNumbers && Contactuser.phoneNumbers[0].number){
                var number = Contactuser.phoneNumbers[0].number.replace(/\s+/g,"");
                // console.log("entered",Contactuser);
                // console.log("000",number.length===13,number.substring(0,3)==="+91")
                var userName = "";
                if (Contactuser.firstName){
                    if (Contactuser.lastName){
                        userName = Contactuser.firstName+" "+Contactuser.lastName;
                    }
                    else{
                        userName=Contactuser.firstName;
                    }
                }
                if (number.length===13 & number.substring(0,3)==="+91"){
                    // console.log("one","helloooooooooooooooooooooooooooooooooooooooooo")
                    usersList.push({name:userName,phoneNumber:number});
                }
                else if (number.length === 10){
                    usersList.push({name:userName,phoneNumber:"+91"+number});
                }
            }
        }
        req.usersList = usersList;
        console.log("entered final");
        next();
    }
    else{
        console.log("entered loss");
        //status return
    }
}

module.exports = CheckNumber;