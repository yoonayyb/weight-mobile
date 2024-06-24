<template>
	<view class="container1 form_question" :style="{paddingBottom:'400rpx' }">
		<template v-if="step === -1">
			<view style="margin: 50rpx auto;font-size: 36rpx;font-weight: bold;">接下来是生活方式评估测试！</view>
		</template>
		<temlate v-else-if="step <10">
			<view class="tip">{{list[step].tip}}</view>
			<view class="title" >
				<view v-for="(item,index) of list[step].title" :key="index" :class="{smalltitle:index !== 0}">{{item}}</view>
			</view>
			<view style="padding-left: 60rpx;">
				<u-radio-group @change="change" v-model="form1['q'+(step+1)]" active-color="#00B8A2" wrap>
					<u-radio shape="square" v-for="(item, index) in list[step].options" :key="index" :name="item.value">
						{{ item.label }}
					</u-radio>
				</u-radio-group>
				<view class="result" v-if="list[step].suggest && form1['q'+(step+1)] > 'A' && list[step].suggest[form1['q'+(step+1)]]">
					<view style="font-size: 28rpx;margin-bottom: 16rpx;">给您的生活方式建议：</view>
					<view style="font-size: 28rpx;font-weight: bold;color:#0EB287">
						{{list[step].suggest[form1['q'+(step+1)]]}}
					</view>
				</view>
			</view>
		</temlate>
		<template v-else-if="step == 10">
			<view class="result1">
				<view style="font-size: 28rpx;margin-bottom: 16rpx;">生活方式评估</view>
				<view style="font-size: 28rpx;font-weight: bold;color:#0EB287">
					<template>
						<view class="result_title">{{result2[0] && result2[0].k}}</view>
					</template>
				</view>
			</view>
			<view v-if="result2[0] && result2[0].row.length"
				style="color:#D3D3D3;font-size: 20rpx;display: flex;flex-direction: column;justify-content: center;align-items: center;height: 100rpx;">
				<view style="margin-bottom: 16rpx;">以下是一些给您的生活方式建议：</view>



			</view>
			<view v-if="result2[0] && result2[0].row.length" class="result1" >
				<view style="font-size: 28rpx;margin: 12rpx;line-height: 1.5;" v-for="(item,index) of result2[0].row " :key="index">
					{{item}}
				</view>

			</view>
		</template>
		<template v-else-if="step == 11">
			<view class="result1">
				<view style="font-size: 28rpx;margin-bottom: 16rpx;">健康总评估</view>
				<view style="font-size: 28rpx;font-weight: bold;color:#0EB287">
					<template>
						<view class="result_title">{{result3[0] && result3[0].k}}</view>
					</template>
				</view>
			</view>
			<view v-if="result3[0] && result3[0].row.length" class="result1" >
				<view style="font-size: 28rpx;margin: 12rpx;line-height: 1.5;" v-for="(item,index) of result3[0].row " :key="index">
					{{item}}
				</view>
			
			</view>
		</template>
		<template v-else>
			<image :src="`${imgUrl}thank.png`" style="width:670rpx;height: 312rpx;" ></image>
			<view style="margin: 64rpx 102rpx;font-size: 32rpx;text-align: center;line-height: 64rpx;color:#06291C">您所填写的内容已收到，营养师会在24小时内与您联系，请留意接听！</view>
			<image @click="back" :src="`${imgUrl}zixun.png`" style="position: fixed;bottom: 120rpx;width:670rpx;height: 164rpx;" ></image>
		</template>
		<view style="position: fixed; bottom:110rpx;width: 86%;" class="u-flex-xy-center">
			<tempalte class="u-flex-xy-center" v-if="step >-1 && step<10">
			<my-button fontSize="30" bg="#E8E8E8" color="black" border="#E8E8E8" @click="beforStep" width="232" height="80">上一步</my-button>
				<my-button   fontSize="30" style="margin-left:116rpx" @click="nextStep" width="232"
					height="80">下一步</my-button>
			</tempalte>
			<my-button v-else-if="step <=11" fontSize="30" @click="save" width="584" height="80">
				{{step ==11?'完成':'下一步'}}
			</my-button>
			<!-- <my-button v-else-if="step === 10" fontSize="30" @click="save" width="584" height="80">
				完成
			</my-button>	 -->
			<!-- <template v-if="step >-1 && step<=15">
				<my-button fontSize="30" bg="#E8E8E8" color="black" border="#E8E8E8" @click="beforStep" width="232" height="80">上一步</my-button>
				<my-button style="margin-left:116rpx" fontSize="30" @click="nextStep" width="232"
					height="80">下一步</my-button>
			</template>
			<my-button v-else-if="step <=17" fontSize="30" @click="save" width="584" height="80">
				{{step ==16?'完成':'下一步'}}
			</my-button>
			<template v-else>
				<my-button fontSize="30" bg="#E8E8E8" color="black" border="#E8E8E8" @click="redell" width="232" height="80">重做一遍</my-button>
				<my-button style="margin-left:116rpx" fontSize="30" @click="redellOther" width="232"
					height="80">帮别人做</my-button>
			</template> -->
		</view>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
