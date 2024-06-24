<template>
	<!-- <view class="u-absolute" style="z-index: 999999;width: 100%;" :style="{top}">
		<u-popup :mask="false" v-model="list.length" negative-top="top" mode="top">
			<view>{{list[0]}}</view>
		</u-popup>
	</view> -->
	<!-- <u-popup :mask-close-able="false" @close="list = [];y=0" :mask="false" width="600" height="600"  border-radius="24" :negative-top="top" v-model="list.length"  mode="center">
		
		<movable-area class="u-flex-column u-flex-center" style="width: 100%;height: 100%;">
			<movable-view @change="change" :y="y" style="width: 100%;height:150rpx;" out-of-bounds inertia  direction="vertical">
				<view class="u-flex-xy-center" style="height: 100%;background:#f7f7f7;border-radius:24rpx">{{list[0]}}</view>
			</movable-view>
		</movable-area>
	</u-popup> -->
	
	<view v-if="list.length && showPopup" class=" u-flex-xy-center invite-box" style="z-index: 9999999;" :style="{top:'-150rpx',height,width}">
		<movable-area class="u-flex-column u-flex-center" style="height: 100%;" :style="{width}" >
			<movable-view @vtouchmove="vtouchmove" @change="change" :y="y" style="width: 100%;" :style="{height:movableViewHeight}" out-of-bounds inertia  direction="vertical">
				<view @touchend="touchend" @click="gotoMessageList" class="u-flex-xy-center" style="height: 100%;background:#f7f7f7;border-radius:24rpx">{{list[0]}}</view>
			</movable-view>
		</movable-area>
	</view>
	
</template>

<script>
	export default {
		name:'impopup',
		data() {
			return {
				top:uni.getStorageSync('customBar') || 20,
				y:0,
				height: uni.getStorageSync('popheight') ||  uni.upx2px(400) + 'px',
				width:uni.upx2px(600)+ 'px',
				movableViewHeight:uni.upx2px(150)+ 'px',
				list: [],
				currentPage:'',
				show:true,
				loading:false,
				scrollY:0,
				clearListType:false,
				showPopup:true,
				scrollDirection:''
			}
		},
		props: {
		 //    _specia:{
			// 	type:String,
			// 	default:''
			// }
		  },
		computed: {
			// y() {
			// 	this.$nextTick(()=>{
			// 		console.log('yyyyyyyy',this.$store.state.message.ImpopY)
			// 		return this.$store.state.message.ImpopY
			// 	})
				
			// }
		},
		watch: {
			'$store.state.message.ImpopY'(newValue) {
				
				this.y = newValue
					
			},
			'$store.state.message.newMsg'(newValue, oldValue){
				
				//消息im弹框过滤掉自己给自己发的消息
				newValue = newValue.filter(v=>v.from_user_id !== this.$store.state.message.imUid)
				if(!newValue.length) return
				
				let arr = ['/pages/message','/pages/mine/message','/pages/tabbar/projects','/pages/question/questionIndex','/pages/question/question3','/pages/message/messageChat','/pages/login/index']
				let pages = getCurrentPages()
				let currentPages = pages[pages.length - 1]
				this.currentPage = currentPages.$page.fullPath
				// console.log('show',arr.find(v=>uni.getStorageSync('beforPage').includes(v)))
				// console.log(this.currentPage,!!arr.find(v=>this.currentPage.includes(v))?'没显示':'显示' + 'im通知弹框')
				// if( arr.find(v=>this.currentPage.includes(v))) return
				if( arr.find(v=>this.currentPage.includes(v))) return
				
				console.log('执行到这里',this.currentPage)
				this.$store.commit('setImpopY',0)
				this.hide()	
			
				let count = newValue.length >99?'99+':newValue.length
				
				this.list = [`你收到${count}条新消息`]
				
				this.$nextTick(function() {
					// setTimeout(()=>{
					// 	// this.y = uni.upx2px(150) + this.top
					// 	console.log(this.currentPage+'已经显示im通知弹框')
					// 	this.$store.commit('setImpopY',uni.upx2px(150) + this.top)
					// },100)
						// console.log(this.currentPage+'已经显示im通知弹框')
						this.$store.commit('setImpopY',uni.upx2px(150) + this.top)
						this.scrollY = uni.upx2px(150) + this.top
				})
					    
				
				
				
			},
			
		},
		mounted(){
			// let pages = getCurrentPages()
			// let currentPages = pages[pages.length - 1]
			// this.currentPage = currentPages.$page.fullPath
			// console.log('this.currentPage: ', this.currentPage)
			// console.log('this.currentPage',this.currentPage)
		},
		components:{
		},
		methods:{
			vtouchmove(e){
				// console.log('vtouchmove',e)
				// this.scrollDirection = e.detail.y < this.scrollY ? 'up' : 'down'
				// this.scrollY = e.detail.y < this.scrollY ? e.detail.y : e.detail.y
				
				// // console.log(e.detail.y)
				// // this.y = e.detail.y
				// this.hide()
				// this.scrollY = e.detail.y
				// //怕有误差
				// if(this.scrollDirection === 'up' &&  this.scrollY  === 0){
				// 	this.list = []
					
				// }
			},
			gotoMessageList(){
				
				setTimeout(()=>{
				 this.close()	
				},100)
				
				// this.list = []
				uni.navigateTo({
					url:'/pages/mine/message/index?active=1'
				})
			},
			change(e){
				
				this.scrollDirection = e.detail.y < this.scrollY ? 'up' : 'down'
				this.scrollY = e.detail.y < this.scrollY ? e.detail.y : e.detail.y
				
				
				this.hide()
				this.scrollY = e.detail.y
				//怕有误差
				if(this.scrollDirection === 'up' &&  this.scrollY  === 0){
					this.list = []
					
				}
				
				
			},
			hide(){
				
				this.$u.debounce(()=>{
					this.$store.commit('closeImpop',false)
					
					this.$store.commit('setImpopY',0)
					
				}, 3000)
			},
			close(){
				this.$store.commit('closeImpop',false)
				
				this.$store.commit('setImpopY',0)
			},
			touchend(e){
				
				//需要改变一下y 不然不生效
				this.$store.commit('setImpopY',this.scrollY)
				
				if(this.scrollY < (uni.upx2px(50)+this.top)){
					console.log('隐藏')
					this.$nextTick(function() {
						setTimeout(()=>{
						 this.$store.commit('setImpopY',0)
						})
						
					})
				}else{
					console.log('复原')
					
					this.$nextTick(function() {
						setTimeout(()=>{
						 this.$store.commit('setImpopY',uni.upx2px(150) + this.top)
						})
						
					})
				}
			},
			
		}
	}
</script>

<style lang="scss" scope>
	.container {
		background: #f7f7f7;
		min-height: 100vh;
	}
	.invite-box{
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
	}
	::-webkit-scrollbar {
	  display: none;
	  width: 0 !important;
	  height: 0 !important;
	  -webkit-appearance: none;
	  background: transparent;
	}
</style>