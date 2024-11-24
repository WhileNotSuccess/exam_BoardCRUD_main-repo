import axios from "axios";

export const Axios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
    withCredentials: true,
    headers:{
        'Content-Type':'application/json'
    }
})