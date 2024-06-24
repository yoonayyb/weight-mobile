<template>
	<view class="container">
		<u-gap height="24"></u-gap>
		<right-btn  @getData="search()"></right-btn>
		<view style="border-radius: 24rpx;margin: 0 12rpx;overflow: hidden;" v-if="checkedArr.length && !loading">
			<view @click="gotoCompare" class="u-font-32 text-bold" style="color:#00B8A2;padding: 18rpx 32rpx 0 32rpx;background: #fff;">
				已选择
			</view>
			<view class="heal-history" style="margin: 0;padding:0 20rpx 0 24rpx;border-radius:0 0 24rpx 24rpx;" >
				
				<view @click.native.stop="checkedCompare(item)"  class="his_wrap bg-white u-p-b-20 u-p-t-20" :style="{'border-bottom':i==0?'2rpx solid #ececec':''} " v-for="(item, i) in checkedArr" :key="i">
					<view class="u-flex u-flex-between" >
						<view class="u-flex">
							<view class="u-font-24 u-m-r-10"
								style="color:#C2C2C2;width: 210rpx;">{{ item.created_at +' '+ item.updated_at }}</view>
							<image class="u-m-r-10" :src="`${imgUrl}data_icon_weight@2x.png`"
								style="width: 48rpx;height: 48rpx;" />
							
							<text class="text-bold u-font-28 u-line-1"
								style="width: 160rpx;">{{parseFloat(Number(item.weight)) || 0 }} kg</text>
		
							<image class="u-m-r-10" :src="`${imgUrl}historicaldata_icon.png`"
								style="width: 48rpx;height: 48rpx;" />
							
							<text class="text-bold u-font-28 u-line-1"
								style="width:120rpx">{{ parseFloat(item.bfp)?parseFloat(item.bfp)+'%' :'--' }}</text>
		
						</view>
						<view class="u-flex">
								<u-icon  size="48"
									color="#00B8A2" name="checkmark-circle"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<u-gap height="24"></u-gap>
		</view>
		<block v-if="list.flatMap(v=>v).length && !loading">
			
			<view class="heal-history" :class="'heal'+item[0].id"  v-for="(item, i) in list" :key="i">
				<view class="text-bold u-font-32 u-m-b-24">{{ item[0].created_at }}</view>
				<view class="his_wrap bg-white u-m-b-24"   @longpress="del(item1.id,i,j)" v-for="(item1, j) in item"
					:key="j" @click="toDetail(item1)">
					<view class="u-flex u-flex-between">
						<view class="u-flex">

							<text class="u-font-24 u-m-r-10"
								style="color:#C2C2C2;width: 70rpx;">{{ item1.updated_at }}</text>
							<image class="u-m-r-10" :src="`${imgUrl}data_icon_weight@2x.png`"
								style="width: 48rpx;height: 48rpx;" />
							<view class="u-m-r-16" style="width: 48rpx;">体重 </view>
							<text class="text-bold u-font-28 u-line-1"
								style="width: 160rpx;">{{parseFloat(Number(item1.weight)) || 0 }} kg</text>

							<image class="u-m-r-10" :src="`${imgUrl}historicaldata_icon.png`"
								style="width: 48rpx;height: 48rpx;" />
							<view class="u-m-r-16" style="width: 72rpx;">体脂率 </view>
							<text class="text-bold u-font-28 u-line-1"
								style="width:120rpx">{{ parseFloat(item1.bfp)?parseFloat(item1.bfp)+'%' :'--' }}</text>

						</view>
						<view class="u-flex">

							<image v-if="!active" :src="`${imgUrl}icon-right.png`" mode="widthFix"
								style="width: 12rpx;height: auto;" class="img-right" />
							<view v-else>
								
								
								<view @click.stop="" v-if="item1.disabled || !parseFloat(item1.bfp)"
									style="width: 48rpx;height: 48rpx;border-radius: 50%;background: #ececec;">
								</view>
								<view @click.stop="checkedCompare(item1)" v-else-if="!item1.checked"
									style="width: 48rpx;height: 48rpx;border: 2rpx solid #C2C2C2;border-radius: 50%;">
								</view>
								<u-icon @click.native.stop="checkedCompare(item1)" v-else size="48"
									color="#00B8A2" name="checkmark-circle"></u-icon>
							</view>

						</view>
					</view>
					<u-line v-show="j+1<list[i].length" color="#EBEBEB" margin="18rpx 0 24rpx" />

				</view>
			</view>
		</block>
		<block v-else-if="!list.flatMap(v=>v).length && !loading">
			<view class="u-flex u-flex-column u-flex-items-center" style="margin-top: 40%;">
				<image :src="`${imgUrl}health-empty.png`" mode="widthFix" style="width:200rpx;height: auto;" />
				<view class="u-font-28 u-m-t-20" style="color:#C2C2C2">暂无历史数据</view>
			</view>
		</block>
		<image v-if="list.flatMap(v=>v).length && !loading" @click="addJump" :src="`${imgUrl+(active?'v3_body_compare_close.png':'v3_body_compare.png')}`"
			class="fixed_box" mode=""></image>

		<u-loading style="position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%)" size="68"
			:show="loading"></u-loading>
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
		<u-popup class="popup3" v-model="popShow" mode="center" width="590rpx" height="248rpx" border-radius="12">
			<view class="popup-text-view" style="padding: 48rpx">查看对比报告</view>
			<view class="popup-btn">
				<u-button @click="
		        () => {
		          popShow = false
		        }
		      ">取消</u-button>
				<u-button @click="jump" plain class="popup-btn-right">确认</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import rightBtn from './components/rightBtn'
	export default {
		data() {
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
				seachScollType:false,
				objClass:'',
				defaultDate:this.$u.timeFormat(nextMonthTimestamp, 'yyyy-mm'),
				popShow:false,
				active: false,
				delShow: false,
				loading: true,
				i: 0,
				j: 0,
				id: '',
				userId: '',
				list: [],
				saveList: [],
				
				a_page: 1,
				b_page: 1,
				a_last_page: null,
				b_last_page: null,
				
				checkedArr:[],
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
		onPageScroll(e) {
			
			// console.log('这里是手动滑动，请求接口数据')
			
			if(this.a_last_page){
				this.a_page++
				this.getafterData()
			}
		},
		onReachBottom() {
			if (this.b_last_page) {
				this.b_page++
				this.getBeforData()
			}
		},
		components: {
			rightBtn
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
			
					const arr = val.map(v=>v.id)
					
					if (val.length === 2) {
						this.list.forEach(v=>{
							v.forEach(e=>{
								if(arr.includes(e.id)){
									e.checked = true
								}else{
									e.checked = false
									e.disabled = true
								}
							})
						})
						this.popShow = true
					}else{
						console.log('arr',arr)
						
						this.list.forEach(v=>{
							v.forEach(e=>{
								if(!arr.includes(e.id)){
									
									e.checked = false
									e.disabled = false
								}else{
									e.checked = true
									e.disabled = false
									console.log('eeee',e)
								}
							})
						})
					}
					this.$forceUpdate()
					
				},
				deep: true
			}
		},
		methods: {
			checkedCompare(item) {

				item.checked = !item.checked
				if(item.checked){
					this.checkedArr.push(item)
				}else{
					let index = this.checkedArr.indexOf(item)
					this.checkedArr.splice(index,1)
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
			gotoCompare(){
				if(this.checkedArr.length === 2){
					this.jump()
				}
			},
			jump(){
					
					uni.navigateTo({
						url: '/packages/bodyFatScale/myHealthReport/compare?user_id=' + this.userId +'&startid='+this.checkedArr[0].id+'&endid='+this.checkedArr[1].id
					})
			},
			del(id, i, j) {
				console.log(i, j)
				if(this.active) return
				this.delShow = true
				this.id = id
				this.i = i
				this.j = j
			},
			confirmBtn() {
				this.$request({
					url: '/ApiV3/Mobile/BodyFatScaleWolai/del',
					data: {
						id: this.id,
						user_id:this.userId
					}
				}).then(res => {
					this.list[this.i].splice(this.j, 1)
					this.checkedArr.forEach(v=>{
						if(v.id === this.id){
							this.checkedArr.splice(v,1)
						}
					})
					this.delShow = false
					this.$common.toast('成功')
					console.log(111, this.list.flatMap(v => v))
					if (!this.list.length) this.loading

				})
			},
			search(time){
				console.log('time',time)
				console.log('this.defaultDate',this.defaultDate)
				if(this.defaultDate === time){ //相同时间不刷新数据
					return
				} 
				if(time && this.defaultDate !== time) this.defaultDate = time
				
				this.list= [];
				
				
				this.a_page = 1;
				this.b_page = 1;
				
				this.getData()
				
				
			},
			async getData() {
				await this.getafterData()
				await this.getBeforData()
				
				uni.pageScrollTo({
					
					selector:'.'+ this.objClass,
				});
			},
			getafterData(){
			    return new Promise((resolve,reject)=>{
					const data = {
						page: this.a_page,
						date: this.defaultDate,
						direction:'AFTER',
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
							item.created_at = t.split('-')[0] + '-' + t.split('-')[1] + '-' + t.split('-')[2]
							item.updated_at = t1.substr(0, 5)
							item.checked = false
							item.disabled = false
							//如果已经选中两个了 就全部不能勾选
							if(this.checkedArr.length === 2)item.disabled = true
							this.checkedArr.forEach(v=>{
								if(v.id === item.id){
									item.checked = true
									item.disabled = false
								}
							})
							
						})
						let newList = [] // 存储上一页旧数据
					
						if (this.list.length > 0) {
							this.list.forEach((item, i) => {
								newList = [...newList, ...item]
							})
						}
						var list = [...newList, ...data],
							flag = 0,
							newData = []
						for (var i = 0; i < list.length; i++) {
							var az = ''
							for (var j = 0; j < newData.length; j++) {
								if (newData[j][0].created_at == list[i].created_at) {
									flag = 1
									az = j
									break
								}
							}
							if (flag == 1) {
								newData[az].push(list[i])
								flag = 0
							} else if (flag == 0) {
								let wdy = new Array()
								wdy.push(list[i])
								newData.push(wdy)
							}
						}
						this.list = newData.reverse()
						this.a_last_page = res.data.next_page_url
						resolve()
					}).catch(() => {
						this.loading = false
					})
				})
				
			},
			getBeforData(){
				return new Promise((resolve,reject)=>{
					const data = {
						page: this.b_page,
						date: this.defaultDate,
						direction:'BEFORE',
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
							item.created_at = t.split('-')[0] + '-' + t.split('-')[1] + '-' + t.split('-')[2]
							item.updated_at = t1.substr(0, 5)
							item.checked = false
							item.disabled = false
							//如果已经选中两个了 就全部不能勾选
							if(this.checkedArr.length === 2)item.disabled = true
							this.checkedArr.forEach(v=>{
								if(v.id === item.id){
									item.checked = true
									item.disabled = false
								}
							})
							
						})
						this.objClass = 'heal' + data[0].id
						let newList = [] // 存储上一页旧数据
					
						if (this.list.length > 0) {
							this.list.forEach((item, i) => {
								newList = [...newList, ...item]
							})
						}
						var list = [...newList, ...data],
							flag = 0,
							newData = []
						for (var i = 0; i < list.length; i++) {
							var az = ''
							for (var j = 0; j < newData.length; j++) {
								if (newData[j][0].created_at == list[i].created_at) {
									flag = 1
									az = j
									break
								}
							}
							if (flag == 1) {
								newData[az].push(list[i])
								flag = 0
							} else if (flag == 0) {
								let wdy = new Array()
								wdy.push(list[i])
								newData.push(wdy)
							}
						}
						this.list = newData
						this.b_last_page = res.data.next_page_url
						resolve()
					}).catch(() => {
						this.loading = false
					})
				})
				
			},
			
			toDetail(item) {
				//选中框出现不给跳转
				if(this.active){
					if(!item.disabled && parseFloat(item.bfp)){
						this.checkedCompare(item)
					}
					
				}else{
					uni.navigateTo({
						url: `/packages/bodyFatScale/myHealthReport/index?id=${item.id}&userId=${this.userId}&time=${item.created_at+' ' +item.updated_at}`
					})
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
		padding-bottom: 100rpx;

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