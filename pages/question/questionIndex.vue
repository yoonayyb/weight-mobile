<template>
	<view style="padding:25rpx">
		<view style="font-size: 36rpx;font-weight: bold;margin-bottom:24rpx">欢迎您使用均衡代谢管理小程序！</view>
		<view style="font-size: 36rpx;">接下来请回答一些问题来帮助我为你的健康状况进行初步的评估</view>
		<view
			style="text-align: center;width: 100%;bottom:112rpx;left: 0;" class="u-flex-xy-center u-absolute">
			<my-button fontSize="30"  @click="submit" width="584" height="80">下一步</my-button>
		</view>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	import { getLoginStatus } from '@/utils/common.js'
	export default {
		data() {
			return{
				
			}
		},
		components:{
			myButton
		},
		async onShow() {
			//判断当前登陆状态
			this.is_login = await getLoginStatus()
			if(!this.is_login){
				uni.navigateTo({
					url:'/pages/login/index?scene=question1'
				})
			}
			
		},
		methods:{
			submit(){
				uni.navigateTo({
					url: '/pages/question/question2?id=0&nextTabNum=1'
				})
			}
		}
	}
</script>
	
<style>
</style>