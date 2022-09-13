import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import i18n from './plugins/i18n/index'

import '@/layouts/export'
import permission from './components/Permission'
import dict from './components/Dict'
Vue.use(permission)
Vue.use(dict)

Vue.config.productionTip = false

new Vue({
  el: '#yuxuan-admin-app',
  router,
  store,
  i18n,
  render: (h) => h(App),
})
