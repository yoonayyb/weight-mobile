<template>
	<view class="container">

		<u-navbar :is-back="false" :border-bottom="false" is-fixed title-width="750">
			<view class="slot-wrap u-absolute u-flex" style="left:20rpx;">
				<image @click="back" :src="`${imgUrl}nav_icon_back@2x.png`"
					style="width: 48rpx;height:48rpx;margin-right: 10rpx;"></image>
				<block v-if="active === 0">
					<image @click="jump({ url: 'mine/setting/setting' })" :src="`${imgUrl}v3_mine_setting.png`"
						style="width: 48rpx;height:48rpx;"></image>
				</block>
			</view>
			<view class="u-flex-x-center u-font-32 text-bold" style="color:#2A2A2A">

				{{active?'消息':'通知'}}
				<block v-if="active === 0">
					<span v-if="count > 0">({{count}})</span>
					<image @click="clearTip" :src="`${imgUrl}nav_icon_clean@2x.png`"
						style="width: 48rpx;height:48rpx;margin-left: 8rpx;">
					</image>
				</block>
			</view>


		</u-navbar>
		<block v-if="active === 0">
			<block v-if="data.length">


				<view @click="gotoDetail(item,index)" v-for="(item,index) of data" :key="index" class="box">
					<view class="box_title">
						<view class="u-flex-xy-center">
							<view class="u-flex-xy-center u-relative">
								<image :src="imgUrl+images[item.type]">

								</image>
								<u-badge :offset="[-4,0]" size="mini" type="error" is-dot :count="item.is_read?0:1">
								</u-badge>
							</view>
							<view v-if="item.type === 1">日记提醒</view>
							<view v-if="item.type === 2">物流提醒</view>
							<view v-if="item.type === 3">服务提醒</view>
							<view v-if="item.type === 4">订单提醒</view>


						</view>

						<view class="box_title_right">{{item.at_time | formatTime4}}</view>
					</view>
					<view class="box_content">
						<view v-if="item.show_type === 0">{{item.content.text}}</view>
						<block v-if="item.show_type === 2">
							<view>
								<text class="title tcolor" :style="{width:maxWidth}">订单号<text
										style="width:100%;display: inline-block;">
									</text></text>
								<text style="flex:1"> {{item.content.order_sn || ''}}</text>

							</view>
							<view>
								<text class="title tcolor" :style="{width:maxWidth}">物流状态<text
										style="width:100%;display: inline-block;">
									</text></text>
								<text v-if="!item.show" style="flex:1"> {{item.content.msg}}</text>
								<view v-else class="u-m-l-10" style="flex:1;padding-top:8rpx">
									<block
										v-if="item.data && item.data.express_info && item.data.express_info.data.length">
										<timelineItem
											v-for="(v,i) of item.data && item.data.express_info && item.data.express_info.data"
											:lastChilren="i=== item.data && item.data.express_info && item.data.express_info.data.length - 1"
											:key="i" color="#00B8A2">
											<view class="tripItem">
												<view class="title" :class="i===0?'title-first':''">{{v.status}}
													<text>{{v.ftime | formatTime3}}</text>
												</view>
												<rich-text :nodes="v.context"></rich-text>
											</view>

										</timelineItem>
									</block>
									<u-empty v-else-if="!item.show" margin-top="50" text="暂无数据" mode="list"></u-empty>

								</view>
							</view>
							<view @click.stop="readMore(item,index)"
								style="color:#C2C2C2;font-size: 24rpx;margin: 16rpx 0;justify-content: center;">

								{{!item.show?'点击查看更多物流详情':'收起'}}
								<u-icon style="margin-left:8rpx" size="32" color="#C2C2C2"
									:name="!item.show?'arrow-down':'arrow-up'"></u-icon>
							</view>
						</block>
						<block v-if="item.show_type === 1">
							<view v-for="(i,v) of item.content.values" :key="i.id">
								<text class="title tcolor" :style="{width:maxWidth}">{{i.k}}<text
										style="width:100%;display: inline-block;">
									</text></text>
								<text style="flex:1"> {{i.v}} </text>

							</view>
						</block>
						<!-- <block v-if="item.show_type === 4">
					<view v-for="(i,v) of item.content.values" :key="i.id">
						<text class="title tcolor">{{i.k}}<text style="width:100%;display: inline-block;">
							</text></text>
						<text style="flex:1"> {{i.v}} </text>

					</view>
				</block> -->
					</view>
				</view>
			</block>
			<view v-else class="u-flex-column u-flex-items-center" style="transform: translate(0, 100%);">
				<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_logis_empty.png`" mode="">
				</image>
				<view style="color:#C2C2C2;padding:16rpx 0">暂时没有通知</view>
			</view>
		</block>
		<block v-else>
			<view v-if="message.length">
				<u-gap height="24"></u-gap>
				<u-swipe-action :show="item.show" :index="index" v-for="(item, index) of message"
					:key="item.friend_user_id" @click="click" @open="open" :options="options">
					<view class="messageBox" @click="handleClick(item)">
						<!-- <image mode="aspectFill" :src="item.avatar" /> -->
						<u-avatar class="u-m-r-16"  size="96" :src="item.avatar"></u-avatar>
						<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
						<view class="messageBox-right" :style="{border:index=== message.length - 1?'none':''}">

							<view style="color:#2A2A2A" class="u-font-32 text-bold u-flex u-flex-between">
								<text class="u-line-1" style="width:60%">{{ item.nickname }}</text>
								<text style="color:#C2C2C2;font-weight: normal;"
									class="u-font-24">{{(item.created_at || '') | showTimePipe }}</text>
							</view>
							<view class="u-relative">
								<view class="u-line-1" style="width: 90%;min-height: 36rpx;">
									<!-- {{item.msg && item.msg.text || ''}} -->
									<block v-if="item.msg.type === 'TEXT'">
										<bolck v-for="(item2, index2) in item.virtualDom" :key="index2">
											<text v-if="item2.name === 'text'">{{ item2.text }}</text>
											<image v-if="item2.name === 'img'" :src="item2.src"
												style="width: 40rpx; height: 40rpx;margin: 0;" />
										</bolck>
									</block>
									<block v-if="item.msg.type === 'IMAGE'">
										<text>[图片]</text>
										
									</block>
									<block v-if="item.msg.type === 'VIDEO'">
										<text>[视频]</text>
										
									</block>
									<block v-if="item.msg.type === 'AUDIO'">
										<text>[语音]</text>
										
									</block>
									<block v-if="item.msg.type === 'QUESTION1'">
										<text>[知情同意书]</text>
										
									</block>
									<block v-if="item.msg.type === 'ASSESSMENT_REPORT_FORM' ||  item.msg.type === 'ASSESSMENT_REPORT_ASK'">
										<text>{{ item.msg.text }}</text>
										
									</block>
								</view>
								<u-badge :offset="[0, item.num<=99?0:-8]" size="mini" type="error"
									:class="{unoverflow:item.num<=99}" :count="item.num"></u-badge>
							</view>
						</view>
					</view>
				</u-swipe-action>
			</view>
			<view v-else class="u-flex-column u-flex-items-center" style="transform: translate(0, 100%);">
				<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_diary_empty.png`" mode="">
				</image>
				<view style="color:#C2C2C2;padding:16rpx 0">暂时没有消息</view>
			</view>
		</block>
		<u-popup v-model="popshow" mode="center" border-radius="24" width="638rpx" height="288rpx">
			<view class="u-flex-column u-flex-items-center u-flex-around" style="height: 100%;">
				<view class="u-font-32 text-bold">您还未完善个人信息</view>
				<view class="u-font-32 ">请先完善信息再进行操作</view>
				<view class="u-flex-y-center u-flex-around" style="width: 100%;">
					<my-button width="208" height="72" color="#00B8A2" bg="#FFFFFF" @click="popshow = false">取消
					</my-button>
					<my-button width="208" height="72" @click="gotoWrite('/pages/mine/invite/updatePersonalInfo')">去完善
					</my-button>
				</view>
			</view>
		</u-popup>
		<view class="quantity-fixed safe-area-inset-bottom">
			<view @click="changeTab(index)" class="quantity-fixed-box " v-for="(item,index) of bottomList" :key="index">
				<view class="u-relative u-flex-xy-center" style="padding: 0 30rpx;">
					<image :src="`${ imgUrl+ (active === index?item.selurl:item.norurl)}`"
						style="width: 48rpx;height: 48rpx;"></image>
					<u-badge :offset="[-12, item.num<=99?14:-8]" size="mini" type="error"
						:class="{unoverflow:item.num<=99}" :count="item.num"></u-badge>
				</view>
				<view :style="{color:active === index?'#00B8A2':'#C2C2C2'}" class="u-font-20">{{item.name}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'

	import timelineItem from '../components/chenbin-timeline/timelineItem.vue'
	import {
		emojiName,
		emojiMap,
		emojiUrl
	} from '@/utils/emojiMap'
	export default {
		data() {
			return {
				noOpen: false,
				options: [

					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				active: 0,
				infoScroll: 0,
				msgScroll: 0,
				bottomList: [{
					norurl: 'tab_icon_remind_nor@2x(1).png',
					selurl: 'tab_icon_remind_sel@2x(1).png',
					num: 0,
					name: '通知'
				}, {
					norurl: 'tab_icon_message_nor@2x(1).png',
					selurl: 'tab_icon_message_sel@2x(1).png',
					num: 0,
					name: '消息'
				}],
				maxWidth: '',
				page: 1,
				messagePage: 1,
				count: 0,
				length: '',
				popshow: false,
				data: [],
				message: [],
				list: [1, 1, 1],
				images: [
					'message_icon_diay@2x.png',
					'message_icon_diay@2x.png',
					'message_icon_logistics@2x.png',
					'message_icon_serve@2x.png',
					'message_icon_older@2x.png',

				]
			}
		},
		components: {
			myButton,

			timelineItem
		},
		onPageScroll(e) {
			if (this.active === 0) {
				this.infoScroll = e.scrollTop
			} else {
				this.msgScroll = e.scrollTop
			}
		},
		watch: {
			count(newValue, oldValue) {
				this.bottomList[0].num = newValue
			},
			'$store.state.message.msg': {
				handler(val) {


					this.message = uni.getStorageSync('messageList' + uni.getStorageSync('imUid')) && JSON.parse(uni
						.getStorageSync('messageList' + uni.getStorageSync('imUid'))) || []
					if(this.message.length){
						this.bottomList[1].num = this.message.map(v => v.num).reduce(function(p, c) {
							return p + c
						})
					}
					


				}
			},

		},
		onLoad(option) {
			if (option.active) this.active = Number(option.active)

			this.getData()
			this.getNotice()
			
			

		},
		onShow() {
			this.message = uni.getStorageSync('messageList' + uni.getStorageSync('imUid')) && JSON.parse(uni
				.getStorageSync('messageList' + uni.getStorageSync('imUid'))) || []
			if(this.message.length){
				this.bottomList[1].num = this.message.map(v => v.num).reduce(function(p, c) {
					return p + c
				})
			}
			
		},
		onReachBottom() {
			if (this.length) {
				this.page++
				this.getData()
			}
		},
		methods: {
			
			// 点击好友
			handleClick(item) {
				// 跳去与好友聊天
				this._jump({
					url: 'message/messageChat',
					data: {
						friend_user_id: item.friend_user_id,
						nick:item.realname || item.nickname,
						avatar: encodeURIComponent(item.avatar)
					}
				})
			},

			click(index, index1) {
				console.log(index, index1)
				if (index1 == 0) {
					this.message.splice(index, 1);


					this.noOpen = true
				}
				this.$forceUpdate()
				console.log(this.message)
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				if (this.noOpen) return
				console.log(index)
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.noOpen = false
				this.$set(this.message[index], 'show', true)
				this.message.map((val, idx) => {
					if (index != idx) this.$set(this.message[idx], 'show', false)
				})
				this.$forceUpdate()
				console.log(this.message)
			},

			changeTab(index) {
				this.active = index
				if (index === 0) {
					this.$nextTick(() => {
						// console.log(Number.isFinite(parseFloat(this.maxWidth)) )
						if(!Number.isFinite(parseFloat(this.maxWidth))){
							uni.createSelectorQuery().selectAll('.tcolor').boundingClientRect(res => {
							
								let maxWidth = Math.max(...res.map(v => v.width))
								console.log('maxWidth', maxWidth)
								this.maxWidth = maxWidth + 'px'
							}).exec()
						}
						

						uni.pageScrollTo({
							scrollTop: this.infoScroll,
							duration: 0
						})
					})

				} else {
					this.$nextTick(() => {
						uni.pageScrollTo({
							scrollTop: this.msgScroll,
							duration: 0
						})
					})

				}
			},
			getNotice() {
				this.$request({
						url: '/ApiV3/Mobile/Notice/unreadNum',
						method: 'GET'
					})
					.then((res) => {
						this.count = res.data.count

					})
					.catch(async (err) => {

					})
			},
			gotoDetail(item, index) {

				//设置已读
				if (item.is_read === 0) {
					this.$request({
						url: '/ApiV3/Mobile/Notice/read',
						data: {
							id: item.id,

						}
					}).then(res => {
						this.$set(this.data[index], 'is_read', 1)
						this.count--

					})
				}

				const {
					content: {
						page
					}
				} = item

				if (page) {
					let type = page.includes('pages/tabbar/') ? 'switchTab' : 'navigateTo'
					uni[type]({
						url: '/' + page
					})
				}
			},
			getDetail(content, index) {
				const {
					sn,
					code
				} = content
				this.$request({
					url: '/ApiV3/Mobile/Logistics/query',
					method: 'get',
					data: {
						express_code: code,
						express_no: sn
					}
				}).then(res => {

					this.$set(this.data[index], 'data', res.data)
					let reg = /（(.+?)）/g
					this.data[index].data?.express_info?.data.forEach(v => {
						let person = v.context.match(reg) && v.context.match(reg)[0]
						console.log('person', person)
						if (person) {
							v.context = v.context.replace(person,
								'<span class="title-first" style="color:#00B8A2">' + person +
								'</span>')

						}

					})
					this.data[index].show = true
					this.$forceUpdate()
				})
			},
			readMore(item, index) {
				console.log(item.show)

				this.$set(item, 'show', !item.show)
				this.$forceUpdate()
				if (this.data[index].show) {
					this.getDetail(item.content, index)
				}

				console.log(item)

			},
			clearTip() {
				let that = this
				uni.showModal({
					content: '是否全部标记为已读？',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							// let id = that.data.filter(v => !v.is_read).map(v => v.id).join(',')
							that.$request({
								url: '/ApiV3/Mobile/Notice/read',
								data: {
									id: 0,

								}
							}).then(res => {
								that.count = 0
								that.data.forEach(e => e.is_read = 1)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			back() {
				console.log('自定义返回')
				let pages = getCurrentPages()
				let page = pages[pages.length - 2];
				if (page) {
					let type = page.$page.fullPath !== '/pages/login/index' && 
						page.$page.fullPath !== '/pages/mine/message/index'
					if (type) {
						uni.navigateBack()
					} else {
						uni.switchTab({
							url: '/pages/tabbar/mine'
						})
					}
				} else {
					uni.switchTab({
						url: '/pages/tabbar/mine'
					})
				}

			},
			gotoWrite(url) {

				this.popshow = false
				uni.navigateTo({
					url
				})
			},
			getData() {
				this.$request({
					url: '/ApiV3/Mobile/Notice/index',

					method: 'get',
					data: {
						page: this.page
					}
				}).then(res => {
					if (this.page === 1) {
						this.data = res.data.data
						this.data.forEach(v => v.show = false)
					} else {
						this.data = [...this.data, ...res.data.data, ]
						this.data.forEach(v => v.show = !!v.show)
					}
					this.$nextTick(() => {
						uni.createSelectorQuery().selectAll('.tcolor').boundingClientRect(res => {

							let maxWidth = Math.max(...res.map(v => v.width))
							console.log('maxWidth', maxWidth)
							this.maxWidth = maxWidth + 'px'
						}).exec()
					})

					this.length = res.data.next_page_url
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
		}
	}
</script>

<style lang="scss" scoped>
	// page{
	// 	background: #FAFAFA;
	// 	min-height: 100vh;
	// }
	.container {

		background: #FAFAFA;
		min-height: 100vh;
		overflow: hidden;
		padding-bottom: 120rpx;

		.box {
			background: #FFFFFF;
			border-radius: 24rpx;
			padding: 32rpx;
			margin: 24rpx 32rpx;
			font-size: 28rpx;

			&_title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;

				image {
					width: 48rpx;
					height: 48rpx;
					margin-right: 8rpx;

				}

				&_right {
					color: #C2C2C2;
					font-weight: normal;
				}
			}

			&_content {
				>view {
					display: flex;
				}

				margin-top:20rpx;

				.tcolor {
					display: inline-block;
					color: #C2C2C2;
					margin-right: 16rpx;
					text-align: justify;
					// width: 180rpx;
					height: 40rpx;
				}
			}

			.tripItem {
				color: #C2C2C2;

				text {

					font-size: 24rpx;
					font-weight: normal;
				}

				.title {

					font-size: 28rpx;
					font-weight: bold;
					padding-bottom: 8rpx;

					text {
						margin-left: 8rpx;
					}

				}


			}

			.title-first {
				color: #00B8A2 !important;
			}

		}

		.messageBox {
			display: flex;
			width: 100vw;
			align-items: center;
			padding: 0 32rpx;
			background: #FFF;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				margin-right: 16rpx;
			}

			&-right {
				min-height: 136rpx;
				overflow: hidden;
				padding: 20rpx 0;
				border-bottom: 1px solid #F3F3F3;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;


			}

		}

		.quantity-fixed {
			position: fixed;
			bottom: 0;
			z-index: 9;
			background-color: #FFF;
			display: flex;
			width: 100%;
			// height: 96rpx;

			&-box {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 96rpx;
			}
		}

		.unoverflow {
			::v-deep .u-badge {
				padding: 0 !important;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50% !important;

			}

		}

	}
</style>
