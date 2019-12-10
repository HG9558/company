<template lang="jade">
  .login-register(:class="{tsfl: isGet }")
    div.form-item
      label.item.ds-input &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;帐号:
        input(v-model="account" placeholder="请输入帐号")
    //- div.form-item
      label.item.ds-input 昵称:
        input(v-model="name" placeholder="请输入昵称")

    div.form-item
      label.item.ds-input &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码:
        input(v-model="pwd"  type="password" placeholder="请输入密码" maxLength="20")

    div.form-item
      label.item.ds-input 确认密码:
        input(v-model="pwda"  type="password" placeholder="请再次输入密码" maxLength="20")

    div.form-item
      label.item.ds-input &nbsp;&nbsp;&nbsp;&nbsp;推广码:
        input(v-model="code" placeholder="请输入推广码")

    div.form-item
      label.item.ds-input&nbsp;&nbsp;&nbsp;&nbsp;验证码:
        input(style="width: 1rem" v-model="code_" @keyup.enter="autoRegist" placeholder="请输入验证码")
        i.ds-icon-code(v-bind:style="{background: 'url(' + img_ + ') right center no-repeat'}" @click="_getVerifyImage")

    div.form-item
      .ds-button.bold.tall.high-positive._3rem.oval(@click="autoRegist") 立即注册
      br
      router-link.ds-button.text-button(:to=" '/login' " style="margin-top: .1rem" @click.native.stop="") 我要登录
      a.ds-button.text-button.light(target="_blank" href="http://www.ds998.net" style="margin-top: .1rem" @click.native.stop="" v-if=" platform === 'ds' ") 浏览官网




    
</template>

<script>
  // import '../../main.all.out.min.js'
  import api from '../../http/api'
  // import browser from '../../util/browser'
  import xhr from 'components/xhr'
  import Validate from '../../util/Validate'
  export default {
    mixins: [xhr],
    components: {
      // SignalBar
    },
    data () {
      return {
        account: '',
        name: '',
        pwd: '',
        pwda: '',
        tag: '',
        code: '',
        isGet: false
      }
    },
    computed: {
    },
    watch: {
      account () {
        this.account = this.account.trim()
      },
      name () {
        this.name = this.name.trim()
      }
    },
    mounted () {
      this._getVerifyImage()
      this.tag = this.$route.query.tag
      // if (browser.mobile) {
      //   window.onbeforeunload = null
      //   setTimeout(() => {
      //     window.location.href = 'login_regist.html?tag=' + this.tag
      //   }, 0)
      // }
      if (this.tag) {
        setTimeout(this.getStrangerInfo, 1000)
        this.getCodeByTag()
      }
    },
    beforeDestroy () {
      window.accessAngular.close()
    },
    methods: {
      getCodeByTag () {
        this.$http.get(api.getCodeByTag, {
          tag: this.tag
        }).then(({data}) => {
          if (data.success === 1) {
            this.code = data.code
          }
        })
      },
      getStrangerInfo () {
        this.$http.post(api.getStrangerInfo, {
          tag: this.tag
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.isGet = true
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
      },
      // http://192.168.169.44:9901/cagamesclient/team/createAccount.do?method=autoRegist&tag=7F593EF2F9B3537291FF912CAA7C49A5&userName=test123&nickName=test123&verifyCode=4953
      autoRegist () {
        if (!this.account) return this.$message.warning({target: this.$el, message: '请输入用户名'})
        if (!Validate.account(this.account)) return this.$message.warning({target: this.$el, message: '用户名格式不正确，请输入0-9，a-z，A-Z组成的6-16个字符!'})
        // if (!this.name) return this.$message.warning({target: this.$el, message: '请输入昵称！'})
        // if (!Validate.nickName(this.name)) return this.$message.error({target: this.$el, message: '昵称由2至8个字符组成，可中文，数字不能超过4个，不能含有QQ字样！'})
        if (!this.pwd) return this.$message.warning({target: this.$el, message: '请输入密码'})
        if (this.pwd !== this.pwda) return this.$message.warning({target: this.$el, message: '两次密码输入不一致'})
        if (!this.tag && !this.code) return this.$message.warning({target: this.$el, message: '请输入推广码'})
        if (!this.code_) return this.$message.error({target: this.$el, message: '请输入验证码'})
        this.$http.post(api.autoRegist, {
          tag: this.tag,
          userName: this.account,
          nickName: this.name,
          verifyCode: this.code_,
          passwd: this.pwd,
          promotionCode: this.code
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.$modal.success({
              // target: this.$el,
              content: '恭喜你注册成功',
              btn: ['马上登录'],
              ok () {
                this.__setCall({
                  fn: '__logout',
                  args: {
                    stay: true
                  }
                })
                setTimeout(() => {
                  this.$router.push({
                    path: '/login/login',
                    query: {
                      un_: this.account,
                      pwd: this.pwd
                    }
                  })
                }, 200)
              },
              O: this
            })
          } else {
            this.$message.warning(data.msg || '注册失败!')
            this._getVerifyImage()
          }
        }, (rep) => {
          // error
          this.$message.warning('注册失败!')
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  W = 2.7rem
  H = 1.8rem
  .login-register
    @media screen and (max-width: 1440px) and (max-height: 1366px)
      &.tsfl
        transform translateX(-2rem)
    @media screen and (max-width: 800px) and (max-height: 1366px)
      &.tsfl
        transform translateY(-2rem)

    background url(../../assets/banner.png) 48.2% .53rem no-repeat
    padding-top 4rem
    position relative
    top -1.5rem
    text-align center
    text-shadow none

  .form-item
    margin PW 0
  .item
    position relative
    width 3rem
    height .5rem
    padding 0 .25rem
    line-height .5rem
    radius(.25rem)
    color #bbb
    text-align left
    input
      height .3rem
      line-height .3rem
      border none
      padding-left .1rem
      width 1.2rem
      
  .ds-icon-code
    position: absolute;
    bottom: 0.1rem;
    right: 0.15rem;
    display: inline-block;
    width: 0.83rem;
    height: 0.29rem;
    cursor: pointer; 

    
</style>