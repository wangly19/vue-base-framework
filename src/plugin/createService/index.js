import tools from '@/tools'
import { getEnv } from 'framework'
import http from './http'
const { log } = tools

/**
 * @description 创建HTTP请求服务
 * @class CreateService
 */
class CreateService {
  /**
   * @constructor
   */
  constructor () {
    /**
     * @property { array[] } allApi 所有api列表
     */
    this.allApi = []
  }

  /**
   * @description 查找api目录下所有的接口数据
   * @property { funcion } queryAllApi 查找api目录下所有的接口数据
   * @return { void }
   */
  queryAllApi () {
    const files = require.context('@/api', false, /.js$/)
    files.keys().forEach(name => {
      const api = files(name).default
      Object.keys(api).forEach(key => {
        this.parseRequestConfig(key, api[key])
      })
    })
  }

  /**
   * @description 转换所有参数成有序数据
   * @property { parseRequestConfig } queryAllApi 转换所有参数成有序数据
   * @param { string } key 约定式名称，对象key值
   * @param { string } value 约定式地址，对象value值
   * @return { void }
   */
  parseRequestConfig (key, value) {
    const splitValue = value.split(' ')
    if (splitValue.length === 2) {
      const [method, url] = splitValue
      // while (res = /\/g.exec(url))
      const [parseURL, ...parseParams] = url.split('/:')
      this.allApi.push({
        name: key,
        url: parseURL,
        method,
        serialization: parseParams || []
      })
    } else if (getEnv() === 'dev') {
      log.warning('>>>>>> API约定式警告，当前接口存在错误的约束 >>>>>>')
      console.log('异常约束名称:', key, '异常约束值:', value)
    }
  }

  /**
   * @description 生成Http函数方法
   * @property { funcion } generateAsyncHttpFunction 生成Http函数方法
   * @return { Array<Promise> }
   */
  generateAsyncHttpFunction () {
    const asyncAxiosInstance = {}
    this.allApi.forEach(({ name, method, url, serialization }) => {
      switch (method) {
        case 'POST':
          asyncAxiosInstance[name] = body => {
            return http({
              url,
              method,
              data: body
            })
          }
          break

        case 'PUT':
          asyncAxiosInstance[name] = body => {
            if (getEnv() === 'dev') {
              this.verifyParams(name, serialization, Object.keys(body))
            }
            let stringifyParams = ''
            serialization.forEach(name => {
              stringifyParams += `/${body[name]}`
              delete body[name]
            })
            return http({
              url: `${url}${stringifyParams}`,
              method,
              data: body
            })
          }
          break

        case 'DELETE':
          asyncAxiosInstance[name] = body => {
            if (getEnv() === 'dev') {
              this.verifyParams(name, serialization, Object.keys(body))
            }
            let stringifyParams = ''
            serialization.forEach(name => {
              stringifyParams += `/${body[name]}`
              delete body[name]
            })
            return http({
              url: `${url}${stringifyParams}`,
              method
            })
          }
          break

        default:
          asyncAxiosInstance[name] = payload => {
            return http({
              url,
              method,
              params: payload
            })
          }
          break
      }
    })
    return asyncAxiosInstance
  }

  /**
   * @description 检查当前约定式params是否存在缺失
   * @property { funcion } verifyParams
   * @param { string } name 方法名称
   * @param { array } serialization 约定式中的key
   * @param { array } keys 传入参数的所有key
   * @returns { void }
   */
  verifyParams (name, serialization, keys) {
    const isError = serialization.some(key => keys.indexOf(key) !== -1)
    if (isError) {
      log.warning('>>>>>> API约定式警告，当前接口存在Params参数缺失 >>>>>>')
      console.log('错误接口名称:', name)
    }
  }

  /**
   * @description 测试环境下输出所有api列表
   * @property { funcion } output 测试环境下输出所有api列表
   * @returns { void }
   */
  output () {
    log.success(`>>>>>> ${process.env.VUE_APP_VERSION}接口列表 >>>>>>`)
    console.table(this.allApi, ['name', 'url', 'method'])
  }
}

const createService = new CreateService()

createService.queryAllApi()

createService.output()

const asyncAxiosInstance = createService.generateAsyncHttpFunction()

export default asyncAxiosInstance
