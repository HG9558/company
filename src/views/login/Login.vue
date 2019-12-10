<template lang="jade">
.login-form
  img(src="/static/pic/login_banner.jpg")
  dl(style="padding-top: .1rem")
    .contact(@click=" window.open(Me.chatUrlSlave || ME.chatUrl || 'https://vv66.chatbay.net/chat/chatClient/chatbox.jsp?companyID=80001506&configID=467', 'newwindow', 'width=920,height=700,left=400,top=300') ")
    dt.ds-icon-notice(:class="{ h0: !this.regard }" style="margin-top: .1rem")
      | 问候语：
      span.regard {{ regard }}

    // dt.ds-icon-notice(v-if="notice") {{ notice }}
      
    dt.dd(v-if=" platform !== 'ds' " style="font-size: .18rem; text-align: left; margin-top: 0rem")
      用户登录
      router-link.try.ds-button.text-button.light.small(:to="'/login/try'" @click.native.stop="" v-if="!m" style="float: right; color: #666") 试玩登录

    dd.ds-icon-user
      input( v-model="un_" @change="getGreetingMsg" autofocus)

    dd.ds-icon-pwd(v-bind:class="{disabled: disablePwd}")
        input(v-model="pwd" v-bind:disabled="disablePwd" type="password" maxLength="20")

    dd.ds-icon-edit(v-bind:class="{disabled: !pwd}")
      input( v-model="code_" @keyup.enter="login" v-bind:disabled="!pwd")
      i.ds-icon-code(v-bind:style="{background: 'url(' + img_ + ') right center no-repeat'}" @click="_getVerifyImage")

    dd.ds-button.positive.full.bold.login(@click="login" style="border: none") 登录

    dd.actions
      router-link.back-router.ds-button.text-button.light.small(:to="'/login'" @click.native.stop="" style="float: left") 切换线路
      .forget.ds-button.text-button.light.small(style="position: relative" v-bind:class="{over: over}" @mouseleave=" overf(0) " @mouseover=" overf(1) ") 无法登录
        .con(ref="con" style="position: absolute; left: .9rem; top: -3rem; max-height: 6rem; overflow: auto; padding: .3rem .5rem; background: #efefef; border-radius: 5px; cursor: default")
          p(style="color: red; margin: 0 .15rem") safari及其它浏览器请至“偏好设置” -> “隐私”中允许第三方cookie
          p(style="color: #349dbd; margin: 0 .15rem") 第一步： 点击浏览器右上角的设置图标，选择“Internet选项“
          div(style="display: inline-block; margin: 0 auto; padding: .1rem .1rem .05rem .1rem; border-radius: 5px; background: rgba(255, 255, 255, .5)")
            img(src="../../assets/1.png")
          p(style="color: #349dbd; margin: .15rem") 第二步： 点击"隐私“选项卡，将隐私策略调整到”低“
          img(src="../../assets/2.png")
      //- router-link.forget.ds-button.text-button.light.small(:to="'/login/forget'" @click.native.stop="") 忘记密码



           
