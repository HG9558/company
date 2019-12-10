<template lang="jade">
  .modal
    .mask
    .box-wrapper
      .box(style="width: 6rem")
        .tool-bar(style="padding: .03rem .08rem 0 .15rem; line-height: .5rem")
          span.title.text-black(style="font-size: .18rem;") 打印
          el-button-group
            i.el-icon-close.ds-button.text-button(@click="__setCall({fn: '__unprint'})")
        .content
          iframe(ref="frame" style="border: none; height: 400px; width: 100%")
            .frame-content(ref="frameContent")
              title 订单打印
              p {{ d }}
                span(style="float: right;margin-right: 30px;") 订单打印
              div(style="padding: 15px 30px;")
                p(style="position: relative; line-height: 25px; min-width: 100px; padding-left: 100px; margin: 0 0 15px 0; color: #333; word-break: break-all;" v-for=" (v, k, i) in data ")
                  span(style="position: absolute; left: 2px; font-weight: bold;") {{ k }}： 
                  {{ v || '暂无' }}
          .buttons(style="margin-bottom: .3rem")
            .ds-button.primary.full(@click="print") 打印

</template>

<script>
  import Modal from 'components/Modal'
  import { dateFormat } from '../util/Date'
  export default {
    name: 'Print',
    props: ['data'],
    components: [
      Modal
    ],
    data () {
      return {
        d: dateFormat((new Date()).getTime(), null, '/')
      }
    },
    computed: {
      dataArray () {
        // return Object.entries(this.data)
      }
    },
    mounted () {
      this.$refs.frame.contentWindow.document.body.appendChild(this.$refs.frameContent)
    },
    methods: {
      print () {
        // this.$refs.frame.contentWindow.location.href = 'about:blank'
        this.$refs.frame.contentWindow.print()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  @import '../path.stylus'
  .el-button-group
    float right
  
  .el-icon-close
    padding .05rem .1rem
    font-size .18rem
    color LIGHT
    &:hover
      color #fff
      background-color DANGER-HOVER
    &:active
      color #fff
      background-color DANGER-ACTIVE
  .modal 
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    text-align center
    z-index 9999
    
    .mask
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      opacity .5
      background #000
      z-index 9998
    .box-wrapper
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      text-align center
      z-index 9999
      &:after
        content ''
        height 100%
        width 0
        vertical-align middle
        display inline-block
    .box
      position relative
      text-align left
      display inline-block
      vertical-align middle
      background-color #fff
      font-size .12rem
      width 4.5rem
      radius()
    .content
      text-align center
      margin 0 .2rem
      .el-row
        margin PW 0
      .textarea-label
        position relative
        margin .3rem .3rem .3rem 0
        .label
          position absolute
          left 0
          top .05rem
        .el-textarea
          display inline-bock
          vertical-align top
          padding-left .6rem 
          .textarea
            font-size .12rem
</style>

