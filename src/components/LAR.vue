<template lang="jade">

.login-and-register
  .content-width
    el-row
      el-col.a(:span="7")
        p.text-blue.ft18 新用户注册
        dl
          dd.aa
            input( v-model="r.un" autofocus placeholder="用户名")

          dd.ab
            input(v-model="r.pwd" type="password" placeholder="密码" autocomplete="new-password" maxLength="20" v-on:keyup="pwdKeyUp")
          dd.pwd-status-check-row(v-show="r.pwd.length > 0")
            PwdStatusCheckBar(v-bind:state="pwdState")
          dd.ac
              input(v-model="r.pwda" type="password" placeholder="确认密码" maxLength="20" v-on:keyup="aPwdKeyUp")
          dd.pwd-status-check-row(v-show="r.pwda.length > 0")
            PwdStatusCheckBar(v-bind:state="aPwdState")
          dd.ad
              input(v-model="r.code" placeholder="推广码")
  
          dd.ae
            input.aea( v-model="code_" @keyup.enter="autoRegist" placeholder="验证码")
            i.aeb(v-bind:style="{backgroundImage: 'url(' + img_ + ')'}" @click="_getVerifyImage")

          dd.ds-button._36rem.primary.full.bold.login(@click="autoRegist") 注册
        
      el-col.b.text-center(:span="5")
        p.ba.ft18 24小时客服
        .bb.primary.ds-button._36rem.bold.jnewWin(@click=" window.open(Me.chatUrlSlave || Me.vipChatUrl || Me.chatUrl || 'https://chat68.providenow.net/chat/chatClient/chatbox.jsp?companyID=80002207&configID=1262', 'newwindow', 'width=920,height=700,left=400,top=200') ") 立即联系

      el-col.c.text-center(:span="5")
        p.ba.ft18 我的上级
        .bb.ds-button._36rem.bold.black-button(@click=" __setCall({fn: '__popLogin', args: true})  ") 马上联系

      el-col.d(:span="7")
        p 
          span.da.ft18 登录
          //- span.db.f_r(@click=" __setCall({fn: '__popLogin', args: false}) || $router.push('/login/try') ") 试玩登录
        p.dc.ds-icon-notice(:class=" { o_none: regard === false } ") 问候语： 
          span.text-blue {{ regard || '空' }}
        dl
          dd.aa
            input( v-model="l.un" autofocus placeholder="用户名" @change="getGreetingMsg")

          dd.ab
              input(v-model="l.pwd" type="password" placeholder="密码" autocomplete="new-password")

          dd.ae
            input.aea( v-model="code_" @keyup.enter="login" placeholder="验证码")
            i.aeb(v-bind:style="{backgroundImage: 'url(' + img_ + ')'}" @click="_getVerifyImage")

          dd.ds-button._36rem.full.bold.black-button(@click="login") 登录

          p(style="margin-top: 0")
            //- span.de(@click=" __setCall({fn: '__popLogin', args: false})|| $router.push('/login/forget') ") 忘记密码？
            //- span.f_r.df 无法登录

</template>

