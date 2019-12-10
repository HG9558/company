<template lang="jade">
footer(:class="{'hide-info': hide, 'shorter' : isTry || (!me.canTopUp && !me.canWithDraw)}")
  
  .el-icon-caret-left.text-666(style="display: none; position: absolute; right: 0; top : 300%; padding: .1rem; z-index: 1; cursor: pointer" @click=" __setCall({fn: '__toggleLefter', callId: undefined}) ")

  el-popover.footer-more(placement="right-end" trigger="hover" v-model="more" v-bind:popper-class="'footer-popover more'" )
    dl(slot="reference")
      dd.taller
        span.name.ds-icon-m.font-light {{ name }}
      dd.taller(v-show="!hide")
        span.money.ds-icon-money.font-gold {{ money || '0.000' }}
      span.collapse.el-icon-caret-left.ds-button.text-button.light(@click="hide = !hide" v-if="!isTry") 
        span(v-show="!hide") 隐藏
        span(v-show="hide") 展开
      
      // span.name.ds-icon-m.font-light(v-show="!hide") {{ name }}
      // span.money.ds-icon-money.font-gold(v-show="!hide") {{ money || '0.000' }}
      // span.free.ds-icon-free.font-light(v-show="!hide" ) {{ free || '0.000' }}

    slot
      dl
        // dd(style="padding-bottom: .1rem")
          el-popover(placement="top-start" v-model="checkin"  trigger="manual" v-bind:popper-class="'footer-popover font-white message'" )
            // button.ds-button.primary(slot="reference" @click="checkinNow") 签到
            slot 
              p 已连续签到
                span.font-blue {{ checkDays }}天
                |，今日
                span.font-gold +{{ prizeAmount }}金币
          // .ds-button.primary(style="margin-left: .1rem" @click="router = true") 线路切换
        dd
          span.name.ds-icon-m.font-light {{ name }}
        dd
          span.money.ds-icon-money.font-gold
            span.text-light 主: 
            span {{ money || '0.000' }} 
          span.font-light 特: {{ smoney || '0.000' }} 
        dd
          span.free.ds-icon-free.font-light {{ free || '0.000' }}
        dd(style="padding-top: .1rem")
          .ds-button.primary(@click=" transfer = true ") 特殊金额转换
          .ds-button.cancel(@click="logout" style="margin-left: .1rem" ) 安全退出


  .buttons
    span.ds-button.danger(@click="doRecharge" v-if="!isTry && me.canTopUp") 充值
    span.ds-button.primary(@click="withDraw" v-if="!isTry && me.canWithDraw") 提现

    
  el-dialog(title="线路切换" v-model="router"  custom-class="dialog-router" v-bind:modal="modal" v-bind:modal-append-to-body="modal" )
    LoginTest.no-title(v-bind:server="true" v-on:close=" router = false ")

  el-dialog(title="特殊金额转换" v-model="transfer" size="small" custom-class="dialog-transfer" v-bind:modal="modal" v-bind:modal-append-to-body="modal")
    p
      span.text-black.text-bold 特殊金额&nbsp;&nbsp;
      span.text-blue.to 转至
      span.text-black.text-bold &nbsp;&nbsp;可用余额
    br
    p 特殊账户余额： 
      | {{ me.smoney || '0.000' }} 
    br
    p
      el-input-number(placeholder="输入金额" v-model="m" style="width: 2rem" label="描述文字")
      span.text-999  &nbsp;&nbsp;输入金额
    br
    p
      el-input(placeholder="输入资金密码" type="password" v-model="cpwd" style="width: 2rem" @keyup.enter.native="transferNow")
    br
    p
      span.ds-button.primary(@click="transferNow") 确认转入

</template>

