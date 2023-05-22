// 基于axios封装网络请求的函数
import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'
import { Message } from 'element-ui'
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL: baseURL
})
// 定义请求拦截器
// 每次调用request都会先走这个请求拦截器
myAxios.interceptors.request.use(function (config) {
  // 在请求前会触发一次
  // 返回给axios内源码，
  // config配置对象（要请求后台的参数都在这个对象上），根据配置项发起请求
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 发起请求的代码，如果有异常就会进入到这里
  // 返回一个拒绝状态的Promise对象
  return Promise.reject(error)
})
// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
  // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
  return response
}, function (error) {
  // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
  if (error.response.status === 401) {
    // 身份验证过期，清除vuex里的一切，回到登录页面
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
    router.push('/login')
    Message.error('用户身份已过期')
  }
  return Promise.reject(error)
})
// 导出axios自定义函数
export default myAxios
