<template>
  <view class="container">
    <u-navbar :customBack="goHome" back-text="返回" background="transparent"></u-navbar>
    <image class="poster" :src="poster" mode="widthFix"></image>
    <view class="right-box u-flex u-flex-col u-row-center u-font-10" v-if="isTongji" @click="next">
      <u-icon name="arrow-right" color="#fff" size="42"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      poster: '', //海报url
      isTongji: this.$store.getters.isTongji
    }
  },
  onLoad(e) {
    if (e.isTongji) {
      this.isTongji = true
      this.poster = `${this.imgUrl}tongji_intro.jpg`
    } else {
      if (e.poster) {
        this.poster = e.poster
      } else {
        // this.getPosterData()
      }
    }
  },
 
  methods: {
    // 回到首页
    goHome() {
      uni.navigateBack()
    },
    // 获取海报数据
    getPosterData() {
      this.$axios({
        url: '/api/bammer_poster.html',
        data: {
          banner_code: 'index_banner'
        }
      }).then((res) => {
        this.poster = res.data
      })
    },
    next() {
      if (this.isTongji) {
        // this.$store.dispatch('getUserInfo').then((res) => {
        //   const data = res.data
        //   this.$store.dispatch('timSdkLogin', this.tim || '') //用户登录成功后就登录timSdk
        //   if (data.role_id === 1 && !data.weight) {
        //     // 如果没有体重 则跳去填写体重
        //     uni.reLaunch({
        //       url: '/pages/mine/invite/updatePersonalInfo?login=true'
        //     })
        //   } else {
        //     uni.switchTab({
        //       url: '/pages/tabbar/projects'
        //     })
        //   }
        // })
      }
    }
  }
}
</script>

<style lang="scss">
::v-deep .u-navbar {
  &::after {
    width: 0 !important;
  }
}

::v-deep .u-navbar-placeholder {
  height: 0 !important;
}

.poster {
  width: 100vw;
  height: auto;
}
.right-box {
  position: fixed;
  bottom: 160rpx;
  right: 30rpx;
  width: 90rpx;
  height: 90rpx;
  background-color: $color;
  border-radius: 50%;
  color: #fff;
}
</style>
