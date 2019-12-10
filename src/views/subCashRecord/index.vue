<template lang="jade">
.sub-cash-record
  slot(name="toolbar")
  AR.scroll-content(v-if=" I === 0 " v-bind:menus="menus" v-bind:useSource="2")

</template>

<script>
import AR from './AR'
export default {
  components: {
    AR
  },
  name: 'sub-cash-record',
  props: ['menus'],
  data () {
    return {
      I: 0
    }
  },
  methods: {
    __setSubCashRecordI (i) {
      this.I = i
    }
  }
}
</script>

<style lang="stylus">
// 建议不添加scoped， 所有样式最多嵌套2层
</style>
