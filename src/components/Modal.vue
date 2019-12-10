<template lang="jade">

  transition(name="fade" appear=true)

    .modal(:class="[Cclass]")

      .mask(v-if="modal")

      .box-wrapper

        .box(:style="boxStyle")

          .header-bar(v-if="title || showclose")

            .title {{ title }} 

            .buttons
              i.el-icon-close.ds-button.text-button(@click="_close" )


          .content

            .text-black(:class="[typeIcon[type]]" )
              slot(:class="[typeIcon[type]]" name="my-content")
                div(v-html="content" v-bind:class=" { showpd4: !btn[0] } ")

          .footer-bar(:class="[ 'btn' + btn.length ]" v-if=" btn[0] ")
            a.ds-button.large.bold(:href=" href[i] " target="_blank" v-for="(b, i) in btn" @click.stop="btnClick(i)" v-bind:class="[ btnClass[type][i] || btnClass[type][1] ]") {{ b }}



      
</template>

<script>
  export default {
    name: 'Modal',
    props: ['Ptitle', 'Ptype', 'Pbtn', 'Phref', 'Pok', 'Pcancel', 'Pclose', 'PboxStyle'],
    data () {
      return {
        type: 'confirm',
        title: '',
        content: '',
        btn: ['确定', '取消'],
        href: [],
        showclose: true,
        // showok: true,
        // showcancel: true,
        modal: true,
        ok: null,
        O: null,
        customClass: '',
        typeIcon: {
          confirm: 'default',
          question: 'ds-icon-question-large',
          warn: 'ds-icon-notice-large',
          success: 'ds-icon-success-large',
          redpocket: 'ds-icon-redpocket'
        },
        btnClass: {
          confirm: ['primary', 'cancel'],
          question: ['success', 'cancel'],
          warn: ['danger', 'cancel'],
          success: ['success', 'cancel'],
          redpocket: ['gold', 'cancel'],
          info: ['primary', 'cancel']
        },
        boxStyle: {
          width: '4.2rem'
        }
      }
    },
    computed: {
      Cclass () {
        return this.customClass + ' ' + this.type
      }
    },
    watch: {
      Pbtn () {
        this.btn = this.Pbtn
      },
      Phref () {
        this.href = this.Phref
      },
      Ptype () {
        this.type = this.Ptype
      }
    },
    methods: {
      _close () {
        if (typeof this.close === 'function') {
          if (this.close.call(this.O) === false) return
        }
        this.$el &&
        this.$el.parentNode &&
        this.$el.parentNode.removeChild(this.$el)
        this.$destroy()
      },
      _ok () {
        if (typeof this.ok === 'function') this.ok.call(this.O) !== false && this._close(true)
        else this._close(true)
      },
      _cancel (i) {
        if (typeof this.cancel === 'function') this.cancel.call(this.O, i) !== false && this._close(false)
        else this._close(false)
      },
      btnClick (i) {
        if (i === 0) this._ok()
        else if (i === 1) this._cancel()
        else this._cancel(i)
      }
    },
    created () {
      // props:['Ptype', 'Pbtn', 'Pok', 'Pcancel', 'Pclose'],
      if (this.Ptype) this.type = this.Ptype
      if (this.Pbtn) this.btn = this.Pbtn
      if (this.Phref) this.href = this.Phref
      if (this.Pok) this.ok = this.Pok
      if (this.Pcancel) this.cancel = this.Pcancel
      if (this.Pclose) this.close = this.Pclose
      // if (this.PboxStyle) this.boxStyle = this.PboxStyle
      if (this.Ptitle) this.title = this.Ptitle
      if (this.PboxStyle || this.PPboxStyle) this.boxStyle = Object.assign(this.boxStyle, this.PboxStyle || {}, this.PPboxStyle || {})
    },
    mounted () {
      if (this.timeout) setTimeout(this._close, this.timeout || 3000)
    }
  }
</script>


<style lang="stylus" scoped>
  @import '../var.stylus' 
  .showpd4
    padding-bottom .4rem
    
  .dialog-page > .modal
      top TH
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
      radius()
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
      // overflow hidden
      position relative
      text-align left
      display inline-block
      vertical-align middle
      background-color #fff
      width 4.2rem
      radius()
      font-size 16px
    .header-bar
      position absolute
      top 0
      left 0
      right 0
      height .5rem
      padding-left PW
      z-index 1
      radius(15px)
      border-bottom-left-radius 0
      border-bottom-right-radius 0
      .title
        font-size .16rem
        font-weight 700
        color #333
        float left
        line-height .5rem
        max-width 80%
        
      .buttons
        float right
        max-width 50%
        .el-icon-close
          margin .08rem
          padding .05rem .1rem
          font-size .18rem
          color LIGHT
          &:hover
            color #fff
            background-color DANGER-HOVER
          &:active
            color #fff
            background-color DANGER-ACTIVE
    .footer-bar
      padding .4rem  .2rem
      text-align center
      .ds-button:not(:first-child)
        margin-left .1rem
      &.btn1
        .ds-button
          width 60%
        
    .content
      word-break break-all
      position relative
      padding 0 .3rem
      font-size 14px
      margin-top .5rem

  .ds-icon-success-large
  .ds-icon-notice-large
  .ds-icon-question-large
    padding-top 90px
    font-size .18rem
    text-align center
  
  .ds-icon-redpocket
    color #fff
    padding-top 160px
    text-align center
    
  .modal.redpocket
    .box 
      width 330px
      background-color #d4322d
      radius(15px)
      
      .header-bar
        background-color #e23f38
      .content
        padding 0
      .footer-bar
        padding 0
        margin .3rem 0 .4rem 0 
    
  .modal.info
    .content 
      font-size .18rem
      text-align center
    .footer-bar
      padding 0.25rem
    
</style>

