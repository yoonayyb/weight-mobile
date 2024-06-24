<template>
	<view class="container">
		<!-- #ifdef APP-PLUS -->
		<u-navbar :back-icon-show="false" title="登录">
			<view slot="left" class="u-p-10" @click.stop="goHome">
				<u-icon name="home" :size="40"></u-icon>
			</view>
		</u-navbar>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="logo_wrap" @click="clickLogo">
			<image :src="loginInfo.logo || `${imgUrl}v3_login_logo.jpg`"
				style="width: 680rpx; height: 680rpx;margin-bottom: 40rpx;">
			</image>
			<!-- <u-parse style="font-size: 40rpx" :html="loginInfo.login_title"></u-parse> -->
			<view style="font-size: 40rpx;text-align: center;padding:0 20rpx">{{loginInfo.login_title}}</view>
			<view style="font-size: 40rpx;text-align: center;padding:0 20rpx">{{loginInfo.login_title2}}</view>
			<view style="font-size: 40rpx;text-align: center;padding:0 20rpx">{{loginInfo.login_title3}}</view>
			<view>{{ envName }}</view>
		</view>
		<view class="wxlogin_btn">
			<my-button width="690" height="100">
				<text>手机号快捷登录</text>
				<template v-if="checked">
					<button class="openButton" type="default" open-type="getPhoneNumber"
						@getphonenumber="loginGetPhoneNumber"></button>
				</template>
				<template v-else>
					<button @click="agree" class="openButton"></button>
				</template>
			</my-button>
			<view class="u-flex u-flex-center u-m-t-20">
				<button @click="checkboxGroupChange" class="pravacyButton"
					style="background: #fff;border:1px solid #fff" id="agree-btn" open-type="agreePrivacyAuthorization"
					@agreeprivacyauthorization="handleAgreePrivacyAuthorization">
					<u-checkbox-group shape="circle">
						<u-checkbox active-color="#00B8A2" v-model="checked"> <text class="u-font-20"
								style="line-height: 66rpx;">我以认真阅读并同意</text> </u-checkbox>
					</u-checkbox-group>
				</button>
				<text class="u-font-20" style="line-height: 60rpx;"><text @click.stop="handleOpenPrivacyContract"
						class="color">{{privatyName}}</text></text>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="app_login">
			<view class="tabs u-flex">
				<view class="tab_item u-flex-1 u-flex u-p-30"
					:style="{ justifyContent: index === 0 ? 'flex-end' : 'flex-start' }"
					:class="index === tabIndex ? 'active' : ''" v-for="(item, index) in ['验证码登录', '密码登录']" :key="index"
					@click="tabIndex = index">
					<text>{{ item }}</text>
				</view>
			</view>
			<view class="login_content">
				<view v-if="tabIndex === 0">
					<view class="input_row border_b">
						<input type="number" v-model="mobile" :maxlength="11" placeholder="请输入手机号码"
							placeholder-class="input_light_color" />
					</view>
					<view class="input_row border_b">
						<input type="number" v-model="code" :maxlength="6" placeholder="请输入验证码"
							placeholder-class="input_light_color" />
						<view class="getcode_btn">
							<!-- <my-button width="190" height="54" font-size="24">重新获取(60)</my-button> -->
							<get-code :mobile="mobile" :type="2" />
						</view>
					</view>
				</view>
				<view v-if="tabIndex === 1">
					<view class="input_row border_b">
						<input type="number" v-model="mobile" :maxlength="11" placeholder="请输入手机号码"
							placeholder-class="input_light_color" />
					</view>
					<view class="input_row border_b">
						<input type="password" v-model="password" :maxlength="20" placeholder="请输入密码"
							placeholder-class="input_light_color" />
					</view>
				</view>
				<view class="u-p-l-30 u-m-t-50">
					<my-button @click="handleAppLogin" width="690" height="100">登录</my-button>
				</view>
				<view v-if="tabIndex === 0" class="u-p-20 u-flex u-row-center light_color">
					<text>首次登录自动注册归朴健康账号</text>
				</view>
				<view v-else class="u-p-20 u-flex u-row-center light_color" @click="jump({ url: 'test/setPassword' })">
					<text>忘记密码</text>
				</view>
			</view>
			<view class="wxlogo">
				<image @click="appWxLogin" :src="`${imgUrl}wxlogo.png`" mode="aspectFit"></image>
			</view>
			<view @click="consentAgreement = !consentAgreement" class="agreement u-font-24 u-flex u-row-center">
				<checked icon="1" width="30" :checked="consentAgreement"></checked>
				<text class="u-m-l-10">我已查看并同意归朴健康的</text>
				<text style="color: #00b8a2"
					@click="jump({ url: 'mine/setting/richText', data: { type: 1 } })">《用户协议》</text>
				<text>和</text>
				<text style="color: #00b8a2"
					@click="jump({ url: 'mine/setting/richText', data: { type: 2 } })">《隐私政策》</text>
			</view>
		</view>
		<!-- #endif -->
		<!-- 授权弹框 -->
		<u-popup v-model="getPhonePopupShow" mode="center" border-radius="20" duration="50">
			<view class="phone_popup_content">
				<view class="title u-flex">
					<text>微信授权手机号成功</text>
				</view>
				<view class="content u-flex">
					<text>申请获取您的公开信息（昵称、头像、地区及性别）</text>
				</view>
				<view class="button border_t u-flex">
					<text>授权获取信息</text>
					<!-- <button class="openButton" type="default" open-type="getUserInfo" @getuserinfo="loginGetuserinfo"></button> -->
					<button class="openButton" type="default" @click="toRegister"></button>
				</view>
			</view>
		</u-popup>
		<!-- 选中登录角色弹框 -->
		<!-- <u-popup ref="u-popup" v-model="chooseRolePopupShow" mode="center" :mask-close-able="false" border-radius="20"
      duration="50">
      <view class="choose_role_content u-p-b-30">
        <view class="u-flex u-row-center u-p-t-30 u-p-b-30 u-font-32 border_b">
          <text style="font-weight: bold">请选择登录角色</text>
        </view>
        <view class="u-p-30">
          <view class="select_item" v-for="(item, index) in loginTypeOptions" :key="index"
            @click="loginType = item.name">
            <image v-if="item.name === 1" :src="`${imgUrl}roleImg.png`" mode="aspectFit"></image>
            <image v-else-if="item.name === 2" :src="`${imgUrl}roleImg2.png`" mode="aspectFit"> </image>
            <image v-else :src="`${imgUrl}roleImg3.png`" mode="aspectFit"></image>
            <text :style="{ color: loginType === item.name ? '#00B8A2' : '' }">{{ item.label }}</text>
          </view>
        </view>
        <my-button margin="0 0 0 30rpx" width="540" height="90" @click="successJump">确定</my-button>
      </view>
    </u-popup> -->
		<!-- 绑定手机弹框 -->
		<!-- #ifdef APP-PLUS -->
		<u-popup v-model="bindMobilePopupShow" closeable mode="bottom" border-radius="20" duration="50">
			<view class="u-p-30 u-font-32 u-flex u-row-center border_b">
				<text style="font-weight: bold">绑定手机号</text>
			</view>
			<view class="u-p-30" style="color: #888888">
				<text>你的微信账号"{{ nickname }}"通过验证 现需要绑定手机号方可登录成功</text>
			</view>
			<view class="input_row border_b">
				<input type="number" v-model="bindData.mobile" :maxlength="11" placeholder="请输入手机号码"
					placeholder-class="input_light_color" />
			</view>
			<view class="input_row border_b">
				<input type="number" v-model="bindData.code" :maxlength="6" placeholder="请输入验证码"
					placeholder-class="input_light_color" />
				<view class="getcode_btn">
					<get-code :mobile="bindData.mobile" :type="3" />
				</view>
			</view>
			<view class="u-p-40">
				<my-button @click="handleBindMobile" width="670" height="100">绑定手机号</my-button>
			</view>
		</u-popup>
		<!-- #endif -->
		<u-popup v-model="show" mode="bottom" border-radius="124" height="812rpx" :mask-close-able="false">
			<view class="u-flex u-flex-column u-flex-center" style="height: 100%;">
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image :src="avatar || `${imgUrl}login_avatar.png`"
						style="width: 250rpx; height: 250rpx;border-radius: 50%;">
					</image>
				</button>
				<view @click="showNamePopupShow = true" class="u-font-32 u-m-b-60" style="color:#959595">
					<text v-if="nickname">{{nickname }}</text>
					<text v-else class="light_color">请填写昵称</text>
					<u-icon name="edit-pen" color="#959595" size="30"></u-icon>
				</view>
				<my-button @click="submitLogin" borderRadius="44rpx" fontWeight="bold" fontSize="40" width="478"
					height="130">确定</my-button>
			</view>
		</u-popup>
		<!-- 修改姓名弹框 -->
		<u-popup :closeable='false' negative-top="30vh" duration="50" v-model="showNamePopupShow" border-radius="20"
			mode="center">
			<input-popup cancelText='取消' title="修改昵称" placeholder='这是一个昵称名字' :maxlength="20" :value="nickname"
				type="nickname" @confirm="handleConfirm($event, 'nickname')" @cancelClick='showNamePopupShow=false'
				:show="showNamePopupShow">
			</input-popup>
		</u-popup>
	</view>
