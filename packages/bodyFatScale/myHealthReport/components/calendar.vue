<template>
	<view class="u-calendar">
		<view class="u-calendar__header">
			<view class="u-calendar__header__text" v-if="!$slots['tooltip']">
				{{ toolTip }}
			</view>
			<slot v-else name="tooltip" />
		</view>
		<view class="u-calendar__action u-flex u-row-center">
			<view class="u-calendar__action__icon">
				<u-icon v-if="changeYear" name="arrow-left-double" :color="yearArrowColor"
					@click="changeYearHandler(0)"></u-icon>
			</view>
			<view class="u-calendar__action__icon">
				<u-icon v-if="changeMonth" name="arrow-left" :color="monthArrowColor" @click="changeMonthHandler(0)">
				</u-icon>
			</view>
			<view class="u-calendar__action__text">{{ showTitle }}</view>
			<view class="u-calendar__action__icon">
				<u-icon v-if="changeMonth" name="arrow-right" :color="monthArrowColor" @click="changeMonthHandler(1)">
				</u-icon>
			</view>
			<view class="u-calendar__action__icon">
				<u-icon v-if="changeYear" name="arrow-right-double" :color="yearArrowColor"
					@click="changeYearHandler(1)"></u-icon>
			</view>
		</view>
		<view class="u-p-14 u-p-b-32 u-flex u-flex-around">
			<view class="tags" @click="tags_active = index;$emit('changeTags',index)" :class="{'tags_active':tags_active===index}"
				v-for="(item, index) in tags" :key="index">{{ item }}</view>
		</view>
		<view class="u-calendar__week-day">

			<view class="u-calendar__week-day__text" v-for="(item, index) in weekDayZh" :key="index">{{ item }}</view>
		</view>
		<view class="u-calendar__content">
			<!-- 前置空白部分 -->
			<block v-for="(item, index) in weekdayArr" :key="index">
				<view class="u-calendar__content__item"></view>
			</block>
			<view class="u-calendar__content__item" :class="{
          'u-hover-class': openDisAbled(year, month, index + 1),
          'u-calendar__content--start-date':
            (mode == 'range' && startDate == `${year}-${month}-${index + 1}`) || mode == 'date',
          'u-calendar__content--end-date':
            (mode == 'range' && endDate == `${year}-${month}-${index + 1}`) || mode == 'date'
        }" v-for="(item, index) in daysArr" :key="index" @tap="dateClick(index)">
				<view class="u-calendar__content__item__inner" :style="{
            color:!openDisAbled(year, month, index + 1)?getColor(index, 2):'#b4b4b4'
          }">
					<view class="u-flex u-flex-column u-relative u-font-28" :style="{
              backgroundColor: getColor(index, 1),
              borderRadius: '50%',
              width: '56rpx',
              height: '56rpx',
			  fontWeight:'bold',
			  
			  border:checkedArr.find(v=>v.created_at === `${year}-${add(month) }-${add(index + 1)}`)?'1px solid #00B8A2':''
            }">
						<view style="line-height: 54rpx;">{{ index + 1 }}</view>
						<view v-if="!openDisAbled(year, month, index + 1)"
							style="font-size: 18rpx;line-height: 18rpx;color:#00B8A2;position: absolute;bottom: -10rpx;background: rgba(0,184,162,0.06);"
							:class="{noactive:activeDate === `${year}-${month}-${index + 1}`}">
							<text style="width: 70rpx;display: inline-block;text-align: center;" class="u-line-1" v-if="calendarDataFind(year, month, index + 1)&&activeDate !== `${year}-${month}-${index + 1}` && !checkedArr.find(v=>v.created_at === `${year}-${add(month) }-${add(index + 1)}`)">{{calendarDataFind(year, month, index + 1)}}</text>
							<view v-else-if="calendarDataFind(year, month, index + 1) && activeDate === `${year}-${month}-${index + 1}`"  style="display: flex;justify-content: center;">
								<text style="width: 6rpx;height: 6rpx;border-radius: 50%;margin-top: -6rpx;"
									:style="{background:'#ffffff'}"></text>
							</view>
						</view>

					</view>
				</view>
				<view  style="width: 56rpx;display: flex;justify-content: center;">
					<u-icon v-if="checkedArr.find(v=>v.created_at === `${year}-${add(month) }-${add(index + 1)}`)"  color="#00B8A2" size="20" name="checkmark"></u-icon>
					<u-icon v-else  color="#FFF" size="20" name="checkmark"></u-icon>
					<!-- <text style="width: 10rpx;height: 10rpx;border-radius: 50%;margin-top: 10rpx;"
						:style="{background:setColor(year, month, index + 1)}"></text> -->
				</view>

				<!-- <view  class="u-calendar__content__item__tips" v-if="!openDisAbled(year, month, index + 1) && naviTitle === 'suggest'" :style="{ fontSize: '100rpx' }">
					<text v-if="setColor1(year, month, index + 1) === '#00B8A2'" :style="{ color:'#00B8A2'}">·</text>
					<text v-if="setColor2(year, month, index + 1) === '#3E77E9'" :style="{ color:'#3E77E9'}">·</text>
				</view>	 -->
				<!-- <view v-if="naviTitle === 'suggest'" style="width: 56rpx;height: 28rpx;display: flex;justify-content: space-around;">
				  <text style="background: #00B8A2;width: 10rpx;height: 10rpx;border-radius: 50%;margin-top: 10rpx;" v-if="setColor1(year, month, index + 1) === '#00B8A2'" ></text>
				  <text style="background: #3E77E9;width: 10rpx;height: 10rpx;border-radius: 50%;margin-top: 10rpx;" v-if="setColor2(year, month, index + 1) === '#3E77E9'" ></text>
				  </view> -->

			</view>

		</view>
	</view>
