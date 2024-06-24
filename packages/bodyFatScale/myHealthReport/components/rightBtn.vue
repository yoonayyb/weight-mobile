<template>
	<view :class="{'show':active}"  @click="close">
		<view class="u-flex u-flex-end time" :class="{'timeSelect':active}" style="z-index: 10;">
			<view class="u-flex u-flex-end" style="width: 100%;background: #fff;" :class="{'u-flex-between':active}">
			<view class="u-m-r-10">{{date}}</view>
			<u-icon v-if="!active" color="#00B8A2" name="arrow-right" size="28"></u-icon>
			<u-icon v-else color="#00B8A2" name="arrow-down" size="28"></u-icon>
			</view>
			<picker-view @click.native.stop="" v-if="active"  @pickstart="maskshow = true" @pickend="maskshow = false"  style="width: 100%; height:332rpx;"
				:value="value" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'rightBtn',
		props: {

			userId: {
				type: String,
				default: () => ''
			},
		},
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(this.add0(i))
			}
			var currentDate = new Date();
			
			// 获取当前时间的年份和月份
			var currentYear = currentDate.getFullYear();
			var currentMonth = currentDate.getMonth();
			
			// 计算下一个月的年份和月份
			var nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
			var nextMonth = (currentMonth + 1) % 12;
			
			// 创建下一个月的日期对象
			var nextMonthDate = new Date(nextMonthYear, nextMonth);
			
			// 获取下一个月的时间戳（毫秒数）
			var nextMonthTimestamp = nextMonthDate.getTime();
			return {
				maskshow:false,
				value: [9999, month],
				years,
				year,
				months,
				month,
				date: this.$u.timeFormat(nextMonthDate.getTime(), 'yyyy-mm'),
				active: false,
			}
		},

		onLoad(e) {

		},
		methods: {
			add0 (m) {
			  return m < 10 ? '0' + m : m
			},
			close(){
				if(this.maskshow) return
				this.active = !this.active
				if(!this.active)this.$emit('getData',this.date)
				
			},
			bindChange(e) {
				const val = e.detail.value
				this.year = this.years[val[0]]
				this.month = this.months[val[1]]
				
				this.date = this.year + '-' + this.month
				this.value = [val[0],val[1]]
				console.log(this.value)
				
			}
		},

	}
</script>

<style lang="scss" scoped>
	.show {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 10;
	}

	.time {
		color: #00B8A2;
		// width: 210rpx;
		padding: 12rpx 24rpx 0 32rpx;
		position: fixed;
		top: 24rpx;
		right: 0rpx;

		transition: all .5s ease 0s;
	}

	.timeSelect {
		width: 480rpx;
		height: 382rpx;
		background: #FFFFFF;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		opacity: 1;
		
		flex-direction: column;
		align-items: flex-start;
		right: 18rpx;
	}
	.item {
			
			text-align: center;
		}
</style>