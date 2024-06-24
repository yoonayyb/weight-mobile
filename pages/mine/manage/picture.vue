<template>
	<view class="container">
		<u-navbar   title=" ">
			<view @click="show = true" class="slot-wrap u-font-32" style="font-weight: bold;">
				<view class="u-line-1" style="max-width: 400rpx">{{text}}</view>
				<image :src="`${imgUrl}toBottom2.png`" style="width: 32rpx;height: 16rpx;margin-left: 6rpx;margin-top: 4rpx;" mode=""></image>
			</view>
		</u-navbar>
		<block v-if="imageList.length">
		<view class="box" v-for="(item,index) of imageList" :key="index" >
			<view class="u-font-32" @click="gotoDetail(item)" style="font-weight: bold;margin:0 16rpx;">
				{{item.plan_level_text}}（{{item.imgs.length}}/20）
			 <!-- <image @click.native.stop="save(item)" :src="`${imgUrl}v3_manage_camera.png`" style="width: 48rpx;height: 48rpx;float: right;" mode=""></image> -->
			  </view>
			<view class="u-font-24 u-m-t-24" style="color:#C2C2C2;margin:0 16rpx;;">{{item.plan_start_date_text}}</view>
			<view class="u-flex-y-center u-flex-wrap" >
				<view  style="position: relative;margin:0 16rpx;margin-top: 24rpx" class="u-flex-y-center" v-for="(v,i) of item.imgs" :key="i">
				<image @click="imgPreview(i,item.imgs)" style="width: 128rpx;height:128rpx;border-radius: 8rpx;"  :src="v.url">
				</image>
				<view class="close"  @click.stop="remove(item.id,v.id)">
				<u-icon name="close" color="#ffffff" size="24"></u-icon>
				</view>
				</view>
				<u-upload    :index="item.id" :show-progress="false" :show-upload-list="false" :max-count="20-item.imgs.length" :header="uploadHeader" :ref="'uUpload'+index" width="128" height="128"
				  :custom-btn='true' :auto-upload="false"   @on-choose-complete='(lists,name)=>{
					  uploaded(lists,name,"uUpload"+index)
				  }' 
				  @on-remove='onRemove'>
				  <!-- <u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon> -->
				  <view slot="addBtn" class="slot-btn u-m-t-24" hover-class="slot-btn__hover" hover-stay-time="150">
				    <image  style="width:128rpx;height:128rpx;border-radius: 8rpx;margin:0 16rpx;" :src="`${imgUrl}aftersales_icon_pic@2x.png`" mode="aspectFit"></image>
				  </view>
				</u-upload>
				<!-- <u-image @click.native.stop="preveiw(i,v)" class="u-m-r-16 u-m-b-16" v-for="(v,i) in item.imgs.slice(0,20)" :key="i" width="128rpx" height="128rpx" :src="v.url"></u-image> -->
			</view>
		</view>
		</block>
		
		<view class="v3_empty" v-else>
			<image  style="width: 200rpx;height: 200rpx;"
			  :src="`${imgUrl}v3_picture_empty.png`"></image>
			<view class="u-m-t-16">
				暂无照片上传
			</view>  
		</view>
		<u-select :default-value="defaultValue" @change="selectChange" safe-area-inset-bottom @confirm="confirm" mode="single-column" v-model="show" :list="list"></u-select>
	</view>
</template>

