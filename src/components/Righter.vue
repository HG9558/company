<template lang="jade">
  .righter
    .ds-icon-skins
      .expand-left.skins.text-black  &nbsp;&nbsp;可选皮肤
        br
        .skin(v-for=" (s, i) in skins" v-bind:style="{ background: 'url(' + s + ')' + ' center no-repeat' }" v-bind:class="{ checked: Me.skin === i }" @click=" store.actions.setUser({ skin: i }) ")

    .ds-icon-classic(:class=" { off: Me.mode === 'classic' } " @click=" store.actions.setUser({ mode: Me.mode === 'fashion' ? 'classic' : 'fashion' }) ")
      .expand-left {{ Me.mode !== 'fashion' ? '时尚模式' : '经典模式' }}
    //- .ds-icon-day(:class=" { off: Me.model === 'day' } " @click=" store.actions.setUser({ model: Me.model === 'day' ? 'night' : 'day' }) ")
      .expand-left  {{ Me.model !== 'day' ? ' 日间模式 ': '夜间模式' }}

    .ds-icon-helpcenter(@click="$router.push('/help/6-1-1')")
      .expand-left  帮助中心
    .ds-icon-downloadcenter(@click="$router.push('/help/7-1-1')")
      .expand-left  下载中心
    .ds-icon-(v-show="Me.login" @click="goChat")
      span.badge(v-show="unread") {{ unread > 99 ? '99+' : unread }}
      .expand-left 联系上级
    .jnewWin.ds-icon-contact-(:class=" { isvip: Me.vipChatUrl } " @click=" window.open(Me.chatUrlSlave || Me.vipChatUrl || Me.chatUrl || 'https://chat68.providenow.net/chat/chatClient/chatbox.jsp?companyID=80002207&configID=1262', 'newwindow', 'width=920,height=700,left=400,top=200') ")
      .expand-left  {{  Me.vipChatUrl ? 'VIP客服' : '联系客服' }}
    .ds-icon-ggl(:class=" { gray: amount === 0 } " @click=" amount&&__setCall({fn: '__setGGL'})" v-on:mouseover=" __getUserScratch " v-if="Me.login")
      span.badge {{ amount }}
      .expand-left 刮刮乐
    .ds-icon-guanji(@click="$router.push('/help/7-1-1')")
    RightQuickThirdGame(v-on:click="clickHandler")

    //- .absolute.a.pointer(@click=" __setCall({fn: '__showTask'}) " v-if=" Me.showIngots ")
      el-button.close.absolute(icon="close" size="small" @click.native.stop=" store.actions.setUser({ showIngots: false }) ")
      span.absolute.text-blue(style="bottom: .11rem; left: .43rem") {{ timeFormat(time).slice(0, 5) }}后消失






</template>

<script>
  import store from '../store'
  import api from '../http/api'
  import { timeFormat } from '../util/Date'
  import RightQuickThirdGame from './RightQuickThirdGame'
  export default {
    data () {
      return {
        time: 0,
        window: window,
        timeFormat: timeFormat,
        Me: store.state.user,
        store: store,
        amount: 0,
        unread: '',
        skins: ['/static/skins/big_bg.jpg', '/static/skins/bg_02.jpg', '/static/skins/bg_05.jpg', '/static/skins/bg_06.jpg']
        // skins: ['/static/skins/bg.jpg', '/static/skins/bg_01.jpg', '/static/skins/bg_02.jpg', '/static/skins/bg_03.jpg', '/static/skins/bg_04.jpg', '/static/skins/bg_05.jpg', '/static/skins/bg_06.jpg', '/static/skins/bg_07.jpg', '/static/skins/bg_08.jpg']
      }
    },
    components: {
      RightQuickThirdGame
    },
    watch: {
      Me: {
        deep: true,
        handler (user) {
          // document.body.style.background = 'url(' + this.skins[this.Me.skin] + ')'
          document.body.style.backgroundImage = 'url(' + this.skins[this.Me.skin] + ')'
          document.body.className = this.Me.css
          if (user && user.login) {
            if (!this.timer) {
              this.getMessageCount(user.token)
              this.timer = setInterval(() => {
                this.getMessageCount(user.token)
              }, 10000)
            }
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.unread = ''
          }
        }
      },
      'Me.taskTime' (n, o) {
        this.time = parseInt(this.Me.taskTime / 1000)
        if (!o) this.countDown()
      },
      // 'Me.css' () {
      //   document.body.className = this.Me.css
      // },
      'Me.login' () {
        this.__getUserScratch()
      }
    },
    destroyed() {
      clearInterval(this.timer)
    },
    mounted () {
      this.__getUserScratch()
    },
    methods: {
      getMessageCount(token) {
        this.$http.get(api.getChatUnread, {token: token})
        .then(res => {
          if (res.status === 200 && res.data.success === 1) {
            this.unread = res.data.unReadNumber
          }
        })
      },
      goChat() {
        let host = window.location.href
        let url = ''
        if (host.indexOf('cb510') !== -1) {
          url = 'http://192.168.169.84/#/?platCode='
        } else if (host.indexOf('.net') !== -1) {
          url = 'https://iweb.xy-test.net/#/?platCode='
        } else {
          url = 'http://192.168.169.84/#/?platCode='
        }
        if (host.indexOf('www.game.com') !== -1) {
          url = 'http://localhost:3000/#/?platCode='
        }
        url += this.Me.platId + '&platUserId=' + this.Me.userId + '&token=' + this.Me.token
        // let url = 'http://localhost:3000/#/?platCode=' + this.Me.platId + '&platUserId=' + this.Me.userId + '&token=' + this.Me.token
        window.open(url, 'chatwindow', 'width=800,height=520,resizable=no')
      },
      countDown () {
        if (this.time > 0) {
          setTimeout(() => {
            this.time -= 60
            if (this.time < 0) {
              this.time = 0
              store.actions.setUser({ showIngots: false })
            }
            this.countDown()
          }, 1000 * 60)
        }
      },
      __getUserScratch () {
        if (!this.Me.login) return
        this.$http.get(api.getUserScratch).then(({data}) => {
          // success
          if (data.success === 1) {
            this.amount = data.remainingNumber
          }
        })
      },
      clickHandler (type, data) {
        this.$emit('click', type, data)
      }
    }
  }
