<template lang="jade">
  section.new-home(@scroll="scrollHander" @resize="onResize")
    Me(v-if=" me.login " v-bind:menus="menus" v-on:open-page="openTab" )
    Unloginbar(v-show=" !me.login ")

    MyMenu(:menus="menus.slice(0, 13).concat(menus[17]).concat(menus[18])" v-on:open-page="openTab")

    router-view.scroll-content.page(:pages="pages" v-bind:menus="menus" v-bind:prehref="prehref" v-bind:loop="loop" v-bind:maxPages="maxPages" v-bind:transition="transition" v-bind:free="free" v-bind:money="money" v-on:close-tab="closeTab" v-on:open-tab="openTab" style="z-index: 99")


    el-carousel.ad(:interval="4000" arrow="always")
      el-carousel-item(v-for="(item, i) in sources" v-bind:key=" i " v-bind:style="{ ba }")
        img(:src=" item.webBanner " style="width: 100%; min-width: 8rem; cursor: pointer;" @click=" openBanner() ")

    .box.our-game
      .content-width
        el-row.collects.top-games.relative
          .intro(@mouseenter="__recentlyCode")
            span.gt 信游彩票
            span.en-name LOTTERY
            .right.ft12
              span.name 重庆时时彩 &nbsp;&nbsp;
              span.number(v-for=" n in ns ") {{ n }}
              |  &nbsp;&nbsp;
              router-link.ds-button.a-more(:to=" '/game/1-1-1' ") 来一注
                .el-icon-arrow-right
            .line
            p.t_l 时时彩是中国福利彩票时时彩的简称，重庆时时彩是一种经中国国家财政部批准，由中国福利彩票发行管理中心在重庆市所辖区域内发行，由重庆市福利彩票发行中心承销的彩票。


          el-col(:span="2" v-for=" (c, index) in topgames " v-if="c" v-bind:class="[c.title? c.class || c.menuClass :'empty ds-icon-add-item', 'top-game-type-icon']" @click.native=" openHomeTab(c) ")
            p {{ c.title }}

          .absolute.rank.t_l(@mouseover="leaderBoard")
            p.ft18 中奖排行榜
            transition(name="slide-left" appear=true)
              dl.absolute.ls-wp(v-show=" ri === 0 " key="0")
                dd(v-for=" (r, i) in rank.slice(0, 10) ")
                  span.rank-index {{ i + 1 }}
                  span.rank-un.inlb {{ r.username }}
                  span.rank-cnn.inlb {{ r.cnname }}
                  span.rank-money.inlb 喜中 ¥ {{ r.settlement.toFixed(0)._nwc() }}
            transition(name="slide" appear=true )
              dl.absolute.ls-wp(v-show=" ri === 1 " key="1")
                dd(v-for=" (r, i) in rank.length > 10 ? rank.slice(10, 20) : rank ")
                  span.rank-index {{ (rank.length > 10 ? 11 : 1) + i }}
                  span.rank-un.inlb {{ r.username }}
                  span.rank-cnn.inlb {{ r.cnname }}
                  span.rank-money.inlb 喜中 ¥ {{ r.settlement.toFixed(0)._nwc() }}

        .title
          p.t1.c_f 我们的游戏
          p.t2 OUR GAMES

        el-row(:gutter=15 style="padding-bottom: .2rem")

          el-col.picture.lhg(:span="12" )
            .co
              img(src="/static/pic/newhome/index_newbanner_01.jpg")
              el-row.absolute.e-game
                el-col.pt(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, ff: '/egame/2', fn: '5:203:iframe:/egame/2'}}) ")
                el-col.ag(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '4:500'}}) ")
                el-col.dy(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, ff: '/egame/1', fn: '2:203:iframe:/egame/1'}}) ")
                el-col.lg(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, ff: '/egame/3', fn: '21:201:iframe:/egame/3'}}) ")
                el-col.sa(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, ff: '/egame/3', fn: '32:37:iframe:/egame/3'}}) ")
            p
              span.t1 电子游戏 &nbsp;&nbsp;
              span.t2 ELECTRIC
          el-col.picture.bjl(:span="12" )
            .co
              img(src="/static/pic/newhome/index_newbanner_02.jpg")
              el-row.absolute
                el-col.pt(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '5:203:iframe:/egame'}}) ")
                el-col.ag(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '4:0'}}) ")
                el-col.dy(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '2:201'}}) ")
                el-col.sa(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '31:35'}}) ")
                el-col.og(:span="6" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '34:41'}}) ")
            p
              span.t1 真人娱乐 &nbsp;&nbsp;
              span.t2 CASINO

        el-row(:gutter=15 style="padding: .3rem 0")
          el-col.picture.sport(:span="12")
            .co
              img(src="/static/pic/newhome/index_newbanner_03.jpg")
              el-row.absolute.text-bold(style="line-height: .82rem; color: #f17d0b; opacity: 1 !important; ")
                //- el-col.t_c.ft18.sb(:span="24")
                el-col(:span="4")
                el-col.sb(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '3:301:iframe:/sports'}}) ")
                el-col.pb(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '19:403:iframe:/sports'}}) ")
                el-col(:span="4")

            p
              span.t1 体育竞技 &nbsp;&nbsp;
              span.t2 SPORTS

          el-col.picture.card(:span="12" )
            .co
              img(src="/static/pic/newhome/index_newbanner_04.jpg")
              el-row.absolute.text-bold(style="line-height: .82rem; color: #f17d0b; opacity: 1 !important; ")

                el-col.ky(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '7:202'}}) " )
                el-col.ly(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '15:202'}}) " )
                el-col.xy(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '22:0'}}) " )
                el-col.happygaming(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '44:69'}}) ")
            p
              span.t1 棋牌游戏 &nbsp;&nbsp;
              span.t2 CHESS

        el-row(:gutter=15 style="padding: .3rem 0")
          el-col.picture.sport(:span="12" )
            .co
              img(src="/static/pic/newhome/index_newbanner_05.jpg")
              el-row.absolute
                el-col.pt(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '5:203:iframe:/egame'}}) ")
                el-col.ag(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '4:6'}}) ")
                el-col.dy(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '2:202'}}) ")
                el-col.sa(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '32:36'}}) ")
            p
              span.t1 捕鱼达人 &nbsp;&nbsp;
              span.t2 FISHING

          el-col.picture.card(:span="12")
            .co
              img(src="/static/pic/newhome/index_newbanner_06.jpg")
              el-row.absolute.text-bold(style="line-height: .82rem; color: red; opacity: 1 !important; ")
                el-col(:span="8" )
                el-col.uwin(:span="8" @click.native=" __setCall({fn: '__openThirdPart', args: {id: 1, fn: '17:203'}}) ")
                el-col(:span="8" )
                //- el-col.t_c.ft18(:span="24") 敬请期待

            p
              span.t1 电子竞技 &nbsp;&nbsp;
              span.t2 EGAMING

        .title(style="margin-top: .2rem")
          p.t1 关于我们
          p.t2 ABOUT US
        el-row(:gutter=15 style="padding-bottom: .3rem")
          el-col.picture.b.lhg(:span="6" @click.native=" (showbigpic = true) &&  (bigpici = i) " v-for=" (img, i) in smpics " )
            .co
              img(:src=" img ")

        .showup(v-show=" showbigpic ")
          .showup-modal.fixed(style="top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,.7); z-index: 9999")
          .showup-wrap
            .content.relative
              .close.absolute(@click=" showbigpic = false ")
              .left.absolute(:class=" {active: bigpici > 0} "  @click=" bigpici > 0 && (bigpici--) ")
              .right.absolute(:class=" {active: bigpici < (bigpics.length - 1) } " @click=" bigpici < (bigpics.length - 1) && (bigpici++) ")
              img(:src=" bigpics[bigpici] ")













    CopyRight

    Chess(v-if="$root.showMiniIframeGame" v-bind:show="$root.showMiniIframeGame" v-bind:isRetract="$root.miniIframeGameRetract" v-bind:gameId="thirdGame.gameId" v-bind:platId="thirdGame.platId" @retract="$root.miniIframeGameRetract = $event")

    // a submit form
    form(id="TheForm" method="post" action="" target="TheWindow")
      input(type="hidden" name="data" value="")
      input(type="hidden" name="version" value="")
      input(type="hidden" name="id" value="")



