<template>
	<view class="container container_padding_bottom">
		<view class="feedbacks">
			<view class="feedback_item border_b" @click="handleItemClick(item)" v-for="(item,index) in list" :key="index">
				<view class="title u-line-1">
					<text>{{item.title}}</text>
				</view>
				<view class="content u-line-1">
					<text>{{item.content}}</text>
				</view>
				<view class="date light_color">
					<text>{{item.create_time | formatDate}}</text>
				</view>
			</view>
			<u-empty v-if="!list.length&&afterLoading" margin-top="200" text="暂无数据" mode="list"></u-empty>
		</view>
		<view class="footer_button">
			<my-button width="690" height="100" @click="jump({url:'mine/setting/suggest'})">新增意见反馈</my-button>
		</view>
		<u-popup v-model="feedbackDetailShow" border-radius="20" duration="50" mode="bottom">
			<view class="u-p-l-10 u-p-r-10 u-p-t-60 u-p-b-60">
				<scroll-view scroll-y="true" class="feedback_scroll_view">
					<view class="u-p-l-30 u-p-r-30">
						<view class="label_title">
							<text>反馈标题：</text>
						</view>
						<view class="title">
							<text>{{currentData.title}}</text>
						</view>
						<view class="label_title u-m-t-20">
							<text>反馈内容：</text>
						</view>
						<view class="content">
							<text>{{currentData.content}}</text>
						</view>
						<block v-if="currentData.reply">
							<view class="label_title u-m-t-20">
								<text>意见回复：</text>
							</view>
							<view class="content">
								<text selectable>{{currentData.reply}}</text>
							</view>
						</block>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				length:'',
				page: 1,
				list: [], //反馈列表
				currentData: {}, //当前点击反馈的数据
				feedbackDetailShow: false, //反馈详情的弹框
				afterLoading: false, //是否加载完
			}
		},
		onShow() {
			this.getFeedbackList()
		},
		// 触底加载更多
		onReachBottom() {
			if (this.length) {
				this.page++
				this.getFeedbackList()
			}
		},
		methods: {
			// 点击反馈打开弹窗
			handleItemClick(item) {
				this.currentData = item
				this.feedbackDetailShow = true
			},
			// 获取反馈列表数据
			getFeedbackList() {
				this.afterLoading = false
				this.$request({
					url: '/ApiV3/Mobile/FeedBack/index',
					loading: true,
					method:'get',
					data: {
						page: this.page
					}
				}).then(res => {
					this.afterLoading = true
					if (this.page === 1) {
						this.list = res.data.data
					} else {
						this.list = [...this.list, ...res.data.data]
					}
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
		},
		components: {
			myButton
		},
	}
</script>

<style lang="scss">
	.container {
		.feedbacks {
			.feedback_item {
				padding: 20upx 30upx;

				.title {
					font-size: 32upx;
					width: 670upx;
				}

				.content {
					width: 600upx;
					margin-top: 10upx;
					font-size: 24upx;
					color: #888888;
				}

				.date {
					margin-top: 5upx;
					font-size: 24upx;
				}
			}
		}
	}

	.feedback_scroll_view {
		max-height: 60vh;
		box-sizing: border-box;

		.label_title {
			color: #888888;
			font-size: 32upx;
		}

		.title {
			margin-top: 10upx;
		}

		.content {
			margin-top: 10upx;
		}
	}
</style>
