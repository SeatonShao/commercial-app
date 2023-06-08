import axios from 'axios'
import store from '@/store'
import Vue from 'vue'
import { message, Modal, notification } from 'ant-design-vue' /// es/notification
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 15000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.info('error', error)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 500) {
      if (data.message.length > 0) {
        message.error(data.message)
      }
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  if (response.request.responseType === 'blob') {
    return response
  }
  const resData = response.data
  const code = response.data.code
  if (!store.state.app.hasError) {
    if (code === 1011006 || code === 1011007 || code === 1011008 || code === 1011009) {
      Modal.error({
        title: '提示：',
        content: resData.message,
        okText: '重新登录',
        onOk: () => {
          Vue.ls.remove(ACCESS_TOKEN)
          store.dispatch('SetHasError', false)
          window.location.reload()
        }
      })
      store.dispatch('SetHasError', true)
    }
    if (code === 1013002 || code === 1016002 || code === 1015002) {
      message.error(response.data.message)
      return response.data
    }
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
