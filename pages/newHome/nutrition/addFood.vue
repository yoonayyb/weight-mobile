<template>
	<!-- 三栏布局 -->
	<view class="container u-flex-column" :style="{paddingBottom:paddingBottom + 'px'}">


		<view class="u-flex u-p-24">
			<!-- @search="search" @change="$u.debounce(search, 300)" -->
			<u-search disabled @click="gotoSearch" style="flex:1;margin-right: 8rpx;"
				:placeholder="placeholder" :show-action="false" v-model="keyword">
			</u-search>
			<u-icon v-if="obj.name !== '运动' && !addFoodType" size="48" @click="chooseMedia" name="camera"></u-icon>
		</view>
		<view style="text-align: center;">
			<u-tabs v-if="!keyword" :list="tablist" :current="current" inactive-color="#C2C2C2" active-color="#2A2A2A"
				:bar-style="{background:'#00B8A2'}" :bar-height="8" :font-size="32" @change="tabsChange"></u-tabs>
		</view>
		<swiper style="flex:1;height:0;background-color: #FAFAFA;" :current="current" @change="handleSwiperCurrent">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<block v-if="item.children.length">

						<view @click="addSportCustom" class="u-flex-xy-center u-font-24 u-p-24" style="color:#00B8A2"
							v-if=" item.name === '自定义'">
							<image :src="`${imgUrl}v3_icon_edit.png`"
								style="width: 32rpx;height:32rpx;margin-right: 8rpx;"></image>
							<text>添加自定义{{obj.name === '运动'?obj.name:'食物' }}</text>
						</view>

						<view @click="openMealPop(v)" class="u-flex u-flex-items-stretch u-p-32 borderBottom"
							v-for="(v,i) of item.children" :key="i">
							<u-image :border-radius="8" v-if="obj.name === '运动'" :src="v.thumb" width="88"
								height="88"></u-image>
							<u-image :border-radius="8" v-else :src="v.images[0]" width="88" height="88"></u-image>
							<view v-if="obj.name !== '运动'" class="u-m-l-16 " style="width:60%">
								<view class="u-font-28 text-bold u-line-1 u-m-b-10" style="width:100%">{{v.title}}
								</view>
								<view class="u-font-28 " style="color:#C2C2C2;">
									<text style="color:#00B8A2">{{v.heat_amount }}</text>
									<text>{{ ' kcal' + '/' + '100g'}}</text>

								</view>
							</view>
							<view v-else class="u-m-l-16 " style="width:60%">
								<view class="u-font-28 text-bold u-line-1 u-m-b-10" style="width:100%">{{v.title}}
								</view>
								<view class="u-font-28 " style="color:#C2C2C2;">
									<text style="color:#00B8A2">{{v.kcal }}</text>
									<text>{{ ' kcal' + '/' + 'min'}}</text>
								</view>
							</view>
							<view  class="u-flex-xy-center u-flex-end" style="flex:1">
								<image v-if="v.checkedKcal"  :src="`${imgUrl}shoucang.png`" style="width: 48rpx;height:48rpx">
								</image>
								<text v-else   class="shoucang">+</text>
								
								
							</view>
							<!-- <view v-if="v.checkedKcal" class="u-flex-xy-center u-flex-end" style="flex:1">
								{{v.checkedKcal | filterNumParseInt }}kcal
							</view> -->
						</view>
					</block>
					<view v-else class="u-flex-column u-flex-items-center u-font-28 empty" style="color:#C2C2C2">

						<block v-if="obj.name === '运动'">

							<image :src="`${imgUrl}search_blankpage_sport1.png`" style="width: 200rpx;height:200rpx">
							</image>

							<view>暂无添加{{item.name}}运动</view>
							<block v-if="item.name === '自定义'">
								<my-button @click="addSportCustom" class="u-m-t-10" width="176" height="72">去添加
								</my-button>
							</block>
						</block>
						<block v-else>
							<image :src="`${imgUrl}search_blankpage.png`" style="width: 200rpx;height:200rpx">
							</image>
							<block v-if="index === 0">
								<view>暂无相关食材</view>
								<view>去添加自定义食物吧~</view>
							</block>
							<view v-else>暂无自定义食物</view>
							<my-button @click="addCustomFood" class="u-m-t-10" width="176" height="72">去添加</my-button>
						</block>



					</view>
				</scroll-view>
			</swiper-item>
		</swiper>


		<view v-if="!addFoodType" class="quantity-fixed safe-area-inset-bottom" @click="popupShow">

			<view class="quantity-fixed-box" :style="{backgroundImage:bgUrl} ">
				<u-badge type="error" :offset="[10,0]" :count="count"></u-badge>
			</view>
			<view class="u-flex-column u-m-l-40 u-relative">
				<view class="u-font-28 text-bold u-m-b-4">{{obj.name}}</view>
				<view class="u-font-24" style="color:#C2C2C2">总计 <text style="color:#00B8A2">{{setTotal}}</text> kcal
				</view>
			</view>
			<view style="flex:1;display: flex;justify-content: flex-end;">
				<my-button width="328" height="72" @click="submit(1)">确定</my-button>
			</view>

		</view>
		<meal-popup :name="obj.name" @submit="mealSubmit" @submitSunFood="submitSunFood" ref="mealPopup"></meal-popup>
		<u-popup closeable z-index="10067" v-model="show" mode="bottom" border-radius="24" safe-area-inset-bottom>
			<scroll-view scroll-y="true" @scrolltolower="onreachBottom1"
				:style="{height: scrollHeight + 'px',paddingTop:'40rpx',paddingBottom:'20rpx'}">
				<view @click="record(v)" class="u-flex u-flex-items-stretch u-p-32 borderBottom"
					v-for="(v,i) of addList" :key="i">
					<u-image :border-radius="8" :src="v.images[0] || v.targetable && v.targetable.thumb" width="88"
						height="88"></u-image>
					<view class="u-m-l-16 " style="width:80%">
						<view class="u-font-28 text-bold u-line-1 u-m-b-10" style="width:100%">
							{{v.title || v.targetable && v.targetable.title || '快捷打卡'}}
						</view>
						<block v-if="obj.name === '运动'">
							<text class="u-font-24 u-m-r-40" style="color:#C2C2C2">{{ '时长: ' +v.minute + ' min'}}
							</text>
							<text class="u-font-24"
								style="color:#C2C2C2">{{'消耗: '+(v.total_kcal | filterNumParseInt) + ' kcal'}} </text>
						</block>
						<block v-else>
							<text class="u-font-24 u-m-r-40" style="color:#C2C2C2">{{'食用: '+v.g + ' g'}} </text>
							<text class="u-font-24"
								style="color:#C2C2C2">{{('热量: ' +(v.heat_amount | filterNumParseInt)) + ' kcal'}}
							</text>
						</block>

					</view>
					<view class="u-flex-xy-center u-flex-end" style="flex:1">
						<image @click.stop="remove(v)" :src="`${imgUrl}icon_delete.png`"
							style="width: 48rpx;height: 48rpx;" mode="widthFix"></image>

					</view>
				</view>

			</scroll-view>
			<view class="quantity-fixed safe-area-inset-bottom" style="position: relative;">

				<view class="quantity-fixed-box" :style="{backgroundImage:bgUrl} ">
					<u-badge type="error" :offset="[10,0]" :count="count"></u-badge>
				</view>
				<view class="u-flex-column u-m-l-40 u-relative">
					<view class="u-font-28 text-bold u-m-b-4">{{obj.name}} <u-icon @click="show = false" size="24"
							style="margin-left: 12rpx;" color="#c5c5c5" name="arrow-down-fill"></u-icon> </view>
					<view class="u-font-24" style="color:#C2C2C2">总计 <text style="color:#00B8A2">{{ setTotal}}</text>
						kcal</view>
				</view>
				<view style="flex:1;display: flex;justify-content: flex-end;">
					<my-button width="328" height="72" @click="submit(2)">确定</my-button>
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	import mealPopup from '../components/quantity/mealpopup/mealpopup.vue'
	const nameArr = [{
		name: '早餐',
		url: 'tabbar_breakfast.png',
		meals: 1
	}, {
		name: '午餐',
		url: 'tabbar_lunch.png',
		meals: 3
	}, {
		name: '晚餐',
		url: 'tabbar_dinner.png',
		meals: 5
	}, {
		name: '早餐加餐',
		url: 'tabbar_snack.png',
		meals: 2
	}, {
		name: '午餐加餐',
		url: 'tabbar_snack.png',
		meals: 4
	}, {
		name: '晚餐加餐',
		url: 'tabbar_snack.png',
		meals: 6
	}, {
		name: '运动',
		url: 'tabbar_sport.png'
	}, ]
	export default {
		data() {
			return {
				meals: '',
				activeDate: '', //日期
				toView: '',
				page: 1,
				carlistpage: 1,
				carlistlength: 0,
				length: 0,
				addFoodType: false, //是否由添加自定义食物页面跳转来的
				scrollHeight: 300, //弹窗滚动高度
				boxHeight: 0, //食材盒子高度
				recordObj: {}, //食材记录
				show: false, //详情弹框
				paddingBottom: 0,
				swiperHeight: '800rpx',
				obj: {},
				keyword: '',
				placeholder: '请输入食物名称',
				bgUrl: 'url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/tabbar_breakfast.png")',
				tablist: [],
				list: [],
				addList: [], //添加详情列表
				count: 0,
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				userId: ''
			}
		},
		computed: {
			setTotal() {
				let val = 0
				if (this.addList.length) {
					this.addList.map(res => {

						val += Number(this.obj.name === '运动' ? res.total_kcal : res.heat_amount)


					})
					val = parseFloat(val.toFixed(2))
				}
				return ' ' + val + ' '
			}
		},
		async onShow() {
			console.log(this.current)
			this.page = 1
			this.carlistpage = 1
			if (this.obj.name === '运动') {
				await this.getSportList() //食材列表

			} else {

				await this.getFoodList() //食材列表
				if (!this.addFoodType) {
					this.getCarList() //打卡记录
				}

			}
		},
		async onLoad(option) {

			if (option.userId) this.userId = option.userId
			
			this.addFoodType = option.addFoodType //来自添加自定义食物
			this.obj.name = option.name //运动或者其他餐次名称
			this.activeDate = option.activeDate //日期
			this.bgUrl =
				`url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/${nameArr.find(res=>res.name === this.obj.name)?.url}")`


			console.log(this.obj)
			this.uploadData()


			// if (this.obj.name === '运动') {
			// 	uni.setNavigationBarTitle({
			// 		title: '添加运动'
			// 	})
			// 	this.placeholder = '请输入运动名称'
			// 	await this.getSportClass() //运动类型tab
			// 	await this.getSportList() //运动列表
			// 	this.getCarList() //打卡记录

			// } else {
			// 	uni.setNavigationBarTitle({
			// 		title: '添加食物'
			// 	})
			// 	this.meals = nameArr.find(res => res.name === this.obj.name)?.meals
			// 	await this.getFoodList() //食材列表
			// 	if (!this.addFoodType) {
			// 		this.getCarList() //打卡记录
			// 	}

			// }
			// uni.createSelectorQuery().select('.quantity-fixed').boundingClientRect(res => {
			// 	this.paddingBottom = option.addFoodType ? 0 : res.height
			// 	console.log(222, res)
			// }).exec()
			// setTimeout(() => {
			// 	uni.createSelectorQuery().select('.borderBottom').boundingClientRect(res => {
			// 		this.boxHeight = res.height
			// 		console.log(1111, res)
			// 	}).exec()
			// }, 200)

		},
		components: {
			myButton,
			mealPopup
		},
		methods: {
			async uploadData(){
				if (this.obj.name === '运动') {
					uni.setNavigationBarTitle({
						title: '添加运动'
					})
					this.placeholder = '请输入运动名称'
					await this.getSportClass() //运动类型tab
					await this.getSportList() //运动列表
					this.getCarList() //打卡记录
				
				} else {
					uni.setNavigationBarTitle({
						title: '添加食物'
					})
					this.meals = nameArr.find(res => res.name === this.obj.name)?.meals
					await this.getFoodList() //食材列表
					if (!this.addFoodType) {
						this.getCarList() //打卡记录
					}
				
				}
				uni.createSelectorQuery().select('.quantity-fixed').boundingClientRect(res => {
					this.paddingBottom = this.addFoodType ? 0 : res.height
					console.log(222, res)
				}).exec()
				setTimeout(() => {
					uni.createSelectorQuery().select('.borderBottom').boundingClientRect(res => {
						this.boxHeight = res.height
						console.log(1111, res)
					}).exec()
				}, 200)
			},
			gotoSearch(){
				uni.navigateTo({
					url: `/pages/newHome/nutrition/foodSearch?keyword=${this.keyword}`
				})
			},
			setKeyWord(keyword){
				this.keyword = keyword
				// this.uploadData()
			},
			shoucang(v){
				console.log('v: ', v)
				
			},
			getSportClass() { //运动类型tab
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/SportDiart/sportsType',
						method: 'get',
						data: {
							page: 1,
							lengthNum: 40,
						}
					}).then(res => {
						res.data.data.forEach(v => {
							this.list.push({
								name: v.title,
								cid: v.id,
								children: []
							})
							this.tablist.push({
								name: v.title,
							})
						})
						//构造一个自定义类型
						this.list.push({
							name: '自定义',
							cid: 0,
							children: []
						})
						this.tablist.push({
							name: '自定义',
						})
						resolve()
					})
				})

			},
			getSportList() {
				return new Promise((resolve, reject) => {
					let data = {
						type: this.list[this.current]?.name === '自定义' ? 'SELF' : 'CURRENCY',
						cid: this.list[this.current]?.cid,
						date: this.activeDate + ' 00:00:00',
						title: this.keyword,
						page: this.page,
						lengthNum: 15,
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/SportDiart/sports',
						method: 'get',
						data
					}).then(({
						data
					}) => {

						if (this.page === 1) {

							this.list[this.current].children = []
							setTimeout(() => {
								this.list[this.current].children = data.data
								this.setCheckedKcal()
							}, 50)


						} else {
							setTimeout(() => {

								this.list[this.current].children = [...this.list[this.current]
									.children, ...data.data
								]
								this.setCheckedKcal()
							}, 50)
						}
						this.length = data.data.length

						resolve()

					})
				})
			},
			getFoodList() {
				return new Promise((resolve, reject) => {
					let data = {
						type: this.current ? 'SELF' : 'CURRENCY',
						page: this.page,
						lengthNum: 15,
						title: this.keyword,
						meals:this.meals
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV3/Mobile/Food/index',
						method: 'get',
						data
					}).then(({
						data
					}) => {

						if (this.page === 1) {
							this.list = [{
								name: '常用',
								children: []
							}, {
								name: '自定义',
								children: []
							}, ]
							this.tablist = [{
								name: '常用',
								children: []
							}, {
								name: '自定义',
								children: []
							}, ]
							setTimeout(() => { //重新滚动到顶部
								if (this.current) { //自定义
									this.list[1].children = data.data
								} else {
									this.list[0].children = data.data
								}
								this.setCheckedKcal()
							}, 50)



						} else {
							setTimeout(() => { //重新滚动到顶部
								if (this.current) { //自定义
									this.list[1].children = [...this.list[1].children, ...data
										.data
									]
								} else {
									this.list[0].children = [...this.list[0].children, ...data
										.data
									]
								}
								this.setCheckedKcal()
							}, 50)
						}
						this.length = data.data.length

						resolve()

					})
				})

			},
			setCheckedKcal() { //勾选显示kcal

				this.list[this.current].children.find(v => {
					v.checkedKcal = ''
					this.addList.forEach(res => { //构造数据

						if (v.id === res?.targetable?.id) {
							v.checkedKcal = this.obj.name === '运动' ? res.total_kcal : res
								.heat_amount
						}
					})

				})
				// for(let i = 0;i<this.addList.length;i++){
				// 	for(let j =0;j<this.list[this.current].children.length;j++){
				// 		if (v.id === res?.targetable.id) {
				// 			v.checkedKcal = this.obj.name === '运动' ? res.total_kcal : res
				// 				.heat_amount
				// 		}else {
				// 			v.checkedKcal = ''
				// 		}
				// 	}
				// }
			},
			addCustomFood() {
				uni.navigateTo({
					url: '/pages/newHome/nutrition/addCustomFood?userId=' + this.userId
				})
			},
			addSportCustom() {
				if (this.obj.name !== '运动') return this.addCustomFood()
				uni.navigateTo({
					url: '/pages/newHome/nutrition/addSportCustom?userId=' + this.userId
				})
			},
			chooseMedia() {
				let that = this
				wx.chooseMedia({
					count: 5,
					mediaType: ['image'],
					sourceType: ['camera', 'album'],
					success: function(res) {
						let images = res.tempFiles.map((res) => ({
							url: res.tempFilePath
						}))
						uni.navigateTo({
							url: '/pages/newHome/nutrition/addCustomFood?obj=' +
								encodeURIComponent(JSON.stringify({ images, meals: that.meals,
									activeDate: that.activeDate })) + '&userId=' + that.userId
						})


					}
				});
			},
			search(val) { //搜索
				console.log(val)
				this.page = 1
				if (this.obj.name === '运动') {
					this.getSportList()
				} else {

					this.getFoodList()
				}
			},
			popupShow() {
					
				if (this.count) {
					this.show = true
					//最多展示6条记录
					this.scrollHeight = (this.count > 5 ? this.boxHeight * 6 : this.boxHeight * this.count)

					console.log(this.scrollHeight)

				}

			},
			openMealPop(item) {
				this.recordObj = item
				let allowUpload = item.sub_foods && item.sub_foods.length //allowUpload 分区有没有子食材 
				this.$refs.mealPopup.open(item, false, allowUpload)
			},
			record(item) {

				this.recordObj = item

				if (!item.targetable) { // 区分快捷打卡跟其他打卡
					return uni.navigateTo({
						url: '/pages/newHome/nutrition/addCustomFood?obj=' +
							encodeURIComponent(JSON.stringify({ id: this.recordObj.id })) + '&userId=' + this
							.userId
					})

				}
				if (this.obj.name === '运动') { //数据结构不一样 重构
					this.recordObj.title = item.targetable?.title
					this.recordObj.thumb = item.targetable?.thumb
					this.recordObj.kcal = item.targetable?.kcal
					this.recordObj.sportVal = item.targetable?.total_kcal
				} else {

				}
				let allowUpload = item.sub_foods && item.sub_foods.length //allowUpload 分区有没有子食材 
				this.$refs.mealPopup.open(item, true, allowUpload) // true 修改


			},
			remove(item) {
				// this.addList.splice(index, 1)
				// this.count--
				this.delCarList(item)

			},
			submitSunFood(obj, type) { //type   false:新增  true:修改
				console.log('有子食材都到这里来', obj, type)
				let data = {
					id: type ? obj.id : 0, //修改  特别注意这个是记录id
					type: 'SELF', //子食材都默认self
					food_id: type ? obj.targetable.id : obj.id, //修改  特别注意这个才是食物id
					g: obj.g,
					date: this.activeDate + ' 00:00:00',
					meals: type ? obj.meals : this.meals,
					carbohydrate: this.setSub_foods('carbohydrate',obj.sub_foods),//obj.carbohydrate
					protein: this.setSub_foods('protein',obj.sub_foods),//obj.protein,
					fat: this.setSub_foods('fat',obj.sub_foods),//obj.fat,
					heat_amount: obj.heat_amount,
					sub_foods: obj.sub_foods
				}
				console.log('有子食材data: ', data)

				if (this.userId) data.user_id = this.userId
				this.$request({
					url: '/ApiV3/Mobile/HeatDiary/save',
					data
				}).then(res => {
					this.$common.toast('成功')
					this.carlistpage = 1
					this.getCarList() //打卡记录
				})
			},
			setSub_foods(name,item = []){
				let total = 0
				item.forEach(res=>{
					 total += res[name] * res.g / 100
				})
				return parseFloat(total.toFixed(2))
			},
			calculate_heat_amount(item = 0, val = 1) {
				let heat_amount = 0
				let carbohydrate = parseFloat(item.carbohydrate * val / 100)
				let protein = parseFloat(item.protein * val / 100)
				let fat = parseFloat(item.fat * val / 100)
				heat_amount = parseFloat((carbohydrate * 4 + protein * 4 + fat * 9).toFixed(2))

				return heat_amount
			},
			mealSubmit(val, type) {
				console.log(val)
				if (type) { //修改

					if (this.obj.name === '运动') {
						let data = {
							id: this.recordObj.id, //新增
							type: this.list[this.current].name === '自定义' ? 'SELF' : 'CURRENCY',
							minute: val,
							date: this.activeDate + ' 00:00:00',
							sport_id: this.recordObj?.targetable.id // 运动数据的id
						}
						if (this.userId) data.user_id = this.userId
						this.$request({
							url: '/ApiV3/Mobile/SportDiart/save',
							data
						}).then(res => {
							this.$common.toast('修改成功')
							this.carlistpage = 1
							this.getCarList() //打卡记录
						})
					} else {
						if (this.recordObj.targetable) { //正常打卡
							let data = {

								id: this.recordObj.id, //修改  特别注意这个是记录id
								type: this.recordObj.targetable.type,
								food_id: this.recordObj.targetable.id, //修改  特别注意这个才是食物id
								g: val,
								date: this.activeDate + ' 00:00:00',
								meals: this.meals,
								carbohydrate: parseFloat((this.recordObj.targetable.carbohydrate * val / 100).toFixed(
									2)),
								protein: parseFloat((this.recordObj.targetable.protein * val / 100).toFixed(2)),
								fat: parseFloat((this.recordObj.targetable.fat * val / 100).toFixed(2)),
								heat_amount: this.calculate_heat_amount(this.recordObj.targetable, val),
								// heat_amount: this.calculate_heat_amount(this.recordObj.targetable,val) ,
							}

							console.log('data: ', data)

							if (this.recordObj.sub_foods) {
								data.sub_foods = this.recordObj.sub_foods
							}
							if (this.userId) data.user_id = this.userId
							this.$request({
								url: '/ApiV3/Mobile/HeatDiary/save',
								data
							}).then(res => {
								this.$common.toast('修改成功')
								this.carlistpage = 1
								this.getCarList() //打卡记录
							})
						} else { //快捷打卡


						}


					}
				} else {
					if (this.addFoodType) { //直接添加并返回
						let pages = getCurrentPages()
						let page = pages[pages.length - 2];
						page.$vm.setList({
							...this.recordObj,
							g: val,
							type: this.keyword?this.recordObj.type: this.current ? 'SELF' : 'CURRENCY'
						})
						uni.navigateBack()
					} else { //添加
						if (this.obj.name === '运动') {
							let data = {
								id: 0, //新增
								type: this.list[this.current].name === '自定义' ? 'SELF' : 'CURRENCY',
								minute: val,
								date: this.activeDate + ' 00:00:00',
								sport_id: this.recordObj.id // 运动数据的id
							}
							if (this.userId) data.user_id = this.userId
							this.$request({
								url: '/ApiV3/Mobile/SportDiart/save',
								data
							}).then(res => {
								this.$common.toast('添加成功')
								this.carlistpage = 1
								this.getCarList() //打卡记录
								uni.requestSubscribeMessage({
									tmplIds: ['klo5DKVBtOJmE2qwaoWyc7albYe0oHez8S7Eh0cHNL8'],
									success(res) {
										console.log('success', res)

									},
									complete(res) {
										console.log('complete', res)
									}
								})
							})

						} else {
							let data = {
								id: 0, //新增
								type: this.keyword?this.recordObj.type: this.current ? 'SELF' : 'CURRENCY',
								food_id: this.recordObj.id, // 特别注意这个是食材id
								g: val,
								date: this.activeDate + ' 00:00:00',
								meals: this.meals,
								carbohydrate: parseFloat((this.recordObj.carbohydrate * val / 100).toFixed(2)),
								protein: parseFloat((this.recordObj.protein * val / 100).toFixed(2)),
								fat: parseFloat((this.recordObj.fat * val / 100).toFixed(2)),
								heat_amount: this.calculate_heat_amount(this.recordObj, val),
								// heat_amount: parseFloat((this.recordObj.heat_amount * val /100).toFixed(2)),
							}
							console.log('data111: ', data)

							if (this.recordObj.sub_foods) {
								data.sub_foods = this.recordObj.sub_foods
							}
							if (this.userId) data.user_id = this.userId
							this.$request({
								url: '/ApiV3/Mobile/HeatDiary/save',
								data
							}).then(res => {
								this.$common.toast('添加成功')
								this.carlistpage = 1
								this.getCarList() //打卡记录
								uni.requestSubscribeMessage({
									tmplIds: ['klo5DKVBtOJmE2qwaoWyc7albYe0oHez8S7Eh0cHNL8'],
									success(res) {
										console.log('success', res)

									},
									complete(res) {
										console.log('complete', res)
									}
								})
							})
						}
						// this.count++
						// this.addList.push({...this.recordObj,nutritionVal:val})
					}

				}

			},
			delCarList(item) { //删除打卡记录
				let url = this.obj.name === '运动' ? '/ApiV3/Mobile/SportDiart/del' : '/ApiV3/Mobile/HeatDiary/del'
				let data = {
					id: item.id
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url,
					data
				}).then(({
					data
				}) => {
					this.$common.toast('删除成功')
					this.carlistpage = 1
					this.getCarList()
				})
			},

			getCarList() { //打卡记录



				let url = this.obj.name === '运动' ? '/ApiV3/Mobile/SportDiart/records' : '/ApiV3/Mobile/HeatDiary/record'
				let data = {
					date: this.activeDate + ' 00:00:00',
					page: this.carlistpage,
					lengthNum: 15
				}
				if (this.userId) data.user_id = this.userId
				if (this.obj.name !== '运动') data.meals = this.meals


				this.$request({
					url,
					method: 'get',
					data
				}).then(({
					data
				}) => {
					let list = this.obj.name === '运动' ? data.list : data.data
					if (this.carlistpage === 1) {
						this.addList = list
					} else {
						this.addList = [...this.addList, ...list]
					}
					this.count = data.total || data.list.length //运动 跟 饮食的返回字段不一样
					if (!this.count) {
						this.show = false
					} else { //计算高度
						this.scrollHeight = (this.count > 5 ? this.boxHeight * 6 : this.boxHeight * this.count)
					}
					this.carlistlength = data.next_page_url
					this.setCheckedKcal()
				})
			},
			async submit(type) {

				if (this.obj.name === '运动') {
					if (type === 1) {


						uni.navigateBack()

					} else {
						this.show = false
					}
				} else {
					if (type === 1) {


						uni.navigateBack()

					} else {
						this.show = false
					}
				}

			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index
				// this.page = 1
				// if (this.obj.name === '运动') {
				// 	this.getSportList()
				// } else {

				// 	this.getFoodList()
				// }
				// console.log(index)
			},

			// 处理左右滑动的索引
			async handleSwiperCurrent(e) {
				this.current = e.detail.current
				this.page = 1
				if (this.obj.name === '运动') {

					this.getSportList()
				} else {

					this.getFoodList()
				}
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				console.log('到底了')
				if (this.length === 15) {
					this.page++
					if (this.obj.name === '运动') {
						this.getSportList()
					} else {
						this.getFoodList()
					}


				}
			},
			// scroll-view到底部加载更多
			onreachBottom1() {
				console.log('到底了')
				if (this.carlistlength) {
					this.carlistpage++
					this.getCarList()


				}
			}
		}
	}
