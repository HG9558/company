<template lang="jade">
  .tool-bar.page-tool-bar
    //- span.title(v-if="!tabs") {{ title }}
    .tabs.text-black
        span.tab(v-for=" (b, i) in tabs || [title] " @click="tabHandler(i)" v-bind:class=" {selected: ti === i} " v-if=" !b.split(':')[1] || (b.split(':')[1] && ME.menuids.indexOf(',' + (b.split(':')[1] + ',')) !== -1)  " v-show=" !(ME.role === 1 && i === 3 && (menuid === '44' || menuid === '45') ) ") {{ b.split(':')[0] }}

    el-button-group
      .el-button.ds-icon-volume(:class=" { off: !volume } " @click="v")
      el-button.my-star(v-bind:icon="starClass" @click.stop="like" v-if="menuid")
      .el-button(@click.stop="minus")
        .el-icon-minus
      .el-button(@click="full")
        .full
      el-button.close(icon="close" @click.stop="close")


</template>

<script>
import store from '../store'
export default {
  props: ['title', 'star', 'menuid', 'volume', 'tabs', 'tabfn', 'tabIndex'],
  data () {
    return {
      ME: store.state.user,
      ti: 0
    }
  },
  computed: {
    starClass () {
      return 'star-' + (this.star ? 'on' : 'off')
    }
  },
  watch: {
    tabIndex () {
      this.ti = this.tabIndex
    }
  },
  methods: {
    full () {
      this.$emit('full')
    },
    minus () {
      this.$emit('minus')
    },
    like () {
      this.$emit('star')
    },
    close () {
      this.$emit('close')
    },
    v () {
      this.$emit('volume')
    },
    tabHandler (i) {
      this.ti = i
      this.__setCall({fn: this.tabfn, args: (i)})
      this.$emit('tab-idx-change', i)
    }
  },
  components: {
  }
}
</script>
<style lang="stylus">
  .dialog-page:not(.game-page) .tool-bar .ds-icon-volume
    display none
  .dialog-page.game-page .move-bar
     right 1.75rem
</style>
<style lang="stylus" scoped>
  @import '../var.stylus'
  .tabs
    display inline-block
    text-align center
    background-color inherit
    font-weight bold
    height TH
    .tab
      display inline-block
      // height .37rem
      // line-height .37rem
      // width 1rem
      position relative
      cursor pointer
      border-top 3px solid #a8a8a8
      box-sizing border-box
      background none
      padding 0 0.2rem
      &:hover
        color BLUE
      &.selected
        color BLUE
        border-top 3px solid BLUE
        background-image linear-gradient(0deg, #e9e9e9 0%, #ffffff 100%)
      &:first-child:before
        content ''
        position absolute
        left 0px
        top -3px
        height 100%
        width 2px
        // background-color #d0d0d0
        // border-left 1px solid #d0d0d0
        // border-right 1px solid #fff
        background-image url(../assets/40x2.jpg)
        z-index -1
        
      &:after
        z-index -1
        content ''
        position absolute
        right -1px
        top -3px
        height 100%
        width 2px
        // background-color #d0d0d0
        // border-left 1px solid #d0d0d0
        // border-right 1px solid #fff
        background-image url(../assets/40x2.jpg)
        
        // background-image linear-gradient(90deg, #d0d0d0 0%, #ffffff 100%)

</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  bg = #d8d8d8
  bg-hover = #ececec
  bg-active = #e2e2e2
  .tool-bar
    padding-left PW
    &.page-tool-bar
      background none
    radius(0)
    user-select none
    height TH
    line-height TH 
    background-color #e9e9e9
    font-size .14rem
    border-top-right-radius .05rem
    border-top-left-radius .05rem
    overflow hidden
    // background-position .2rem center
  
  
  .title
    color #333
    font-weight bold
    // padding-left .41rem
  
  .el-button-group
    float right
    height 100%
    radius(0)
    .el-button
      font-size .12rem
      color GREY
      border none
      height 100%
      width TH
      padding 0
      radius(0)
      cursor default
      background-color transparent
      &:hover
        background-color bg-hover
      &:active
        background-color bg-active
      &:first-child
        font-size .16rem
      &.close
        radius(0)
        &:hover
          background-color #f34
          color #fff
        &:active
          color #fff
          background-color #d40c1d

  
  .el-icon-minus
    position relative
    top .16rem
  .full
    display inline-block
    width .12rem
    height .08rem
    border .02rem solid GREY
    position relative
    top .12rem

</style>

