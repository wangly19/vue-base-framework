/**
 * 获取当前开发环境状态
 * @export { Function } getEnv 当前环境方法【开发环境】【测试环境】【生产环境】
 * @return {String} 当前环境【dev】【test】【pro】
 */
export function getEnv () {
  return process.env.VUE_APP_MODE || 'dev'
}
