import Axios from 'axios'
// import Qs from 'qs'
// import Store from '@/store'
import { getEnv } from '@/plugin/Framework'
import tools from '@/tools'
import { withCredentials, timeout, codeMessage, baseURL } from '@/config/http'

function handleError (error, msg) {
  // 添加到日志
  // Store.dispatch('logs/push', {
  //   message: msg,
  //   type: 'danger'
  // })
  if (getEnv() === 'dev') {
    tools.log.danger('>>>>>> HTTP Error >>>>>>')
    console.log(error)
  }
}

function createService (settings) {
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
        console.log('>>>: 自定义错误信息，全局提示处理', message)
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

const http = createService({
  withCredentials,
  timeout,
  baseURL
})

export function httpRequestQuery (url, method = 'GET', query) {
  return http({
    url,
    params: query
  })
}

export function httpRequestBody (url, method = 'POST', body, params = '') {
  return http({
    url: `${url}${params}`,
    method: method,
    data: body
  })
}

export default http
