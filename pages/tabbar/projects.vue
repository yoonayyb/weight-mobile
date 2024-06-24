<template>
	<view class="mark" :style="{paddingBottom: tabbarHeight}">
		<u-navbar title="日记" :is-back="false" :border-bottom="false" :title-width="750" :is-fixed="false"
			title-color="#2A2A2A" :title-size="32" :title-bold="true" :background="{backgroundColor:'transparent'}">
			<view class="slot-wrap u-absolute" style="top: 10rpx;left:0rpx;">
				<image @click="_jump({url:'mine/message/index'})" :src="`${imgUrl}nav_icon_message@2x.png`"
					style="width: 48rpx;height:48rpx;"></image>
				<u-badge v-if="token" :offset="[-2,24]" size="mini" type="error" is-dot :count="count"></u-badge>
			</view>
		</u-navbar>
		<!-- <image :src="`${imgUrl}v3_bg_home.png`"  style="width: 100%;"></image> -->
		<view class="canvas_half-circle u-p-t-50">
			<view class="u-absolute u-flex u-flex-end" :class="{'u-flex-between':sex ===0}"
				style="top: 0;padding:0 32rpx;width: 100vw;">


				<image v-if="sex === 0" @click="_jump({url:'newHome/index',data:{name:'经期'}})"
					:src="`${imgUrl}diary_icon_period@2x(1).png`" style="width: 48rpx;height:48rpx;"></image>
				<image @click="_jump({url:'newHome/index'})" :src="`${imgUrl}diary_icon_data@2x(1).png`"
					style="width: 48rpx;height:48rpx;"></image>
			</view>

			<canvas-half-circle  :bmi="data.bmi || '--'" @path="setCircleCanvasPath" :left="data.weight_cycle && data.weight_cycle.target_weight || 0" :weight="data.weight && data.weight.value  || 0"
				:value="data.weight_scale|| 0" ref="canvas"></canvas-half-circle>

			<text class="time"
				style="position: absolute;left: 50%;transform: translate(-50%, -50%);top: 228rpx;margin: 0;margin-top: 12rpx;">{{ ((data.weight && data.weight.of_date) || '' )| formatDate }}</text>
			<view class="u-font-60 u-flex u-flex-center u-relative"
				style="font-weight: bold;color:#00B8A2;font-size: 72rpx;">
				<view class="u-line-1" :style="{'padding-top':Number(setValue()) ?'0':'12rpx'}" style="width: 280rpx;margin-top: 24rpx;">{{setValue()}}
				</view>
				<text
					style="color:#2e2e2e;font-weight: bold;font-size: 28rpx;position: absolute;top: 62rpx;right: 26%;">kg</text>
			</view>
			<view class="time u-flex u-flex-center" style="color:#2A2A2A;margin-top: 16rpx;">
				<my-button @click="addWeight('体重')" height="56" width="184" :border="'#00B8A2'"
					color="#00B8A2">记录体重</my-button>
				<view class="u-font-24" style="width: 36vw;">
					<view v-if="data.weight_cycle">
						<view style="color:#FF7569" v-if="data.weight_cycle.plan_status == 0">
							<view> {{setplan(data.weight_cycle.plan_level)}}</view>
							<view class="u-font-20" style="color:#FF7569"> 第{{data.weight_cycle.day}}天(已暂停)</view>
						</view>
						<view style="color:#FF7569" v-else-if="data.weight_cycle.plan_status == 2"> 已结束</view>
						<view  v-else-if="data.weight_cycle.plan_level == 0"> 未开始</view>
						<view v-else>
							<view>{{setplan(data.weight_cycle.plan_level)}} </view>
							<view class="u-font-20">第{{data.weight_cycle.day}}天</view>
						</view>
					</view>
					<view v-else>
						<view> 未开始</view>
					</view>
				</view>
				<my-button @click="jump('bodyFatScale/connect/connect')" height="56" width="184">上秤测量</my-button>
			</view>
		</view>
		<view class="food" @click="_jump({url:'newHome/index',data:{name:'热量'}})">
			<view class="u-flex-y-center u-relative">
				<image :src="`${imgUrl}diary_icon_dinner@2x.png`" style="width: 48rpx;height:48rpx;margin-right: 8rpx;">
				</image>
				<text class="u-font-32" style="font-weight: bold;">饮食</text>

				<view class="u-absolute" style="right: 0rpx; top: 8rpx;">
					<template v-if="!token">
						<my-button @click="login" borderRadius="40rpx" color="#00B8A2" bg="#fff" fontWeight="400"
							fontSize="24rpx" height="48" width="148">开始用餐</my-button>
					</template>
					<template v-else>
						<my-button v-if="mealType === 3"
							@click="$refs.meal.open({startTime,endTime,activeDate:activeDate1,mealId})"
							borderRadius="40rpx" color="#00B8A2" bg="#fff" fontWeight="400" fontSize="24rpx" height="48"
							width="148">进食用餐</my-button>
						<my-button v-if="mealType === 1" @click="$refs.meal.open({activeDate:activeDate1})"
							borderRadius="40rpx" color="#00B8A2" bg="#fff" fontWeight="400" fontSize="24rpx" height="48"
							width="148">开始用餐</my-button>
						<my-button v-if="mealType === 2" color="#FFAA8E" bg="#fff"
							@click="$refs.meal.open({startTime,endTime,activeDate:activeDate1,mealId})"
							borderRadius="40rpx" fontWeight="400" fontSize="24rpx" height="48"
							width="148">结束用餐</my-button>
					</template>
				</view>
			</view>
			<view class="u-p-18 u-flex u-flex-items-stretch">

				<u-circle-progress width="176" @path="setCanvasPath" border-width="10" :active-color="activeColor"
					inactive-color="#F3F3F3" :percent="setPercent(1)">
					<view class="u-flex-column u-flex-center u-flex-items-center u-font-24">
						<view style="color:#C2C2C2">{{tip}}</view>
						<text class="u-line-1"
							style="color:#2A2A2A;font-size: 28rpx;font-weight: bold;width: 130rpx;text-align: center;">{{setTotal(data) | filterNumParseInt}}</text>
						<view style="color:#C2C2C2">kcal</view>
					</view>
				</u-circle-progress>

				<view class="u-m-l-10 u-flex-column u-flex-around u-font-24" style="width: 300rpx;">
					<view class="u-flex-y-center">
						<text class="u-m-r-16">早餐</text>
						<u-line-progress style="flex:1" height="10" inactive-color="#F3F3F3" :show-percent="false"
							:active-color="setColor(1)" :percent="setPercent(2)"></u-line-progress>
					</view>
					<view class="u-flex-y-center">
						<text class="u-m-r-16">中餐</text>
						<u-line-progress style="flex:1" height="10" inactive-color="#F3F3F3" :show-percent="false"
							:active-color="setColor(2)" :percent="setPercent(3)"></u-line-progress>
					</view>
					<view class="u-flex-y-center">
						<text class="u-m-r-16">晚餐</text>
						<u-line-progress style="flex:1" height="10" inactive-color="#F3F3F3" :show-percent="false"
							:active-color="setColor(3)" :percent="setPercent(4)"></u-line-progress>
					</view>


				</view>
			</view>
		</view>

		<!-- <view @click="_jump({url:'newHome/index',data:{name:'断食'}})">
			<fast  :token="token"  ref="fast" ></fast>
		</view>	 -->

		<view class="u-flex u-flex-wrap u-flex-between" style="margin: 32rpx; margin-top: 0;">
			<view class="box" @click="gotoDetail('喝水量')">
				<view class="u-flex-y-center">
					<image :src="`${imgUrl}diary_icon_water@2x.png`"
						style="width: 48rpx;height:48rpx;margin-right: 8rpx;"></image>
					<text class="u-font-32" style="font-weight: bold;">喝水</text>
				</view>
				<view class="u-flex-y-center u-font-28 u-m-10">
					<text style="flex:1">目标</text>
					<text class="u-font-28"
						style="font-weight: bold;margin:0 20rpx">{{data.water && data.water.water_target | filterNum}}</text>
					<text style="color:#C2C2C2">mL</text>
				</view>
				<view class="u-flex-y-center u-font-28 u-m-10">
					<text style="flex:1">已喝</text>
					<text class="u-font-28"
						style="font-weight: bold;margin:0 20rpx">{{data.water && data.water.drink | filterNum}}</text>
					<text style="color:#C2C2C2">mL</text>
				</view>
				<view class="u-flex-y-center u-font-28 u-m-10">
					<text
						style="flex:1">{{ Number(data.water &&data.water.water_target)  >= Number(data.water && data.water.drink) ?'剩余':'超出'}}</text>
					<text class="u-font-28" style="font-weight: bold;margin:0 20rpx"
						:class="{overflow:Number(data.water && data.water.water_target)  < Number(data.water && data.water.drink)} ">{{Math.abs(Number(data.water && data.water.water_target)-Number(data.water && data.water.drink)) | filterNum}}</text>
					<text style="color:#C2C2C2">mL</text>
				</view>
				<view class="u-absolute" style="bottom:24rpx;right: 24rpx;">
					<my-button @click="addWeight('喝水量')" height="48" width="148" class="u-m-l-64">再来一杯</my-button>
				</view>

			</view>
			<view class="box"
				@click="_jump({url:'newHome/nutrition/addFood',data:{name:'运动',activeDate:$common.formatDate(new Date(),false)}})">
				<view class="u-flex-y-center">
					<image :src="`${imgUrl}diary_icon_sport@2x.png`"
						style="width: 48rpx;height:48rpx;margin-right: 8rpx;"></image>
					<text class="u-font-32" style="font-weight: bold;">运动</text>
				</view>
				<block v-if="data.sports && data.sports.list.length">
					<view v-for="(item,index) of data.sports.list.slice(0,2)" :key="index"
						class="u-flex-y-center u-font-28 u-m-10">
						<text style="flex:1" class="u-line-1" space="emsp">{{item.title}}</text>
						<text class="u-font-28 u-line-1"
							style="font-weight: bold;margin:0 20rpx;">{{item.total_kcal | filterNumParseInt}}</text>
						<text style="color:#C2C2C2">kcal</text>
					</view>
				</block>
				<view class="u-flex-y-center u-font-28 u-m-10">
					<text style="flex:1">总消耗</text>
					<text class="u-font-28 u-line-1"
						style="font-weight: bold;margin:0 20rpx;">{{data.sports && data.sports.total | filterNumParseInt}}</text>
					<text style="color:#C2C2C2">kcal</text>
				</view>
				<view class="u-absolute" style="bottom:24rpx;right: 24rpx;">
					<my-button
						@click="_jump({url:'newHome/nutrition/addFood',data:{name:'运动',activeDate:$common.formatDate(new Date(),false)}})"
						height="48" width="148" class="u-m-l-64">记运动</my-button>
				</view>
			</view>
			<view class="box" @click="gotoDetail('尿酮')">
				<view class="u-flex-y-center">
					<image :src="`${imgUrl}diary_icon_@2x.png`" style="width: 48rpx;height:48rpx;margin-right: 8rpx;">
					</image>
					<text class="u-font-32" style="font-weight: bold;">尿酮</text>
				</view>

				<view class="u-flex-y-center u-font-28 u-m-10">
					<text>尿酮</text>

					<!-- <text v-if="!token" class="u-font-28" style="font-weight: bold;margin:0 20rpx">未检测</text> -->
					<block v-if="data.urine_ketone && data.urine_ketone.value !== null">
						<view
							style="border-radius: 8rpx; width: 36rpx;height: 24rpx;display: inline-block;margin:0 20rpx"
							:style="{background:setBg(data.urine_ketone &&data.urine_ketone.value)}"> </view>
						<text class="u-font-28" style="font-weight: bold;margin-right: 20rpx">

							{{data.urine_ketone && setUrine(data.urine_ketone.value) }}
						</text>
					</block>
					<text v-else class="u-font-28" style="font-weight: bold;margin:0 20rpx">未检测</text>
				</view>
				<view class="u-flex-y-center u-font-28 u-m-10">
					<text style="color:#C2C2C2">{{data.urine_ketone && data.urine_ketone.text }}</text>
				</view>


				<view class="u-absolute" style="bottom:24rpx;right: 24rpx;">
					<my-button @click="addWeight('尿酮')" height="48" width="148" class="u-m-l-64">记尿酮</my-button>
				</view>
			</view>
			<view class="box" @click="gotoDetail('血糖')">
				<view class="u-flex-y-center">
					<image :src="`${imgUrl}diary_icon_glu@2x.png`"
						style="width: 48rpx;height:48rpx;margin-right: 8rpx;"></image>
					<text class="u-font-32" style="font-weight: bold;">血糖</text>
				</view>
				<block v-if="data.blood_sugars && data.blood_sugars.length">


					<view v-for="(item,index) of data.blood_sugars.slice(0,3)" :key="index"
						class="u-flex-y-center u-flex-between u-font-28 u-m-10">
						<text space="emsp">{{setBloodName(item.time_enum)}}</text>
						<text style="font-weight: bold;margin:0 20rpx">{{item.sugar | filterNum1}}</text>
						<!-- <text style="color:#C2C2C2">kcal</text> -->
					</view>
				</block>
				<view v-else class="u-font-28 text-bold u-m-10">
					今天还没有记录血糖哦~
				</view>
				<view class="u-absolute" style="bottom:24rpx;right: 24rpx;">
					<my-button @click="addWeight('血糖')" height="48" width="148" class="u-m-l-64">记血糖</my-button>
				</view>
			</view>
			<view class="box" @click="gotoDetail('血压')">
				<view class="u-flex-y-center">
					<image :src="`${imgUrl}v3_bloodpress.png`" style="width: 48rpx;height:48rpx;margin-right: 8rpx;">
					</image>
					<text class="u-font-32" style="font-weight: bold;">血压</text>
				</view>
				<block v-if="data.blood_pressure || !token">
					<view v-if="token" class="u-flex-y-center u-font-28 u-m-10">
						<text style="flex:1">时间</text>
						<text class="u-font-28"
							style="font-weight: bold;margin:0 20rpx;">{{data.blood_pressure && data.blood_pressure.of_date  | formatTime1 }}</text>
						<text style="color:#FFF">mmHg</text>
					</view>
					<view class="u-flex-y-center u-font-28 u-m-10">
						<text style="flex:1">高压</text>
						<text class="u-font-28"
							style="font-weight: bold;margin:0 20rpx;">{{data.blood_pressure && data.blood_pressure.max | filterNum}}</text>
						<text style="color:#C2C2C2">mmHg</text>
					</view>
					<view class="u-flex-y-center u-font-28 u-m-10">
						<text style="flex:1">低压</text>
						<text class="u-font-28"
							style="font-weight: bold;margin:0 20rpx;">{{data.blood_pressure && data.blood_pressure.min | filterNum}}</text>
						<text style="color:#C2C2C2">mmHg</text>
					</view>
				</block>
				<view v-else class="u-font-28 text-bold" style="position: relative;transform: translate(0px, 50%);">
					今天还没有测量血压哦~
				</view>
				<view class="u-absolute" style="bottom:24rpx;right: 24rpx;">
					<my-button @click="addWeight('血压')" height="48" width="148" class="u-m-l-64">记血压</my-button>
				</view>
			</view>
			<view class="box" @click="gotoDetail('感受')">
				<view class="u-flex-y-center">
					<image :src="`${imgUrl}diary_icon_feel@2x.png`"
						style="width: 48rpx;height:48rpx;margin-right: 8rpx;"></image>
					<text class="u-font-32" style="font-weight: bold;">感受与评价</text>
				</view>
				<view class="u-flex-y-center u-font-28 u-m-10">
					<text style="text-align: justify;width: 112rpx;height: 40rpx;">饱腹感<text
							style="width:100%;display: inline-block;"></text></text>
					<text class="u-font-28"
						style="font-weight: bold;margin:0 20rpx">{{data.feel && data.feel.satiety || '未记录'}}</text>

				</view>
				<view class="u-flex-y-center u-font-28 u-m-10">
					<text style="text-align: justify;width: 112rpx;height: 40rpx;">轻松程度<text
							style="width:100%;display: inline-block;"></text></text>
					<text class="u-font-28"
						style="font-weight: bold;margin:0 20rpx">{{data.feel && data.feel.ease || '未记录'}}</text>

				</view>
				<view class="u-absolute" style="bottom:24rpx;right: 24rpx;">
					<my-button @click="gotoDetail('感受')" height="48" width="148" class="u-m-l-64">记感受</my-button>
				</view>
			</view>
		</view>
		<view class="u-flex-xy-center u-m-40">
			<my-button width="562" height="80" @click="_jump({url:'newHome/record/index'})">全部记录</my-button>
		</view>
		<u-popup v-model="popshow" mode="center" border-radius="24" width="638rpx" height="288rpx">
			<view class="u-flex-column u-flex-items-center u-flex-around" style="height: 100%;">
				<view class="u-font-32 text-bold">您还未完善个人信息</view>
				<view class="u-font-32 ">请先完善信息再进行操作</view>
				<view class="u-flex-y-center u-flex-around" style="width: 100%;">
					<my-button width="208" height="72" color="#00B8A2" bg="#FFFFFF"
						@click="popshow = false;">取消</my-button>
					<my-button width="208" height="72"
						@click="gotoWrite('/pages/mine/invite/updatePersonalInfo')">去完善</my-button>
				</view>
			</view>
		</u-popup>
		<recordPopup1 @success="success" ref="recordPopup1"></recordPopup1>
		<meal ref="meal" @submit="getTargetTimer"></meal>
		<u-tabbar :before-switch="beforeSwitch" active-color="#00B8A2" inactive-color="#C2C2C2" ref="custom-tabbar"
			height="120rpx" icon-size="60rpx" class="custom-tabbar" :list="list"></u-tabbar>
	</view>
