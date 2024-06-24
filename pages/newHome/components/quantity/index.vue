<template>
	<view class="quantity">
		<view class="calendar-tab">
			<view @click="active = index;getTabDay(item)" class="box" :class="{active:active === index}"
				v-for="(item,index) of tab" :key="index">
				<view>{{ item.date-item.num*dayTimeship | weekDay}}</view>
				<view>{{new Date(item.date-item.num*dayTimeship) | formatDate2}}</view>
			</view>
			<view class="box">
				<image @click="$refs.ren.getDateChar();show = true;" :src="`${imgUrl}kcal_icon_calender.png`"
					style="width:48rpx;height:48rpx"></image>
			</view>
		</view>
		<u-gap height="24"></u-gap>
		<view class="quantity-content " style="min-height: 0;">
			<view @click="_jump({url:'newHome/nutrition/nutritionSetting',data:{userId,allowDel}})" class="u-font-24"
				style="text-align:end;color: #00B8A2;">营养设定
				<u-icon color="#C2C2C2" name="arrow-right"></u-icon>
			</view>
			<view class="quantity-content-box">
				<view class="quantity-content-box-item u-m-b-40 u-m-t-60">
					<view class="u-font-28" style="color:#C2C2C2">饮食摄入</view>
					<l-echart style="width: 120rpx;height:120rpx;" ref="chart0"></l-echart>
					<!-- <text class="u-font-40 text-bold u-line-1"
						style="width: 240rpx;text-align: center;">{{ parseInt(Number(info.heat_amount_total))}}</text> -->
				</view>
				<view class="quantity-content-box-item u-relative u-flex-xy-center">

					<l-echart style="width: 224rpx;height:224rpx;" ref="chart1"></l-echart>

				</view>
				<view class="quantity-content-box-item u-m-b-40 u-m-t-60">
					<view class="u-font-28" style="color:#C2C2C2">运动消耗</view>
					<l-echart style="width: 120rpx;height:120rpx;" ref="chart2"></l-echart>
					<!-- <text class="u-font-40 text-bold u-line-1"
						style="width: 240rpx;text-align: center;">{{parseInt(Number(info.sports))}}</text> -->
				</view>
			</view>
			<view class="quantity-content-box">
				<view class="quantity-content-box-item">
					<view class="u-font-24 u-flex-between u-flex u-line-1" style="width: 90%;">
						<text>碳水化合物</text>
						<text :style="{color:setCarbohydrateToHeat(info)>100?'red':'#000' }" >{{setCarbohydrateToHeat(info) + '%'}}</text>
					</view>
					<view style="width: 90%;">
						<u-line-progress height="12" active-color="#A9A0FF" :show-percent="false"
							inactive-color="#F3F3F3" :percent="percentCW"></u-line-progress>
					</view>
					<view v-if="info.carbohydrate_total > -1" class="u-font-24 u-flex-between u-flex u-line-1"
						style="color:#C2C2C2;width: 90%;">
						<text :style="{color:setCarbohydrate(info)>100?'red':'#C2C2C2'}">{{(info.carbohydrate_total | filterNumParseInt)+' g'}}</text>
						<text>{{parseInt(info.set && info.set.carbohydrate || 0) + ' g'}}</text>
					</view>
					<view v-else class="u-font-24 u-flex-between u-flex u-line-1" style="color:#C2C2C2;width: 90%;">
						<text>{{0+' g'}}</text>
						<text>{{0 +' g'}}</text>
					</view>

				</view>
				<view class="quantity-content-box-item">

					<view class="u-font-24 u-flex-between u-flex" style="width: 90%;">
						<text>蛋白质</text>
						<text :style="{color:setProteinToHeat(info)>100?'red':'#000'}">{{setProteinToHeat(info) + '%'}}</text>
					</view>
					<view style="width: 90%;">
						<u-line-progress height="12" active-color="#FFAA8E" :show-percent="false"
							inactive-color="#F3F3F3" :percent="percentProtein"></u-line-progress>
					</view>
					
					<view v-if="info.protein_total > -1" class="u-font-24 u-flex-between u-flex u-line-1"
						style="color:#C2C2C2;width: 90%;">
						<text :style="{color:setProtein(info)>100?'red':'#C2C2C2'}">{{(info.protein_total | filterNumParseInt)+' g'}}</text>
						<text>{{parseInt(info.set && info.set.protein || 0) + ' g'}}</text>
					</view>
					<view v-else class="u-font-24 u-flex-between u-flex u-line-1" style="color:#C2C2C2;width: 90%;">
						<text>{{0+' g'}}</text>
						<text>{{0 +' g'}}</text>
					</view>

				</view>
				<view class="quantity-content-box-item">
					<view class="u-font-24 u-flex-between u-flex" style="width: 90%;">
						<text>脂肪</text>
						<text :style="{color:setFat(setFatToHeat)>100?'red':'#000'}">{{setFatToHeat(info) + '%'}}</text>
					</view>
					<view style="width: 90%;">
						<u-line-progress height="12" :show-percent="false" active-color="#FFD06A"
							inactive-color="#F3F3F3" :percent="percentFat"></u-line-progress>
					</view>
					<view v-if="info.fat_total > -1" class="u-font-24 u-flex-between u-flex u-line-1"
						style="color:#C2C2C2;width: 90%;">
						<text :style="{color:setFat(info)>100?'red':'#C2C2C2'}">{{(info.fat_total | filterNumParseInt)+' g'}}</text>
						<text>{{parseInt(info.set && info.set.fat || 0) + ' g'}}</text>
					</view>
					<view v-else class="u-font-24 u-flex-between u-flex u-line-1" style="color:#C2C2C2;width: 90%;">
						<text>{{0+' g'}}</text>
						<text>{{0 +' g'}}</text>
					</view>
				</view>
			</view>
		</view>

		<block v-if="!showMealList">
			<u-gap bg-color="#f7f7f7" height="24"></u-gap>
			<view class="u-flex u-flex-items-center u-flex-around"
				style="font-weight: bold;font-size: 80rpx;background-color: #fff;padding: 18rpx 0;">
				<view class="u-flex u-flex-items-center">
					<text :style="{'color':mealType===2?'#FFAA8E':'#00B8A2'}">{{hour | setClass}}</text>
					<view style="color:#E7E7E7;font-size: 68rpx;margin: 0 22rpx 12rpx 22rpx;">:</view>
					<text :style="{'color':mealType===2?'#FFAA8E':'#00B8A2'}">{{minute | setClass}}</text>
					<view style="color:#E7E7E7;font-size: 68rpx;margin: 0 22rpx 12rpx 22rpx;">:</view>
					<text :style="{'color':mealType===2?'#FFAA8E':'#00B8A2'}">{{second | setClass}}</text>
				</view>
				<my-button v-if="mealType === 3"
					@click="$refs.meal.open({startTime,endTime,activeDate,mealId,delAddTime:false,timer,hour,minute,second})"
					borderRadius="40rpx" color="#00B8A2" bg="#fff" fontWeight="400" fontSize="24rpx" height="48"
					width="148">用餐详情</my-button>
				<my-button v-if="mealType === 1" @click="$refs.meal.open({activeDate})" borderRadius="40rpx"
					color="#00B8A2" bg="#fff" fontWeight="400" fontSize="24rpx" height="48" width="148">开始用餐</my-button>
				<my-button v-if="mealType === 2"
					@click="$refs.meal.open({startTime,endTime,activeDate,mealId,delAddTime:false,timer,hour,minute,second})"
					color="#FFAA8E" bg="#fff" borderRadius="40rpx" fontWeight="400" fontSize="24rpx" height="48"
					width="148">结束用餐</my-button>
			</view>
			<u-gap bg-color="#f7f7f7" height="24"></u-gap>
		</block>
		<u-gap v-if="showMealList" bg-color="#f7f7f7" height="24"></u-gap>
		<view class="quantity-content " style="background: #F8F8F8;padding:0">

			<view v-if="showMealList" >
			
				<view v-for="(item,index) of mealList.filter(v=>v.list.length) " class="u-p-32 " style="background: #fff;border-radius: 24rpx;position: relative;" :key="index">
					<view v-if="item.list.length" class="u-font-24 u-m-b-16 u-flex u-flex-y-center">
						<text class="u-font-32 text-bold u-m-r-8">{{item.name}}</text>
						<text style="color:#C2C2C2;flex:1"> <text
								v-if="item.suggest">建议小于{{(item.suggest | filterNumParseInt)}} kcal</text> </text>
						<text :style="{color:suggestColor(item)}"
						>{{(item.heat_amount | filterNumParseInt)+ ' kcal'}} </text>
					</view>
					<view @click="record(v)" @longpress="clickInfo(v)" class="u-flex u-flex-items-stretch  u-p-b-24"
						v-for="(v,i) of item.list " :key="i">
						
						<u-gap  bg-color="#f7f7f7" height="24" style="position: absolute;top: -24rpx;width: 750rpx;left: 0"></u-gap>
						<block v-if="!v.targetable">
							<view class="u-flex-1 u-flex">

								<u-image :border-radius="8" style="margin-right: 8rpx;" :src="`${imgUrl}v3_upload.png`"
									shape="circle" width="48" height="48"></u-image>
								<u-image :border-radius="8" :src="c" v-for=" (c,imgi) of  v.images" :key="imgi"
									style="margin:0 4rpx" width="88" height="88"></u-image>
							</view>
							<view class="u-flex-xy-center u-font-24" style="color:#C2C2C2">
								{{(v.heat_amount | filterNumParseInt) + ' kcal'}}
							</view>
						</block>
						<block v-else>
							<u-image :border-radius="8" :src="v.images[0]" width="88" height="88"></u-image>
							<view class="u-m-l-8 u-flex-column u-flex-1 u-flex-between">
								<view class="u-font-28 text-bold u-line-1" style="width: 80%;">{{v.title}}</view>
								<view class="u-font-24" style="color:#C2C2C2">{{v.g +( v.name !=='运动'?' g':' min')}}
								</view>

							</view>
							<view class="u-flex-xy-center u-font-24" style="color:#C2C2C2">
								{{(v.heat_amount | filterNumParseInt)+ ' kcal'}}
							</view>
						</block>

					</view>
				</view>

			</view>
			<block v-if="showMealList">
				<u-gap bg-color="#f7f7f7" height="24"></u-gap>
				<view class="u-flex u-flex-items-center u-flex-around"
					style="font-weight: bold;font-size: 80rpx;background-color: #fff;padding: 18rpx 0;">
					<view class="u-flex u-flex-items-center">
						<text :style="{'color':mealType===2?'#FFAA8E':'#00B8A2'}">{{hour | setClass}}</text>
						<view style="color:#E7E7E7;font-size: 68rpx;margin: 0 22rpx 12rpx 22rpx;">:</view>
						<text :style="{'color':mealType===2?'#FFAA8E':'#00B8A2'}">{{minute | setClass}}</text>
						<view style="color:#E7E7E7;font-size: 68rpx;margin: 0 22rpx 12rpx 22rpx;">:</view>
						<text :style="{'color':mealType===2?'#FFAA8E':'#00B8A2'}">{{second | setClass}}</text>
					</view>
					<my-button v-if="mealType === 3"
						@click="$refs.meal.open({startTime,endTime,activeDate,mealId,delAddTime:false,timer,hour,minute,second})"
						borderRadius="40rpx" color="#00B8A2" bg="#fff" fontWeight="400" fontSize="24rpx" height="48"
						width="148">用餐详情</my-button>
					<my-button v-if="mealType === 1" @click="$refs.meal.open({activeDate})" borderRadius="40rpx"
						color="#00B8A2" bg="#fff" fontWeight="400" fontSize="24rpx" height="48"
						width="148">开始用餐</my-button>
					<my-button v-if="mealType === 2"
						@click="$refs.meal.open({startTime,endTime,activeDate,mealId,delAddTime:false,timer,hour,minute,second})"
						color="#FFAA8E" bg="#fff" borderRadius="40rpx" fontWeight="400" fontSize="24rpx" height="48"
						width="148">结束用餐</my-button>
				</view>
			</block>
			<view v-else-if="!loading" class="u-flex-column u-flex-items-center u-font-28"
				style="color:#C2C2C2;margin: 96rpx 0;">
				<image :src="`${imgUrl}kcal_blankpage.png`" style="width: 200rpx;height: 200rpx;"></image>
				<view>暂时没有热量记录</view>
				<view>请点击下方按钮进行添加</view>
			</view>
			<!-- <view v-else class="u-skeleton" >
				<view class="u-skeleton-fillet" style="width: 94vw;height: 280rpx;margin: 96rpx 0;"></view>
			</view> -->
		</view>
		<view class="quantity-fixed safe-area-inset-bottom">
			<view @click="addMeal(item)" class="quantity-fixed-box" :class="'quantity-fixed-box'+index"
				v-for="(item,index) of bottomList" :key="index">
				<image :src="item.url" style="width: 48rpx;height: 48rpx;"></image>
				<view class="u-font-20">{{item.name}}</view>
			</view>
		</view>
		<!-- 日历 -->
		<ren-calendar :userId="userId" @submit="submit" :tips="tips" @close="show = false;" ref='ren' v-model="show"
			:markDays='markDays' disabledAfter headerBar @onDayClick='onDayClick'></ren-calendar>
		<!-- 加餐详情 -->
		<meal-popup :name="name" @submitSunFood="submitSunFood" @submit="mealSubmit" ref="mealPopup"></meal-popup>
		<!-- 加餐的盒子 -->
		<view class="addMeal_box" :style="{bottom:mealClass.bottom,left:mealClass.left}" v-if="addMealshow">
			<view
				@click='_jump({url:`newHome/nutrition/addFood?name=${item.name+"加餐"}&activeDate=${activeDate}&userId=${userId}`})'
				v-for="(item,index) of addMealList" :key="index">
				<image :src="`${imgUrl+item.src}`" mode="widthFix"></image>
				<text>{{item.name+'加餐'}}</text>
			</view>
			<view class="triangle"></view>
		</view>
		<!-- </scroll-view> -->
		<u-popup class="popup3" v-model="delshow" mode="center" width="590rpx" height="248rpx" border-radius="12">

			<view class="popup-text-view" style="padding: 48rpx">确定删除此打卡记录？</view>
			<view class="popup-btn">
				<u-button @click="
		        () => {
		          delshow = false
		        }
		      ">取消</u-button>
				<u-button @click="confirmBtn" plain class="popup-btn-right">确认</u-button>
			</view>
		</u-popup>
		<meal :userId="userId" @submit="getTargetTimer" ref="meal"></meal>
		<view v-if="addMealshow" @click="addMealshow = false" class="mask1"></view>
		<!-- <u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton> -->
	</view>