</template>
<script>
	let emitName = ['diary']
	import myButton from '@/components/myButton.vue'
	import inputPopup from '@/components/inputPopup.vue'
	/* #ifdef APP-PLUS */
	import getCode from './getCode.vue'
	/* #endif */
	import {
		commonApi
	} from '../../utils/common'
	export default {
		data() {
			return {
				checked: false,
				privatyName: '',
				showNamePopupShow: false,
				nickname: '',
				avatar: '',
				show: false,
				loginInfo: {
					login_title: '', //登陆文案
					logo: ''
				},
				beforPage: '',
				emitName: '',
				role_id: '', //1 用户 2营养师  3 医生
				chooseRolePopupShow: false, //选择角色
				getPhonePopupShow: false, //获取微信信息弹框
				currentMobile: '', //当前微信获取的手机号
				wxCode: '', //微信code
				backPage: false,
				loginType: 1, //登录角色
				loginTypeOptions: [{
					name: 1,
					label: '会员'
				}, {
					name: 2,
					label: '营养师'
				}, {
					name: 3,
					label: '医生'
				}],
				doctorInfo: null, //医生信息  如果有则代表是医生注册
				saleInfo: null, //销售代表信息
				// #ifdef APP-PLUS
				tabIndex: 0, //登录类型tab的索引
				mobile: '', //输入的手机号
				code: '', //验证码
				password: '', //密码
				consentAgreement: true, //同意协议
				bindMobilePopupShow: false, //绑定手机号弹框
				nickname: '', //获取到的微信昵称
				bindData: {
					//绑定的手机号和验证码
					mobile: '',
					code: ''
				},
				wxInfo: {}, //app获取到的微信信息
				// #endif
				session_key: '',
				urlIndex: 0,
				envName: '',
				getInc: null,
				scene: '',
				sceneValue:'',
			}
		},
		components: {
			myButton,
			inputPopup,
			/* #ifdef APP-PLUS */
			getCode
			/* #endif */
		},
		watch: {
			beforPage(val) {
				this.emitName = emitName.find(v => val.includes(v))
				console.log('this.emitName1111', this.emitName)
			},
			// '$store.state.user.hospital_id'(val) {
			// 	console.log('$store.state.user.hospital_id', val)
			// 	this.getLoginData(val)
			// },
		},
		async onLoad(option) {
			console.log('option: ', option)
			this.getLoginData()
			this.beforPage = uni.getStorageSync('beforPage') || '/pages/tabbar/diary'
			// 截取 scene 后面的值 根据这个值跳过完善信息页面 
			this.sceneValue = this.beforPage.match(/scene=(.*)/)[1];
			console.log('this.sceneValue: ', this.sceneValue)
			
			console.log('this.beforPage', this.beforPage)
			if (option.scene) {
				const inviterId = option.scene
				//如果是扫码进来的话 就跳过完善信息流程
				this.scene = option.scene
				this.$store.commit('setInviterId', inviterId)
			}
			
			if (option.doctorInfo) {
				//医生数据
				this.doctorInfo = JSON.parse(option.doctorInfo)
			}
			if (option.saleInfo) {
				//销售代表数据
				this.saleInfo = JSON.parse(option.saleInfo)
			}
			if (option.backPage) {
				this.backPage = true
			}
			// #ifdef MP-WEIXIN
			// this.wxCode = await this.getLoginCode()
			// #endif
		},
		async onShow() {
			// #ifdef MP-WEIXIN
			wx.getPrivacySetting({
				success: res => {
					console.log('needAuthorization',
						res
					) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
					this.privatyName = res.privacyContractName
					if (res.needAuthorization) {
						// 需要弹出隐私协议
						this.checked = false
					} else {
						this.checked = true
						// 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
						// wx.getUserProfile()
						// wx.chooseMedia()
						// wx.getClipboardData()
						// wx.startRecord()
					}
				},
				fail: (fail) => {
					console.log('fail', fail)
				},
				complete: () => {}
			})
			// #endif
			this.envName = uni.getStorageSync('baseUrl_v2') ? '调试模式' : ''
		},
		onHide() {
			clearInterval(this.getInc)
		},
		onUnload() {
			clearInterval(this.getInc)
		},
		methods: {
			agree(e) {
				this.$common.toast('请勾选同意隐私协议')
			},
			handleAgreePrivacyAuthorization() {
				console.log('已经同意')
			},
			handleOpenPrivacyContract() {
				// 打开隐私协议页面
				wx.openPrivacyContract({
					success: () => {}, // 打开成功
					fail: () => {}, // 打开失败
					complete: () => {}
				})
			},
			checkboxGroupChange() {
				this.checked = !this.checked
			},
			submitLogin() {
				if (!this.avatar) {
					return this.$common.toast('请选取您的头像')
				}
				if (!this.$u.trim(this.nickname)) {
					return this.$common.toast('请输入您的昵称')
				}
				this.$common.uploadParams(this.avatar).then(res => {
					//更新数据到后台
					this.$request({
						url: '/ApiV2/Mobile/User/updateUserProfile',
						data: {
							avatar: res.key,
							nickname: this.nickname
						}
					}).then((res) => {
						this.successJump()
					}).catch(async (err) => {})
				})
			},
			handleConfirm(e, type) {
				this.nickname = e
				this.showNamePopupShow = false
			},
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail
				console.log(e)
				this.avatar = avatarUrl
			},
			async getLoginData() {
				console.log('this.role_id111111', this.role_id)
				let data = {}
				data.hospital_id = await this.getHospitalId() //用户的医院id
				this.$request({
					url: '/ApiV2/Mobile/Tourists/diyPage',
					method: 'get',
					data
				}).then(({ data }) => {
					this.loginInfo = data
				})
			},
			submitInviterId() {
				if (!uni.getStorageSync('inviterId')) return
				this.$request({
					url: '/ApiV2/Mobile/Bind/bindByScene',
					data: {
						scene_id: uni.getStorageSync('inviterId')
					}
				}).then((res) => {
					this.$store.commit('setInviterId', '')
					uni.setStorageSync('inviterId', '')
					console.log('提交成功小程序码传进来的参数: ', res)
				})
			},
			// #ifdef APP-PLUS
			// 微信授权后绑定手机号
			handleBindMobile() {
				if (!this.$u.trim(this.bindData.mobile)) return this.$common.toast('请输入手机号')
				if (!this.$u.test.mobile(this.bindData.mobile)) return this.$common.toast('手机号码格式不正确')
				if (!this.$u.trim(this.bindData.code)) return this.$common.toast('请输入验证码')
				const data = {
					...this.wxInfo,
					mobile: this.bindData.mobile,
					pcode: this.bindData.code
				}
				this.$axios({
					url: '/api/bind_phone',
					errMsg: true,
					loading: true,
					data
				}).then((res) => {
					this.role_id = res.data.role_id
					this.$common.setToken(res.data.authorization)
					this.loginSuccess()
				})
			},
			// app微信授权
			appWxLogin() {
				if (!this.consentAgreement) return this.$common.toast('请勾选同意用户协议和隐私政策')
				const that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log(res.provider)
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									that.getAppLoginData(loginRes)
								},
								fail: function(res) {
									console.log('App微信获取用户信息失败', res)
								}
							})
						}
					}
				})
			},
			// app获取微信头像昵称然后登录
			getAppLoginData(data) {
				uni.request({
					url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + data.authResult.access_token +
						'&openid=' + data.authResult.openid,
					method: 'GET',
					dataType: 'json',
					header: {
						'content-type': 'application/x-www-form-urlencoded' // 默认值
					},
					success: (res) => {
						this.nickname = res.data.nickname
						this.wxInfo = {
							wx_openid: res.data.openid,
							wx_unionid: res.data.unionid,
							nickname: res.data.nickname,
							avatar: res.data.headimgurl
						}
						this.$axios({
							url: '/api/wechat_login',
							errMsg: true,
							loading: true,
							data: this.wxInfo
						}).then((res) => {
							if (res.data.is_mobile === 1) {
								//已经绑定手机号直接登录成功
								this.role_id = res.data.role_id
								this.$common.setToken(res.data.authorization)
								this.loginSuccess()
							} else {
								// 没有绑定手机号则需要绑定
								this.bindMobilePopupShow = true
							}
						})
					},
					fail() {}
				})
			},
			// app端点击登录
			handleAppLogin() {
				if (!this.consentAgreement) return this.$common.toast('请勾选同意下方的用户协议和隐私政策')
				if (!this.$u.trim(this.mobile)) return this.$common.toast('请输入手机号')
				if (!this.$u.test.mobile(this.mobile)) return this.$common.toast('手机号码格式不正确')
				// 验证码登录
				if (this.tabIndex === 0) {
					if (!this.$u.trim(this.code)) return this.$common.toast('请输入验证码')
					this.$axios({
						url: '/api/phone_login',
						errMsg: true,
						loading: true,
						data: {
							mobile: this.mobile,
							mobile_code: this.code
						}
					}).then((res) => {
						console.log(res.data, 'app验证码登录成功')
						this.role_id = res.data.role_id
						if (res.data.authorization) {
							this.$common.setToken(res.data.authorization)
							this.loginSuccess()
						}
					})
				}
				// 密码登录
				if (this.tabIndex === 1) {
					if (!this.$u.trim(this.password)) return this.$common.toast('请输入密码')
					if (this.password.toString().length < 6) return this.$common.toast('密码不能小于6位')
					this.$axios({
						url: '/api/username_login',
						errMsg: true,
						laoding: true,
						data: {
							username: this.mobile,
							password: this.password
						}
					}).then((res) => {
						console.log(res.data, 'app密码登录成功')
						this.role_id = res.data.role_id
						if (res.data.authorization) {
							this.$common.setToken(res.data.authorization)
							this.loginSuccess()
						}
					})
				}
			},
			// 公共跳转
			jump({
				url = '',
				data = {}
			} = {}) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			},
			// #endif
			// 回到首页
			goHome() {
				uni.switchTab({
					url: '/pages/tabbar/diary'
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
			// 登录成功
			loginSuccess() {
				if (this.doctorInfo) {
					// 如果是医生注册
					// 则直接默认医生登录
					this.loginType = 3
					this.successJump()
					return false
				}
				this.loginType = this.role_id
				if (this.role_id === 1) {
					this.successJump()
				} else if (this.role_id === 2) {
					// #ifdef APP-PLUS
					//app端则直接登录 不用选
					this.successJump()
					return false
					// #endif
					// this.loginTypeOptions.splice(2, 1)
					this.successJump()
					// this.chooseRolePopupShow = true
					// this.$refs['u-popup'].open()
				} else if (this.role_id === 3) {
					// #ifdef APP-PLUS
					//app端则直接登录 不用选
					this.successJump()
					return false
					// #endif
					// this.loginTypeOptions.splice(1, 1)
					this.successJump()
					// this.chooseRolePopupShow = true
				} else if (this.role_id === 4) {
					// #ifdef APP-PLUS
					//app端则直接登录 不用选
					this.loginType = 2
					this.successJump()
					return false
					// #endif
					this.loginType = 1
					this.successJump()
					// this.chooseRolePopupShow = true
				}
			},
			// 登录成功后获取个人信息然后跳转
			successJump() {
				//绑定邀请
				this.submitInviterId()
				uni.setStorageSync('currentRoleId', this.loginType)
				this.$store.dispatch('getUserInfo').then((res) => {
					const data = res.data
					let type = this.beforPage.includes('/pages/tabbar/') ? 'switchTab' : 'reLaunch'
					console.log('this.beforPage', this.beforPage)
					console.log('this.emitName', this.emitName)
					if (this.emitName) uni.$emit(this.emitName, {
						data: this.beforPage
					})
					if (this.beforPage.includes('/pages/login')) {
						uni.switchTab({
							url: '/pages/tabbar/projects'
						})
					} else {
						uni[type]({
							url: this.beforPage
						})
					}
					// if(this.emitName) uni.$emit(this.emitName,{data:this.beforPage})
					// if (data.role_id === 1 && !data.weight && uni.getStorageSync('shop') != 1) {
					// 	// 如果没有体重 则跳去填写体重
					// 	uni.reLaunch({
					// 		url: '/pages/mine/invite/updatePersonalInfo?login=true'
					// 	})
					// } else {
					// 	let type = this.beforPage.includes('/pages/tabbar/') ? 'switchTab' : 'reLaunch'
					// 	console.log('this.beforPage', this.beforPage)
					// 	if(this.beforPage.includes('/pages/login')){
					// 		uni.switchTab({
					// 			url: '/pages/tabbar/projects'
					// 		})
					// 	}else{
					// 		uni[type]({
					// 			url: this.beforPage
					// 		})
					// 	}
					// 	if(this.emitName) uni.$emit(this.emitName,{data:this.beforPage})
					// }
				})
			},
			//获取医院id
			getHospitalId(scene_id) {
				return new Promise(async (resolve, reject) => {
					const code = await this.getLoginCode()
					let data = {
						code
					}
					if (scene_id) data.scene_id = scene_id
					this.$request({
						url: '/ApiV2/Mobile/Tourists/hospital',
						method: 'get',
						data
					}).then(({
						data
					}) => {
						resolve(data.hospital_id)
					})
				})
			},
			// 获取手机号
			async loginGetPhoneNumber(e) {
				if (!this.checked) return this.$common.toast('请勾选隐私协议')
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					this.$common.showLoading()
					const data = {
						login_code: await this.getLoginCode(),
						mobile_code: e.detail.code,
					}
					if (uni.getStorageSync('inviterId')) data.scene_id = uni.getStorageSync('inviterId')
					this.$request({
						url: '/ApiV3/Mobile/Auth/miniMobileCode', // /ApiV2/Mobile/Auth/miniLogin
						errMsg: true,
						loading: true,
						data
					}).then(async (res) => {
						//登陆完之后重新获取该用户的医院id
						// await this.getHospitalId()
						this.$common.hideLoading()
						this.currentMobile = res.data.mobile
						this.role_id = res.data.role_id
						this.$common.setToken(res.data.authorization)
						await this.$store.dispatch('getUserInfo')
						this.$store.dispatch('timSdkLogin') //用户登录成功后就登录timSdk
						//注册
						if (this.backPage) {
							let url = this.saleInfo ? '/ApiV2/Mobile/Staff/saleRepRegister' :
								'/ApiV2/Mobile/Doctor/apply'
							let data = this.saleInfo ? this.saleInfo : {
								...this.doctorInfo,
								mobile: this.doctorInfo.mobile || uni.getStorageSync('userInfo').mobile
							}
							this.$request({
								url,
								loading: true,
								errMsg: true,
								data
							}).then((res) => {
								console.log('res: ', res)
								if (this.saleInfo) uni.setStorageSync('currentRoleId', 2)
								this.show = true
								// uni.switchTab({
								// 	url: '/pages/tabbar/mine'
								// })
							})
						} else {
							//绑定邀请
							this.submitInviterId()
							console.log('this.$store.state.user.userInfo.update_avatar_nick', this.$store
								.state.user.userInfo)
							//res.data.should_update 
							// 找到 scene= 的位置
							let index = this.beforPage.indexOf("scene=");
							// 截取 scene 后面的值
							
							if(this.sceneValue == 'ASSESSMENT_REPORT_ASK' || this.sceneValue == 'question1'){ //question1营养测评问卷 ASSESSMENT_REPORT_ASK广西问卷
								
								uni.reLaunch({
									url: this.beforPage
								})
							}else{
								if (res.data.should_update && uni.getStorageSync('shop') != 1 && !this.scene &&
									!this.beforPage.includes('/saleRegister') && !this.beforPage.includes(
										'/doctorRegister')) { //跳去完善信息
									uni.reLaunch({
										url: '/pages/mine/invite/updatePersonalInfo?login=true'
									})
									// this.loginSuccess()
								} else if (this.$store.state.user.userInfo.update_avatar_nick) { //弹出头像、昵称修改
									this.show = true
								} else { //正常登陆
									let type = this.beforPage.includes('/pages/tabbar/') ? 'switchTab' :
										'reLaunch'
									console.log('this.beforPage', this.beforPage)
									if (this.beforPage.includes('/pages/login')) {
										uni.switchTab({
											url: '/pages/tabbar/projects'
										})
									} else {
										uni[type]({
											url: this.beforPage
										})
									}
									if (this.emitName) uni.$emit(this.emitName, {
										data: this.beforPage
									})
								}
							}
							
						}
					})
				}
			},
			// 获取用户信息
			async toRegister(e) {
				uni.getUserProfile({
					desc: '申请获取您的公开信息',
					success: async (userInfoRes) => {
						this.$request({
							url: '/ApiV2/Mobile/User/updateUserProfile',
							data: {
								nickname: userInfoRes.userInfo.nickName,
								avatar: userInfoRes.userInfo.avatarUrl,
								sex: userInfoRes.userInfo.gender
							}
						}).then((res) => {
							this.getPhonePopupShow = false
							// this.$common.setToken(res.data.authorization)
							this.loginSuccess()
						}).catch(async (err) => {})
						return
					},
					fail: (err) => {
						console.log('err: ', err)
					}
				})
			},
			clickLogo() {
				this.urlIndex++
				if (this.urlIndex >= 20 && !this.envName && !uni.getStorageSync('baseUrl_v2')) {
					this.urlIndex = 0
					uni.setStorageSync('baseUrl', commonApi.clickApi.new)
					uni.setStorageSync('baseUrl_v2', commonApi.clickApi.old)
					console.log(' commonApi.clickApi.new', commonApi.clickApi.new)
					console.log(' commonApi.clickApi.new', commonApi.clickApi.new)
					this.envName = '调试模式'
				}
				if (this.urlIndex >= 20 && uni.getStorageSync('baseUrl_v2')) {
					uni.removeStorageSync('baseUrl')
					uni.removeStorageSync('baseUrl_v2')
					this.urlIndex = 0
					this.envName = ''
				}
			}
		}
	}
