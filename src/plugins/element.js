import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css'
import i18n from './i18n'
import '@/styles/element-variables.scss'
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
  size: 'mini'
})
