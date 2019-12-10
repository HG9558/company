<template lang="jade">
  .new-header

    el-dialog(title="特殊金额转换" v-model="transfer" size="small" custom-class="dialog-transfer" v-bind:modal="modal" v-bind:modal-append-to-body="modal")
      p
        span.text-black.text-bold 特殊金额&nbsp;&nbsp;
        span.text-blue.to 转至
        span.text-black.text-bold &nbsp;&nbsp;可用余额

      p 特殊账户余额：
        | {{ Me.smoney || '0.000' }}

      p
        el-input-number(placeholder="输入金额" v-model="m" style="width: 2rem" label="描述文字")
        span.text-999  &nbsp;&nbsp;输入金额

      p
        el-input(placeholder="输入资金密码" type="password" v-model="cpwd" style="width: 2rem" @keyup.enter.native="transferNow")

      p(style="padding-top: .1rem")
        span.ds-button.primary(@click="transferNow") 确认转入


    el-dialog(title="BG金额转换" v-model="transferBG" size="small" custom-class="dialog-transfer" v-bind:modal="modal" v-bind:modal-append-to-body="modal")

      .ds-button-group(style="margin-left: 0")
        .ds-button.text-button(:class=" { selected: bg === 0 } " @click=" bg = 0 ") BG转至余额
        .ds-button.text-button(:class=" { selected: bg === 1 } " @click=" bg = 1 ") 余额转至BG

      p
        span.text-black.text-bold {{ bg !== 0 ? '可用余额' : 'BG余额' }}&nbsp;&nbsp;
        span.text-blue.to 转至
        span.text-black.text-bold &nbsp;&nbsp;{{ bg === 0 ? '可用余额' : 'BG余额' }}

      p 可用余额：
        | {{ Me.amoney || '0.000' }}
      p BG余额：
        | {{ Me.bgmoney || '0.000' }}

      p
        el-input-number(placeholder="输入金额" v-model="m" style="width: 2rem" label="描述文字")
        span.text-999  &nbsp;&nbsp;输入金额

      p
        el-input(placeholder="输入资金密码" type="password" v-model="cpwd" style="width: 2rem" @keyup.enter.native="transferNowBG")

      p(style="padding-top: .1rem")
        span.ds-button.primary(@click="transferNowBG") 确认转入

    el-row.content-width
      el-col.l.flex(:span="9")
        router-link.text-button.text-black(:to=" '/help/6-2-1' " style="cursor: pointer" title="查看公告信息") 公告
        //- router-link.text-button(:to=" m.defaultUrl || '/' " v-for=" m in meLeftMenu " v-if=" !m.removed ") {{ m.title }}
        Marquee(v-bind:show="true" v-bind:content="marqueeData" @click="$router.push('/help/6-2-1')")
      el-col.r(:span="15")
        a.link(href="https://www.xygames.net/pages/brand.html" target="_blank") 信游品牌
        //- Menus(:menus="menus")

        el-popover(placement="bottom-end" trigger="hover" v-bind:popper-class=" 'lt-popover' " v-bind:visible-arrow="false")
          span(slot="reference")
            span.speed 测速
          slot
            .content-width
              LT
              
        el-popover.footer-more(placement="top-end" trigger="hover" v-model="more" v-bind:popper-class="'footer-popover more'" )
          span(slot="reference")
            span.name(v-if="hide") {{ Me.name }}
            span.money(v-if="!hide") 余额：{{ numberWithCommas(Me.amoney) }}
          slot
            .me-box
              .half-width.a
                dl.text-999.level-box(:class=" 'level-' + (Me.level + 1) ")

                  dd
                    span  贵族等级：
                      span.text-666 {{ Me.levelName || '' }} {{ Me.subLevel ? '(Lv' + Me.subLevel +')' : '' }}

                  dd
                    span  当前经验：
                      span.text-666 {{ Me.exp || 0 }}

                   dd
                    span  升级还需：
                      span.text-666 {{ Me.diffExp || 0 }}


                dl(style="padding-top: .11rem")
                  dd
                    el-progress(v-bind:text-inside="true" v-bind:stroke-width="30" v-bind:percentage=" Math.min(Number((Me.exp * 100 / Me.nexMinExp).toFixed(2)) || 0, 100)  " status="exception")

              //- dd
                router-link.ds-button.primary.full(:to=" '/me/2-1-3' ") 进入我的钱包
                //- dd.text-center
                  p.text-black 最后登录
                  p {{ Me.lastLoginTime }} {{ Me.location }}

              dl.text-999.half-width

                dd
                  span.name.ds-icon-m  欢迎光临{{ Me.name ? '，' : ''}}
                    span.text-666 {{ Me.name }}


                dd(title="我的钱包")
                  span.money.ds-icon-money
                    span  主余额：
                    span.text-666 {{ numberWithCommas(Me.amoney || '0.000') }}

                dd
                  span.account-type 特殊余额：
                    span.text-666 {{ numberWithCommas(Me.smoney || '0.000') }}
                dd

                dd
                  router-link.ds-button.primary.full(:to=" '/me/2-1-3' ") 进入我的钱包
                dd
                dd


              dl.lst-login
                dd.text-center
                  p.text-black 最后登录
                  p {{ Me.lastLoginTime }} {{ Me.location }}



        span.collapse.el-icon-caret-left.text-666(@click="hide = !hide" style="padding: 0 .05rem; text-decoration: none;cursor: pointer")
          span(v-show="!hide") 隐藏
          span(v-show="hide") 展开

        router-link.topup(:to=" '/me/2-1-1' " v-if="!Me.isTry && Me.canTopUp") 充值
        router-link.withdraw(:to=" '/me/2-1-2' " v-if="!Me.isTry && Me.canWithDraw") 提现
        router-link.transfer(:to=" '/me/2-1-3' " v-if="!Me.isTry && Me.canWithDraw") 转帐
        Menus(:menus=" meRightMenu " v-on:open-page="openTab" style="left: 0")
        span.logout(@click="logout" ) 退出




