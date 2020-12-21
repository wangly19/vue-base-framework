import asyncAxiosInstance from '@/plugin/createService'
import currentModels from '@/plugin/createModel'
/**
 * 获取当前开发环境状态
 * @example
 * getEnv()
 * @export { Function } getEnv 当前环境方法【开发环境】【测试环境】【生产环境】
 * @return {String} 当前环境【dev】【test】【pro】
 */
export function getEnv () {
  return process.env.VUE_APP_MODE || 'dev'
}

/**
 * 处理异步任务中间件
 * @param { Promise } promise 异步任务
 * @returns { Array<any> }
 */
export function promiseMiddleware (promise) {
  return promise
    .then(res => [res, null])
    .catch(err => [null, err])
}

/**
 * 获取当前请求接口
 * @example
 * const [success, error] = getService('getPerson')
 * @returns { Object }
 */
export function useServices (name, payload = {}) {
  if (!name) {
    return asyncAxiosInstance
  }
  if (Object.hasOwnProperty.call(asyncAxiosInstance, name)) {
    return promiseMiddleware(asyncAxiosInstance[name](payload))
  } else {
    console.error(`>>> ${name} API不存在，请检查方法名称`)
  }
  return [null, null]
}

/**
 * 允许当前组件使用model数据依赖
 * @param { object } component 当前的Vue组件
 * @param { Array<string> } models 需要注入的模块
 * @param { boolean } isDispatch 是否开启dispatch
 * @returns { object }
 */
export function useModels (component, models, isDispatch = true) {
  const current = []
  currentModels.forEach(item => {
    if (models.includes(item.name)) {
      current.push(item.mixin)
    }
  })
  if (isDispatch && current.length > 0) {
    current.push(currentModels[0].mixin)
  }
  console.log(current)
  if (component?.mixins) {
    const preMixin = component.mixins
    component.mixins = current.concat(preMixin)
    return component
  }
  component.mixins = [...current]
  console.log(component)
  return component
}
