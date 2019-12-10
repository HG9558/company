<template lang="jade">
  .me-sideview.font-white
    i.ds-icon-me-avatar
    p.account 帐号：
      span {{ me.account }}
    div.me(v-if=" type === 'me' ")
      .ds-button.danger.full(v-if="me.canTopUp" @click.stop="topUp") 充值
      .ds-button.positive.full(v-if="me.canWithDraw" @click.stop="withDraw") 提现

    div.safe(v-if=" type === 'safe' ")
      p.icons
        i.ds-icon-greeting(:class="{on: me.greeting}")
        i.ds-icon-phone(:class="{on: me.phone}")
        i.ds-icon-email(:class="{on: me.email}")
        i.ds-icon-safe(:class="{on: me.safe}")
      p(style="margin: .1rem 0") 上次登录时间：{{ me.lastLoginTime }}
      p.safe-score
        | 您的账户安全评分为：
        span.score {{ me.safeScore }}
        |  分
      p.location(style="margin: .1rem 0")
        | 本次登录的参考位置：{{ me.location }}
        
      
</template>

<script>
  import store from '../store'
  // import api from '../http/api'
  export default {
    props: ['account', 'type'],
    data () {
      return {
        me: store.state.user
      }
    },
    methods: {
      topUp () {
        // block8/3 console.log('充值')
        // this.openPage
        this.doRecharge()
      },
      withDraw () {
        // block8/3 console.log('提现')
        this.$router.push('/me/2-1-2')
      },
      doRecharge () {
        // this.$http.get(api.doRecharge).then(({data}) => {
        //   if (data.success === 1) {
        //     this.$modal.warn({
        //       content: '充值验证码为：' + data.securityCode,
        //       btn: ['去充值'],
        //       href: [data.path],
        //       target: this.$el.parentNode,
        //       ok () {
        //         return false
        //       }
        //     })
        //   } else {
        //     this.$message.error({target: this.$el, message: data.msg || '充值请求失败！'})
        //   }
        // }).catch(rep => {
        //   this.$message.error({target: this.$el, message: '充值请求失败！'})
        // })
        this.$router.push('/me/2-1-1')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  W = 2.5rem
  
  .me-sideview
    position absolute
    top TH
    bottom 0
    left 0
    width W
    bg-gradient(45deg,  #719ee2, #a174b6)
    bg-gradient(45deg,  ORANGE, DANGER)
    border-bottom-left-radius .05rem
    background-size 100% 100%
    text-align center
    .ds-icon-me-avatar
      display block
      height 1.1rem
      margin .3rem 0 .1rem 0
      
  .account
    text-align center
    margin-bottom .3rem
  .ds-button
    width 1.7rem
    margin-bottom .1rem
  
  .safe
    padding-left .2rem
    font-size .12rem
    text-align left
    .ds-icon-greeting
    .ds-icon-phone
    .ds-icon-email
    .ds-icon-safe
      display inline-block
      width .4rem
      height .4rem
      margin-right .08rem
    .score
      font-family Roboto
      font-size .5rem
      
    
</style>


<style lang="stylus" scoped>
// to imitate the old ds
  @import '../var.stylus'
  body.nds
  body.cb.v2 .safe-detail-page
    .me-sideview
      position relative
      width auto
      height 1.6rem
      // background none 
      // color #666
      // text-shadow none
      padding 0 .2rem 
      .ds-icon-me-avatar
        display inline-block
        width 1.1rem
        float left
      .account
        display none
      .icons
        padding-left .3rem
      .safe
        padding-top .5rem
      .safe-score
      .location
        position relative
        top -1rem
        text-align right
        // float right
</style>
