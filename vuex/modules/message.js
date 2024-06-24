import { request_v2 } from '../../utils/request.js'
import { decodeElement } from '../../utils/decodeElement'


import user from './user.js'
function messagePushStorageData(timLoginUserId, currentConversationID, message) {
  const storageName = `MESSAGELIST_${timLoginUserId}_${currentConversationID}`
  if (uni.getStorageSync(storageName)) {
    const messageList = uni.getStorageSync(storageName)
    messageList.push(message)
    uni.setStorageSync(storageName, messageList)
  } else {
    uni.setStorageSync(storageName, [message])
  }
}
//根据id去重
function Arrunique(arr){
	let newArr = []
	arr.map(v=>{
		if(newArr.find(res=>res.friend_user_id === v.friend_user_id)){
			
		}else{
			newArr.push(v)
		}
	})
	return newArr
}
function getLocalMessageList(){
	return  uni.getStorageSync('messageList'+uni.getStorageSync('imUid')) && JSON.parse(uni.getStorageSync('messageList'+uni.getStorageSync('imUid'))) || []
}
function getLocalMsgList(){
	return  uni.getStorageSync('msg'+uni.getStorageSync('imUid')) && JSON.parse(uni.getStorageSync('msg'+uni.getStorageSync('imUid'))) || []
}
const saveMessage = (messageList,msg,allMsg)=> {
				messageList.forEach(res => {
					//设置删除弹框隐藏
					res.show = false
					if (msg.find(v => v.from_user_id === res.friend_user_id)) { //找出最新的一条消息
						let obj = msg.find(v => v.from_user_id === res.friend_user_id)

						res.msg = obj.body
						res.created_at = obj.created_at
						res.status = obj.status
						//未读获取全部status = 0
						//如果当前用户是本人 则全部设置为已读
						if (res.friend_user_id === uni.getStorageSync('imUid')) {
							res.num = 0
						} else {
							let msgAll = allMsg
							let unread = msgAll.filter(v =>v.from_user_id === res.friend_user_id && v.status === 0).length
							
							 res.num= unread
							// res.num = parseInt( (res.num || 0) + localMsg.filter(v => v.from_user_id === res
							// 	.friend_user_id && v.status === 0).length)
						}

					} else if(Object.keys(res.msg).length) { //原来的旧消息
						
					}else{//没有消息的数据
						res.msg = {}
						res.created_at = ''
						res.status = 1
						//未读获取全部status = 0
						res.num = 0
					}

					//构造有表情的dom
					if (res?.msg?.type === 'TEXT') {

						res.virtualDom = decodeElement({type:'TIMTextElem',payload:{text:res.msg.text}})

					}
				})
				
			}
//获取好友聊天信息
const getFriendMsg = (friend_id) =>{
		return new Promise((resolve, reject) => {
			request_v2({
				url: '/ApiV3/Mobile/Chat/friendInfo',
				method: 'get',
				data: {
					friend_id
				}
			}).then(res => {
				resolve(res.data)
			})
		})

	}
// function unique(arr) {
//   for (var i = 0; i < arr.length; i++) {
//     for (var j = i + 1; j < arr.length; j++) {
//       if (arr[i].conversationID == arr[j].conversationID) {
//         if (arr[i].lastMessage.lastTime < arr[j].lastMessage.lastTime) {
//           arr[i] = arr[j]
//         } else if (arr[i].lastMessage.lastTime === arr[j].lastMessage.lastTime) {
//           if (!arr[j].save) {
//             arr[i] = arr[j]
//           }
//         }
//         arr.splice(j, 1)
//         j--
//       }
//     }
//   }
//   arr.forEach((item) => {
//     item.save = true
//   })
//   return arr
// }

