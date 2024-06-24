<template>
  <view class="container">
    <view v-if="goods.length" class="content">
      <view class="header u-flex" @click="editFlagClick()">
        <text>{{ editFlag ? '完成' : '管理' }}</text>
      </view>
      <view>
        <cart-refund-goods width="100%" :applyForAfterSaleBtn="false" :cartList='goods' @change="checkboxChange"
          @numberChange='numberChange' @categoryClick='categoryClick'>
        </cart-refund-goods>
      </view>
      <view id="footer" class="footer u-flex shadow safe-area-inset-bottom">
        <view class="footer_left u-flex" @click="handleAllChecked">
          <view v-if="allChecked === false" class="no_select"></view>

          <u-icon v-else name="checkmark-circle-fill" color='#00b8a2' size="48"></u-icon>
          <!-- <image v-else :src="`${imgUrl}checked2.png`" mode="aspectFit"></image> -->
          <text>全选</text>
        </view>
        <view class="footer_right u-flex u-flex-1" v-if="editFlag === false">
          <view class="total">
            <view v-if="hasChoosePoints" class="u-m-b-6">总计：</view>
            <text v-else>总计：</text>
            <text v-if="!hasChoosePoints" style="color: #fd5624; font-size: 24rpx">￥</text>
            <text :style="{ color: ' #FD5624', fontSize: hasChoosePoints ? '28rpx' : '32rpx' }">{{ allPrice }}</text>
          </view>
          <my-button @click="goToBuy" margin="0 30rpx 0 40rpx" width="240" height="80" bg="#00b8a2">结算</my-button>
        </view>
        <view class="footer_right u-flex" v-else>
          <my-button @click="handleDelete()" margin="0 30rpx 0 40rpx" width="240" height="80" bg="#00b8a2">删除
          </my-button>
        </view>
      </view>
    </view>
    <!-- <u-empty v-if="!cartList.length" margin-top="100" text="你的购物车空空如也" mode="car">
      <my-button @click="jump({ url: 'home/shoppingMall/shoppingMall' })" margin="30rpx 0 0 0" bg="#fd5624"
        slot="bottom">去逛逛</my-button>
    </u-empty> -->
    <view class="blankpage" v-else>
      <image class="blankpage_image" :src="`${imgUrl}v3_shoppingcart_blankpage.png`" mode="aspectFit"> </image>
      <view>购物车是空的</view>
      <my-button @click="jump({ url: 'tabbar/shoppingMall' })" margin="30rpx 0 0 0" bg="#00B8A2"
        slot="bottom">去逛逛</my-button>
    </view>
    <u-modal v-model="delShow" :show-title='false' :show-confirm-button="false">
      <view class="delModel_text">确认将这{{selectList.length}}个商品删除？</view>
      <view class="delModel_button">
        <my-button class="cancel" width="208" height="72" color="#00B8A2" fontWeight='300' @click="delShow = false">取消
        </my-button>
        <my-button width="208" height="72" bg="#00B8A2" fontWeight='300' @click="delBtn">确定</my-button>
      </view>

    </u-modal>
    <select-product-specs ref="selectProductSpecs"  @specsConfirm="specsConfirm"/>
  </view>
</template>

