<template>
	<view>
		<u-popup @close="close" v-model="show" mode="center" border-radius="24" close-icon-size="26" width="640rpx"
			closeable height="678rpx">
			<view class="u-flex-column u-flex-items-center" style="height: 100%;">
				<image class="u-absolute" :src="`${imgUrl}v3_dinner_tip.png`" @click="tipShow = true"
					style="width: 48rpx;height:48rpx;left: 40rpx;top:24rpx" mode=""></image>
				<view class="u-font-32 u-m-t-42 u-m-b-66" style="color:#00B8A2">
					用餐时间
				</view>
				<view class="meal">
					<text class="u-m-r-40" style="font-size: 28rpx;color:#2A2A2A">开始用餐</text>
					<view @click="timeshow = true;active = 1" class="time u-flex"
						:class="{fade_out:active === 1,fade_out:mealId}">{{startTime}}
						<view @click.stop="startTime = ''">
							<u-icon v-if="startTime" style="margin-left: 8rpx;" name="close"></u-icon>
						</view>
					</view>
				</view>
				<view class="meal">
					<text class="u-m-r-40" style="font-size: 28rpx;color:#2A2A2A">结束用餐</text>
					<view @click="timeshow1 = true;active = 2" class="time u-flex"
						:class="{fade_out:active === 2,fade_out:mealId}">
						{{endTime || ''}}
						<view @click.stop="endTime = ''">
							<u-icon v-if="endTime" style="margin-left: 8rpx;" name="close"></u-icon>
						</view>
					</view>
				</view>
				<view class="u-flex u-flex-items-baseline u-m-t-22" style="font-weight: bold;font-size: 40rpx;">
					<view style="color:#00B8A2;font-size: 72rpx;">{{hour}}</view>
					<view style="color:#2A2A2A;margin:0 16rpx 0 8rpx">H</view>
					<view style="color:#00B8A2;">{{minute}}</view>
					<view style="color:#2A2A2A;margin:0 16rpx 0 4rpx;font-size: 26rpx;">M</view>
					<view style="color:#00B8A2;">{{second}}</view>
					<view style="color:#2A2A2A;font-size: 26rpx;margin-left: 4rpx;">S</view>
				</view>
				<view class="u-font-24;" style="color:#D3D3D3;text-align: center;">
					当前用餐时长
				</view>
				<view class="u-m-t-40">
					<my-button @click="submit" borderRadius="40rpx" fontWeight="400" fontSize="28rpx" height="72"
						width="460">{{mealId?'修改':'确定'}}</my-button>
				</view>
				<!-- <view class="u-flex u-flex-wrap u-flex-between u-m-t-40">
					<view class="fastbox" :class="{'active':active === index} " @click="active = index" v-for="(item,index) of fastOptions" :key="index">
						<view class="tip" v-if="item.tip">
							{{item.tip}}
						</view>
						<view class="title">
							{{item.title}}
						</view>
						<view class="desc">
							{{item.desc}}
						</view>
						<view class="start">
							<u-rate :count="5" disabled active-color="#FFC939" inactive-color="#F9EAC5"  v-model="item.start"></u-rate>
						</view>
					</view>
					
				</view> -->
			</view>

		</u-popup>
		<u-popup v-model="tipShow" mode="center" border-radius="24" width="640rpx" closeable height="678rpx">
			<view class="u-flex-column u-flex-items-center u-font-24" style="height: 100%;padding: 0 54rpx;">
				<view class="u-font-32 u-m-t-42 u-m-b-66" style="color:#B2B2B2">
					说明
				</view>
				<view style="color: #00B8A2;width: 100%;">
					1.开始时间：
				</view>
				<view style="padding: 30rpx 0;padding-left: 84rpx;width: 100%;">
					即您在今天开始第一顿进食的开始时间。
				</view>
				<view style="color: #00B8A2;width: 100%;">
					2.结束时间：
				</view>
				<view style="padding: 30rpx 0;padding-left: 84rpx;width: 100%;">

					即您在今天最后一顿进食的结束间，结束时间可跨天。
				</view>
				<view class="u-font-20" style="margin-top: 100rpx;color: #D3D3D3;line-height: 32rpx;">
					建议：睡觉前最后一顿如果跨天记为前一天的结束时间，睡觉后半夜起来用餐记为当天的第一顿。
				</view>
			</view>
		</u-popup>
		<u-picker @confirm="confirm" :params="params" v-model="timeshow" :default-time="startTime"
			mode="time"></u-picker>
		<u-picker @confirm="confirm1" :params="params" v-model="timeshow1" :default-time="endTime"
			mode="time"></u-picker>
	</view>