import message from '../../../vuex/modules/message';

	
	export default {
		props: {
			formData: {
				type: Object,
				default: () => {}
			},
			detailId: {
				type: String | Number,
				default: 0
			},
			condition: {
				type: Object,
				default: () => {}
			},
			conditionII: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			
			return {
				result2: [{
					k: '',
					row: [],
				}],
				result3: [{
					k: '',
					row: [],
				}],
				step: -1,
				form1:{},
				list: [{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['1.您过去一周里吃早餐的次数是：'],

						options: [{
								label: '5-7次',

								value: 'A'
							},
							{
								label: '2-4次',

								value: 'B'
							},
							{
								label: '0-1次',

								value: 'C'
							},
						],
						q1: 1,
						suggest: {
							// A: '无',
							B: '每天吃早餐',
							C: '每天吃早餐',
						}
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title:['2.一般情况下，您吃一顿饭需要：'] ,
						q2: 1,
						suggest: {
							A: '',
							B: '用餐时间建议不小于15min',
							C: '用餐时间建议不小于15min',
						},
						options: [{
								label: '15min以上',

								value: 'A'
							},
							{
								label: '7-15min',

								value: 'B'
							},
							{
								label: '7min以内',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['3.一般情况下，您在一天里吃粗粮的次数是：'],
						q3: 1,
						suggest: {
							A: '',
							B: '主食粗细结合，每天摄入全谷物和杂豆类50-150g，如高粱、燕麦、小米、藜麦、荞麦、绿豆、芸豆、豌豆等',
							C: '主食粗细结合，每天摄入全谷物和杂豆类50-150g，如高粱、燕麦、小米、藜麦、荞麦、绿豆、芸豆、豌豆等',
						},
						options: [{
								label: '2次以上',

								value:'A'
							},
							{
								label: '1-2次',

								value: 'B'
							},
							{
								label: '0-1次',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title:[
							'4.您在过去一周里单次酒精摄入量超过15g的次数是：',
							' (相当于啤酒450mI/红酒150mI/低度白酒50mI)'
						],
						q4: 1,
						suggest: {
							A: '',
							B: '成年人一天饮酒的酒精量不超过15克',
							C: '成年人一天饮酒的酒精量不超过15克',
						},
						options: [{
								label: '0-1次',

								value: 'A'
							},
							{
								label: '2-4次',

								value: 'B'
							},
							{
								label: '≥5次',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title:['5.您在过去一周里喝含糖饮料的次数是：','(碳酸饮料、茶饮料、果汁等)'] ,
						q5: 1,
						suggest: {
							A: '',
							B: '建议不喝或少喝含糖饮料，饮用频率最好每周不超过1次（200-355毫升）',
							C: '建议不喝或少喝含糖饮料，饮用频率最好每周不超过1次（200-355毫升）',
						},
						options: [{
								label: '0-1次',

								value: 'A'
							},
							{
								label: '2-4次',

								value: 'B'
							},
							{
								label: '≥5次',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['6.您在过去一周里吃夜宵的次数是：'],
						q6: 1,
						suggest: {
							A: '',
							B: '减少夜宵的次数',
							C: '减少夜宵的次数',
						},
						options: [{
								label: '0-1次',

								value: 'A'
							},
							{
								label: '2-3次',

								value: 'B'
							},
							{
								label: '4-7次',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['7.您在过去一周里聚餐应酬次数是：'],
						q7: 1,
						suggest: {
							A: '',
							B: '减少聚餐应酬的次数',
							C: '减少聚餐应酬的次数',
						},
						options: [{
								label: '0-1次',

								value: 'A'
							},
							{
								label: '2-3次',

								value: 'B'
							},
							{
								label: '4-7次',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['8.您在过去一周里摄入高油高糖食物的次数是：','(油炸食物、甜品等)'],
						q8: 1,
						suggest: {
							A: '',
							B: '减少油高糖食物的摄入',
							C: '减少油高糖食物的摄入',
						},
						options: [{
								label: '0-2次',

								value: 'A'
							},
							{
								label: '3-5次',

								value: 'B'
							},
							{
								label: '6-7次',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['9.除工作外，您过去一周里的运动时长在：'],
						q9: 1,
						suggest: {
							A: '',
							B: '坚持日常身体活动，每周累计中等强度身体活动150分钟以上',
							C: '坚持日常身体活动，每周累计中等强度身体活动150分钟以上',
						},
						options: [{
								label: '150分钟以上',
						
								value: 'A'
							},
							{
								label: '60--150分钟',
						
								value: 'B'
							},
							{
								label: '少于60分钟',
						
								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title:[ '10.过去一周您平均每天的睡眠时长：'],
						q10: 1,
						suggest: {
							A: '',
							B: '增加睡眠时间，成人每日平均睡眠时间为7-8小时',
							C: '增加睡眠时间，成人每日平均睡眠时间为7-8小时',
						},
						options: [{
								label: '7小时以上',
					
								value: 'A'
							},
							{
								label: '4-6小时',
					
								value: 'B'
							},
							{
								label: '1-3小时',
					
								value: 'C'
							},
						]
					},
				],


			}
		},
		components: {
			myButton,

		},
		mounted() {
			this.restForm1()
			
		},
		watch:{
			conditionII:{
				handler(val){
					
					if(val){
					// 	this.form1 = val
					    setTimeout(()=>{
							for(let i = 1;i<=10;i++){
								this.$set(this.form1,'q' + i,val['q' + i])
							}
							console.log('condition22222222222: ', val)
							console.log('this.form1: ', this.form1)
						},50)
						
					}
				},
				deep:true,
				immediate:true,
			}
		},
		methods: {
			restForm1(){
				// 使用循环创建10个对象，并设置key值为q1到q10
				let form1 = {}
				for (var i = 1; i <= 10; i++) {
					var key = 'q' + i;
					form1[key] = '';
				
				}
				this.form1 = form1
			},
			change(e) {
				
			},
			beforStep() {
				this.step--
			},
			back() {
				let page = getCurrentPages()
				let currentPages = page[page.length - 2]
				console.log('currentPages: ', currentPages)
				currentPages.$vm.scrollBottom()
				uni.navigateBack()
			
			
			},
			save(){
				// console.log('this.step: ', this.step)
				
				this.step++
				
			},
			
			async nextStep() {
				
				
					if(this.step > -1 && !this.form1['q'+(this.step+1)]){
						
						
						return this.$common.toast('请勾选')
					}
					this.step++
					if(this.step == 10){
						console.log('这里就开始请求接口')
						let formData = {
							name: this.formData.name,
							mobile: this.formData.mobile,
							weight: Number(this.formData.weight),
							height: Number(this.formData.height),
							age: Number(this.formData.age),
							sex: Number(this.formData.sex),
							condition1:this.condition,
							condition2: this.form1,
						}
						console.log('formData: ', formData)
						
						this.$request({
							url: '/ApiV3/Mobile/AssessmentReport/v2save',
							loading: true,
							data: {
								id: this.detailId || 0,
								value: formData,
						
							}
						}).then(res => {
							this.result2 = res.data?.result?.result2 || []
							this.result3 = res.data?.result?.result3 || []
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 300
							})
							
						})
					}
					console.log('this.step: ', this.step)
			},
			submit() {
				
				this.$refs.uForm1.validate(valid => {
					

					if (valid) {

						// if(!this.model.agreement) return this.$u.toast('请勾选协议');
						this.$emit('submit', this.form1)
						
					} else {
						
					}
				});

			},

		}
	}
</script>

<style lang="scss" scope>
	page {}

	.container1 {
		background: #fff;
		
		padding: 0 16rpx;
		padding-bottom: 400rpx;
		.tip {
			font-size: 36rpx;
			font-weight: bold;
			margin: 40rpx 0;
		}

		.title {
			font-size: 28rpx;
			font-weight: bold;
			margin-bottom: 24rpx;
		}
		.smalltitle{
			font-size: 24rpx;
			color:#B6B6B6;
			margin-top: 8rpx;
		}
		.box {
			margin: 40rpx;
			width: 670rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			opacity: 1;
		}

		.result {
			position: fixed;
			bottom: 240rpx;
			width: 90%;
			left: 32rpx;
			display: flex;
			flex-direction: column;
			margin: 12rpx 0;
			background-color: #F9F9F9;
			border-radius: 16rpx;
			min-height: 300rpx;
			justify-content: center;
			align-items: center;
			padding: 0 24rpx
			
		}

		.result1 {
			display: flex;
			flex-direction: column;
			margin: 12rpx 0;
			border-radius: 16rpx;
			background-color: #F9F9F9;
			min-height: 300rpx;
			justify-content: center;
			align-items: flex-start;
			padding: 0 24rpx
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

			// ::v-deep .u-radio-group{

			// 	::v-deep .u-radio{
			// 		padding-left: 60rpx;
			// 	}
			// }
			// .u-radio {
			// 	align-items: flex-start;
			// 	margin-top: 12rpx;
			// 	padding-left: 60rpx;
			// 	.u-radio__icon-wrap {
			// 		margin-top: 12rpx;
			// 	}
			// }
		}
	}
</style>