<script>
import selectProductSpecs from './components/selectProductSpecs.vue'
import cartRefundGoods from './components/cartRefundGoods.vue'
import myButton from '@/components/myButton.vue'
export default {
  data () {
    return {
	  page:1,
	  length:0,
      allChecked: false, //全选
      selectList: [], //选中的数组
      delShow: false, //删除
      editFlag: false, //是否编辑
      cartList: [], //购物车列表数据
      hasChoosePoints: false ,//是否有选积分商品
	  goods:[],//商品数据
	  allPrice:0,//总价
    }
  },
  onShow () {
    this.getCartData()
  },
  computed: {
    // 总价
    // allPrice () {
    //   const currentData = this.cartList.filter((item) => item.checked)
    //   if (!currentData.length) {
    //     this.hasChoosePoints = false
    //     return 0
    //   } else {
    //     let total = 0
    //     let points = 0
    //     currentData.forEach((item) => {
    //       const number = parseFloat(item.goods_number)
    //       const price = parseFloat(item.makeprice)
    //       const point = parseFloat(item.points)
    //       total += number * price * 100
    //       points += number * point
    //     })
    //     if (!points) {
    //       this.hasChoosePoints = false
    //       return (total / 100).toFixed(2)
    //     } else if (points && total) {
    //       this.hasChoosePoints = true
    //       return points + '积分' + '+' + (total / 100).toFixed(2) + '元'
    //     } else if (points && !total) {
    //       this.hasChoosePoints = true
    //       return points + '积分'
    //     }
    //   }
    // }
  },
  watch:{
	goods:{
		handler(val){
			this.allPrice = 0
			val.forEach(v=>{
				if(v.checked){
					this.allPrice += parseFloat((Number(v.makeprice) * Number(v.amount)).toFixed(2)) 
				}
			})
			this.allPrice = parseFloat(this.allPrice.toFixed(2))
		},
		deep:true
	}
  },
  
  components: {
    myButton,
    cartRefundGoods,
    selectProductSpecs,
  },
  // 触底通知子组件加载更多
  onReachBottom() {
	  console.log('底部')
  	if (this.length) {
  		this.page++
  		this.getCartData()
  	}
  },
  methods: {
	  
  editCar(item){
	  let data = {
		id:item.carId,
		goods_id:item.id,
		amount:item.amount
	  }
	  if(this.$store.state.user.userInfo.role_id != 1) data.hospital_id = uni.getStorageSync('hospitalId') || 0
	  this.$request({
		url:'/ApiV3/Mobile/ShopCart/save',
		
		data
	  }).then(res=>{
			
	  })
  },
    categoryClick (item, index) {
		
		let obj = {
		  ...item,
		  packs:this.cartList[index]?.goods?.packs || [],
		  goods_num: item.amount || 1,
		 
		}
		console.log('obj',obj)
      this.$refs.selectProductSpecs.open(obj,index)
    },
    editFlagClick () {
      this.editFlag = !this.editFlag
    },
    specsConfirm (item,index) {
		
		// item.amount = item.goods_num
		// this.$set(this.goods[index],'amount',item.goods_num)
		// console.log('item',item)
		// let obj = this.goods.find(v=>v.id === item.id)
		let keys = Object.keys(item)
		keys.forEach(v=>{
			
			this.$set(this.goods[index],v,item[v])
			
		})
		this.goods[index].amount = item.goods_num
		console.log('item',item)
		console.log('goods',this.goods[index])
		this.editCar({...item,amount:item.goods_num})
		// this.goods.find((v,index)=>{
		// 	if(v.id === item.id){
		// 		console.log(item[index])
		// 		return this.$set(this.goods[index],v,item[index])
		// 	}
		// })
		
		// keys.forEach(res=>{
		// 	this.$set(this.goods[index],res,item[res])
		// })
		
		// this.editCar(item)
      
    },
    checkboxChange (item, index) {
	  console.log('item',item)
	  this.$set(this.goods[index],'checked',!item.checked)
      // item.checked = !item.checked
     
      this.allChecked = this.goods.every((item) => item.checked)
    },
    numberChange (item, index) {
	
      this.$set(this.goods[index],'amount',item.amount)
	  this.editCar(item)
    },
    // 去结算
    goToBuy () {
	  if(!this.goods.some(v=>v.checked)) return this.$common.toast('请先选择商品再结算')
	  let obj = this.goods.filter(v=>v.checked)
	  let data = {
	  	goods:obj.map(v=>({goods_id:v.id,goods_num:v.amount})),
		shop_cart:obj.map(v=>v.carId),
	  }
	  if(this.$store.state.user.userInfo.role_id != 1) data.hospital_id = uni.getStorageSync('hospitalId')  || 0
	  this.$request({
	  	url:'/ApiV3/Mobile/Order/createBefore',
		loading: true,
	  	data
	  }).then(res=>{
	  	let address = uni.getStorageSync('submitOrderData') && JSON.parse(uni.getStorageSync('submitOrderData')).address || ''
	  	const data = JSON.stringify({...res.data,address})
	  	uni.setStorageSync('submitOrderData', data)
	  	  uni.navigateTo({
	  	    url: `/pages/home/shoppingMall/submitOrder?type=card`
	  	  })
	  })
		
		
      // const ids = []
      // this.cartList.forEach((item) => {
      //   if (item.checked) {
      //     ids.push(item.cid)
      //   }
      // })
      // if (!ids.length) return this.$common.toast('请先选择商品再结算')
      // this.$axios({
      //   url: '/api/cart_order_before',
      //   errMsg: true,
      //   loading: true,
      //   data: {
      //     cids: ids.join(',')
      //   }
      // }).then((res) => {
      //   const data = JSON.stringify(res.data)
      //   uni.setStorageSync('submitOrderData', data)
      //   uni.navigateTo({
      //     url: `/pages/home/shoppingMall/submitOrder?type=card`
      //   })
      // })
    },
    // 删除购物车项
    delBtn () {
      this.$request({
        url: '/ApiV3/Mobile/ShopCart/del',
        errMsg: true,
        loading: true,
        data: {
          id: this.selectList.map(v => v.carId).join(',')
        }
      }).then((res) => {
        this.editFlag = false
        this.delShow = false
		this.goods = this.goods.filter(v=>!v.checked)
		
		// this.page = 1
  //       this.getCartData()
        this.$common.toast('删除成功')
      })
    },

    handleDelete () {
      this.selectList = this.goods.filter(v => v.checked === true)
      if (this.selectList.length === 0) return this.$common.toast('请先选择商品再操作')
      // uni.hideToast()
      this.delShow = true
    },
    // 获取购物车数据
    getCartData () {
		let data = {
			page:this.page
		}
		if(this.$store.state.user.userInfo.role_id != 1) data.hospital_id = uni.getStorageSync('hospitalId') || 0
      this.$request({
        url: '/ApiV3/Mobile/ShopCart/index',
		method:'get',
		data
      }).then((res) => {
        this.allChecked = false
		this.goods = []
		if(this.page === 1){
			this.cartList = res.data.data.map((item) => {
			  item.checked = false
			  let packs =item.goods?.packs && item.goods?.packs.find(v=>v.id === item.goods.id) || {}
			  
			  this.goods.push({
					  carId:item.id,
					  amount:item.amount,
					  checked:false,
					  ...packs
				  })
			  return item
			})
		}else{
			this.cartList = [...this.cartList,...res.data.data]
			this.cartList.forEach(item=>{
				item.checked = false
				let packs =item.goods?.packs && item.goods?.packs.find(v=>v.id === item.goods.id) || {}
				this.goods.push({
					  
					  carId:item.id,
					  amount:item.amount,
					  checked:false,
					  ...packs
				  })
			})
		}
        this.length = res.data.next_page_url
		
      })
    },
    // 公共跳转
    jump ({ url = '', data = '' }) {
      this.$common.jump({
        url,
        data,
        that: this
      })
    },
    // 全选
    handleAllChecked () {
      this.allChecked = !this.allChecked
      this.goods.forEach((item) => {
        item.checked = this.allChecked
      })
    },
    // 选择商品
    handleChcked (item) {
      item.checked = !item.checked
      this.allChecked = this.cartList.every((item) => item.checked)
    },
   
  }
}
</script>

