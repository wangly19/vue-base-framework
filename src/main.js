import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './plugin/createService/http'
import './plugin/createService'

console.log(http)
// eslint-disable-next-line no-unused-expressions
http({
  url: '/person',
  method: 'GET',
  params: {
    url: 'www.baidu.com'
  }
}).then(res => {
  console.log(res)
})

Vue.config.productionTip = false

console.log(process.env)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
