<template>
	<view class="container">
		<view class="suggest">
			<calendar :userId="userId" naviTitle="suggest" ref="calendar" mode="date" @change="changeDate">
				<view slot="tooltip">
					<view class="title"></view>
				</view>
			</calendar>
		</view>
		<view class="box" @click="open(item,index)" v-for="(item,index) of list" :key="index">
			<view style="flex:1" class="u-flex-y-center u-flex-wrap">
				<image :src="`${imgUrl+item.src}`" mode=""></image>
				{{item.name}}
				<view style="width: 622rpx;" @click.stop v-if="item.name === '减重感受' && item.show">
					<u-input :show-confirmbar="false"
						:custom-style="{background:'#F3F3F3',borderRadius:'16rpx',marginTop:'24rpx',padding:'16rpx 24rpx'}"
						placeholder-style="color:#C2C2C2" placeholder="请输入减重感受" maxlength="200" v-model="value"
						type="textarea" :border="false" height="136" auto-height />
					<view v-if="item.btn" class="u-flex-xy-center u-m-t-24">
						<my-button :opacity="value?1:0.6" @click="submit(item)" width="152" height="56">提交</my-button>
					</view>

				</view>
			</view>
			<text class="u-m-r-42" style="color:#C2C2C2">{{item.text}}</text>
			<view class="u-absolute" style="right: 32rpx; top: 56rpx;">
				<u-icon size="32" :name="item.show? 'arrow-down':'arrow-right'"></u-icon>
			</view>
		</view>
		<view 
			v-if="suggestValue || (userInfo.staff_info && userInfo.staff_info.id === dietitian_id)"
			class="box">
			<view style="flex:1" class="u-flex-y-center u-flex-wrap">
				<u-avatar size="80" class="u-m-r-10" :src="evaluate_staff.avatar || userInfo.avatar"></u-avatar>
				<view style="width: 500rpx;" class="u-line-1">
					{{evaluate_staff.realname || userInfo.realname}}
					<!-- <view  class="u-font-24" style="color:#C2C2C2">07-05 14:30</view> -->
				</view>

				<view style="width: 622rpx;">
					<u-input :show-confirmbar="false"
						:custom-style="{background:'#F3F3F3',borderRadius:'16rpx',marginTop:'24rpx',padding:'16rpx 24rpx'}"
						placeholder-style="color:#C2C2C2" placeholder="请输入评价" maxlength="200" v-model="suggestValue"
						type="textarea" :border="false" height="136" auto-height />
					<view v-if="userInfo.role_id != 1 && userInfo.staff_info && userInfo.staff_info.id === dietitian_id" class="u-flex-xy-center u-m-t-24">
						<my-button @click="submit" width="152" height="56">提交</my-button>
					</view>

				</view>
			</view>

		</view>
		<u-action-sheet safe-area-inset-bottom :list="actionList" v-model="show" @click="actionSubmit"></u-action-sheet>
	</view>
</template>

