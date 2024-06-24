<template>
	<view class="container">
		<u-field
			label-width="230"
			input-align="right"
			v-model="name"
			label="运动名称"
			required
			placeholder="请输入名称"
			:error-message="errorMessage1"
		>
		</u-field>
		<u-field
			label-width="230"
			input-align="right"
			v-model="value"
			label="强度值（MET）"
			required
			placeholder="请输入强度值"
			:error-message="errorMessage2"
		>
		</u-field>
		<view class="u-flex-xy-center u-m-t-40">
			<my-button @click="submit" :opacity="loading?0.6:1" width="562" height="80">保存</my-button>
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
				value:'',
				errorMessage1:'',
				errorMessage2:'',
				userId:'',
			}
		},
		onLoad(option){
			if(option.userId) this.userId = option.userId
		},
		components:{
			myButton
		},
		watch:{
			name(val){
				this.errorMessage1 = val?'':'请输入名称'
				if(val && this.value){
					this.loading = false
				}else{
					this.loading = true
				}
			},
			value(val){
				this.errorMessage2 =val?'':'请输入强度值'
				
				if(val && this.name){
					this.loading = false
				}else{
					
					this.loading = true
				}
			}
		},
		methods:{
			submit(){
				if(this.loading) return
				console.log('提交',this.name,this.value)
				if(!this.$u.test.number(this.value)) return this.$common.toast('请输入数值类型的强度值')
				let data = {
					title:this.name,
					kcal:this.value,
					thumb:'',
				}
				if(this.userId) data.user_id = this.userId
				this.$request({
					url:'/ApiV3/Mobile/SportDiart/sportCreate',
					data
				}).then(res=>{
					this.$common.toast('添加成功')
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