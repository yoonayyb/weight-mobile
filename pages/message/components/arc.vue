<template>
  <view
    class="arc_container"
    :class="play ? 'box_animation' : ''"
    :style="{ flexDirection: reverse ? 'row-reverse' : 'row' }"
  >
    <view
      class="arc_left"
      :style="{
        borderColor: color,
        transform: reverse ? 'rotateZ(45deg)' : 'rotateZ(-135deg)',
        margin: reverse ? '0 0 0 -15rpx' : ''
      }"
    ></view>
    <view
      class="arc_center"
      :style="{
        borderColor: color,
        transform: reverse ? 'rotateZ(45deg)' : 'rotateZ(-135deg)',
        margin: reverse ? '0 0 0 -5rpx' : ''
      }"
    ></view>
    <view class="arc_dot" :style="{ background: color, margin: reverse ? 0 : '' }"></view>
  </view>
</template>

<script>
/*
 * @property {Boolean} play 是否播放动画
 * @property {String} color 颜色
 * @property {Boolean} reverse 是否翻转
 */
export default {
  props: {
    play: {
      default: false,
      type: Boolean
    },
    color: {
      defailt: '#4a4a4a',
      type: String
    },
    reverse: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
.arc_container {
  position: relative;
  top: -10upx;
  left: -10upx;
  padding-top: 20upx;
  padding-left: 20upx;
  display: flex;
  align-items: center;

  .arc_left,
  .arc_center {
    width: 24upx;
    height: 24upx;
    border-top: 2px solid #2b2b2b;
    border-right: 2px solid #2b2b2b;
    border-top-right-radius: 100%;
    transform: rotateZ(-135deg);
  }

  .arc_center {
    margin: 0 0 0 -15upx;
    width: 16upx;
    height: 16upx;
  }

  .arc_dot {
    margin: 0 0 0 -5upx;
    width: 6upx;
    height: 6upx;
    border-radius: 50%;
    // background: #4a4a4a;
  }
}

.box_animation {
  .arc_left {
    animation: arc_left_animaton 1s infinite;
  }

  .arc_center {
    animation: arc_center_animaton 1s infinite;
  }

  .arc_dot {
    animation: dot_animation 1s infinite;
  }
}

@keyframes arc_left_animaton {
  0% {
    border-color: #4a4a4a;
	
  }

  75% {
    border-color: #4a4a4a;
	
  }

  100% {
    border-color: transparent;
  }
}

@keyframes arc_center_animaton {
  0% {
     border-color: #4a4a4a;
	
  }

  50% {
     border-color: #4a4a4a;
	
  }

  100% {
    border-color: transparent;
  }
}

@keyframes dot_animation {
  0% {
     background: #4a4a4a;
	
  }

  25% {
     background: #4a4a4a;
	
  }

  100% {
    background: transparent;
  }
}
</style>
