import axios from 'axios'
import router from '../router'
import {baseUrl} from "../config/env";

// create an axios instance
const service = axios.create({
    baseURL: baseUrl, // api 的 base_url
    timeout: 50000,// request timeout
})
// request interceptor
service.interceptors.request.use(
    config => {
        // Do something before request is sent
        let token =  sessionStorage.getItem('token');
        if (token) {
            // 让每个请求携带Authorization为自定义key 请根据实际情况自行修改
            config.headers['Authorization'] = 'bearer ' + token;
        }else{
            router.replace({
                path: '/'
            });
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)
// response interceptor
service.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace({
                        path: '/login'
                    })
                    window.location.href = '/'
                case 400:
                    router.replace({
                        path: '/login'
                    })
                    window.location.href = '/'
            }
        }
        return Promise.reject(error)
    }
)
export default service