<script>
	import {
	  baseUrl_v2
	} from '@/utils/common.js'
	export default {
		data() {
			return {
				imgId:'',
				arr:[],
				defaultValue:[0],
				uploadHeader: {
				  //上传请求头
				  authorization: 'Bearer ' + uni.getStorageSync('token')
				},
				selectPage:1,
				selectLength:0,
				page:1,
				length:0,
				user_id:"",//会员id
				show:false,
				text:'全部照片',
				imageList:[],
				list:[],
				
			}
		},
		onLoad(option){
			this.user_id = option.user_id
			this.getIamgeList()//所有数据
			this.getIamgeSelectList()//所有select阶段数据
		},
		onReachBottom() {
			if(this.length){
				this.page = 1
				this.getIamgeList()
			}
		},
		methods:{
			imgPreview(index,urls){
				console.log(index,urls)
				uni.previewImage({
					current:index,
					urls:urls.map(v=>v.url)
				})
			},
			getIamgeSelectList(){
				this.$request({
					url:'/ApiV2/Mobile/WeightCycle/allImg',
					loading: true,
					errMsg: true,
					method:'get',
					data:{
						user_id:this.user_id,
						page:this.selectPage,
					}
				}).then(({data})=>{
					
					this.list = []
					if(this.selectPage === 1){
						this.list.push({
							value:'',
							label:'全部照片'
						})
						data.data.map((v,index)=>{
							this.list.push({
								value:v.id,
								label:v.plan_level_text + '('+v.plan_start_date_text+ ')'
							})
						})
						
					}else{
						data.data.map(v=>{
							this.list.push({
								value:v.id,
								label:v.plan_level_text + '('+v.plan_start_date_text+ ')'
							})
						})
					}
					this.selectLength = data.next_page_url
				})
			},
			async getIamgeList(){
				let data = {
					user_id:this.user_id,
					page:this.page,
				}
				if(this.imgId) data.id = this.imgId
			
				this.$request({
					url:'/ApiV2/Mobile/WeightCycle/allImg',
					loading: true,
					errMsg: true,
					method:'get',
					data
				}).then(({data})=>{
					
					
					
					
					if(this.page === 1){
						this.imageList = data.data.map(v => ({...v}) )
						
					}else{
						this.imageList = [...this.imagList.map(v=>v),...data.data.map(v=>v)]
						
					}
					this.$forceUpdate()
					this.length = data.next_page_url
				})
			},
			selectChange(e){
				
				if(this.list.length === e[0] + 1){
					if(this.selectLength){
						console.log('滚动到底部,还有数据')
						this.selectPage ++ 
						this.getIamgeSelectList()
					}else{
						console.log('滚动到底部,没有数据')
					}
					
				}
			},
			
			remove(id,imgId){
				let data = {
				  id,
				  user_id: this.user_id,
				  img_ids: [imgId]
				}
				this.$request({
				    url: '/ApiV2/Mobile/WeightCycle/delImg',
				    method: 'post',
				    loading: true,
				    errMsg: true,
				    data
				  }).then((res) => {
					this.page = 1
					this.getIamgeList()
				    this.$common.toast('删除成功')
				  })
			},
			onRemove (index, lists, name) {
				console.log(index)
				console.log(lists)
				console.log(name)
				console.log(111,this.imageList.find(v=>v.id == name).imgs[index])	
				// console.log(lists)
				return
			
				let data = {
				  id: name,
				  user_id: this.user_id,
				  img_ids: [this.imageList.find(v=>v.id == name)?.imgs[index]?.id]
				}
				this.$request({
				    url: '/ApiV2/Mobile/WeightCycle/delImg',
				    method: 'post',
				    loading: true,
				    errMsg: true,
				    data
				  }).then((res) => {
					this.page = 1
					this.getIamgeList()
				    this.$common.toast('删除成功')
				  })
				
			},
			beforeUpload(){
				console.log('选完图片后触发')
				uni.showLoading({
				  title: '加载中',
						mask:true
				})
			},
			async uploaded (lists,name,index,length) {
				 if(length>=20) return this.$common.toast('最多只能上传20张照片')
				
				let tasks = lists.map(async v=>{
					return await this.$common.uploadParams(v.file.path)
				})
				Promise.all(tasks).then(async res=>{
					console.log('promiseAll',res)
					let urls = res.map(v=>v.key)
					await this.uploadImage({id:name,user_id:this.user_id,urls})
					console.log('执行完毕')
					  this.page = 1
					  this.getIamgeList()
					  this.$refs[index][0].clear()
				})
			  
			},
			uploadImage(option){
				console.log('添加到用户图片中')	
				return new Promise((resolve,reject)=>{
					this.$request({
						url:'/ApiV2/Mobile/WeightCycle/addImg',
						loading: true,
						errMsg: true,
						data:{...option}
					}).then(res=>{
						  // this.$common.toast('上传成功')
						  
							resolve()
						  
						 
					})
				})
			},
			
			gotoDetail(item){
			
			},
			preveiw(current,v){
				uni.previewImage({
					current,
					urls:[v.url]
				})
			},
			 confirm(e){
				console.log(e)
				this.imgId = e[0].value
				this.text = e[0].label
				this.page = 1
				
				
				this.getIamgeList()
			},
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background: #f7f7f7;
		padding: 24rpx 32rpx;
		.close{
			position: absolute;
			    top: 0rpx;
			    right: 0rpx;
			    z-index: 10;
			    background-color: #fa3534;
			    border-radius: 100rpx;
			    width: 30rpx;
			    height: 30rpx;
			    display: flex;
			    flex-direction: row;
			    align-items: center;
			    justify-content: center;
		}
		.slot-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			
			width: 440rpx;
		}

		.box {
			background: #FFFFFF;
			border-radius: 24rpx;
			min-height: 288rpx;
			min-width: 686rpx;
			margin-bottom: 24rpx;
			padding: 32rpx 16rpx;
			position: relative;
			z-index: 9;
		}
	}
</style>
