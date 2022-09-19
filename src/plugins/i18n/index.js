import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
// 引入各个语言配置文件
import zh from './languages/zh';
import en from './languages/en';

import enLocale from 'element-ui/lib/locale/lang/en'
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'

const langFiles = require.context('./languages', false, /\.js$/)
const regExp = /\.\/([^\.\/]+)\.([^\.]+)$/
const messages = {}
const lang = {
  zh: zhCNLocale,
  en: enLocale
}
// 默认语言
const loadLanguage = 'zh'

langFiles.keys().forEach(key => {
  const k = regExp.exec(key)[1]
  // 合并Element国际化配置
  messages[k] = Object.assign(langFiles(key).default, lang[k])
})

function getLanguage() {
  // 第一次进入页面或手动清除设置默认语言
  if(!localStorage.getItem('locale')){
    localStorage.setItem('locale', loadLanguage)
  }
  let locale = localStorage.getItem('locale')
  if (!(locale in messages)) locale = loadLanguage
  return locale
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})


export default i18n
