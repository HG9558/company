<template lang="jade">
.my-game-record
  slot(name="cover")
  slot(name="movebar")
  slot(name="resize-x")
  slot(name="resize-y")
  slot(name="toolbar")
  Order.scroll-content(v-if=" I === 0 " v-bind:menus="menus")
  Follow.scroll-content(v-if=" I === 1 " v-bind:menus="menus")
  //- Order.scroll-content(v-if=" I === 0 ")
  //- VROrder.scroll-content(v-if=" I === 1 ")
  //- SportRecord.scroll-content(v-if=" I === 2 ")
  //- VideoRecord.scroll-content(v-if=" I === 3 ")
  //- GameRecord.scroll-content(v-if=" I === 4 ")
  //- FishRecord.scroll-content(v-if=" I === 5 ")
  //- CardRecord.scroll-content(v-if=" I === 6 ")
</template>

<script>
// import Order from './OF'
// import VROrder from './VROF'
// import SportRecord from './SportRecord'
// import VideoRecord from './VideoRecord'
// import GameRecord from './GameRecord'
// import FishRecord from './FishRecord'
// import CardRecord from './CardRecord'

import Order from './Order'
import Follow from './Follow'
export default {
  components: {
    // Order,
    // VROrder,
    // SportRecord,
    // VideoRecord,
    // GameRecord,
    // FishRecord,
    // CardRecord

    Order,
    Follow
  },
  name: 'my-game-record',
  props: ['menus'],
  data () {
    return {
      I: 0
    }
  },
  methods: {
    __setMyGameRecordI (i) {
      this.I = i
    }
  }
}
</script>

<style lang="stylus">
// 建议不添加scoped， 所有样式最多嵌套2层
</style>
