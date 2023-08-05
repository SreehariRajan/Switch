import axios from 'axios';
import { BASE_URL } from '../constants/urls';
export default function sendOtp(numberText){
    return axios({
        method:'get',
        url:`${BASE_URL}/getOtp/${numberText}`,
        headers:{'Content-Type':'application/json'},
    })
}