</template>

<script>
import { numberWithCommas } from '../util/Number'
import store from '../store'
import api from '../http/api'
import Menus from './Menu'
import Marquee from './Marquee'
import LT from '../views/login/LoginTest'
export default {
  props: ['menus'],
  components: {
    LT,
    Menus,
    Marquee
  },
  data () {
    return {
      hide: false,
      Me: store.state.user,
      notices: [],
      i: 0,
      more: false,
      checkin: false,
      transfer: false,
      modal: false,
      cwd: '',
      m: '',
      transferBG: false,
      bg: 0,
      numberWithCommas: numberWithCommas,
      marqueeData: []
    }
  },
  watch: {
    transfer () {
      this.cpwd = ''
      this.m = 0
    },
    more () {
      if (this.more) {
        this.getBalance()
        this.acctSecureInfo()
        this.getUserIdentity()
        this.__setCall({fn: '__getUserFund', callId: undefined})
      }
    }
  },
  computed: {
    // apply on Me.vue left menu
    meLeftMenu () {
      return [this.menus[15], this.menus[16], this.menus[17]]
    },
    // apply on Me.vue right menu
    meRightMenu () {
      return [this.menus[13]]
    },
    bgAPI () {
      return [api.withdrawFromBG, api.transferToBG][this.bg]
    }
  },
  mounted () {
    this.sysNotices()
    this.switchI()
    this.getBalance()
    this.getUserIdentity()
  },
  methods: {
    getUserIdentity () {
      this.$http.get(api.getUserIdentity).then(({data}) => {
        if (data.success) {
          delete data.success
          store.actions.setUser(data)
        }
      })
    },
    acctSecureInfo () {
      this.$http.get(api.acctSecureInfo).then(({data}) => {
        if (data.success === 1) {
          store.actions.setUser({
            email: data.email,
            phone: data.mobile,
            greeting: data.greetMsg,
            pwd: data.isSetLoginPwd,
            cashPwd: data.isSetSecurityPwd,
            safe: data.isSetSafeQuest,
            safeCheck: data.isSetVerifytype,
            cbsafe: !!data.isOpenKey,
            safeScore: data.accountPoint,
            location: data.location,
            lastLoginTime: data.lastLoginTime
          })
          this.safeCheck = data.isSetVerifytype
        }
      })
    },
    openTab (url) {
      this.$emit('open-page', url)
    },
    getBalance () {
      this.$http.get(api.getBalance).then(({data}) => {
        if (data.success === 1) {
          store.actions.setUser({
            bgmoney: data.bgAmount || 0,
            tcgmoney: data.sportsAmount || 0,
            kymoney: data.kyAmount || 0,
            ptmoney: data.ptAmount || 0,
            agmoney: data.agAmount || 0,
            sbmoney: data.sbAmount || 0,
            lymoney: data.lyAmount || 0,
            uwinmoney: data.uwinAmount || 0,
            kgmoney: data.kgAmount || 0,
            litAmount: data.litAmount || 0,
            pbAmount: data.pbAmount || 0,
            lgAmount: data.lgAmount || 0,
            xyAmount: data.xyAmount || 0,
            xyqpAmount: data.xyqpAmount || 0,
            saAmount: data.saAmount || 0,
            saEgameAmount: data.saEgameAmount || 0,
            vgAmount: data.vgAmount || 0,
            gdAmount: data.gdAmount || 0,
            dsAmount: data.dsAmount || 0,
            jjbAmount: data.jjbAmount || 0,
            dfAmount: data.dfAmount || 0
          })
          // store.actions.setUser({bgmoney: data.amount || 0, kymoney: data.kyAmount})
        }
      }).catch(rep => {
        // this.$message.error({target: this.$el, message: '特殊金额转换失败！'})
      })
    },
    transferNow () {
      if (!this.m) return this.$message.warning({target: this.$el, message: '请输入转换金额！'})
      if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.m > this.Me.smoney) return this.$message.warning({target: this.$el, message: '特殊账户余额不足！'})
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
    transferNowBG () {
      if (!this.m) return this.$message.warning({target: this.$el, message: '请输入转换金额！'})
      if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.bg === 0 && (this.m > this.Me.bgmoney)) return this.$message.warning({target: this.$el, message: 'BG余额不足！'})
      else if (this.bg !== 0 && (this.m > this.Me.amoney)) return this.$message.warning({target: this.$el, message: '可用余额不足！'})
      this.$http.get(this.bgAPI, {amount: this.m, securityPwd: this.cpwd}).then(({data}) => {
        if (data.success === 1) {
          this.cpwd = ''
          this.m = 0
          this.$message.success({target: this.$el, message: data.msg || 'BG余额转换成功！'})
          this.transferBG = false
          this.getBalance()
        } else {
          this.$message.error({target: this.$el, message: data.msg || 'BG余额转换失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: 'BG余额转换失败！'})
      })
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
    switchI () {
      setInterval(() => {
        this.i++
        if (this.i === this.notices.length) this.i = 0
      }, 5000)
    },
    // 11、系统公告   ALL
    sysNotices () {
      this.$http.myget(api.sysNotices, {isReleaseLine: 1}).then(({data}) => {
        // success
        if (data.success) {
          this.notices = data.sysNotices || []
          this.marqueeData = data.sysNotices.slice(0, 3).map((item, i) => {
            return (`${i + 1}.【${item.subject}】 ${item.content}`).replace(/\r\n/g, '')
          })
        }
      }, (rep) => {
        // error
      })
    },
    logout () {
      this.$modal.info({
        content: '您确认要退出吗？',
        btn: ['确定', '再玩一会'],
        btnClass: {info: ['cancel', 'primary']},
        ok () {
          this.__setCall({fn: '__logout', args: undefined})
        },
        O: this
      })
    }
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
body.cb.v2
  .el-popover .popper__arrow
    display block
  .footer-popover.more
    transform translateY(-0.02rem)
  .footer-popover.message
    transform: translateY(-0.2rem) translateX(0.2rem);
  .footer-popover
    background #e5e7eb
    &.more
      background #fff
      padding 0
      dl
        padding-top PW
        dd
          padding .05rem PWX


      .account-type
        padding: 0.1rem 0;
        padding-left: 0.29rem;
        margin-right: 0.1rem;
        background url(../assets/v2/index_qb_icon_01.png) left center no-repeat


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

  footer > .el-dialog__wrapper:first-child
  .new-home .el-dialog__wrapper
    background rgba(0,0,0,.5)

  .dialog-transfer
    width auto
    text-align left
    background-color #ededed
    // padding .2rem .4rem
    .el-dialog__body
      padding 2 * PWX 8 * PWX
    .text-black
      font-size .18rem
    .to
      padding PWX PW
      background url(../assets/game/new/to.png) center bottom .1rem no-repeat

</style>

<style lang="stylus">
.marquee-bar-wp
  width 3.5rem
  cursor pointer
  .mq-content-wp
    height 0.4rem
    .items
      li
        padding 0 0.25rem
</style>
<style lang="stylus" scoped>
@import '../var.stylus'
@import '../path.stylus'
.new-header
  position relative
  max-width 100%
  line-height .36rem
  background-color #ffa930
  color #484342

  .l .text-button
    color #fff
    padding 0 .1rem !important
    &:hover
      background-color rgba(255, 255, 255, .5)


  .link
    line-height 0.36rem
    display inline-block
    padding 0 .04rem
    &:hover
      background rgba(255,255,255,0.5)
  .r
    text-align right
  .l .text-button
  .r .name
  .r .money
  .r .speed
  .r .topup
  .r .withdraw
  .r .transfer
  .r .logout
    position relative
    display inline-block
    padding 0 .04rem 0 .2rem
    color #2e2a29
    cursor pointer
    background-position .02rem center
    background-repeat no-repeat
    &.name
      background-image url(../assets/v2/icon02.png)
    &.money
      background-image url(../assets/v2/icon03.png)
    &.speed
      background-image url(../assets/v2/sy_icon_cs.png)
    &.topup
      background-image url(../assets/v2/icon04.png)
    &.transfer
      background-image url(../assets/v2/icon08.png)
    &.withdraw
      background-image url(../assets/v2/icon09.png)
    &.logout
      background-image url(../assets/v2/icon05.png)

    &:hover
      background-color rgba(255, 255, 255, .5)

.me-box
  width 5.5rem
.half-width
  box-sizing border-box
  width 50%
  display inline-block
  vertical-align top
  position relative
  &.a
    &:after
      content ''
      position absolute
      top 10%
      right 0
      height 80%
      border-right 2px solid #efefef

.lst-login
  background #e9e9e9
  padding PWX
.level-box
  padding-left 30%
  background-size .9rem
  background-repeat no-repeat
  background-position 5% .2rem
for n in (1..10)
  &.level-{n}
    background-image url('../assets/level/' + n + '.png')
</style>
