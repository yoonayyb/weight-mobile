<template>
	<view class="calendar-wrapper">
		<view class="header" v-if="headerBar">
			<!-- <view class="pre" @click="changeMonth('pre')">上个月</view>
            <view>{{y+'年'+formatNum(m)+'月'}}</view>
            <view class="next" @click="changeMonth('next')">下个月</view> -->
			<view class="header__action u-flex u-row-center">
				<view class="header__action__icon">
					<u-icon name="arrow-left-double" :color="yearArrowColor" @click="changeYearHandler(0)"></u-icon>
				</view>
				<view class="header__action__icon">
					<u-icon name="arrow-left" color="#606266" @click="changeMonth('pre')"></u-icon>
				</view>
				<view class="header__action__text">{{y+'年'+formatNum(m)+'月'}}</view>
				<view class="header__action__icon">
					<u-icon name="arrow-right" color="#606266" @click="changeMonth('next')"></u-icon>
				</view>
				<view class="header__action__icon">
					<u-icon name="arrow-right-double" :color="yearArrowColor" @click="changeYearHandler(1)"></u-icon>
				</view>
			</view>
		</view>
		<view class="week">
			<view class="week-day" v-for="(item, index) in weekDay" :key="index">{{ item }}</view>
		</view>
		<view :class="{ hide: !monthOpen }" class="content1" :style="{ height: height }">
			<view :style="{ top: positionTop + 'rpx' }" class="days">
				<view class="item" v-for="(item, index) in dates" :key="index">
					<view class="u-flex-xy-center"
					 :class="[rangePeriod(`${item.year}-${item.month}-${item.date}`,item.isCurM,item.day)]">
						<view class="day" @click="selectOne(item, $event)" :class="{
					        choose: choose == `${item.year}-${item.month}-${item.date}`&&item.isCurM,
					        nolm: !item.isCurM,
					        today: isToday(item.year, item.month, item.date),
					        isWorkDay: isWorkDay(item.year, item.month, item.date),
							
					    }">
							{{ Number(item.date) }}
						</view>
					</view>
					<!-- <view class="markDay" v-if="isMarkDay(item.year, item.month, item.date)&&item.isCurM"></view> -->
					<!-- <view class="today-text" v-if="isToday(item.year, item.month, item.date)">今</view> -->
				</view>
			</view>
		</view>
		<view class="u-flex-y-center">
			<view class="markDay"></view>
			<text class="u-font-24">月经期</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ren-calendar',
		props: {
			fillDate: {
				type: Array,
				default: () => {
					return [];
				}
			},
			// 星期几为第一天(0为星期日)
			weekstart: {
				type: Number,
				default: 0
			},
			//结束日期
			endDay: {
				type: String,
				default:''
			},
			// 标记的日期
			markDays: {
				type: Array,
				default: () => {
					return [];
				}
			},
			//是否展示月份切换按钮
			headerBar: {
				type: Boolean,
				default: true
			},
			// 是否展开
			open: {
				type: Boolean,
				default: true
			},
			//是否可收缩
			collapsible: {
				type: Boolean,
				default: true
			},
			//未来日期是否不可点击
			disabledAfter: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
				weektext: ['日', '一', '二', '三', '四', '五', '六'],
				y: new Date().getFullYear(), // 年
				m: new Date().getMonth() + 1, // 月
				dates: [], // 当前月的日期数据
				positionTop: 0,
				monthOpen: true,
				choose: '',
				day: '',
			};
		},
		created() {
			this.dates = this.monthDay(this.y, this.m);

			!this.open && this.toggle();
		},
		mounted() {
			// this.choose = this.getToday().date;
			// this.day = new Date().getDate()

		},
		computed: {
			// 顶部星期栏
			weekDay() {
				return this.weektext.slice(this.weekstart).concat(this.weektext.slice(0, this.weekstart));
			},
			height() {
				return (this.dates.length / 7) * 80 + 'rpx';
			},
			//计算周末日期
			isDay(){
				return function(e,day){
					return e === day
				}
			},
			//经期区间
			rangePeriod(){
				
				return function(date,item,day){
					let flag = ''
					if(item){
						if(this.fillDate.length){
							
							let currenDay = this.fillDate.find(v=> v.date === date)
							// console.log('currenDay',currenDay)
							if(currenDay){
								
								flag = 'rangeColorPeriod'
								
								let beforeDay = this.getBeforeDay(currenDay.date)
								let nextDay = this.getNextDay(currenDay.date)
								if(day === 6 || day === -1){
									flag = 'day6'
									
								}
								if(day === 7 ){
									flag = 'day7'
								}
								if( !this.fillDate.find(v=> v.date === beforeDay)){
									flag = 'start'
									// console.log('我是开始日期',date,day)
									// if(day === 7){
									// 	flag = 'startday7'
									// }
									if(day === 6 || day === -1){
										flag = 'startday6'
									}
								}
								if( !this.fillDate.find(v=> v.date === nextDay)){
									flag = 'end'
									// console.log('我是结束日期',date,day)
									if(day === 7){
										flag = 'endday7'
									}
									// if(day === 6){
									// 	flag = 'endday6'
									// }
								}
								if( !this.fillDate.find(v=> v.date === beforeDay) && !this.fillDate.find(v=> v.date === nextDay)){
									flag = 'startAndEnd'
									// console.log('我是开始也是结束日期',date)
								}
								
							}else{
								// let beforeDay = this.getBeforeDay(date)
								// let nextDay = this.getNextDay(date)
								// if( this.fillDate.find(v=> v.date === beforeDay)){
								// 	flag = 'end'
								// 	console.log('我是结束日期',date)
								// }
								// if( this.fillDate.find(v=> v.date === nextDay)){
								// 	flag = 'start'
								// 	console.log('我是开始日期',date)
								// }
							}
						}else{
							
							
						}
					}else{
						
					}
					
					
					return flag
				}
			},
		},
		watch:{
			fillDate:{
				handler(val){
					this.monthDay(this.y, this.m)
					console.log('fillDate',val)
				},
				deep:true
			},
			dates:{
				handler(val){
					// this.$emit('changeDate',this.y + '-' + this.m + '-01')
				},
				deep:true
			}
		},
		methods: {
			getBeforeDay(date){
				let day = date.replaceAll(/\-/g, '/')
				let beforeTimestemp = new Date(day).getTime() - 24*60*60*1000
				return this.$common.formatDate( new Date(beforeTimestemp) ,false)
			},
			getNextDay(date){
				let day = date.replaceAll(/\-/g, '/')
				let beforeTimestemp = new Date(day).getTime() + 24*60*60*1000
				return this.$common.formatDate( new Date(beforeTimestemp) ,false)
			},
			changeYearHandler(isAdd) {
				let year = isAdd ? this.y + 1 : this.y - 1
				if (!this.checkRange(year)) {
					this.y = year
					// this.changeData()
					this.dates = this.monthDay(this.y, this.m);
				}
				this.$emit('changeDate',this.y + '-' + this.m + '-01')
			},
			checkRange(year) {
				let overstep = false
				if (year < 1950 || year > 2100) {
					uni.showToast({
						title: '日期超出范围啦~',
						icon: 'none'
					})
					overstep = true
				}
				return overstep
			},
			formatNum(num) {
				let res = Number(num);
				return res < 10 ? '0' + res : res;
			},
			getToday() {
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth();
				let d = date.getDate();
				let week = new Date().getDay();
				let weekText = ['日', '一', '二', '三', '四', '五', '六'];
				let formatWeek = '星期' + weekText[week];
				let today = {
					date: y + '-' + this.formatNum(m + 1) + '-' + this.formatNum(d),
					week: formatWeek
				};
				return today;
			},
			// 获取当前月份数据
			monthDay(y, month) {
				let dates = [];
				let m = Number(month);
				let firstDayOfMonth = new Date(y, m - 1, 1).getDay(); // 当月第一天星期几
				let lastDateOfMonth = new Date(y, m, 0).getDate(); // 当月最后一天
				let lastDayOfLastMonth = new Date(y, m - 2, 0).getDate(); // 上一月的最后一天
				let weekstart = this.weekstart == 7 ? 0 : this.weekstart;
				let startDay = (() => {
					// 周初有几天是上个月的
					if (firstDayOfMonth == weekstart) {
						return 0;
					} else if (firstDayOfMonth > weekstart) {
						return firstDayOfMonth - weekstart;
					} else {
						return 7 - weekstart + firstDayOfMonth;
					}
				})();
				let endDay = 7 - ((startDay + lastDateOfMonth) % 7); // 结束还有几天是下个月的
				for (let i = 1; i <= startDay; i++) {
					dates.push({
						date: this.formatNum(lastDayOfLastMonth - startDay + i),
						day: weekstart + i - 1 || 7,
						month: m - 1 >= 0 ? this.formatNum(m - 1) : 12,
						year: m - 1 >= 0 ? y : y - 1
					});
					
				}
				for (let j = 1; j <= lastDateOfMonth; j++) {
					dates.push({
						date: this.formatNum(j),
						day: (j % 7) + firstDayOfMonth - 1 || 7,
						month: this.formatNum(m),
						year: y,
						isCurM: true //是否当前月份
					});
				}
				for (let k = 1; k <= endDay; k++) {
					dates.push({
						date: this.formatNum(k),
						day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
						month: m + 1 <= 11 ? this.formatNum(m + 1) : 0,
						year: m + 1 <= 11 ? y : y + 1
					});
					
				}
				console.log('dates',dates);
				let day6 = dates.filter(res=>res.day === 6)
				let day7 = dates.filter(res=>res.day === 7)
				console.log('day6',day6);
				console.log('day7',day7);
				return dates;
			},
			isWorkDay(y, m, d) {
				//是否工作日
				let ymd = `${y}/${m}/${d}`;
				let formatDY = new Date(ymd.replace(/-/g, '/'));
				let week = formatDY.getDay();
				if (week == 0 || week == 6) {
					return false;
				} else {
					return true;
				}
			},
			isFutureDay(y, m, d) {
				//是否未来日期
				let ymd = `${y}/${m}/${d}`;
				let formatDY = new Date(ymd.replace(/-/g, '/'));
				let showTime = formatDY.getTime();
				let curTime = new Date().getTime();
				if (showTime > curTime) {
					return true;
				} else {
					return false;
				}
			},
			// 标记日期
			isMarkDay(y, m, d) {
				let flag = false;
				for (let i = 0; i < this.markDays.length; i++) {
					let dy = `${y}-${m}-${d}`;
					// if (this.markDays[i] == dy) {
					//     flag = true;
					//     break;
					// }
					let dyTimestamp = new Date(new Date(dy).toLocaleDateString()).getTime() //凌晨的时间戳
					let currenDayTimestamp;//结束凌晨的时间戳
					if(!isNaN(new Date(this.endDay))){
						let maxTimestamp = new Date(new Date().toLocaleDateString()).getTime()
						let endTimestamp = new Date(new Date(this.endDay).toLocaleDateString()).getTime()
						if(endTimestamp >= maxTimestamp){
							currenDayTimestamp = maxTimestamp
						}else{
							currenDayTimestamp = endTimestamp
						}
						
					}else{
						currenDayTimestamp = new Date(new Date().toLocaleDateString()).getTime() 
					}
				
					let activeDateTimestamp = new Date(this.markDays[i]).getTime()//标记时间戳
					
					if (this.markDays[i] == dy || activeDateTimestamp < dyTimestamp && dyTimestamp <= currenDayTimestamp) {
				 	flag = true;
						break;
					}
				}
				return flag;
			},
			//经期结束
			isEndDay(y, m, d){
				if(isNaN(new Date(this.endDay))) return false
				
				let endD = y + '-' + m + '-' + d;
				let flag = false
				let chooseTimestamp = new Date(this.choose).getTime()
				let endDTimestamp = new Date(this.endDay).getTime()
				if(this.endDay === endD && endDTimestamp >= chooseTimestamp){
					flag = true
				}
				return flag
			},
			isToday(y, m, d) {
				let checkD = y + '-' + m + '-' + d;
				let today = this.getToday().date;
				if (checkD == today) {
					return true;
				} else {
					return false;
				}
			},
			// 展开收起
			toggle() {
				this.monthOpen = !this.monthOpen;
				if (this.monthOpen) {
					this.positionTop = 0;
				} else {
					let index = -1;
					this.dates.forEach((i, x) => {
						this.isToday(i.year, i.month, i.date) && (index = x);
					});
					this.positionTop = -((Math.ceil((index + 1) / 7) || 1) - 1) * 80;
				}
			},
			// 点击回调
			selectOne(i, event) {
				let date = `${i.year}-${i.month}-${i.date}`;
				let selectD = new Date(date).getTime();
				let curTime = new Date().getTime();
				let week = new Date(date).getDay();
				let weekText = ['日', '一', '二', '三', '四', '五', '六'];
				let formatWeek = '星期' + weekText[week];
				let response = {
					date: date,
					week: formatWeek
				};
				if (!i.isCurM) {
					// console.log('不在当前月范围内');
					return false;
				}
				if (selectD > curTime) {
					if (this.disabledAfter) {
						console.log('未来日期不可选');
						return false;
					} else {
						this.choose = date;
						this.$emit('onDayClick', response);
					}
				} else {
					this.choose = date;
					this.$emit('onDayClick', response);
				}
				console.log(response);
			},
			//改变年月
			changYearMonth(y, m) {
				this.dates = this.monthDay(y, m);
				this.y = y;
				this.m = m;
			},
			changeMonth(type) {
				if (type == 'pre') {
					if (this.m + 1 == 2) {
						this.m = 12;
						this.y = this.y - 1;
					} else {
						this.m = this.m - 1;
					}
				} else {
					if (this.m + 1 == 13) {
						this.m = 1;
						this.y = this.y + 1;
					} else {
						this.m = this.m + 1;
					}
				}
				this.dates = this.monthDay(this.y, this.m);
				this.$emit('changeDate',this.y + '-' + this.m + '-01')
			}
		}
	};
