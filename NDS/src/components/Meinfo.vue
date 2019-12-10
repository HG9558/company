<template lang="jade">
footer(:class="{'hide-info': hide, 'shorter' : isTry || (!me.canTopUp && !me.canWithDraw)}" style="z-index: 1")
  
  .el-icon-caret-left.text-666.breadth(style="display: none; position: absolute; right: .1rem; top : 250%; padding: .1rem 0; z-index: 1; cursor: pointer" @click=" __setCall({fn: '__toggleLefter', callId: undefined}) ")

  .el-icon-caret-right.text-666.height(style="" @click=" hide = !hide ")

  dl(v-if="!hide" @mouseover=" more = true " @mouseleave=" more = false ")
    dd
      span.name.ds-icon-m.font-light {{ name }}
    dd
      span.money.ds-icon-money.font-gold
        span.text-light 主：
        span {{ parseFloat(money || 0).toFixed(2) }}
    dd.ds-icon-t
      span.font-light &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 特：
      span.font-gold {{ parseFloat(smoney || 0).toFixed(2) }}
    dd
      span.free.ds-icon-free.font-light 券：{{ parseFloat(free || 0).toFixed(2) }}
  

  .buttons(style="padding: .05rem 0")
    span.ds-button.danger.xx-small(@click="doRecharge" v-if="!isTry && me.canTopUp") 充值
    span.ds-button.primary.xx-small(@click="withDraw" v-if="!isTry && me.canWithDraw") 提现

    span.ds-button.text-button.xx-small.light(style="padding: 0" @click="transfer = true") 转钱
    span.ds-button.text-button.xx-small.light(style="padding: 0" @click="logout") 退出

    
  el-dialog(title="线路切换" v-model="router"  custom-class="dialog-router" v-bind:modal="modal" v-bind:modal-append-to-body="modal" )
    LoginTest.no-title(v-bind:server="true" v-on:close=" router = false ")

  el-dialog(title="特殊金额转换" v-model="transfer" size="small" custom-class="dialog-transfer" v-bind:modal="modal" v-bind:modal-append-to-body="modal")
    p
      span.text-black.text-bold 特殊金额&nbsp;&nbsp;
      span.text-blue.to 转至
      span.text-black.text-bold &nbsp;&nbsp;可用余额
    br
    p 特殊账户余额： 
      | {{ smoney || '0.00' }} 
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

<style lang="stylus" scoped>
  @import '../var.stylus'
  // @import '../../../src/var.stylus'
  .xx-small
    padding  .05rem
    &:not(:first-child)
      margin-left .08rem
  
  .el-icon-caret-right.text-666.height
    background #888
    color #333
    transform rotateZ(-90deg)
    position: absolute; right: .95rem; top : 1.46rem; padding: .1rem 0; z-index: 1; cursor: pointer
    &:hover
      background #999
  .hide-info 
    .el-icon-caret-right.text-666.height
      top .25rem
      transform rotateZ(90deg)
      
    .el-icon-caret-left.text-666.breadth
      top 700% !important
    
    
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
