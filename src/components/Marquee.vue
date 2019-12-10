<template lang="jade">
  section(class="marquee-bar-wp" v-bind:class="clustomClass" v-bind:style="clustomStyle" v-show="show")
    slot(name="left")
    .mq-content-wp(ref="mqContent")
      ul(class="items" v-bind:class="animationClass" ref="mqItems" v-bind:style="contentStyl" @animationend="onAnimationEnd" @webkitAnimationEnd="onAnimationEnd")
        li(v-for="(c, i) in content" v-html="c" v-bind:key="i" v-bind:ref="'item' + i" @click="clickHandler")
    .right(@click="close")
      slot(right="right")
</template>

<script>
export default {
  name: 'marqueeBar',
  data () {
    return {
      duration: 0,
      wrapWidth: 0,
      width: 100000,
      animationClass: '',
      firstRound: true
    }
  },
  props: {
    show: Boolean,
    clustomStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    clustomClass: [String, Object, Array],
    content: {
      type: Array,
      default () {
        return []
      }
    },
    delay: {
      type: [String, Number],
      default: 1
    },
    speed: {
      type: Number,
      default: 60
    }
  },
  computed: {
    contentStyl () {
      return {
        width: this.width + 'px',
        paddingLeft: this.firstRound ? 0 : this.wrapWidth + 'px',
        animationDelay: (this.firstRound ? this.delay : 0) + 's',
        animationDuration: this.duration + 's'
      }
    }
  },
  watch: {
    content: {
      handler () {
        this.$nextTick(() => {
          this.wrapWidth = this.$refs.mqContent.getBoundingClientRect().width
          let _width = 0
          for (let i = 0; i < this.content.length; i++) {
            _width += this.$refs['item' + i][0].getBoundingClientRect().width
          }
          if (_width > this.wrapWidth) {
            this.width = _width
            this.duration = this.width / this.speed
            this.animationClass = 'run'
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    clickHandler () {
      this.$emit('click')
    },
    close () {
      this.$emit('close')
    },
    onAnimationEnd () {
      this.firstRound = false
      this.$nextTick(() => {
        this.duration = (this.width + this.wrapWidth) / this.speed
        this.animationClass = 'run-infinite'
      })
    }
  }
}
</script>

<style lang="stylus">
.marquee-bar-wp {
  display flex
  align-items center
  height 40px
  @keyframes ani-marquee-run {
    to { transform: translate3d(-100%, 0, 0) }
  }
  @keyframes ani-marquee-run-infinite {
    to { transform: translate3d(-100%, 0, 0) }
  }
  .mq-content-wp {
    overflow hidden
    position relative
    flex 1
    height 100%
    ul {
      margin 0
      padding 0
      position absolute
    }
    ul > li {
      list-style none
      float left
    }
    .run {
      animation ani-marquee-run linear both 
    }
    .run-infinite {
      animation ani-marquee-run-infinite linear infinite both 
    }
  }
}
</style>