</template>



<script>
	import recordPopup1 from '@/components/recordPopup1.vue'
	import {
		imgUrl,
		jump
	} from '@/utils/common'
	import infoTemplate from '@/components/infoTemplate.vue'
	import canvasHalfCircle from '@/components/canvas-half-circle.vue'
	import myButton from '@/components/myButton'
	import meal from '@/components/meal'

	let this_ = ''
	export default {
		data() {
			return {
				mealId: '',
				mealType: 1,
				startTime: '',
				endTime: '',
				activeDate1: this.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
				// setTimer:null,
				// timer:0,
				// fastValue:0,
				// hours:0,
				// minutes:0,
				// seconds:0,
				// targetFastValue:0.1,
				count: 0,
				popshow: false,
				token: '',
				circleCanvasSrc: '',
				tip: '还可摄入',

				canvasSrc: '',
				fastcanvasSrc: '',
				activeColor: '#F3F3F3', //圆环激活颜色
				width: '100vw',
				height: '50vw',
				list: this.$store.state.tabbar.list,
				tabbarHeight: 0,
				calendarShow: false,
				show: false,
				date: '',
				activeDate: '',
				data: {
					weight:null
				}, //首页数据
				scene_id: '',
			}
		},
		watch: {
			'$store.state.message.unReadNum'(newValue, oldValue) {
				console.log('unReadNum', newValue)
				this.count += parseInt(newValue)

			}
			
		},
		computed: {
			sex() {
				return this.$store.state.user.userInfo.sex
			},
			setplan() {
				return function(e) {
					let flag = ''
					if (e === 0) flag = '未开始'
					if (e === 1) flag = '启动期'
					if (e === 2) flag = '过渡期'
					if (e === 3) flag = '维持期'

					return flag
				}
			},
			setBg() {
				return function(e) {
					let flag = ''
					if (e === 1) flag = '#E6BEE2'
					if (e === 2) flag = '#B77BA6'
					if (e === 3) flag = '#9A4586'
					if (e === 4) flag = '#3A0151'
					if (e === -1) flag = '#FFEFCF'
					if (e === 0) flag = '#cacaca'

					return flag
				}
			},
			setUrine() {
				return function(e) {
					let flag = ''
					if (e === 1) flag = '1+'
					if (e === 2) flag = '2+'
					if (e === 3) flag = '3+'
					if (e === 4) flag = '4+'
					if (e === -1) flag = '无显示'
					if (e === 0 || e === null) flag = '未检测'
					return flag
				}
			},
			setTarget() {
				return function(e) {
					let flag = 0
					if (e.weight_cycle?.target_weight && e.weight?.value) {
						flag = parseFloat((Number(e.weight_cycle?.target_weight) - Number(e.weight?.value)).toFixed(2))
					}
					return flag
				}
			}
		},
		components: {
			infoTemplate,
			canvasHalfCircle,
			myButton,
			meal,
			recordPopup1
		},

		onLoad(option) {



			if (option.scene) {
				uni.setStorageSync('inviterId', option.scene)
				// this.submitInviterId(option.scene)
			}

		},

		async onShareAppMessage() {
			await this.getScene_id()
			return {
				title: '医学营养减重与控糖管理平台',
				path: `/pages/tabbar/projects?scene=${this.scene_id}`,
				imageUrl:`${this.imgUrl}share.jpg`
			}
		},
		beforeCreate() {
			// this_ = this
		},
		filters: {
			filterNum1(value) {

				let val = Number(value).toFixed(1) || '--'
				return val;
			},
			filterNum(value = 0) {
				let val = parseFloat(Number(value).toFixed(2)) || 0
				if (!uni.getStorageSync('token')) {
					val = '--'
				}
				return val;

			},
		},
		onShow() {

	
			this.token = uni.getStorageSync('token')
			this.timer = 0
		
			console.log('token', this.token)

			if (!this.token) {
				
				// #ifndef APP-PLUS
				wx.hideShareMenu()
				// #endif

			} else {

				// #ifndef APP-PLUS
				wx.showShareMenu()
				// #endif

				this.getData()
				//获取通知消息
				this.getNotice()
				this.getMealData() //获取用餐数据
			}

			// if(!Object.keys(this.data).length){
			// 	this.getData()
			// }
		},

		methods: {
			setValue() {
				let flag = '--'
				let weightVal = this.data.weight && parseFloat(this.data.weight.value) || 0
				// console.log('ctx.measureText',ctx.measureText(weightVal))
				if (!weightVal) {

				} else {
					flag = parseFloat(weightVal.toFixed(2))
				}

				return flag
			},
			login() {
				if (!this.token) {
					return uni.navigateTo({
						url: '/pages/login/index'
					})
				}
			},

			getTargetTimer(val) {

				this.getMealData()
			},
			getMealData() {

				let data = {
					date: this.activeDate1,

				}
				this.$request({
					url: '/ApiV3/Mobile/DiaryFoodTime/index',
					method: 'get',
					data
				}).then(({
					data
				}) => {
					//mealType: 1 开始用餐 2 正在用餐 3 结束用餐

					if (!data.record) { //未开始
						this.mealType = 1
					} else {
						this.startTime = data.record.start_at
						this.endTime = data.record.end_at
						this.mealId = data.record.id
						if (data.record.end_at) { //有结束时间 正在用餐 或者已经结束
							let newDateTime = new Date().getTime()
							let end_atTime = new Date(data.record.end_at).getTime()


							if (newDateTime >= end_atTime) { //已结束
								this.mealType = 3

							} else { //正在用餐

								this.mealType = 2
							}
						} else { //正在用餐 或者已经结束
							let startDateTime = new Date(data.record.start_at).getTime()
							let end_atTime = new Date().getTime()


							if (startDateTime >= end_atTime) { //已结束
								this.mealType = 3
							} else { //正在用餐
								this.mealType = 2

							}
						}


					}



				})

			},
			formatTime(time) {
				// 将时间格式化为 hh:mm:ss 的形式
				let hour = Math.floor(time / 3600);
				let minute = Math.floor((time - hour * 3600) / 60);
				let second = Math.floor(time - hour * 3600 - minute * 60);
				this.hours = hour.toString().padStart(2, '0')
				this.minutes = minute.toString().padStart(2, '0')
				this.seconds = second.toString().padStart(2, '0')
				// return `${hour.toString().padStart(2, '0')}:${minute
				//         .toString()
				//         .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
			},



			getNotice() {
				this.$request({
						url: '/ApiV3/Mobile/Notice/unreadNum',
						method: 'GET'
					})
				.then((res) => {
					this.count = res.data.count
					this.count += parseInt(this.$store.state.message.unReadNum)
				})
				.catch(async (err) => {

				})
			},
			submitInviterId(scene) {
				if (!uni.getStorageSync('inviterId')) return
				this.$request({
					url: '/ApiV2/Mobile/Bind/bindByScene',
					data: {
						scene_id: scene
					}
				}).then((res) => {
					console.log('提交成功小程序码传进来的参数: ', res)
				})
			},
			getScene_id() {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV2/Mobile/User/sharePage',
						// loading: true,
						// errMsg: true,
						method: 'get'
					}).then(({
						data
					}) => {
						this.scene_id = data.scene_id
						resolve()
					})
				})
			},
			beforeSwitch() {

				const page = getCurrentPages()
				let pages = `/${page[page.length - 1]?.route ?? ''}`
				uni.setStorageSync('recordRoute', pages)
				return true
			},
			gotoWrite(url) {
				this.popshow = false
				uni.navigateTo({
					url
				})
			},
			// 公共跳转
			_jump({
				url = '',
				data = ''
			}) {
				if (!this.token) {
					// this.$common.toast('请先登陆')
					return uni.navigateTo({
						url: '/pages/login/index'
					})
				}
				if (this.$store.state.user.userInfo.should_update) {

					return this.popshow = true
				}
				console.log(url)
				jump({
					url,
					data,
				})
			},
			setCanvasPath(path) {
				this.canvasSrc = path
				console.log('this.canvasSrc', this.canvasSrc)
			},
			setFastCanvasPath(path) {
				this.fastcanvasSrc = path
				console.log('this.fastcanvasSrc', this.fastcanvasSrc)
			},
			setCircleCanvasPath(path) {
				this.circleCanvasSrc = path
				console.log('this.circleCanvasSrc', this.circleCanvasSrc)
			},
			setFeelName(type) { //1 饱腹感 2轻松程度 
				let arr = []
				let value = '未记录'
				if (type === 1) {
					arr = ['无', '很饱', '比较饱', '正好', '比较饿', '很饿']
					value = arr[this.data?.feel]
				} else {
					arr = ['无', '非常轻松', '一般', '不轻松']
				}
				return value
			},
			setBloodName(val) {
				//注意根据数组顺序
				let Arr = ['未选择', '空腹', '睡前', '凌晨3点', '早餐后2小时', '午餐后2小时', '晚餐后2小时', '午餐前', '晚餐前']
				return Arr[Number(val)]
			},
			setTotal(val) {
				return parseFloat(Math.abs((val?.heat?.heat_total - val?.sports?.total - val?.heat?.set?.heat_kcal))
				.toFixed(2)) || '--'

			},
			setColor(type) { //1 早餐 2 午餐 3晚餐
				let color = this.activeColor
				let heat = this.data.heat

				if (heat) {
					if (type === 1) {
						color = Number(heat.meals_breakfast) >= Number(heat?.set?.meals_breakfast) ? '#FF7569' : '#00B8A2'
					}
					if (type === 2) {
						color = Number(heat.meals_lunch) >= Number(heat?.set?.meals_lunch) ? '#FF7569' : '#00B8A2'
					}
					if (type === 3) {
						color = Number(heat.meals_dinner) >= Number(heat?.set?.meals_dinner) ? '#FF7569' : '#00B8A2'
					}
				}
				return color
			},
			setPercent(type) { //1 总摄入 2 早餐 3午餐 4晚餐 5 断食
				let value = 0
				let heat = this.data.heat

				if (heat) {
					if (type === 1) {
						value = parseFloat((Number(heat.heat_total)) / (Number(heat.set.heat_kcal) + Number(this.data
						?.sports?.total) || 1)) * 100
					}
					if (type === 2) {
						value = parseFloat(Number(heat.meals_breakfast) / (Number(heat.set.meals_breakfast) || 1)) * 100
					}
					if (type === 3) {
						value = parseFloat(Number(heat.meals_lunch) / (Number(heat.set.meals_lunch) || 1)) * 100
					}
					if (type === 4) {
						value = parseFloat(Number(heat.meals_dinner) / (Number(heat.set.meals_dinner) || 1)) * 100
					}
					if (type === 5) {
						value = parseFloat(Number(this.timer) / (Number(this.targetFastValue * 60 * 60) || 1)) * 100
					}
				}
				return value
			},
			getData() {
				this.$request({
					url: '/ApiV3/Mobile/Diary/index',
					method: 'get',
					data: {
						of_date: this.$common.formatDate(new Date(), false) + ' 00:00:00'
					}
				}).then(({
					data
				}) => {

					this.data = data

					if (this.data?.weight?.value) this.data.weight.value = (this.data.weight.value).toFixed(2)
					if (this.data?.weight_cycle?.target_weight) this.data.weight_cycle.target_weight = (this.data
					.weight_cycle.target_weight).toFixed(2)


					let value = parseFloat(Number(data?.heat?.heat_total) / (Number(data?.heat?.set.heat_kcal) +
						Number(data?.sports?.total) || 1)) * 100
					if (value >= 100) {
						this.tip = '吃多了'
						this.activeColor = '#FF7569'
					} else {
						this.tip = '还可摄入'
						this.activeColor = '#00B8A2'
					}
				})
			},
			addWeight(name) {

				if (this.$store.state.user.userInfo.should_update) {

					return this.popshow = true
				}

				this.$refs.recordPopup1.open({
					name
				}) //默认添加都是今天 不显示日历


			},
			success() {
				//请求接口
				console.log('success')
				this.getData()
			},
			gotoDetail(name) {
				if (!this.token) {
					// this.$common.toast('请先登陆')
					return uni.navigateTo({
						url: '/pages/login/index'
					})
				}

				if (this.$store.state.user.userInfo.should_update) {

					return this.popshow = true
				}
				uni.navigateTo({
					url: '/pages/newHome/index?name=' + name
				})
			},
			jump(url) {
				if (!this.token) {
					return uni.navigateTo({
						url: '/pages/login/index'
					})
				}
				if (this.$store.state.user.userInfo.should_update) {

					return this.popshow = true
				}
				uni.navigateTo({
					url: '/packages/' + url
				})
			},

		}
	}
