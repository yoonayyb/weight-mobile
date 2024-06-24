<template>
	<view class="container">
		<view class="u-p-16">
			<calendar :checkedArr='checkedArr' @changeTags="changeTags" :userId="userId" naviTitle="blood"
				ref="calendar" mode="date" @change="changeDate">
				<view slot="tooltip">
					<view class="title"></view>
				</view>
			</calendar>
		</view>
		<template v-if="list.length && !loading">
			<view @click="toDetail(item)" @longpress="del(item,index)" class="list u-flex" v-for="(item,index) of list"
				:key="index">
				<view class="u-flex u-flex-column u-flex-center"
					style="width: 162rpx;height: 100%; border-right: 2rpx solid #ECECEC;">
					<image :src="`${imgUrl + showImage(item)}`" style="width: 48rpx;height: 48rpx;" />


					<view class="u-font-24 text-bold u-m-t-10" style="color:#D3D3D3;">
						{{ item.updated_at }}
					</view>
				</view>
				<view class="u-flex u-flex-column u-flex-center u-flex-1">
					<view class="u-font-32 text-bold">{{item.weight}} <text class="u-font-20 text-bold">kg</text>
					</view>
					<view class="u-font-24 text-bold u-m-t-12" style="color:#D3D3D3;">体重</view>
				</view>
				<view class="u-flex u-flex-column u-flex-center u-flex-1">
					<view class="u-font-32 text-bold">{{parseFloat(item.bfp)?parseFloat(item.bfp):'--' }} <text
							v-if="parseFloat(item.bfp)" class="u-font-20 text-bold">%</text> </view>
					<view class="u-font-24 text-bold u-m-t-12" style="color:#D3D3D3;">体脂率</view>
				</view>
				<view>
					<u-icon v-if="!compare" size="48" color="#D3D3D3" name="arrow-right"></u-icon>
					<view v-else>


						<view v-if="item.disabled || !parseFloat(item.bfp)"
							style="width: 48rpx;height: 48rpx;border-radius: 50%;background: #ececec;">
						</view>
						<view @click.stop="checkedCompare(item)" v-else-if="!item.checked"
							style="width: 48rpx;height: 48rpx;border: 2rpx solid #C2C2C2;border-radius: 50%;">
						</view>
						<u-icon @click.native.stop="checkedCompare(item)" v-else size="48" color="#00B8A2"
							name="checkmark-circle"></u-icon>
					</view>
				</view>

			</view>

		</template>
		<view v-if="list.length && !loading || checkedArr.length" class="u-flex-xy-center safe-area-inset-bottom"
			style="position: fixed;bottom: 0rpx;width: 100%;min-height: 232rpx;background: #fff;border-radius: 24rpx;">
			<my-button v-if="!compare" @click="compare = true" height="74" width="426">对比报告</my-button>
			<view v-else style="width: 100%;margin-top: 30rpx;">
				<view class="u-flex u-flex-around" style="width: 100%;">
					<my-button @click="compare = false" color='#00B8A2' bg="#fff" border="#00B8A2" height="74"
						width="266">取消</my-button>
					<my-button @click="jump" :stop="!(checkedArr.length && checkedArr.length ===2)" height="74"
						width="266">确认</my-button>
				</view>
				<view class="u-flex u-flex-between u-m-t-8 u-p-26">
					<view style="min-width: 20%;" @click="search(1)"
						class="u-flex u-flex-column u-flex-items-start u-relative">
						<view class="u-font-32 text-bold">
							<template v-if="checkedArr.length && checkedArr[0]">
								<text>{{checkedArr[0].weight}}</text>
								<text class="u-font-20 text-bold">kg</text>
								<u-icon style="position: absolute;right: 0;top: 6rpx;" size="32" color="#00B8A2"
									name="checkmark-circle"></u-icon>
							</template>
							<view v-else>
								--
							</view>

						</view>
						<view class="u-font-24 text-bold u-m-t-10" style="color:#C2C2C2">
							<text
								v-if="checkedArr.length && checkedArr[0]">{{checkedArr[0].created_at+ ' ' +checkedArr[0].updated_at }}</text>
							<text v-else>未选择</text>
						</view>
					</view>
					<view class="duringday u-flex u-flex-between ">
						<text class="u-m-l-26 u-line-1">{{getDaysDifference()}}</text><text>天</text>
					</view>
					<view style="min-width: 20%;" @click="search(2)"
						class="u-flex u-flex-column u-flex-items-start u-relative u-flex-items-end">
						<view class="u-font-32 text-bold">
							<template v-if="checkedArr.length && checkedArr[1]">

								<view style="position: absolute;left: 0;top: 0rpx;">
									<u-icon size="32" color="#00B8A2" name="checkmark-circle"></u-icon>
								</view>
								<text>{{checkedArr[1].weight}}</text>
								<text class="u-font-20 text-bold">kg</text>
							</template>
							<view v-else>
								--
							</view>
						</view>
						<view class="u-font-24 text-bold u-m-t-10" style="color:#C2C2C2">
							<text
								v-if="checkedArr.length && checkedArr[1]">{{checkedArr[1].created_at+ ' ' +checkedArr[1].updated_at }}</text>
							<text v-else>未选择</text>
						</view>
					</view>
				</view>
			</view>


		</view>
		<template v-if="!list.length && !loading">
			<view class="u-flex u-flex-column u-flex-items-center" style="margin-top: 20%;">
				<image :src="`${imgUrl}health-empty.png`" mode="widthFix" style="width:200rpx;height: auto;" />
				<view class="u-font-28 u-m-t-20" style="color:#C2C2C2">暂无历史数据</view>
			</view>
		</template>
		<u-popup class="popup3" v-model="delShow" mode="center" width="590rpx" height="248rpx" border-radius="12">
			<view class="popup-text-view" style="padding: 48rpx">确定删除该体脂称记录？</view>
			<view class="popup-btn">
				<u-button @click="
		        () => {
		          delShow = false
		        }
		      ">取消</u-button>
				<u-button @click="confirmBtn" plain class="popup-btn-right">确认</u-button>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import calendar from './components/calendar'
	import myButton from '@/components/myButton.vue'
	const duringTime = [
		['00:00:00', '23:59:59'],
		['06:00:00', '11:59:59'],
		['12:00:00', '17:59:59'],
		['18:00:00', '23:59:59'],
		['00:00:00', '05:59:59']
	]
	export default {
		data() {

			return {
				tagsIndex: 0,
				duringTime,
				start_at: '00:00:00',
				end_at: '23:59:59',
				compare: false,
				list: [],
				page: 1,
				last_page: null,
				seachScollType: false,
				objClass: '',
				defaultDate: this.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd'),
				popShow: false,
				active: false,
				delShow: false,
				loading: true,
				i: 0,
				j: 0,
				id: '',
				userId: '',
				saveList: [],
				checkedArr: [],
			}
		},

		onLoad(option) {
			this.userId = option.userId
			this.getData()
		},
		onShow() {
			setTimeout(() => {
				console.log('loading-end')
				uni.hideLoading()
			}, 1000)
		},

		onReachBottom() {
			if (this.last_page) {
				this.page++
				this.getData()
			}
		},
		components: {
			myButton,
			calendar
		},
		watch: {
			// list: {
			// 	handler(val) {

			// 		const arr = val.flatMap(v =>v).map(v=>({id:v.id,checked:v.checked,disabled:v.disabled}))

			// 		if (arr.filter(v=>v.checked).length === 2) {
			// 			val.forEach(v=>{
			// 				v.forEach(e=>{
			// 					if(!e.checked){
			// 						e.disabled = true
			// 					}
			// 				})
			// 			})
			// 			this.popShow = true
			// 		}else{
			// 			console.log('arr',arr)
			// 			val.forEach(v=>{
			// 				v.forEach(e=>{
			// 					if(e.disabled)e.disabled = false
			// 				})
			// 			})
			// 		}
			// 		this.$forceUpdate()

			// 	},
			// 	deep: true
			// },
			checkedArr: {
				handler(val) {

					const arr = val.map(v => v.id)

					if (val.length === 2) {
						this.list.forEach(v => {
							if (arr.includes(v.id)) {
								v.checked = true
							} else {
								v.checked = false
								v.disabled = true
							}
						})

					} else {
						console.log('arr', arr)

						this.list.forEach(v => {
							if (!arr.includes(v.id)) {

								v.checked = false
								v.disabled = false
							} else {
								v.checked = true
								v.disabled = false

							}
						})
					}
					this.$forceUpdate()

				},
				deep: true
			}
		},
		methods: {
			// 比较两个时间的大小（格式：hh:mm:ss）
			compareTime(time1, time2) {
				const [h1, m1, s1] = time1.split(':');
				const [h2, m2, s2] = time2.split(':');
				const date1 = new Date(); // 创建日期对象
				const date2 = new Date(); // 创建日期对象
				date1.setHours(h1, m1, s1); // 设置日期对象的时、分、秒
				date2.setHours(h2, m2, s2); // 设置日期对象的时、分、秒

				// 比较时间大小
				if (date1.getTime() >= date2.getTime()) {
					return 1;
				} else if (date1.getTime() < date2.getTime()) {
					return -1;
				}

			},
			showImage(item) {

				let imgUrl = ''
				if (item.hms) {
					if (this.compareTime(item.hms, '06:00:00') === 1 && this.compareTime(item.hms, '11:59:59') === -
						1) { //上午
						imgUrl = '组件 85 – 25@2x.png'
					}
					if (this.compareTime(item.hms, '12:00:00') === 1 && this.compareTime(item.hms, '17:59:59') === -
						1) { //下午
						imgUrl = '组件 87 – 7@2x.png'
					}
					if (this.compareTime(item.hms, '18:00:00') === 1 && this.compareTime(item.hms, '23:59:59') === -
						1) { //晚上
						imgUrl = '组件 88 – 7@2x.png'
					}
					if (this.compareTime(item.hms, '00:00:00') === 1 && this.compareTime(item.hms, '05:59:59') === -
						1) { //凌晨
						imgUrl = '组件 89 – 41@2x.png'
					}
				}
				return imgUrl

			},
			search(type) {


				if (type === 1 && this.checkedArr[0]) {

					this.defaultDate = this.checkedArr[0].created_at

					this.$refs.calendar.init(this.defaultDate)
					this.$refs.calendar.getCalendarData()
					this.getData()
				} else if (this.checkedArr[1]) {
					this.defaultDate = this.checkedArr[1].created_at

					this.$refs.calendar.init(this.defaultDate)
					this.$refs.calendar.getCalendarData()
					this.getData()
				}

			},
			getDaysDifference() {
				// 将日期字符串转换为 Date 对象
				if (this.checkedArr.length !== 2) return '--'
				const start = new Date(this.checkedArr[0].created_at + ' ' + this.checkedArr[0].updated_at);
				const end = new Date(this.checkedArr[1].created_at + ' ' + this.checkedArr[1].updated_at);

				// 计算时间差，并将其转换为天数
				const timeDifference = Math.abs(end.getTime() - start.getTime());
				const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

				return daysDifference;
			},
			changeTags(index) {
				this.tagsIndex = index
				this.start_at = duringTime[index][0]
				this.end_at = duringTime[index][1]
				this.getData()
			},
			changeDate(date) {
				console.log('date', date)
				const {
					result
				} = date
				this.defaultDate = date.year + '-' + date.month + '-' + date.day
				this.getData()
				// this.calendarDate = result
				// console.log(this.$refs.timeRecord)
				// this.$refs.timeRecord.getData(result)
				// this.$refs.timeRecord.scroll(result)
			},
			checkedCompare(item) {

				item.checked = !item.checked
				if (item.checked) {
					this.checkedArr.push(item)
				} else {
					console.log('checkedCompareItem', item)
					let index = this.checkedArr.findIndex(v => v.id === item.id)
					this.checkedArr.splice(index, 1)
				}

				this.$forceUpdate()

			},

			addJump() {

				this.active = !this.active
				// if(!this.active){
				// 	this.checkedArr = []
				// 	this.list.forEach(v=>{
				// 		v.forEach(e=>{
				// 			e.checked = false
				// 		})
				// 	})
				// }
				// if (!this.active) {
				// 	uni.navigateTo({
				// 		url: '/packages/bodyFatScale/myHealthReport/compare?user_id=' + this.userId
				// 	})
				// }

			},
			gotoCompare() {
				if (this.checkedArr.length === 2) {
					this.jump()
				}
			},
			jump() {

				uni.navigateTo({
					url: '/packages/bodyFatScale/myHealthReport/compare?user_id=' + this.userId + '&startid=' +
						this.checkedArr[0].id + '&endid=' + this.checkedArr[1].id
				})
			},
			del(item, index) {
				if (this.compare) return
				this.delShow = true
				this.id = item.id
				this.i = index
			},
			confirmBtn() {
				this.$request({
					url: '/ApiV3/Mobile/BodyFatScaleWolai/del',
					data: {
						id: this.id,
						user_id: this.userId
					}
				}).then(res => {
					this.$refs.calendar.init(this.defaultDate)
					this.$refs.calendar.getCalendarData()
					this.list.splice(this.i, 1)
					this.checkedArr.forEach(v => {
						if (v.id === this.id) {
							this.checkedArr.splice(v, 1)
						}
					})
					this.delShow = false
					this.$common.toast('成功')

				})
			},

			async getData() {

				const data = {
					page: this.page,
					start_at: this.defaultDate + ' ' + this.start_at,
					end_at: this.defaultDate + ' ' + this.end_at,

				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: '/ApiV3/Mobile/BodyFatScaleWolai/record',
					method: 'get',
					data
				}).then((res) => {
					this.loading = false
					let {
						data
					} = res.data
					data.map((item) => {
						let t = item.created_at.split(' ')[0]
						let t1 = item.created_at.split(' ')[1]
						item.hms = t1
						item.created_at = t.split('-')[0] + '-' + t.split('-')[1] + '-' + t
						.split('-')[2]
						item.updated_at = t1.substr(0, 5)
						item.checked = false
						item.disabled = false
						//如果已经选中两个了 就全部不能勾选
						if (this.checkedArr.length === 2) item.disabled = true
						this.checkedArr.forEach(v => {
							if (v.id === item.id) {
								item.checked = true
								item.disabled = false
							}
						})
					})

					if (this.page === 1) {
						this.list = data
					} else {
						this.list = [...data, ...this.list]
					}


					this.last_page = res.data.next_page_url

				}).catch(() => {
					this.loading = false
				})


			},
			toDetail(item) {
				//选中框出现不给跳转
				if (this.compare) {
					if (!item.disabled && parseFloat(item.bfp)) {
						this.checkedCompare(item)
					}

				} else {
					if(parseFloat(item.bfp)){
						uni.navigateTo({
							url: `/packages/bodyFatScale/myHealthReport/bfp?id=${item.id}&userId=${this.userId}&time=${item.created_at+' ' +item.updated_at}`
						})
					}else{
						uni.navigateTo({
							url: `/packages/bodyFatScale/myHealthReport/index?id=${item.id}&userId=${this.userId}&time=${item.created_at+' ' +item.updated_at}`
						})
					}
					
				}

			}
		},
		filter: {
			formatDate(val) {}
		}
	}
