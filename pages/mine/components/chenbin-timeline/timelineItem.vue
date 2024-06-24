<template>
	<view class="timelineItem">
		<view class="timeItem">
			<view v-if="leftTime" class="leftTime u-line-2">
				<view>{{leftTime.split(' ')[0]}}</view>
				<view>{{leftTime.split(' ')[1]}}</view>
			</view>
			<view class="line" :class="{lastChilren}">
				<view class="out" :style="{background: color == '' ? 'white':color , border:color?'':'1rpx solid #E7E7E7'}" >
					<view  class="inner" :style="{background: color == '' ? 'white' : color}" ></view>
				</view>
			</view>
			<view class="rightContent">
				<slot></slot>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props:{
			leftTime:{
				type:String,
				default:''
			},
			color:{
				type:String,
				default:''
			},
			lastChilren:{
				type:Boolean,
				default:false
			},
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped lang="less">
	.timelineItem {
		.timeItem {
			display: flex;
			.leftTime {
				position: relative;
				top: -24rpx;
				width: 100rpx;			
				font-size:24rpx;
				margin-right: 18rpx;
				color:#C2C2C2;
				>view{
					text-align: center;
				}
			}
			.lastChilren{
				width: 0px !important;
			}
			.line {
				width: 1px;
				background:#E7E7E7;
				position: relative;
				
				.out {
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					justify-content: center;
					align-items: center;
					width: 28rpx;
					height: 28rpx;
					background : #E7E7E7;
					border-radius: 50%;
					.inner {
						width: 18rpx;
						height: 18rpx;
						background : #E7E7E7;
						border-radius: 50%;
					}
				}
			}
		
			
			.rightContent {
				flex: 1;
				padding: 0 10rpx 40rpx;
				margin-left: 20rpx;
				min-height: 50rpx;
			}
			
			
		}
	}
</style>
