import { imgUrl } from '@/utils/consts'
import { jump } from '@/utils/common'
export const setimgUrl = {
	data() {
		return {
			imgUrl,
			pageRoute: '',
			popshow: false,
			afterLoading: false,
		}
	},
	onShow() {
		// if(this.$refs.confirm){
		//  console.log(this.$refs.confirm)
		//  this.$refs.confirm.close()
		// }
		// this.$store.commit('closeImpop',true)
		let pages = getCurrentPages()
		// console.log('pages',pages)
		// console.log('inviterId',uni.getStorageSync('inviterId'))
		let currentPages = pages[pages.length - 1]
		//扫码跳转进来的时候保存当前路径
		if (currentPages) {
			this.pageRoute = currentPages.$page.fullPath
			// console.log('this.pageRoute',this.pageRoute)
			if (this.pageRoute.includes('pages/login')) {
				// console.log('登陆页面不保存',this.pageRoute)
			} else {
				uni.setStorageSync('beforPage', currentPages.$page.fullPath)
				// console.log('保存当前路径',this.pageRoute)
				//如果进来的页面是日记模块、并且没有完善信息、并且是查看自己的、 则跳转去完善 （userId为空说明是自己的 should_update为true说明没完善
				if (uni.getStorageSync('token') && !this.userId && this.$store.state.user.userInfo.should_update &&
					this.pageRoute.includes('/newHome/index')) {
					console.log('this.userId', this.userId)
					this.popshow = true
				}
			}
		}
	},
	onLoad(option) {
		console.log('mixins', option)
		if (option.scene || option.scene_id) {
			let scene_id = option.scene || option.scene_id
			uni.setStorageSync('inviterId', scene_id)
			this.getHospitalIdaa(scene_id)
			if (uni.getStorageSync('token')) {
				this.submitInviterId(scene_id)
			}
		}
		wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
			console.log('触发本次事件的接口是：' + eventInfo.referrer)
			// 需要用户同意隐私授权时
			// 弹出开发者自定义的隐私授权弹窗
			// this.setData({
			//   showPrivacy: true
			// })
			// this.resolvePrivacyAuthorization = resolve
		})
	},
	// watch:{
	//  pageRoute(val){
	//   return
	//  }
	// },
	computed: {
		
	},
	methods: {
		//获取医院id
		async getHospitalIdaa(scene_id) {
			const code = await this.getLoginCode()
			let data = {
				code
			}
			console.log('scene_idscene_id', scene_id)
			if (scene_id) data.scene_id = scene_id
			this.$request({
				url: '/ApiV2/Mobile/Tourists/hospital',
				method: 'get',
				data
			}).then(({ data }) => {
				console.log('data', data)
				uni.setStorageSync('hospitalId', data.hospital_id || 0)
				this.$store.commit('sethospital_id', data.hospital_id || 0)
			})
		},
		// 获取微信code
		getLoginCode() {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: (res) => {
						resolve(res.code)
					},
					fail: (err) => {
						reject(err)
					}
				})
			})
		},
		// 提交小程序码传进来的参数
		submitInviterId(scene_id) {
			console.log('scene_id', scene_id)
			this.$request({
				url: '/ApiV2/Mobile/Bind/bindByScene',
				data: {
					scene_id
				}
			}).then((res) => {})
		},
		// 公共跳转
		_jump({
			url = '',
			data = ''
		}) {
			console.log(url)
			jump({
				url,
				data,
			})
		}
	}
}