</template>

<script>
import base from 'components/base'
// import Pages from './Pages'
import api from '../http/api'
import store from '../store'
import Guide from './Guide'
import Pages from './Pages'
import CopyRight from 'components/CopyRight'
import Me from 'components/Me'
import Unloginbar from 'components/Unloginbar'
import MyMenu from 'components/Menu'
import Chess from './outer/chess'
export default {
  name: 'Home',
  mixins: [base],
  props: ['menus', 'pages', 'prehref', 'loop', 'maxPages', 'transition', 'free', 'money'],
  data () {
    return {
      hasFooter: true,
      me: store.state.user,
      sources: [
      ],
      topgames: [
        {class: 'index_icon_01', id: '1-1-1', title: '重庆欢乐生肖'},
        {class: 'index_icon_02', id: '1-3-1', title: '广东11选5'},
        {class: 'index_icon_03', id: '1-4-1', title: '安徽快三'},
        {class: 'index_icon_04', id: '1-5-2', title: '福彩3D'},
        {class: 'index_icon_06', id: '1-5-1', title: '北京PK10'},
        {class: 'index_icon_07', id: '1-3-4', title: '11运夺金'},
        {class: 'index_icon_09', id: '1-5-3', title: '排列三、五'},
        {class: 'index_icon_10', id: '1-5-6', title: '六合彩'}
      ],
      formData: {
      },
      ns: [1, 2, 3, 4, 5],
      ifsrc: '',
      sports: false,
      rank: [
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'ab***01', settlement: 18215},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182},
        {username: 'xx***88', settlement: 52182}
      ],
      smpics: [
        '/static/pic/newhome/index_aboutus_01.jpg',
        '/static/pic/newhome/index_aboutus_02.jpg',
        '/static/pic/newhome/index_aboutus_03.jpg',
        '/static/pic/newhome/index_aboutus_04.jpg'
      ],
      bigpics: [
        '/static/pic/newhome/index_aboutus_big_01.jpg',
        '/static/pic/newhome/index_aboutus_big_02.jpg',
        '/static/pic/newhome/index_aboutus_big_03.jpg',
        '/static/pic/newhome/index_aboutus_big_04.jpg'
      ],
      bigpici: 0,
      showbigpic: false,
      ri: 0,
      t1: 0,
      t2: 0,
      thirdGame: {
        gameId: '202',
        platId: '7'
      }
    }
  },
  computed: {
  },
  watch: {
    '$route' ({path, query: {sports}}) {
      if (sports && path === '/') {
        this.sports = true
        this.ssports = true
      } else {
        this.sports = false
        this.ssports = false
      }
    }
  },
  mounted () {
    this.getActivityBanner()
    this.__recentlyCode()
    this.leaderBoard()
    this.onResize()
    this.t1 = setInterval(() => {
      if (this.ri === 0) this.ri = 1
      else this.ri = 0
    }, 10 * 1000)
    this.t2 = setInterval(this.leaderBoard, 5 * 60 * 1000)
  },
  beforeDestroy () {
    clearInterval(this.t1)
    this.t1 = 0
    clearInterval(this.t2)
    this.t2 = 0
  },
  methods: {
    getActivityBanner () {
      this.$http.get(api.getActivityBanner).then(({data}) => {
        if (data.success === 1) {
          this.sources = data.webBanner || 0
        } else {
        }
      }).catch(rep => {
      })
    },
    openBanner () {
      // TODO 每日签到
      this.$router.push('/activity/5-1-1')
    },
    scrollHander (evt) {
      this.lefter = (this.lefter || document.getElementsByClassName('lefter')[0])
      if (this.lefter && document.querySelector('#app.game')) {
        this.lefter.style.transition = 'transform linear 0s'
        this.lefter.style.transform = 'translateX(-7.2rem) translateY(-' + Math.min(115, this.$el.scrollTop) + 'px)'
      }
      this.onScroll()
    },
    // 获得当前已开奖信息
    __recentlyCode (noloop) {
      this.$http.mypost(api.recentlyCodeNew, {gameid: 1, pageNum: 1, size: 30}).then(({data}) => {
        // success
        if (data.success > 0 && data.items.length > 0) {
          let lst = data.items.find(x => { return x.code }) || {code: '0,0,0,0,0'}
          this.ns = lst.code.split(',')
        }
      }, (rep) => {
        // error
      })
    },
    openHomeTab (item) {
      if (item.fn) return this.__openWindowWithPost(item.fn)
      else this.openTab(item.id)
    },
    openTab (url) {
      this.$emit('open-tab', url)
    },
    closeTab (furl, url) {
      this.$emit('close-tab', furl, url)
    },
    // TODO 获取推荐游戏
    getUserPrefence () {
      this.$http.get(api.getUserPrefence).then(({data}) => {
        // success
        if (data.success === 1) {
        }
      }, (rep) => {
        // error
      })
    },
    openExternal (fn) {
      if (fn.split(':')[1]) return this.openBG(fn)
      // this.formData = {}
      this.$http.get(api.loginVr, {channelId: fn || 12}).then(({data}) => {
        //
        this.formData[fn] = data.vrurl
        this.__openWindowWithPost(fn)
      }).catch(rep => {
      })
    },
    openBG (fn) {
      if (fn.split(':')[2] === 'iframe') this.$router.push(fn.split(':')[3] || '/game/1-8-1')
      this.$http.get(api.gameUrl, {gameid: fn.split(':')[1] || 201, platid: fn.split(':')[0]}).then(({data}) => {
        //
        if (data.success) {
          // data.url && (data.url.iframe = true)
          if (data.userName && data.password) {
            data.url = '?un=' + data.userName + '&pwd=' + data.password
          }
          this.formData[fn] = data.url
          this.__openWindowWithPost(fn)
        }
      }).catch(rep => {
      })
    },
    openWindowWithPost ({data, version, id, vrurl, msg}) {
      if (!data) return this.$message.error({target: this.$el, message: msg || '第三方游戏获取失败！'}) && false
      let f = document.getElementById('TheForm')
      f.data.value = data
      f.version.value = version
      f.id.value = id
      f.action = vrurl
      window.open('', 'TheWindow')
      f.submit()
    },
    __openWindowWithPost (fn) {
      if (typeof this.formData[fn] === 'string') {
        if (fn.split(':')[2] === 'iframe') {
          this.ifsrc = this.formData[fn]
          this.formData[fn] = undefined
          this.__setCall({fn: '__setIframeSrc', args: this.ifsrc})
          this.__setCall({fn: '__setIframeSrcKey', args: fn})
          return false
        }
        window.open(this.formData[fn])
        this.formData[fn] = undefined
        return false
      }
      return this.formData[fn] ? this.openWindowWithPost(this.formData[fn] || {}) : this.openExternal(fn)
    },
    leaderBoard () {
      this.$http.get(api.leaderBoard).then(({data: {data, success}}) => {
        if (success === 1) {
          this.rank = data
        }
      })
    },
    onResize (evt) {
      let w = this.$el
      let e = this.$el
      let g = this.$el
      let x = w.innerWidth || e.clientWidth || g.clientWidth
      let y = w.innerHeight || e.clientHeight || g.clientHeight
      this.__setGlobal({
        width: x,
        height: y,
        scale: x / y
      })
    },
    onScroll (evt) {
      this.__setGlobal({
        st: this.$el.scrollTop || this.$el.scrollY,
        sl: this.$el.scrollLeft || this.$el.scrollX,
        sh: this.$el.scrollHeight,
        sw: this.$el.scrollWidth
      })
    }
  },
  components: {
    Guide,
    Pages,
    CopyRight,
    Me,
    MyMenu,
    Unloginbar,
    Chess
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  // @import '../path.stylus'
  // @import '../main.stylus'
  // @import '../classic.stylus'
  // @import '../night.stylus'
  // @import '../1280X800.stylus'
  // @import '../chat.stranger.1366.stylus'
  // @import '../classic.v2.stylus'
  .new-home .el-carousel__container
    height 180px
    @media screen and (min-width: 1200px)
        height 272px
    @media screen and (min-width: 1600px)
        height 372px
    @media screen and (min-width: 1920px)
        height 400px

    @media screen and (min-width: 2560px)
        height 533px





</style>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import '../var.stylus'
  .new-home .dialog-container
    top 0
    z-index 3
  .ad
  .box
    background url(../assets/newhome/index_bg.jpg) no-repeat
    background-repeat no-repeat
    background-size 100% 100%
    padding-top .3rem
    &.ad
      padding-top 0
      background-repeat repeat
      background-size 100% 100rem


  W = 1.4rem
  H = 1.4rem
  .top-games
    min-height 5rem
    position relative
    margin-bottom .3rem
    padding PW
    padding-left 26%
    padding-right 28%
    text-align center
    radius()
    color #302b2a
    // background url(../assets/v2/index_bg02.png) no-repeat
    background url(../assets/newhome/index_cp_bg-min.png) no-repeat
    background-size 12rem

    &:before
      content ''
      position absolute
      display inline-block
      top 0
      bottom 0
      left 0
      right 60%
      background url(../assets/newhome/girl-min.png) no-repeat
      // background-size 3.71rem
      background-size 3.18rem

    .intro
      font-shadow(none)
      text-align left
      padding PW
      // padding-bottom 0
      padding-right 0
      .line
          margin .15rem 0
          border-bottom 1px solid rgba(255, 255, 255, .3)
      .gt
          font-size .24rem
          line-height .3rem
          // color #ffff00
      .en-name
          // color #ccc
          font-size .18rem
          margin-left PW
      .number
          font-size .12rem
          line-height .2rem
          radius(50%)
          background-color #302b2a
          display inline-block
          width .18rem
          height .18rem
          text-align center
          color #ffa930
          margin-right .05rem
      .a-more
        border 1px solid #302b2a
        color #302b2a
        text-shadow none
        padding 0 .1rem
        &:hover
          opacity .8
      .right
          float right

    .el-col:not(.pool)
      position relative
      min-width W
      height H
      margin .1rem 0
      overflow hidden
      radius()
      background-position 50%
      cursor pointer
      padding-top H
      transition all ease-in-out .3s
      &.index_icon_01
        background url(../assets/newhome/index_icon_b_01.png) 50% no-repeat
      &.index_icon_02
        background url(../assets/newhome/index_icon_b_02.png) 50% no-repeat
      &.index_icon_03
        background url(../assets/newhome/index_icon_b_03.png) 50% no-repeat
      &.index_icon_04
        background url(../assets/newhome/index_icon_b_04.png) 50% no-repeat
      // &.index_icon_05
      //   background url(../assets/newhome/index_icon_b_05.png) 50% no-repeat
      &.index_icon_06
        background url(../assets/newhome/index_icon_b_06.png) 50% no-repeat
      &.index_icon_07
        background url(../assets/newhome/index_icon_b_07.png) 50% no-repeat
      // &.index_icon_08
      //   background url(../assets/newhome/index_icon_b_08.png) 50% no-repeat
      &.index_icon_09
        background url(../assets/newhome/index_icon_b_09.png) 50% no-repeat
      &.index_icon_10
        background url(../assets/newhome/index_icon_b_10.png) 50% no-repeat

      &:hover
        // padding-top H - 2*PW
        padding-top 0.95rem
        background-position 50% 20%
        background-color rgba(255, 255, 255, .2)
        box-shadow 0 .3rem 1rem rgba(0, 0, 0, .2)
        opacity 1
    .top-game-type-icon.el-col
      width 1.2rem
      min-width 1.2rem
      height 1.2rem
      padding-top 1.2rem
    .el-col.pool
      font-family Roboto
      color YELLOW
      padding-right .5rem
      font-size .36rem
      padding-top .55rem
      line-height 1
      text-align center
      display block
      clear both
      overflow hidden
      height .55rem
      background url(../assets/v2/jiangchi.png) 30% center no-repeat
      span
        font-size .14rem
        color #fff
    .rank
      right 0
      top 0
      // width 2rem
      width 3.2rem
      height 5rem
      border 2px
      color #fff
      line-height .2rem
      padding .35rem 0 .1rem 0
      overflow hidden



      dl
        padding-top .25rem
        &[class*=-enter]
        &[class*=-leave]
          transition all linear 1s
        dd
          margin-bottom .2rem

      .rank-un
        min-width .5rem
        margin-right .2rem
      .rank-cnn
        min-width 1rem
      .rank-index
        margin-right .1rem
        radius(50%)
        display inline-block
        width .2rem
        // background-color BLUE
        background-color #e1e1e1
        text-align center
        color #666666
      .ls-wp
        &>dd
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3)
            .rank-index
              background-color BLUE
              color #ffffff
  .picture
    position relative
    cursor pointer
    height 2.4rem
    .co
      width 100%
      height 100%
      overflow hidden
      position relative
    img
      position relative
      left 0
      top 0
      width 100%
      // opacity .8
      transition all ease-in-out .3s

    .absolute
      left 0
      right 0
      bottom -.82rem
      // height .82rem
      background-color rgba(233, 233, 233, .9)
      opacity 0
      transition all .3s ease-in-out
      .el-col
        height .82rem
        background-position center
        background-repeat no-repeat
        background-size 1.8rem
        transition inherit
        &:hover
          background-position center -.1rem

        &.pt
          background-image url(../assets/newhome/logo_pt_big.png)
        &.ag
          background-image url(../assets/newhome/logo_ag_big.png)
        &.dy
          background-image url(../assets/newhome/logo_bg_big.png)
        &.sa
          background-image url(../assets/newhome/logo_sa_big.png)
        &.happygaming
          background-image url(../assets/newhome/logo_happygaming_big.png)
        &.og
          background-image url('../assets/newhome/logo_og_big.png')
        &.sb
          background-image url(../assets/newhome/logo_ibc_big.png)
        &.ky
          background-image url(../assets/newhome/logo_ky_big.png)

        &.ly
          background-image url(../assets/newhome/logo_ly_big.png)
        &.xy
          background-image url(../assets/newhome/logo_xy_big.png)

        &.spb
          background-image url(../assets/newhome/logo_sb_big.png)
        &.uwin
          background-image url(../assets/newhome/logo_uw_big.png)
        &.pb
          background-image url(../assets/newhome/logo_pb_big.png)
        &.lg
          background-image url(../assets/newhome/logo_lg_big.png)

        &.el-col-6
          background-size 1.4rem



    &:hover
      .absolute
        opacity 1
        bottom 0

  .picture.wait:after
    content '敬请期待'
    display inline-block
    position absolute
    color #fff
    top 0
    right 8px
    width .8rem
    height .36rem
    line-height .36rem
    text-align center
    background-color rgba(0, 0, 0, .3)
  .picture.a
    height 1.9rem
  .picture.b
    height 1.5rem
    &:hover
      img
        opacity 1
        width 110%
        left -5%
        top -5%


  .title
    border-left 3px solid BLUE
    padding-left .1rem
    margin .1rem 0
    .t1
      color #fff
      font-size .2rem
      font-weight bold
    .t2
      color #ccc

  .picture
    margin-bottom .1rem
    .t1
      font-size .16rem
      color #fff
      font-weight bold
    .t2
      color #bbb
    .f_r
      float right
      color BLUE
      // margin-right .3rem
      padding 0 .2rem
      &:hover
        background-color BLUE
        color #fff
    p
      padding .05rem 0
      line-height .3rem

  .showup-wrap
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    text-align center
    z-index 9999
    &:after
      content ''
      height 100%
      width 1px
      vertical-align middle
      display inline-block
    .content
      display inline-block
      vertical-align middle
      img
        border 5px solid #4b4b4b
        @media screen and (max-height: 800px)
          width 1000px !important

      .close
        cursor pointer
        background-color #4b4b4b
        top -.6rem
        right -.6rem
        width .6rem
        height .6rem
        background-image url(../assets/newhome/index_pic_nav_colse.png)
        background-repeat no-repeat
        background-position center
        background-size .3rem
        &:hover
          background-image url(../assets/newhome/index_pic_nav_colse_ahover.png)

      .left, .right
        cursor not-allowed
        background-color #4b4b4b
        top 50%
        left -.65rem
        width .6rem
        height 1.44rem
        transform translateY(-50%)
        background-repeat no-repeat
        background-size .13rem
        background-position center
        background-image url(../assets/newhome/index_pic_nav_left.png)

        &.active
          cursor pointer
          background-image url(../assets/newhome/index_pic_nav_left_ahover.png)
          background-color BLUE
        &:hover
          opacity .8

        &.right
          left auto
          right -.65rem
          transform translateY(-50%) rotateY(180deg)





</style>

