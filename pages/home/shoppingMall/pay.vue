<template>
  <view class="container border_t">
    <info-template textNoWidth title="订单号">
      <text>{{ order_sn }}</text>
    </info-template>
    <info-template textNoWidth title="订单金额">
      <text>￥{{ pay_amount }}</text>
    </info-template>
    <view style="height: 30rpx"></view>
    <info-template title="微信支付" textNoWidth>
      <template v-slot:icon>
        <!-- <view  class="no_select"></view> -->

        <image style="width: 50rpx; height: 40rpx; margin-right: 10rpx" :src="`${imgUrl}wechat.png`" mode="aspectFit">
        </image>
      </template>
      <u-icon name="checkmark-circle-fill" color='#00b8a2' size="48"></u-icon>
    </info-template>
    <!-- <info-template title="支付宝支付" textNoWidth>
			<template v-slot:icon>
				<image style="width: 50rpx;height: 45rpx;margin-right: 10rpx;"  :src="`${imgUrl}alipay.png`" mode="aspectFit"></image>
			</template>
			
		</info-template> -->
    <view class="footer_button">
      <my-button width="690" height="100" bg="#00B8A2" :style="{opacity:loading?0.6:1}"  @click="handlePay">支付</my-button>
    </view>
  </view>
</template>

<script>
import infoTemplate from '@/components/infoTemplate.vue'

import myButton from '@/components/myButton.vue'
export default {
  data() {
    return {
	loading:false,
      order_id: '',
      order_sn: '',
      pay_amount: '', //总金额
      currendIndex: null //当前支付的订单在订单列表的索引
    }
  },
  onLoad(option) {
    this.order_sn = option.order_sn
    this.pay_amount = option.pay_amount
    this.order_id = option.order_id
	//设置hash过期时间
	if( !uni.getStorageSync('hashExpiration') )uni.setStorageSync('hashExpiration',new Date().getTime() ) 
	
  },
  methods: {
    // 支付
    handlePay() {
 
 
		
		
		if(this.loading) return
		this.loading = true
      this.$request({
        url: '/ApiV3/Mobile/Order/pay',
		loading:true,
        errMsg: true,
        data: {
          order_id: Number(this.order_id)
        }
      })
        .then((r) => {
          const payInfo = r.data.pay_info
 
 
		  let timestamp = uni.getStorageSync('hashExpiration') 
		  console.log('timestamp',timestamp)
		  if(timestamp + 24*60*60*1000 < new Date().getTime()){//hash的时效超过设定的24小时
			  uni.setStorageSync('hash',JSON.stringify([]) ) 
		  }
		  const hash =  uni.getStorageSync('hash') && JSON.parse(uni.getStorageSync('hash')) || []
		  if(hash.includes(r.data.hash) ){
			return  this.$common
			    .showModal({
			      content: '该笔订单已支付，请勿重复操作',
			      showCancel: false
			    })      
		  }
		 
		  

          console.log(payInfo, '支付参数')
          // 支付成功或失败的回调
          const resultCallback = {
            success: (res) => {
			this.loading = false
              this.$common
                .showModal({
                  content: '支付成功',
                  showCancel: false
                })
                .then((res) => {
					let hashArr = []
					hashArr.push(...hash)
					hashArr.push(r.data.hash)
					uni.setStorageSync('hash',JSON.stringify(hashArr) ) 
					uni.setStorageSync('hashExpiration',new Date().getTime() ) 
                  if (this.$common.prePage().name === 'order') {
                    // 支付成功重新加载上一个订单列表页面的数据
                    this.$common.prePage().handleTabCurrent(0)
                    uni.navigateBack({
                      delta: 1
                    })
                  } else {
                    uni.redirectTo({
                      url: '/pages/order/order'
                    })
                  }
                })
            },
            fail: (err) => {
				this.loading = false
              if (this.$common.prePage().name === 'order') {
                uni.navigateBack({
                  delta: 1
                })
              } else if (this.$common.prePage().name === 'orderDetails') {
                this.$common.prePage(2).orderList[this.currendIndex].status = 1
                uni.redirectTo({
                  url: '/pages/order/order'
                })
              } else {
                uni.redirectTo({
                  url: '/pages/order/order'
                })
              }
            }
          }
          // #ifdef APP-PLUS
          // app 支付
          uni.requestPayment({
            provider: 'wxpay',
            orderInfo: payInfo,
            ...resultCallback
          })
          return false
          // #endif

          // 小程序支付
          uni.requestPayment({
            provider: 'wxpay',
            timeStamp: payInfo.timeStamp,
            nonceStr: payInfo.nonceStr,
            package: payInfo.package,
            signType: payInfo.signType,
            paySign: payInfo.paySign,
            ...resultCallback
          })
        })
        .catch((res) => {
          this.$common.toast(res.message)
        })
    }
  },
  components: {
    infoTemplate,
    
    myButton
  }
}
</script>

<style lang="scss">
page {
  background: #f1f1f1;
}
</style>
