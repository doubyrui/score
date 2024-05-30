//封装axios
import axios from 'axios'
import { httpRequestList } from './clearHttpRequest';
const  {CancelToken}  = axios

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
// 重复请求
const cachePool = new Map()
const encode = (baseURL:any, method:any, url:any, params:any) => {
    const str = `${baseURL}_${url}_${method}_${JSON.stringify(params || {})}`;
    const encoder = new TextEncoder();
    //接受一个字符串作为输入，返回一个包含 UTF-8 编码的文本的 Uint8Array
    const bytes = encoder.encode(str)
    //使用Base64编码算法进行编码:将一个二进制字符串（例如，将字符串中的每一个字节都视为一个二进制数据字节）编码为 Base64 编码的 ASCII 字符串
    const encoded = btoa(String.fromCharCode(...bytes))
    return encoded
}
const configEncode = (config:any) => {
    //获取基本信息
    const baseURL = config.baseURL,
        method = config.method,
        url = config.url,
        params = config?.params || config?.data || {};
    //返回编码结果
    return encode(baseURL, method, url, params);
}
// 重复请求
//请求拦截
http.interceptors.request.use((config):any => {
    // startLoading()
    // config['cancelToken'] = new CancelToken(function executor(cancel) {
    //     httpRequestList.push(cancel) //存储cancle      
    // })
    // 在发送请求之前做些什么
    const controller = new AbortController()
    config.signal = controller.signal
    //根据config配置信息进行编码
    const encodeKey = configEncode(config)
    //判断请求是否存在
    if (cachePool.get(encodeKey)) {
        controller.abort()
    } else {
        cachePool.set(encodeKey, { abort: controller })
    }
    return config
}, (err) => {
    // loading.close()
    return Promise.reject(err)
})
//响应拦截
http.interceptors.response.use((response) => {
    // endLoading()
    // 对响应数据做点什么
    const encodeKey = configEncode(response.config)
    //缓存对象
    const cacheItem = cachePool.get(encodeKey)
    if (cacheItem) {
        console.log("res-success:删除缓存对象")
        cachePool.delete(encodeKey)
    }
    return response.data
}, (err) => {
    // endLoading()
    return Promise.reject(err)
})
export {http,CancelToken}