<script>
	let arr = [{
		text: '很饱',
		value: 1
	}, {
		text: '比较饱',
		value: 2
	}, {
		text: '正好',
		value: 3
	}, {
		text: '比较饿',
		value: 4
	}, {
		text: '很饿',
		value: 5
	}]
	let arr1 = [{
		text: '非常轻松',
		value: 1
	}, {
		text: '一般',
		value: 2
	}, {
		text: '不轻松',
		value: 3
	}, ]
	let arr2 = [{
		text: '无',
		value: 1
	}, {
		text: '一次',
		value: 2
	}, {
		text: '两次',
		value: 3
	}, {
		text: '三次',
		value: 4
	}, {
		text: '其他',
		value: 5
	}, ]
	import calendar from '../blood/calendar.vue'
	import myButton from '@/components/myButton.vue'

	export default {
		name: 'suggestFell',
		props: {
			userId: {
				type: Number | String,
				default: ''
			}
		},
		data() {
			return {
				evaluate_staff:{},
				dietitian_id: '', //用户营养师id,用于判断营养师评价输入框
				userInfo: this.$store.state.user.userInfo,
				show: false,
				date:'',
				index: '',
				value: '', //感受
				suggestValue: '', //评价
				btn: false, //按钮状态
				actionList: [],
				list: [{
					name: '饱腹感',
					src: 'baofu.png',
					text: '请选择',
					show: false,
					value: 0
				}, {
					name: '轻松程度',
					src: 'qingsong.png',
					text: '请选择',
					show: false,
					value: 0

				}, {
					name: '排便次数',
					src: 'paibian.png',
					text: '请选择',
					show: false,
					value: 0

				}, {
					name: '减重感受',
					src: 'jianzhong.png',
					text: '',
					show: false,
					btn: false,
				}, ]
			}
		},
		mounted(option) {
			// this.date = this.$common.formatDate(new Date(), false)
			
			// if (option.date) {
			// 	this.date = this.$common.formatDate(new Date(option.date), false)
			// 	setTimeout(() => {
			// 		let year = parseFloat(this.date.split('-')[0])
			// 		let month = parseFloat(this.date.split('-')[1])
			// 		let day = parseFloat(this.date.split('-')[2])
			// 		this.$refs.calendar.init(year + '-' + month + '-' + day)
			// 	}, 200)
			// }
			// this.getDetail()
		},
		onPageScroll(e) {

		},
		watch: {
			value(val) {
				this.$set(this.list[3], 'btn', !!val)
			},
			'$store.state.user.userInfo':{
				handler(val){
					this.userInfo = this.$store.state.user.userInfo
				},
				deep:true
			}
			// date(val){
			// 	this.date = val
			// 	setTimeout(() => {
			// 		let year = parseFloat(date.split('-')[0])
			// 		let month = parseFloat(date.split('-')[1])
			// 		let day = parseFloat(date.split('-')[2])
			// 		this.$refs.calendar.init(year + '-' + month + '-' + day)
			// 	}, 200)
			// },
		},
		components: {
			calendar,
			myButton
		},
		methods: {
			setDate(val){
				this.date = val
					setTimeout(() => {
						let year = parseFloat(val.split('-')[0])
						let month = parseFloat(val.split('-')[1])
						let day = parseFloat(val.split('-')[2])
						this.$refs.calendar.init(year + '-' + month + '-' + day)
						this.$refs.calendar.upCanlendarData(year + '-' + month + '-01')
					}, 100)
					this.getDetail()
			},
			getDetail() {
				let data = {
					date: this.date + ' 00:00:00',
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: '/ApiV3/Mobile/Diary/getOther',
					method: 'get',
					data
				}).then(({
					data
				}) => {
					
						this.dietitian_id = data.dietitian_id
						this.$set(this.list[0],'text',data.diary.satiety ? arr.find(res => res.value == data.diary.satiety).text : '请选择')
						this.$set(this.list[1],'text',data.diary.ease ? arr1.find(res => res.value == data.diary.ease).text : '请选择')
						this.$set(this.list[2],'text',data.diary.defecation_frequency ? arr2.find(res => res.value == data.diary.defecation_frequency).text : '请选择')
						// this.list[0].text = data.diary.satiety ? arr.find(res => res.value == data.diary.satiety)
						// 	.text : '请选择'
						// this.list[1].text = data.diary.ease ? arr1.find(res => res.value == data.diary.ease).text :
						// 	'请选择'
						// this.list[2].text = data.diary.defecation_frequency ? arr2.find(res => res.value == data.diary
						// 	.defecation_frequency).text : '请选择'
						this.value = data.diary.feel
						this.suggestValue = data.diary.evaluate
						this.list[3].show = !!data.diary.feel
						this.list[3].btn = !!data.diary.feel
						this.evaluate_staff = data.diary.evaluate_staff || {}
						console.log(this.list)
						
					
					

				})
			},
			setText() {

			},
			submit(item) {
				if (!item && this.userInfo.role_id === 2) { //评价
					console.log(this.suggestValue)
					let data = {
							date: this.date + ' 00:00:00',
							evaluate: this.suggestValue
						}
						if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/Diary/setOther',
						loading:true,
						data
					}).then(res => {
						console.log(this.value)
						this.$refs.calendar.upCanlendarData()
						this.$common.toast('提交成功')
						
						// item.btn = false
					})
				} else { //感受
					if (!this.value) return
					
					let data = {
							date: this.date + ' 00:00:00',
							feel: this.value
						}
						if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/Diary/setOther',
						loading:true,
						data
					}).then(res => {
						console.log(this.value)
						this.$refs.calendar.upCanlendarData()
						this.$common.toast('提交成功')
					})


				}

			},
			focus(e, item) {
				console.log(e)
				item.btn = true
			},
			blur(item) {
				if (this.value) return
				item.btn = false

			},
			actionSubmit(index) {
				console.log(this.actionList[index])
				this.list[this.index].text = this.actionList[index].text
				this.list[this.index].value = this.actionList[index].value
				let data = {
					date: this.date + ' 00:00:00',
					
				}
				if (this.userId) data.user_id = this.userId
				if (this.index === 0) data.satiety = this.actionList[index].value
				if (this.index === 1) data.ease = this.actionList[index].value
				if (this.index === 2) data.defecation_frequency = this.actionList[index].value
				this.$request({
					url: '/ApiV3/Mobile/Diary/setOther',
					data
				}).then(res => {
					//更新一下日历数据
					this.$refs.calendar.upCanlendarData()
				})
			},
			open(item, index) {
				// this.list[index].show = !this.list[index].show
				this.index = index
				if (item.name === '减重感受') {
					item.show = !item.show
					if (!this.value) item.btn = false
				} else {
					this.show = true
					if (item.name === '饱腹感') {
						this.actionList = arr
					} else if (item.name === '轻松程度') {
						this.actionList = arr1
					} else if (item.name === '排便次数') {
						this.actionList = arr2
					}
				}

			},
			changeDate(date) {
				console.log('date', date)
				//点击日历请求列表数据
				this.date = date.result
				this.getDetail()

			},
		}
	}
</script>

<style lang="scss" scope>
	.container {
		background: #f7f7f7;
		min-height: 100vh;
		padding: 24rpx 0;

		.suggest {
			background: #ffffff;
			width: 92vw;
			border-radius: 20rpx;
			margin: 0 auto;
		}

		.box {
			position: relative;
			width: 686rpx;
			min-height: 144rpx;
			background-color: #ffffff;
			border-radius: 24rpx;
			padding: 32rpx;
			margin: 24rpx auto;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;

			>view {
				>image {
					width: 80rpx;
					height: 80rpx;
					margin-right: 16rpx;

				}
			}

		}
	}
</style>
