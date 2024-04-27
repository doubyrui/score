//封装axios
import axios from 'axios'
import { ElLoading } from 'element-plus'
let loading: any
let controller: any = null // 定义全局 AbortController 实例

function startLoading() {
    loading = ElLoading.service(
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
const cachePool = new Map()

const encode = (baseURL: any, method: any, url: any, params: any) => {
    const str = `${baseURL}_${url}_${method}_${JSON.stringify(params || {})}`;
    const encoder = new TextEncoder();
    //接受一个字符串作为输入，返回一个包含 UTF-8 编码的文本的 Uint8Array
    const bytes = encoder.encode(str)
    //使用Base64编码算法进行编码:将一个二进制字符串（例如，将字符串中的每一个字节都视为一个二进制数据字节）编码为 Base64 编码的 ASCII 字符串
    const encoded = btoa(String.fromCharCode(...bytes))
    return encoded
}
const configEncode = (config: any) => {
    //获取基本信息
    const baseURL = config.baseURL,
        method = config.method,
        url = config.url,
        params = config?.params || config?.data || {};
    //返回编码结果
    return encode(baseURL, method, url, params);
}

//请求拦截
http.interceptors.request.use((config): any => {
    console.log(config)
    controller = new AbortController()
    config.signal = controller.signal
    //根据config配置信息进行编码
    const encodeKey = configEncode(config)
    console.log("encodeKey:", encodeKey)
    //判断请求是否存在
    if (cachePool.get(encodeKey)) {
        console.log(controller.abort, '*-*-*-*-');
        controller.abort()

        console.log('cachePool--cancel:', cachePool)
    } else {
        cachePool.set(encodeKey, { abort: controller })
        console.log('cachePool--set:', cachePool)
    }
    // startLoading()
    return config
}, (err) => {
    // loading.close()
    console.log(err, '*-关 ');

    return Promise.reject(err)
})


//响应拦截
http.interceptors.response.use((response) => {
    const encodeKey = configEncode(response.config)
    console.log('response---:', response, encodeKey)
    //缓存对象
    const cacheItem = cachePool.get(encodeKey)
    if (cacheItem) {
        console.log("res-success:删除缓存对象")
        cachePool.delete(encodeKey)
    }


    // endLoading()
    return response.data
}, (error) => {
    // endLoading()
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log('axios-error:', error)
    if (error.code === "ERR_CANCELED") {
        //被取消的axios请求
        console.warn(`被取消的重复请求~`)
    } else {
        //其它错误
        return Promise.reject(error);
    }
    return Promise.reject(error)
})
export default http