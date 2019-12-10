<template lang="jade">

.login-form.d
  p.dc.ds-icon-notice(:class=" { o_none: regard === false } ") 问候语： 
    span.text-blue {{ regard || '空' }}
  dl
    dd.aa
      input( v-model="l.un" autofocus placeholder="用户名" @change="getGreetingMsg")

    dd.ab
        input(v-model="l.pwd" type="password" placeholder="密码" autocomplete="new-password" maxLength="20")

    dd.ae
      input.aea( v-model="code_" @keyup.enter="login" placeholder="验证码")
      i.aeb(v-bind:style="{backgroundImage: 'url(' + img_ + ')'}" @click="_getVerifyImage")

    dd.ds-button._36rem.full.bold.primary(@click="login") 登录

    p(style="margin-top: 0")
      //- span.de(@click=" __setCall({fn: '__popLogin', args: false}) || $router.push('/login/forget') ") 忘记密码？
      //- span.db.f_r(@click=" __setCall({fn: '__popLogin', args: false}) || $router.push('/login/try') ") 试玩登录


</template>

<script>
import xhr from './xhr'
import api from '../http/api'
// import Validate from '../util/Validate'
import store from '../store'
import md5 from 'md5'
export default {
  mixins: [xhr],
  components: {
  },
  name: 'login-form',
  props: [],
  data () {
    return {
      ME: store.state.user,
      l: {
        un: '',
        pwd: ''
      },
      regard: false
    }
  },
  mounted () {
    setTimeout(this._getVerifyImage, 1000)
  },
  methods: {
    // 登录
    login () {
      if (!this.l.un || !this.l.pwd || !this.code_) {
        this.$message.warning('输入值不能为空')
      } else {
        this._checkVerifyCode(() => {
          this.$http.post(api.validate, {userName: this.l.un, userPwd: md5(this.l.pwd), verifyCode: this.code_, channelType: 'web', timeout: 5000}).then(({data}) => {
            // success
            if (data.success === 1) {
              this.__setCall({fn: '__loginSuccess', args: data, callId: undefined})
              this.__setCall({fn: '__popLogin', args: false})
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
    }
  }
}
</script>

<style lang="stylus">
@import '../var.stylus'
// 建议不添加scoped， 所有样式最多嵌套2层
.login-form
  // background-color #e9e9e9

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
