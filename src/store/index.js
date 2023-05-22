import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用于数据的存储
    token: '', // 保存token字符串
    userInfo: {}// 用来保存用户信息
  },
  getters: {
    // 用来获取和保存数据
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 改变state中存储的数据的唯一途径，不能处理异步事件
    // 保存token
    updateToken (state, val) {
      state.token = val
    },
    updateUserInfo (state, val) {
      state.userInfo = val
    }
  },
  actions: {
    // 用于提交mutations来改变状态，不直接变更状态，可以包含任何异步操作
    // 用来请求用户的信息
    async getUserInfoActions (store) {
      const res = await getUserInfoAPI()
      console.log(res)
      store.commit('updateUserInfo', res.data.data)
    }
  },
  modules: {
    // 用于项目中将各个模块分开定义和操作
  },
  plugins: [createPersistedState()]

  // 注入持久化插件
})
