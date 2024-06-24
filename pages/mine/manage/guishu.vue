<template>
	<view class="container">
		<u-gap height="24"></u-gap>
		<u-cell-group>
			<u-cell-item icon="" title="所属团队" :value="data.store_name" value-style="color:#C2C2C2" :arrow="false"></u-cell-item>
			<u-cell-item icon="" title="所属医院" :value="data.hospital_name" value-style="color:#C2C2C2"  :arrow="false"></u-cell-item>
		</u-cell-group>
		<u-gap height="24"></u-gap>
		<u-cell-group>
			<u-cell-item icon="" title="引流人" :value="data.sale_name" value-style="color:#C2C2C2" :arrow="false"></u-cell-item>
			<u-cell-item icon="" title="达成人" :value="data.belonger_name" value-style="color:#C2C2C2"  :arrow="false"></u-cell-item>
			<u-cell-item icon="" title="推荐人" :value="data.doctor_name" value-style="color:#C2C2C2"  :arrow="false"></u-cell-item>
			<u-cell-item icon="" title="干预人" :value="data.dietitian_name" value-style="color:#C2C2C2"  :arrow="false"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			   user_id:'',
			   data:{
				   
			   }
			}
		},
		onLoad(option) {
			if(option.user_id){
				this.user_id = option.user_id
			}
			this.getData()
		},
		components: {},
		methods: {
			
			getData(){
				let data = {
					
				}
				if(this.user_id)data.user_id = this.user_id
				this.$request({
					url:'/ApiV3/Mobile/Staff/bindInfo',
					method:'get',
					loading:true,
					data
				}).then(res=>{
					this.data = res.data.info
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