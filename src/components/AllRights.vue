<template lang="jade">
    .all-rights 
      DownLoad
      | 版权所有 COPYRIGHT © 2015 信游娱乐 ALL RIGHTS RESERVED
</template>
<script>
import DownLoad from 'components/DownLoad'
export default {
  components: {
    DownLoad
  }
}
</script>
<style lang="stylus">
  @import '../var.stylus'
  .all-rights
    position absolute
    bottom 0
    left 0
    right 0
    height ARH + 1rem
    line-height ARH
    margin 0
    text-align center
    color rgba(255, 255, 255, .5)
    font-size .12rem
    @media screen and (max-width: 1000px)
      position relative
    @media screen and (max-height: 800px)
      position relative
</style>