<script>
import xhr from './xhr'
import api from '../http/api'
import Validate from '../util/Validate'
import store from '../store'
import PwdStatusCheckBar from './PwdStatusCheckBar'
export default {
  mixins: [xhr],
  components: {
    PwdStatusCheckBar
  },
  name: 'login-and-register',
  props: [],
  data () {
    return {
      ME: store.state.user,
      Me: store.state.user,
      code_: '',
      tag: '',
      r: {
        un: '',
        pwd: '',
        pwda: '',
        code: ''
      },
      l: {
        un: '',
        pwd: ''
      },
      regard: false,
      pwdState: -1,
      aPwdState: -1
    }
  },
  created () {
    this._getVerifyImage()
    this.tag = this.$route.query.tag
    if (this.tag) {
      this.getCodeByTag()
      // this.getStrangerInfo()
      this.__setCall({fn: '__LAR'})
    }
  },
  methods: {
    __LARCODE () {
      this._getVerifyImage()
    },
    pwdKeyUp () {
      this.pwdState = Validate.getPwdSafeLevel(this.r.pwd) - 1
    },
    aPwdKeyUp () {
      this.aPwdState = Validate.getPwdSafeLevel(this.r.pwda) - 1
    },
    // 登录
    login () {
      if (!this.l.un || !this.l.pwd || !this.code_) {
        this.$message.warning('输入值不能为空')
      } else {
        this._checkVerifyCode(() => {
          this.$http.post(api.validate, {userName: this.l.un, userPwd: this.l.pwd, verifyCode: this.code_, channelType: 'web', timeout: 5000}).then(({data}) => {
            // success
            if (data.success === 1) {
              this.__setCall({fn: '__loginSuccess', args: data, callId: undefined})
            } else {
              this.$message.error(data.msg || '用户名或密码错误！')
              this.code_ = ''
              this.l.pwd = ''
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
    getGreetingMsg () {
      this.regard = false
      if (!this.l.un) return false
      this.$http.get(api.getGreetingMsg, {
        userName: this.l.un
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          this.regard = data.greetingMsg || ''
          if (!this.regard) {
            this.$message.warning('您未设置登录问候语！')
          }
          setTimeout(() => this.$el.querySelector('.d .ab input').focus(), 0)
        } else {
          this.$message.error('常用语获取失败！')
        }
      }, (rep) => {
        this.$message.error('常用语获取失败！')
      })
    },
    // 注册
    getCodeByTag () {
      this.$http.get(api.getCodeByTag, {
        tag: this.tag
      }).then(({data}) => {
        if (data.success === 1) {
          this.r.code = data.code
        }
      })
    },
    autoRegist () {
      if (!this.r.un) return this.$message.warning({target: this.$el, message: '请输入用户名'})
      if (!Validate.account(this.r.un)) return this.$message.warning({target: this.$el, message: '用户名格式不正确，请输入0-9，a-z，A-Z组成的6-16个字符!'})
      if (!this.r.pwd) return this.$message.warning({target: this.$el, message: '请输入密码'})
      if (!Validate.pwd(this.r.pwd)) return this.$message.warning({target: this.$el, message: '您输入的密码不符合要求！1:由字母和数字组成6-20个字符;2:必须包含数字和字母，不允许连续三位相同！'})
      if (this.r.pwd !== this.r.pwda) return this.$message.warning({target: this.$el, message: '两次密码输入不一致'})
      if (!Validate.pwd(this.r.pwda)) return this.$message.warning({target: this.$el, message: '您输入的密码不符合要求！1:由字母和数字组成6-20个字符;2:必须包含数字和字母，不允许连续三位相同！'})
      if (this.pwdState < 1) return this.$message.warning({target: this.$el, message: '您输入的密码安全级别比较弱'})
      if (!this.tag && !this.r.code) return this.$message.warning({target: this.$el, message: '请输入推广码'})
      if (!this.code_) return this.$message.error({target: this.$el, message: '请输入验证码'})
      this.$http.post(api.autoRegist, {
        tag: this.r.tag,
        userName: this.r.un,
        verifyCode: this.code_,
        passwd: this.r.pwd,
        promotionCode: this.r.code
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          this.$modal.success({
            // target: this.$el,
            content: '恭喜您注册成功，您当前已经自动登录'
          })
        } else {
          // this.$message.warning(data.msg || '注册失败!')
          this._getVerifyImage()
        }
      }, (rep) => {
        // error
        this.$message.warning('注册失败!')
      })
    },
    getStrangerInfo () {
      this.$http.post(api.getStrangerInfo, {
        tag: this.tag
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          window.accessAngular.setUser({
            id: data.strangerId,
            key: data.token,
            pltCd: data.platId,
            socketUrl: data.platUrl,
            toId: data.userId
          })
          window.accessAngular.isStranger(true)
          window.accessAngular.connect(true)
        } else this.$message.warning(data.msg || '暂时无法与上级聊天， 请重新刷新!')
      }, (rep) => {
        // error
        this.$message.warning('暂时无法与上级聊天， 请重新刷新!')
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../var.stylus'
// 建议不添加scoped， 所有样式最多嵌套2层
.login-and-register
  background-color #e9e9e9
  .pwd-status-check-row
    background-color transparent
    // margin -0.1rem 0 0.05rem 0
  .content-width
    min-height 3.49rem
    
  .a, .b, .c, .d
    min-height 3rem
    padding .15rem
  .a
    background-image url(../assets/LAR/5.png)
    background-size 1.3rem .58rem
    background-repeat no-repeat
    background-position top right .1rem
  .b
    background-image url(../assets/LAR/7.png)
    background-size 1.78rem
    background-repeat no-repeat
    background-position top 1rem center
  
  .c
    background-image url(../assets/LAR/6.png)
    background-size 1.4rem
    background-repeat no-repeat
    background-position top 1rem center
    

  p
    margin .1rem 0
  
  dd
    position relative
    margin-bottom .1rem
    padding-left .5rem
    background-color #fff
    
    background-size .23rem
    background-repeat no-repeat
    background-position left .1rem center
    
    
  .aa
    background-image url(../assets/LAR/1.png)
  .ab, .ac
    background-image url(../assets/LAR/2.png)
  .ae
    background-image url(../assets/LAR/3.png)
  .ad
    background-image url(../assets/LAR/4.png)

  input
    width 100%
    height .4rem
    padding 0 .15rem 0 0
    color #666
    font-size .14rem
    letter-spacing .02rem
    border 0
    box-sizing border-box
  .a input
    height .36rem
  .a .aeb
    top .03rem
    

  .aea
    padding-right 1rem
  .aeb
    width .9rem
    height .3rem
    position absolute
    top .05rem
    right .1rem
    background-repeat no-repeat
    background-position left top
    background-size .9rem .3rem
    cursor pointer
    
  .ba
    color #302b2a
  
  .black-button
    background #302b2a
    &:hover
      opacity .8
  
  .dc
    line-height .3rem
    padding-left .2rem
    margin 0
    color gray
    background-position left center
  .db, .de, .df
    cursor pointer
    &:hover
      color BLUE
    
</style>
