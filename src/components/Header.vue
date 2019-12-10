<template lang="jade">
  header.font-light
    .tab(v-for=" (tab, i) in tabs" v-bind:class="[{active: tab.active, first: i === 0}, tab.menuClass + '-small']" @click.self="openTab(tab.id)") 
      | {{ tab.title }}
      i.el-icon-close( @click.stop="closeTab(tab.id)")
    
    el-popover(ref="collect" placement="bottom-end" trigger="hover" v-model="show" v-bind:popper-class="'collect ' + (starTabs.length > 0 ? true : false)")
      dl.submenu.font-white
        dd(v-for="i in starTabs" v-bind:class="[ i.menuClass + '-small']" @click="openTab(i.id)") {{ i.title }}
          i.el-icon-delete2(@click.stop="unStar(i)")

    .tab.my-collect.el-icon-star-on(v-popover:collect="collect") 
      | 我的收藏
      
    

   
</template>

<script>
import api from '../http/api'
import store from '../store'
export default {
  props: {
    tabs: Array,
    starTabs: Array
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
  },
  // watch: {
    // 如果路由有变化，会再次执行该方法
    // '$route': 'openRoute'
  // },
  methods: {
    // openRoute ({path}) {
    //   if (path === '/') {
    //     this.tabs.forEach(t => store.actions.updatePage('', {size: 'minus'}, t))
    //   }
    // },
    openTab (url) {
      this.$emit('open-tab', url)
    },
    closeTab (url) {
      this.$emit('close-tab', url)
    },
    unStar (page) {
      this.$http.get(api.delPrefence, {
        menuId: page.menuid,
        isDesk: 0,
        sort: 1
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          store.actions.updatePage(page.id, {star: false}, page)
        } else this.$message.warning(data.msg || '收藏删除失败!')
      }, (rep) => {
        // error
        this.$message.warning('收藏删除失败!')
      })
    }
  },
  components: {
  }

}
</script>
<style lang="stylus">
  @import '../var.stylus'
  H = .3rem
  .el-popover.collect
    font-size .12rem
    transform translateX(-.05rem) translateY(-.14rem)
    padding PW 0
    min-width 1.6rem
    radius(0)
    dd[class*=ds-icon-]
      padding 0 PW
      padding-left 2 * PW + .05rem
      background-position PW center
      line-height H
      cursor pointer
      &:hover
        color BLUE
      i
        color LIGHT
        float right
        line-height H
        cursor pointer
        &:hover
          color RED
</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  header
    font-size .12rem
    // background-color rgba(255, 255, 255, .1)
  .tab
    &.first
      margin-left 1.6rem
    float left
    min-width 1.6rem
    line-height: HH
    padding-left .3rem
    box-sizing border-box
    background-color rgba(0,0,0,.4)
    font-shadow()
    cursor default
    &[class*=ds-icon-]
      background-position .1rem center
    &:hover
      color WHITE
      background-color rgba(0,0,0,.6)
    &:active
    &.active
      background-color BLUE
      color WHITE 
    >i
      color LIGHT
      float right
      transform perspective(500px) translateZ(-150px)
      radius(50%)
      display inline-block
      // width .2342rem
      // height .2342rem
      padding .0571rem .0571rem
      &:hover
        color WHITE
        background-color rgba(0,0,0, .6)
        
      position relative
      top .05rem
      left .05rem
      font-size .1rem
      text-shadow none
      margin 0 .1rem
  
  &.my-collect
    position absolute
    left 0 
    float none
    margin-left 0
    &:before
      font-size .16rem
      line-height .16rem

  
</style>
