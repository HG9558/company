<template lang="jade"> 
  .game-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .ds-icon-cooking.text-black
    // 暂时改为正在研发
    div(style="display:none")
      div(style="text-align: center")
        .ds-button-group
          .ds-button.text-button(:class="{ selected: type === 1 }" @click=" type = 1 ") 全部游戏
          .ds-button.text-button(:class="{ selected: type === 2 }" @click=" type = 2 ") 快速转帐
          .ds-button.text-button(:class="{ selected: type === 3 }" @click=" type = 3 ") 我的收藏
      .scroll-content.game-store(:class="{ collected: type === 3 }" v-if="type !== 2")
        // put top to fixed it
        .filter-fixed(v-if="type === 1")
          .search-bar
            input.ds-input(v-model="search" style="width: 1.8rem; margin-right: .1rem" placeholder="请输入您要搜索的游戏")
            span.ds-button.primary(@click="searchNow") 搜索
          
          .game-platform.notice(style="margin-top: .12rem")
            span.title 游戏平台：&nbsp;&nbsp;
            .content
              .ds-button-group
                .ds-button.x-small.text-button(:class="{ selected: cp === i }" @click=" cp = i " v-for=" (p, i) in platforms ") {{ p }}

          .game-type.notice
            span.title 游戏类型：&nbsp;&nbsp;
            .content
              .ds-button-group
                .ds-button.x-small.text-button(:class="{ selected: ct === i }" @click=" ct = i " v-for=" (g, i) in gameTypes ") {{ g }}

          .game-route.notice
            span.title 赔钱线数：&nbsp;&nbsp;
            .content
              .ds-button-group
                .ds-button.x-small.text-button(:class="{ selected: cr === i }" @click=" cr = i " v-for=" (r, i) in gameRoutes ") {{ r }}

          .game-style.notice
            span.title 游戏风格：&nbsp;&nbsp;
            .content
              .ds-button-group
                .ds-button.x-small.text-button(:class="{ selected: cs === i }" @click=" cs = i " v-for=" (s, i) in gameStyles ") {{ s }}

        .game(v-for=" game in GAMES ")
          img(src="../../assets/game/new/lhgimg.png")
          .el-icon-star-on.my-star(:class="{ on: game.star }" @click=" game.star = !game.star " )
          .info
            .left(style="display: inline-block")
              p.title.text-black {{ game.title }}
              p.desc {{ game.desc }}
            span.right.amount(style="float: right") {{ game.score }}
          .buttons
            .ds-button.outline 试玩
            .ds-button.primary(style="float: right") 进入游戏

        p.text-999(v-if=" !GAMES[0] " style="text-align: center;") 您还没有收藏游戏哦。
      .scroll-content.transfer(v-if=" type === 2 ")
        p
          el-select(style="width: 1.5rem" v-model="sa")
            el-option(v-for="(sa, index) in sas" v-bind:label=" sa " v-bind:value=" index ") 
          span.text-blue.to 转至
          el-select(style="width: 1.5rem" v-model="ta")
            el-option(v-for="(ta, index) in tas" v-bind:label=" ta " v-bind:value=" index ") 
        br
        p
          el-input-number(placeholder="输入金额" v-model="m" style="width: 2rem")
        br
        p
          span.ds-button.primary 确认转入


</template>
<script>
export default {
  data () {
    return {
      type: 1,
      search: '',
      platforms: ['PT', 'MG', 'AG'],
      cp: 0,
      gameTypes: ['全选', '经典', '电动', '视频扑克', '街机'],
      ct: 0,
      gameRoutes: ['全选', '1-10线', '15-20线', '25线', '30线', '40-60线', '100-1024线', '多旋转'],
      cr: 0,
      gameStyles: ['全选', '奖池游戏', '最新', '热门', '幸运转游戏'],
      cs: 0,
      games: [
        {title: '深渊大户家', desc: 'Cash Fish', score: '9.0', star: false},
        {title: '深渊大户家', desc: 'Cash Fish', score: '9.0', star: false},
        {title: '深渊大户家', desc: 'Cash Fish', score: '9.0', star: false},
        {title: '深渊大户家', desc: 'Cash Fish', score: '9.0', star: false},
        {title: '深渊大户家', desc: 'Cash Fish', score: '9.0', star: false},
        {title: '深渊大户家', desc: 'Cash Fish', score: '9.0', star: false},
        {title: '深渊大户家', desc: 'Cash Fish', score: '9.0', star: false}
      ],
      sas: ['信游账户'],
      sa: 0,
      tas: ['PT账户'],
      ta: 0,
      m: 100
    }
  },
  computed: {
    GAMES () {
      return this.games.filter(g => this.type !== 3 || g.star)
    }
  },
  mounted () {
  },
  methods: {
    searchNow () {
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../var.stylus'
.transfer
  top 1rem
  padding .2rem .4rem
  .to
    padding PWX PW
    background url(../../assets/game/new/to.png) center bottom .1rem no-repeat
.my-star
  font-size .33rem
  position absolute
  right PWX
  top PWX
  padding .1rem
  background-color rgba(0,0,0,.3)
  radius(50%)
  cursor pointer
  transition all .8s ease
  transform translateX(100%)
  opacity 0
  &:before
    color #fff
  &:hover
    background-color rgba(0,0,0,.7)
  &.on:before
    color #ffde00
    // font-gradient(90deg, #fffadb, #ffde00)

.amount
  font-family Roboto
  font-size 0.3rem
  color DANGER
  line-height .3rem
.game-store
  // &.collected
  //   top 1.2rem
  top 1.2rem
  padding 0 .55rem .3rem .4rem
  .game
    display inline-block
    overflow hidden
    position relative
    width 2rem
    height 3.2rem
    padding PW PW PW PW
    radius()
    img
      width 2rem
      height 2.4rem
      cursor pointer
    &:hover
      shadow(0 0 5px 0px rgba(0, 0, 0, .3))
      background-color #fff
      .my-star
        opacity 1
        transform none
    .info
      position absolute
      left PW
      bottom 3.5*PW
      right PW
      line-height .2rem
      .title
        font-weight bold
    .buttons
      position absolute
      left PW
      bottom PW
      right PW
      
.filter-fixed
  padding 0 .55rem .3rem 0
  .notice
    padding .05rem 0
    line-height .3rem
    font-size .12rem
    // background-color #fffde8
    .content
      display inline-block
      margin 0
      line-height .25rem
      vertical-align top
      .ds-button-group
        background none
        border none
        shadow(none)
        margin 0
        .ds-button
          radius(.05rem)
</style>