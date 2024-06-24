<template>
	<view class="container u-m-t-24">
		
		<u-input :custom-style="{padding:'0 32rpx'}" v-model="title" placeholder="请输入意见反馈标题" type="test"  />
		<u-gap bg-color="#FAFAFA" height="24"></u-gap>
		<u-input :custom-style="{padding:'24rpx 32rpx'}" maxlength="250" v-model="text" auto-height :height="480"  placeholder="请输入您的意见反馈" type="textarea"  />
		<u-gap bg-color="#FAFAFA" height="64"></u-gap>
		<view class="u-flex-x-center">
		 <my-button @click="submit" width="562" height="80">提交</my-button>
		 </view>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				title:'',
				text:'',
			}
		},
		components: {
		  
		  myButton
		},
		methods:{
			submit(){
				if(!this.title) return this.$u.toast('请输入标题')
				if(!this.text) return this.$u.toast('请输入意见反馈')
				this.$request({
					url:'/ApiV3/Mobile/FeedBack/save',
					data:{
						title:this.title,
						content:this.text
					}
				}).then(res=>{
					this.$common.toast('成功')
					uni.navigateBack()
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #FAFAFA;
		.container{
			background: #FFF;
		}
	}
</style>