<template lang="jade">
  .task
    .modal-header.absolute.t_c.c_f.ft30 新手任务
      el-button.close.absolute(icon="close" size="small" @click.native=" __setCall({fn: '__hideTask'}) ")
    
    div(style="padding: 0 .15rem")
      p.a.t_c 完成以下任务，即可豪领18元新人礼金
      .line
      .b.b1.ft16
        .inlb(style="width: 70%; vertical-align: middle")
          .ba 任务一：绑定银行卡
          .bb.text-999 为了方便您的购彩和提款，请先绑定银行卡
        .inlb.bc.t_c.ft18(:class=" { done: ME.t1 } " @click=" !ME.t1 && $router.push('/group/2-2-4') ") {{ ME.t1 ? '已完成' : '绑定银行卡'}}

      .line

      .b.b2.ft16
        .inlb(style="width: 70%; vertical-align: middle")
          .ba 任务二：进行一次成功充值
          .bb.text-999 现在充值就可以直接进入您想玩的游戏了
            p 信游平台有一流的网速银行支付渠道，充值秒速到账，
            p 提现三分钟搞定
        .inlb.bc.t_c.ft18(:class=" { done: ME.t2 } " @click=" !ME.t2 && $router.push('/me/2-1-1') ") {{ ME.t2 ? '已完成' : '去充值'}}

      .line

      .b.b3.ft16
        .inlb(style="width: 70%; vertical-align: middle")
          .ba 任务三：进行一次有效投注
          .bb.text-999 各类玩法应有尽有，快来试试您的运气吧！
        .inlb.bc.t_c.ft18(:class=" { done: ME.t3 } " @click=" !ME.t3 && $router.push('/game/1-1-1') ") {{ ME.t3 ? '已完成' : '去投注'}}

      .line
      
      .c.t_c
        .ca.c_f.ft18.inlb.pointer(:class=" { done: geted } " @click=" getIngotsPrize ") 领取18元礼金
        .pt15
        .cb.text-999(v-show=" !ME.t1 || !ME.t2 || !ME.t3 ") 您还未完成以上任务，暂时无法领取




      

</template>
<script>
  import store from '../store'
  import api from '../http/api'
  export default {
    data () {
      return {
        ME: store.state.user,
        geted: false
      }
    },
    methods: {
      getIngotsPrize () {
        this.$http.get(api.getIngotsPrize).then(({data: {success}}) => {
          if (success === 1) {
            this.$modal.success({
              content: '恭喜您，奖励领取成功',
              btn: []
            })
            this.geted = true
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
@import '../var.stylus'
  
.task
  position relative
  padding-top .8rem
  .modal-header
    top 0
    width 100%
    height .8rem
    line-height .8rem
    background-image url(../assets/task/pop_1.png)
    .close
      background-color rgba(255, 255, 255, .1)
      border 0
      color #fff
      font-size .2rem
      padding .1rem
      right 0
      height 100%
      width .8rem
      &:hover
        background-color rgba(255, 255, 255, .5)
        color DANGER
  .a
    color #faaf07
    font-size 20px  
    height .8rem
    line-height .8rem
  .b
    line-height .3rem
    padding .2rem .3rem .2rem .8rem
    background-repeat no-repeat
    background-position left .15rem
    &.b1
      background-image url(../assets/task/pop_3.png)
    &.b2
      background-image url(../assets/task/pop_4.png)
    &.b3
      background-image url(../assets/task/pop_5.png)
      

  .ba
    color #faaf07 
  .bc
    width: 1.8rem
    height .5rem
    line-height .5rem
    background-color #faaf07
    border-radius 25px
    color #fff
    vertical-align middle
    &.done
      background-color #bababa
    &:not(.done)
      cursor pointer
      &:hover
        opacity .8
    
  .line
    width 7.15rem
    opacity 0.2
    border 1px dashed #faaf07
  
  .c
    padding .5rem 0

  .ca
    width 3.94rem
    height .60rem
    line-height .6rem
    background-color #faaf07
    border-radius .30rem
    &:not(.done):hover
      opacity .8
    &.done
      background-color #bababa

</style>


