import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugin/createIcon'
import './plugin/createService'
import vuetify from './plugin/createVuetify'
import tools from '@/tools'
import './style/mp.sass'
const { log } = tools

log.default('>>> 我是一些默认提示')
log.primary('>>> 我是一些标记提示')
log.success('>>> 我是一些成功提示')
log.warning('>>> 我是一些警告提示')
log.danger('>>> 我是一些错误提示')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