</template>

<script>
	import myButton from '@/components/myButton'
	export default {
		props: {
			userId: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				tipShow: false,
				defaultTimer: 0,
				delAddTime: true,
				mealId: '',
				active: 1,
				timeshow: false,
				timeshow1: false,
				show: false,
				activeDate: '',
				startTime: this.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
				endTime: '',
				hour: '00',
				minute: '00',
				second: '00',
				timer: 0,
				targetTimer: 0,
				setTimer: null,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true,

				}
			}
		},
		mounted() {

		},
		destroyed() {
			clearInterval(this.setTimer)
		},
		components: {
			myButton
		},
		computed: {
			name() {
				return this.data
			}
		},
		watch: {

			startTime(newValue, oldValue) {

				if (newValue) { //正在用餐 或者 结束
					this.resetAddTime()
					this.startTime = newValue
					let endTime = this.endTime // this.endTime 有可能为null 这个时候就用当前时间来算
					let startTimeStamp = new Date(newValue).getTime()
					let endTimeStamp = endTime ? new Date(endTime).getTime() : new Date().getTime()
					let nowTime = new Date().getTime()
					if (nowTime > startTimeStamp && nowTime < endTimeStamp) {
						this.timer = (nowTime - startTimeStamp) / 1000

					} else if (nowTime >= endTimeStamp) {

						this.timer = (endTimeStamp - startTimeStamp) / 1000 //秒

					}
					if (this.endTime) {
						this.targetTimer = (endTimeStamp - startTimeStamp) / 1000
						if (this.targetTimer >= 360000) this.targetTimer = 360000 - 1
					} else {
						this.targetTimer = 360000 - 1
					}

					if (startTimeStamp > nowTime || startTimeStamp > endTimeStamp) {

					} else {
						this.addTime()
					}
				} else {
					this.delAddTime = true
					this.resetAddTime()
				}
			},
			endTime(newValue, oldValue) {

				if (this.startTime) { //正在用餐 或者 结束
					this.resetAddTime()

					let startTimeStamp = new Date(this.startTime).getTime()
					let endTimeStamp = newValue ? new Date(newValue).getTime() : new Date().getTime()
					let nowTime = new Date().getTime()
					if (nowTime > startTimeStamp && nowTime < endTimeStamp) {
						this.timer = (nowTime - startTimeStamp) / 1000

					} else if (nowTime >= endTimeStamp) {

						this.timer = (endTimeStamp - startTimeStamp) / 1000 //秒

					}
					if (newValue) {
						this.targetTimer = (endTimeStamp - startTimeStamp) / 1000
						if (this.targetTimer >= 360000) this.targetTimer = 360000 - 1
					} else {
						this.targetTimer = 360000 - 1
					}
					if (startTimeStamp > nowTime || startTimeStamp > endTimeStamp) {

					} else {
						this.addTime()
					}
					// this.targetTimer = endTimeStamp / 1000 //秒 计时结束时间

				} else {

					this.resetAddTime()
				}

			},
		},
		methods: {
			setDefault({
				timer,
				hour,
				minute,
				second
			}) {

				if (!this.delAddTime) {

					this.timer = timer
					this.hour = hour
					this.minute = minute
					this.second = second

					console.log(timer, hour, minute, second)
				}

			},
			open({
				startTime,
				endTime,
				activeDate,
				mealId = '',
				timer,
				hour,
				minute,
				second,
				delAddTime = true
			} = {}) {
				this.resetAddTime()
				this.delAddTime = delAddTime
				if (!this.delAddTime) {
					this.timer = timer
					this.hour = hour
					this.minute = minute
					this.second = second
				}

				this.active = 1
				this.mealId = mealId
				this.show = true
				
				this.startTime = activeDate + ' '+this.$common.formatTimeHHMMSS(new Date())
				this.activeDate = activeDate + ' 00:00:00'
				console.log('this.startTime', this.startTime)
				console.log('mealId', this.mealId)
				console.log('startTime', startTime)



				if (startTime) { //正在用餐 或者 结束
					this.startTime = startTime
					this.endTime = endTime // endTime 有可能为null 这个时候就用当前时间来算
					let startTimeStamp = new Date(startTime).getTime()
					let endTimeStamp = endTime ? new Date(endTime).getTime() : new Date().getTime()
					let nowTime = new Date().getTime()
					if (nowTime > startTimeStamp && nowTime < endTimeStamp) {
						this.timer = (nowTime - startTimeStamp) / 1000

					} else if (nowTime >= endTimeStamp) {

						this.timer = (endTimeStamp - startTimeStamp) / 1000 //秒

					}
					if (this.endTime) {
						this.targetTimer = (endTimeStamp - startTimeStamp) / 1000
						if (this.targetTimer >= 360000) this.targetTimer = 360000 - 1
					} else {
						this.targetTimer = 360000 - 1
					}

					// this.targetTimer = endTimeStamp / 1000 //秒 计时结束时间
					console.log('startTime', this.timer)
					console.log('startTime', this.hour)
					console.log('startTime', this.minute)
					console.log('startTime', this.second)
					this.addTime()
				} else { //未开始
					// this.resetAddTime()
				}


			},
			resetAddTime() {
				if (this.setTimer) clearInterval(this.setTimer)
				if (!this.delAddTime) return

				this.timer = 0
				this.targetTimer = 0
				this.hour = '00'
				this.minute = '00'
				this.second = '00'
			},
			close() {
				if (this.setTimer) clearInterval(this.setTimer)
				this.resetAddTime()
				this.startTime = ''
				this.endTime = ''


			},
			submit() {

				if (!this.startTime && !this.endTime && this.mealId) { //删除
					let data = {
						id: this.mealId
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/DiaryFoodTime/del',
						data
					}).then(res => {

						this.$emit('submit')
						this.show = false
					})
				} else { //提交
					let Time = new Date(this.activeDate).getTime() + 86400000
					if (!this.startTime) return this.$common.toast('请输入开始时间')
					if (new Date(this.startTime).getTime() >= new Date().getTime()) return this.$common.toast(
						'开始时间应早于当前时间')
					if (new Date(this.startTime).getTime() >= Time) return this.$common.toast('开始时间应该为当天时间')
					if (new Date(this.startTime).getTime() < new Date(this.activeDate).getTime()) return this.$common
						.toast(
							'开始时间应该为当天时间')
					if (this.endTime && new Date(this.startTime).getTime() >= new Date(this.endTime).getTime()) return this
						.$common.toast('开始时间不能晚于结束时间')
					let data = {
						start_at: this.startTime,
						end_at: this.endTime || null //后端接收null
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/DiaryFoodTime/save',
						data
					}).then(res => {


						this.$emit('submit', this.targetTimer)
						this.show = false
					})
				}


			},
			addTime() {

				if (!this.delAddTime) return
				uni.showLoading({
					title: '加载中',
					mask: true
				})

				if (this.setTimer) clearInterval(this.setTimer)
				this.setTimer = setInterval(() => {
					uni.hideLoading();

					this.timer++
					this.formatTime(this.timer)
					if (this.timer >= this.targetTimer) {

						this.timer = this.targetTimer - 1
						this.formatTime(this.timer + 1)
						clearInterval(this.setTimer)
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
				// console.log(this.second)
				// return `${hour.toString().padStart(2, '0')}:${minute
				//         .toString()
				//         .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
			},
			confirm(val) {
				let {
					year,
					month,
					day,
					hour,
					minute,
					second
				} = val
				this.delAddTime = true
				this.startTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

				console.log(val)
			},
			confirm1(val) {
				let {
					year,
					month,
					day,
					hour,
					minute,
					second
				} = val
				this.delAddTime = true
				this.endTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second

				console.log(val)
			}
		}
	}
</script>
<style>
	
</style>
<style lang="scss" scope>
	.meal {

		margin-bottom: 36rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		


		.time {
			border: 2rpx solid #E7E7E7;
			width: 334rpx;
			height: 58rpx;
			font-size: 24rpx;
			color: #D3D3D3;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 28rpx;
		}

		.fade_out {
			color: #00B8A2;
			// animation: point 0.5s;
			// animation-iteration-count: infinite;
			// animation-direction: alternate
		}

		@keyframes point {
			from {
				color: #00B8A2;
			}

			to {
				color: #D3D3D3;

			}
		}
	}
</style>