</template>
<script>
	/**
	 * calendar 日历
	 * @description 此组件用于单个选择日期，范围选择日期等，日历被包裹在底部弹起的容器中。
	 * @tutorial http://uviewui.com/components/calendar.html
	 * @property {String} mode 选择日期的模式，date-为单个日期，range-为选择日期范围
	 * @property {Boolean} v-model 布尔值变量，用于控制日历的弹出与收起
	 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区适配(默认false)
	 * @property {Boolean} change-year 是否显示顶部的切换年份方向的按钮(默认true)
	 * @property {Boolean} change-month 是否显示顶部的切换月份方向的按钮(默认true)
	 * @property {String Number} max-year 可切换的最大年份(默认2050)
	 * @property {String Number} min-year 最小可选日期(默认1950)
	 * @property {String Number} min-date 可切换的最小年份(默认1950-01-01)
	 * @property {String Number} max-date 最大可选日期(默认当前日期)
	 * @property {String Number} 弹窗顶部左右两边的圆角值，单位rpx(默认20)
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭日历(默认true)
	 * @property {String} month-arrow-color 月份切换按钮箭头颜色(默认#606266)
	 * @property {String} year-arrow-color 年份切换按钮箭头颜色(默认#606266)
	 * @property {String} color 日期字体的默认颜色(默认#303133)
	 * @property {String} active-bg-color 起始/结束日期按钮的背景色(默认#2979ff)
	 * @property {String Number} z-index 弹出时的z-index值(默认10075)
	 * @property {String} active-color 起始/结束日期按钮的字体颜色(默认#ffffff)
	 * @property {String} range-bg-color 起始/结束日期之间的区域的背景颜色(默认rgba(41,121,255,0.13))
	 * @property {String} range-color 选择范围内字体颜色(默认#2979ff)
	 * @property {String} start-text 起始日期底部的提示文字(默认 '开始')
	 * @property {String} end-text 结束日期底部的提示文字(默认 '结束')
	 * @property {String} btn-type 底部确定按钮的主题(默认 'primary')
	 * @property {String} toolTip 顶部提示文字，如设置名为tooltip的slot，此参数将失效(默认 '选择日期')
	 * @property {Boolean} closeable 是否显示右上角的关闭图标(默认true)
	 * @example <u-calendar v-model="show" :mode="mode"></u-calendar>
	 */

	export default {
		name: 'u-calendar',
		props: {
			checkedArr: {
				type: Array,
				default: ()=>[]
			},
			suggestFellactiveDate: {
				type: Number | String,
				default: ''
			},
			userId: {
				type: Number | String,
				default: ''
			},
			naviTitle: {
				type: String,
				default: ''
			},
			// userId: {
			// 	type: String,
			// 	default: ''
			// },
			//血糖是否异常
			valueType: {
				type: String,
				default: ''
			},
			//默认开始日期
			defaultStartDate: {
				type: String,
				default: ''
			},
			//默认结束日期
			defaultEndDate: {
				type: String,
				default: ''
			},
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			},
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			// 是否允许切换年份
			changeYear: {
				type: Boolean,
				default: true
			},
			// 是否允许切换月份
			changeMonth: {
				type: Boolean,
				default: true
			},
			// date-单个日期选择，range-开始日期+结束日期选择
			mode: {
				type: String,
				default: 'date'
			},
			// 可切换的最大年份
			maxYear: {
				type: [Number, String],
				default: 2050
			},
			// 可切换的最小年份
			minYear: {
				type: [Number, String],
				default: 1950
			},
			// 最小可选日期(不在范围内日期禁用不可选)
			minDate: {
				type: [Number, String],
				default: '1950-01-01'
			},
			/**
			 * 最大可选日期
			 * 默认最大值为今天，之后的日期不可选
			 * 2030-12-31
			 * */
			maxDate: {
				type: [Number, String],
				default: ''
			},
			// 弹窗顶部左右两边的圆角值
			borderRadius: {
				type: [String, Number],
				default: 20
			},
			// 月份切换按钮箭头颜色
			monthArrowColor: {
				type: String,
				default: '#606266'
			},
			// 年份切换按钮箭头颜色
			yearArrowColor: {
				type: String,
				default: '#606266'
			},
			// 默认日期字体颜色
			color: {
				type: String,
				default: '#303133'
			},
			// 选中|起始结束日期背景色
			activeBgColor: {
				type: String,
				default: '#00B8A2'
			},
			// 选中|起始结束日期字体颜色
			activeColor: {
				type: String,
				default: '#ffffff'
			},
			// 范围内日期背景色
			rangeBgColor: {
				type: String,
				default: 'rgba(41,121,255,0.13)'
			},
			// 范围内日期字体颜色
			rangeColor: {
				type: String,
				default: '#2979ff'
			},
			// mode=range时生效，起始日期自定义文案
			startText: {
				type: String,
				default: ''
			},
			// mode=range时生效，结束日期自定义文案
			endText: {
				type: String,
				default: ''
			},
			//按钮样式类型
			btnType: {
				type: String,
				default: 'primary'
			},
			// 当前选中日期带选中效果
			isActiveCurrent: {
				type: Boolean,
				default: true
			},
			// 切换年月是否触发事件 mode=date时生效
			isChange: {
				type: Boolean,
				default: false
			},
			// 是否显示右上角的关闭图标
			closeable: {
				type: Boolean,
				default: true
			},
			// 顶部的提示文字
			toolTip: {
				type: String,
				default: '选择日期'
			}
		},
		data() {
			return {
				tags_active: 0,
				tags: ['全天', '上午', '下午', '晚上', '凌晨'],
				suggestArr: [],
				calendarData: {},
				// 星期几,值为1-7
				weekday: 1,
				weekdayArr: [],
				// 当前月有多少天
				days: 0,
				daysArr: [],
				showTitle: '',
				year: 2020,
				month: 0,
				day: 0,
				startYear: 0,
				startMonth: 0,
				startDay: 0,
				endYear: 0,
				endMonth: 0,
				endDay: 0,
				today: '',
				activeDate: '',
				startDate: '',
				endDate: '',
				isStart: true,
				min: null,
				max: null,
				weekDayZh: ['日', '一', '二', '三', '四', '五', '六']
			}
		},
		onShow() {
			this.userId = uni.getStorageSync('userId')
			console.log('this.userId', this.userId)
		},
		computed: {
			dataChange() {
				return `${this.mode}-${this.minDate}-${this.maxDate}`
			},
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup
			},
			setColor() {
				return function(year, month, day) {
					let _date = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`

					return '#00B8A2'
				}
			},
			calendarDataFind(){
				return function(year, month, day) {
					let _date = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`
					let flag = ''
					if(this.calendarData[_date]){
						flag = this.calendarData[_date].weight || ''
					}
					return flag
					
				}
			},
			setColor1() {
				return function(year, month, day) {
					let _date = `${this.formatNum(month)}-${this.formatNum(day)}`
					let color = '#FFFFFF'

					this.suggestArr.forEach(v => {
						if (v.of_date === _date && v.is_feel) {
							color = '#00B8A2'
						}
					})
					return color
				}
			},
			setColor2() {
				return function(year, month, day) {
					let _date = `${this.formatNum(month)}-${this.formatNum(day)}`
					let color = '#FFFFFF'
					this.suggestArr.forEach(v => {
						if (v.of_date === _date && v.is_evaluate) {
							color = '#3E77E9'
						}
					})
					return color
				}
			}
		},
		watch: {
			dataChange(val) {
				this.init()
			}

		},
		created() {
			this.init()
			this.upCanlendarData()
		},
		methods: {
			
			upCanlendarData(val) {
				let date = this.year + '-' + this.month + '-01'
				if (val) date = val

				// let end_date =  this.year + '-' + this.month + '-'+ this.getMonthDay(this.year, this.month)
				this.getCalendarData(date)
			},

			//请求日历数据
			getCalendarData(date) {
				
				console.log('userId', this.userId)
				console.log('this.naviTitle', this.naviTitle)
				let data = {
					date:this.year+ '-' + this.add(this.month) 
				}
				if(this.userId) data.user_id = this.userId
				this.$request({
					url:'/ApiV3/Mobile/BodyFatScaleWolai/date',
					method: 'get',
					data
				}).then((res) => {
					
					this.calendarData = res.data.data
					console.log('this.calendarData', this.calendarData)
				})
			},
			setDate(startDate, endDate = null) {
				const defaultStartDateArr = startDate.split('-')
				this.startYear = defaultStartDateArr[0]
				this.startMonth = this.formatNumReverse(defaultStartDateArr[1])
				this.startDay = this.formatNumReverse(defaultStartDateArr[2])
				this.startDate = this.activeDate = `${this.startYear}-${this.startMonth}-${this.startDay}`
				if (endDate) {
					const defaultEndDateArr = endDate.split('-')
					this.endYear = defaultEndDateArr[0]
					this.endMonth = this.formatNumReverse(defaultEndDateArr[1])
					this.endDay = this.formatNumReverse(defaultEndDateArr[2])
					this.endDate = `${this.endYear}-${this.endMonth}-${this.endDay}`
				}
			},
			getColor(index, type) {
				
				let color = type == 1 ? '' : this.color
				let day = index + 1
				let date = `${this.year}-${this.month}-${day}`
				let timestamp = new Date(date.replace(/\-/g, '/')).getTime()
				let start = this.startDate.replace(/\-/g, '/')
				let end = this.endDate.replace(/\-/g, '/')
				if ((this.isActiveCurrent && this.activeDate == date) || this.startDate == date || this.endDate == date) {
					color = type == 1 ? this.activeBgColor : this.activeColor
				} else if (this.endDate && timestamp > new Date(start).getTime() && timestamp < new Date(end).getTime()) {
					color = type == 1 ? this.rangeBgColor : this.rangeColor
				}else if(this.checkedArr.find(v=>v.created_at === `${this.year}-${this.add(this.month)}-${this.add(day)}`) && this.activeDate !== date ){
					color = type == 1 ? '#fff' : '#2A2A2A'
					
				}
				
				return color
			},
			add(m){
				return m < 10 ? '0' + m : m
			},
			init(activeDate) {
				this.tags_active = 0
				this.$emit('changeTags',this.tags_active)
				let now = new Date()
				if (activeDate) {
					activeDate = activeDate.replace(/\-/g, '/');
					let activenow = new Date(activeDate)
					this.year = activenow.getFullYear()
					this.month = activenow.getMonth() + 1
					this.day = activenow.getDate()

					this.activeDate = `${this.year}-${this.month}-${this.day}`
				} else {
					this.year = now.getFullYear()
					this.month = now.getMonth() + 1
					this.day = now.getDate()

					this.activeDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
				}


				this.today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
				this.min = this.initDate(this.minDate)
				this.max = this.initDate(this.maxDate || this.today)
				this.startDate = ''
				this.startYear = 0
				this.startMonth = 0
				this.startDay = 0
				this.endYear = 0
				this.endMonth = 0
				this.endDay = 0
				this.endDate = ''
				this.isStart = true
				this.changeData()
			},
			//日期处理
			initDate(date) {
				let fdate = date.split('-')
				return {
					year: Number(fdate[0] || 1920),
					month: Number(fdate[1] || 1),
					day: Number(fdate[2] || 1)
				}
			},
			openDisAbled: function(year, month, day) {
				let bool = true
				let date = `${year}/${month}/${day}`
				// let today = this.today.replace(/\-/g, '/');
				let min = `${this.min.year}/${this.min.month}/${this.min.day}`
				let max = `${this.max.year}/${this.max.month}/${this.max.day}`
				let timestamp = new Date(date).getTime()
				if (timestamp >= new Date(min).getTime() && timestamp <= new Date(max).getTime()) {
					bool = false
				}
				return bool
			},
			generateArray: function(start, end) {
				return Array.from(new Array(end + 1).keys()).slice(start)
			},
			formatNum: function(num) {
				return num < 10 ? '0' + num : num + ''
			},
			//一个月有多少天
			getMonthDay(year, month) {
				let days = new Date(year, month, 0).getDate()
				return days
			},
			getWeekday(year, month) {
				let date = new Date(`${year}/${month}/01 00:00:00`)
				return date.getDay()
			},
			checkRange(year) {
				let overstep = false
				if (year < this.minYear || year > this.maxYear) {
					uni.showToast({
						title: '日期超出范围啦~',
						icon: 'none'
					})
					overstep = true
				}
				return overstep
			},
			changeMonthHandler(isAdd) {
				let date = ''
				let end_date = ''
				if (isAdd) {
					let month = this.month + 1
					let year = month > 12 ? this.year + 1 : this.year
					if (!this.checkRange(year)) {
						this.month = month > 12 ? 1 : month
						this.year = year
						this.changeData()
						date = this.year + '-' + this.month + '-01'
					}
				} else {
					let month = this.month - 1
					let year = month < 1 ? this.year - 1 : this.year
					if (!this.checkRange(year)) {
						this.month = month < 1 ? 12 : month
						this.year = year
						this.changeData()
						date = this.year + '-' + this.month + '-01'
						end_date = this.year + '-' + this.month + '-' + this.getMonthDay(year, month)
					}
				}
				console.log('aaaa', date)
				this.getCalendarData(date, end_date)
			},
			changeYearHandler(isAdd) {
				let year = isAdd ? this.year + 1 : this.year - 1
				let date = ''
				if (!this.checkRange(year)) {
					this.year = year
					this.changeData()

					date = this.year + '-' + this.month + '-01'
					let end_date = this.year + '-' + this.month + '-' + this.getMonthDay(year, this.month)
					console.log('aaaa', date)
					this.getCalendarData(date, end_date)
				}
			},
			//反向格式化数字
			formatNumReverse: function(num) {
				return num > 10 ? num : parseInt(num)
			},
			changeData() {
				this.days = this.getMonthDay(this.year, this.month)
				this.daysArr = this.generateArray(1, this.days)
				this.weekday = this.getWeekday(this.year, this.month)
				this.weekdayArr = this.generateArray(1, this.weekday)
				this.showTitle = `${this.year}年${this.month}月`
				//修复跨月问题
				if (this.defaultStartDate && !this.startDate && !this.endDate)
					this.setDate(this.defaultStartDate, this.defaultEndDate)

				if (this.isChange && this.mode == 'date') {
					this.btnFix(true)
				}
			},
			dateClick: function(day) {
				day += 1
				if (!this.openDisAbled(this.year, this.month, day)) {
					this.day = day
					let date = `${this.year}-${this.month}-${day}`
					console.log(111111, date)
					if (this.mode == 'date') {
						this.activeDate = date
						let arr = this.activeDate.split('-')
						let year = this.isChange ? this.year : Number(arr[0])
						let month = this.isChange ? this.month : Number(arr[1])
						let day = this.isChange ? this.day : Number(arr[2])
						//当前月有多少天
						let days = this.getMonthDay(year, month)
						let result = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`
						let weekText = this.getWeekText(result)
						let isToday = false
						if (`${year}-${month}-${day}` == this.today) {
							//今天
							isToday = true
						}
						this.$emit('change', {
							year: year,
							month: month,
							day: day,
							days: days,
							result: result,
							week: weekText,
							isToday: isToday
							// switch: show //是否是切换年月操作
						})
					} else {
						let compare =
							new Date(date.replace(/\-/g, '/')).getTime() < new Date(this.startDate.replace(/\-/g, '/'))
						.getTime()
						if (this.isStart || compare) {
							this.startDate = date
							this.startYear = this.year
							this.startMonth = this.month
							this.startDay = this.day
							this.endYear = 0
							this.endMonth = 0
							this.endDay = 0
							this.endDate = ''
							this.activeDate = ''
							this.isStart = false
						} else {
							this.endDate = date
							this.endYear = this.year
							this.endMonth = this.month
							this.endDay = this.day
							this.isStart = true
						}
					}
				}
			},
			close() {
				// 修改通过v-model绑定的父组件变量的值为false，从而隐藏日历弹窗
				this.$emit('input', false)
			},
			getWeekText(date) {
				date = new Date(`${date.replace(/\-/g, '/')} 00:00:00`)
				let week = date.getDay()
				return '星期' + ['日', '一', '二', '三', '四', '五', '六'][week]
			},
			btnFix(show) {
				if (!show) {
					this.close()
				}
				if (this.mode == 'date') {
					let arr = this.activeDate.split('-')
					let year = this.isChange ? this.year : Number(arr[0])
					let month = this.isChange ? this.month : Number(arr[1])
					let day = this.isChange ? this.day : Number(arr[2])
					//当前月有多少天
					let days = this.getMonthDay(year, month)
					let result = `${year}-${this.formatNum(month)}-${this.formatNum(day)}`
					let weekText = this.getWeekText(result)
					let isToday = false
					if (`${year}-${month}-${day}` == this.today) {
						//今天
						isToday = true
					}
					this.$emit('change', {
						year: year,
						month: month,
						day: day,
						days: days,
						result: result,
						week: weekText,
						isToday: isToday
						// switch: show //是否是切换年月操作
					})
				} else {
					if (!this.startDate || !this.endDate) return
					let startMonth = this.formatNum(this.startMonth)
					let startDay = this.formatNum(this.startDay)
					let startDate = `${this.startYear}-${startMonth}-${startDay}`
					let startWeek = this.getWeekText(startDate)

					let endMonth = this.formatNum(this.endMonth)
					let endDay = this.formatNum(this.endDay)
					let endDate = `${this.endYear}-${endMonth}-${endDay}`
					let endWeek = this.getWeekText(endDate)
					this.$emit('change', {
						startYear: this.startYear,
						startMonth: this.startMonth,
						startDay: this.startDay,
						startDate: startDate,
						startWeek: startWeek,
						endYear: this.endYear,
						endMonth: this.endMonth,
						endDay: this.endDay,
						endDate: endDate,
						endWeek: endWeek
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@mixin vue-flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: $direction;
		/* #endif */
	}

	.u-calendar {
		color: $u-content-color;
		background: #fff;
		overflow: hidden;
		border-radius: 24rpx 24rpx 24rpx 24rpx;

		.noactive {
			height: 16rpx !important;
			background: transparent !important;
		}

		.tags {

			height: 54rpx;
			width: 112rpx;
			padding: 10rpx 0;
			text-align: center;
			background: #FFFFFF;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			opacity: 1;
			font-size: 24rpx;
			font-weight: bold;
			color: #00B8A2;
			border: 2rpx solid rgba(232, 232, 232, 0.5);

			&_active {

				background: #00B8A2;
				border: none;
				color: #ffffff;
			}
		}

		&__header {
			width: 100%;
			box-sizing: border-box;
			font-size: 30rpx;
			background-color: #fff;
			color: $u-main-color;

			&__text {
				margin-top: 30rpx;
				padding: 0 60rpx;
				@include vue-flex;
				justify-content: center;
				align-items: center;
			}
		}

		&__action {
			padding: 40rpx 0 8rpx 0;

			&__icon {
				margin: 0 16rpx;
			}

			&__text {
				padding: 0 16rpx;
				color: $u-main-color;
				font-size: 32rpx;
				line-height: 32rpx;
				// font-weight: bold;
			}
		}

		&__week-day {
			@include vue-flex;
			align-items: center;
			justify-content: center;
			padding: 6px 0;
			overflow: hidden;

			&__text {
				flex: 1;
				text-align: center;
				color: #B2B2B2;
				font-size: 20rpx;
				font-weight: bold;
			}
		}

		&__content {
			width: 100%;
			@include vue-flex;
			flex-wrap: wrap;
			padding: 6px 0;
			box-sizing: border-box;
			background-color: #fff;
			position: relative;

			&--end-date {
				border-top-right-radius: 8rpx;
				border-bottom-right-radius: 8rpx;
			}

			&--start-date {
				border-top-left-radius: 8rpx;
				border-bottom-left-radius: 8rpx;
			}

			&__item {
				width: 14.2857%;
				@include vue-flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				overflow: hidden;
				position: relative;
				z-index: 2;

				&__inner {
					// height: 84rpx;
					@include vue-flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					font-size: 28rpx;
					position: relative;
					border-radius: 50%;

					&__desc {
						width: 100%;
						font-size: 24rpx;
						line-height: 24rpx;
						transform: scale(0.75);
						transform-origin: center center;
						position: absolute;
						left: 0;
						text-align: center;
						bottom: 2rpx;
					}
				}

				&__tips {
					width: 100%;
					font-size: 24rpx;
					line-height: 24rpx;
					position: absolute;
					left: 0;
					transform: scale(0.8);
					transform-origin: center center;
					text-align: center;
					bottom: 8rpx;
					z-index: 2;
				}
			}

			&__bg-month {
				position: absolute;
				font-size: 130px;
				line-height: 130px;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				color: #e4e7ed;
				z-index: 1;
			}
		}

		&__bottom {
			width: 100%;
			@include vue-flex;
			align-items: center;
			justify-content: start;
			// flex-direction: column;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 0 40rpx 30rpx;
			box-sizing: border-box;
			font-size: 24rpx;
			color: $u-tips-color;
			height: 100rpx;

			&__choose {
				height: 50rpx;
			}

			&__custom {
				display: flex;
				flex-wrap: nowrap;
				align-items: center !important;
				justify-content: start;

				// width: 300rpx;
				// flex: 1;
				text {
					display: flex;
					align-items: center;
					font-size: 100rpx;
					// padding-bottom: 10rpx;
				}
			}

			&__btn {
				width: 100%;
			}
		}
	}
</style>