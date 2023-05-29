//封装axios
import axios from 'axios'
import { ElLoading } from 'element-plus'
let loading:any
function startLoading() {
    loading=ElLoading.service(
      {
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      }
    )
}
function endLoading() {
    loading.close()
}
const http = axios.create({
    baseURL: '/native', //请求的基础路径
    timeout: 10000, //请求超时时间
    withCredentials: true, //异步请求是否携带cookie
})
//请求拦截
http.interceptors.request.use((config):any => {
    startLoading()
    return config
}, (err) => {
    loading.close()
    return Promise.reject(err)
})
//响应拦截
http.interceptors.response.use((res) => {
    endLoading()
    return res.data
}, (err) => {
    endLoading()
    return Promise.reject(err)
})
export default http