<style lang="scss">
page {
  background: #f7f7f7;
}

.container {
  padding: 0 32rpx;
  border-radius: 24rpx;
  padding-bottom: 170upx;
  background: #fafafa;
  .header {
    // background: #ffffff;
    padding: 0 30upx;
    justify-content: flex-end;
    height: 60upx;
    // color: #fd5624;
  }

  .no_select {
    width: 38upx;
    height: 38upx;
    border: 1px solid #cbcbcb;
    border-radius: 50%;
  }

  .cart_goods_list {
    padding: 30upx 30upx 30upx 0;
    margin-top: 30upx;
    background: #ffffff;

    .cart_goods_item {
      margin-bottom: 30upx;

      &:last-child {
        margin-bottom: 0;
      }

      .select_goods {
        height: 180upx;
        padding: 0 20upx 0 30upx;

        > image {
          width: 38upx;
          height: 38upx;
        }
      }

      .cart_goods_image {
        margin-right: 20upx;
        width: 180upx;
        height: 180upx;
        border-radius: 10upx;
      }

      .cart_goods_content {
        flex: 1;

        .cart_goods_name {
          width: 420upx;
          height: 80upx;
        }

        .cart_goods_sku {
          margin-top: 5upx;
          width: 420upx;
          font-size: 24upx;
          color: #888888;
        }
      }

      .cart_goods_bottom {
        margin-top: 20upx;
        justify-content: space-between;

        .cart_goods_price {
          font-size: 24upx;
          color: #fd5624;

          text {
            font-size: 32upx;
          }
        }

        .number_box {
          text {
            height: 40upx;
            display: flex;
            align-items: center;
            justify-content: center;

            &:nth-child(1),
            &:nth-child(3) {
              background: #f1f1f1;
              width: 50upx;
              color: #888888;
              font-size: 32upx;
            }

            &:nth-child(2) {
              font-size: 24upx;
              min-width: 70upx;
              padding: 0 10upx;
              border-left: none;
              border-right: none;
            }
          }
        }
      }
    }
  }

  .footer {
    width: 750upx;
    height: 140upx;
    position: fixed;
    left: 0;
    bottom: 0;
    box-sizing: content-box;
    justify-content: space-between;
    background: #ffffff;
    transition: all 0.5s;
	z-index: 999;
    .footer_left {
      padding-left: 30upx;
      height: 140upx;

      image {
        width: 38upx;
        height: 38upx;
      }

      > text {
        margin-left: 20upx;
      }
    }

    .footer_right {
      justify-content: flex-end;
    }
  }
}
.delModel_text {
  font-size: 32rpx;
  text-align: center;
  padding: 32rpx;
  font-weight: bold;
  color: #2a2a2a;
}
.delModel_button {
  display: flex;
  justify-content: center;
  margin-bottom: 32rpx;
  .cancel {
    border-radius: 40rpx;
    border: 1px solid #00b8a2;
    color: #00b8a2;
    margin-right: 60rpx;
  }
}
</style>
