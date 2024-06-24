<template>
  <view class="height_scale safe-area-inset-bottom">
    <view class="height_scale_title">{{params.title}}</view>
    <view class="height_scale_cm">
      <!-- <u-input v-model="params.value" :min="params.min" :max="params.max"  type="number" :border="false"
        :clearable='false' />
      {{params.unit}} -->
      <text @click="recordShow = !recordShow" class="height_scale_cm_text">{{value}}</text>{{params.unit}}
    </view>
    <view v-if="params.status">
      <vue-scale  ref="vueScale" @loading="(val)=>{$emit('loading',val)}" :key="params.value" :pageOffset='pageOffset' :min="params.min" :max="params.max" :int="false"
        :single="10" :h="30" :active="params.value" :styles="styles" @value="horizontaPointMethods" />
    </view>
    <view v-if="params.btnStatus" class="flex">
      <my-button :opacity="loading?0.6:1" @click="handleClick" :width="560" :height="80">确认</my-button>
    </view>
	<u-popup safe-area-inset-bottom @close="submit" v-model="recordShow" mode="bottom" border-radius="24" closeable>
		<view @click="recordShow = !recordShow" class="popPupTime u-p-b-20 u-m-b-20">
			<text
				style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;" >{{ value }}
			</text>
			<text class="u-font-40" style="color:#2A2A2A">{{unit}}</text>
		</view>
		<number-keyboard :padding="0"  ref="numberKeyboard" title="''" v-model="value"
			rightBtnText="''" @confirm="submit"></number-keyboard>
	</u-popup>
  </view>
</template>

<script>
import myButton from '@/components/myButton.vue'
import vueScale from '@/components/vueScale/index.vue'
import numberKeyboard from '@/components/numberKeyboard2.vue' //键盘
export default {
  name: '',
  components: {
    vueScale,
    myButton,
	numberKeyboard
  },
  props: {
    pageOffset: {
      //组件缩小时 需要传入对应的宽度确保左右滑动最后的空白宽度正确 否则会滑不到底
      type: Number,
      default: 0
    },
	unit:{
		type:String,
		default:''
	}
  },
  data () {
    return {
	   recordShow:false,
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
	  
	  submit(){
		  // this.params.value = this.value
		  this.copyVue
		  this.$set(this.params,'value',this.value)
		  console.log(111,this.params)
		  setTimeout(()=>{
			  this.$refs.vueScale.init()
		  })
		  
		 this.recordShow = false
	  },
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
    }
  }
}
</script>

<style lang='scss' scoped>
	.popPupTime {
		display: flex;
		align-items: baseline;
		justify-content: center;
		font-size: 72rpx;
		font-weight: bold;
		color: #00B8A2;
		
		text {
			text-align: center;
		}
	
	}
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
  margin-top:120rpx
}
</style>