</script>
<style lang="scss">
	page {
		background: #f7f7f7;
	}
</style>
<style lang="scss" scoped>
	.container {
		background: #f7f7f7;
		min-height: 100vh;
		padding-bottom: 300rpx;

		.list {
			width: 718rpx;
			margin: 8rpx 16rpx;
			padding: 18rpx 24rpx 18rpx 0;
			height: 158rpx;
			background: #FFFFFF;
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			opacity: 1;
		}

		.duringday {
			background: linear-gradient(90deg, rgba(0, 184, 162, 0.2) 0%, rgba(0, 184, 162, 0) 100%);
			color: #00B8A2;
			min-width: 152rpx;
			max-width: 200rpx;
			font-size: 32rpx;
			font-weight: bold;
			border-radius: 26rpx 26rpx 26rpx 26rpx;
			height: 52rpx;
		}

		.fixed_box {
			height: 124rpx;
			width: 124rpx;
			position: fixed;
			right: 44rpx;
			bottom: 150rpx;
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

	}

	.heal-history {
		background: #FFF;
		padding: 24rpx 32rpx;
		margin-bottom: 24rpx;
		font-size: 24rpx;
	}

	// .heal-history-wrap {
	//   color: #4a4a4a;
	//   padding: 0 30rpx 30rpx;
	//   .his_wrap {
	//     padding: 24rpx 30rpx 30rpx;
	//     border-radius: 20rpx;
	//   }
	// }
	// .img-right {
	//   width: 12rpx;
	//   height: auto;
	// }
	// .sub-text {
	//   color: #999;
	// }
	// .u-font-44 {
	//   font-size: 44rpx;
	// }
</style>