</template>

<script>
	import RenCalendar from './ren-calendar/ren-calendar.vue'
	import mealPopup from './mealpopup/mealpopup.vue'
	import meal from '@/components/meal.vue'
	import myButton from '@/components/myButton'
	const nowDateTimeship = new Date().getTime()
	const imgUrl = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/'
	import * as echarts from '@/utils/echarts.min.js'
	export default {
		name: 'quantity',
		props: {
			userId: {
				type: Number | String,
				default: ''
			},
			allowDel: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				obj: {},
				mealId: '',
				startTime: '',
				endTime: '',
				mealType: 1,
				setTimer: null,
				timer: 0,
				targetTimer: 0,
				hour: '00',
				minute: '00',
				second: '00',
				loading: true,
				itemid: '',
				delshow: false,
				name: '',
				sport_total_kcal: 0,
				tip: '还可摄入',
				taggetItem: {}, //修改的数据对象
				percentColor: '#00B8A2',

				page: 1,

				length: null,

				activeDate: '', //切换的日历
				mealClass: {}, //样式
				info: {
					heat_amount_total: 0,
					sports: 0

				}, //热量主页数据
				addMealList: [{
					name: '早餐',
					src: 'snack_icon_moring.png'
				}, {
					name: '午餐',
					src: 'snack_icon_afternoon.png'
				}, {
					name: '晚餐',
					src: 'snack_icon_evening.png'
				}, ],
				addMealshow: false, //加餐盒子弹框


				oldList: [], //构造前打卡数据
				mealList: [{
						name: '早餐',
						suggest: 0,
						heat_amount: 0,
						list: [],
					}, {
						name: '早餐加餐',
						suggest: '',
						heat_amount: 0,
						list: [],
					}, {
						name: '午餐',
						suggest: 0,
						heat_amount: 0,
						list: [],
					}, {
						name: '午餐加餐',
						suggest: '',
						heat_amount: 0,
						list: [],
					}, {
						name: '晚餐',
						suggest: 0,
						heat_amount: 0,
						list: [],
					}, {
						name: '晚餐加餐',
						suggest: '',
						heat_amount: 0,
						list: [],
					},
					{
						name: '运动',
						suggest: '',
						heat_amount: 0,
						list: [],
					}
				], //构造后打卡数据
				percentAll: 0, //今日摄入
				percentProtein: 0, //碳水
				percentCW: 0, //蛋白质
				percentFat: 0, //脂肪
				imgUrl,
				bottomList: [{
					url: imgUrl + 'tab_icon_breakfast.png',
					name: '早餐'
				}, {
					url: imgUrl + 'tab_icon_lunch.png',
					name: '午餐'
				}, {
					url: imgUrl + 'tab_icon_dinner.png',
					name: '晚餐'
				}, {
					url: imgUrl + 'tab_icon_snack.png',
					name: '加餐'
				}, {
					url: imgUrl + 'tab_icon_sport.png',
					name: '运动'
				}, ],
				tips: [{
					name: '吃多了',
					color: '#FF7569'
				}, {
					name: '正好',
					color: '#00B8A2'
				}, {
					name: '吃少了',
					color: '#FFC76B'
				}, ],
				show: false,
				curDate: '',
				markDays: [],
				tabNum: 4,
				dayTimeship: 24 * 60 * 60 * 1000,
				tab: [{
					date: nowDateTimeship,
					num: 4,
				}, {
					date: nowDateTimeship,
					num: 3,
				}, {
					date: nowDateTimeship,
					num: 2,
				}, {
					date: nowDateTimeship,
					num: 1,
				}, {
					date: nowDateTimeship,
					num: 0,
				}, ],
				active: 4
			}
		},
		filters: {
			setClass(num) {
				let str = num.toString()
				let arr = str.split('')
				let newVal = arr[0] + ' ' + arr[1]
				// console.log('arr',arr)
				return newVal
			}
		},
		watch: {
			// sport_total_kcal(newValue, oldValue) {

			// 	this.mealList[6].heat_amount = parseFloat(newValue.toFixed(2))
			// }
		},
		computed: {
			suggestColor(){
				return function(val) {
					let flag = '#000'
					if(val.suggest && val.heat_amount >val.suggest){
						flag = 'red'
					}
					// console.log('flagflag: ', val)
					// if (val.carbohydrate_total > -1) {
					// 	flag = parseInt((val.carbohydrate_total * 4/ (val.heat_amount_total || 0) * 100).toFixed(0) ) 
					// }
					return flag
				}
			},
			showMealList() {
				return this.mealList.filter(v => v.list.length).length
			},
			setFontColor(){
				return function(val){
					const {} = val
				}
			},
			setCarbohydrateToHeat() {
				return function(val) {
					let flag = 0
					
					if (val.carbohydrate_total > -1 && val.heat_amount_total) {
						flag = parseInt((val.carbohydrate_total * 4/ (val.heat_amount_total) * 100).toFixed(0) ) 
					}
					return flag
				}
			
			},
			setProteinToHeat() {
				return function(val) {
					let flag = 0
					if (val.protein_total > -1  && val.heat_amount_total) {
						flag =parseInt((val.protein_total * 4/ (val.heat_amount_total) * 100).toFixed(0))  
					}
					return flag
			
				}
			
			},
			setFatToHeat() {
				return function(val) {
					let flag = 0
					if (val.fat_total > -1  && val.heat_amount_total) {
						flag = parseInt((val.fat_total* 9 / (val.heat_amount_total) * 100).toFixed(0)) 
					}
					return flag
				}
			
			},
			setCarbohydrate() {
				return function(val) {
					let flag = 0
					
					if (val.carbohydrate_total > -1  && val.set?.carbohydrate) {
						flag =parseInt((val.carbohydrate_total/ (val.set?.carbohydrate) * 100).toFixed(0)) 
					}
					return flag
				}

			},
			setProtein() {
				return function(val) {
					let flag = 0
					if (val.protein_total > -1  && val.set?.protein) {
						flag = parseInt((val.protein_total/ (val.set?.protein) * 100).toFixed(0)) 
					}
					return flag

				}

			},
			setFat() {
				return function(val) {
					let flag = 0
					if (val.fat_total > -1  && val.set?.fat) {
						flag = parseInt((val.fat_total / (val.set?.fat) * 100).toFixed(0)) 
					}
					return flag
				}

			},
		},
		onReady() {
			let today = this.$refs.ren.getToday().date;
			this.curDate = today;
		},
		destroyed() {
			clearInterval(this.setTimer)
		},
		onHide() {

			clearInterval(this.setTimer)
		},
		onUnload() {

			clearInterval(this.setTimer)
		},
		async mounted() {
			console.log('this.userId', this.userId)
			// this.activeDate = this.$common.formatDate(new Date(),false) 

			// await this.getData()
			// this.getList()
			// uni.createSelectorQuery().in(this).select('.quantity-fixed-box3').boundingClientRect(res=>{
			// 	console.log('加餐的盒子',res)
			// 	console.log('this.$u.sys()',this.$u.sys())
			// 	let iosbottom = this.$u.sys()?.safeAreaInsets?.bottom || 0
			// 	this.mealClass = {
			// 		bottom:res.height + 10 +iosbottom+ 'px',
			// 		left:res.left - uni.upx2px(139) + 'px',
			// 	}
			// }).exec()
		},
		components: {
			RenCalendar,
			mealPopup,
			meal,
			myButton
		},
		methods: {
			addTime() {

				uni.showLoading({
					title: '加载中',
					mask: true
				})

				if (this.setTimer) clearInterval(this.setTimer)
				this.setTimer = setInterval(() => {

					uni.hideLoading();
					this.timer++

					//执行到这里已经是正在用餐了
					this.mealType = 2
					this.formatTime(this.timer)
					if (this.timer >= this.targetTimer) {
						//执行到这里已经结束用餐了
						this.timer = this.targetTimer - 1
						this.formatTime(this.timer + 1)
						this.mealType = 3
						clearInterval(this.setTimer)
					}
					if (this.$refs.meal) {
						this.$refs.meal.setDefault({
							timer: this.timer,
							hour: this.hour,
							minute: this.minute,
							second: this.second,
						})
					}
				}, 1000)
			},
			formatTime(time) {
				// 将时间格式化为 hh:mm:ss 的形式
				let hour = Math.floor(time / 3600);
				let minute = Math.floor((time - hour * 3600) / 60);
				let second = Math.floor(time - hour * 3600 - minute * 60);
				this.hour = hour.toString().padStart(2, '0')
				this.minute = minute.toString().padStart(2, '0')
				this.second = second.toString().padStart(2, '0')
				// console.log('aa',this.second)
				// return `${hour.toString().padStart(2, '0')}:${minute
				//         .toString()
				//         .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
			},
			getTargetTimer(val) {

				this.getMealData()
			},
			setOptionPie() {

				const option0 = {
					legend: {
						top: '5%',
						left: 'center'
					},
					graphic: [ {
						type: 'text',
						left: 'center',
						top: uni.upx2px(45),
						style: {
							text:parseInt(Number(this.info.heat_amount_total)).toString().slice(0,4),
							textAlign: 'start',
							fill: '#2A2A2A',
							fontSize: uni.upx2px(28),
							width:uni.upx2px(90),
							overflow:'truncate',
							fontWeight:'bold',
							color: "#2A2A2A",
						}
					}],
					series: [{
						name: 'Access From',
						type: 'pie',
						radius: ['72%', '92%'],
						itemStyle: {
							
							
						},
						labelLine: {
							show: false
						},
						data: [
							{
									value:this.setCarbohydrateToHeat(this.info),
									itemStyle: {
										normal: {
											color:this.setCarbohydrateToHeat(this.info)? '#A9A0FF':'#F3F3F3',
											label: {
												normal: {
													show: true
												}
											}
										}
									}
								},
								{
									value:this.setProteinToHeat(this.info),
									itemStyle: {
										normal: {
											color:this.setProteinToHeat(this.info)? '#FFAA8E':'#F3F3F3',
											label: {
												normal: {
													show: true
												}
											}
										}
									}
								},
								{
									value:this.setFatToHeat(this.info),
									itemStyle: {
										normal: {
											color:this.setFatToHeat(this.info)? '#FFD06A':'#F3F3F3',
											label: {
												normal: {
													show: true
												}
											}
										}
									}
								}

						]
					}]
				}
				const option1 = {
					legend: {
						top: '5%',
						left: 'center'
					},
					color: [this.percentColor, '#F3F3F3'],
					graphic: [{ //环形图中间添加文字
						type: 'text', //通过不同top值可以设置上下显示
						left: 'center',
						top: uni.upx2px(54),
						style: {
							text: this.tip,
							textAlign: 'center',
							fill: '#C2C2C2', //文字的颜色
							fontSize: uni.upx2px(28),
							color: "#C2C2C2",
						}
					}, {
						type: 'text',
						left: uni.upx2px(32),
						top: uni.upx2px(92),
						style: {
							text: parseInt(Math.abs(this.info.heat_amount_total - this.info.sports - this
								.info.set?.heat_kcal || 0).toFixed(0)) || '--',
				
							fill: '#2A2A2A',
							width: uni.upx2px(160),
							textAlign: 'center',
							overflow: 'truncate',
							fontSize: uni.upx2px(40),
							fontWeight: 'bold',
							color: "#2A2A2A",
						}
					}, {
						type: 'text',
						left: 'center',
						top: uni.upx2px(148),
						style: {
							text: 'kcal',
							textAlign: 'center',
							fill: '#C2C2C2',
							fontSize: uni.upx2px(28),
							color: "#C2C2C2",
						}
					}],
					series: [{
						name: 'Access From',
						type: 'pie',
						radius: ['80%', '92%'],
						itemStyle: {
							borderRadius: uni.upx2px(28),
							borderColor: '#fff',
							borderWidth: 1
						},
						labelLine: {
							show: false
						},
						data: [{
								value: Number(this.percentAll)
							},
							{
								value: 100 - Number(this.percentAll)
							},
				
						]
					}]
				}
				const option2 = {
					legend: {
						top: '5%',
						left: 'center'
					},
					color: ['#fafafa'],
					graphic: [ {
						type: 'text',
						left: 'center',
						top: uni.upx2px(45),
						style: {
							text: parseInt(Number(this.info.sports)).toString().slice(0,4),
							textAlign: 'start',
							fill: '#2A2A2A',
							fontSize: uni.upx2px(28),
							width:uni.upx2px(90),
							overflow:'truncate',
							fontWeight:'bold',
							color: "#2A2A2A",
						}
					}],
					series: [{
						name: 'Access From',
						type: 'pie',
						radius: ['72%', '92%'],
						
						itemStyle: {
							
							
						},
						labelLine: {
							show: false
						},
						data: [
							{
								value:0,
								itemStyle: {
									normal: {
										color:'#F3F3F3',
										label: {
											normal: {
												show: true
											}
										}
									}
								}
							},
							{
								value:0,
								itemStyle: {
									normal: {
										color:'#F3F3F3',
										label: {
											normal: {
												show: true
											}
										}
									}
								}
							}
						]
					}]
				}
				
				console.log('this.$refs.chart', this.$refs.chart1)
				this.$refs.chart0.init(echarts, (echart) => {
					echart.setOption(option0)
				})
				this.$refs.chart1.init(echarts, (echart) => {
					echart.setOption(option1)
				})
				this.$refs.chart2.init(echarts, (echart) => {
					echart.setOption(option2)
				})
			},
			confirmBtn() {
				console.log(1111, this.name)
				// if(this.name !== '运动'){
				// 	this.name = ''

				// }else{
				// 	this.name = '运动'
				// }
				let url = this.name === '运动' ? '/ApiV3/Mobile/SportDiart/del' : '/ApiV3/Mobile/HeatDiary/del'
				let data = {
					id: this.itemid
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url,
					loading: true,
					data
				}).then(({
					data
				}) => {
					this.$common.toast('删除成功')
					this.delshow = false
					this.upload()
				})
			},
			clickInfo(item) {
				console.log(item)
				if (!this.allowDel) return
				this.name = item.name
				this.itemid = item.id
				this.delshow = true

			},

			setTotal(val) {

				return parseFloat(Math.abs(val.heat_amount_total - val.sports - val.set?.heat_kcal || 0).toFixed(2)) || 0

			},
			async upload(userId) { //返回刷新数据
				this.page = 1

				// this.activeDate = this.$common.formatDate(new Date(),false)
				if (userId) this.userId = userId
				if (!this.activeDate) this.activeDate = this.$common.formatDate(new Date(), false)
				console.log('this.activeDate', this.activeDate)
				this.mealList = this.$options.data.call(this).mealList
				await this.getData()
				this.setTotal(this.info)
				this.getMealData()

				this.getList() //饮食

				if (!this.mealClass.bottom) {
					uni.createSelectorQuery().in(this).select('.quantity-fixed-box3').boundingClientRect(res => {
						console.log('加餐的盒子', res)
						console.log('this.$u.sys()', this.$u.sys())
						let iosbottom = this.$u.sys()?.safeAreaInsets?.bottom || 0
						this.mealClass = {
							bottom: res.height + 10 + iosbottom + 'px',
							left: res.left - uni.upx2px(139) + 'px',
						}
					}).exec()
				}

			},
			setReachBottom() { //滚动到底部
				console.log('滚动到底部')

				if (this.length) {
					this.page++
					this.getList()
				}
			},
			async getTabDay(item) { //切换日期
				let val = new Date(item.date - item.num * this.dayTimeship)
				this.activeDate = this.$common.formatDate(val, false)
				this.page = 1
				this.mealList = this.$options.data.call(this).mealList
				await this.getData()
				this.getMealData()

				this.getList() //饮食

				console.log(this.activeDate)
			},

			async record(item) { //1.快捷上传的数据跳回快捷上传页面修改
				if (!this.allowDel) return


				if (!item.targetable) {
					uni.navigateTo({
						url: '/pages/newHome/nutrition/addCustomFood?obj=' +
							encodeURIComponent(JSON.stringify({
								id: item.id
							})) + '&userId=' + this.userId
					})
				} else {
					console.log(item)
					if (item.name !== '运动') {
						this.name = ''
						let allowUpload = item.sub_foods && item.sub_foods.length //allowUpload 分区有没有子食材
						// this.$refs['u-circle-progress'].getQuery()

						this.taggetItem = {
							...item
						}

						await this.$nextTick()
						this.$refs.mealPopup.open(item, true, allowUpload)
					} else {
						this.name = '运动'
						this.taggetItem = {
							...item
						}
						// this.recordObj.title = item.targetable?.title
						// this.recordObj.thumb = item.targetable?.thumb
						// this.recordObj.kcal = item.targetable?.kcal
						// this.recordObj.sportVal = item.targetable?.total_kcal
						await this.$nextTick()
						this.$refs.mealPopup.open(item, true) // true 修改
					}

				}



			},
			addMeal(item) {
				console.log('this.allowDel: ', this.allowDel)
				if (!this.allowDel) return this.$common.toast('不是服务营养师没有操作权限')

				console.log('添加食物', item)
				if (item.name === '加餐') {
					this.addMealshow = !this.addMealshow
				} else {
					this._jump({
						url: `newHome/nutrition/addFood?name=${item.name}&activeDate=${this.activeDate}&userId=${this.userId}`
					})
				}

			},
			getData() {
				return new Promise((resolve, reject) => {
					let data = {
						date: this.activeDate + ' 00:00:00'
					}
					if (this.userId) data.user_id = this.userId

					this.$request({ //主页数据
						url: '/ApiV3/Mobile/HeatDiary/index',
						method: 'get',
						data
					}).then(({
						data
					}) => {
						console.log(1111, data)
						this.info = data

						this.percentAll = parseFloat((data.heat_amount_total) / ((data.set.heat_kcal + data
							.sports) || 1)) * 100
						this.percentCW = parseFloat(data.carbohydrate_total / (data.set.carbohydrate ||
							1)) * 100
						this.percentProtein = parseFloat(data.protein_total / (data.set.protein || 1)) *
							100
						this.percentFat = parseFloat(data.fat_total / (data.set.fat || 1)) * 100
						if (this.percentAll >= 100) {
							this.tip = '吃多了'
							this.percentColor = '#FF7569'
						} else {
							this.tip = '还可摄入'
							this.percentColor = '#00B8A2'
						}
						console.log('this.percentAll', this.percentAll)
						console.log('this.percentCW', this.percentCW)
						console.log('this.percentProtein', this.percentProtein)
						console.log('this.percentFat', this.percentFat)
						if (this.info?.set?.meals_breakfast) {
							this.mealList[0].suggest = this.info.set.meals_breakfast
						}
						if (this.info?.set?.meals_lunch) {
							this.mealList[2].suggest = this.info.set.meals_lunch
						}
						if (this.info?.set?.meals_dinner) {
							this.mealList[4].suggest = this.info.set.meals_dinner
						}

						this.setOptionPie()
						resolve()


					})
				})

			},
			getCarList() { //运动打卡记录



				return new Promise((resolve, reject) => {
					let data = {
						date: this.activeDate + ' 00:00:00',
						page: 1,
						lengthNum: 15
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/SportDiart/records',
						method: 'get',
						data
					}).then(({
						data
					}) => {
						data.list.forEach(v => {
							v.name = '运动'
							v.images = [v.targetable.thumb]
							v.title = v.targetable.title
							v.g = v.minute
							v.heat_amount = v.total_kcal
							v.kcal = v.targetable.kcal
						})
						this.mealList[6].list = data.list
						this.mealList[6].heat_amount = data.total_kcal

						// resolve(data.list)

						// this.sport_total_kcal = data.total_kcal
					}).catch(err => {

						this.loading = false
					})
				})

			},
			getMealData() {
				this.resetAddTime()
				let data = {
					date: this.activeDate

				}
				if (this.userId) data.user_id = this.userId
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
						let startTimeStamp = new Date(this.startTime).getTime()
						let endTimeStamp = this.endTime ? new Date(this.endTime).getTime() : new Date().getTime()
						let nowTime = new Date().getTime()
						if (nowTime > startTimeStamp && nowTime < endTimeStamp) {
							this.timer = (nowTime - startTimeStamp) / 1000

						} else if (nowTime >= endTimeStamp) {
							this.timer = (endTimeStamp - startTimeStamp) / 1000 //秒

						}
						console.log('此刻的startTimeStamp', startTimeStamp)
						console.log('此刻的endTimeStamp', endTimeStamp)
						console.log('此刻的nowTime', nowTime)
						console.log('此刻的timer', this.timer)
						if (this.endTime) {
							this.targetTimer = (endTimeStamp - startTimeStamp) / 1000
							if (this.targetTimer >= 360000) this.targetTimer = 360000 - 1
						} else {
							this.targetTimer = 360000 - 1
						}
						// this.targetTimer = (endTimeStamp - startTimeStamp) /1000 >=360000?360000:(endTimeStamp - startTimeStamp) /1000
						console.log('此刻的this.targetTimer', this.targetTimer)
						this.addTime()

					}



				})

			},
			resetAddTime() {
				if (this.setTimer) clearInterval(this.setTimer)
				this.timer = 0
				this.targetTimer = 0
				this.hour = '00'
				this.minute = '00'
				this.second = '00'
			},
			getList() { //打卡记录列表
				let data = {
					date: this.activeDate + ' 00:00:00',
					page: this.page,
					lengthNum: 15
				}
				// this.mealList = []

				this.loading = true
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: '/ApiV3/Mobile/HeatDiary/record',
					method: 'get',
					data
				}).then(async ({
					data
				}) => {
					//把运动排到最后
					if (!data.next_page_url) {
						this.getCarList()
					}


					this.loading = false
					if (data.data.length) {

						// this.mealList = [{
						// 		name: '早餐',
						// 		suggest: this.info?.set?.meals_breakfast,
						// 		heat_amount: 0,
						// 		list: [],
						// 	}, {
						// 		name: '早餐加餐',
						// 		suggest: '',
						// 		heat_amount: 0,
						// 		list: [],
						// 	}, {
						// 		name: '午餐',
						// 		suggest: this.info?.set?.meals_lunch,
						// 		heat_amount: 0,
						// 		list: [],
						// 	}, {
						// 		name: '午餐加餐',
						// 		suggest: '',
						// 		heat_amount: 0,
						// 		list: [],
						// 	}, {
						// 		name: '晚餐',
						// 		suggest: this.info?.set?.meals_dinner,
						// 		heat_amount: 0,
						// 		list: [],
						// 	}, {
						// 		name: '晚餐加餐',
						// 		suggest: '',
						// 		heat_amount: 0,
						// 		list: [],
						// 	},
						// 	{
						// 		name: '运动',
						// 		suggest: '',
						// 		heat_amount: parseFloat(this.sport_total_kcal.toFixed(2)),
						// 		list: sportArr,
						// 	},
						// ]


						this.setMealListBuild(data.data)
					}
					// else if (!data.data.length && sportArr.length) {
					// 	this.mealList = [{
					// 		name: '运动',
					// 		suggest: '',
					// 		heat_amount: parseFloat(this.sport_total_kcal.toFixed(2)),
					// 		list: sportArr,
					// 	}, ]
					// } else {
					// 	this.mealList = []
					// }

					this.length = data.next_page_url
					console.log('this.mealList', this.mealList)
					console.log('this.showMealList', this.showMealList)
				}).catch(() => {
					this.loading = false
				})
			},
			setMealListBuild(val) { //构造打卡列表数据
				return val.map(res => {
					if (res.meals === 1) {
						this.mealList[0].list.push(res)
						this.mealList[0].heat_amount += res.heat_amount
						this.mealList[0].heat_amount = parseFloat((this.mealList[0].heat_amount).toFixed(2))
					}
					if (res.meals === 2) {
						this.mealList[1].list.push(res)
						this.mealList[1].heat_amount += res.heat_amount
						this.mealList[1].heat_amount = parseFloat((this.mealList[1].heat_amount).toFixed(2))
					}
					if (res.meals === 3) {
						this.mealList[2].list.push(res)
						this.mealList[2].heat_amount += res.heat_amount
						this.mealList[2].heat_amount = parseFloat((this.mealList[2].heat_amount).toFixed(2))
					}
					if (res.meals === 4) {
						this.mealList[3].list.push(res)
						this.mealList[3].heat_amount += res.heat_amount
						this.mealList[3].heat_amount = parseFloat((this.mealList[3].heat_amount).toFixed(2))
					}
					if (res.meals === 5) {
						this.mealList[4].list.push(res)
						this.mealList[4].heat_amount += res.heat_amount
						this.mealList[4].heat_amount = parseFloat((this.mealList[4].heat_amount).toFixed(2))
					}
					if (res.meals === 6) {
						this.mealList[5].list.push(res)
						this.mealList[5].heat_amount += res.heat_amount
						this.mealList[5].heat_amount = parseFloat((this.mealList[5].heat_amount).toFixed(2))
					}
				})
			},
			submit() {
				this.show = false
				console.log(this.curDate)
				this.tab.forEach((res, index) => {
					res.date = new Date(this.curDate).getTime()
					res.num = this.tabNum - index - 2
				})
				this.active = 2
				this.upload()
			},
			submitSunFood(obj) {

				let data = {
					id: obj.id, //修改  特别注意这个是记录id
					type: 'SELF', //子食材都默认self
					food_id: obj.targetable.id, //修改  特别注意这个才是食物id
					g: obj.g,
					date: this.activeDate + ' 00:00:00',
					meals: obj.meals,
					carbohydrate: this.setSub_foods('carbohydrate',obj.sub_foods),//obj.carbohydrate
					protein: this.setSub_foods('protein',obj.sub_foods),//obj.protein,
					fat: this.setSub_foods('fat',obj.sub_foods),//obj.fat,
					heat_amount: obj.heat_amount,
					sub_foods: obj.sub_foods
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: '/ApiV3/Mobile/HeatDiary/save',
					loading: true,
					data
				}).then(res => {
					this.$common.toast('修改成功')
					this.upload()
				})
			},
			setSub_foods(name,item = []){
				let total = 0
				item.forEach(res=>{
					 total += res[name] * res.g / 100
				})
				return parseFloat(total.toFixed(2))
			},
			mealSubmit(val) {
				if (this.taggetItem.name === '运动') {
					let data = {
						id: this.taggetItem.id, //新增
						type: this.taggetItem.targetable.type,
						minute: val,
						date: this.activeDate + ' 00:00:00',
						sport_id: this.taggetItem?.targetable.id // 运动数据的id
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/SportDiart/save',
						loading: true,
						data
					}).then(res => {
						this.upload()
					})

				} else {

					let data = {
						id: this.taggetItem.id, //修改  特别注意这个是记录id
						type: this.taggetItem.targetable.type,
						food_id: this.taggetItem.targetable.id, //修改  特别注意这个才是食物id
						g: val,
						date: this.activeDate + ' 00:00:00',
						meals: this.taggetItem.meals,
						carbohydrate: 0,
						protein: 0,
						fat: 0,
						heat_amount: 0,

					}
					if (this.userId) data.user_id = this.userId
					if (this.taggetItem.sub_foods && this.taggetItem.sub_foods.length) { //如果有子食材 就用子食材的数据来算三大营养素还有热量
						this.taggetItem.sub_foods.map(res => {
							data.carbohydrate += res.carbohydrate * res.g / 100
							data.protein += res.protein * res.g / 100
							data.fat += res.fat * res.g / 100
							data.heat_amount += res.heat_amount * res.g / 100
						})
						data.carbohydrate = parseFloat(data.carbohydrate.toFixed(2))
						data.protein = parseFloat(data.protein.toFixed(2))
						data.fat = parseFloat(data.fat.toFixed(2))
						data.heat_amount = parseFloat(data.heat_amount.toFixed(2))
						data.sub_foods = [...this.taggetItem.sub_foods]
					} else { //
						data.carbohydrate = parseFloat((Number(this.taggetItem.targetable.carbohydrate) * val / 100)
							.toFixed(2))
						data.protein = parseFloat((Number(this.taggetItem.targetable.protein) * val / 100).toFixed(2))
						data.fat = parseFloat((Number(this.taggetItem.targetable.fat) * val / 100).toFixed(2))
						data.heat_amount = this.calculate_heat_amount(this.taggetItem.targetable,val)
					}
					console.log('data222',data)
					
					this.$request({
						url: '/ApiV3/Mobile/HeatDiary/save',
						loading: true,
						data
					}).then(res => {
						this.$common.toast('修改成功')
						this.upload()
					})
				}
			},
			calculate_heat_amount(item = 0 ,val = 1){
				let heat_amount = 0
				let carbohydrate = parseFloat(item.carbohydrate * val /100)
				let protein = parseFloat(item.protein * val /100)
				let fat = parseFloat(item.fat * val /100)
				heat_amount = parseFloat((carbohydrate*4 + protein*4 + fat*9).toFixed(2))
				
				return heat_amount
			},
			async onDayClick(data) {
				this.curDate = data.date;

				this.activeDate = this.$common.formatDate(new Date(this.curDate), false)
				// this.upload()
			}
		}
	}
