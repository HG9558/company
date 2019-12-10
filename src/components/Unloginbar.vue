<template lang="jade">
  .unloginbar
    .content-width
      a.b(href="https://www.xygames.net/pages/brand.html" target="_blank") 信游品牌
      el-popover(placement="bottom-end" trigger="hover" v-bind:popper-class=" 'lar-popover' " v-bind:visible-arrow="false" v-model="show" @show=" __setCall({fn: '__LARCODE'}) ")
        span(slot="reference")
          span.a(@click=" __setCall({fn: '__popLogin', args: true}) ") 登录 | 注册
        slot
          LAR

      el-popover(placement="bottom-end" trigger="hover" v-bind:popper-class=" 'lt-popover' " v-bind:visible-arrow="false")
        span(slot="reference")
          span.b 测速
        slot
          .content-width
            LT

      a.b(href="/xy_activity/dns.html" target="_blank") 防劫持教程

</template>

<script>
import LAR from './LAR'
import LT from '../views/login/LoginTest'
export default {
  components: {
    LAR,
    LT
  },
  name: 'unloginbar',
  props: [],
  data () {
    return {
      show: false
    }
  },
  created () {
  },
  methods: {
    __LAR () {
      this.show = true
    }
  }
}
</script>

<style lang="stylus">
@import '../var.stylus'
// 建议不添加scoped， 所有样式最多嵌套2层
.lar-popover
.lt-popover
  transform translateX(1.8rem) translateY(-.01rem)
  padding 0 !important
  z-index 1901 !important
.lt-popover
  transform translateX(1.1rem) translateY(-.01rem)
  background rgba(0,0,0, .95) !important
  .login-test 
    h2
      display none
    .routers
      padding-bottom .15rem

  
  
  
.unloginbar
  text-align right
  background-color #ffa930
  color #302b2a
  height .365rem
  line-height .365rem
  .a, .b
    padding  0 .2rem
    cursor pointer
    display inline-block
    &:hover
      background rgba(255,255,255,0.5)

</style>
