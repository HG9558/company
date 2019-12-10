<template lang="jade">
  .chess-page(v-if="show" v-bind:class="{retract: isRetract}")
    .transfer-bar.pl20
      el-select(v-model="to" placeholder="请选择")
        el-option(v-for="(n, i) in accoutns" v-bind:label=" n.split(':')[0] " v-bind:value="i" )
      InputNumber(v-bind:defaultValue="amount" v-on:enter="transfer" v-on:change="amount = $event" placeholder="请输入整数金额") 
      span.yuan 元
      .ds-button.primary.large.ml15(@click="transfer") 确定
      span.float-r
        span.btn-refresh(@click="refresh")
        span.btn-retract(@click="retract")
    .chess-iframe-wp
      iframe(v-bind:src="url" ref="gameIframe")
</template>

<script>
import api from '../../http/api'
import InputNumber from 'components/InputNumber'
import store from '../../store'
export default {
  data () {
    return {
      me: store.state.user,
      url: '',
      amount: '',
      accoutns: ['主账户 转 开元账户:7', '开元账户 转 主账户'],
      to: 0,
      press: false
    }
  },
  components: {
    InputNumber
  },
  watch: {
    'me.login' () {
      if (!this.me.login) {
        this.logoutThirdGame()
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isRetract: {
      type: Boolean,
      default: false
    },
    gameId: String,
    platId: String
  },
  computed: {
    bgAPI () {
      return [api.withdrawFromBG, api.transferToBG][this.to === 0 ? 1 : 0]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getExternalInfo(this.gameId, this.platId)
    },
    getExternalInfo (gameId, platId) {
      this.$http.get(api.gameUrl, {gameid: gameId, platid: platId}).then(({data}) => {
        if (data.success) {
          if (data.userName && data.password) {
            this.url = '?un=' + data.userName + '&pwd=' + data.password
          }
          this.url = data.url
        }
      }).catch(rep => {
      })
    },
    retract () {
      this.$emit('retract', true)
    },
    transfer () {
      if (this.press) return
      if (!this.amount) return this.$message.warning({target: this.$el, message: '请输入金额！'})
      this.press = true
      setTimeout(() => {
        if (this.press) this.press = false
      }, 1000)
      this.$http.get(this.bgAPI, {amount: this.amount, platid: this.platId}).then(({data}) => {
        // this.reloadUrl()
        if (data.success === 1) {
          this.$message.success({message: data.msg || '转入成功'})
          this.$refs.gameIframe.reload()
        } else {
          // this.$message.warning({message: data.msg || '转入失败'})
        }
      }).catch(rep => {
      }).finally(() => {
      })
    },
    refresh () {
      this.init()
    },
    reloadUrl () {
      let t = `&__t=${Date.now()}`
      let f = this.url.indexOf('&__t=')
      this.url = f === -1 ? `${this.url}${t}` : (this.url.substring(0, this.url.indexOf('&__t=')) + t)
    },
    resetState () {
      this.$root.showMiniIframeGame = false
      this.$root.miniIframeGameRetract = true
    },
    logoutThirdGame () {
      setTimeout(() => {
        this.resetState()
      }, 3000)
      this.$http.get(api.thirdGameLogout, {platId: this.platId}).then(({data}) => {
        if (data.success === 1) {
          this.resetState()
          this.$message.success({message: data.msg || '退出成功'})
        }
      }).catch(rep => {
      }).finally(() => {
      })
    }
  }
}
</script>

<style lang="stylus">
.chess-page
  width 9.7rem
  height 5.3rem
  position fixed
  right 0.9rem
  bottom 0rem
  z-index 101
  .el-select
    width 1.9rem
  &.retract
    right 100rem
  .i-num-input
    width 1.38rem
    line-height 0.28rem
    margin-left 0.1rem
  .yuan
    color #aaaaaa
    padding-left 0.05rem
  btn() 
    display inline-block
    width 1rem
    height .54rem
    cursor pointer
  .float-r
    display inline-block
    float right
    height .54rem
  .btn-refresh
    btn()
    width 0.8rem
    background url('../../assets/outer/chess/icon_Rerefsh.png') no-repeat center
  .btn-refresh:hover
    background-color #1d364f
  .btn-retract
    btn()
    background url('../../assets/outer/chess/icon_Retract.png') no-repeat center
  .btn-retract:hover
    background-color #1d364f
  .transfer-bar
    line-height .54rem
    background-color #1d384f
  .chess-iframe-wp
    iframe
      width 100%
      height 100%
      height 4.7rem
      border none
      background-color #1d334f
      // background url('../../assets/outer/chess/game_bg.jpg') no-repeat center
</style>
