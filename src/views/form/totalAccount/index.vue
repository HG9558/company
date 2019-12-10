// 团队盈亏-彩票
<template lang="jade">
  .total-account
    slot(name='cover')
    slot(name='movebar')
    slot(name='resize-x')
    slot(name='resize-y')
    slot(name='toolbar')
    lottery.scroll-content(v-if=' I === 0 ')
    tripartite.scroll-content(v-if=' I === 1 ')
    //- 微游和棋牌  全部都一样  就 gameType ID不一样
    //- 棋牌
    //- outreportcard.scroll-content(v-if=' I === 2 ', :gameType='4')
    //- 微游
    outreportcard.scroll-content(v-if=' I === 2 ', :gameType='8')

    LWR.scroll-content(v-if=' I === 3 ')

    ActivityStatistics.scroll-content(v-if=' I === 4 ')

</template>

<script>
import lottery from "../lottery"; //彩票
import tripartite from "../tripartite"; //三方
import outreportcard from "../outReport/outReportCard"; //棋牌   //微游
import LWR from "../LWR"; // 充提报表
import ActivityStatistics from '../ActivityStatistics' // 活动统计
export default {
  components: {
    lottery,
    tripartite,
    outreportcard,
    LWR,
    ActivityStatistics
    // lottery: resolve => require(["../lottery"], resolve), //彩票
    // tripartite: resolve => require(["../tripartite"], resolve), //三方
    // outReportCard: resolve => require(["../outReport/outReportCard"], resolve) //棋牌   //微游
  },
  name: "total-account",
  props: [],
  data() {
    return {
      I: 0
    };
  },
  methods: {
    __setTotalAccountI(i) {
      this.I = i;
    }
  }
};
</script>
