<template lang="jade">
  footer(ref="myFooter")
    
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


    el-row(v-show="!hideAll")
      el-col.menu(:span="10" v-bind:offset="0")

        // v-bind:placement=" mode ? 'top' : 'bottom' "
        el-popover(:ref="menu.url" v-for=" (menu, index) in menus" placement="top-start"  trigger="hover" v-bind:popper-class="'footer-popover font-white left-menus ' + menu.url + ' ' + (menu.groups && menu.groups[0] ? true : false) + (menu.hideIcon ? ' hide-icon' : false) + (menu.hideIconOnHover ? ' hio ' : '') " v-model="shows[index]" v-show="!menu.hide") 


          .icon-button.after-title(v-bind:class="[menu.class + '-middle']" slot="reference" v-show="!menu.href && !menu.removed" v-on:mouseover="mouseover(menu)" @click="openChat(menu.url)" v-bind:mytitle=" menu.title ") 
          router-link.icon-button.after-title(:to="menu.href"  v-bind:class="[menu.class + '-middle']" slot="reference" v-if="menu.href && !menu.removed" @click.native.stop="" v-bind:mytitle=" menu.title || menu.mytitle")
          slot
            dl.submenu(v-if=" !menu.hideIcon && group.footer !== false && group.items.filter(function(x){return !x.removed})[0]" v-for="group in menu.groups" v-bind:class="[menu.url, group.url, {'with-icon': group.withIcon}]" v-bind:style="{ width: group.width }")
              dt
                span.title(v-if="group.title && group.items.filter(function(x){return !x.removed})[0]")  {{ group.title }}
              dd(v-for="item in group.items" v-bind:class="[item.class]" @mouseover="over(item)" @click="open(item, index)" v-if="item.title && !item.removed && !item.hide") 
                .ds-button(style="position: relative; ") {{ menu.url === 'game' ? '' : item.title }}
                .game-title(style="position: absolute;  width: 100%; font-size: .14rem; color: #9897b2" v-if=" menu.url === 'game' ") 
                  span.text-gold {{ item.pretitle }}
                  | {{ item.title }}

              dd.inner-submenu(v-if="!item.title" v-for="item in group.items" )
                dl
                  dd( v-for="i in item"  @click="open(i, index)") {{ i.title }}

            dl.submenu.hover-show-ssubmenu(v-if=" menu.hideIcon ")
              dt
                span.title {{ '所有游戏' }}
              dd(v-for="(group, iii) in menu.groups")
                  span.ds-button(v-if="group.title && group.items.filter(function(x){return !x.removed})[0]")  {{ group.title }}
                  .ssubmenu.el-popover.footer-popover.font-white(v-bind:class="{toolong: (group.items.length > 2) && ((group.items.length + (iii || menu.groups[1].items.filter(function(x){return !x.removed}).length)) > 9) }")
                     dl.submenu
                       dd(v-for="item in group.items"   @mouseover="over(item)" @click="open(item, index)" v-if="item.title && !item.removed") 
                         .ds-button(style="position: relative; ") {{ item.title }}
                       dd(v-for=" iitem in menu.groups[1].items " v-if="iii === 0 && iitem.title && !iitem.removed" @mouseover="over(item)"  @click="open(iitem, index)")
                         .ds-button(style="position: relative; ") {{ iitem.title }}

              // el-popover(v-for="(group, iii) in menu.groups"  placement="right-start" trigger="hover" options="{ removeOnDestroy: true }"  offset="0" v-bind:popper-class="'sst footer-popover font-white' ") 
              //   dd(style="max-width: 1rem" slot="reference")
              //     span.ds-button(v-if="group.title && group.items.filter(function(x){return !x.removed})[0]")  {{ group.title }}
              //   slot
              //     dl.submenu(style="min-width: 1.2rem")
              //       dd(v-for="item in group.items"  @click="open(item, index)" v-if="item.title && !item.removed") 
              //         .ds-button(style="position: relative; ") {{ item.title }}
              //       dd(v-for=" iitem in menu.groups[1].items " v-if="iii === 0 && iitem.title && !iitem.removed" @click="open(iitem, index)")
              //         .ds-button(style="position: relative; ") {{ iitem.title }}

             
              span.ds-button.text-button.light(style="margin-top: .15rem" v-if=" menu.url === 'game' && menu.hideIcon " @click=" dododo(menu)") {{ !menu.hideIcon ? '简化菜单' : '图例菜单' }}
              
              
            .ds-button.text-button.light.pattern(style="float: right; margin-top: -.35rem" v-if=" menu.url === 'game' && !menu.hideIcon " @click=" dododo(menu)") {{ !menu.hideIcon ? '简化菜单' : '图例菜单' }}


      el-col.info(:span="10" v-bind:offset="4")
        el-popover.footer-more(placement="top-start" trigger="hover" v-model="more" v-bind:popper-class="'footer-popover more'" )
          span(slot="reference")
            span.name.ds-icon-m.font-light(v-show="!hide" v-bind:class="{vip: !!vip}" v-bind:level = " vip ") {{ name }}
            span.money.ds-icon-money.font-gold(v-show="!hide") {{ money || '0.000' }}
            // span.free.ds-icon-free.font-light(v-show="!hide" ) {{ free || '0.000' }}
          slot
            dl
              dd(style="padding-bottom: .1rem")
                el-popover(placement="top-start" v-model="checkin"  trigger="manual" v-bind:popper-class="'footer-popover font-white message'" )
                  button.ds-button.primary.full(slot="reference" @click="checkinNow") 签到
                  slot 
                    p 已连续签到
                      span.font-blue {{ checkDays }}天
                      |，今日
                      span.font-gold +{{ prizeAmount }}金币
                // .ds-button.primary(style="margin-left: .1rem" @click="router = true") 线路切换
              dd
                span.name.ds-icon-m.font-light(v-show="!hide") {{ name }}
              dd 
                span.money.ds-icon-money.font-gold
                  span.text-light 主: 
                  span {{ money || '0.000' }} 
                span.font-light 特: {{ smoney || '0.000' }}
              dd
                span.free.ds-icon-free.font-light(v-show="!hide") {{ free || '0.000' }}
              dd(style="padding-top: .1rem")
                .ds-button.primary(@click=" transfer = true ") 特殊金额转换
                .ds-button.cancel(@click="logout" style="margin-left: .1rem" ) 安全退出


        span.collapse.el-icon-caret-left.ds-button.text-button.light(@click="hide = !hide" v-if="!isTry") 
          span(v-show="!hide") 隐藏
          span(v-show="hide") 展开
        span.ds-button.danger(@click="doRecharge" v-if="!isTry && me.canTopUp") 充值
        span.ds-button.primary(@click="withDraw" v-if="!isTry && me.canWithDraw") 提现

        .switch-box.ds-icon-day-model(:class=" { no: !day} " style="margin-right: .05rem")
          el-switch(v-model="day" on-text="日" off-text="夜" on-color="#ccc" off-color="#13ce66" v-bind:width="W")
        // classic use
        .switch-box(style="display: inline-block")
          el-switch(v-model="mode" on-text="时尚" off-text="经典" on-color="#ccc" off-color="#13ce66" v-bind:width="60")

        span.ds-icon-full-screen(:class=" { no: full } " @click="fullScreen")

    router-link.logo.ds-icon-logo-middle(:to="' /home '" @click.native.stop="" style="z-index: 2")

    .logo(style="cursor: pointer; user-select: none;")
      .text-white.hide(style="position: relative; top: .9rem;font-size: .16rem" @click.stop="collapseFooter") 隐 藏 菜 单
      .text-white.show(style="position: relative; top: -.45rem;font-size: .16rem" @click.stop="collapseFooter") 显 示 菜 单

    .logo.ds-icon-pot(style="width: auto; width: 507px; height: 204px; top: -1.5rem; padding-top: .725rem; z-index: 0; background-size: 80%" v-show="showPool")
      div(style="padding: 0 .3rem; display: inline-block")
        p.text-white(style="font-size: .16rem") 平台奖池累计：
          span.amount.text-gold(style="font-size: .4rem; font-family: Roboto; font-weight: 700; color: #ffea00; margin-top: .2rem; vertical-align: sub") {{ EM }}
      // div(style="padding: 0 .3rem; display: inline-block")
      //   p.font-white(style="font-size: .12rem") 参与人次
      //   p.amount.font-gold(style="font-size: .24rem; font-family: Roboto; color: #ffea00; margin-top: .1rem; vertical-align: sub") {{  pricePotCount }}
      
    
    el-dialog(title="线路切换" v-model="router"  custom-class="dialog-router" v-bind:modal="modal" v-bind:modal-append-to-body="modal" )
      LoginTest.no-title(v-bind:server="true" v-on:close=" router = false ")


    // a submit form
    form(id="TheForm" method="post" action="" target="TheWindow")
      input(type="hidden" name="data" value="")
      input(type="hidden" name="version" value="")
      input(type="hidden" name="id" value="")


      
