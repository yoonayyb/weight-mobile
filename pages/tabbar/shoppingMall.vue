<template>
	<view class="container" @click="login">
		<block v-if="token">
			<u-navbar id="navbar" z-index="10077" :border-bottom="false" :is-back="false" back-text="" title-width="750">

				<view class="slot-wrap u-font-32 text-bold" style="color:#2A2A2A">
					<view style="position: absolute;left: 24rpx;">
						<image @click="jump({url:'order/order'})" :src="`${imgUrl}shop-record.png`" mode=""
							style="margin-right: 16rpx;width:48rpx;height:48rpx"></image>
						<image @click="jumpCustomerMessage" :src="`${imgUrl}shop-message.png`" mode=""
							style="width:48rpx;height:48rpx"></image>
						<u-badge :offset="[-10,-10]" type="error" size="mini" :count="messageCount"></u-badge>
					</view>

					<text v-if="role_id === 1 || role_id === 3">商城</text>
					<view v-else @click="searchHospitalShow = true" style="display: flex;">
						<view style="max-width:316rpx;font-size: 32rpx;font-weight: bold;" class="u-line-1">
						{{hospital}}
						
						</view>
						<u-icon name="arrow-down" size="32rpx"></u-icon>
					</view>

				</view>
			</u-navbar>

			<u-mask :show="searchHospitalShow" @click="searchHospitalShow = false" z-index="10076">
				<view @tap.stop class="popup-hospital" :style="{top:navigateTop+ 'px'}">
					<view class="search" >
						<u-search @search="searchHospital" @change="$u.debounce(searchHospital, 300)" @focus="searchPageShow = true" @blur="searchPageShow = false"
							style="flex:1" :show-action="false" placeholder="搜索医院" v-model="hospitalKeyword" height="72"
							:clearabled="true"></u-search>

					</view>
					<view  style="padding: 32rpx;">
						<view style="font-size: 32rpx;margin-bottom:16rpx;font-weight: bold;">请选择所在地区</view>
						<view @click="showRegion = true"
							style="font-size: 28rpx;margin-bottom:16rpx;font-weight: bold;">{{area}}</view>
						<view v-if="showRegion" class="u-select__body">

							<picker-view @change="regionChange" @pickstart="loading = true" @pickend="loading = false"
								class="u-select__body__picker-view" :value="region">

								<picker-view-column>
									<view class="u-select__body__picker-view__item" v-for="(item, index) in regionList"
										:key="item.id">
										<view class="u-line-1">{{ item.name }}</view>
									</view>
								</picker-view-column>
								<picker-view-column>
									<view class="u-select__body__picker-view__item" v-for="(item, index) in areaList"
										:key="item.id">
										<view class="u-line-1">{{ item.name }}</view>
									</view>
								</picker-view-column>
								<picker-view-column>
									<view class="u-select__body__picker-view__item" v-for="(item, index) in cityList"
										:key="item.id">
										<view class="u-line-1">{{ item.name }}</view>
									</view>
								</picker-view-column>
							</picker-view>

						</view>
						<view v-else class="u-select__body">
							<block v-if="list.length">
								<picker-view @change="columnChange" @pickstart="loading = true"
									@pickend="loading = false" class="u-select__body__picker-view"
									:value="defaultSelector">
									<picker-view-column>
										<view class="u-select__body__picker-view__item" v-for="(item, index) in list"
											:key="index">
											<view class="u-line-1">{{ item.title }}</view>
										</view>
									</picker-view-column>
								</picker-view>
							</block>
							<view v-else
								style="display: flex;flex-direction: column;justify-content: center;align-items: center;margin-top: 10%;color:#C2C2C2;font-size: 28rpx;">

								<image :src="`${imgUrl}v3_shop_empty.png`"
									style="width:100rpx;height: 100rpx;margin-bottom:16rpx" slot="img" />
								<text>暂无搜索结果</text>
								<text>换一个地区试试</text>

							</view>
						</view>
						<view style="display: flex;justify-content: center;">
							<my-button width="184" height="72" color="#2A2A2A" border="#C2C2C2" margin="16rpx 24rpx"
								@click="hospReset">重置</my-button>
							<my-button width="184" height="72" :style="{opacity: loading? 0.6:1}" margin="16rpx 24rpx"
								@click="hospConfirm">确定</my-button>
						</view>
					</view>
				</view>
			</u-mask>
			<view id="searchNav" class="search ">
				<u-search disabled style="flex:1" @click="gotoSearch" :show-action="false" placeholder="搜索好物"
					v-model="keyword" height="72" :clearabled="true"></u-search>
					
					<image @click="jump({url:'home/shoppingMall/cart'})" :src="`${imgUrl}v3_tab_commodity_icon_shoppingcart.png`" mode=""
						style="width:48rpx;height:48rpx;margin-left:16rpx"></image>
				
			</view>
			<!-- <u-gap height="24" ></u-gap>
			<view class="u-skeleton-fillet" v-if="!keyword.trim()"  style="width:100vw;padding-left:32rpx">
				<u-tabs bg-color="#FAFAFA" duration="0" font-size="28" height="56" gutter="48" :active-item-style="activeItemStyle"
					:list="classifysList" :show-bar="false" :bold="false" :current="current" @change="change"></u-tabs>
			</view> -->
			<block v-if="!keyword.trim()">
				
					<mallMenu ref="mallMenu" :hospitalId="hospitalId" @skeletonloading="(type)=>{skeletonloading=type}" @reflesh="(type)=>{reflesh=type}"  :mallMenuHeight="mallMenuHeight"></mallMenu>
				
			</block>
		
				<scroll-view scroll-y @scrolltolower="scrolltolower" v-else style="text-align: center;background:#FAFAFA ;" :style="{height:mallMenuHeight + 'px'}">
					<view class="u-flex u-flex-wrap u-flex-items-start u-flex-start" style="height: 100%;" v-if="goodsList.length" >
						<goods-item class="u-flex u-flex-center" style="width: 50%;" v-for="(item, index) in goodsList" :key="index" :item="{...item}"></goods-item>
					</view>
					<view v-else class="u-flex u-flex-column u-flex-center" style="width: 100%;height: 100%;">
						<image :src="`${imgUrl}v3_shop_empty.png`" style="width:200rpx;height: 200rpx;" slot="img" />
						<text style="color: #C2C2C2;margin-top: 20rpx;">暂无搜索结果换一个关键词试试</text>
					</view>
				</scroll-view>
				
			

		</block>
		<view v-else class="u-flex-column u-flex-items-center" style="transform: translate(0, 100%);">
			<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_shop_nologin.png`" mode="">
			</image>
			<view  style="color:#C2C2C2;padding:16rpx 0">您当前尚未登录，请前往登录</view>
			<my-button @click="jumpLogin" width="176" height="72" >去登录</my-button>
			<!-- <view v-else   style="text-align: center;">
				<view class="u-m-b-10" style="color:#C2C2C2;padding:16rpx 0">暂无视频,请先登录</view>
				<my-button @click="jumpLogin" width="280" height="72" >去登陆</my-button>
			</view> -->
			
		</view>
		
		<u-tabbar :before-switch="beforeSwitch" active-color="#00B8A2" inactive-color="#C2C2C2" ref="custom-tabbar" height="120rpx" icon-size="60rpx"
			class="custom-tabbar" :list="tabbarList"></u-tabbar>
	</view>
</template>

<script>
	import goodsItem from '@/components/goodsItem.vue'
	import myButton from '@/components/myButton.vue'
	
	export default {
		data() {
			return {
				reflesh:false,
				messageCount: 0, //消息未读
				kefuId: '', //客服消息id
				tabbarList: this.$store.state.tabbar.list,
				loading: false,
				skeletonloading:true,
				searchHosDateDefaultSelector: [0], //搜索框医院默认数组
				searchPageShow: false, //搜索医院空白页
				searchHospitalDate: [], //搜索的医院数据
				region: [0, 0, 0], //省市区默认数组
				regionList: [], //省数据
				areaList: [], //市数据
				cityList: [], //区数据
				defaultSelector: [0], //单列搜索医院默认数组
				address_id: '', //选中地区id
				showRegion: false, //省市区控件
				area: '全部', //当前选中省市区
				list: [],
				hospSize: 15,
				hospPage: 1,
				hospLength: 0,
				hospitalKeyword: '', //搜索医院入参
				navigateTop: 88, //搜索医院弹框默认移动距离
				mallMenuHeight:800,
				searchNav:0,
				searchHospitalShow: false, //营养师身份切换医院弹框控件
				hospital: '商城', //营养师身份当前选中navbar
				hospitalId: 0, //医院id
				role_id: '', //当前用户身份
				activeItemStyle: { //tab滑块样式
					background: '#00B8A2',
					color: '#FFFFFF',
					borderRadius: '36rpx',
					marginRight: '16rpx',
					// padding:'8rpx 28rpx'
				},
				keyword: '', //搜索商品
				current: 0,
				classifysList: [{
						name: '全部',
						id: 0
					}],
				length: 0,
				page: 1,
				size: 15,
				
				bannerList: [], //上传banner
				classifys: [], //分类
				goodsList: [], //商品列表数据
				inviterId: '',
				token:1
			}
		},
		watch: {
			'$store.state.user.userInfo.role_id'(val) {
				this.role_id = val
				console.log('this.role_id', this.role_id)
			},
			'$store.state.message.unreadCountTotal'(val) {
				console.log(val, '未读总数')
				this.messageCount = val
			}
		},
		
		async onLoad(option) {

			let that = this
			
			// uni.setStorageSync('hospitalId', 0)
			// this.$store.commit('sethospital_id',0)
			this.token = uni.getStorageSync('token')

			if (option.scene) {
				this.inviterId = option.scene
				this.$store.commit('setInviterId', this.inviterId)
				// if (this.token) this.submitInviterId()
			}
			// if (!this.token){
			// 	return this.skeletonloading = false
			// } 
			
			// await this.getElRect('#navbar','navigateTop')
			// await this.getElRect('#searchNav','searchNav')
			// console.log('this.navigateTop', this.navigateTop)
			// // let windowHeight = uni.getSystemInfo({
			// // 	success(v) {
			// // 		console.log('getSystemInfo', v)
			// // 		this.mallMenuHeight = v.windowHeight  - this.navigateTop - this.searchNav - uni.upx2px(120)
			// // 		console.log('this.mallMenuHeight', this.mallMenuHeight)
					
			// // 	}
			// // })
			// let windowHeight = uni.getSystemInfo().then(v=>{
			// 	console.log('getSystemInfo', v[1])
			// 	this.mallMenuHeight = v[1].windowHeight  - this.navigateTop - this.searchNav - uni.upx2px(120)
			// 	console.log('this.mallMenuHeight', this.mallMenuHeight)
			// })
			// try {
				
			// 	this.getClassifyList() //商品分类
			// 	this.getGoodsList() //商品列表
			// 	this.regionList = await this.getRegionList() //省市区
			// 	this.regionList = [{
			// 		name: '全部',
			// 		id: 0
			// 	}, ...this.regionList]
			// 	this.getHospitalList() //医院数据

			// } catch (e) {
			// 	//TODO handle the exception
			// 	console.log(e)
			// }

		},
		async onPullDownRefresh(){
			if(!this.token) return uni.stopPullDownRefresh();
			this.page = 1
			// await this.getGoodsList()
			uni.stopPullDownRefresh();
		},
		async onShow(){
			let that = this
			this.role_id = this.$store.state.user.userInfo.role_id
			console.log('this.role_id',this.role_id)
			this.token = uni.getStorageSync('token')
			this.page = 1
			if(!this.reflesh && this.token && this.role_id == 2){
				this.regionList = await this.getRegionList() //省市区
				this.regionList = [{
					name: '全部',
					id: 0
				}, ...this.regionList]
				// if(uni.getStorageSync('hospitalId')){
				// 	this.setHospital(uni.getStorageSync('hospitalId'))//如果有缓存就设置缓存的医院
				// }else{
				// 	await this.getHospitalList() //医院数据
				// }
				// await this.getHospitalList() //医院数据
				this.setHospital()
			}
			if(this.reflesh || !this.token) return
			this.skeletonloading = true
			 this.getElRect('#navbar','navigateTop')
			 this.getElRect('#searchNav','searchNav')
			
			let windowHeight = uni.getSystemInfo().then(v=>{
				console.log('getSystemInfo', v[1])
			
			
				this.mallMenuHeight = v[1].windowHeight  - this.navigateTop - this.searchNav - uni.upx2px(120) - v[1].safeAreaInsets.bottom //底部安全距离
				console.log('this.mallMenuHeight', this.mallMenuHeight)
			})
			
		
			
			// if(this.role_id == 2){
				
			// 	this.hospitalId = 0
			// } else{
			// 	this.hospitalId = null
			// }
			
			// await this.getClassifyList() //商品分类
			// this.getGoodsList() //商品列表
			
			//先执行一次off 否则多次执行
			// uni.$off('shoppingMall')
			// uni.$once('shoppingMall', async (data)=>{
			// 	console.log('监听到事件来自 update ，携带参数 msg 为：' + data);
				
			// 	this.skeletonloading = true
			// 	this.page = 1
			// 	this.getClassifyList() //商品分类
			// 	this.getGoodsList() //商品列表
			// 	this.regionList = await this.getRegionList() //省市区
			// 	this.regionList = [{
			// 		name: '全部',
			// 		id: 0
			// 	}, ...this.regionList]
			// 	this.getHospitalList() //医院数据
			// })
			
		},
		// 触底通知子组件加载更多
		onReachBottom() {
			if (this.length === this.size) {
				this.page++
				this.getGoodsList()
			}
		},
		methods: {
			setHospital(){
				return new Promise(async (resolve,reject)=>{
					const {
						data
					} = await this.$request({
						url: '/ApiV3/Mobile/Hospital/index',
						method: 'get',
						data: {
							lengthNum: this.hospSize,
							page: this.hospPage,
							is_my_store:1,//写死的
							hospital_id:uni.getStorageSync('hospitalId')
						}
					})
					if(data.total == 1){
						this.list = JSON.parse(JSON.stringify(data.data)) 
						this.area = this.hospital = data.data[0].title
						this.defaultSelector = [1]
					}else{
						this.getHospitalList()//如果找不到这个医院就获取全部医院数据
					}
					
				})
				
				// let obj  = this.list.find(v=>v.id == uni.getStorageSync('hospitalId'))
				// if(obj) this.area = this.hospital = obj.title === '全部'?'商城':obj.title
				// let index = this.list.map(v=>v.id).indexOf( Number(uni.getStorageSync('hospitalId')))
				// if(index > -1){
				// 	this.defaultSelector = [index]
				// }
				// console.log('indexindexindex',index)
				// console.log('1111111111111',this.defaultSelector)
			},
			scrolltolower(e){
				
				if (this.length === this.size) {
					this.page++
					this.getGoodsList()
				}
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				 new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery();
					query.select(elClass).fields({
						size: true
					}, res => {
						
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								return this.getElRect(elClass,dataVal);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
						console.log('this.navigateTop', this.navigateTop)
						resolve();
					}).exec();
				})
			},
			login(){
					if(this.token) return
					uni.navigateTo({
						url:'/pages/login/index'
					})
			},
			beforeSwitch(){
				
				const page = getCurrentPages()
				let pages = `/${page[page.length - 1]?.route ?? ''}`
				uni.setStorageSync('recordRoute',pages)
				return true
			},
			//医院数据
			async getHospitalList() {
				return new Promise(async (resolve,reject)=>{
					const {
						data
					} = await this.$request({
						url: '/ApiV3/Mobile/Hospital/index',
						method: 'get',
						data: {
							lengthNum: this.hospSize,
							page: this.hospPage,
							address_id: this.address_id,
							is_my_store:1,//写死的
							keywords:this.hospitalKeyword,
							
						}
					})
					
					if (this.hospPage === 1) {
						this.list = JSON.parse(JSON.stringify(data.data)) 
					} else {
						this.list = [...this.list, ...JSON.parse(JSON.stringify(data.data)) ]
					}
					if(this.area === '全部' && !this.list.find(v=>!v.id) && this.hospitalKeyword == '' || this.hospitalKeyword.trim() === '全部'){
						this.list.unshift({
							id: '',
							title: "全部"
						})
					}
					this.hospLength = data.data.length
					resolve()
				})
				
			},
			//获取省市区
			getRegionList(pid = '') {
				return new Promise(async (resolve, reject) => {
					const {
						data
					} = await this.$request({
						url: '/ApiV3/Mobile/Address/index',
						method: 'get',
						data: {
							pid,
						}
					})
					// let arr = [{name:'全国',id:0},...data]
					// console.log('arr', arr)
					resolve(data)

				})

			},
			// 跳转到im聊天
			jumpCustomerMessage() {
				if (!uni.getStorageSync('token')) return this.$common.jumpLogin()
				const {
					avatar,
					id,
					nickname
				} = this.$store.state.user.userInfo.customer_info
				uni.navigateTo({
					url: `/pages/message/messageChat?avatar=${encodeURIComponent(avatar)}&nick=${nickname}&friend_user_id=${id + ''}`
				})
			},
			hospReset() {
				this.hospitalKeyword = ''
				this.area = '全部'
				this.region = [0, 0, 0]
				this.areaList = []
				this.cityList = []
				this.address_id = ''
				this.getHospitalList()
				this.defaultSelector = [0]
			},
			hospSearchConfirm() {
				if (this.loading) return
				this.hospitalKeyword = this.searchHospitalDate[this.searchHosDateDefaultSelector[0]]
				this.hospital = this.hospitalKeyword
				this.searchHospitalShow = false
			},
			async hospConfirm() {
				if (this.loading) return
				if (this.showRegion) {
					this.hospPage = 1
					this.showRegion = false
					this.getHospitalList()
					this.defaultSelector = [0]
				} else {
					let arrIndex = Number(this.defaultSelector)
					let value = this.list[this.defaultSelector]
					console.log(value)
					this.hospital = value.title === '全部'?'商城':value.title
					
				    this.hospitalId = value.id || 0
					uni.setStorageSync('hospitalId', value.id || 0)
					this.$store.commit('sethospital_id',value.id || 0)
					this.page = 1
					this.current = 0
					// await this.getClassifyList()//重新获取商品分类
					if(this.keyword.trim()){
						this.getGoodsList()
					}else{
						
						this.$refs.mallMenu.search(this.hospitalId)
						
					}
					// this.getGoodsList()
					this.searchHospitalShow = false
				}

			},
			async regionChange(e) {

				const val = e.detail.value
				let data = {
						id: '',
						name: "全部"
					}

				if (this.region[0] !== val[0]) {
					// 如果滑动的是第一列数据，让二三列恢复到0
					// this.areaList = await this.getRegionList(this.regionList[val[0]].id)
					// // this.cityList = await this.getRegionList(this.areaList[0].id)
					// this.areaList.unshift(data)
					// // this.cityList.unshift(data)
					if (val[0] === 0) {
						this.areaList = []
						this.cityList = []

					}else{
						this.areaList = await this.getRegionList(this.regionList[val[0]].id)
						this.areaList.unshift(data)
					}

					this.area = this.regionList[val[0]].name + ' ' + (this.areaList[0]?.name ?? '') + ' ' + (this.cityList[0]?.name ?? '')
						

					this.region = [val[0], 0, 0]
					console.log('省', val)
				} else if (this.region[1] !== val[1]) {
					// 滑动的是第二列数据
					

					
					
					if (val[1] === 0) {
						this.cityList = []
					}else{
						this.cityList = await this.getRegionList(this.areaList[val[1]].id)
						this.cityList.unshift(data)
					}
					this.area = this.regionList[val[0]].name + ' ' + this.areaList[val[1]].name + ' ' + (this.cityList[0]?.name ?? '')
					this.region = [val[0], val[1], 0]
					console.log('市', val)
				} else {

					this.area = this.regionList[val[0]].name + ' ' + this.areaList[val[1]].name + ' ' + this.cityList[val[2]].name
					console.log('区', val)
					this.region = e.detail.value;
				}
				let index = this.area.indexOf('全部')
				this.area = index === 0 ? '全部' :this.area.replaceAll('全部','')
				let idIndex = this.area.split(' ').filter(v=>v).length
				console.log(111,idIndex)
				this.address_id = idIndex === 1? this.regionList[val[0]].id :idIndex === 2?this.areaList[val[1]].id:this.cityList[val[2]].id



				console.log(this.address_id)
				console.log(this.area)

				console.log(this.region)
			},
			columnChange(e) {

				this.defaultSelector = e.detail.value

				console.log(this.list.length)
				console.log('this.hospLength', this.hospLength)
				console.log('this.hospSize', this.hospSize)
				if (this.defaultSelector[0] + 1 === this.list.length && this.hospLength === this.hospSize) { //滚动到底部
					this.hospPage++
					this.getHospitalList()
				}
				console.log(this.defaultSelector)
			},
			columnChange1(e) {
			this.searchHosDateDefaultSelector = e.detail.value
				
				if (this.searchHosDateDefaultSelector[0] + 1 === this.list.length && this.hospLength === this.hospSize) { //滚动到底部
					this.hospPage++
					this.getHospitalList()
				}
				console.log(this.searchHosDateDefaultSelector)
			},
			searchHospital() {
				this.hospPage = 1

				this.getHospitalList()
				console.log(this.hospitalKeyword)
			},
			//跳到搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: `/pages/home/shoppingMall/shopSearch?keyword=${this.keyword}&hospitalId=${this.hospitalId}`
				})
			},
			setKeyWord(val) {
				this.keyword = val
				if(this.keyword.trim()){
					this.current = 0
				}
				this.page = 1
				this.getGoodsList()
			},
			//搜索
			search(val) {
				console.log(val)
			},
			change(index) {
				this.current = index

				this.page = 1
				this.getGoodsList()
				// this.getClassIdGoodsList(this.classifysList[index].id)
			},
			// 去登陆
			jumpLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			// 提交小程序码传进来的参数
			submitInviterId() {
				this.$request({
					url: '/ApiV2/Mobile/Bind/bindByScene',
					data: {
						scene_id: this.inviterId
					}
				}).then((res) => {
					console.log('提交成功小程序码传进来的参数: ', res)
				})
			},
			// banner跳转
			bannerJump(item) {
				if (item.appid === 'myapp') {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			//分类商品数据
			// getClassIdGoodsList(class_id) {
			// 	this.$request({
			// 		url: '/ApiV2/Mobile/Goods/index',
			// 		method: 'get',
			// 		data: {
			// 			lengthNum: this.size,
			// 			page: this.page,
			// 			class_id,
			// 			hospital_id:this.hospitalId
			// 		}
			// 	}).then((res) => {
			// 		console.log('res: ', res)
			// 		if (this.page === 1) {
			// 			this.goodsList = res.data.data
			// 		} else {
			// 			this.goodsList = [...this.goodsList, ...res.data.data]
			// 		}
			// 		this.length = res.data.data.length

			// 	})
			// },
			// 获取商品列表数据
			getGoodsList() {
				let data =  {
							lengthNum: this.size,
							page: this.page,
							keywords:this.keyword,
						}
				if(this.role_id === 2) data.hospital_id = this.hospitalId??'' //只有营养师的时候传入hospital_id
				
				return new Promise((resolve,reject)=>{
					this.$request({
						url: '/ApiV3/Mobile/Goods/index',
						method: 'get',
						data
					}).then((res) => {
						// this.skeletonloading = false
						console.log('res: ', res)
						
						
						if (this.page === 1) {
							this.goodsList = res.data.data
						} else {
							this.goodsList = [...this.goodsList, ...res.data.data]
						}
						this.length = res.data.data.length
						// this.reflesh = true
						resolve()
					}).catch(err=>{
						// this.skeletonloading = false
					})
				})
				
			},
			// 获取分类数据
			getClassifyList() {
				this.classifysList = []
				return new Promise((resolve,reject)=>{
					this.$request({
						url: '/ApiV2/Mobile/Goods/category',
						method: 'get',
						data:{
							hospital_id:this.hospitalId || 0
						}
					}).then((res) => {
					
						this.classifys = res.data
						this.classifysList.push({
							name: '全部',
							id: 0
						})
						res.data.map(e => {
							this.classifysList.push({
								name: e.title,
								id: e.id
							})
						})
						resolve()
					})
				})
				
			},
			// 公共跳转
			jump({
				url = '',
				data = ''
			}) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			}
		},
		components: {
			goodsItem,
			myButton,
			
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: calc( 100vh - env(safe-area-inset-bottom));
		::-webkit-scrollbar {
		  display: none;
		  width: 0 !important;
		  height: 0 !important;
		  -webkit-appearance: none;
		  background: transparent;
		}
		
		
		overflow:hidden;
		background: #FAFAFA;
		::v-deep .u-tab-item{
			// border-radius: 36rpx;
			// margin-right: 16rpx;
			// background: #F3F3F3;
		}
		.u-select {


			&__body {
				width: 100%;
				height: 300rpx;
				overflow: hidden;
				background-color: #fff;

				&__picker-view {
					height: 100%;
					box-sizing: border-box;

					&__item {
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 32rpx;
						color: $u-main-color;
						padding: 0 8rpx;
					}
				}
			}
		}

		.u-navbar-inner {
			margin-right: 0 !important;
		}

		.u-navbar-content-title {
			position: static !important;
		}

		.slot-wrap {
			// width: 100vw;

			display: flex;
			align-items: center;

		}

		.popup-hospital {
			position: absolute;
			top: 0;
			width: 100%;
			z-index: 10080;
			background-color: #FFFFFF;
			min-height: 600rpx;
		}

		.search {
			display: flex;
			align-items: center;
			padding: 20rpx 32rpx;
			background: #FFFFFF;
		}

		.banner {
			width: 750upx;
			height: 300upx;

			.swiper {
				width: 100%;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.classifys {
			padding: 0rpx 20rpx;
			padding-bottom: 30upx;
			display: flex;
			flex-wrap: wrap;

			.classify_item {
				margin-top: 30upx;
				flex-direction: column;
				justify-content: center;
				width: 25%;
				font-size: 24upx;

				image {
					width: 100upx;
					height: 100upx;
					border-radius: 50%;
					filter: drop-shadow(1px 3px 5px);
				}

				text {
					margin-top: 12upx;
				}
			}
		}

		.goods_list {
			// border-top: 30upx solid #f7f7f7;
		}
	}
</style>
