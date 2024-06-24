<template>
	<view class="container">
		<u-navbar back-text=" " :back-icon-name="backHome?'home':'nav-back'" title="营养测评问卷" title-size="32" title-bold
			:custom-back="back"></u-navbar>
		<view class="box" v-if="tabNum == 1">

			<view class="u-flex-col">
				<view style="font-size: 28rpx;font-weight: bold;">姓名</view>
				<u-input :height="88" v-model="formData.name" type="text" input-align="left"
					placeholder-style="font-size:24rpx;" :custom-style="cs" placeholder="请填写" />
			</view>
			<view class="u-flex-col">
				<view style="font-size: 28rpx;font-weight: bold;">性别</view>
				<view class="cs" style="height:88rpx">
					<u-radio-group placeholder="请选择" size="26" icon-size="10" active-color="#00B8A2"
						v-model="formData.sex">
						<u-radio :name="1">男</u-radio>
						<u-radio :name="0">女</u-radio>
					</u-radio-group>
				</view>

			</view>
			<view class="u-flex-col">
				<view style="font-size: 28rpx;font-weight: bold;">年龄</view>
				<u-input :height="88" v-model="formData.age" type="number" input-align="left"
					placeholder-style="font-size:24rpx;" :custom-style="cs" @input="ageInput" placeholder="请填写" />
			</view>
			<view  class="u-flex-col">
				<view style="font-size: 28rpx;font-weight: bold;">联系方式</view>
				<u-input :height="88" v-model="formData.mobile" type="tel" input-align="left"
					placeholder-style="font-size:24rpx;" :custom-style="cs" placeholder="请填写" />
			</view>
			<view class="u-flex-col">
				<view style="font-size: 28rpx;font-weight: bold;">身高(cm)</view>
				<u-input :height="88" v-model="formData.height" @input="numberFixedDigit($event,'height')" type="digit"
					input-align="left" placeholder-style="font-size:24rpx;" :custom-style="cs" placeholder="请填写" />
			</view>
			<view class="u-flex-col">
				<view style="font-size: 28rpx;font-weight: bold;">体重(kg)</view>
				<u-input :height="88" v-model="formData.weight" @input="numberFixedDigit($event,'weight')" type="digit"
					input-align="left" placeholder-style="font-size:24rpx;" :custom-style="cs" placeholder="请填写" />
			</view>


			<view style="position: fixed;bottom:110rpx;width: 100%;left: 0;" class="u-flex-xy-center">
				<my-button :stop="stop" fontSize="30" @click="submit" width="584" height="80">下一步</my-button>
			</view>
		</view>

		<view v-if="tabNum == 2" class="form_question">
			<!-- <image :src="data.url" style="width:750rpx" mode="widthFix"></image> -->
			<u-form :label-style="{fontSize: '36rpx',fontWeight:'bold'}" :model="form" ref="uForm" label-position="top"
				:rules="rules" :errorType="['message']">

				<u-form-item prop="drug" label="1.您当前在服用或注射的药物有？">
					<u-checkbox-group wrap active-color="#00B8A2">
						<u-checkbox @change="checkboxGroupChange1" v-model="item.checked"
							v-for="(item, index) in drugList" :key="index" :name="item.value">
							{{ item.label }}
						</u-checkbox>
					</u-checkbox-group>
				</u-form-item>
			</u-form>
			<view style="text-align: center;width: 100%;padding-bottom:110rpx;margin-top: 40rpx;"
				class="u-flex-xy-center">
				<my-button fontSize="30" bg="#E8E8E8" color="black" border="#E8E8E8" @click="beforStep" width="232"
					height="80">上一步</my-button>
				<my-button style="margin-left:116rpx" fontSize="30" @click="submit" width="232"
					height="80">下一步</my-button>
			</view>
			<!-- <view v-if="data.is_consent_user_sign === 0 && userId == data.to_user_id"
				style="text-align: center;width: 100%;padding-bottom:110rpx" class="u-flex-xy-center">
				<my-button fontSize="30" @click="submit" width="692" height="102">下一步</my-button>
			</view> -->

		</view>
		<view v-if="tabNum == 3">
			<Condition3 @gotohome="backHome = true" :formData="formData" :condition="condition1"
				:conditionII="condition2" :detailId="id" @submit="submit"></Condition3>

		</view>
		<view v-if="tabNum == 4" class="form_question">
			<!-- <template v-if="resultAll.age > 80">
				<view class="result" style="padding: 32rpx 50rpx;margin-top: 50rpx;">


					<view class="result_title">综合健康评分</view>
					<view style="font-size: 28rpx;margin-bottom: 24rpx;line-height: 1.5;">
						以下是一些基本的健康建议，您可以根据自身状况和医生的建议进行个性化的健康管理：</view>
					<view class="result_common" style="font-size: 28rpx;">


						<view style="line-height: 1.5;">1.
							营养均衡饮食：确保摄入足够的蛋白质、维生素、矿物质和其他营养素，以维持良好的健康状态。建议多食新鲜水果、蔬菜、全谷类、瘦肉、鱼类等食物。</view>

						<view style="line-height: 1.5;">2. 适量运动：进行适度的体能活动，如散步、太极拳、瑜伽等。活动有益于保持肌肉力量、骨密度和心血管健康，同时可以改善心情和睡眠。
						</view>

						<view style="line-height: 1.5;">3. 定期体检：定期接受健康检查，包括血压、血糖、胆固醇等指标，以便及早发现潜在的健康问题。</view>

						<view style="line-height: 1.5;">4. 良好的心理健康：保持积极的心态，多参加社交活动，保持与家人和朋友的联系，预防孤独和抑郁。</view>

						<view style="line-height: 1.5;">5. 充足睡眠：每晚保持7-8小时的睡眠，充分休息对于老年人来说尤为重要。</view>
					</view>


				</view>
			</template> -->
			<template >
				<view style="padding: 20rpx 0;background: #F9F9F9;border-radius: 16rpx;">
					<view style="font-size: 32rpx;font-weight: bold;text-align: center;margin-bottom: 42rpx;">您的BMI评估结果
						<text :style="{color:setBMI,marginLeft:'12rpx'}">{{BMIFont}}</text>
					</view>
					<view class="move arrow" :style="{left:setMove}"
						style="font-size: 48rpx;font-weight: bold;display: inline-flex;flex-direction: column;">
						<text class="move movefont" :style="{left:-fontWidth/2 + 'px'}">{{resultAll.bmi}}</text>
						<u-icon name="arrow-down-fill" size="28"></u-icon>
					</view>

					<!-- 		<view  style="font-size: 48rpx;font-weight: bold;" class="move movefont" :style="{left:setMove1}">{{resultAll.bmi}}</view>
						<u-icon  class="move arrow" :style="{left:setMove}" name="arrow-down-fill" size="28"></u-icon> -->
					<image :src="`${imgUrl}queBMI.png`"
						style="height: 80rpx;width: 100%;object-fit: contain;display: block;" mode=""></image>
				</view>
				<view
					style="color:#D3D3D3;font-size: 20rpx;display: flex;flex-direction: column;justify-content: center;align-items: center;height: 160rpx;">
					<view style="margin-bottom: 16rpx;">BMI是通过我们人体体重与身高这两个数值来获得的，</view>

					<view>可有效评判人体的健康营养情况</view>

				</view>
				<template v-if="resultAll.result">

					<!-- <view style="font-size: 32rpx;font-weight: bold;margin:16rpx 0">健康评估结果</view> -->
					<view class="result" v-for="(item,index) of  resultAll.result.result1" :key="index">

						<template>
							<view class="result_title">{{item.k || ''}}</view>
							<view v-for="(c,v) of item.row" :key="v" class="result_common">
								{{c}}
							</view>
						</template>

					</view>

				</template>
			</template>

			<view style="text-align: center;width: 100%;padding-bottom:110rpx;margin-top: 40rpx;"
				class="u-flex-xy-center">
				<!-- <my-button fontSize="30" bg="#E8E8E8"  @click="beforStep" width="232" height="80">上一步</my-button> -->
				<my-button fontSize="30" @click="submit" width="584" height="80">下一步</my-button>
			</view>

		</view>
		<view v-if="tabNum == 5" class="form_question">


			<template v-if="result2">
				<template v-if="result2.result1">
					<view style="font-size: 32rpx;font-weight: bold;margin:16rpx 0">健康评估结果</view>
					<view class="result" v-for="(item,index) of  result2.result1" :key="index">
						<template v-if="item.row.length === 1">
							<view class="result_title">{{item.k || ''}}:{{item.row[0]}}</view>
						</template>
						<template v-else>
							<view class="result_title">{{item.k || ''}}</view>
							<view v-for="(c,v) of item.row" :key="v" class="result_common">
								{{c}}
							</view>
						</template>

					</view>
				</template>
				<template v-if="result2.result2">
					<view style="font-size: 32rpx;font-weight: bold;margin:16rpx 0">生活方式评估</view>
					<view class="result" v-for="(item,index) of  result2.result2" :key="index">
						<template v-if="item.row.length === 1">
							<view class="result_title">{{item.k || ''}}:{{item.row[0]}}</view>
						</template>
						<template v-else>
							<view class="result_title">{{item.k || ''}}</view>
							<view v-for="(c,v) of item.row" :key="v" class="result_common">
								{{c}}
							</view>
						</template>

					</view>
				</template>
				<template v-if="result2.result3">
					<view style="font-size: 32rpx;font-weight: bold;margin:16rpx 0">健康总评估</view>
					<view class="result" v-for="(item,index) of  result2.result3" :key="index">
						<template v-if="item.row.length === 1">
							<view class="result_title">{{item.k || ''}}:{{item.row[0]}}</view>
						</template>
						<template v-else>
							<view class="result_title">{{item.k || ''}}</view>
							<view v-for="(c,v) of item.row" :key="v" class="result_common">
								{{c}}
							</view>
						</template>

					</view>
				</template>
			</template>
			<view style="position: fixed;bottom:110rpx;width: 100%;left: 0;" class="u-flex-xy-center">
				<my-button fontSize="30" @click="submit" width="692" height="102">完成</my-button>
			</view>

		</view>
		<u-popup v-model="popshow" mode="center" border-radius="24" width="640" height="574" closeable>
			<view style="padding:42rpx 76rpx">
				<view style="color:#9B9B9B;text-align: center;" class="u-font-24">重要提醒</view>
				<view style="color:#2A2A2A;margin: 42rpx 0 58rpx 0;" class="u-font-28">你输入的姓名为</view>
				<view style="margin-bottom:58rpx;color:#2A2A2A;font-weight: bold;font-size: 40rpx;text-align: center;">
					{{formData.name}}
				</view>
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
	import Condition3 from './components/condition3.vue'
	export default {
		data() {
			return {
				condition1: '',
				condition2: '',
				backHome: false,
				BMItext: 0,
				BMIFont: '正常',
				resultAll: {
					bmi: 29.9,
					age: 11
				},
				fontWidth: 0,
				
				form: {

					drug: '',

				},
				cs: {
					borderRadius: '12rpx',
					background: '#F0F0F0',
					margin: '18rpx 0',
					padding: '0 18rpx'
				},
				result1: {},
				result2: {},
				rules: {

					drug: [{
						required: true,
						message: '请选择',
						type: 'array',
						trigger: 'change'
					}],
				},

				drugList: [{
						label: '无',
						checked: false,
						disabled: false,
						value: 1
					},
					{
						label: '降糖药',
						checked: false,
						disabled: false,
						value: 2
					},
					{
						label: '降压药',
						checked: false,
						disabled: false,
						value: 3
					},
					{
						label: '降尿酸药物',
						checked: false,
						disabled: false,
						value: 4
					},
					{
						label: '降血脂药物',
						checked: false,
						disabled: false,
						value: 5
					},
					{
						label: '心血管疾病药物',
						checked: false,
						disabled: false,
						value: 6
					},
					{
						label: '其他疾病药物',
						checked: false,
						disabled: false,
						value: 7
					},
				],
				popshow: false,

				userId: '',
				settings: { //签名设置
					width: '638', //签名区域的宽
					height: '366', //签名区域的高
					lineWidth: 3, //签名时线宽
					textColor: '#00B8A2' //签名文字颜色
				},
				tabNum: 1, //第一步
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
					sex: null,
					age: '',
					height: '',
					weight: '',
					mobile: ''
				},
				questions2Info: {}
			}
		},
		onReady() {


		},
		onLoad(option) {
			console.log('option', option)
			console.log('$store.state.user.userInfo', this.$store.state.user.userInfo)
			this.userId = this.$store.state.user.userInfo.id
			if (option.id) {
				this.id = option.id


				this.getDetail()
			}

			if (option.nextTabNum) {
				this.nextTabNum = Number(option.nextTabNum)
				this.tabNum = this.nextTabNum || 1
			}

			// if (uni.getStorageSync('questions2Info')) {
			// 	this.formData = JSON.parse(uni.getStorageSync('questions2Info'))

			// }

			// if (option.is_me_send && option.is_me_send !== 'undefined') { //点击自己聊天框的知情同意书
			// 	this.is_me_send = Number(option.is_me_send) 
			// }

			// setTimeout(()=>{

			// 	this.setMove1()
			// },1000)

		},
		components: {
			myButton,
			Signature,
			Condition3
		},
		computed: {
			BMI() {
				let flag = ''
				if (this.formData.height && this.formData.weight) {
					flag = (this.formData.weight / (this.formData.height / 100) ** 2).toFixed(2)
				}
				return flag
			},
			showBMI() {

				return Boolean(this.$refs.arrow)
			},
			setBMI() {
				let colorObj = {
					'-1': '#2985EA',
					0: '#0EB287',
					1: '#F8D84C',
					2: '#E3663B',
				}
				return colorObj[this.BMItext]

			},
			setMove() {
				let obj = '-14rpx'
				console.log(this.resultAll.bmi)
				if (this.resultAll.bmi) {
					if (this.resultAll.bmi < 18.5) {

					}
					if (this.resultAll.bmi >= 18.5 && this.resultAll.bmi < 28) {
						//偏移量 aa
						let aa = 1 / (28 + 1 + 1 - 18.5) * 100 - 1.5
						console.log('aa: ', aa)
						let a = this.resultAll.bmi - 18.5
						console.log('a: ', a)
						let left = (aa + a / (28 + 1 + 1 + 0.5 - 18.5) * 100).toFixed(2)

						obj = left + '%'
						console.log('left: ', left)
					}
					if (this.resultAll.bmi >= 28) {
						obj = '95%'
					}
				}

				console.log('obj ', obj)

				return obj


			},

		},
		watch: {
			'formData': {
				handler(val) {
					
					this.stop = true
			
					let arr = Object.keys(this.formData)
					
					let type = arr.some(v => this.formData[v] === '' || this.formData[v] === null)
					if (!type) this.stop = false
			
				},
				deep: true
			}
		},
		methods: {
			ageInput(e) {

				e = e.replace(/^0|[^\d]|[.]/g, '')
				this.$nextTick(() => {
					this.formData.age = e
				})
			},
			numberFixedDigit(e, key) { // 固定两位小数

				e = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
				this.$nextTick(() => {
					this.formData[key] = e
				})
			},
			setMove1() {


				let query = wx.createSelectorQuery().in(this);
				let that = this
				query.select('.movefont').boundingClientRect(function(rect) {
					// 在这里可以获取到自定义组件的位置信息 rect
					console.log('自定义组件的位置信息1111：', rect);
					if (!rect) return
					that.fontWidth = rect.width - uni.upx2px(20)
					if (that.resultAll.bmi < 18.5) {
						that.fontWidth = 0
					}
					if (that.resultAll.bmi >= 28) {
						that.fontWidth = rect.width * 1.5
					}
					// query.select('.movefont').boundingClientRect(function(r) {
					//   // 在这里可以获取到自定义组件的位置信息 r
					//   console.log('自定义组件的位置信息11111：', r);

					// }).exec();
				}).exec();
			},
			checkboxGroupChange1(e) {
				const { name, value } = e
				console.log('e: ', e)
				if (name === 1) {
					//这个是选择无 取消所有
					this.drugList.forEach(v => v.checked = value && v.value === name)
				} else {
					this.drugList.forEach(v => {
						if (v.value == 1) {
							v.checked = false
						}
						if (v.value == name) {
							v.checked = value && true
						}
					})
				}

				this.form.drug = this.drugList.filter(v => v.checked).map(v => v.value)
				console.log('this.form.drug: ', this.form.drug)
			},
			//多次解码
			getUrl(url) {
				if (url.indexOf('%') < 0) {
					return url
				} else {
					const newUrl = decodeURIComponent(url)
					return this.getUrl(newUrl)
				}
			},
			back() {

				if (this.backHome) {
					uni.reLaunch({
						url: `/pages/tabbar/diary`
					})
				} else {
					uni.navigateBack()
				}


			},
			setImgUrl(e) {
				e.then(res => {


				})

			},

			getDetail() {

				this.$request({
					url: '/ApiV3/Mobile/AssessmentReport/v2Show',
					method: 'get',
					loading: true,
					data: {
						id: this.id
					}
				}).then((res) => {
					
						let data = res.data
						this.formData.name = data.name
						this.formData.sex =  data.sex 
						this.formData.age = Number(data.age)  ||''
						this.formData.mobile = data.mobile
						this.formData.height = Number(data.height)  || ''
						this.formData.weight = Number(data.weight)  || ''
						
						if (data.value) {
							if (data.value.condition1) {
								this.form.drug = data.value.condition1.q2
								this.condition1 = data.value.condition1
								
								this.drugList.forEach(v => {
										if (this.form.drug.includes(v.value)) {
											v.checked = true
										}

								})
						}
						
						if (data.value.condition2) {
							this.condition2 = data.value.condition2
						}
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
		saveInfo(key = '', params = '') {
			let formData = {
				name: this.formData.name,
				mobile: this.formData.mobile,
				weight: Number(this.formData.weight),
				height: Number(this.formData.height),
				age: Number(this.formData.age),
				sex: Number(this.formData.sex),
			}
			
			if(this.condition1){
				formData.condition1 = this.condition1
			}
			if(this.condition2){
				formData.condition2 = this.condition2
			}
			
			return new Promise((resolve, reject) => {
				this.$request({
					url: '/ApiV3/Mobile/AssessmentReport/v2save',
					loading: true,
					data: {
						id: this.id || 0,
						value: {
							...formData,
							[key]: params,
						},

					}
				}).then((res) => {

					this.id = res.data.id
					this.resultAll = res.data
					// this.BMIFont = res.data.result ? (res.data.result?.result1?.[0]?.row?.[0] || '') :
					// 	''
					this.BMIFont = res.data.result ? res.data.result.bmi_info.row :
						''
					if (res.data.bmi < 18.5) {
						this.BMItext = -1;
						this.BMIFont = '消瘦'
					}
					if (res.data.bmi >= 18.5 && res.data.bmi < 24) {
						this.BMItext = 0;
						this.BMIFont = '正常'
					}
					if (res.data.bmi >= 24 && res.data.bmi < 28) {
						this.BMItext = 1;
						this.BMIFont = '超重'
					}
					if (res.data.bmi >= 28) {
						this.BMItext = 2;
						this.BMIFont = '肥胖'
					}
					if (this.tabNum === 2) {

						setTimeout(() => {
							this.setMove1()
						}, 1000)

					}

					console.log(res)
					// this.popshow = false
					resolve()

				})
			})

		},

		saveSign() {

			// let that = this
			try {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Questionnaire/sign',


						loading: true,
						errMsg: true,
						upload: true,
						data: {
							id: this.id
						}
					}).then(res => {
						console.log('上传签名', res)
						resolve()
					}).catch(err => {

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
			} catch (e) {
				//TODO handle the exception
				console.log(e)
			}


		},
		async nextStep() {
			await this.saveInfo()

			// uni.navigateTo({
			// 	url: '/pages/question/question2?id=' + this.id + '&nextTabNum=' + 2
			// })
		},
		beforStep() {
			this.tabNum = this.tabNum - 1
			console.log(this.tabNum)
		},
		async submit(form1) {
			let nextTabNum;
			if (this.tabNum === 1) {
				if (this.formData.age <= 0 || this.formData.age > 200) return this.$common.toast('年龄范围在(0-200]')
				if (!this.$u.test.mobile(this.formData.mobile)) return this.$common.toast('请输入正确手机号')
				if (this.formData.height <= 0 || this.formData.height > 500) return this.$common.toast(
					'身高范围在(0-500]')
				if (this.formData.weight <= 0 || this.formData.weight > 500) return this.$common.toast(
					'体重范围在(0-500]')

				await this.saveInfo()
				this.tabNum = 2
				setTimeout(() => {
					this.$refs.uForm.setRules(this.rules);
				}, 50)
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					})
				}, 200)
				// this.popshow = true
				return
			}
			if (this.tabNum === 2) {
				console.log('this.$refs.uForm: ', this.$refs.uForm)
				console.log('this.form: ', this.form)
				this.$refs.uForm.validate(async valid => {

					if (valid) {
						nextTabNum = 4
						// if(!this.model.agreement) return this.$u.toast('请勾选协议');
						this.condition1 = {
							q2: this.form.drug,
						}
						await this.saveInfo('condition1', this.condition1)
						this.tabNum = 4
						setTimeout(() => {
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 300
							})
						}, 200)
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
				return
			}
			if (this.tabNum === 4) {
				console.log(form1)
				this.tabNum = 3
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					})
				}, 200)

				// await this.saveSign()
				return
			}


		}
	}
	}
</script>

<style lang="scss" scope>
	page {
		// background: #f7f7f7;
	}

	.container {
		background: #fff;
		min-height: 100vh;

		.cs {
			border-radius: 12rpx;
			background: #F0F0F0;
			margin: 18rpx 0;
			padding: 0 18rpx;
			display: flex;
			align-items: center;
		}

		.box {
			margin: 40rpx;
			width: 670rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			opacity: 1;
		}

		.move {
			position: relative;
			left: 0rpx;
		}

		.result {
			display: flex;
			flex-direction: column;
			margin: 12rpx 0;
			background-color: #F9F9F9;
			min-height: 300rpx;
			justify-content: center;
			align-items: center;
			border-radius: 16rpx;
			padding: 24rpx
		}

		.result_title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 12rpx;

		}

		.result_common {
			color: #0EB287;
			font-size: 32rpx;

			font-weight: bold;
		}

		.form_question {
			padding: 0 48rpx;

			.u-checkbox {
				align-items: flex-start;
				margin-top: 12rpx;

				.u-checkbox__icon-wrap {
					margin-top: 12rpx;
				}
			}
		}
	}
</style>