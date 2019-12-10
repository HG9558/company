<template lang="jade">
  section.search-condition-lottery
    section.lottery-history-wp
      ul(class="flex lty-ls-wp history" v-show="historyLs.length > 0")
        li(v-for="(h, i) in historyLs" class="flex flex-ai-c flex-jt-c lty-item" v-bind:class="{selected: curHistoryIdx === i}" @click="choicedHistory(h.gameid, i)") {{getNameById(h.gameid)}}

    section.lty-wp
      ul(v-for=" (cats, i) in lotteryLs" class="flex lty-ls-wp" v-bind:class="cats.url ? cats.url : 'other' " v-if="cats.items.length")
        template(v-for="(lottery, j) in cats.items")
          li(v-if="lottery.gameid" class="flex flex-ai-c flex-jt-c lty-item" v-bind:class="{selected: curIdx === `${i}-${j}`}" @click="choiced(lottery, j, i)") {{lottery.title + ((lottery.subTitle || '').length > 0 ? `(${lottery.subTitle})` : '')}}
</template>

<script>
export default {
  name: 'SearchConditionLottery',
  data () {
    return {
      curHistoryIdx: -1,
      curIdx: -1,
      lotteryItems: [],
      lotteryMap: new Map()
    }
  },
  props: {
    menus: Object,
    lotteryLs: Array,
    historyLs: Array
  },
  watch: {
    historyLs () {
      this.updateLotteryItems()
    }
  },
  mounted () {
    this.updateLotteryItems()
  },
  methods: {
    updateLotteryItems () {
      this.lotteryMap.clear()
      this.lotteryLs.forEach((groups) => {
        groups.items.forEach((item) => {
          this.lotteryMap.set('id-' + item.gameid, item)
        })
      })
    },
    getNameById (id) {
      return (this.lotteryMap.get('id-' + id) || {}).title
    },
    choiced (v, j, i) {
      this.curHistoryIdx = -1
      this.curIdx = `${i}-${j}`
      this.$emit('choiced', v, j, i)
    },
    choicedHistory (v, j, i) {
      this.curIdx = -1
      this.curHistoryIdx = i
      this.$emit('choiced', { gameid: v, title: this.getNameById(v) }, j, i)
    }
  }
}
</script>

<style lang="stylus">
  .search-condition-lottery
    .history-wp
      margin-bottom 0.2rem
    .lty-ls-wp
      width 4.2rem
      display flex
      justify-content space-between
      flex-wrap wrap
      padding-left 1.2rem
      margin-top 0.3rem
      &::after
        content ''
        flex 1
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

      &.other
      &.OTHER
        background url(../assets/v2/nav_icon_qt.png) 0 center no-repeat

      &.history
        background url(../assets/v2/nav_icon_ls.png) 0 center no-repeat

    .lty-item
      width 1.3rem
      height 0.3rem
      background-image linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%), linear-gradient(#000000, #000000)
      margin 0.05rem
      box-sizing border-box
      border-radius  0.03rem
      border solid 1px #e8e8e8
      font-size 0.12rem
    .lty-item:hover
      border solid 1px #f37e0c
    .lty-item.selected
      background-image linear-gradient(0deg, #fff3e9 0%, #fffaf6 100%), linear-gradient(#000000, #000000) !important
      border solid 1px #f37e0c !important
    .lty-item.fixed-slted
      color #f37e0c
      background-image linear-gradient(0deg, #fff6c2 0%, #fff8d3 100%), linear-gradient(#000000, #000000)
      border solid 1px #dbd093
</style>