</script>


<style lang="stylus">
  @import '../var.stylus'
  body.cb

    footer
      .switch-box
        display none !important
      .ds-icon-full-screen
        margin-left .2rem
    #app ~ [data-ng-app] .custom-service-box
      .message-cut
        top -1rem
        right 1rem
      .badge
        left 8px

      left auto !important
      right 10px !important
      // top calc(50% + 0.35rem) !important
      top 43% !important
      z-index 1000
      border-radius 0 !important
      padding 0
      height RW !important
      width RW !important
      // &:hover
      //   background-color rgba(49,41,84, .95)
      //   &:after
      //     width 1.07rem
      &:after
        position absolute
        display none
        left auto !important
        top 0 !important
        right 100% !important
        height RW !important
        line-height RW !important
        width 0
        text-align center
        content '联系上级' !important
        color #fff !important
        background-color rgba(49,41,84, .95)
        transition all ease .3s
        font-size .14rem

        overflow hidden

      .icon.custom-service
        width RW
        height RW
        margin 0
        background-image url(../assets/righter/05.png) !important
        background-position center
        cursor pointer !important
        &:hover
          background-color rgba(49,41,84, .95)
          background url(../assets/righter/05.png) center no-repeat rgba(49,41,84, .95)
          &:after
            width 1.11rem
        &:after
          position absolute
          display inline-block
          left auto !important
          top  0 !important
          right RW !important
          height RW
          line-height RW
          width 0
          text-align center
          content '联系上级' !important
          color #fff !important
          background-color rgba(49,41,84, .95)
          transition all ease .3s
          font-size .14rem
          overflow hidden
  .ds-icon-
    width RW
    height RW
    margin 0
    background-image url(../assets/righter/05.png) !important
    background-position center
    cursor pointer !important
    background-repeat no-repeat



</style>
<style lang="stylus" scoped>
  @import '../var.stylus'
  .righter
    .a
      right 1.5rem
      bottom -1rem
      width 1.41rem
      height 1.51rem
      background-image url(../assets/righter/float_1.png)
      background-repeat no-repeat
      background-size 100%
      .close
        background-color rgba(255, 255, 255, .1)
        border 0
        color #fff
        font-size .1rem
        padding .1rem
        right -.3rem
        &:hover
          background-color rgba(255, 255, 255, .5)
          color DANGER


</style>
<style lang="stylus" scoped>
  @import '../var.stylus'
  .righter
    position fixed
    top 50%
    right 10px
    width RW
    transform translateY(-75%)
    background-color rgba(0,0,0,.2)
    color #fff
    // padding PWX
    radius()
    z-index 99
    & > [class*=ds-icon]
      height RW
      cursor pointer
      &:hover
        background-color rgba(49,41,84, .95)
        .expand-left
          width 1.5 * RW
          &.skins
            transform translateX(0)
            width 3.45rem


    .ds-icon-downloadcenter
      background url(../assets/v2/download.png) center no-repeat
    .ds-icon-helpcenter
      background url(../assets/v2/helpcenter.png) center no-repeat
    .ds-icon-contact-
      background url(../assets/righter/04.png) center no-repeat
    .isvip
      background url(../assets/righter/vipChat.png) center no-repeat

    .ds-icon-ggl
    .ds-icon-
      position relative
      .badge
        background-color red
        border-radius .05rem
        padding 0 .02rem
        float right
        display inline-block
        min-width .2rem
        height .2rem
        line-height .2rem
        text-align center
        position absolute
        right .05rem
        top .1rem
      &.ds-icon-ggl
        background url(../assets/righter/06.png) center no-repeat

    .ds-icon-guanji
      background url(../assets/righter/gj.png) center no-repeat
    .right-quick-third-game
      padding 0.1rem 0
    .gray
      -webkit-filter grayscale(50%)
      filter grayscale(50%)
      opacity .4
    .expand-left
      &.skins
        width 3.45rem
        height auto
        padding .2rem
        text-align left
        line-height .3rem
        transform translateX(130%)


      width 0
      position absolute
      right RW
      height RW
      line-height RW
      text-align center
      color #fff
      background-color rgba(49,41,84, .95)
      // background-color #e9e9e9
      z-index -1
      transition all ease .3s
      overflow hidden

      .skin
        position relative
        width 1rem
        height .9* RW
        radius()
        background-size cover !important
        display inline-block
        margin .075rem
        float left
        cursor pointer
        &.checked
          &:after
            content ''
            position absolute
            left 0
            right 0
            width 100%
            height 100%
            background url(../assets/righter/gou01.png) center no-repeat

        &:not(.checked):hover
          &:after
            content ''
            position absolute
            left 0
            right 0
            width 100%
            height 100%
            background url(../assets/righter/gou02.png) center no-repeat

</style>
