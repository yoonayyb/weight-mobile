<template>
	<view >
		<u-popup closeable  v-model="show" width="638" border-radius="24" mode="center">
			<view class="u-p-32" style="background: white;">
				<view class="u-font-32 u-m-b-40" style="font-weight: bold;text-align: center;">小结</view>
				<scroll-view @scroll="scroll" :scroll-top="scrollTop" @scrolltolower="scrolltolower" v-if="list.length"
					scroll-y="true" style="height: 500rpx;padding-bottom:20rpx">
					<view class="u-m-10" v-for="(item,index) in list" :key="index">
						<view class="u-flex u-flex-items-start">
							<u-avatar :src="item.admin && item.admin.avatar" size="80"></u-avatar>
							<view class="u-m-l-10">
								<text class="u-font-28 u-line-1 u-m-b-10"
									style="font-weight: bold;">{{ item.admin.realname }}</text>
								<view class="u-font-24 u-line-1 " style="color: #C2C2C2;">{{ item.created_at }}</view>
							</view>
						</view>
						<view class="u-p-b-20">
							{{ item.comment }}
						</view>
					</view>
				</scroll-view>
				<view v-else class="empty">
					<image :src="`${imgUrl}v3-empty.png`" mode="scaleToFill" />
					<view style="margin-bottom: 20rpx">
						暂时没有小结
					</view>
				</view>
				<view>
					<u-input :custom-style="{borderRadius:'16rpx',background:'#F3F3F3',padding:'20rpx'}"
						v-model="textarea" type="textarea" height="190" auto-height />
					<view class="u-flex-xy-center u-m-t-20">

						<my-button @click="inputConfirm" width="292" height="82" margin="0 12rpx">提交</my-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				page: 1,
				length: '',
				textarea: '',
				list: [],
				show: false,
				userId: '', //用户id
				diaryId: '', //日记id

			}
		},
		components: {

			myButton,

		},
		methods: {
			async open({
				user_id = ''
			} = {}) {
				this.show = true
				this.userId = user_id
				this.page = 1
				this.getFeelData()
			},
			scroll(e) {
				
				this.old.scrollTop = e.detail.scrollTop
			},
			scrolltolower() {
				console.log(111, '底部')
				if (this.length) {
					this.page++
					this.getFeelData()
				}
			},
			// 获取小结列表
			getFeelData() {
				// if (this.diaryId === 0) return
				return new Promise((resolve, reject) => {
					const data = {

						page: this.page
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV2/Mobile/Diary/diaryComments',
						method: 'get',
						data
					}).then((res) => {
						if (this.page === 1) {
							this.list = res.data.data
						} else {
							this.list = [...this.list, ...res.data.data]
						}
						this.length = res.data.next_page_url
						resolve()
					})
				})

			},
			// input弹框点击确定的回调
			inputConfirm(value, type, showType) {
				let data = {
					user_id: this.userId,
					comment: this.textarea
				}
				// if (this.diaryId) data.id = this.diaryId
				this.$request({
					url: '/ApiV2/Mobile/Diary/diaryCommentPublish',
					data
				}).then(async (res) => {
					this.$common.toast('添加成功')
					this.textarea = ''
					this.diaryId = res.data.id
					this[showType] = false
					this.page = 1
					await this.getFeelData()
					// 解决view层不同步的问题
					this.scrollTop = this.old.scrollTop
					this.$nextTick(function() {
						this.scrollTop = 0
					});
				})
			}

		}
	}
</script>

<style lang="scss">
	.empty {
		text-align: center;
		margin: 0 auto;
		color: #888888;
		font-size: 28rpx;
		line-height: 56rpx;

		image {
			margin-top: 60rpx;
			height: 200rpx;
			width: 200rpx;
		}
	}
</style>
