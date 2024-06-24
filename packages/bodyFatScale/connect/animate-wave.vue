<template>
	<view>
		
		<view class="animate-wave">
			<view class="w1" :class="{connecting}"></view>
			<view class="w2" :class="{connecting}"></view>
			<view class="w3" :class="{connecting}"></view>
			<view class="w4" :class="{connecting}"></view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			connecting:{
				type:Boolean,
				default:false,
			}
		}
	}
</script>

<style lang="scss">
	

	.animate-wave {
		width: 200vw;
		height: 200vw;
		position: absolute;
		// position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		// top: 100px;
		// left: 0;
		// right: 0;
		// margin: 0 auto;
		// background: #C3E4FF;
		// border: 1px solid #00B8A2;
		border-radius: 50%;
	}

	@keyframes opac {
		from {
			opacity: 1;
			width: 0;
			height: 0;
			// top: 50%;
			// left: 50%;
		}

		to {
			opacity: 0;
			width: 100%;
			height: 100%;
			border-color: white;
			// top: 0;
			// left: 0;
		}
	}

	.animate-wave >view {
		// background: #C3E4FF;
		
		border: 1px solid #00B8A2;
		position: absolute;
		border-radius: 50%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: opac 4s infinite;
	}
	.connecting{
		border: 1px solid #00B8A2!important;
	}
	.animate-wave .w2 {
		animation-delay: 1s;
	}

	.animate-wave .w3 {
		animation-delay: 2s;
	}

	.animate-wave .w4 {
		animation-delay: 3s;
	}
</style>
