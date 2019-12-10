// 彩票分红管理
<template lang="jade">
  .lottery-stock
    slot(name='toolbar')
    Stock.scroll-content(v-if=' I === 0 ', :typeCode='0')
    Stock.scroll-content(v-if=' I === 1 ', :typeCode='1')
    TStock.scroll-content(v-if=' I === 2 ')
    Contract.scroll-content(v-if=' I === 3 ')

</template>

<script>
export default {
  components: {
    Stock: resolve => require(["../group/Stock"], resolve), //我的分红  下级分红
    TStock: resolve => require(["../group/TStock"], resolve), //预期分红
    Contract: resolve => require(["../group/Contract"], resolve) //彩票分红契约
  },
  name: "lottery-stock",
  props: [],
  data() {
    return {
      I: 0
    };
  },
  methods: {
    __setLotteryStockI(i) {
      this.I = i;
    }
  }
};
</script>