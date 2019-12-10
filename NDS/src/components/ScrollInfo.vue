<template lang="jade">
  .scroll-info.text-666
    span.text-blue.text-bold 中奖公告：
    span(v-for=" (msg, ii) in msgs " v-show="ii === j")
      | {{ msg.cnName }} ({{ msg.issue }}) 期 
      span.userName.text-blue {{ msg.nickName }}
      |  喜中 
      span.money.text-danger {{ msg.amount }}
      |  元

   
</template>

<script>
import api from 'src/http/api'
export default {
  data () {
    return {
      msgs: [],
      j: 0
    }
  },
  computed: {
  },
  mounted () {
    this.rewardNotices()
    setInterval(() => {
      this.j++
      if (this.j === this.msgs.length) this.j = 0
    }, 5000)
  },
  methods: {
    // 10、中奖公告   ALL
    rewardNotices () {
      this.$http.get(api.rewardNotices).then(({data}) => {
        // success
        if (data.success) {
          this.msgs = data.rewardNotices || []
        }
      }, (rep) => {
        // error
      })
    }
  },
  components: {
  }

}
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .scroll-info
    height .32rem
    line-height .32rem
    padding 0 PW
    background #fff
    &.has-lefter
      padding 0 PW
      
  
</style>
