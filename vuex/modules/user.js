import { request_v2 } from '../../utils/request.js'
import store from '../index'
const state = {
  userInfo: {},
  blueStatus:false,
  isTongji: false,
  inviterId: '' ,//邀请人id
  allowDel:false,//操作权限
  hospital_id:0,//医院id
  home_title:'发现',
}
const getters = {
  userInfo: (state) => state.userInfo,
  inviterId: (state) => state.inviterId
}
const mutations = {
	setBlueStatus(state, blueStatus) {
    console.log(blueStatus, 'blueStatus')
    state.blueStatus = blueStatus
  },
  sethospital_id(state, data) {
    console.log(data, '医院id')
    state.hospital_id = data
  },
  setUserInfo(state, data) {
    console.log(data, '获取用户信息')
    state.userInfo = data
  },
  setInviterId(state, data) {
    console.log(data, '扫码跳转的id')
    state.inviterId = data
  },
  setIsTongji(state, data) {
    console.log(data, '是否是同济医院')
    state.isTongji = false
  },
  savehome_title(state,data){
	  state.home_title = data
  }
}
const actions = {
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      request_v2({
        url: '/ApiV3/Mobile/User/info',
		method:'get',
        loading: false,
        data: {
          role_id: Number(uni.getStorageSync('currentRoleId')) || 1
        }
      })
        .then((res) => {
          // if (res.data.role_id == 3) {
          // 	res.data.role_id = 2
          // }
		  //对比缓存的imUid
		  let newMsgId ;
		  let oldimUid = uni.getStorageSync('imUid')
		  let imUid =  res.data.id
		  if(oldimUid != imUid){
		  	newMsgId = 0 //重置为0
		  }else{
		  	newMsgId = uni.getStorageSync('newMsgId') || 0
		  }
		  store.commit('setImUid', imUid)
		  store.commit('setnewMsgId',newMsgId)
          const userId = res.data.role_id === 1 ? res.data.id : res.data.admin_im_id
		  
          commit('setTimLoginUserId', userId)
          commit('setUserInfo', res.data)
          uni.setStorageSync('userInfo', res.data)
          uni.setStorageSync('role_id', res.data.role_id)
		  
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  logout(params, tim) {
    console.log('退出登录')
    uni.clearStorageSync()
    params.commit('setUnreadCount', 0)
    params.commit('setUserInfo', [])
    // tim.logout()
    uni.reLaunch({
      url: '/pages/login/index'
    })
  },
  removeUserInfo(state) {
    uni.removeStorageSync('token')
    state.commit('setUserInfo', [])
    state.commit('setUnreadCount', 0)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