</script>

<style lang="scss" scoped>
	.calendar-wrapper {
		color: #bbb7b7;
		font-size: 28rpx;
		text-align: center;
		background-color: #fff;
		padding-bottom: 10rpx;
		border-radius: 24rpx;
		overflow: hidden;

		.header {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 88rpx;
			color: #42464A;
			font-size: 32rpx;
			font-weight: bold;

			// border-bottom: 2rpx solid #f2f2f2;
			&__header {
				width: 100%;
				box-sizing: border-box;
				font-size: 30rpx;
				background-color: #fff;
				color: $u-main-color;

				&__text {
					margin-top: 30rpx;
					padding: 0 60rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			&__action {
				padding: 40rpx 0 40rpx 0;

				&__icon {
					margin: 0 16rpx;
				}

				&__text {
					padding: 0 16rpx;
					color: $u-main-color;
					font-size: 32rpx;
					line-height: 32rpx;
					font-weight: bold;
				}
			}

			.pre,
			.next {
				color: #4d7df9;
				font-size: 28rpx;
				font-weight: normal;
				padding: 8rpx 15rpx;
				border-radius: 10rpx;
				border: 2rpx solid #dcdfe6;
			}

			.pre {
				margin-right: 30rpx;
			}

			.next {
				margin-left: 30rpx;
			}
		}

		.week {
			display: flex;
			align-items: center;
			height: 80rpx;
			line-height: 80rpx;
			border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);

			view {
				flex: 1;
			}
		}

		.content1 {
			position: relative;
			overflow: hidden;
			transition: height 0.4s ease;

			.days {
				transition: top 0.3s;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				

				.bga {
					background: #FFF5F6;
					
				}
				.day6{
					
					 background: linear-gradient(to right,#FFF5F6 0%, #FFF5F6 70%,#fff 70%, #fff 100%, )!important;
				
					
				}
				
				.day7{
					
					 background: linear-gradient(to right, #fff 0%, #fff 30%,  #FFF5F6 30%,#FFF5F6 100%,)!important;
					
					
				}
				
				.startday6{
					border-radius: 30rpx 0 0 30rpx;
					 background: linear-gradient(to right, #fff 0%, #fff 50%,  #FFF5F6 50%,#FFF5F6 70%,#fff 70%,#fff 100%,)!important;
					.day{
						background: linear-gradient(to right,#FFF5F6 0%, #FFF5F6 50%,transparent 50%, transparent 100%, )!important;
					}
				}
				.endday7{
					border-radius: 30rpx 0 0 30rpx;
					 background: linear-gradient(to right, #fff 0%, #fff 30%,  #FFF5F6 30%,#FFF5F6 50%,#fff 50%,#fff 100%,)!important;
					.day{
						background: linear-gradient(to right, transparent 0%, transparent 50%,  #FFF5F6 50%,#FFF5F6 100%,)!important;
					}
				}
				
				.start{
					// border-radius: 40rpx 0 0 40rpx;
					
					border-radius: 30rpx 0 0 30rpx;
					 
					 background: linear-gradient(to right, #fff , #FFF5F6 )!important;
					 .day{
						 background: #FFF5F6 ;
					 }
				}
				.end {
					border-radius:  0 30rpx  30rpx 0;
					
					background: linear-gradient(to right,#FFF5F6 ,#fff )!important;
					.day{
											 background: #FFF5F6 ;
					}
				}
				.startAndEnd{
					border-radius:  0 30rpx  30rpx 0;
					.day{
											 background: #FFF5F6 ;
					}
				}
				.rangeColorPeriod{
					background: #FFF5F6;
				}
				.item {
					position: relative;
					display: block;
					height: 80rpx;
					line-height: 80rpx;
					width: calc(100% / 7);

					.day {
						font-style: normal;
						display: flex;
						align-items: center;
						justify-content: center;
						// display: inline-block;
						// vertical-align: middle;
						width: 60rpx;
						height: 60rpx;
						// line-height: 60rpx;
						overflow: hidden;
						border-radius: 60rpx;

						&.choose {
							background: #FF9CA6 !important;
							
							color: #fff;
						}

						&.nolm {
							color: #fff;
							opacity: 0.3;
						}
					}

					.isWorkDay {
						color: #42464a;
					}

					.notSigned {
						font-style: normal;
						width: 8rpx;
						height: 8rpx;
						background: #fa7268;
						border-radius: 10rpx;
						position: absolute;
						left: 50%;
						bottom: 0;
						pointer-events: none;
					}

					.today {
						color: #fff;
						background-color: #FF9CA6;
					}

					.workDay {
						font-style: normal;
						width: 8rpx;
						height: 8rpx;
						background: #4d7df9;
						border-radius: 10rpx;
						position: absolute;
						left: 50%;
						bottom: 0;
						pointer-events: none;
					}


				}
			}
		}

		.markDay {
			font-style: normal;
			width: 20rpx;
			height: 20rpx;
			// background: #fc7a64;
			margin-left: 36rpx;
			background: #FFFFFF;
			margin-right: 8rpx;
			border-radius: 50%;
			border: 1rpx solid #FF9CA6;
			// position: absolute;
			// left: 50%;
			// bottom: 0;
			pointer-events: none;
		}

		.hide {
			height: 80rpx !important;
		}

		.weektoggle {
			width: 85rpx;
			height: 32rpx;
			position: relative;
			bottom: -42rpx;

			&.down {
				transform: rotate(180deg);
				bottom: 0;
			}
		}
	}
</style>
