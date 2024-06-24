<template>
	<u-popup  negative-top="30vh" duration="50" v-model="popupShow" border-radius="20" mode="center" >
		<view class="popup_content">
	 	<text class="popup_content_title">{{title}}</text>
			<text class="popup_content_box" >{{content}}</text>
			<view class="popup_content_foot">
				<my-button width="182" height="72" color="#00B8A2" bg="#FFFFFF" margin="0 12rpx" @click="popupShow = false">{{btLeft}}</my-button>
				<my-button width="182" height="72" margin="0 12rpx" @click="submit">{{btRight}}</my-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				popupShow:false,
			}
		},
		components:{
			myButton
		},
		props:{
			title:{
				type:String,
				default:'提示'
			},
			content:{
				type:String,
				default:''
			},
			btLeft:{
				type:String,
				default:'取消'
			},
			btRight:{
				type:String,
				default:'确定'
			},
		},
		methods:{
			open(){
				this.popupShow = true
			},
			submit(){
				this.popupShow = false
				this.$emit('submit')
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>