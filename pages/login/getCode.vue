<template>
  <view class="get_code_components">
    <my-button width="200" height="54" font-size="24" :stop="btnStop" @click="getCode">{{
      btnStop ? '重新获取(' + time + 's)' : '获取验证码'
    }}</my-button>
  </view>
</template>

<script>
import myButton from '@/components/myButton.vue'
export default {
  components: {
    myButton
  },
  data() {
    return {
      time: 60, //倒计时时间
      btnStop: false //获取按钮是否禁止
    }
  },
  props: {
    type: {
      //获取验证码的类型  具体查看接口文档
      default: 1,
      type: Number
    },
    mobile: {
      //获取验证码的手机号
      default: '',
      type: [Number, String]
    }
  },
  methods: {
    // 获取验证码
    getCode() {
      if (this.btnStop) return false
      if (!this.$u.test.mobile(this.mobile)) {
        return this.$common.toast('手机号码格式不正确')
      }
      this.btnStop = true
      this.$axios({
        url: '/api/send_code',
        errMsg: true,
        loading: true,
        data: {
          mobile: this.mobile
        }
      }).then((res) => {
        this.$common.toast(res.message)
      })
      let time = setInterval(() => {
        if (this.time === 0) {
          this.btnStop = false
          this.time = 60
          clearInterval(time)
        } else {
          this.time--
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss"></style>