</template>

<script>
import api from '../http/api'
import LoginTest from '../views/login/LoginTest'
import { toggleFullScreen } from '../util/Dom'
import { numberWithCommas } from '../util/Number'
import util from '../util'
import store from '../store'
export default {
  props: ['menus', 'name', 'money', 'smoney', 'free', 'vip'],
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
      mode: true,
      W: 48,
      full: false,
      checkDays: 0,
      prizeAmount: 0.00,
      timeout: 0,
      pricePotAmount: 0,
      pricePotCount: 0,
      showPool: false,
      m: '',
      cpwd: '',
      formData: {
        // data: '',
        // version: 0,
        // id: '',
        // vrurl: ''
      }
    }
  },
  mounted () {
    if (this.login) {
      this.pricePot()
      this.timeout = setInterval(this.pricePot, 60000)
    }
    this.initShows()
    this.setFarChat()
    setTimeout(this.getPos, 0)
    setTimeout(this.getPos, 50)
    setTimeout(this.getPos, 100)
    setTimeout(this.getPos, 500)
    util.addEvent('resize', window, () => {
      this.getPos()
    })
    this.day = (this.model === 'day')
    this.mode = (this.me.mode !== 'classic')
    if (!window.screenTop && !window.screenY) this.full = false
    else this.full = true
    // this.$emit('set-Model', this.day ? 'day' : 'night')
    // VRVRVR
    if (this.platform !== 'ds') {
      this.openExternal(1)
      this.openExternal(2)
      this.openExternal(11)
      this.openExternal(13)
      this.openExternal(15)
    }
  },
  activated () {
    this.setFarChat()
    setTimeout(this.getPos, 0)
    setTimeout(this.getPos, 50)
    setTimeout(this.getPos, 100)
    setTimeout(this.getPos, 500)
  },
  computed: {
    ML () {
      return this.menus.filter(m => !m.removed).length
    },
    EM () {
      return numberWithCommas(this.pricePotAmount || 0)
    }
  },
  watch: {
    transfer () {
      this.cpwd = ''
      this.m = 0
    },
    showPool () {
    },
    day () {
      store.actions.setUser({model: this.day ? 'day' : 'night'})
      document.body.className = this.me.css
    },
    mode () {
      store.actions.setUser({mode: this.mode ? 'fashion' : 'classic'})
      document.body.className = this.me.css
      this.getPos()
      setTimeout(this.getPos, 0)
      setTimeout(this.getPos, 50)
      setTimeout(this.getPos, 100)
      setTimeout(this.getPos, 500)
      // document.body.className = this.mode ? 'classic' : 'fashion'
    },
    more () {
      this.more && this.__setCall({fn: '__getUserFund', callId: undefined})
    },
    ML () {
      this.getPos()
      setTimeout(this.getPos, 50)
      setTimeout(this.getPos, 100)
    }
  },
  beforeDestroy () {
    clearInterval(this.timeout)
    // if (store.state.user.login) this.$emit('logout', true)
    // else
    this.setFarChat()
  },
  methods: {
    openExternal (fn) {
      this.formData = {}
      this.$http.mypost(api.loginVr, {channelId: fn || 12}).then(({data}) => {
        //
        this.formData[fn] = data
        // if (data.success === 1) {
        //   // this.openWindowWithPost(data)
        //   this.formData[fn] = data
        // } else {
        //   // this.$message.error({target: this.$el, message: data.msg || '第三方游戏获取失败！'})
        // }
      }).catch(rep => {
        // this.$message.error({target: this.$el, message: '第三方游戏获取失败！'})
      })
    },
    openWindowWithPost ({data, version, id, vrurl, msg}) {
      if (!data) return this.$message.error({target: this.$el, message: msg || '第三方游戏获取失败！'})
      let f = document.getElementById('TheForm')
      f.data.value = data
      f.version.value = version
      f.id.value = id
      f.action = vrurl
      window.open('', 'TheWindow')
      f.submit()
    },
    // &amount=100&securityPwd=123456a
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
    dododo (menu) {
      menu.hideIcon = !menu.hideIcon
      this.$refs.game[0].$refs.popper.style.transform = menu.hideIcon ? (!menu.hideIconOnHover ? 'translateY(2.73rem)' : 'translateY(0.05rem)') : menu.hideIconOnHover ? 'translateY(-2.73rem)' : 'translateY(0.05rem)'
      return true
    },
    collapseFooter () {
      this.$emit('collapse-footer')
      if (this.$refs.myFooter.className.indexOf('collapse-footer') !== -1) {
        setTimeout(this.getPos, 0)
        setTimeout(this.getPos, 50)
        setTimeout(this.getPos, 100)
        setTimeout(this.getPos, 500)
      }
    },
    __showPool () {
      this.showPool = true
    },
    __hidePool () {
      this.showPool = false
    },
    pricePot () {
      this.$http.get(api.pricePot).then(({data}) => {
        if (data.success === 1) {
          this.pricePotAmount = data.amount || 0
          this.pricePotCount = data.count || 0
          // }
        } else {
          // this.$message.error({target: this.$el, message: data.msg || '奖池信息获取失败！'})
        }
      }).catch(rep => {
        // this.$message.error({target: this.$el, message: '奖池信息获取失败！'})
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
    setFarChat () {
      let chat = document.querySelector('.custom-service-box')
      chat.style.top = '200000px'
      chat.style.left = '-200000px'
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
        menu.hideIconOnHover = menu.hideIcon
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
    initShows () {
      this.shows = this.menus.reduce((p, m, i) => {
        p[i] = false
        return p
      }, {})
    },
    openPage (url) {
      this.$emit('open-page', url)
    },
    over (item) {
      if (item.fn) {
        // return this.openExternal(item.fn)
      }
    },
    open (item, index) {
      this.__setCall({
        fn: '__closeGuide'
      })
      // this.$nextTick(() => {
      //   this.shows[index] = false
      //   this.openPage(item.id)
      // })

      if (item.id) {
        if (item.fn) {
          return this.openWindowWithPost(this.formData[item.fn] || {})
        }
        setTimeout(() => {
          this.shows[index] = false
          this.openPage(item.id)
        }, 0)
      }
    },
    __openWindowWithPost (fn) {
      return this.openWindowWithPost(this.formData[fn] || {})
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
      this.$router.push('/me/2-1-1')
    },
    withDraw () {
      this.$router.push('/me/2-1-2')
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
    &.sst
      // transform translateY(-0.2rem) translateX(0.22rem)
    &.left-menus
      text-align center
    background rgba(49,41,84, .95)
    // transform translateY(.05rem)
    padding PW
    &.game
      max-width 8.7rem
      .submenu
        max-width 2.7rem
        &.LHG + .pattern
          margin-top .7rem !important
          float left !important
      &.hide-icon
        padding 0
        & > .submenu
          max-width 1.5rem
          margin .15rem 0
          & >dd
            padding 0 .2rem
            margin 0
            background none
            height auto
      
    .submenu
      &.hover-show-ssubmenu
        .ssubmenu
          max-width 3rem
          
          .submenu
            margin .15rem 0
            float none
            min-width 1.5rem
            width auto 
            background none
            box-shadow none !important
          &.toolong
            top -1.5rem
          padding 0
          position absolute
          left 100%
          top -.15rem
          display none
          // .ds-button
          //   line-height initial
        & > dd
          position relative
          &:hover .ssubmenu
          // .ssubmenu
            display block
      float left
      display inline-block
      margin 0 .1rem
      dt
        font-size .14rem
        color BLUE
        font-shadow()
        padding PW 0 .18rem 0
        height .3rem
        .title
          padding  .1rem .2rem
          bg-gradient(180deg, BLUE, #36b0d9)
          shadow()
          radius()
          color #fff
          position relative
          &:after
            content ''
            position absolute
            width 10px
            height 10px
            transform translateX(-50%) rotateZ(45deg)
            left 50%
            bottom -5px
            background-color #36b0d9
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
        dt
          text-align left
        dd
          position relative
          display inline-block
          margin-right PWX
          width .6rem + .4rem
          height .6rem + .4rem
          // margin-top PW
          margin -.1rem 0 .2rem -.1rem
          float left
          transition all linear .2s // @static 2
          transform perspective(100px) translateZ(0)
          background-size .7rem .7rem
          
          &:hover
            // transform perspective(100px) translateZ(30px)
            // transform perspective(100px) translateZ(0)
            background-size .96rem .96rem
            .game-title
              bottom -.3rem
            
          .game-title
            transition all linear .2s // @static 2
            bottom -.2rem
            
            // transform perspective(100px) translateZ(15px)
          
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
    transform translateY(-.2rem)
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
  


#app:not(.classic)
  & ~ [data-ng-app]
    .custom-service-box
      .custom-service
        top 0rem
      &:after
        position absolute
        top -.25rem
        left .2rem
        color rgba(255, 255, 255, .7)
        content '客服'

        font-size .14rem
        
</style>
<style lang="stylus" scoped>
  .after-title
    // background-position bottom center
    &:after
      content attr(mytitle)
      position absolute
      top -.25rem
      left 0 
      right 0
      color rgba(255, 255, 255, .7)
      text-align center

  .ds-button
    box-shadow none
  @import '../var.stylus'
  .logo .show
    display none
  footer
    &.collapse-footer
      .el-row
      .ds-icon-pot
      .logo .hide
        display none
      .logo .show
        display block
        
      
    // height FH
    text-align center
    bg-gradient(180deg, rgba(255, 255, 255, .1) 20%, rgba(0, 0, 0, .1))
    // @media screen and (max-width: 1100px)
      // height 2 * FH
    .logo
      position absolute
      top 0
      left 50%
      transform translateX(-50%)
      display inline-block
      width LGW
      height LGH
      z-index 1
    
    .amount
      font-gradient(180deg, #fff 10%, #ffd800)
      text-shadow none
      
  .el-row
    text-align left
    z-index 1
    padding 0 .3rem 0 .1rem
    // overflow hidden
    .el-col
      &:first-child
        // margin-right .5rem
      &:last-child
        // margin-left .5rem
      // height FH
      
      
  .menu
    min-height 1px
    .icon-button
      position relative
      display inline-block
      width FH
      height FH
      vertical-align middle
      radius()
      
      &:hover:after
        content ''
        display block
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        background linear-gradient(top left, rgba(255, 255, 255, .4), rgba(255, 255, 255, .1), rgba(255, 255, 255, .4))
        radius()
        
      &:before
        content ''
        display block
        position absolute
        top .1rem
        left .1rem
        width FH - .2rem
        height FH - .2rem
        box-sizing border-box
        background-color 
        z-index -1
        // box-shadow .02rem .02rem .02rem rgba(0, 0, 0, .2)
        radius(50%)
  
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
    .collapse
      &:hover
        text-decoration none
      margin-right 2*PW
      &:before
        font-size .08rem
    .danger
      margin-right PW
    .text-button
      padding 0
    .logout
      margin-left .1rem
  

  
</style>
