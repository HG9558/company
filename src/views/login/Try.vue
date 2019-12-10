<template lang="jade">
  dl.try-form
    dt 试玩
    dd.ds-icon-edit(style="height: .4rem; line-height: .4rem; color: #666")
      input(placeholder="验证码" v-model="code_"  @keyup.enter="login" autofocus)
      i.ds-icon-code(v-bind:style="{background: 'url(' + img_ + ') right center no-repeat'}" @click="_getVerifyImage")

    dd.ds-button.positive.full.bold.login(@click="login") 登录

    dd.actions
      router-link.back.ds-button.text-button.light.small(:to="'/login/login'" @click.native.stop="") 
        | <返回首页
</template>

<script>
// import base from 'components/base'
// import { launchFullScreen } from '../../util/Dom'
import xhr from 'components/xhr'
import api from '../../http/api'
export default {
  name: 'Try',
  mixins: [xhr],
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
    this._getVerifyImage()
    setTimeout(() => {
      this.$el.querySelector('.ds-icon-edit input').focus()
    }, 0)
  },
  methods: {
    login () {
      if (this.code_.length !== 4) return this.$message.warning('请输入4位数验证码!')
      this.$http.post(api.tryLogin, {verifyCode: this.code_, channelType: 'web'}).then(({data}) => {
        // success
        if (data.success > 0) {
          this.$emit('update-user', {
            // login: true,
            // name: data.nickName,
            isTry: true
            // guide: data.isTry !== '1'
          })
          this.$router.push('/')
          this.__setCall({fn: '__loginSuccess', args: data, callId: undefined})
        } else {
          this.$message.error('试玩登陆失败!')
          this._getVerifyImage()
          this.code_ = ''
        }
      }, (rep) => {
        // error
        this.code_ = ''
        this.$message.error('试玩登陆失败!')
      })
      // launchFullScreen(document.body)
    }
  },
  components: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import '../../var.stylus'

  .try-form
    dt
      margin-bottom BMH
      color WHITE
      font-size .18rem
      text-align center
    dd
      height BMH
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
        line-height 100%
        border 0
        background transparent
        // color WHITE
        font-size .14rem
        letter-spacing .02rem
        width 100%
        box-sizing border-box
      &.actions
        border 0
        padding PW*.52 0
      
  .back
    float left
  
</style>