</script>

<style lang="scss" scope>
	page {
		padding: 0;

	}

	::v-deep .u-badge {
		padding: 0 !important;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50% !important;

	}

	.container {
		background: #FFF;
		height: 100vh;
		.shoucang{
			    color: #9A9A9A;
			    background: #E7E7E7;
			    border-radius: 50%;
			    font-size: 40rpx;
			    font-weight: bold;
			    width: 48rpx;
			    height: 48rpx;
			    text-align: center;
			    line-height: 40rpx;
		}
		.quantity-fixed {
			position: fixed;
			bottom: 0;
			box-shadow: 0px -1px 24px 2px rgba(0, 0, 0, 0.04);
			background-color: #FFF;
			display: flex;

			width: 100%;
			min-height: 98rpx;
			padding: 14rpx;
			// height: 96rpx;

			&-box {
				height: 110rpx;
				width: 110rpx;
				position: relative;
				left: 34rpx;
				background-color: #FFF;
				border-radius: 50%;
				background-size: 80%;
				background-repeat: no-repeat;
				background-position: center;
				// box-shadow: 0px -1px 24px 2px rgba(0,0,0,0.04);
				top: -50rpx;
			}
		}

		.borderBottom {
			border-bottom: 1px solid #FAFAFA;
			background-color: #FFF;

			&:last-child {
				border-bottom: none;
			}
		}

		.empty {
			position: relative;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>