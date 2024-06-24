<template>
	<view class="container">
		<u-field
			label-width="230"
			input-align="right"
			v-model="name"
			label="喝水目标"
			required
			placeholder="请输入目标"
			:error-message="errorMessage1"
		>
		<view slot="right">ml</view>
		</u-field>
		
		<view class="u-flex-xy-center u-m-t-40">
			<my-button v-if="allowDel" @click="submit" :opacity="loading?0.6:1" width="562" height="80">保存</my-button>
		</view>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				loading:true,
				name:'',
				errorMessage1:'',
				userId:'',
				allowDel:false,
			}
		},
		onLoad(option){
			if(option.userId) this.userId = option.userId
			this.allowDel = option.allowDel
			this.getSeting()
			
		},
		components:{
			myButton
		},
		watch:{
			name(val){
				this.errorMessage1 = this.$u.test.number(val)?'':'请输入目标'
				this.loading = !!this.errorMessage1
				
				
			},
		},
		methods:{
			getSeting(){
				let data = {}
				if(this.userId) data.user_id = this.userId
					this.$request({
						url:'/ApiV3/Mobile/Diary/getSeting',
						method:'get',
						data
					}).then(res=>{
						
						this.name = res.data.water_target
						
					})
			},
			submit(){
				if(this.loading) return
				console.log('提交',this.name,)
				let data = {
						water_target:this.name
					}
				if(this.userId) data.user_id = this.userId
				this.$request({
					url:'/ApiV3/Mobile/Diary/seting',
					data
				}).then(res=>{
					this.$common.toast('设置成功')
					// let pages = getCurrentPages()
					// let page = pages[pages.length - 2];
					
					// page.$vm.water_target = parseFloat(this.name) 
					uni.navigateBack()
					
				})
				
			}
		}
	}
</script>

<style lang="scss" scope>
	.container {
		background: #f7f7f7;
		min-height: 100vh;
	}
</style>