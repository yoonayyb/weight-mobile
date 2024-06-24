<template>
  <view class="container border_t">
    <view class="input_row border_b">
      <input
        type="number"
        v-model="mobile"
        :maxlength="11"
        placeholder="请输入手机号码"
        placeholder-class="light_color"
      />
    </view>
    <view class="input_row border_b">
      <input type="number" v-model="code" :maxlength="6" placeholder="请输入验证码" placeholder-class="light_color" />
      <view class="getcode_btn">
        <!-- <my-button width="190" height="54" font-size="24">重新获取(60)</my-button> -->
        <get-code :mobile="mobile" :type="3" />
      </view>
    </view>
    <view class="input_row border_b">
      <input
        type="password"
        v-model="password"
        :maxlength="20"
        placeholder="请输入密码"
        placeholder-class="light_color"
      />
    </view>
    <view class="input_row border_b">
      <input
        type="password"
        v-model="confirmPassword"
        :maxlength="20"
        placeholder="请再次输入密码"
        placeholder-class="light_color"
      />
    </view>
    <my-button @click="submit" margin="60rpx 30rpx 0 30rpx" width="690" height="100">提交</my-button>
  </view>
</template>

<script>
/* #ifdef APP-PLUS */
import getCode from './getCode.vue'
/* #endif */

import myButton from '@/components/myButton.vue'
export default {
  data() {
    return {
      mobile: '', //手机号
      code: '', //验证码
      password: '', //密码
      confirmPassword: '' //确定密码
    }
  },
  methods: {
    // 提交数据
    submit() {
      if (!this.$u.trim(this.mobile)) return this.$common.toast('请输入手机号')
      if (!this.$u.test.mobile(this.mobile)) return this.$common.toast('手机号码格式不正确')
      if (!this.$u.trim(this.code)) return this.$common.toast('请输入验证码')
      if (!this.$u.trim(this.password)) return this.$common.toast('请输入密码')
      if (this.password.toString().length < 6) return this.$common.toast('密码不能小于6位')
      if (this.password !== this.confirmPassword) return this.$common.toast('两次密码不一致')
      this.$axios({
        url: '/api/setPassword',
        laoding: true,
        errMsg: true,
        data: {
          mobile: this.mobile,
          mobile_code: this.code,
          password: this.password
        }
      }).then((res) => {
        this.$common
          .showModal({
            content: '操作成功',
            showCancel: false
          })
          .then((res) => {
            uni.navigateBack({
              delta: 1
            })
          })
      })
    }
  },
  components: {
    /* #ifdef APP-PLUS */
    getCode,
    /* #endif */

    myButton
  }
}
</script>

<style lang="scss">
.container {
  .light_color {
    font-size: 32upx;
  }

  .input_row {
    margin: 0 30upx;
    width: 690upx;
    position: relative;

    > input {
      box-sizing: border-box;
      width: 690upx;
      height: 100upx;
      line-height: 100upx;
      padding: 0 30upx;
      font-size: 32upx;
    }

    .getcode_btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
