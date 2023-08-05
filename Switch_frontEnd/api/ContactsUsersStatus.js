import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function ContactsUsersStatus(phoneContacts,token,userNumber){
    return axios({
        method:'post',
        url:`${BASE_URL}/getStatus`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            usersList:phoneContacts,
            from:userNumber
        } 
    })
}