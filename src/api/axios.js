import axios from "axios";

const api=axios.create({
    //baseURL:"http://127.0.0.1:5000",
    baseURL:"https://arsbegars.pythonanywhere.com",
    headers: {"Content-Type": "application/json",},
    withCredentials: false,
});

export default api;