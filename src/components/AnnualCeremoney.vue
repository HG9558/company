<template lang="jade">

  .annual-ceremony.ft14
    .close.pointer.absolute(@click=" __setCall({fn: '__hideAnnual'}) ")
    template(v-if=" !success ")
      .a.c_f.ft14
        span 尊敬的贵宾：
        p 
          span.aa {{ data.year }}
          span  年的 
          span.aa {{ data.month }}
          span  月 
          span.aa {{ data.day }}
          span  日，您第一次来到信游娱乐平台，您还记得吗？感谢您在这些年来对平台的支持，为了纪念这个难忘的日子，信游娱乐为您准备了纪念礼包哦！
      .b.t_c.ptb15
        .ba.inlb.pointer.scratch(v-if=" data.scratch ")
          .baa {{ data.scratch }}
            span.baaa 张
        .ba.inlb.pointer.expTicket(v-if=" data.expTicket ")
          .baa {{ data.expTicket }}
            span.baaa 元
        .ba.inlb.pointer.giftTicket(v-if=" data.giftTicket ")
          .baa {{ data.giftTicket }}
            span.baaa 元
      .c.c_f.t_c 凡充值 {{ data.rechargeAmount }} 元以上，投注 {{ data.buyAmount }} 以上，即可激活礼金，激活后可直接提现
      
      .d.t_c.pt15
        .da.inlb.pointer(@click=" getOldUserPrize ")
    template(v-else)
      .e.t_c
        .ea
        .eb.c_f.ft14 领取成功，请在【
          span.eba.pointer(@click=" __setCall({fn: '__hideAnnual'}) || $router.push('/activity/5-1-3') ") 优惠券
          span 】中查看。
        .ec
          .ds-button.success.full.eca(@click=" __setCall({fn: '__hideAnnual'}) ") 确定


</template>
<script>
  // import store from '../store'
  import api from '../http/api'
  export default {
    //  string  年（周年庆活动弹出框使用）
    // year: data.year,
    // // string  月（周年庆活动弹出框使用）
    // month: data.month,
    // // string  日（周年庆活动弹出框使用）
    // day: data.day,
    // // string  刮刮卡数量（周年庆活动弹出框使用）
    // scratch: data.scratch,
    // //  string  游戏体验金券金额（周年庆活动弹出框使用）
    // giftTicket: data.giftTicket,
    // // string  待激活礼金券金额（周年庆活动弹出框使用）
    // expTicket: data.expTicket,
    // //  string  待激活礼金券充值要求金额（周年庆活动弹出框使用）
    // rechargeAmount: data.rechargeAmount,
    // // string  待激活礼金券投注要求金额（周年庆活动弹出框使用）
    // buyAmount: data.buyAmount
    props: ['data'],
    data () {
      return {
        success: false
      }
    },
    methods: {
      getOldUserPrize () {
        this.$http.get(api.getOldUserPrize).then(({data: {success}}) => {
          if (success === 1) {
            this.success = true
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
@import '../var.stylus'

.annual-ceremony
  width 7rem
  height 6.45rem
  padding 2.2rem .8rem
  box-sizing border-box
  background-image url(../assets/annual-ceremony/1.png)
  background-size 100% 100%
  
  .close
    right 0
    top .8rem
    width 48px
    height 48px
    background-color #7b3bdb
    border-radius 50%
    background-image url(../assets/annual-ceremony/6.png)
    background-position center
    background-repeat no-repeat
    &:hover
      background-color #8b3bdb
  .a
    line-height 1.5
  .aa
    font-size .2rem
    color #ffff00  

  .ba
    position relative
    width 1.68rem
    height 1.88rem
    background-size 100% 100%
    &:hover
      opacity .8

    &.scratch
      background-image url(../assets/annual-ceremony/2.png)
    &.expTicket
      background-image url(../assets/annual-ceremony/3.png)
    &.giftTicket
      background-image url(../assets/annual-ceremony/4.png)
  .baa
    position absolute
    bottom .15rem
    text-align center
    left 0
    right 0
    color #ffff00
    font-size .25rem
  .baaa
    font-size .16rem
  
  .da
    width 2.7rem
    height .67rem
    background-image url(../assets/annual-ceremony/7.png)
    background-size 100% 100%
    &:hover
      background-image url(../assets/annual-ceremony/8.png)
  .ea
    margin-top .8rem
    height 1.22rem
    background-image url(../assets/annual-ceremony/5.png)
    background-position center
    background-repeat no-repeat
    background-size auto 100%
  .eb
    margin .3rem 0
  .eba
    color #ffff00
  .eca
    width 1.5rem
    
</style>