<script>
import api from 'src/http/api'
import LoginTest from 'src/views/login/LoginTest'
import { toggleFullScreen } from 'src/util/Dom'
import util from 'src/util'
import store from 'src/store'
export default {
  props: ['menus', 'name', 'money', 'smoney', 'free'],
  components: {
    LoginTest
  },
  data () {
    return {
      model: store.state.user.model,
      isTry: store.state.user.isTry,
      login: store.state.user.login,
      me: store.state.user,
      modal: false,
      shows: {},
      more: false,
      checkin: false,
      router: false,
      transfer: false,
      tmodal: true,
      // name: '一介草民',
      hide: false,
      day: true,
      W: 48,
      full: false,
      checkDays: 0,
      prizeAmount: 0.00,
      timeout: 0,
      pricePotAmount: 0,
      pricePotCount: 0,
      m: '',
      cpwd: ''
    }
  },
  mounted () {
    setTimeout(this.setBottomChat, 0)
    setTimeout(this.setBottomChat, 50)
    setTimeout(this.setBottomChat, 100)
    this.__setCall({fn: '__getUserFund', callId: undefined})
    // if (this.login) {
    //   this.pricePot()
    //   this.timeout = setInterval(this.pricePot, 5000)
    // }
    // this.initShows()
    // this.setFarChat()
    // setTimeout(this.getPos, 0)
    // setTimeout(this.getPos, 50)
    // setTimeout(this.getPos, 100)
    // setTimeout(this.getPos, 500)
    // util.addEvent('resize', window, () => {
    //   this.getPos()
    // })
    // if (this.model === 'day') this.day = true
    // if (this.model === 'night') this.day = false
    // document.body.className = this.day ? 'day' : 'night'
    // if (!window.screenTop && !window.screenY) this.full = false
    // else this.full = true
    // // this.$emit('set-Model', this.day ? 'day' : 'night')
  },
  activated () {
    // setTimeout(this.setBottomChat, 5000)
    // this.setFarChat()
    // setTimeout(this.getPos, 0)
    // setTimeout(this.getPos, 50)
    // setTimeout(this.getPos, 100)
    // setTimeout(this.getPos, 500)
  },
  computed: {
    ML () {
      return this.menus.length
    }
  },
  watch: {
    transfer () {
      this.cpwd = ''
      this.m = 0
    },
    day () {
      store.actions.setUser({model: this.day ? 'day' : 'night'})
      // document.body.className = this.day ? 'day' : 'night'
    },
    more () {
      this.more && this.__setCall({fn: '__getUserFund', callId: undefined})
    }
  },
  beforeDestroy () {
    // clearInterval(this.timeout)
    // if (store.state.user.login) this.$emit('logout', true)
    this.setFarChat({})
  },
  methods: {
    transferNow () {
      if (!this.m) return this.$message.warning({target: this.$el, message: '请输入转换金额！'})
      if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.m > this.me.smoney) return this.$message.warning({target: this.$el, message: '特殊账户余额不足！'})
      this.$http.post(api.transAmount, {amount: this.m, securityPwd: this.cpwd}).then(({data}) => {
        if (data.success === 1) {
          this.cpwd = ''
          this.m = 0
          this.$message.success({target: this.$el, message: data.msg || '特殊金额转换成功！'})
          this.transfer = false
        } else {
          this.$message.error({target: this.$el, message: data.msg || '特殊金额转换失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '特殊金额转换失败！'})
      })
    },
    pricePot () {
      this.$http.get(api.pricePot).then(({data}) => {
        if (data.success === 1) {
          this.pricePotAmount = data.amount
          this.pricePotCount = data.count
          // }
        } else {
          this.$message.error({target: this.$el, message: data.msg || '奖池信息获取失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '奖池信息获取失败！'})
      })
    },
    fullScreen () {
      toggleFullScreen()
      this.full = !this.full
    },
    // 今日签到
    checkinNow () {
      this.$http.get(api.getCheckToday).then(({data}) => {
        if (data.success === 1) {
          // if (data.enable === '1') {
          this.checkDays = data.checkDays
          this.prizeAmount = data.prizeAmount
          this.checkin = true
          setTimeout(() => {
            this.checkin = false
          }, 2000)
          // }
        } else {
          this.$message.error({target: this.$el, message: data.msg || '签到失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '签到失败！'})
      })
    },
    setFarChat ({top, left}) {
      let chat = document.querySelector('.custom-service-box')
      chat.style.top = top || '200000px'
      chat.style.left = left || '-200000px'
    },
    setBottomChat () {
      let chat = document.querySelector('.custom-service-box')
      chat.style.top = 'auto'
      chat.style.left = '150px'
      chat.style.bottom = '80px'
      chat.style.right = '0px'
    },
    getPos () {
      if (this.$el.querySelector('.icon-button.ds-icon-chat-middle')) {
        let pos = util.getOffset(this.$el.querySelector('.icon-button.ds-icon-chat-middle'))
        let chat = document.querySelector('.custom-service-box')
        if (chat && pos.top !== 0) {
          chat.style.top = pos.top + 'px'
          chat.style.left = pos.left + 'px'
        }
      }
    },
    mouseover (menu) {
      if (menu.url === 'game') {
        this.__setCall({
          fn: '__guideStep'
        })
      }
    },
    openChat (url) {
      if (url === 'chat') {
        window.accessAngular.open()
      }
    },
    // initShows () {
    //   this.shows = this.menus.reduce((p, m, i) => {
    //     p[i] = false
    //     return p
    //   }, {})
    // },
    openPage (url) {
      this.$emit('open-page', url)
    },
    open (item, index) {
      this.__setCall({
        fn: '__closeGuide'
      })
      // this.$nextTick(() => {
      //   this.shows[index] = false
      //   this.openPage(item.id)
      // })
      setTimeout(() => {
        this.shows[index] = false
        this.openPage(item.id)
      }, 0)
    },
    logout () {
      this.$emit('logout')
    },
    doRecharge () {
      // this.$http.get(api.doRecharge).then(({data}) => {
      //   if (data.success === 1) {
      //     this.$modal.warn({
      //       content: '充值验证码为：' + data.securityCode,
      //       btn: ['去充值'],
      //       href: [data.path],
      //       // target: this.$el.parentNode,
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
      this.$router.push('/me/2-4-1')
    },
    withDraw () {
      this.$router.push('/me/2-5-1')
    }
  }
}
</script>
<style lang="stylus">
  @import '../var.stylus'
  H = .44rem
  W = .32rem
  .el-popover .popper__arrow
    display none
  .footer-popover
    transform translateY(.05rem)
    &.game
      max-width 9rem
      .submenu
        width 3rem
      
    .submenu
      float left
      display inline-block
      margin 0 .3rem
      dt
        font-size .18rem
        color BLUE
        font-shadow()
        padding PW 0 .18rem 0
      dd:not(.inner-submenu)
        height H - .06rem
        line-height H - .06rem
        // &[class*=ds-icon]
        //   padding-left W + .05rem
        cursor pointer
        // &:hover
        //   color BLUE-HOVER
        .ds-button
          border none
          background none
          box-shadow none
          text-shadow none
          &:hover
            background-color BLUE
          
      &.with-icon
        dt
          padding PW 0
        dt
        dd
          padding-left W + .05rem
        dd:not(.inner-submenu)
          height H
          line-height H
          // &[class*=ds-icon]
          //   padding-left W + .05rem
      &.game
        dd
          display inline-block
          margin-right PWX
          width .6rem + .4rem
          height .6rem + .4rem
          // margin-top PW
          margin -.1rem 0 0 -.1rem
          float left
          transition all linear .2s // @static 2
          transform perspective(100px) translateZ(-30px)
          
          &:hover
            // transform perspective(100px) translateZ(30px)
            transform perspective(100px) translateZ(0)
          
      .inner-submenu
        float left
        &:not(:last-child)
          margin-right .2rem
  
  NW = .26rem
  MW = .26rem
  FW = .26rem
  PW = .05rem
  .footer-popover.more
    padding PWX
    transform translateX(.2rem)
    dd
      padding .05rem 0
      line-height .24rem
      .name
        padding 2*PW 0
        padding-left NW + .03rem
        margin-right 2*PW
      .money
        padding 2*PW 0
        padding-left FW + .03rem
        margin-right 2*PW
      .free
        padding 2*PW 0
        padding-left FW + .03rem
        margin-right 2*PW
  .footer-popover.message
    transform translateY(-.2rem) translateX(-.2rem)
    
  .dialog-router
    width auto
    text-align left
    background-color #222330
    shadow()
    .el-dialog__header
      background-color #30313f
      .el-dialog__title
        color #fff    
    .el-dialog__body
      padding .5rem
    .login-test .routers
      padding 0
    
</style>
<style lang="stylus" scoped>
  @import '../var.stylus'
  @import '../../../src/var.stylus'
  
  footer
    .el-dialog__wrapper
      background rgba(0,0,0,.5)
    min-width auto
    height BH
    padding .2rem 0rem .2rem .2rem
    box-sizing border-box
    &.hide-info
      height .755*BH
    // text-align center
    .el-icon-caret-left:hover
      color #999
  NW = .26rem
  MW = .26rem
  FW = .26rem
  PW = .05rem
  .info
    text-align right
    line-height FH
    .name
      padding 2*PW 0
      padding-left NW + .03rem
      margin-right 2*PW
    .money
      padding 2*PW 0
      padding-left FW + .03rem
      margin-right 2*PW
    .free
      padding 2*PW 0
      padding-left FW + .03rem
      margin-right 2*PW
    
    .danger
      margin-right PW
    .text-button
      padding 0
    .logout
      margin-left .1rem
  
  dl
    position relative
    .collapse
      position  absolute
      right 0
      bottom -0.5*PW
      
  dd
    margin PW 0
    line-height .24rem
    text-align left
    &.taller
      margin PW*3 0
    .name
      padding 2*PW 0
      padding-left NW + .03rem
      margin-right 2*PW
    .money
      padding 2*PW 0
      padding-left FW + .03rem
      margin-right 2*PW
    .free
      padding 2*PW 0
      padding-left FW + .03rem
      margin-right 2*PW
    .collapse
      // margin-right 2*PW
      &:before
        font-size .08rem
      
  
</style>
