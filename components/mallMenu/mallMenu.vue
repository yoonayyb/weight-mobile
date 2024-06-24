<template>
	<view class="u-wrap u-skeleton" :style="{'height':mallMenuHeight + 'px'}">
		<!-- <view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索</text>
			</view>
		</view> -->
		<view class="u-menu-wrap" v-if="tabbar.length">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop"
				:scroll-into-view="itemId">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item u-skeleton-rect"
					:class="[current == index ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(index)">

					<u-image :fade="false" mode="aspectFit" v-if="item.is_fsmp" width="162" height="158"
						:src="current == index ? item.selected_icon:item.not_selected_icon"></u-image>
					<text v-else class="u-line-2" style="text-align: center;">{{item.title}}</text>
				</view>
			</scroll-view>
			<scroll-view :scroll-top="scrollRightTop" refresher-enabled :refresher-triggered="trigger" @refresherrefresh="refresherrefresh"  style="flex: 1;min-width: 0;" scroll-y scroll-with-animation
				class="right-box" @scroll="rightScroll">
				<view class="page-view">
					
					<!-- <u-sticky v-if="tabbar.length" :offset-top="offsetTop">
						<view class="u-relative" style="left: -12rpx; background: #fff;height: 60rpx;width: 588rpx;">
							<u-image :fade="false" width="100%" height="60"
								v-if="stickyName.includes('dev-gp.oss-accelerate') || !stickyName"
								:src="stickyName"></u-image>
							<view v-else class="sticky-item u-line-1">
								{{stickyName}}


							</view>
						</view>

					</u-sticky> -->
					<!-- 加上一个sticky的高度 stickyHeight  -->
					<view class="class-item"
						:style="{'min-height': tabbar.length === index + 1? mallMenuHeight+ 'px':'auto'}"
						style="position: relative;" :id="'item' + index" v-for="(item , index) in tabbar" :key="index">
						<!-- <view class="empty_box" :style="{background:setBG(index)}">
							
						</view> -->
						
						<view class="item-title u-skeleton-rect" :class="{stickyClass:index === stickyStatus}" >
							<u-image :fade="false" v-if="item.is_fsmp" width="564" :height="60"
								:src="item.title_icon"></u-image>
							<view v-else class="u-line-1 item_title1"
							   :class="{stickyClass:index === stickyStatus}"
								style="line-height: 1.5;">
								{{item.title}}

							</view>


						
						</view>
						<view class="item-container">
							<block v-if=" item.goods.length">
								<view class="thumb-box "
									@click="jump({ url: 'home/shoppingMall/goodsDetails', data: { id: item1.id ,hospitalId:hospital_id} })"
									v-for="(item1, index1) in item.goods" :key="index1">

									<u-image width="144" height="144" class="item-menu-image u-skeleton-rect" :src="item1.thumb"
										mode=""></u-image>
									<view class="u-flex u-flex-column u-flex-between u-flex-1 ">
										<view class="item-menu-name u-line-2 u-skeleton-rect">{{item1.title}}</view>
										<view class="u-flex item-menu-mackprice u-skeleton-rect">

											<text class="unit">￥</text>
											<text>{{ item1.makepriceShow }}</text>
											<text class="float">{{ item1.float }}</text>
											<template v-if="Number(item1.makeprice) != item1.goodsprice">
												<text class="unit" style="color:#C2C2C2;margin-left: 8rpx;">￥</text>
												<text class="u-font-20"
													style="text-decoration: line-through;color:#C2C2C2;">{{ item1.goodsprice }}
												</text>
											</template>


										</view>
									</view>

								</view>

							</block>
							<view v-else class="u-flex u-p-24 u-flex-items-start"
								style="width: 100%;height: 192rpx;background: #fff;">

								<image :src="`${imgUrl}shopping_empty.png`" style="width:144rpx;height: 144rpx;margin-right: 20rpx;"
									slot="img" />
									
								<text style="color: #C2C2C2;">暂无商品</text>
								
							</view>
						</view>
						<view style="height: 600rpx;" class="u-flex" v-if="tabbar.length === index + 1">

							<u-image :fade="false" mode="aspectFit" width="540" height="108"
								:src="`${imgUrl}shopping_bottom.png`"></u-image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view v-else-if="!loading" class="u-flex u-flex-column u-flex-center" style="width: 100%;height: 100%;">
			<image :src="`${imgUrl}shopping_empty.png`" style="width:200rpx;height: 200rpx;" slot="img" />
			<text style="color: #C2C2C2;margin-top: 20rpx;">暂无商品</text>
		</view>

		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>
