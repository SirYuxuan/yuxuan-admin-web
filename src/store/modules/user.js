/**
 * @author
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import i18n from '@/plugins/i18n'
import { getUserInfo, login, logout } from '@/api/system/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'

const state = () => ({
  accessToken: getAccessToken(),
  nickName: '',
  avatar: '',
  permissions: [],
})
const getters = {
  accessToken: (state) => state.accessToken,
  nickName: (state) => state.nickName,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setNickName(state, nickName) {
    state.nickName = nickName
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
}

const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions)
  },
  async login({ commit }, userInfo) {

    const { data } = await login(userInfo)
    const accessToken = data[tokenName]
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'

      Vue.prototype.$baseNotify(i18n.t('public.welcome',[title]), `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  async getUserInfo({ commit, state }) {
    const { data } = await getUserInfo(state.accessToken)
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let { permissions, nickName, avatar } = data
    if (permissions && nickName && Array.isArray(permissions)) {
      commit('setPermissions', permissions)
      commit('setNickName', nickName)
      commit('setAvatar', avatar)
      return permissions
    } else {
      Vue.prototype.$baseMessage('用户信息接口异常', 'error')
      removeAccessToken()
      await Vue.prototype.$router.push('/login')
      return false
    }
  },
  async logout({ dispatch }) {
    await logout(state.accessToken)
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default { state, getters, mutations, actions }
