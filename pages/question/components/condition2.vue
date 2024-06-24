<template>
	<view class="container1 form_question" :style="{paddingBottom:'400rpx' }">
		<template v-if="step === -1">
			<view style="margin: 50rpx auto;font-size: 36rpx;font-weight: bold;">接下来是生活方式评估测试！</view>
		</template>
		<temlate v-else-if="step <17">
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
		<template v-else-if="step == 17">
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
					{{index+1}}:{{item}}
				</view>

			</view>
		</template>
		<template v-else>
			<view style="margin: 50rpx auto;font-size: 36rpx;font-weight: bold;color:#0EB287">您已完成问卷，感谢您的参与！</view>
		</template>

		<view style="position: fixed; bottom:110rpx;width: 86%;" class="u-flex-xy-center">
			<template v-if="step >-1 && step<=15">
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
			</template>
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
		},
		data() {
			
			return {
				result2: [{
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
							A: '无',
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
							A: '无',
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
							A: '无',
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
							A: '无',
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
							A: '无',
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
							A: '无',
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
						title: ['8.一般情况下，您在一天里吃蔬菜的量是：'],
						q8: 1,
						suggest: {
							A: '无',
							B: '每天摄入300-500克蔬菜',
							C: '每天摄入300-500克蔬菜',
						},
						options: [{
								label: '300-500g',

								value: 'A'
							},
							{
								label: '100-200g',

								value: 'B'
							},
							{
								label: '100g以内',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['9.您在过去一周里摄入高油高糖食物的次数是：','(油炸食物、甜品等)'],
						q9: 1,
						suggest: {
							A: '无',
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
						title: ['10.您一般每天喝多少ml水：'],
						q10: 1,
						suggest: {
							A: '无',
							B: '增加每日饮水',
							C: '增加每日饮水',
						},
						options: [{
								label: '大于1500ml',

								value:'A'
							},
							{
								label: '500-1500ml',

								value: 'B'
							},
							{
								label: '少于500ml',

								value: 'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['11.一般情况下，您在一天里吃红肉的量是：','(猪肉、牛肉、羊肉等)'],
						q11: 1,
						suggest: {
							A: '无',
							B: '减少红肉摄入，每人每周红肉的摄入不宜超过500克',
							C: '减少红肉摄入，每人每周红肉的摄入不宜超过500克',
						},
						options: [{
								label: '75g（大约一个手掌心大小）及以下',

								value: 'A'
							},
							{
								label: '75g~150g（大约2个手掌心大小）',

								value: 'B'
							},
							{
								label: '150g以上（大于2个手掌心大小）',

								value:'C'
							},
						]
					},
					{
						tip: '（一）您平时的饮食习惯如何？',
						title: ['12.烟草使用：'],
						q12: 1,
						suggest: {
							A: '无',
							B: '减少烟草使用',
							C: '减少烟草使用',
						},
						options: [{
								label: '不抽烟',

								value: 'A'
							},
							{
								label: '1-10根/天',

								value: 'B'
							},
							{
								label: '大于11根/天',

								value: 'C'
							},
						]
					},
					{
						tip: '（二）您的身体活动如何？',
						title: ['13.您在工作中是：'],
						q13: 1,
						suggest: '',
						options: [{
								label: '体力活动较多',

								value: 'A'
							},
							{
								label: '体力活动适中',

								value: 'B'
							},
							{
								label: '基本无体力活动',

								value: 'C'
							},
						]
					},
					{
						tip: '（二）您的身体活动如何？',
						title: ['14.除工作外，您过去一周里的运动时长在：'],
						q14: 1,
						suggest: {
							A: '无',
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
						tip: '（二）您的身体活动如何？',
						title: ['15.在过去一周里，您做抗阻运动的次数是：','(比如俯卧撑、引体向上、深蹲、哑铃、弹力带等)'],
						q15: 1,
						suggest: {
							A: '无',
							B: '加强抗阻运动',
							C: '加强抗阻运动',
						},
						options: [{
								label: '4次及以上',

								value: 'A'
							},
							{
								label: '2-3次',

								value: 'B'
							},
							{
								label: '少于2次',

								value: 'C'
							},
						]
					},
					{
						tip: '（三）您的睡眠如何？',
						title:[ '16.过去一周您平均每天的睡眠时长：'],
						q16: 1,
						suggest: '',
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
					{
						tip: '（三）您的睡眠如何？',
						title:[ '17.您一天中自我感觉精力如何：'],
						q17: 1,
						suggest: {
							A: '无',
							B: '增加睡眠时间，成人每日平均睡眠时间为7-8小时',
							C: '增加睡眠时间，成人每日平均睡眠时间为7-8小时',
						},
						options: [{
								label: '精力充沛',

								value: 'A'
							},
							{
								label: '一般',

								value: 'B'
							},
							{
								label: '较差',

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
		methods: {
			restForm1(){
				// 使用循环创建17个对象，并设置key值为q1到q17
				let form1 = {}
				for (var i = 1; i <= 17; i++) {
					var key = 'q' + i;
					form1[key] = '';
				
				}
				this.form1 = form1
			},
			redellOther(){
				this.restForm1()
				
				uni.navigateTo({
					url: '/pages/question/question2?id=0&nextTabNum=1&other=1'
				})
			},
			redell(){
				this.restForm1()
				
				uni.navigateTo({
					url: '/pages/question/question2?id=0&nextTabNum=1'
				})
			},
			change(e) {
				
				
				
				if (this.step == 12) {
					this.list[13].suggest = {
						A: '无',
						B: this.form1.q13 > 'A' ? '坚持日常身体活动，每周累计中等强度身体活动150分钟以上' : '',
						C: this.form1.q13 > 'A' ? '坚持日常身体活动，每周累计中等强度身体活动150分钟以上' : '',
					}
				}
				if (this.step == 13) {
					this.list[12].suggest = {
						A: '无',
						B: this.form1.q14 > 'A' ? '坚持日常身体活动，每周累计中等强度身体活动150分钟以上' : '',
						C: this.form1.q14 > 'A' ? '坚持日常身体活动，每周累计中等强度身体活动150分钟以上' : '',
					}
				}
				if (this.step == 15) {
					this.list[16].suggest = {
						A: '无',
						B: this.form1.q16 > 'A' ? '增加睡眠时间，成人每日平均睡眠时间为7-8小时' : '',
						C: this.form1.q16 > 'A' ? '增加睡眠时间，成人每日平均睡眠时间为7-8小时' : '',
					}
				}
				if (this.step == 16) {
					this.list[15].suggest = {
						A: '无',
						B: this.form1.q17 > 'A' ? '增加睡眠时间，成人每日平均睡眠时间为7-8小时' : '',
						C: this.form1.q17 > 'A' ? '增加睡眠时间，成人每日平均睡眠时间为7-8小时' : '',
					}
				}
			},
			beforStep() {
				this.step--
			},
			save(){
				if(this.step == 16){
					if(!this.form1['q'+(this.step+1)]) return this.$common.toast('请勾选')
					let formData = {
						name: this.formData.name,
						mobile: this.formData.mobile,
						weight: Number(this.formData.weight),
						height: Number(this.formData.height),
						age: Number(this.formData.age),
						sex: Number(this.formData.sex),
					}
					this.$request({
						url: '/ApiV3/Mobile/AssessmentReport/save',
						loading: true,
						data: {
							id: this.detailId || 0,
							value: {
								...formData,
								condition1:this.condition,
								condition2: this.form1,
							},
					
						}
					}).then(res => {
						this.result2 = res.data?.result?.result2 || []
						this.step++
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						})
						
					})
				}else{
					
					if(this.step == 17){
						
						this.$emit('gotohome')
						
					}
					this.step++
				}
				
			},
			
			async nextStep() {
				
				
					if(this.step > -1 && !this.form1['q'+(this.step+1)]){
						
						
						return this.$common.toast('请勾选')
					}
					this.step++
				
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