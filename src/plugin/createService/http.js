import Axios from 'axios'
// import Qs from 'qs'
import Store from '@/store'
import { getEnv } from '@/plugin/Framework'
import tools from '@/tools'
import { withCredentials, timeout, codeMessage, baseURL } from '@/config/http'

/**
 * 异常错误处理
 * @example
 * handleError ('我发生了错误', '后端约定message')
 * @param { string } error console错误信息
 * @param { string } msg 后端message捕获
 */
function handleError (/* @type { string } */ error, /* @type { string } */msg) {
  if (getEnv() === 'dev') {
    tools.log.danger('>>>>>> HTTP Error >>>>>>')
    console.log(error, msg)
  } else {
    Store.dispatch('logs/push', {
      message: msg,
      type: 'danger'
    })
  }
}

/**
 * HTTP请求处理
 * @param { object } settings 请求设置
 * @param { string } [settings.withCredentials] 安全策略
 * @param { number } [settings.timeout] 超时时间
 * @param { string } [settings.baseURL] 接口地址
 * @return { Promise } HTTP请求方法
 */
function createHttpService (/* @type { object } */settings) {
  const service = Axios.create(settings)
  service.interceptors.request.use(
    config => {
      // TODO: 添加token
      const token = localStorage.getItem('access_token')
      config.headers.token = token
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      console.log(response)
      const { code, message, data } = response.data
      // 自定义提示
      if (code >= 30000) {
        console.log('>>> 自定义错误信息，全局提示处理', message)
        return data
      }
      // 正常的code
      if (code >= 200 && code < 300) {
        return data
      }

      // 错误的code, 自己处理
      if (code >= 300 && code < 600) {
        return Promise.reject(response.data)
      }
    },
    error => {
      const { status = 404 } = error?.response
      if (Object.prototype.hasOwnProperty.call(codeMessage, status)) {
        handleError(error, codeMessage[status])
      }
      throw error
    }
  )
  return service
}

const http = createHttpService({
  withCredentials,
  timeout,
  baseURL
})

export default http
