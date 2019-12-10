<template lang="jade">
  .signal-bar(:class="{ green: value > 5, yellow: value <= 5 }")
    span.square(:class="{ enable: i <= value }" v-for=" (x, i) in all")

</template>

<script>
  export default {
    props: {
      value: {
        required: true,
        type: Number
      }
    },
    data () {
      return {
        all: Array(10).fill(0)
      }
    },
    computed: {
      // squares () {
      //   return Array(this.value || 0).fill(0)
      //   // .map((x, i) => {
      //   //   return (x = i + 1)
      //   // })
      // }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  W = .2rem
  H = .2rem
  
  .signal-bar
    .square
      display inline-block
      width W
      height H
      margin 0 0 .03rem .03rem
      shadow()
      radius()
      background-color rgba(255, 255, 255, .2)
    &.green
      .square.enable
        bg-gradient(180deg, #55e80c, #0ed73a)
    &.yellow
      .square.enable
        bg-gradient(180deg, #ead312, #ebc313)
</style>
