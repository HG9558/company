<template lang="jade">
  span.condi-item-button
    span.txt-c {{title}}
    span.r-close
      IconClose(v-on:click.native="$emit('close', id)")
</template>

<script>
import IconClose from './IconClose'
export default {
  name: 'ConditionItemButton',
  data () {
    return {}
  },
  props: {
    title: String,
    id: String
  },
  components: {
    IconClose
  }
}
</script>

<style lang="stylus">
  .condi-item-button
    position relative
    display inline-block
    min-width 1.06rem
    height 0.3rem
    background-image linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%), linear-gradient(#000000, #000000)
    margin 0.05rem
    box-sizing border-box
    border-radius  0.03rem
    border solid 1px #e8e8e8
    color #f37e0c
    &:hover
      border-color #f37e0c
      .r-close
        background #f37e0c
      .icon-cross::before,
      .icon-cross::after
        border-color #fff
    .icon-cross::before,
    .icon-cross::after
      border-color #666666
    &>span
      display inline-block
    &>span:first-child
      padding 0 0.1rem
      line-height 0.3rem
    .r-close
      width 0.3rem
      height 0.28rem
      float right
      display flex
      align-items center
      justify-content center
      cursor pointer
</style>
