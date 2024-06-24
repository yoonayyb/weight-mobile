<script>
	
import { getLoginStatus } from './utils/common.js'
export default {
  data () {
    return {
		is_login:false,
		messagePage:1,
		message:[],
	}
  },
  
  onLaunch (option) {
	
	  // #ifdef MP-WEIXIN
	  wx.setInnerAudioOption({
		  obeyMuteSwitch:false
	  })
	  // #endif
	uni.setStorageSync('blueStauts',2)
    this.updateVersions()
	console.log('onLaunch',option)
	//如果不是扫码只在初始化的时候请求一次 
	if( Object.keys(option.query).length === 0 ){
		console.log('初始化进来APP,获取医院id')
		// this.getHospitalId()
	}
	
	uni.getSystemInfo({
	    success: (e) => {
		
	      // this.compareVersion(e.SDKVersion, '2.5.0')
	      let statusBar = 0 //-------- 状态栏高度 
	      let customBar = 0 //-------- 状态栏高度 + 导航栏高度
	     
	      // #ifdef MP
	      statusBar = e.statusBarHeight
	      customBar = e.statusBarHeight + 45
	      if (e.platform === 'android') {
	        this.$store.commit('SET_SYSTEM_IOSANDROID', false)
	        customBar = e.statusBarHeight + 50
	      }
	      // #endif
	      
	       
	      // #ifdef MP-WEIXIN
	      statusBar = e.statusBarHeight
	      // @ts-ignore
	      const custom = wx.getMenuButtonBoundingClientRect()
	      customBar = custom.bottom + custom.top - e.statusBarHeight
	      // #endif
	
	
	      // #ifdef MP-ALIPAY
	      statusBar = e.statusBarHeight
	      customBar = e.statusBarHeight + e.titleBarHeight
	      // #endif
	
	
	      // #ifdef APP-PLUS
	      console.log('app-plus', e)
	      statusBar = e.statusBarHeight
	      customBar = e.statusBarHeight + 45
	      // #endif
	
	
	      // #ifdef H5
	      statusBar = 0
	      customBar = e.statusBarHeight + 45
	      // #endif
		
		  
		  uni.setStorageSync('popheight',uni.upx2px(150) * 2 + customBar + 'px')
		  uni.setStorageSync('customBar',customBar)
	      
	    }
	})
	
  },
  onPageNotFound(){
	 uni.showModal({
	 	title:'提示',
		content:'页面已过期,请返回首页',
		showCancel:false,
		success:(res)=>{
			if (res.confirm) {
					uni.switchTab({
						url:'/pages/tabbar/diary'
					})	
				}
		}
	 })
  },
  async onShow () {
	this.$store.commit('setHide',false)//启动轮询
	// this.$store.dispatch('initSocket')//链接socket
	//判断当前登陆状态
	this.is_login = await getLoginStatus()
	if(this.is_login){
		// 获取用户信息
		this.checkLogin()
	}
    // setTimeout(() => {
    //   this.checkLogin()
    // }, 1000)
    
    // this.markStatus(1)
    // 如果是生产版本则不需要定时器
  },
  onHide () {
    // this.markStatus(0)
	this.$store.commit('setHide',true)//关闭轮询
	this.$store.dispatch('closeSocket')//关闭socket
	if(this.is_login){
		//标记下线
		this.$request({
			url:'/ApiV3/Mobile/Chat/Logout',
		})
	}
	
  },
  watch: {
    '$store.state.message.unreadCountTotal' (val) {
      console.log(val, '未读总数')
      if (val > 0) {
        uni.setTabBarBadge({
          index: 1,
          text: val.toString()
        })
      } else {
        uni.removeTabBarBadge({
          index: 1
        })
      }
    },
	'$store.state.user.userInfo.id' (val) {
	  	//获取聊天列表
		let localData = uni.getStorageSync('messageList'+uni.getStorageSync('imUid')) && JSON.parse(uni.getStorageSync('messageList'+uni.getStorageSync('imUid'))) || []
		if(!localData.length && uni.getStorageSync('token')){
			this.messagePage = 1
			this.getMessageList()
		}else if(localData.length && uni.getStorageSync('token')){
			this.$store.commit('setMessageList',localData)
		}
		
	},
  },
  methods: {
	  updataToken(){
	    this.$request({
			url: '/ApiV3/Mobile/Auth/extendToken',
		})
	  },
	  getMessageList() {
	  	this.$request({
	  			url: '/ApiV3/Mobile/Chat/index',
	  			method: 'GET',
	  			data: {
	  				page: this.messagePage
	  			}
	  		})
	  		.then((res) => {
	  			if (this.messagePage === 1) {
	  				this.message = res.data.data
	  
	  			} else {
	  				this.message = [...this.message, ...res.data.data]
	  			}
	  
	  			if (res.data.next_page_url) {
	  				this.messagePage++
	  				this.getMessageList()
	  			} else {
	  				//构造消息数据
	  				
					this.message.forEach(v=>{
						v.msg = {}
						v.created_at = ''
						v.status = 1
						//未读获取全部status = 0
						v.num = 0
						v.show = false
					})
					
					this.$store.commit('setMessageList',this.message)
					
					
					
	  				
	  			}
	  
	  		})
	  		.catch(async (err) => {
	  
	  		})
	  },
	  //获取好友聊天信息
	  getFriendMsg(friend_id) {
	  	return new Promise((resolve, reject) => {
	  		this.$request({
	  			url: '/ApiV3/Mobile/Chat/friendInfo',
	  			method: 'get',
	  			data: {
	  				friend_id
	  			}
	  		}).then(res => {
	  			resolve(res.data)
	  		})
	  	})
	  
	  },
	 
	 //获取医院id
	 async getHospitalId(scene_id){
	 		const code =  await  this.getLoginCode()
	 		let data = {
	 			code
	 		}
	 		if(scene_id) data.scene_id = scene_id
	 		this.$request({
	 			url:'/ApiV2/Mobile/Tourists/hospital',
	 			method:'get',
	 			data
	 		}).then(({data})=>{
	 			console.log('data',data)
	 			uni.setStorageSync('hospitalId',data.hospital_id || 0)
	 			this.$store.commit('sethospital_id',data.hospital_id || 0)
	 			
	 		})
	  },
	  // 获取微信code
	  getLoginCode() {
	  	return new Promise((resolve, reject) => {
	  		uni.login({
	  			provider: 'weixin',
				onlyAuthorize:true,
	  			success: (res) => {
	  				resolve(res.code)
	  			},
	  			fail: (err) => {
	  				reject(err)
	  			}
	  		})
	  	})
	  },
    // 检查新版本
    updateVersions () {
      const updateManager = uni.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function (res2) {
            uni.showModal({
              title: '更新提示',
              content: '发现新版本，是否重启应用?',
              confirmColor: '#008AB0',
              success (res2) {
                if (res2.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
      updateManager.onUpdateFailed(function (res) {
        // 新的版本下载失败
        uni.showModal({
          title: '提示',
          confirmColor: '#008AB0',
          content: '检查到有新版本，但下载失败，请检查网络设置',
          success (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    },
    // 检查登录
    checkLogin () {
      // 如果没有token直接去登录页
	  
      if (!uni.getStorageSync('token') && !this.is_login) {
        // this.$common.jumpLogin()
      } else {
        // 如果有token则请求个人信息接口看token是否有效
        this.$store
          .dispatch('getUserInfo')
          .then((res) => {
            // 有效则登录im
            this.$store.dispatch('timSdkLogin')
			
          })
          .catch((res) => {
            // 如果无效则直接去登录页
            if (res.code === 203) {
              // uni.reLaunch({
              // 	url: '/pages/login/index'
              // })
              // this.$common.jumpLogin()
            }
          })
      }
    },
    markStatus (status) {
      let token = uni.getStorageSync('token')
      if (!token) {
        return
      }
      const { timLoginUserId } = this.$store.state.message
      if (!timLoginUserId) {
        return
      }
      this.$axios({
        url: '/api/users/mark-status-handler',
        errMsg: false,
        loading: false,
        data: {
          status: status,
          imUid: timLoginUserId
        }
      }).then((res) => { })
    }
  }
}
</script>

<style lang="scss">
page {
  --safe-area-inset-bottom: 0px;
  // background-color: pink;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
// ::-webkit-scrollbar {
//   display: none;
//   width: 0 !important;
//   height: 0 !important;
//   -webkit-appearance: none;
//   background: transparent;
// }
// ::-webkit-scrollbar {
//   width: 10rpx;
//   height: 10rpx;
//   color:#ffffff;
// }
// /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
//   border-radius: 10px;
//   background-color:#FFFFFF;
// }
// /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
//   box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
//   background-color:#d2d2d2;
// }

@supports (top: constant(safe-area-inset-bottom)) {
  page {
    --safe-area-inset-bottom: constant(safe-area-inset-bottom);
  }
}

@supports (top: env(safe-area-inset-bottom)) {
  page {
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
  }
}

// @supports (top: constant(safe-area-inset-bottom)) {
// 	page {
// 		--safe-area-inset-bottom: 20px;
// 	}
// }

// @supports (top: env(safe-area-inset-bottom)) {
// 	page {
// 		--safe-area-inset-bottom: 20px;
// 	}
// }

// @supports (top: constant(safe-area-inset-bottom)) {
// 	page {
// 		--safe-area-inset-bottom: calc(constant(safe-area-inset-bottom) - 20px);
// 	}
// }

// @supports (top: env(safe-area-inset-bottom)) {
// 	page {
// 		--safe-area-inset-bottom: calc(env(safe-area-inset-bottom) - 20px);
// 	}
// }

@import "uview-ui/index.scss";
@import "styles/common.scss";
.number_box .u-icon-minus,
.u-icon-plus {

  width: 40rpx !important;
  height: 40rpx !important;
  text {
	  color:white !important;
    font-size: 28rpx !important;
  }
  border-radius: 50% !important;
}

.number_box .u-number-input {
  background: white !important;
  color: #2a2a2a !important;
}

.popup_content_box .u-radio-group {
  display: flex !important;
  flex-direction: column !important;
}
.u-tabbar__content__item{
	image{
		height: 48rpx !important;
		width: 48rpx!important;
	}
}
.u-tabbar__content__item:nth-of-type(3){
	image{
		height: 72rpx !important;
		width: 72rpx!important;
	}
}
.u-tabbar__content__item__text {
	font-size: 22rpx!important;
}
.v3_empty{
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
		color:#C2C2C2;
		font-size: 28rpx;
		text-align: center;
		image{
			height: 200rpx;
			width:200rpx
		}
}
.u-wrap {
	u-sticky {
		 u-image{
			.u-image__image{
				background: #fff !important;
			}
		}
	}
		
	}
.demo-warter > view{
		
			padding: 0 10rpx;
		
	}
	::v-deep .u-mode-center-box{
		    // background-color:transparent !important;
	}
   .compare .u-drawer .u-mask-zoom{
			background-color: inherit !important;
	}	
</style>
