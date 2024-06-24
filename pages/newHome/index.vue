<template>

	<view class="container">

		<view class="u-relative" style="z-index: 9999;">
			<u-navbar :custom-back="back" title=" " id="navbar" back-text=" " :border-bottom="false" :is-fixed="true"
				title-color="#2A2A2A" :title-bold="true">
				<view @click="show = !show" class="u-flex-1 u-absolute u-flex-xy-center">
					<!-- <image v-if="naviTitle=== '断食'" :src="`${imgUrl+src}`" style="width: 32rpx;height:32rpx;margin-right: 10rpx;"></image> -->
					<image mode="aspectFit" :src="imgUrl+src" style="width: 48rpx;height:48rpx;"></image>
					<view>{{naviTitle}} </view>
					<u-icon :name="'arrow-down'" size="32rpx" style="margin-left:4rpx;">
					</u-icon>
				</view>
			</u-navbar>
		</view>

		<view class="popup2" catchtouchmove v-if="show">
			<block v-if="sex == 0">
				<view @click="setTitle(item)" v-for="item in popList" :key="item.name">



					<image mode="aspectFit" :src="imgUrl+item.src"></image>
					<view
						:style="{fontWeight:naviTitle === item.name?'bold':'normal',color:naviTitle === item.name?'#00B8A2':'#2A2A2A'}">
						{{item.name}}
					</view>

				</view>
			</block>
			<block v-else>
				<view @click="setTitle(item)" v-for="item in popList.filter(v=>v.name !=='经期')" :key="item.name">


					<image mode="aspectFit" :src="imgUrl+item.src"></image>
					<view
						:style="{fontWeight:naviTitle === item.name?'bold':'normal',color:naviTitle === item.name?'#00B8A2':'#2A2A2A'}">
						{{item.name}}
					</view>

				</view>
			</block>
		</view>
		<view v-if="show" catchtouchmove class="mask" @click="show = false"></view>
		<view v-show="echartType">
			<view class="content">

				<image @click="_jump({url:'newHome/nutrition/setWater',data:{userId,allowDel}})" class="u-absolute"
					v-if="naviTitle === '喝水量'" :src="`${imgUrl}v3_mine_setting.png`"
					style="width: 48rpx;height:48rpx;top: 28rpx;right: 40rpx;">
				</image>

				<view class="time" @click="calendarshow = true">

					{{startDate}} ~ {{endDate}}
				</view>
				<view v-if="echartData.length" class="u-flex u-flex-end"
					style="width: 100vw; padding: 30rpx 50rpx 0 0;">
					<text class="u-font-24" v-if="unit"> {{'单位：' + unit}}</text>
				</view>
				<view v-if="echartData.length" class="record_charts">
					<block v-if="echartType === 1">
						<l-echart ref="chart"></l-echart>
					</block>
					<block v-if="echartType === 2">
						<l-echart ref="chartBar"></l-echart>
					</block>

				</view>

				<view v-else style="margin:150rpx 0;color:#C2C2C2">暂无数据</view>
				<u-gap height="24"></u-gap>
				<view class="u-dropdown-tw" v-if="naviTitle== '体围'" style="background-color: #F3F3F3;border-radius: 28rpx">
					<view v-if="openDropdown" @click="closeDropdown" class="dropdown_mask"></view>

					<u-dropdown @open="openDropdown = true" @close="" ref="dropdown" style="flex-grow: 2"
						:length="options1.length" :height="60" class="u-timeRecord-dropdown" active-color="#00B8A2"
						inactive-color="#2a2a2a">

						<u-dropdown-item class="u-timeRecord-dropdown-item" v-model="timeSlot" :title="tw_title">
							<view class="slot-content">
								<view @click="itemChange(item.value,index)"
									:class="[{'active':active.includes(index) }]" v-for="(item,index) of options1"
									:key="index">
									<text style="width: 150rpx;text-align: center;">{{item.label}}</text>


									<u-icon v-if="active.includes(index)" color="#00B8A2" name="checkbox-mark"></u-icon>
									<text v-else style="width: 24rpx;"></text>

								</view>


							</view>
						</u-dropdown-item>
					</u-dropdown>
				</view>
			</view>
			<u-gap height="24"></u-gap>
			<view v-if="naviTitle== '体围'" style="width: 750rpx;background-color:#FAFAFA;margin-bottom:12rpx;">
				<u-tabs bg-color="#FAFAFA " showDot :active-item-style="{fontSize:'34rpx'}" :active-color="activeColor"
					:show-bar="true" :list="list" :current="current" @change="change">

				</u-tabs>
			</view>
			<!-- @click="jump('bodyFatScale/myHealthReport/history')" -->
			<view class="content">

				<view v-if="naviTitle!== '体围'" class="title">{{naviTitle + '记录'}} </view>
				<block v-if="weightData.length ">
					<block v-if="naviTitle!== '体围'">
						<view class="content-item" @longpress="longpress(item,index)" v-for="(item,index) in weightData"
							@click.stop="editWeight(item)" :key="index">
							<view class="u-flex">
								{{item.of_date}}
								<image v-if="naviTitle === '体重' && item.bodyfatscale_id !== 0"
									:src="`${imgUrl}v3_tizhicheng_logo.png`"
									style="width: 48rpx;height:48rpx;margin-left: 28rpx;">
								</image>
							</view>
							<view v-if="naviTitle !== '尿酮'" style="color:#2A2A2A" class="u-flex-xy-center">
								<view>{{item.value+ ' '}}{{unit}}</view>
								<view class="BMI" :style="{background:setBMI(item.level).color}"
									v-if="naviTitle === 'BMI'">
									{{ setBMI(item.level).name }}
								</view>
							</view>

							<view v-else class="URINE_KETONE">
								<view class="u-m-l-16" style="width: 32rpx;height:32rpx;"
									:style="{background:setBg(item.value),border: '2rpx solid '+setBg(item.value)}">
								</view>
								<view style="flex:1;text-align: center;">{{setName(item.value)}}</view>

							</view>
						</view>
					</block>
					<view v-else class="u-font-28" style="padding: 0 60rpx;width: 750rpx;">
						<!-- <view class="bodyTableLable">
							<view style="flex: 2;">日期</view>
							<view>腰围</view>
							<view>臀围</view>
						</view> -->
						<view v-for="(item,index) in weightData" @longpress="longpress(item,index)"
							@click.stop="editWeight(item)" :key="index" class="u-flex-xy-center content-item"
							style="padding:28rpx 0 28rpx 0;width: 100%;">
							<view>{{item.of_date | formatTime3}}</view>
							<view v-if="item.value" style="color:#2A2A2A">
								{{item.value&& parseFloat(Number(item.value).toFixed(1))+' cm'  }}
							</view>
							<!-- <view style="flex: 1;text-align: center;">
								{{item.hipline&& parseFloat(Number(item.hipline).toFixed(1)) }}
							</view> -->
						</view>
					</view>
				</block>

				<!-- <u-empty margin-top="100" class="u-p-b-60" v-else mode="data"></u-empty> -->
				<block v-else>
					<view class="u-flex-column u-flex-items-center" style="margin:150rpx 0">
						<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_empty1.png`" mode=""></image>
						<view style="color:#C2C2C2;padding:16rpx 0">暂时没有记录</view>
					</view>
				</block>
			</view>
			<view class="font-button">
				<my-button v-if="naviTitle !== 'BMI' && allowDel" width="240" height="72" class="u-m-r-40"
					@click="addWeight">
					记录{{naviTitle}}</my-button>
				<my-button @click="jump('bodyFatScale/connect/connect')"
					v-if="(naviTitle === '体重' || naviTitle === 'BMI') && allowDel" width="240" height="72">
					上秤测量</my-button>
				<my-button @click="$u.route('/packages/bodyFatScale/myHealthReport/history?userId='+userId)"
					v-if="(naviTitle === '体重' || naviTitle === 'BMI') && !allowDel" width="240" height="72">
					历史记录</my-button>
			</view>
		</view>
		<view v-show="!echartType">
			<view v-if="naviTitle === '血糖'">
				<blood :allowDel="allowDel" :userId="userId" ref="blood"></blood>
			</view>
			<view v-if="naviTitle === '血压'">
				<blood-pressure :allowDel="allowDel" :userId="userId" ref="blood-pressure"></blood-pressure>
			</view>
			
			<view v-show="naviTitle === '热量'">
				<quantity :allowDel="allowDel" :userId="userId" ref="quantity"></quantity>
			</view>
			<view v-if="naviTitle === '感受'">
				<suggest-fell :userId="userId" ref="suggestFell"></suggest-fell>
			</view>
			<view v-if="naviTitle === '经期'">
				<fill :userId="userId" ref="fill"></fill>
			</view>
		</view>
		<u-popup class="popup3" v-model="delShow" mode="center" width="590rpx" height="248rpx" border-radius="12">
			<view class="popup-text-view" style="padding: 48rpx">确定删除该条{{naviTitle}}记录？</view>
			<view class="popup-btn">
				<u-button @click="
		        () => {
		          delShow = false
		        }
		      ">取消</u-button>
				<u-button @click="confirmBtn" plain class="popup-btn-right">确认</u-button>
			</view>
		</u-popup>
		<u-popup :mask-close-able="false" v-model="popshow" mode="center" border-radius="24" width="638rpx"
			height="288rpx">
			<view class="u-flex-column u-flex-items-center u-flex-around" style="height: 100%;">
				<view class="u-font-32 text-bold">您还未完善个人信息</view>
				<view class="u-font-32 ">请先完善信息再进行操作</view>
				<view class="u-flex-y-center u-flex-around" style="width: 100%;">
					<my-button width="208" height="72" @click="gotoWrite('/pages/mine/invite/updatePersonalInfo')">去完善
					</my-button>
				</view>
			</view>
		</u-popup>
		<recordPopup1 :userId="userId" @success="success" style="width: 100vw;height:100vh" ref="recordPopup1">
		</recordPopup1>
		<home-calendar :water_target="water_target" :userId="userId" ref="calendar" @turnPage="turnPage"
			:calendarData="calendarDate" :naviTitle="naviTitle" :defaultStartDate="startDate" :defaultEndDate="endDate"
			@dayChange="calendarChange" @change="calendarChange" v-model="calendarshow" mode="range"></home-calendar>
	</view>
</template>

<script>
	import recordPopup1 from '@/components/recordPopup1.vue'
	import homeCalendar from './components/home-calendar.vue'
	import myButton from '@/components/myButton.vue'
	import blood from './components/blood/index.vue'
	
	import blood_pressure from './components/blood_pressure/index.vue'
	import quantity from './components/quantity/index.vue'
	import suggestFell from './components/suggestFell/index.vue'
	import fill from './fill/index.vue'
	import * as echarts from '@/utils/echarts.min.js'
	const weekTimeStamp = new Date().getTime() - 6 * 24 * 60 * 60 * 1000
	const BMI = [{
		name: '正常范围',
		level: 2,
		color: '#53B46F'
	}, {
		name: '体重过低',
		level: 1,
		color: '#2680EB'
	}, {
		name: '肥胖前期',
		level: 3,
		color: '#F9C149'
	}, {
		name: '1级肥胖',
		level: 4,
		color: '#FF7C64 '
	}, {
		name: '2级肥胖',
		level: 5,
		color: '#E75D54'
	}, ]
	const ketoneList = [{
		name: '1+',
		color: '#E6BEE2',
		value: 1
	}, {
		name: '2+',
		color: '#B77BA6',
		value: 2
	}, {
		name: '3+',
		color: '#9A4586',
		value: 3
	}, {
		name: '4+',
		color: '#3A0151',
		value: 4
	}, {
		name: '无显示',
		color: '#FFEFCF',
		value: -1
	}, {
		name: '未检测',
		color: '#cacaca',
		value: 0
	}] //尿酮列表
	const options1 = [{
			label: '全部展示',
			value: 'ALL'
		},
		{
			label: '腰围',
			value: 'CIRCUMFERENCE_WAIST',
			type: 'waist_data',
			activeColor: '#00B8A2'
		},
		{
			label: '臀围',
			value: 'CIRCUMFERENCE_HIPLINE',
			type: 'hipline_data',
			activeColor: '#FFC191'
		},
		{
			label: '胸围',
			value: 'CIRCUMFERENCE_CHEST',
			type: 'chest_data',
			activeColor: '#A377FC'
		},
		{
			label: '大腿围',
			value: 'CIRCUMFERENCE_THIGH',
			type: 'thigh_data',
			activeColor: '#FE7575'
		},
		{
			label: '小腿围',
			value: 'CIRCUMFERENCE_CALF',
			type: 'calf_data',
			activeColor: '#59E186'
		},
		{
			label: '手臂围',
			value: 'CIRCUMFERENCE_ARM',
			type: 'arm_data',
			activeColor: '#4B90F9'
		}



	]
	const activeColor = ['#00B8A2', '#FFC191', '#A377FC', '#FE7575', '#59E186', '#4B90F9']
	export default {
		data() {
			return {
				allowDel: false,//是否允许修改
				tw_echart_value: 'CIRCUMFERENCE_WAIST,CIRCUMFERENCE_HIPLINE',
				tw_list_value: 'CIRCUMFERENCE_WAIST',
				activeColor: activeColor[0],
				openDropdown: false,
				tw_title: '折线图展示',
				timeSlot: '全部展示',
				list: options1.slice(1).map(v => ({ name: v.label, activeColor: v.activeColor, value: v.value })),
				current: 0,
				options1,
				active: [1,2],
				oldActive: [1,2],
				delObj: {},
				delShow: false,
				scrollDirection: '',
				water_target: 0, //目标喝水量
				calendarDate: [], //当月日历数据
				unit: 'kg',
				date: this.$common.formatDate(new Date(), false), //评价与感受的
				startDate: this.$common.formatDate(new Date(weekTimeStamp), false),
				endDate: this.$common.formatDate(new Date(), false),
				calendarshow: false,
				dateValue: 7, //获取体重数据天数
				weightData: [],
				weightDataPage: 1,
				once: 1,
				length: 0,
				userId: '',
				sex: '',
				show: false,
				naviTitle: '',
				src: `data_icon_weight@2x.png`,
				echartUrl: '/ApiV3/Mobile/Diary/chart',
				listUrl: '/ApiV3/Mobile/Diary/list',
				apiType: 'WEIGHT',
				echartData: [],
				echartType:false,
				horizontaPointVal: 60, //体重
				popList: [{ // type 删除接口的type  apitype 数据接口用到
						src: 'data_icon_weight@2x.png',
						name: '体重',
						unit: 'kg',
						echartUrl: '/ApiV3/Mobile/Diary/chart',
						listUrl: '/ApiV3/Mobile/Diary/list',
						type: 'WEIGHT',
						apiType: 'WEIGHT',

					}, {
						src: 'data_icon_kcal@2x.png',
						name: '热量',
						unit: 'kcal'
					},
					{
						src: 'data_icon_bmi@2x.png',
						name: 'BMI',
						echartUrl: '/ApiV3/Mobile/Diary/chart',
						listUrl: '/ApiV3/Mobile/Diary/list',
						unit: '',
						apiType: 'BMI',
						type: 'WEIGHT' //跟体重一样
					}, {
						src: 'v3_bloodpress.png',
						name: '血压',
						unit: ''
					}, {
						src: 'diary_icon_@2x.png',
						name: '尿酮',
						unit: '',
						echartUrl: '/ApiV3/Mobile/Diary/chart',
						listUrl: '/ApiV3/Mobile/Diary/list',
						apiType: 'URINE_KETONE',
						type: 'URINE_KETONE',
					}, {
						src: 'data_icon_waistline.png',
						name: '体围',
						unit: 'cm',
						echartUrl: '/ApiV3/Mobile/Diary/chart',
						listUrl: '/ApiV3/Mobile/Diary/list',
						apiType: 'CIRCUMFERENCE_WAIST,CIRCUMFERENCE_HIPLINE',
						type: 'CIRCUMFERENCE_WAIST,CIRCUMFERENCE_HIPLINE'
					}, {
						src: 'diary_icon_water@2x.png',
						name: '喝水量',
						unit: 'mL',
						echartUrl: '/ApiV3/Mobile/Diary/chart',
						listUrl: '/ApiV3/Mobile/Diary/list',
						apiType: 'WATER',
						type: 'WATER',
					}, {
						src: 'diary_icon_glu@2x.png',
						name: '血糖',
					},
					{
						src: 'data_icon_period@2x.png',
						name: '经期',
					},
					{
						src: 'v3_fell.png',
						name: '感受',
					},
				]
			}
		},
		components: {
			homeCalendar,
			myButton,
			recordPopup1,
			
			blood,
			'blood-pressure': blood_pressure,
			quantity,
			suggestFell,
			fill
		},
		computed: {

			// echartType() {
			// 	let flag = false
			// 	console.log('this.naviTitle: ', this.naviTitle)
			// 	if (this.naviTitle == '体重' || this.naviTitle == '体围' || this.naviTitle ==
			// 		'BMI') {
			// 		flag = 1
			// 	} else if (this.naviTitle == '尿酮' || this.naviTitle == '喝水量') {
			// 		flag = 2
			// 	}
			// 	return flag
			// },
			setBg() {
				return function(e) {
					let obj = ketoneList.find(res => res.value === e)
					return obj && obj.color

				}
			},
			setName() {
				return function(e) {

					let obj = ketoneList.find(res => res.value === e)
					return obj && obj.name


				}
			},
			setBMI() {
				return function(e) {

					let obj = BMI.find(res => res.level === e)
					return obj


				}
			},

		},
		watch: {
			naviTitle(val){	
				console.log('val: ', val)
				val = val.trim()
				if (val == '体重' || val == '体围' || val ==
					'BMI') {
					this.echartType = 1
					
				} else if (val == '尿酮' || val == '喝水量') {
					
					this.echartType  = 2
				}else{
					
					this.echartType  = false
					
				}
				console.log('this.echartType: ', this.echartType)
			}
		},
		onLoad(option) {
			console.log('option: ', option)
			
			// let pages = getCurrentPages()
			// let currentPages = pages[pages.length - 1]
			// //扫码跳转进来的时候保存当前路径
			// uni.setStorageSync('beforPage',currentPages.$page.fullPath)
			// console.log('beforPage',uni.getStorageSync('beforPage'))
			this.naviTitle = '体重'
			
			if (option.user_id) this.userId = option.user_id
			if (option.date) {
				option.date = option.date.replace(/\-/g, '/');
				this.date = this.$common.formatDate(new Date(option.date), false)
			}
			if (option.type || option.name){
				this.naviTitle = option.type? this.setPageNaviTitle(option.type) :option.name
				let obj = this.popList.find(res => res.name === decodeURIComponent(this.naviTitle))
				console.log(11111111, obj)
				this.unit = obj.unit
				this.naviTitle = obj.name
				this.src = obj.src
				this.echartUrl = obj.echartUrl
				this.listUrl = obj.listUrl
				this.apiType = obj.apiType
			} 
			this.sex = option.sex || this.$store.state.user.userInfo.sex
			console.log('this.naviTitle: ', this.naviTitle)
			
			
			
			console.log(22222222222, this.$store.state.user.userInfo)
			uni.setStorageSync('userId', this.userId)


		},
		async onShow() {
			
			//从会员列表跳进来设置消息已读
			if (this.userId) {
				this.$request({
					url: '/ApiV3/Mobile/Staff/readDiary',

					data: {
						date: this.$common.formatDate(new Date(), false) + ' 00:00:00',
						user_id: this.userId
					}
				}).then(res => {

				})
			}

			let { data } = await this.$store.dispatch('getUserInfo')
			// 如果this.userId为空说明是自己的
			console.log('this.userId', this.userId)
			console.log('data', data)
			if (!this.userId || data.id == this.userId || data?.roles?.isServer) {


				this.allowDel = true
				console.log('this.allowDel: ', this.allowDel)
			}
			


			if (this.naviTitle === '热量') {
				this.once = 2

				if (this.$refs.quantity) {
					this.$refs.quantity.upload(this.userId)
				} else {
					await this.findEm('quantity')
					this.$refs.quantity.upload(this.userId)
				}

			}
			if (this.naviTitle === '感受') {
				if (this.$refs.suggestFell) {
					this.$refs.suggestFell.setDate(this.date)
				} else {
					await this.findEm('suggestFell')
					this.$refs.suggestFell.setDate(this.date)
				}

			}
			console.log('this.echartType: ', this.echartType)
			if (!this.echartType) return
			this.getWeightData() //canvas
			this.getWeightList() //列表记录
		},
		onPageScroll(e) {

			this.scrollDirection = e.scrollTop < this.scrollTop ? 'up' : 'down'
			this.scrollTop = e.scrollTop < this.scrollTop ? e.scrollTop : e.scrollTop

			if (this.naviTitle === '血压') {
				if (this.scrollDirection === 'up') {

					this.$refs['blood-pressure'].pageScroll(e.scrollTop)

				} else {
					this.$refs['blood-pressure'].setScroll(e.scrollTop)
				}


			}
			if (this.naviTitle === '血糖') {

				if (this.scrollDirection === 'up') {

					this.$refs['blood'].pageScroll(e.scrollTop)

				} else {
					this.$refs['blood'].setScroll(e.scrollTop)
				}
			}

		},
		onReachBottom() {

			if (this.length) {
				this.weightDataPage++
				this.getWeightList()
			}
			if (this.naviTitle === '热量') {
				this.$refs.quantity.setReachBottom()
			}
			if (this.naviTitle === '血压') {
				this.$refs['blood-pressure'].reachBottom(this.scrollTop)

			}
			if (this.naviTitle === '血糖') {
				this.$refs['blood'].reachBottom(this.scrollTop)
			}
		},
		methods: {
			setPageNaviTitle(type) {
				let name = ''
				switch (type) {
					case 'BLOOD_SUGAR':
						name = '血糖'
						break;
					case 'BLOOD_PRESSURE':
						name = '血压'
						break;	
					case 'HEAT':
						name = '热量'
						break;
					case 'SPORT':
						name = '热量'
						break;
					case 'WEIGHT':
						name = '体重'
						break;
					case 'WATER':
						name = '喝水量'
						break;
					case 'URINE_KETONE':
						name = '尿酮'
						break;
					case 'FEEL':
						name = '感受'
						break;
					default:
					    name = '体围'
						break;
				}
				return name
			},
			change(index) {
				this.current = index;
				this.tw_list_value = this.list[index].value
				this.activeColor = activeColor[index]
				this.getWeightList()
			},
			arraysAreEqual(arr1, arr2) {
				return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
			},
			closeDropdown(e) {

				if (this.$refs.dropdown) {
					if (!this.active.length) return this.$common.toast('请至少选择一种围度')
					this.openDropdown = false
					this.$refs.dropdown.close();
					if (!this.arraysAreEqual(this.oldActive, this.active)) {
						this.oldActive = JSON.parse(JSON.stringify(this.active))
						this.tw_echart_value = this.active.filter(v => v).map(v => options1[v].value).join(',')

						this.getWeightData()
						console.log('this.tw_echart_value: ', this.tw_echart_value)
						console.log('更新折线图')

					}
				}
			},
			itemChange(e, index) {


				if (this.active.includes(index)) {
					if (index === 0) {
						this.active = []
					} else {
						this.active.splice(this.active.indexOf(index), 1)
						this.active = this.active.filter(item => item !== 0);
					}

				} else {

					this.active.push(index)
					if (this.active.length === this.options1.length - 1 && index !== 0) {
						this.active.push(0)
					}
					if (index === 0) {
						this.active = []
						this.options1.forEach((v, i) => {
							this.active.push(i)
						})
					}

				}
			},
			gotoWeightDetail(item) {
				uni.navigateTo({
					url: '/packages/bodyFatScale/myHealthReport/index?userId=' + this.userId + '&time=' + item
						.of_date.slice(0, -3) + '&id=' + item.bodyfatscale_id,

				})
			},
			confirmBtn() {

				const {
					index,
					...data
				} = this.delObj
				console.log(index, data)
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: '/ApiV3/Mobile/Diary/del',
					data
				}).then(res => {
					this.delShow = false
					this.weightData.splice(index, 1)
					this.getWeightData()
					this.$common.toast('成功')
				})
			},
			longpress(item, index) {
				this.delShow = true
				let obj = this.popList.find(e => e.name === this.naviTitle)
				if (!obj) return
				this.delObj = {
					id: item.id,
					type: this.naviTitle === '体围' ? this.tw_list_value : obj.type,
					index
				}
				console.log(this.delObj)

			},
			gotoWrite(url) {
				this.popshow = false
				uni.navigateTo({
					url
				})
			},
			bodySeries(dateList, length) { //echarts 体围option series配置
				let arr = []
				if (this.active.length === 1) {
					console.log('dateList', dateList)
					arr = options1.filter(v => v.value === this.tw_echart_value).map(v => ({ ...v, val: dateList.map(v => v
							.value) }))
				} else {
					arr = options1.filter(v => this.tw_echart_value.includes(v.value)).map(v => ({ ...v, val: null }))

					arr.forEach(v => {

						v.val = dateList.map(e => e[v.type])
					})

				}


				console.log('arr: ', arr)

				return arr.map((v, i) => {
					return {
						name: v.label,
						type: 'line',
						connectNulls: true, // 这里使用connectNulls来连接null值的数据点
						data: v.val, //i ? hipline.map(v => v) : waist.map(v => v),
						markPoint: {
							data: arr.length < 2 && v.val.length > 7 ? [{
									name: '最大值',
									type: 'max'
								},
								{
									name: '最小值',
									type: 'min'
								}
							] : []
						},
						smooth: 0.5,
						
						label: {
							show: arr.length < 2,
							position: 'top',
							color: v.activeColor,
							formatter: (params) => {
								if (v.val.length > 7) return ''
								return params.value
							}
						},
						itemStyle: {
							normal: {
								color: v.activeColor,
								borderWidth: 1,
							},
						},
						lineStyle: {
							color: v.activeColor,
						},
						areaStyle: {
							color: {

								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: v.activeColor // 0% 处的颜色
								}, {
									offset: 1,
									color: '#ffffff' // 100% 处的颜色
								}],
								global: false // 缺省为 false

							}
						}
					}
				})

			},
			findEm(em) {
				return new Promise((resolve, reject) => {
					setTimeout(async () => {
						let val = this.$refs[em]
						console.log(111, val)
						if (val) resolve(1)
						if (!val) {
							return this.findEm(em)
						}
					}, 10)
				})

			},
			getSeting() {
				return new Promise((resolve, reject) => {
					let data = {}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/Diary/getSeting',
						method: 'get',
						data
					}).then(res => {

						this.water_target = res.data.water_target
						resolve()
					})
				})

			},
			back() {
				console.log('自定义返回')
				let pages = getCurrentPages()
				let page = pages[pages.length - 2];
				if (page) {
					let type = page.$page.fullPath !== '/pages/login/index' &&
						page.$page.fullPath !== '/pages/newHome/index'
					if (type) {
						uni.navigateBack()
					} else {
						wx.switchTab({
							url: '/pages/tabbar/projects'
						})
					}
				} else {
					wx.switchTab({
						url: '/pages/tabbar/projects'
					})
				}
				console.log(page)



			},
			turnPage(date, days, userId) {


				console.log(date, this.naviTitle)

				if (!this.echartType) return
				const data = {
					start_date: date + '-01 00:00:00',
					end_date: date + '-' + days + ' 23:59:59',
					type: this.naviTitle === '体围' ? this.tw_echart_value : this.apiType,
					page: 1
				}
				if (userId) data.user_id = userId



				this.$request({
					url: this.echartUrl,
					method: 'get',
					loading: true,
					errMsg: true,
					data
				}).then(async res => {
					if (this.naviTitle !== '体围') {
						this.calendarDate = res.data.data
					} else {
						if (this.active.length === 1) {
							this.calendarDate = res.data.data
						} else {
							const { CIRCUMFERENCE_WAIST: { data: waist_data = [] } = {},
								CIRCUMFERENCE_ARM: { data: arm_data = [] } = {},
								CIRCUMFERENCE_CALF: { data: calf_data = [] } = {},
								CIRCUMFERENCE_CHEST: { data: chest_data = [] } = {},
								CIRCUMFERENCE_HIPLINE: { data: hipline_data = [] } = {},
								CIRCUMFERENCE_THIGH: { data: thigh_data = [] } = {} } = res.data

							this.calendarDate = [...waist_data, ...thigh_data, ...hipline_data, ...chest_data,
								...calf_data, ...arm_data
							]
						}
					}


				})
			},
			jump(url) {

				uni.navigateTo({
					url: '/packages/' + url + '?userId=' + this.userId
				})
			},
			success() {
				this.weightDataPage = 1
				this.getWeightData()
				this.getWeightList()
			},
			addWeight() {

				this.$refs.recordPopup1.open({
					name: this.naviTitle,
					tw_title: options1.find(v => v.value === this.tw_list_value)?.label,
				})


			},
			editWeight(item) {
				console.log('item: ', item)

				if (this.naviTitle === '体重' && item.bodyfatscale_id !== 0) {
					//体脂称数据跳转到详情
					return this.gotoWeightDetail(item)
				}
				if (this.naviTitle === 'BMI') return
				if (!this.allowDel) return
				item = {
					...item,
					tw_title: options1.find(v => v.value === this.tw_list_value)?.label,
					name: this.naviTitle
				}
				this.$refs.recordPopup1.edit(item)
			},
			calendarChange(date) {
				console.log(date)

				this.startDate = date.startDate
				this.endDate = date.endDate

				this.weightDataPage = 1
				this.getWeightData()
				this.getWeightList()
			},
			// dayChange(date) {
			// 	console.log(date)
			// 	this.startDate = date.startDate
			// 	this.endDate = date.endDate
			// 	this.weightDataPage = 1
			// 	this.getWeightData()
			// 	this.getWeightList()

			// },
			 setTitle(item) {
				
				this.naviTitle = item.name
				this.src = item.src
				this.show = false
				uni.pageScrollTo({
					scrollTop: 0
				})
				console.log('item: ', item)
				console.log('this.echartType: ', this.echartType)
				//监听naviTitle变化的时候 echartType还没执行 所以这里加一个异步
				setTimeout( async ()=>{
					if (item.name === '感受') {
						
						if (this.$refs.suggestFell) {
							return this.$refs.suggestFell.setDate(this.date)
						} else {
							await this.findEm('suggestFell')
							this.$refs.suggestFell.setDate(this.date)
						}
						return
					}
					if (item.name === '热量' && this.once === 1) {
						this.once = 2
						this.$refs.quantity.upload(this.userId)
					}
					if (!this.echartType) return
					this.unit = item.unit || ''
					
					
					this.echartUrl = item.echartUrl
					this.apiType = item.apiType
					this.listUrl = item.listUrl
					this.weightDataPage = 1
					this.getWeightData()
					this.getWeightList()
				},50)
				
			},
			//获取体重列表
			getWeightList() {
				const data = {
					start_date: this.startDate + ' 00:00:00',
					end_date: this.endDate + ' 23:59:59',
					page: this.weightDataPage,
					type: this.naviTitle === '体围' ? this.tw_list_value : this.apiType
				}
				if (this.userId) data.user_id = this.userId

				this.$request({
					url: this.listUrl,
					method: 'get',
					loading: true,
					errMsg: true,
					data
				}).then(res => {

					if (this.weightDataPage === 1) {
						this.weightData = res.data.data
					} else {
						this.weightData = [...this.weightData, ...res.data.data]
					}
					this.length = res.data.next_page_url
				})
			},
			// 获取n天体重历史数据 并渲染图表
			getWeightData() {
				// const type = this.current === 0 ? 'WEIGHT' : this.current === 1 ? 'WAIST' : 'HIPLINE'
				const data = {
					start_date: this.startDate + ' 00:00:00',
					end_date: this.endDate + ' 23:59:59',
					type: this.naviTitle === '体围' ? this.tw_echart_value : this.apiType
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: this.echartUrl,
					method: 'get',
					loading: true,
					errMsg: true,
					data
				}).then(async res => {
					if (this.naviTitle !== '体围') {
						this.echartData = res.data.data
						let echartData = res.data.data
						let length = echartData.length // 数据的长度
						await this.$nextTick()
						if (echartData.length && this.echartType === 1) {
							this.setOptionLine(echartData, length)

						} else if (echartData.length) {
							this.setOptionBar(echartData, length)
						}
					} else {
						let arr = []
						const { CIRCUMFERENCE_WAIST: { data: waist_data = [] } = {},
							CIRCUMFERENCE_ARM: { data: arm_data = [] } = {},
							CIRCUMFERENCE_CALF: { data: calf_data = [] } = {},
							CIRCUMFERENCE_CHEST: { data: chest_data = [] } = {},
							CIRCUMFERENCE_HIPLINE: { data: hipline_data = [] } = {},
							CIRCUMFERENCE_THIGH: { data: thigh_data = [] } = {} } = res.data
						if (this.active.length === 1) {
							arr = res.data.data
							console.log('arr: ', arr)
						} else {

							console.log('waist_data: ', waist_data)
							// console.log('thigh_data: ', thigh_data)
							// console.log('hipline_data: ', hipline_data)
							// console.log('chest_data: ', chest_data)
							// console.log('calf_data: ', calf_data)
							// console.log('arm_data: ', arm_data)
							arr = [...waist_data, ...thigh_data, ...hipline_data, ...chest_data, ...calf_data,
								...arm_data
							]
							console.log('arr: ', arr)
							this.echartData = arr
						}

						if (arr.length) {
							const maxDay = arr.map(v => v.day).reduce((a, b) => a > b ? a : b)
							const maxValue = arr.map(v => Number(v.value) ).reduce((a, b) => a > b ? a : b)
							
							const minDay = arr.map(v => v.day).reduce((a, b) => a < b ? a : b);
							const minValue = arr.map(v => Number(v.value)).reduce((a, b) => a < b ? a : b);
							

							let startDate = minDay && new Date(minDay) // new Date(this.startDate);

							let endDate = maxDay && new Date(maxDay) // new Date(this.endDate);  
							let dateList = [];

							while (startDate <= endDate) {
								var year = startDate.getFullYear();
								var month = ('0' + (startDate.getMonth() + 1)).slice(-2); // 月份从 0 开始，需要加 1
								var day = ('0' + startDate.getDate()).slice(-2);
								var formattedDate = month + '-' + day;
								var formattedDate1 = year + '-' + month + '-' + day;
								if (this.active.length === 1) {
									dateList.push({ day: formattedDate1, of_date: formattedDate,
									value: null });
								} else {
									dateList.push({
										day: formattedDate1,
										of_date: formattedDate,
										waist_data: waist_data.find(v => v.day === formattedDate1)
											?.value || null,
										thigh_data: thigh_data.find(v => v.day === formattedDate1)
											?.value || null,
										hipline_data: hipline_data.find(v => v.day === formattedDate1)
											?.value || null,
										chest_data: chest_data.find(v => v.day === formattedDate1)
											?.value || null,
										calf_data: calf_data.find(v => v.day === formattedDate1)
											?.value || null,
										arm_data: arm_data.find(v => v.day === formattedDate1)
											?.value || null
									});
								}

								startDate.setDate(startDate.getDate() + 1);
							}

							if (this.active.length === 1) {
								dateList.forEach(v => {
									if (arr.find(e => e.day === v.day)) {
										v.value = arr.find(e => e.day === v.day).value
									}
								})
							}
							console.log('dateList: ', dateList)
							this.setOptionLine(dateList, dateList.length, maxValue, minValue)

						}

					}


				})
			},
			setOptionLine(echartData, length, maxValue, minValue) {
				let option = {}
				if (this.naviTitle === 'BMI') {
					option = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross'
							},
							axisPointer: {
								type: 'line',

								lineStyle: {
									color: '#00B8A2'
								}
							},
							backgroundColor: '#00B8A2',
							textStyle: {
								fontSize: 12,
								color: '#FFFFFF'
							},
						},

						grid: {
							left: '8%',
							right: '12%',
							bottom: '3%',
							containLabel: true
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: [],
							axisLabel: {
								textStyle: {
									color: '#C2C2C2'
								},
								interval: 'auto', // 自动计算最佳显示间隔
								rotate: 45 // 可选，旋转角度，使文字斜着显示，避免重叠
							},
							axisTick: {
								show: false
							},
							axisLine: {
								show: false
							},
							splitLine: {
								show: false
							},
						},
						yAxis: {
							type: 'value',
							splitLine: {
								show: true,
								lineStyle: {
									color: ['#F5F5F5'],
									width: 1,
									type: 'solid'
								}

							},
							axisLabel: {
								textStyle: {
									color: '#C2C2C2'
								},
								// formatter:(val)=>{
								// 	console.log(1111111111,val)
								// 	if(val > 15 && val < 18.5){
								// 		return ['18.5']
								// 	}if(val >= 18.5 && val <= 22.9){
								// 		return ['23']
								// 	}if(val >= 23 && val <= 24.9){
								// 		return ['25']
								// 	}if(val >= 25){
								// 		return ['30']
								// 	}


								// }
							}
						},
						visualMap: {
							show: false,
							pieces: [{

									lt: 18.499, //小于
									color: '#77C5BF'
								},
								{
									gte: 18.5,
									lte: 22.999,
									color: '#61A27F'
								},
								{
									gte: 23,
									lte: 24.999,
									color: '#F7D43D'
								},
								{
									gte: 25,
									lte: 29.999,
									color: '#B94D47'
								},
								{
									gte: 30,
									color: '#E75D54'
								},
							]

						},
						series: [{
							name: this.naviTitle,
							type: 'line',
							connectNulls: true, // 这里使用connectNulls来连接null值的数据点
							data: [],
							smooth: 0.5,
						}]
					}
				} else {
					option = {

						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'line',

								lineStyle: {
									color: '#00B8A2'
								}
							},
							backgroundColor: '#00B8A2',

							textStyle: {
								fontSize: 12,
								color: '#FFFFFF'
							}
						},
						grid: {
							left: '8%',
							right: '12%',
							bottom: '3%',
							containLabel: true
						},
						legend: {
							data: [this.naviTitle]
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: [],
							axisLabel: {
								textStyle: {
									color: '#C2C2C2'
								},
								interval: 'auto', // 自动计算最佳显示间隔
								rotate: 45 // 可选，旋转角度，使文字斜着显示，避免重叠
							},
							axisTick: {
								show: false
							},
							axisLine: {
								show: false
							},
							splitLine: {
								show: false
							},
						},
						yAxis: {
							type: 'value',
							scale: true,
							show: true,
							splitLine: {
								show: true,
								lineStyle: {
									color: ['#F5F5F5'],
									width: 1,
									type: 'solid'
								}

							},
							axisLabel: {
								textStyle: {
									color: '#C2C2C2'
								},
							}
						},
						series: [{
							name: this.naviTitle,
							type: 'line',
							connectNulls: true, // 这里使用connectNulls来连接null值的数据点
							data: [],
							markPoint: {
								data: []
							},
							// markLine: {
							// 	symbol:'none',
							// 	label:{
							// 		position:'start'
							// 	},
							// 	lineStyle: {
							// 		color: '#C2C2C2',
							// 		type:'solid',
							// 		opacity:0.3
							// 	},
							// 	data: [

							// 		{
							// 			type: 'average',
							// 			name: '平均值'
							// 		}
							// 	]
							// },
							
							smooth: 0.5,
							label: {
								show: true,
								position: 'top',
								color: '#00B8A2', //this.naviTitle==='体重'?'#ffffff':
							},
							itemStyle: {
								normal: {
									color: '#00B8A2',
									borderWidth: 2,
								},
							},
							lineStyle: {
								color: '#00B8A2',
							},
							areaStyle: {
								color: {

									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
										offset: 0,
										color: '#56CDC0' // 0% 处的颜色
									}, {
										offset: 1,
										color: '#ffffff' // 100% 处的颜色
									}],
									global: false // 缺省为 false

								}
							}
						}]
					}
				}






				if (this.naviTitle === '体围') {
					// // const categories = echartData.map((e) => e.of_date)
					// // option.xAxis.data.push(...categories)
					// const categories = echartData.map((e) => e.day)
					// console.log('categories: ', categories)
					// let startDate = categories && new Date(categories[0]) // new Date(this.startDate);
					// console.log('startDate: ', startDate)
					// let endDate = categories && new Date(categories[categories.length - 1]) // new Date(this.endDate);  
					// console.log('endDate: ', endDate)
					// let currentDate = new Date(startDate);
					// let dateList = [];

					// while (currentDate <= endDate) {
					// 	var year = currentDate.getFullYear();
					// 	var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 月份从 0 开始，需要加 1
					// 	var day = ('0' + currentDate.getDate()).slice(-2);
					// 	var formattedDate = month + '-' + day;
					// 	var formattedDate1 = year + '-' + month + '-' + day;
					// 	dateList.push({ day: formattedDate1, of_date: formattedDate, hipline: null, waist: null });
					// 	currentDate.setDate(currentDate.getDate() + 1);
					// }

					// dateList.forEach(v => {
					// 	if (echartData.find(e => e.day === v.day)) {
					// 		v.hipline = echartData.find(e => e.day === v.day).hipline
					// 		v.waist = echartData.find(e => e.day === v.day).waist
					// 	}
					// })
					// console.log('dateList: ', dateList)
					option.xAxis.data.push(...echartData.map(v => v.of_date))

					option.xAxis.axisLabel = {
						textStyle: {
							color: '#C2C2C2'
						},
						interval: 'auto', // 自动计算最佳显示间隔
						rotate: 45 // 可选，旋转角度，使文字斜着显示，避免重叠
					}
					// let waist = dateList.filter((item) => Number(item.waist)).map((e) => Number(e
					// 	.waist))
					// let hipline = dateList.filter((item) => Number(item.hipline)).map((e) => Number(e
					// 	.hipline))
					// let waist = dateList.map(e => e.waist)
					// let hipline = dateList.map(e => e.hipline)


					const max = Number(maxValue) //Math.max(...waist, ...hipline)
					// //最小值做特殊处理 如果全部是0那就是0 否则拿除0外的最小值
					// let delMin = seriesData.some((e) => e) ? seriesData.filter((e) => e) : seriesData
					// console.log('delMin', delMin)
					const min = Number(minValue) //Math.min(...waist, ...hipline)
					console.log('min', min)
					console.log('max', max)
					option.yAxis.min = Math.floor(min) === min ? min - 1 : Math.floor(min)
					option.yAxis.max = Math.ceil(max) === max ? max + 1 : Math.ceil(max)
					// option.yAxis.interval = (max+ min)/2 - Math.floor(min)
					option.yAxis.interval = parseFloat(((option.yAxis.max + option.yAxis.min) / 2 - option.yAxis.min)
						.toFixed(2))
					option.series = this.bodySeries(echartData, length)
					option.tooltip = {
						trigger: 'axis',
						axisPointer: {
							type: 'line',
							lineStyle: {
								color: '#00B8A2'
							}
						},

						textStyle: {
							fontSize: 12,

						},
						formatter: function(params) {
							let arr = params.filter(v => v.value).map(v => {
								return v.marker + v.name + "：" + Number(v.value) + "cm\n"
							})
							return arr.join('')

						}
					}

				} else {
					const categories = echartData.filter((item) => Number(item.value)).map((e) => e.day)
					let seriesData = echartData.filter((item) => Number(item.value)).map((e) => Number(e
						.value))

					// option.xAxis.data.push(...categories)
					console.log('categories: ', categories)
					console.log('seriesData', seriesData)
					let startDate = categories && new Date(categories[0]) // new Date(this.startDate); 
					console.log('startDate: ', startDate)
					let endDate = categories && new Date(categories[categories.length - 1]) // new Date(this.endDate);  
					console.log('endDate: ', endDate)

					let currentDate = new Date(startDate);
					let dateList = [];

					while (currentDate <= endDate) {
						var year = currentDate.getFullYear();
						var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // 月份从 0 开始，需要加 1
						var day = ('0' + currentDate.getDate()).slice(-2);
						var formattedDate = month + '-' + day;
						var formattedDate1 = year + '-' + month + '-' + day;
						dateList.push({ day: formattedDate1, of_date: formattedDate, value: null });
						currentDate.setDate(currentDate.getDate() + 1);
					}

					dateList.forEach(v => {
						if (echartData.find(e => e.day === v.day)) {
							v.value = echartData.find(e => e.day === v.day).value
						}
					})

					console.log('dateList: ', dateList)
					option.xAxis.data.push(...dateList.map(v => v.of_date))

					seriesData = dateList.map(v => v.value)
					const max = Math.max(...seriesData)
					// //最小值做特殊处理 如果全部是0那就是0 否则拿除0外的最小值
					// let delMin = seriesData.some((e) => e) ? seriesData.filter((e) => e) : seriesData
					// console.log('delMin', delMin)
					const min = Math.min(...seriesData.filter(v => v))

					console.log('min', min)
					console.log('max', max)

					option.yAxis.min = Math.floor(min) === min ? min - 1 : Math.floor(min)
					option.yAxis.max = Math.ceil(max) === max ? max + 1 : Math.ceil(max)
					option.yAxis.interval = parseFloat(((option.yAxis.max + option.yAxis.min) / 2 - option.yAxis.min)
						.toFixed(2))

					if (length > 7 && this.naviTitle === '体重') {
						option.series[0].label.formatter = (params) => {
							// console.log('paramsparams',params)
							return ''
						}
						option.series[0].markPoint.data = [{
								name: '最大值',
								type: 'max'
							},
							{
								name: '最小值',
								type: 'min'
							}

						]

					}

					option.series[0].data.push(...seriesData)


				}

				// if (this.naviTitle === 'BMI') {
				// 	option.visualMap = {
				// 		show: false,
				// 		dimension: 1,
				// 		pieces: []
				// 	}
				// 	option.visualMap.pieces.push({

				// 		lt: 18.5, //小于
				// 		color: '#77C5BF'
				// 	}, {
				// 		gte: 18.5,
				// 		lte: 22.9,
				// 		color: '#61A27F'
				// 	}, {
				// 		gte: 23,
				// 		lte: 24.9,
				// 		color: '#F7D43D'
				// 	}, {
				// 		gte: 25,
				// 		lte: 29.9,
				// 		color: '#B94D47'
				// 	}, {
				// 		gte: 30,
				// 		color: '#E75D54'
				// 	}, )
				// }
				// option.xAxis.axisLabel.interval = option.xAxis.data.length - 2

				console.log('option', option)
				console.log('this.$refs.echart', this.$refs.chart)
				setTimeout(() => {
					this.$refs.chart.init(echarts, (echart) => {
						echart.setOption(option)
					})
				}, 100)

			},
			async setOptionBar(echartData) {

				const option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'line',

							lineStyle: {
								color: '#00B8A2'
							}
						},
						backgroundColor: '#00B8A2',
						// position: function (pos, params, dom, rect, size) {
						//      var obj = {top: 60};
						// obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
						// return obj;
						//  },
						textStyle: {
							fontSize: 12,
							color: '#FFFFFF'
						},

					},
					grid: {
						left: '8%',
						right: '13%',
						bottom: '3%',
						containLabel: true
					},

					xAxis: {
						type: 'category',
						data: [],
						axisLabel: {
							textStyle: {
								color: '#C2C2C2'
							}
						},
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						},
					},
					yAxis: {
						type: 'value',
						// splitLine: {
						// 	show: true,
						// 	lineStyle: {
						// 		color: ['#F5F5F5'],
						// 		width: 1,
						// 		type: 'solid'
						// 	}

						// },
						type: 'value',
						scale: true,
						show: true,
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#F5F5F5'],
								width: 1,
								type: 'solid'
							}

						},
						axisLabel: {
							textStyle: {
								color: '#C2C2C2'
							},
							formatter: (val) => {
								// if (this.naviTitle === '喝水量') return ''
								if (this.naviTitle !== '尿酮') return val

								console.log(1111111111, val)
								if (val === 0) {
									return ['未检测']
								}
								if (val === 1) {
									return ['无显示']
								}
								if (val === 2) {
									return ['1+']
								}
								if (val === 3) {
									return ['2+']
								}
								if (val === 4) {
									return ['3+']
								}
								if (val === 5) {
									return ['4+']
								}


							}
						}
					},
					series: [{
						name: this.naviTitle,
						data: [],
						markPoint: {
							data: []
						},
						type: 'bar',
						barWidth: '20%',
						label: {
							show: true,
							position: 'top'
						},
						itemStyle: {
							borderColor: 'transparent',
							color: '#00B8A2'
						},
						// showBackground: true,
						// backgroundStyle: {
						//   color: '#FFF'
						// },

					}]
				}
				const categories = echartData.filter((item) => Number(item.value) >= -1).map((e) => e.of_date)
				const seriesData = echartData.filter((item) => Number(item.value) >= -1).map((e) => Number(e.value))
				console.log('seriesData', seriesData)
				console.log('categories', categories)
				const max = Math.ceil(Math.max(...seriesData))
				// //最小值做特殊处理 如果全部是0那就是0 否则拿除0外的最小值
				// let delMin = seriesData.some((e) => e) ? seriesData.filter((e) => e) : seriesData
				// console.log('delMin', delMin)
				const min = Math.floor(Math.min(...seriesData))
				console.log('min', min)

				option.yAxis.min = min >= -1 ? min - 1 : min
				option.yAxis.max = max >= -1 ? max + 1 : max


				option.xAxis.data.push(...categories)
				if (this.naviTitle === '尿酮') {
					option.yAxis.min = 0
					option.tooltip.show = false
					option.series[0].label.show = false
					const setColor = val => {
						let obj = ketoneList.find(res => res.value === val)
						return obj && obj.color
					}
					// option.yAxis.data = ['未检测','无显示','1+','2+','3+','4+']

					seriesData.forEach(res => {
						option.series[0].data.push({
							value: res == -1 ? 1 : res === 0 ? 0 : res + 1, //为了迎合ui修改
							itemStyle: {
								color: setColor(res)
							}

						})
					})
				} else {
					if (this.naviTitle === '喝水量') {
						await this.getSeting()
						option.yAxis.min = 0
						if (Math.ceil(max) <= this.water_target) {
							option.yAxis.max = Math.ceil(this.water_target)
						} else {
							// let tenNum = parseInt(Math.ceil(max) %100 / 10) //获取十位数上的值
							let hundredNum = parseInt(Math.ceil(max) / 100) //获取整百
							if (!hundredNum) { //如果最大值小于整百 那就直接取整百
								option.yAxis.max = 100
							} else { //向上取整百 
								option.yAxis.max = parseInt(Math.ceil(max / 100) * 100)
							}


						}
						// option.yAxis.min = min <= 50 ? 0 : min - 50
						// option.yAxis.max = max ? max + 50 : max

						option.yAxis.interval = parseFloat(((option.yAxis.max + 0) / 2).toFixed())

					}



					seriesData.forEach(res => {
						option.series[0].data.push({
							value: res,
							itemStyle: {
								color: res >= this.water_target ? '#47B5FF' : '#DFF6FF'
							}

						})
					})
					// option.series[0].data.push(...seriesData)
				}



				console.log('option', option)
				console.log('this.$refs.chartBar', this.$refs.chartBar)
				setTimeout(() => {
					this.$refs.chartBar.init(echarts, (echart) => {
						echart.setOption(option)
					})
				}, 100)


			}
		}
	}
</script>

<style lang="scss" scoped>
	.tooltip {
		color: #fff;
		background-color: #333;
		padding: 10px;
	}

	.container {
		background: #f7f7f7;
		min-height: 100vh;
		padding-bottom: 100rpx;
		.u-dropdown-tw{
			::v-deep .u-dropdown {
				width: 300rpx !important;
			
			}
		}
		

		// ::v-deep .u-dropdown__menu{
		// 	background-color: #F3F3F3;
		// 	border-radius: 28rpx;
		// }
		.dropdown_mask {
			position: fixed;
			width: 100vw;
			height: 100vh;
			top: 0;
			left: 0;
			// background: #fff;
			opacity: 0;
			z-index: 3;
		}

		.slot-content {
			width: 100%;
			// height: 500rpx;
			background: #F3F3F3;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			z-index: 99999;

			>view {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex: none !important;
				font-size: 24rpx;
				padding: 12rpx;
			}

			.active {
				color: #00B8A2;
			}
		}

		.popup3 {
			.popup-text-view {
				text-align: center;
				color: #2a2a2a;
				font-size: 32rpx;
				font-weight: bold;
			}

			.popup-btn {
				display: flex;
				align-items: center;
				justify-content: center;

				::v-deep button {
					width: 192rpx;
					height: 60rpx;
					border-radius: 30rpx 30rpx 30rpx 30rpx;
					border: 1px solid #00B8A2;
					color: #00B8A2;

					&::after {
						border: 0;
					}
				}

				&-right {
					margin-left: 46rpx;

					::v-deep button {
						background: #00B8A2;
						color: #fff;
					}
				}
			}
		}

		.URINE_KETONE {
			width: 160rpx;
			background: #fff;
			border: 2px solid #F3F3F3;
			padding: 8rpx 0rpx;
			border-radius: 40rpx;
			font-size: 28rpx;
			display: flex;

			align-items: center;
		}

		.bodyTableLable {
			width: 642rpx;
			height: 72rpx;
			background: #F3F3F3;
			border-radius: 36rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			font-weight: bold;

			>view {
				flex: 1;
				text-align: center
			}
		}

		.font-button {
			width: 100vw;
			display: flex;
			position: fixed;
			bottom: 100rpx;
			justify-content: center;
			align-items: center;
		}

		.tooltip {
			display: flex;
			flex-direction: column;
			background-color: #00B8A2;
			font-size: 24rpx;
			color: #FFFFFF;
			align-items: center;
			justify-content: center;
			padding: 8rpx 16rpx;
			border-radius: 8rpx;
		}

		.content {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			padding: 24rpx 10rpx;

			.title {
				width: 100vw;
				padding-left: 32rpx;
				font-size: 32rpx;
				font-weight: bold;
			}

			.content-item {
				width: 100vw;
				padding: 32rpx;
				font-size: 28rpx;
				color: #C2C2C2;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #F3F3F3;

				&:last-child {
					border-bottom: none;
				}
			}

			.BMI {
				color: #FFF;
				padding: 8rpx 0;
				font-size: 24rpx;
				margin-left: 12rpx;
				border-radius: 24rpx;
				min-width: 160rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.time {
				min-width: 432rpx;
				min-height: 56rpx;
				background: #F3F3F3;
				border-radius: 36rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #2A2A2A;
			}

			.record_charts {
				width: 750upx;
				height: 500upx;
				background: #ffffff;

				.charts {
					width: 702upx;
					height: 500upx;
				}

				.charts-box {
					width: 702upx;
					height: 500upx;
					background-color: #ffffff;
				}
			}
		}

		.popup2 {
			position: fixed;
			z-index: 9999;
			width: 750rpx;
			min-height: 432rpx;
			background: #FFFFFF;
			padding: 24rpx 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-size: 28rpx;

			>view {
				width: 33%;
				display: flex;
				align-items: center;
				// justify-content: center;
				padding: 28rpx 0;
				padding-left: 70rpx;
			}

			image {
				width: 48rpx;
				height: 48rpx;
				margin-left: 8rpx;
			}
		}

		.mask {
			position: fixed;
			width: 100%;
			height: 100%;
			background: #000000;
			opacity: 0.6;
			z-index: 9998;
			top: 0rpx;
		}
	}
</style>