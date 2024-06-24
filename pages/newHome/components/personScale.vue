<template>
  <view class="height_scale">
    <view class="height_scale_title">{{params.title}}</view>
    <view class="height_scale_cm">
      <!-- <u-input v-model="params.value" :min="params.min" :max="params.max"  type="number" :border="false"
        :clearable='false' />
      {{params.unit}} -->
      <text class="height_scale_cm_text">{{value}}</text>{{params.unit}}
    </view>
    <view v-if="params.status">
      <vue-scale @loading="(val)=>{loading = val}" :key="params.value" :pageOffset='pageOffset' :min="params.min" :max="params.max" :int="false"
        :single="10" :h="30" :active="params.value" :styles="styles" @value="horizontaPointMethods" />
    </view>
    <view v-if="params.btnStatus" class="flex">
      <my-button :opacity="loading?0.6:1" @click="handleClick" :width="560" :height="80">确认</my-button>
    </view>
  </view>
</template>

<script>
import myButton from '@/components/myButton.vue'
import vueScale from '@/components/vueScale/index.vue'
export default {
  name: 'personScale',
  components: {
    vueScale,
    myButton
  },
  props: {
    pageOffset: {
      //组件缩小时 需要传入对应的宽度确保左右滑动最后的空白宽度正确 否则会滑不到底
      type: Number,
      default: 0
    },
  },
  data () {
    return {
		loading:false,
       styles: {
        line: '#C2C2C2',
        bginner: '#00B8A2',
        bgoutside: '#ffffff',
        lineSelect: '#00B8A2', // 选中线颜色
        font: '#404040',
        fontColor: '#C2C2C2',
        fontSize: 16
      },
      horizontaPointVal: 0,
      value: 0,
      params: {
        //vue-scale该组件需要通过if进行重置 否则会出现第二次无法滑动问题  不太懂为什么
        status: false,//组件if状态
        type: '', //键名
        title: '',
        unit: 'cm',
        min: 0,
        max: 230,
        value: 0
      },
    }
  },

  created () {
  },
  methods: {
    handleClick () {
		if(this.loading) return
      this.$emit('confirm', this.params || '', this.params.type)
    },
    horizontaPointMethods (e, status) {
      this.value = e //value只进行展示
      if (status) {//获取最后的值
        this.params.value = e
        console.log('[  this.params.value  ]-72', this.params.value)
        this.$emit('value', this.params)
      }
    },
    reset (params = {}) {
      this.params = params
	  console.log('this.params ',this.params )
    }
  }
}
</script>

<style lang='scss' scoped>
.height_scale {
  .height_scale_title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #2a2a2a;
    padding-top: 32rpx;
    font-family: PingFang SC-Bold, PingFang SC;
  }
  .height_scale_cm {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 48rpx 0;
    text-align: center;
    font-size: 40rpx;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #2a2a2a;
    .height_scale_cm_text {
      padding-right: 20rpx;
      font-size: 72rpx;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #00b8a2;
      border-bottom: 1px solid #f3f3f3;
    }
  }
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60rpx;
}
</style>