</script>
<style lang="scss" scoped>
	.quantity {
		background: #f7f7f7;

		// min-height: 100vh;
		&-content {
			background-color: #FFF;
			border-radius: 24rpx;
			padding: 16rpx;
			min-height: 860rpx;

			&-box {
				display: flex;
				align-items: center;
				width: 100%;

				&-item {
					position: absolute;
					top: 30rpx;
					left: 50%;
					transform: translateX(-50%);
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;

				}
			}
		}
	}

	.canvas_half-circle {
		position: relative;
		// top:232rpx;
		text-align: center;

		.time {
			color: #C2C2C2;
			font-size: 24rpx;
			margin: 10rpx;

		}

	}

	.overflow {
		color: #FF7569
	}

	.active {
		opacity: 1;
		box-shadow: 0 5px 10px black;
	}



	.content {
		position: absolute;
		text-align: center;
		margin: -10px 0 0 -30px;
		top: 70%;
		left: 50%;
		font-size: 20px;
	}
</style>
<style lang="scss">
	page {
		height: 100%;
	}

	.mark {


		background-image: url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/v3_bg_home.png");
		min-height: 100vh;
		background-repeat: no-repeat;
		background-size: 750rpx 648rpx;
		background-color: #FAFAFA;

		// backdrop-filter: blur(20px);
		// filter: blur(5rpx);
		.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			flex: 1;
			/* 如果您想让slot内容与导航栏左右有空隙 */
			padding: 0 30rpx;

		}

		.f {
			// background-color: #5cba8a;
			border-radius: 5px;
			z-index: 10;
			// -webkit-backdrop-filter: blur(20px);
			backdrop-filter: blur(5px);
			width: 100%;

			// padding: 20px 40px;
		}

		.food {
			min-width: 686rpx;
			min-height: 280rpx;
			border-radius: 24rpx;
			box-shadow: 0px 0px 24px 2px rgba(0, 0, 0, 0.06);
			background: #FFFFFF;
			padding: 18rpx 24rpx;
			margin: 32rpx;
			background-image: url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/diary_card_bg@2x.png");
			background-position: right bottom;
			background-repeat: no-repeat;
			background-size: 156rpx 124rpx;
		}

		.box {
			position: relative;
			width: 334rpx;
			min-height: 328rpx;
			background: #FFFFFF;
			box-shadow: 0px 6px 24px 2px rgba(0, 0, 0, 0.04);
			border-radius: 24rpx;
			padding: 24rpx 14rpx;
			margin-bottom: 24rpx;
		}
	}
</style>