</script>

<style lang="scss" scope>
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

	.mask1 {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

	}

	.addMeal_box {
		position: fixed;
		z-index: 999;
		background-color: #FFF;
		box-shadow: 0px 0px 24px 2px rgba(0, 0, 0, 0.04);
		border-radius: 16rpx;
		width: 416rpx;
		height: 154rpx;
		display: flex;
		align-items: stretch;

		>view {
			flex: 1;
			display: flex;

			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			font-size: 24rpx;
			color: #C2C2C2;

			image {
				width: 80rpx;
				height: 80rpx;
			}

		}

		.triangle {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 100%;
			width: 0;
			height: 0;
			border: 16rpx solid transparent;
			border-top-color: #FFFFFF;
			box-shadow: 0px 0px 24px 2px rgba(0, 0, 0, 0.04);
		}
	}

	.quantity {
		background: #f7f7f7;

		// min-height: 100vh;
		&-content {
			background-color: #FFF;
			border-radius: 24rpx;
			padding: 16rpx;
			// min-height: 860rpx;

			&-box {
				display: flex;
				align-items: center;
				width: 100%;

				&-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;

				}
			}
		}

		&-fixed {
			position: fixed;
			bottom: 0;

			background-color: #FFF;
			display: flex;
			width: 100%;
			// height: 96rpx;

			&-box {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				height: 96rpx;
			}
		}

		.calendar-tab {
			width: 750rpx;
			height: 146rpx;
			background: #FFFFFF;
			display: flex;
			padding: 32rpx 10rpx;
			justify-content: center;
			align-items: stretch;

			.box {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				font-size: 24rpx;
			}

			.active {
				background: #00B8A2;
				color: #FFFFFF;
				border-radius: 16rpx;
			}
		}
	}
</style>