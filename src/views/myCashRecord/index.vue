<template lang="jade">
.my-cash-record
  slot(name="toolbar")
  AR.scroll-content(v-if=" I === 0 " v-bind:menus="menus")
  LR.scroll-content(v-if=" I === 1 ")
  WR.scroll-content(v-if=" I === 2 ")
  TR.scroll-content(v-if=" I === 3 ")

</template>

<script>
import AR from './AR'
import LR from './LR'
import WR from './WR'
import TR from './TR'

export default {
  components: {
    AR,
    LR,
    WR,
    TR
  },
  name: 'my-cash-record',
  props: ['menus'],
  data () {
    return {
      I: 0
    }
  },
  methods: {
    __setMyCashRecordI (i) {
      this.I = i
    }
  }
}
</script>

<style lang="stylus">
// 建议不添加scoped， 所有样式最多嵌套2层
</style>