</template>
<script>
  import api from '../../http/api'
  import xhr from 'components/xhr'
  import store from '../../store'
  // import { launchFullScreen } from '../../util/Dom'
  // import SlidePics from 'components/SlidePics'
  export default {
    name: 'Login',
    mixins: [xhr],
    props: ['m'],
    components: {
      // SlidePics
    },
    data () {
      return {
        ME: store.state.user,
        window: window,
        regard: false,
        pwd: '',
        over: false,
        overt: 0
        // safari: window.userPlatInfo.browser === 'safari'
      }
    },
    computed: {
      disablePwd () {
        // return !this.un_ || this.regard === false
        return false
      }
    },
    mounted () {
      let {un_, pwd, userId, sessionKey} = this.$route.query
      if (un_) this.un_ = un_
      if (pwd) this.pwd = pwd
      if (userId && sessionKey) {
        this.tryLoginFromUrl(userId, sessionKey)
      } else if (un_ && pwd) {
        setTimeout(() => {
          this.$el.querySelector('.ds-icon-edit input').focus()
        }, 0)
        this._getVerifyImage()
      } else {
        setTimeout(() => {
          this.$el.querySelector('.ds-icon-user input').focus()
        }, 0)
        setTimeout(() => {
          this.tryLogin(userId, sessionKey)
        }, 100)
      }
    },
    activated () {
    },
    methods: {
      loginSuccess (data) {
        // call app.vue loginsuccess
        this.__setCall({fn: '__loginSuccess', args: data, callId: undefined})
      },
      login () {
        if (this.hasEmpty()) {
          this.$message.warning('输入值不能为空')
        } else {
          // launchFullScreen(document.body)
          this._checkVerifyCode(() => {
            this.$http.post(api.validate, {userName: this.un_, userPwd: this.pwd, verifyCode: this.code_, channelType: 'web', timeout: 5000}).then(({data}) => {
              // success
              if (data.success === 1) {
                this.loginSuccess(data)
              } else {
                this.$message.error(data.msg || '用户名或密码错误！')
                this.code_ = ''
                this.pwd = ''
                this._getVerifyImage()
              }
            }, (rep) => {
              // error
              this.$message.error('登录失败！')
            }).finally(() => {
            })
          })
        }
      },
      hasEmpty () {
        return !this.un_ || !this.pwd || !this.code_
      },
      getGreetingMsg () {
        this.regard = false
        if (!this.un_) return false
        this.$http.get(api.getGreetingMsg, {
          userName: this.un_
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.regard = data.greetingMsg || ''
            if (!this.regard) {
              this.$message.warning('您未设置登录问候语！')
            }
            setTimeout(() => this.$el.querySelector('.ds-icon-pwd input').focus(), 0)
          } else {
            this.$message.error('常用语获取失败！')
          }
        }, (rep) => {
          this.$message.error('常用语获取失败！')
        })
      },
      tryLoginFromUrl (userId, sessionKey) {
        // userId=4&sessionKey=123456
        this.$http.get(api.tryLoginFromUrl, {userId: userId, sessionKey: sessionKey}).then(({data}) => {
          // success
          if (data.success === 1) {
            this.loginSuccess(data)
          } else {
            this._getVerifyImage()
            // loading.text = '自动登录失败'
          }
        }, (rep) => {
          this._getVerifyImage()
          // loading.text = '自动登录失败'
          // error
        }).finally(() => {
          // loading.close()
        })
      },
      tryLogin () {
        this.$http.get(api.validate, {isAuto: 1}).then(({data}) => {
          // success
          if (data.success === 1) {
            this.loginSuccess(data)
          } else {
            this._getVerifyImage()
            // loading.text = '自动登录失败'
          }
        }, (rep) => {
          this._getVerifyImage()
          // loading.text = '自动登录失败'
          // error
        }).finally(() => {
          // loading.close()
        })
      },
      overf (f) {
        if (f) {
          clearTimeout(this.overt)
          this.over = true
          this.$refs.con.focus()
        } else {
          this.overt = setTimeout(() => {
            this.over = false
          }, 300)
        }
      }
    }
  }
</script>
<style lang="stylus">
  @import '../../var.stylus'
  
  .login-form
    text-align center
    & > *
        display inline-block
        vertical-align middle
        // margin 0 .1rem
    .ds-icon-notice
      padding .08rem PW
      padding-left PW + .08rem + .16rem
      line-height .2rem
      color GOLD
      text-align left
      border 1px solid GOLD
      radius()
      & + .ds-icon-notice
        margin-top .05rem
      &.h0 + .ds-icon-user
        margin-top .38rem
      &.h0
        height 0
        padding 0
        border none
        overflow hidden
    dl
      position relative
      .contact
        position absolute
        top 0
        right -.55rem
        width .6rem
        height .6rem
        cursor pointer
        background-color rgba(255, 255, 255, .2)
        background-image url(../../assets/righter/04.png)
        background-repeat no-repeat
        background-position .11rem center
        &:hover
          opacity .8
    dd
      line-height BMH - .1rem
      height BMH - .1rem
      padding 0 PW
      padding-left PW + .1rem + .24rem
      border-bottom 1px solid rgba(255, 255, 255, .2)
      &:hover
        border-bottom 1px solid rgba(255, 255, 255, .5)
      &.ds-icon-edit
        position relative
        input
          padding-right CW + PW
        .ds-icon-code
          
          position absolute
          bottom .05rem
          right PW
          display inline-block
          width CW
          height CH
          cursor pointer
      &.login
        height .36rem
        line-height .36rem
        padding-left 0
        padding-right 0
        margin-top PW
      input
        height 100%
        line-height 50px
        border 0
        background transparent
        color WHITE
        font-size .14rem
        letter-spacing .02rem
        width 100%
        box-sizing border-box
      &.disabled
        opacity .5
        cursor not-allowed
        input
          cursor not-allowed
      &.actions
        border 0
        padding PW*.52 0
      
  .try
    float left
  .forget
    float right
    .con
      text-align left
      display none
      z-index 1
    @media screen and (max-height: 800px)
      .con
        padding .15rem !important
        img
          width 4rem
    
    &:hover
    &.over
      .con
        display block
  .ds-icon-user
  .ds-icon-pwd
  .ds-icon-edit
    background-position PW .18rem
</style>

<style lang="stylus">
  @import '../../var.stylus'
  #app.cb.v2
    .login-form
      margin-top .5rem
      max-width 12rem
      min-width 9rem
      dt
        text-shadow none
        color GREEN
        border none
      .dd
        color #666
        background #eee
        radius()
      dd.actions>*
        color #666
    .try-form
    .login-form
      dl
        padding 0 .1rem
        background #eee
        radius()
      .dd
        background #eee
        height .3rem
        line-height .3rem
        text-shadow none
        margin .2rem PW .1rem PW
      dd.ds-button
        margin 0 PW
        width auto
        display block
      
        
      dd:not(.ds-button):not(.actions)
        color #666
        background #fff
        radius()
        margin .1rem PW
        input
          color #666
</style>
