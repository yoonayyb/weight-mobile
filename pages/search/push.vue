<template>
	<view class="container">
		<u-gap height="24"></u-gap>
		<view  style="background-color: #FFF;padding:30rpx;">
			
			
				<!-- <editor id="editor" @input="editorCtxChange" @statuschange="onStatusChange" @focus="focus" class="ql-container" placeholder="请输入文本内容" @ready="onEditorReady"></editor> -->
				
			
			<view class="u-flex u-m-b-20 u-flex-between u-flex-items-start">
				<view  style="width:336rpx; height:392rpx">
				<u-upload  :show-progress="false" :file-list="fileList" :max-count="1" :header="header" ref="uUpload" width="336" height="392" 
				  :custom-btn='true' :auto-upload="false"  @on-remove="onRemove"
				  >
				  <!-- <u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon> -->
				  <view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
				    <image  style="width:336rpx;height:392rpx;border-radius: 16rpx;" :src="`${imgUrl}v3_video_upload.png`" mode="aspectFit"></image>
				  </view>
				</u-upload>
				</view>
			<video object-fit="cover" :src="path" style="width:336rpx;height: 392rpx; position: relative;border-radius:16rpx">
				<view class="close" @click="chooseVideo">
				<u-icon name="close" color="#ffffff" size="24"></u-icon>
				</view>
			</video>
				
			</view>
			<u-input :show-confirmbar="false"
				:custom-style="{background:'#ffffff',borderRadius:'16rpx',padding:'16rpx 24rpx',marginBottom:'32rpx'}"
				placeholder-style="color:#C2C2C2" placeholder="请输入视频内容" maxlength="200" v-model="value"
				type="textarea" :border="false" height="136" auto-height />
				<u-tag style="margin:0rpx 16rpx 16rpx 0;display: inline-block;" v-for="(item,index) of tags" :key="index" :text="'#'+item.title+'#'" shape="circle" border-color="#F1FBFA"  bg-color="#F1FBFA" color="#00B8A2"  closeable :show="item.show" @close="tagClick(index)"  mode="light" />
			<view @click="gotoTopic" class="btn u-m-t-16 u-m-b-16" >#话题#</view>
			
			
			
		</view>
		
		<view class="safe-area-inset-bottom u-flex-xy-center u-m-t-20 u-m-b-20"  >
		<my-button width="256" height="72" @click="push" :opacity="loading?0.6:1" >发布视频</my-button>
		</view>
	</view>
</template>

<script>
import myButton from '@/components/myButton.vue'
import {baseUrl_v2} from '@/utils/common.js'
	export default {
		data() {
			return {
				loading:'',
				thumb:'',//封面图
				header: {
					authorization:'Bearer ' + uni.getStorageSync('token')
				}, 
				fileList:[],
				value:'',
				tags:[],//话题
				path:'',//视频路径
				topics:'',//话题id
				checkedTopic:[]//选中的话题
			}
		},
		components:{
			myButton
		},
		onLoad(option){
			console.log(option)
			this.path = decodeURIComponent(option.tempFiles) 
		},
		methods:{
			tagClick(index){
				this.tags.splice(index,1)
			},
			success(data,index,lists){
				console.log('success',lists)
				
				this.thumb = lists[0].url
				
			},
			onRemove(){
				this.thumb = ''
			},
			push(){
				
				if(!this.$refs.uUpload.lists.map(v=>v).length) return this.$common.toast('请选择封面图')
				if(!this.value) return this.$common.toast('请输入视频内容')
				if(this.loading) return
				this.loading = true
				uni.showLoading({
				  title: '加载中',
				  mask:true,
				})
				let task = this.$refs.uUpload.lists.map(async (item) => {
					console.log('item',item)
					
					return  await this.$common.uploadParams(item.file.path)
				})
				task.push(this.$common.uploadParams(this.path))
				 Promise.all(task).then(res=>{
					 uni.hideLoading()
					 console.log('promiseAll',res)
					 let params = {
					 	title:this.value,
					 	url:res[1].key,//视频key
					 	thumb:res[0].key,//封面key
					 	topics:this.tags.map(v=>v.id).join(',')
					 }
					 console.log('params', params)
					 this.$request({
					 	url:'/ApiV3/Mobile/StaffKnowledge/save',
					 	loading:true,
					 	data:{
					 		...params
					 	}
					 }).then(res=>{
					 	this.$common.toast('成功');
					 	this.loading = false
					 	uni.navigateBack()
					 	uni.$emit('updateVideo',{data:2})
					 }).catch(err=>{
					 	this.loading = false
						uni.hideLoading()
						this.$common.toast('文件上传失败请重新选择');
						console.log('err',err)
					 })
				 }).catch(err=>{
					 this.loading = false
					 uni.hideLoading()
					 this.$common.toast('文件上传失败请重新选择');
					 console.log('err',err)
				 })
				 
				
			},
			
			setTopic(item){
				if(this.tags.find(v=>v.id === item.id))return
				this.tags.push({...item,show:true})
				console.log(222,this.tags)
				
			},
			gotoTopic(){
				
				uni.navigateTo({
					url:'/pages/search/topic'
				})
			},
			chooseVideo() {
				let that = this
				uni.chooseMedia({
					count: 1,
					mediaType: ['video'],
					sourceType: ['album', 'camera'],
					maxDuration: 30,
					camera: 'back',
					success(res) {
						console.log('tempFiles', res.tempFiles)
					
						let size = res.tempFiles[0].size / 1024 /1024
						console.log('size', size)
						if(size >= 50) return that.$common.toast('视频不能超出50M,请重新上传')
						let path = res.tempFiles[0].tempFilePath
						that.path = path
					},
					fail(err) {
					 uni.showModal({
							content: err,
							showCancel: false
						})
					}
				})
			
			
			}
		}
	}
</script>

<style lang="scss">
	.container {
		::v-deep .u-tag{
			font-size: 24rpx !important;
		}
		::v-deep .u-list-item{
			border-radius: 16rpx !important;
			margin: 0 !important;
		}
		
		min-height: 100vh;
		background-color:#FAFAFA ;
		#editor {
				width: 100%;
				height: 280rpx;
				background-color: #FFF;
				min-height: 200rpx !important;
				color:#2A2A2A;
				
			}
		.btn{
			width: 152rpx;
			height: 56rpx;
			margin-top:8rpx;
			background: #F3F3F3;
			border-radius: 36rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color:#2A2A2A;
			font-size: 28rpx;
		}
		.active{
			background-color: #00aaff;
			color:white
		}
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
	}
</style>