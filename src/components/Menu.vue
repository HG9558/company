<template lang="jade">
  section.menu-root
    section.menu.content-width
      el-popover(:ref="menu.url" v-for=" (menu, index) in menus" placement="top-start"  trigger="hover" v-bind:popper-class="'footer-popover menu ' + menu.url + ' ' + (menu.groups && menu.groups[0] || menu.info ? true : false) " v-model="shows[index]" v-show="!menu.hide")


            .icon-button.after-title(slot="reference" v-show="!menu.href && !menu.removed && !menu.hideSub && !menu.temp" v-on:mouseover="mouseover(menu)" @click="openChat(menu.url)" v-bind:mytitle=" menu.title " v-bind:class="{hot: menu.hot}") {{ menu.title }}
              .el-icon--right.el-icon-arrow-down(style="font-size: 10px; color: rgba(255,255,255,.5)")


            router-link.icon-button.after-title(:to="menu.href"   slot="reference" v-if="menu.href && !menu.removed" @click.native.stop="" v-bind:mytitle=" menu.title || menu.mytitle") {{ menu.title }}


            slot
              .info(v-if=" menu.big && !menu.info[0]" v-bind:class=" [ menu.info.class ] ")
                h3 {{ menu.info.title }}
                h4 {{ menu.info.descrb }}
                .ds-button.primary(v-if=" !menu.outerhref " @click="open(menu.info)" title="第一次点击可能会被拦截，再点一次即可") 点击进入
                .ds-button.primary(v-if="menu.outerhref" @click=" window.open(menu.outerhref) " title="第一次点击可能会被拦截，再点一次即可") 点击进入

              .infos(v-if=" menu.big && menu.info[0]")
                .info(v-bind:class=" [ m.class ] " v-for=" m in menu.info ")
                  h3(v-if="m.title") {{ m.title }}
                  h4(v-if="m.descrb") {{ m.descrb }}
                  .ds-button.primary(@click="open(m)" title="第一次点击可能会被拦截，再点一次即可" v-if=" m.fn ") 点击进入


              dl.submenu(v-if=" !menu.hideIcon && group.footer !== false && group.items.filter(function(x){return !x.removed})[0]" v-for="group in menu.groups" v-bind:class="[menu.url, group.url, {notitile: !group.title, 'with-icon': group.withIcon}]" v-bind:style="{ width: group.width }")
                dt
                  span.title(v-if="group.title && group.items.filter(function(x){return !x.removed})[0]")  {{ group.title }}

                dd(v-for="item in group.items"  @click="open(item, index)" v-if="item.title && !item.removed && !item.hide")

                  .ds-button.card(style="position: relative; " v-bind:class="[item.class]") {{ item.atitle || item.title }}

                  // .game-title(style="position: absolute;  width: 100%; font-size: .14rem; color: #9897b2" v-if=" menu.url === 'game' ")
                    span.text-gold {{ item.pretitle }}
                    | {{ item.title }}

      .icon-button.after-title(slot="reference"  v-for=" (menu, index) in menus" v-show="!menu.href && !menu.removed && menu.hideSub"  @click="open(menu.groups[0].items[0])" v-bind:mytitle=" menu.title " v-bind:class="{hot: menu.hot}") {{ menu.title }}

</template>

