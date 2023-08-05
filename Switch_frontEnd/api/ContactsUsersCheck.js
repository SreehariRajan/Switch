import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default async function ContactsUsersCheck(phoneContacts,token,userNumber){
    return axios({
        method:'post',
        url:`${BASE_URL}/getUsers`,
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
        data:{
            users:phoneContacts,
            from:userNumber
        } 
    })
    // const response =await fetch(
    //     "http://192.168.1.8:3000/getUsers",
    //     {method:"POST",
    //     headers:{"Content-Type":"application/json"},
    //     body:JSON.stringify({
    //         users:phoneContacts
    //     }), }
    // );
    // console.log("xdfg",response)
    // return response.json();
};