</script>
<style>
	.pravacyButton {
		padding: 0;
		margin: 0;
	}

	.pravacyButton::after {
		border: 1px solid #fff !important;
	}

	.pravacyButton .u-checkbox__label {
		margin-right: 0rpx !important;
	}
</style>
<style lang="scss">
	.avatar-wrapper {
		margin: 0;
		padding: 0;
		height: 250rpx;
		background: transparent;
		margin-bottom: 66rpx;

		&::after {
			border: none;
		}
	}

	::v-deep .u-radio {
		padding: 10upx 0;
		display: flex;
		padding-left: 30upx;
		box-sizing: border-box;
	}

	::v-deep .u-radio__label {
		flex: 1;
		margin-left: 20upx !important;
	}

	.logo_wrap {
		// margin-top: 100upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// text-align: center;
		font-size: 60upx;
		color: #16beaa;
		font-weight: 700;
	}

	.wxlogin_btn {
		padding: 0 30upx;
		width: 750upx;
		position: fixed;
		bottom: 200upx;
	}

	/* #ifdef APP-PLUS */
	.input_row {
		margin: 0 30upx;
		width: 690upx;
		position: relative;

		>input {
			box-sizing: border-box;
			width: 690upx;
			height: 100upx;
			line-height: 100upx;
			padding: 0 30upx;
			font-size: 32upx;
		}

		.input_light_color {
			font-size: 32upx;
			color: #cecece;
		}

		.getcode_btn {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.app_login {
		margin-top: 70upx;

		.tabs {
			.tab_item {
				font-size: 48upx;
				color: #cecece;
				position: relative;

				&:last-child {
					padding-left: 34upx;

					&::after {
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						width: 4upx;
						height: 50upx;
						background: #cecece;
						content: "";
					}
				}
			}

			.active {
				color: #2b2b2b;
			}
		}

		.login_content {
			margin-top: 80upx;
		}

		.wxlogo {
			position: fixed;
			bottom: 100upx;
			left: 50%;
			transform: translate(-50%);

			image {
				width: 90upx;
				height: 90upx;
			}
		}

		.agreement {
			width: 750upx;
			position: fixed;
			bottom: 40upx;
		}
	}

	/* #endif */
	.openButton {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.phone_popup_content {
		width: 570upx;

		.title {
			justify-content: center;
			padding: 40upx;
			font-weight: bold;
			font-size: 32upx;
		}

		.content {
			justify-content: center;
			padding: 0 30upx;
		}

		.button {
			margin-top: 30upx;
			padding: 30upx;
			justify-content: center;
			font-size: 36upx;
			color: $color;
			position: relative;
		}
	}

	.choose_role_content {
		width: 600upx;

		.select_item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20upx;
			background: #f7f7f7;
			border-radius: 20upx;

			&:last-child {
				margin-bottom: 0;
			}

			image {
				width: 200upx;
				height: 200upx;
			}

			text {
				padding-right: 40upx;
				font-size: 42upx;
				font-weight: 700;
			}
		}
	}
</style>