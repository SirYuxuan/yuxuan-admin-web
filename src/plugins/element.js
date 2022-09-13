import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css'

import '@/styles/element-variables.scss'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, {
  size: 'small',
  locale: locale
})
