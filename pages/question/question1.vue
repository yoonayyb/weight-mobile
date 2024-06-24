<template>
	<view class="container">
		<u-navbar back-text=" "  title="知情同意书" title-size="32" title-bold :custom-back="back"></u-navbar>
		<view class="box" v-if="tabNum === 1">
			<view class="u-font-24" style="padding:18rpx 32rpx;color:#888888;border-bottom: 2rpx solid #F7F7F7;">信息确认
			</view>
			<view class="u-flex u-flex-between" style="padding:26rpx 66rpx 30rpx 92rpx">
				<view style="font-size: 28rpx;">姓名</view>
				<u-input v-model="formData.name" type="text" input-align="right" height="40"
					placeholder-style="font-size:24rpx" placeholder="请输入" />
			</view>
			<view class="u-flex u-flex-between" style="padding:26rpx 40rpx 30rpx 92rpx">
				<view style="font-size: 28rpx;">性别</view>
				<u-radio-group size="26" icon-size="10" active-color="#00B8A2" v-model="formData.sex">
					<u-radio :name="1">男</u-radio>
					<u-radio :name="0">女</u-radio>
				</u-radio-group>
			</view>
			<view class="u-flex u-flex-between" style="padding:26rpx 66rpx 30rpx 92rpx">
				<view style="font-size: 28rpx;">出生日期</view>
				<u-input @click="show = true" v-model="formData.date" type="select" input-align="right" height="40"
					placeholder-style="font-size:24rpx" placeholder="请选择" />
			</view>
			<view class="u-flex u-flex-between" style="padding:26rpx 66rpx 30rpx 92rpx">
				<view style="font-size: 28rpx;">联系电话</view>
				<u-input v-model="formData.mobile" type="number" input-align="right" height="40"
					placeholder-style="font-size:24rpx" placeholder="请输入" />
			</view>
			<view style="position: fixed;bottom:110rpx;width: 100%;left: 0;" class="u-flex-xy-center">
				<my-button :stop="stop" fontSize="30" @click="submit" width="692" height="102">下一步</my-button>
			</view>
		</view>

		<view v-if="tabNum == 2">
			<image :src="data.url" style="width:750rpx" mode="widthFix"></image>
			<view v-if="data.is_consent_user_sign === 0 && userId == data.to_user_id"
				style="text-align: center;width: 100%;padding-bottom:110rpx" class="u-flex-xy-center">
				<my-button fontSize="30" @click="submit" width="692" height="102">下一步</my-button>
			</view>

		</view>
		<view v-if="tabNum == 3">

			<view class="box">
				<view class="u-font-24" style="padding:18rpx 32rpx;color:#888888;border-bottom: 2rpx solid #F7F7F7;">签字
				</view>
				<!-- <jushi-signature :settings="settings" @change="signatureChange"></jushi-signature> -->
				<Signature @input="setImgUrl"  ref="sig" v-model="imgUrl"></Signature>
				<view style="position: fixed;bottom:110rpx;width: 100%;left: 0;" class="u-flex-xy-center">
					<my-button :stop="!imgUrl" fontSize="30" @click="submit" width="692" height="102">完成</my-button>
				</view>
			</view>
		</view>
		<u-popup v-model="popshow" mode="center" border-radius="24" width="640" height="574" closeable>
			<view style="padding:42rpx 76rpx">
				<view style="color:#9B9B9B;text-align: center;" class="u-font-24">重要提醒</view>
				<view style="color:#2A2A2A;margin: 42rpx 0 58rpx 0;" class="u-font-28">你输入的姓名为</view>
				<view style="margin-bottom:58rpx;color:#2A2A2A;font-weight: bold;font-size: 40rpx;text-align: center;">
					{{formData.name}}</view>
				<view style="color:#00B8A2;margin-bottom: 44rpx;" class="u-font-22">请确认已填写您的真实姓名，必须与签名确认的姓名相同。</view>
				<view class="u-flex u-flex-between">
					<my-button bg="#ECECEC" border="#ECECEC" color="#9B9B9B" @click="popshow = false" width="200"
						height="72">稍等</my-button>
					<my-button @click="nextStep()" width="200" height="72">确认</my-button>
				</view>
			</view>
		</u-popup>
		<u-picker v-model="show" :default-time="formData.date" :params="params" mode="time"
			@confirm="confirm"></u-picker>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	import Signature from './sin-signature/sin-signature.vue'
	export default {
		data() {
			return {
				popshow: false,
				imgUrl: '', //签名
				userId:'',
				settings: { //签名设置
					width: '638', //签名区域的宽
					height: '366', //签名区域的高
					lineWidth: 3, //签名时线宽
					textColor: '#00B8A2' //签名文字颜色
				},
				tabNum: "", //第一步
				nextTabNum: '', //下一步
				is_me_send: 0, //是否是自己发给自己的
				id: '',
				show: false,
				stop: true,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				data: {},
				formData: {
					name: '',
					sex: 1,
					date: '',
					mobile: ''
				}
			}
		},
		onLoad(option) {
			console.log('option', option)
			console.log('$store.state.user.userInfo.id', this.$store.state.user.userInfo.id)
			this.userId = this.$store.state.user.userInfo.id
			if (option.id) {
				this.id = option.id
				this.getDetail()
			}
			if (option.nextTabNum) {
				this.nextTabNum = Number(option.nextTabNum)
			}
			// if (option.is_me_send && option.is_me_send !== 'undefined') { //点击自己聊天框的知情同意书
			// 	this.is_me_send = Number(option.is_me_send) 
			// }

		},
		components: {
			myButton,
			Signature
		},
		watch: {
			'formData': {
				handler(val) {
					console.log(111, val)
					this.stop = true
					let arr = Object.keys(this.formData)
					let type = arr.some(v => this.formData[v] === '')
					if (!type) this.stop = false
				},
				deep: true
			},
		},
		methods: {
			//多次解码
			getUrl(url) {
			  if (url.indexOf('%') < 0) {
			    return url
			  } else {
			    const newUrl = decodeURIComponent(url)
			    return this.getUrl(newUrl)
			  }
			},
			back(){
				
				let page = getCurrentPages()
				
				console.log('page',page)
				console.log(this.data)
				let arr = page.map(v=>v.$page.fullPath)
				
				let currentPages = page[page.length - 2]
				let url = ''
				if(this.data.is_consent_user_sign === 1 && arr.find(v=>v.includes('/manage/ask'))){
					url = arr.filter(v=>v.includes('/manage/ask')) && arr.filter(v=>v.includes('/manage/ask'))[0]
					
					let index = arr.filter(v=>v.includes('/question/question1')) && arr.filter(v=>v.includes('/question/question1')).length
					console.log('backIndex',index)
					let aindex = arr.indexOf(url)
					console.log('aindex',aindex)
					page[aindex].$vm.setQuestion(this.id)
					uni.navigateBack({
						delta: index
					})
				}else if(this.data.is_consent_user_sign === 1 && arr.find(v=>v.includes('/message/messageChat'))){
					
					url =  arr.filter(v=>v.includes('/message/messageChat')) && arr.filter(v=>v.includes('/message/messageChat'))[0]
					let aindex = arr.indexOf(url)
					console.log('aindex',aindex)
					page[aindex].$vm.setQuestion(this.id)
					let index = arr.filter(v=>v.includes('/question/question1')) && arr.filter(v=>v.includes('/question/question1')).length
					console.log('backIndex',index)
					uni.navigateBack({
						delta: index
					})
				
				
				}else{
					uni.navigateBack()
				}
				
			},
			setImgUrl(e){
				e.then(res=>{
					this.imgUrl = res
					console.log('this.imgUrl',this.imgUrl)
				})
				
			},
			
			getDetail() {
				this.$request({
					url: '/ApiV3/Mobile/Questionnaire/show',
					method: 'get',
					loading: true,
					data: {
						id: this.id
					}
				}).then((res) => {
					console.log(res)
					this.data = res.data
					let data = this.$store.state.user.userInfo
					
					this.formData.name = data.realname
					this.formData.sex = data.sex
					this.formData.date = data.birthday
					this.formData.mobile = data.mobile
					//如果传有nextTabNum 就按照传进来的为准
					if (this.nextTabNum) {
						this.tabNum = this.nextTabNum
						if (this.nextTabNum == 3) {
							// this.$refs.sig.getSyncSignature();
						}
					} else if (res.data.to_user_id == this.userId && res.data
						.is_consent_user_sign === 0) {

						this.tabNum = 1
						//复显数据
						

					} else {
						this.tabNum = 2
					}

				})
			},
			confirm(e) {
				const {
					year,
					month,
					day
				} = e
				this.formData.date = year + '-' + month + '-' + day
			},
			saveInfo() {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Questionnaire/updateInfo',
						loading: true,
						data: {
							id: this.id,
							realname: this.formData.name,
							mobile: this.formData.mobile,
							birthday: this.formData.date,
							sex: this.formData.sex,
						}
					}).then((res) => {

						console.log(res)
						this.popshow = false
						resolve()

					})
				})

			},
			saveSign() {
				
				// let that = this
				try{
					return new Promise((resolve, reject) => {
						this.$request({
							url: '/ApiV3/Mobile/Questionnaire/sign',
							
							file:this.imgUrl,
							loading: true,
							errMsg:true,
							upload:true,
							data: {
								id: this.id
							}
						}).then(res=>{
							console.log('上传签名', res)
							resolve()
						}).catch(err=>{
							
						})
					// 	uni.uploadFile({
					// 		url: that.$common.commonApi.api.new + '/ApiV3/Mobile/Questionnaire/sign',
					// 		filePath: that.imgUrl,
					// 		name: 'file',
							// header: {
							// 	authorization: 'Bearer ' + uni.getStorageSync('token')
							// },
					// 		formData: {
					// 			id: that.id
					// 		},
					// 		success(res) {
					// 			console.log('resres', res)
					// 			if (res.statusCode === 200) {
					// 				console.log('上传签名', JSON.parse(res.data))
					// 				resolve()
					// 			} else {
					
					// 			}
					
					// 		},
					// 		fail(err) {
					// 			console.log(err)
					// 			that.$common.toast('签名上传失败')
					// 		},
					// 		complete(e){
					// 			console.log(e)
					// 		}
					// 	})
					})
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}	
				

			},
			async nextStep() {
				await this.saveInfo()
				uni.navigateTo({
					url: '/pages/question/question1?id=' + this.id + '&nextTabNum=' + 2
				})
			},
			async submit() {
				let nextTabNum;
				if (this.tabNum === 1) {
					nextTabNum = 2
					if (!this.$u.test.mobile(this.formData.mobile)) return this.$common.toast('请输入正确手机号')
					this.popshow = true
					return
				}
				if (this.tabNum === 2) {
					nextTabNum = 3
				}
				if (this.tabNum === 3) {
					nextTabNum = 2
					 await this.saveSign()
					
				}
				uni.navigateTo({
					url: '/pages/question/question1?id=' + this.id + '&nextTabNum=' + nextTabNum
				})
			}
		}
	}
</script>

<style lang="scss" scope>
	page {
		background: #f7f7f7;
	}

	.container {
		background: #f7f7f7;
		min-height: 100vh;

		.box {
			margin: 40rpx;
			width: 670rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			opacity: 1;
		}
	}
</style>