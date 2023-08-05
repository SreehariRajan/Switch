import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default function verifyOTP(numberText,otp){
    return axios({
        method:'post',
        url:`${BASE_URL}/verifyOtp`,
        headers:{'Content-Type':'application/json'},
        data:{
            phoneNumber:numberText,
            otp:otp,
        } 
    })
}
