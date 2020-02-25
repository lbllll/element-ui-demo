import { login, logout, getInfo, userPermission } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Loading } from 'element-ui';

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  navIndex: '',
  route: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SetNavIndex: (state, navIndex) => {
    state.navIndex = navIndex
  },
  SET_ROUTE: (state, route) => {
    state.route = route
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      try {
        let url = '/api/sys/session'
        login({ userName: username, password: password }, url).then(response => {
          const { data } = response;
          if(response.data.isSuccessful!=='Y'){
            reject(response.data);
            return
          }
          setToken(data.access_token)
          window.sessionStorage.setItem('avatar',response.data.headPath);
          window.sessionStorage.setItem('token',response.data.access_token);
          commit('SET_AVATAR', response.data.headPath)
          commit('SET_ROUTE', response.data.sysPermissionList)
          window.sessionStorage.setItem('route', JSON.stringify(response.data.sysPermissionList))
          resetRouter();
          resolve();
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        console.log(error);
      }

    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROUTE', [])
      window.sessionStorage.setItem('route', JSON.stringify([]))
      removeToken()
      resetRouter()
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