<script>
// import store from '../store'
// import api from '../http/api'
export default {
  props: ['menus'],
  data () {
    return {
      // Me: store.state.user,
      shows: {}
    }
  },
  watch: {
  },
  mounted () {
    this.initShows()
  },
  methods: {
    initShows () {
      this.shows = this.menus.reduce((p, m, i) => {
        p[i] = false
        return p
      }, {})
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
    __openThirdPart (item) {
      this.open(item)
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
        if (item.ff) {
          return this.$router.push(item.ff)
        }
        if (item.fn) {
          return this.__setCall({fn: '__openWindowWithPost', args: item.fn})
          // return this.openWindowWithPost(this.formData[item.fn] || {})
        } else {
          setTimeout(() => {
            this.shows[index] = false
            this.openPage(item.id)
          }, 0)
        }
      }
    },
    openPage (url) {
      this.$emit('open-page', url)
    }
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'

body.cb.v2
  .footer-popover
    border-top 4px solid BLUE
    padding PW
    transform: translateY(-0.12rem);
    radius(0)
    &.menu
      max-width auto
      @media screen and (max-width: 1500px)
        max-width 14rem
      @media screen and (max-width: 1200px)
        max-width 11rem
      transform: translateY(-0.12rem) translateX(-1.25rem)
      .popper__arrow
        transform: translateX(1.25rem) translateY(-.05rem)
    .popper__arrow
      transform: translateY(-.05rem)
      border-bottom-color BLUE
      &:after
        border-bottom-color BLUE


    .submenu.me
    .submenu.help
      max-width 4.2rem

    .submenu.game
      min-height .6rem
    .submenu
    .submenu.game
      // margin .1rem 0
      margin-top .1rem
      margin-bottom .1rem
      &.SSC
        margin-top 0
        margin-bottom 0
      max-width 4.3rem
      margin-right 0
      width auto
      display block
      float none
      padding-left 1.2rem
      position relative
      dt
        position absolute
        left 0
        top .1rem
        padding  0
        font-size .14rem
        span:after
          display none
        .title
          background none
          color #333
          shadow(none)
          text-shadow none
          font-weight bold
      dd
        display inline-block
        float none
        background none
        height auto
        width 1.35rem
        // width 1.45rem
        height .34rem
        color #666
        margin: 0 0 0.05rem -0.02rem;
        font-size .14rem
        transform none
      .ds-button.card
      dd:not(.inner-submenu) .ds-button.card
        position relative
        radius(0)
        color #333
        background-color #fff
        margin 0 .03rem
        width 1.3rem
        // width 1.4rem
        height .34rem
        line-height .34rem
        padding 0
        &:hover
          background-color BLUE
          color #fff
          // shadow(3px 3px 5px #aaa)
        &.sign:after
          display inline-block
          content '热'
          position absolute
          right -.02rem
          top -.02rem
          left auto !important
          bottom auto !important
          color #fff
          width .2rem
          height .2rem
          line-height 1.5
          background DANGER
          radius(50%)
        &.sign.new:after
          content '新'
          background OBLUE
        &.sign.odd:after
        &.sign.even:after
        &.sign.old:after
          border-radius 0
          width .35rem
          height .2rem
          top 0
          right 0


        &.sign.odd:after
          content '奇数'
          background DANGER
        &.sign.even:after
          border-radius 0
          width .35rem
          height .2rem
          content '偶数'
          background OBLUE

        &.sign.old:after
          content '怀旧'

     .submenu
        padding-left 1rem
        &.me:first-child
            margin-top 0
    .submenu.game
      dd
        width 1.45rem
      dd:not(.inner-submenu) .ds-button.card
        width 1.4rem

      dt
        display none

      background url(../assets/v2/nav_icon_qt.png) 0 center no-repeat

      &.SSC
        background url(../assets/v2/nav_icon_ssc.png) 0 center no-repeat
        & + .SSC
          background none
      &.G115
        background url(../assets/v2/nav_icon_115.png) 0 center no-repeat

      &.K3
        background url(../assets/v2/nav_icon_ks.png) 0 center no-repeat

      &.PK10
        background url(../assets/v2/nav_icon_pk10.png) 0 center no-repeat


      &.VR
        background url(../assets/v2/nav_icon_vr.png) 0 center no-repeat

      &.KG
        min-height .36rem
        background url(../assets/v2/nav_icon_jn.png) 0 -2px no-repeat


  .footer-popover
    .infos .info
      display inline-block
      padding-top .54rem
      padding-bottom .5rem
      vertical-align middle
      &:not(:first-child)
        border-left 3px solid transparent
        // border-image url("https://mdn.mozillademos.org/files/4127/border.png") 30
        border-image url(../assets/v2/100.png) 30
      &[class*=ds-icon-logo]
        padding .9rem .6rem .2rem .6rem
        background-size 2rem
        background-position top center
        background-repeat no-repeat

      &.ds-icon-logo-ag
        background-image url(../assets/v2/logo_ag_big.png)
      &.ds-icon-logo-bg
        background-image url(../assets/v2/logo_bg_big.png)
      &.ds-icon-logo-gd
        background-image url(../assets/v2/logo_gd_big.png)
      &.ds-icon-logo-pt
        background-image url(../assets/v2/logo_pt_big.png)
      &.ds-icon-logo-saba
        background-image url(../assets/v2/logo_ibc_big.png)
      &.ds-icon-logo-spb
        background-image url(../assets/v2/logo_sb_big.png)
      &.ds-icon-logo-ky
        background-image url(../assets/v2/logo_ky_big.png)

      &.ds-icon-logo-ly
        background-image url(../assets/v2/logo_ly_big.png)
      &.ds-icon-logo-xy
        background-image url(../assets/newhome/logo_xy_big.png)
      &.ds-icon-logo-vg
        background-image url(../assets/newhome/logo_vg_big.png)
      &.ds-icon-logo-ds
        background-image url(../assets/newhome/logo_ds_big.png)

      &.ds-icon-logo-uwin
        background-image url(../assets/v2/logo_uw_big.png)
      &.ds-icon-logo-xa
        background-image url(../assets/v2/logo_xa_big.png)

      &.ds-icon-logo-pb
        background-image url(../assets/newhome/logo_pb_big.png)

      &.ds-icon-logo-lg
        background-image url(../assets/newhome/logo_lg_big.png)

      &.ds-icon-logo-sa
        background-image url(../assets/newhome/logo_sa_big.png)
      &.ds-icon-logo-og
        background-image url(../assets/newhome/logo_og.png)
      &.ds-icon-logo-happygaming
        background-image url(../assets/newhome/logo_happygaming_big.png)






    .info
      padding 2*PW
      padding-left 2rem
      text-align right
      line-height .45rem
      h4
        color #999
    [class*=ds-icon-game-bg]
      float left
    .ds-icon-game-bg1
      background url(../assets/v2/001.png) .2rem center no-repeat
    .ds-icon-game-bg2
      background url(../assets/v2/003.png) .2rem center no-repeat
    .ds-icon-game-bg3
      background url(../assets/v2/002.png) .2rem center no-repeat
    .ds-icon-game-bg4
      background url(../assets/v2/004.png) .2rem center no-repeat
    .ds-icon-game-bg5
      background url(../assets/v2/005.png) .2rem center no-repeat

    .ds-icon-game-egaming
      background url(../assets/v2/006.png) left center no-repeat

    .ds-icon-game-sports
      background url(../assets/v2/sports.png) .2rem center no-repeat
    .ds-icon-vipclub
      padding-left 3rem
      background url(../assets/v2/vipclub.png) left center no-repeat


</style>

<style lang="stylus">
  .new-header .menu .icon-button
    padding 0 .1rem !important
</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  @import '../path.stylus'
  .menu-root
    background #302b2a
  section.menu
    box-sizing border-box
    height FH
    // padding-left 3.8rem
    text-align right
    background url(../assets/v2/logo.png) left center  no-repeat
    .icon-button
      position relative
      display inline-block
      padding 0 .15rem

      height FH
      line-height FH
      color #fff
      vertical-align middle
      text-align center
      cursor pointer
      &.hot:after
        display inline-block
        content '热'
        position absolute
        right -.02rem
        top .15rem
        left auto !important
        bottom auto !important
        color #fff
        width .2rem
        height .2rem
        line-height 1.5
        background DANGER
        font-size .12rem
        radius(50%)

      &:hover
        background-color rgba(255, 255, 255, .15)

      .el-icon--right.el-icon-arrow-down
        transition transform ease-in-out .2s
        &:after
        &:before
          // opacity 0
        // background url(../assets/v2/icon000.png) left center  no-repeat

      &:hover .el-icon--right.el-icon-arrow-down
        transform rotateZ(180deg) translateX(1px) translateY(3px)


  #app.cb.v2 .new-header section
    display inline
    background none
    .content-width
      left 0
    .icon-button
      height .36rem
      line-height .36rem
      color #2e2a29
      &:hover
        background-color rgba(255,255,255,.5)
      .el-icon--right.el-icon-arrow-down
        color #666 !important





</style>
