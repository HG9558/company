<template lang="jade">
.sub-game-record
  slot(name="cover")
  slot(name="movebar")
  slot(name="resize-x")
  slot(name="resize-y")
  slot(name="toolbar")
  Order.scroll-content(v-if=" I === 0 ")
  VROrder.scroll-content(v-if=" I === 1 ")
  SportRecord.scroll-content(v-if=" I === 2 ")
  VideoRecord.scroll-content(v-if=" I === 3 ")
  GameRecord.scroll-content(v-if=" I === 4 ")
  FishRecord.scroll-content(v-if=" I === 5 ")
  CardRecord.scroll-content(v-if=" I === 6 ")
</template>

<script>
import Order from './Order'
import VROrder from './VROrder'
import SportRecord from './SportRecord'
import VideoRecord from './VideoRecord'
import GameRecord from './GameRecord'
import FishRecord from './FishRecord'
import CardRecord from './CardRecord'

export default {
  components: {
    Order,
    VROrder,
    SportRecord,
    VideoRecord,
    GameRecord,
    FishRecord,
    CardRecord
  },
  name: 'sub-game-record',
  props: [],
  data () {
    return {
      I: 0
    }
  },
  methods: {
    __setSubGameRecordI (i) {
      this.I = i
    }
  }
}
</script>

<style lang="stylus">
// 建议不添加scoped， 所有样式最多嵌套2层
</style>
