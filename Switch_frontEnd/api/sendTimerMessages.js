import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function sendTimerMessages(mssgObj,selectedContacts,token){
    for (var i=0;i<selectedContacts.length;i++){
        var mssgObj = await mssgObj;
        mssgObj["to"]={userNumber:selectedContacts[i]};
        console.log(selectedContacts.length,"contactsss");
        await axios({
                method:'post',
                url:`${BASE_URL}/addTimmerMessages`,
                headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
                data:{
                mssg:mssgObj
                } 
            })

    }
    return true;
};

