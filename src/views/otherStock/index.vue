// 其他分红管理
<template lang="jade">
  .other-stock
    slot(name='toolbar')
    otherprofit.scroll-content(v-if=' I === 0 ', :typeCode='0')
    otherprofit.scroll-content(v-if=' I === 1 ', :typeCode='1')
    totherprofit.scroll-content(v-if=' I === 2 ')
    othercontract.scroll-content(v-if=' I === 3 ')

</template>

<script>
export default {
  components: {
    otherprofit: resolve => require(["../form/OtherProfit"], resolve), //我的其他分红  下级其他分红
    totherprofit: resolve => require(["../form/TOtherProfit"], resolve), //预期其他分红
    othercontract: resolve => require(["../group/OtherContract"], resolve) //契约其他分红
  },
  name: "other-stock",
  props: [],
  data() {
    return {
      I: 0
    };
  },
  methods: {
    __setOtherStockI(i) {
      this.I = i;
    }
  }
};
</script>