const state = {
	ImpopY:0,
	closeImpopType:false,
	newMsg:[],
	hide:false,
	imUid:'',
	messageList: getLocalMessageList(),
	unReadNum: 0,//未读
	newMsgId:0,//最新聊天id
	msg:  getLocalMsgList(),
  conversationList: [], //会话列表
  unreadCountTotal: 0, // 未读消息数量
  timLoginUserId: null, //登录tim的userid
  TimReady: false, //tim的sdk是否准备好
  currentMessageList: [], //当前正在聊天的消息列表
  currentConversationID: null, // 当前聊天对话ID
  distanceTime: 5 * 60, //间隔5分钟显示一条消息的时间
  messageLastTime: 0 //最近一个展示时间的消息中的时间
}
const getters = {
  TimReady: (state) => state.TimReady,
  currentMessageList: (state) => state.currentMessageList
}
const mutations = {
  // 会话列表更新
  updateConversationList(state, list = []) {
    const currentConversationStorageName = `CONVERSATION_${state.timLoginUserId}`
    const storageConverSationList = uni.getStorageSync(currentConversationStorageName) || []
    // 合并 去重 排序
    // const conversationList = unique([...list, ...storageConverSationList])
    conversationList.sort(function (a, b) {
      return b.lastMessage.lastTime - a.lastMessage.lastTime
    })
    uni.setStorageSync(currentConversationStorageName, conversationList)
    state.conversationList = conversationList
    const unreadCountTotal = conversationList.reduce((total, item) => {
      return total + item.unreadCount
    }, 0)
    state.unreadCountTotal = unreadCountTotal
    // const isReadFlag = conversationList.some(someItem => {
    // 	return someItem.unreadCount > 0
    // })
    // if (isReadFlag) {
    // 	uni.showTabBarRedDot({
    // 		index: 1
    // 	})
    // } else {
    // 	uni.hideTabBarRedDot({
    // 		index: 1
    // 	})
    // }
  },
  // 设置未读总数
  setUnreadCount(state, total) {
    state.unreadCountTotal = total
  },
  // 历史头插消息列表
  unshiftMessageList(state, messageList) {
    const storageName = `MESSAGELIST_${state.timLoginUserId}_${state.currentConversationID}`
    let list = [...messageList]
    for (let i = 0; i < list.length; i++) {
      if (i === 0 || list[i].time - state.messageLastTime >= state.distanceTime) {
        list[i].timeStr = list[i].time
        state.messageLastTime = list[i].time
      }
      let message = list[i]
      list[i].virtualDom = decodeElement(message)
    }
    state.currentMessageList = [...list, ...state.currentMessageList]
  },
  // 消息列表追加一条新消息
  pushUpdateMessageList(state, message) {
    if (message.time - state.messageLastTime >= state.distanceTime) {
      message.timeStr = message.time
      state.messageLastTime = message.time
    }
    message.virtualDom = decodeElement(message)
    state.currentMessageList.push(message)
    messagePushStorageData(state.timLoginUserId, state.currentConversationID, message)
  },
  // 重置当前聊天列表数据
  resetMessageList(state) {
    state.messageLastTime = 0
    state.currentMessageList = []
  },
  // 设置sdk是否准备好
  setTimReady(state, data) {
    state.TimReady = data
  },
  // 设置tim登录的userid
  setTimLoginUserId(state, data) {
    state.timLoginUserId = data
  },
  // 设置当前聊天对话的id
  setCurrentConversationID(state, id) {
    state.currentConversationID = id
  },
  //保存最新聊天id
  setnewMsgId(state, id=0) {
	uni.setStorageSync('newMsgId',id)
    state.newMsgId = id
  },
  //im弹窗的滑动距离
  setImpopY(state, val){
	  state.ImpopY = val
	  uni.setStorageSync('ImpopY',val)
  },
  //全局关掉im弹窗
  closeImpop(state, type){
	  state.closeImpopType = type
	  uni.setStorageSync('closeImpopType',type)
  },
  //区分imUid保存所有的聊天信息
  setMessage(state,msg){
	 
	  	
	msg.reverse()
	state.msg.unshift(...msg)
	
	state.newMsg = msg
	uni.setStorageSync( 'msg'+state.imUid,JSON.stringify(state.msg))
	
	state.messageList = uni.getStorageSync('messageList'+state.imUid) && JSON.parse(uni.getStorageSync('messageList'+state.imUid)) || []
	
	//如果列表没有有这个消息 找出新增的聊天信息（新来的msg不在列表内则视为新增
	let arrId =  state.messageList.map(v => v.friend_user_id)
	let msgId = [...new Set(state.msg.map(v => v.from_user_id))] //所有并发的新消息id数组
	let newMessageArr = msgId.filter(v => !arrId.includes(v))//新的消息数组
	console.log('新消息msg: ', msg)
	console.log('arrId、: ', arrId)
	console.log('msgId、: ', msgId)
	console.log('newMessageArr、: ', newMessageArr)
	let arrid = newMessageArr.map(v => getFriendMsg(v))
	if(newMessageArr.length){
		Promise.all(arrid).then(res => {
			if (res.length) {
				res.reverse()
				res.forEach(v => {
					v.msg = {}
					v.created_at = ''
					v.status = 1
					//未读获取全部status = 0
					v.num = 0
					v.show = false
					//新增的消息应放在最前面
					state.messageList.unshift(v)
				})
				//把最新的聊天记录拼好
				state.messageList = Arrunique(state.messageList)
				saveMessage(state.messageList,msg,state.msg)
				console.log('新消息返回 state.messageList: ', state.messageList)
				uni.setStorageSync('messageList'+state.imUid,JSON.stringify(state.messageList))
				//保存未读
				if(state.messageList.length){
					state.unReadNum = state.messageList.map(v=>v.num).reduce(function(p,c){
						return p + c
					})
					uni.setStorageSync('unReadNum'+state.imUid,state.unReadNum)
				}
				
				console.log(state.messageList,msg,state.msg,state.num)
				
			}
		
		})
	}else{//原来的消息就已经存在消息列表
		//新消息置顶
		try{
			msg.forEach((v)=>{
				let obj = state.messageList.find((res,i)=>{
					
					if(res.friend_user_id === v.from_user_id){
						
						return state.messageList.splice(i,1)
					}
				})
				if(obj) state.messageList.unshift(obj)
			})
		}catch(e){
			//TODO handle the exception
			console.log(e)
		}
		
		state.messageList = Arrunique(state.messageList)
		
		saveMessage(state.messageList,msg,state.msg)
		console.log('原来就有的消息返回 state.messageList: ', state.messageList)
		uni.setStorageSync('messageList'+state.imUid,JSON.stringify(state.messageList))
		//保存未读
		if(state.messageList.length){
			
			state.unReadNum = state.messageList.map(v=>v.num).reduce(function(p,c){
				return p + c
			})
			uni.setStorageSync('unReadNum'+state.imUid,state.unReadNum)
		}
		
		
	}
	
	
  },
  //区分imUid保存聊天列表
  setMessageList(state,list){
	  state.messageList = list
	  //保存未读
	  if(state.messageList.length){
	  	state.unReadNum = state.messageList.map(v=>v.num).reduce(function(p,c){
	  		return p + c
	  	})
		uni.setStorageSync('unReadNum'+state.imUid,state.unReadNum)
	  }
	  state.messageList = Arrunique(state.messageList)
	  uni.setStorageSync('messageList'+state.imUid,JSON.stringify(state.messageList))
	  console.log('MessageList',list)
  },
 
  
  //设置已读
  setMessageRead(state, id) {
	let messageListAll =  uni.getStorageSync('messageList'+state.imUid) && JSON.parse(uni.getStorageSync('messageList'+state.imUid)) || []
	
	 
	let msgAll =  uni.getStorageSync('msg'+state.imUid) && JSON.parse(uni.getStorageSync('msg'+state.imUid)) || []
	messageListAll.forEach(v=>{
		 if(v.friend_user_id == id){
			 v.num = 0
			 v.status = 1
		 }
	})
	msgAll.forEach(v=>{
		 if(v.from_user_id == id){
			 v.status = 1
		 }
	})
	state.msg.forEach(v=>{
		if(v.from_user_id == id){
			v.status = 1
		}
	} )
	messageListAll = Arrunique(messageListAll)
    uni.setStorageSync('messageList'+state.imUid,JSON.stringify(messageListAll))
    //保存未读
    if(messageListAll.length){
    	state.unReadNum = messageListAll.map(v=>v.num).reduce(function(p,c){
    		return p + c
    	})
		uni.setStorageSync('unReadNum'+state.imUid,state.unReadNum)
    }			
    uni.setStorageSync('msg'+state.imUid,JSON.stringify(msgAll))
	
		
  },
  setHide(state, type) {
	
    state.hide = type
  },
   //设置会话id
  setImUid(state,imUid){
	state.imUid = imUid
	uni.setStorageSync('imUid',imUid)
  },
}
const actions = {
	
  // sdk登录
  timSdkLogin({dispatch, commit, state }) {
	  if(!uni.getStorageSync('token') || state.hide) return
	  request_v2({
      url: '/ApiV3/Mobile/Chat/getNewMsg',
	  method:'get',
      data: {
        max_id: state.newMsgId
      }
    }).then(res=>{
		let imUid = user.state.userInfo.id
		if(res.data.msgs.length){
			let newMsgId = res.data.msgs[0].id
			commit('setnewMsgId',newMsgId)
			// //标记imUid
			// res.data.msgs.forEach(v=>v.imUid = user.state.userInfo.id)
			res.data.msgs.reverse()
			commit('setMessage',res.data.msgs)
		}
		
		setTimeout(()=>{
			dispatch('timSdkLogin')
		},3000)
	}).catch(err=>{
		setTimeout(()=>{
			dispatch('timSdkLogin')
		},3000)
	})
	  // return 
   //  if (state.TimReady) return false
   //  request_v2({
   //    url: '/api/tencent_tls_sig',
   //    data: {
   //      user_id: state.timLoginUserId
   //    }
   //  })
   //    .then((results) => {
   //      const userSig = results.data.user_sig
   //      const userID = results.data.user_id.toString()
   //      tim
   //        .login({
   //          userID,
   //          userSig
   //        })
   //        .then((res) => {
   //          request_v1({
   //            url: '/api/users/mark-status-handler',
   //            errMsg: false,
   //            loading: false,
   //            data: {
   //              status: 1,
   //              imUid: userID
   //            }
   //          })
   //          uni.hideLoading()
   //        })
   //        .catch((err) => {
   //          uni.hideLoading()
   //        })
   //    })
   //    .catch((err) => {
   //      uni.hideLoading()
   //    })
  },
   addMessageList({ commit, state },{msg,id}){
  	  return new Promise(async (resolve,reject)=>{
  		 let msgArr = uni.getStorageSync('messageList'+state.imUid) && JSON.parse(uni.getStorageSync('messageList'+state.imUid)) || []
		 let virtualDom
		if(msg.body.type === 'TEXT'){
			virtualDom = decodeElement({type:'TIMTextElem',payload:{text:msg.body.text}})
		}
  		 //如果messageList中没有这个人则新增聊天对象
  		 if(!msgArr.find(v=>v.friend_user_id == id)){			 
  		 		 //获取对象信息
  		 		 let data = await getFriendMsg(id)
  		 		 msgArr.unshift({
  		 			 ...data,
  		 			 msg:msg.body,
  		 			 virtualDom,
  		 			 created_at:msg.created_at,
  		 			 status:msg.status,
  		 			 num: 0,
  		 			 show: false
  		 		 })
				
				 commit('setMessageList',msgArr)
				 
  		 }else{
  		 		 let obj = {}
  		 		 msgArr.forEach((v,i)=>{
  		 			 if(v.friend_user_id == id){
  		 				 v.msg = msg.body
  		 				 v.virtualDom = virtualDom,
  		 				 v.created_at = msg.created_at
  		 				 v.status = msg.status
  		 				 v.num = 0
  		 				 obj = v
  		 				 msgArr.splice(i,1)
  		 			 }
  		 		 })
  		 		 msgArr.unshift(obj)
  		 		 
				 commit('setMessageList',msgArr)
  		 		 					
  		 		 
  		 } 
		 resolve()
  	  })
  	  
  	 
  },
  // 获取当前sdk是否准备好
  getTimReady({ commit }, data) {
    commit('setTimReady', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