<script>
	export default {
		props: {
			mallMenuHeight: {
				type: Number,
				default: 0
			}
		},

		data() {
			return {
				hospital_id:uni.getStorageSync('hospitalId'),
				stickyStatus:0,
				enable: true,
				trigger: false,
				loading: true,
				stickyName: '',
				scrollTop: 0, //tab标题的滚动条位置
				oldScrollTop: 0,
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				itemId: '', // 栏目右边scroll-view用于滚动的id
				tabbar: [
					{
					   "title": "",
					   "goods": [{}]
					},
					{
					   "title": "",
					   "goods": [{}]
					},
					{
					   "title": "",
					   "goods": [{}]
					},
					{
					   "title": "",
					   "goods": []
					}
				],
				menuItemPos: [],
				arr: [],
				stickyIndex: 0,
				stickyHeight: uni.upx2px(80),
				offsetTop: 0,
				scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
				timer: null, // 定时器

			}
		},
		onLoad() {

		},
		mounted() {
			if (!uni.getStorageSync('token')) return
			this.updata()
		},
		computed: {
			
		},
		methods: {
			jump({
				url = '',
				data = ''
			}) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			},
			async refresherrefresh(){
			   this.trigger = true
			   this.search()
			  
			},
			
			async updata() {
				
				
				await this.getGoodsList()
					this.getMenuItemTop();
					this.getElRectTop('page-view', 'offsetTop');
					
				// this.scrollRightTop = this.oldScrollTop = 0
				// this.swichMenu(0)
			},
			async search() {
				
				
				await this.getGoodsList()
				this.arr = []
				setTimeout(()=>{
				
					// this.scrollRightTop = this.oldScrollTop = 0
					this.swichMenu(0)
				},100)
				
				// this.getElRectTop('page-view', 'offsetTop');
				
				
			},
			// 获取商品列表数据
			getGoodsList() {
				let data = {
					// lengthNum: this.size,
					// page: this.page,
					// keywords
					// class_id: this.classifysList[this.current]?.id
				}
				if (this.$store.state.user.userInfo.role_id == 2){
					this.hospital_id = uni.getStorageSync('hospitalId')
					data.hospital_id = uni.getStorageSync('hospitalId') //只有营养师的时候传入hospital_id
				} 
				this.loading = true
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Goods/all',
						method: 'get',
						data
					}).then((res) => {
						// this.skeletonloading = false
						setTimeout(()=>{
							this.loading = false
						},500)
						
						this.trigger = false
						
						
						//如果暂未分类中没有数据就过滤掉
						const id0 = res.data.find(v=>v.id===0)
						if(!id0?.goods?.length){
							
							res.data = res.data.filter(v=>v.id!==0)
						}
						this.tabbar = res.data
						this.tabbar.forEach(v => {
							if (v.goods.length) {
								v.goods.forEach(e => {
									if (typeof e.makeprice === 'number') e.makeprice = e
									.makeprice + ''
									e.float = e.makeprice.split('.')[1]
									e.makepriceShow = e.makeprice.split('.')[0] + '.'
								})
							}
						})
						
						// this.stickyName = this.tabbar[0].title

						this.$emit('reflesh', true)
						// this.reflesh = true
						resolve()
					}).catch(err => {
						// this.skeletonloading = false
						this.trigger = false
						this.loading = false

					})
				})

			},
			fixed(index) {
				
				this.stickyIndex = index
			},
			unfixed(index) {
				
				if (index === 0) return
				this.stickyIndex = index - 1
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (this.arr.length == 0) {
					await this.getMenuItemTop();
				}
				if (index == this.current) return;
				this.scrollRightTop = this.oldScrollTop;
				this.$nextTick(function() {
					this.scrollRightTop = this.arr[index];

					this.current = index;
					this.leftMenuStatus(index);
				})
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass, dataVal);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
						resolve();
					}).exec();
				})
			},
			// px转rpx
			pxToRpx(px) {
				const screenWidth = uni.getSystemInfoSync().screenWidth
				return (750 * Number.parseInt(px)) / screenWidth
			},
			// 获取一个目标元素距离顶部的高度
			getElRectTop(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						rect: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRectTop(elClass, dataVal);
							}, 10);
							return;
						}
						this[dataVal] = this.pxToRpx(res.top);

						
						resolve();
					}).exec();
					// query.select('.' + elClass).fields({
					// 	size: true
					// }, res => {
					// 	// 如果节点尚未生成，res值为null，循环调用执行
					// 	if (!res) {
					// 		setTimeout(() => {
					// 			this.getElRectTop(elClass);
					// 		}, 10);
					// 		return;
					// 	}
					// 	this[dataVal] = res.top;
					// 	
					// 	resolve();
					// }).exec();
				})
			},
			// 观测元素相交状态
			async observer() {
				this.tabbar.map((val, index) => {
					let observer = uni.createIntersectionObserver(this);
					// 检测右边scroll-view的id为itemxx的元素与right-box的相交状态
					// 如果跟.right-box底部相交，就动态设置左边栏目的活动状态
					observer.relativeTo('.right-box', {
						top: 0
					}).observe('#item' + index, res => {
						if (res.intersectionRatio > 0) {
							let id = res.id.substring(4);
							this.leftMenuStatus(id);
						}
					})
				})
			},
			// 设置左边菜单的滚动状态
			async leftMenuStatus(index) {
				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取右边菜单每个item到顶部的距离
			getMenuItemTop() {
				new Promise(resolve => {
					let selectorQuery = uni.createSelectorQuery().in(this);
					selectorQuery.selectAll('.class-item').boundingClientRect((rects) => {
						// 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
						if (!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop();
							}, 10);
							return;
						}

						rects.forEach((rect, index) => {
							// 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
							this.arr.push(rect.top - rects[0].top) // 加上sticky的高度
							if (index === 0 && this.arr.length) this.arr[0] = this.arr[0] 
							
							// 
							resolve();
						})
					}).exec()
				})
			},
			// 右边菜单滚动
			async rightScroll(e) {
				this.oldScrollTop = e.detail.scrollTop;

				if (this.arr.length == 0) {
					await this.getMenuItemTop();
				}
				// this.arr.forEach((v,index)=>{
				// 	
				// 	if( this.oldScrollTop >= this.arr[index] && this.arr[index+1] <this.oldScrollTop){
				// 		this.stickyName =index? this.tabbar[index+1].name:this.tabbar[0].name
				// 		
				// 		
				// 		
				// 		

				// 	}else if(this.oldScrollTop <= this.arr[0]){
				// 		this.stickyName = this.tabbar[0].name
				// 	}
				// })
				if (this.timer) return;
				if (!this.menuHeight) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
				}
				setTimeout(() => { // 节流
					this.timer = null;
					// scrollHeight为右边菜单垂直中点位置
					let scrollHeight = e.detail.scrollTop;


					for (let i = 0; i < this.arr.length; i++) {
						let height1 = this.arr[i];
						let height2 = this.arr[i + 1];

						if ((scrollHeight > 0 || i === 0) && i < this.tabbar.length) {
							this.stickyStatus = i
							// this.stickyName = this.tabbar[i].title
							// if (this.tabbar[i].is_fsmp) this.stickyName = this.tabbar[i].title_icon
						}

						if (scrollHeight < 0) {
							return
						}
						

						// 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
						if (!height2 || scrollHeight >= height1 && scrollHeight < height2) {
							
							this.leftMenuStatus(i);

							return;
						}

					}
				}, 0)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		// height: calc(100vh);
		// /* #ifdef H5 */
		// height: calc(100vh - var(--window-top));
		// /* #endif */
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 162rpx;
		height: 100%;
		background: #fff;
		// padding: 0 6rpx;
	}

	.u-tab-item {
		min-height: 146rpx;
		// background: #f6f6f6;
		background: #fff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #9A9A9A;
		font-weight: 400;
		margin:6rpx;
		// line-height: 1;
	}
	.u-tab-item:first-child{
		margin-top:0
	}
	.u-tab-item-active {
		position: relative;
		color: #00B8A2;
		font-size: 28rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-tab-item-active::after {
		content: "";
		position: absolute;
		border-left: 4rpx solid #00B8A2;
		height: 100%;
		right: -4rpx;
		top: 0;
	}

	// .u-tab-view {
	// 	height: 100%;
	// }

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		// padding: 0 12rpx;
	}
	.empty_box{
		height: 88rpx;
		    width: 100%;
			background-color: #fff;
			position: absolute;
			top: 0;
			left: 0;
	}
	.class-item {
		// margin-bottom: 30rpx;
		// background-color: #fff;
		// padding: 16rpx;
		border-radius: 8rpx;
	}

	.class-item:last-child {
		// min-height: 100vh;
	}

	.item-title {
		display: flex;
		height: 60rpx;
		position: sticky;
		top: 0;
		z-index: 99999;
		background: #FAFAFA;
		// font-weight: 600;
		// font-size: 32rpx;
		// padding:24rpx 12rpx 20rpx 12rpx;
		// background-color: #FAFAFA;
		// color: #000;
	}

	.item_title1 {
		
		display: inline-block;
		position: relative;
		font-weight: 600;
		font-size: 32rpx;
		padding: 12rpx 12rpx 12rpx 12rpx;
		// background-color: #fff;
		color: #2A2A2A;
		max-width: 100%;
		z-index: 1;
	}

	.item_title1::after {
		content: '';
		position: absolute;
		border-bottom: 4px solid rgba(0, 184, 162, 0.6); //#00B8A2
		height: 2rpx;
		width: calc(100% - 20rpx);
		top: 44rpx;
		left: 10rpx;
		z-index: -1;
	}

	.sticky-item {
		display: inline-block;
		position: relative;
		// height: 60rpx;
		line-height: 16rpx;
		font-weight: 600;
		font-size: 32rpx;
		padding: 24rpx 12rpx 12rpx 24rpx;
		// margin-bottom: 10rpx;
		background-color: #fff;
		color: #2A2A2A;
		max-width: 100%;
		z-index: 1;
	}
	.stickyClass{
		    background: #fff;
			
			// padding: 0 0 16rpx 6rpx;
	}
	// .stickyClass::after {
	// 	content: '';
	// 	position: absolute;
	// 	border-bottom: 4px solid rgba(0, 184, 162, 0.6); //#00B8A2
	// 	height: 2rpx;
	// 	width: calc(100% );
	// 	top: 34rpx;
	// 	left: 6rpx;
	// 	z-index: -1;
	// }
	.sticky-item::after {
		content: '';
		position: absolute;
		border-bottom: 4px solid rgba(0, 184, 162, 0.6); //#00B8A2
		height: 2rpx;
		width: calc(100% - 30rpx);
		top: 40rpx;
		left: 24rpx;
		z-index: -1;
	}

	// .class-item:first-child {
	// 	.sticky-item {
	// 		padding-top: 0;
	// 	}

	// }


	.item-menu-name {
		font-weight: normal;
		font-size: 28rpx;
		color: #4B4B4B;
		font-weight: 600;
		line-height: 48rpx;
		height: 88rpx;
		width: 100%;
	}

	.item-menu-mackprice {
		width: 100%;
		color: #FF4F40;
		font-size: 28rpx;
		align-items: baseline;

		.unit {
			font-size: 18rpx;
		}

		.float {
			font-size: 20rpx;

		}
	}

	.item-container {
		display: flex;
		background-color: #FAFAFA;
		flex-wrap: wrap;
		padding: 0 12rpx;
	}

	.thumb-box {
		width: 100%;
		height: 192rpx;
		display: flex;
		align-items: stretch;
		margin-top: 12rpx;
		background: #fff;
		padding: 24rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
	}

	.item-menu-image {
		width: 144rpx;
		height: 144rpx;
		margin-right: 20rpx;
	}
</style>