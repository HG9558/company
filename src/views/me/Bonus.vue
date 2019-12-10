<template lang="jade">
  .me-page.bonus-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .me-detail-info.scroll-content
      .base-info
        div.info
          label(style="margin: 0 .1rem") 帐号：
            span.account {{ account }}
          label(style="margin: 0 .1rem") 昵称：
            span.account {{ name }}
          label(style="margin: 0 .1rem") 
              span.text-blue 高频
              | 限额：
              span.account.text-danger {{ limitbonus }}
              | 元
          label(style="margin: 0 .1rem") 
              span.text-blue 低频
              | 限额：
              span.account.text-danger {{ dplimitbonus }} 
              | 元

          label(v-if="userPoint" style="margin: 0 .1rem") 返点：
            span.account {{ userPoint }}

          label(style="margin: 0 .1rem" v-if="salary") 工资：
            span.account.text-blue {{ salary }}

        div.info.mt05(v-if=" userBackWater[0] ")

          label(style="margin: 0 .1rem" v-for=" x in userBackWater ") {{ x.groupName }}返水：
            span.account.text-blue {{ x.backWater }}


        .ds-button-group
          .ds-button.x-small.text-button(v-for="key in keys" v-bind:class="{selected: skey === key.enName}" @click="skey = key.enName" v-bind:title="key.cnName") {{ key.cnName }}
      .table-list(style="padding: 0 0 0 .15rem")
        el-table.header-bold.bonus-table.nopadding(:data="data" stripe v-bind:row-class-name="tableRowClassName" style="max-width: 8rem; margin: 0 auto; padding: 0rem 0")
          
          el-table-column(prop="methodName" label="玩法" class-name="pl2")
          
          el-table-column(label="奖级")
            template(scope="scope") 
              .level(v-for=" l in ((scope.row.level + '').split(',')) ") {{ l }}

          el-table-column(label="奖金" align="right" class-name="pr2")
            template(scope="scope") 
              .level(v-for=" p in ((scope.row.prize + '').split(',')) ") {{ p  }}

      
      
</template>

<script>
import api from '../../http/api'
// import store from '../../store'
export default {
  data () {
    return {
      // me: store.state.user,
      account: '',
      name: '',
      dplimitbonus: '',
      limitbonus: '',
      keys: [],
      games: [],
      skey: '',
      userPoint: '',
      salary: '',
      teamsales: '',
      activityuser: '',
      userBackWater: []
      // data: [
      //  {title: '五星直选', bonusLevel: '奖金', bonus: '180000.00', point: '7.5', status: '使用中'}
      // ]
    }
  },
  computed: {
    data () {
      return this.games[this.skey]
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'openRoute'
  },
  mounted () {
    this.getLotteryPrinzeInfo(this.$route.query.userId || '')
  },
  methods: {
    openRoute ({path, query: {userId}}) {
      if (path !== '/me/2-3-1') return false
      if (userId) this.getLotteryPrinzeInfo(userId)
    },
    tableRowClassName (row, index) {
      if (row.selected) return 'selected-row'
    },
    getLotteryPrinzeInfo (userId) {
      let loading = this.$loading({
        text: '奖金详情加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      this.$http.get(api.getLotteryPrinzeInfo, {destUserId: userId || ''}).then(({data}) => {
        if (data.success === 1) {
          this.account = data.userName
          this.name = data.nickName
          this.dplimitbonus = data.dplimitbonus
          this.limitbonus = data.limitbonus
          this.userPoint = data.userPoint
          this.salary = data.userDaySalary.salary
          this.teamsales = data.userDaySalary.teamsales
          this.activityuser = data.userDaySalary.activityuser
          // this.games = data.lotteryPrizeInfo
          this.keys = data.cnNames
          this.games = data.lotteryPrizeInfo
          this.skey = Object.keys(this.games)[0]
          this.userBackWater = data.userBackWater
        }
      }).catch(rep => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 1000)
      })
    }
  },
  components: {
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .scroll-content
    top TH
  .me-detail-info
    padding PWX
    .base-info
      text-align center
      color #333
      padding 0 .5rem
    .el-table
      color #333
      .th .cell
        font-weight bold

</style>


<style lang="stylus" scoped>
// to imitate the old ds
  @import '../../var.stylus'
  body.nds
    .info
      padding .1rem
      background #fff
    .ds-button-group
      margin .2rem 0
      
</style>


<style lang="stylus">
  #app.cb.v2 .bonus-page 
    .base-info
      max-width 10rem
      margin 0 auto
      // max-width 5rem
</style>