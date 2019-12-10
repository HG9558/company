<template lang="jade">

  .order-list.history

    .banner(style="padding: 15px; color: black; font-weight: bold") 追号记录

    el-table.ghost(:data="data" v-bind:row-class-name="tableRowClassName")

      el-table-column(prop="cnname" label="彩种")

      el-table-column(prop="beginissue" label="起始期号")

      el-table-column(label="玩法、投注号码" width="200" show-overflow-tooltip=true)
        template(scope="scope") {{ scope.row.methodname  + '[' + scope.row.codes + '] ' }}

      el-table-column(label="模式" width="80")
        template(scope="scope") {{ scope.row.modes === 1 ? '2元': scope.row.modes === 2 ? '2角': scope.row.modes === 3 ? '2分': scope.row.modes === 4 ? '2厘' : '1元' }}


      el-table-column(prop="taskprice" label="金额" width="120" align="right")

      el-table-column(label="状态" width="100" align="right")
        template(scope="scope") {{ scope.row.status === 0 ? '进行中': scope.row.status === 1 ? '取消': '已完成' }}


</template>

<script>
  import api from '../http/api'
  export default {
    data () {
      return {
        /*
          "beginissue": "161227033",//起始期号
          "begintime": "2016-12-27 11:30:23.0",//起始时间
          "cnname": "重庆时时彩",//彩种名称
          "codes": "0123",//投注内容
          "finishprice": 180,//完成金额
          "lotteryid": 1,//彩种代码
          "methodid": 29,//玩法代码
          "methodname": "后二直选",//玩法名称
          "modes": 1,//模式, 1-元，2-角，3-分，4-厘
          "status": 2,//追号状态(0:进行中;1:取消;2:已完成)
          "taskid": 56,//追号任务id
          "taskprice": 180,//总金额
          "userid": 4,//用户id
          "username": "steven"//用户名
        */
        data: []
      }
    },
    computed: {
    },
    mounted () {
      this.__getFollowList()
    },
    methods: {
      __getFollowList () {
        this.$http.post(api.getFollowList, {size: 5}).then(({data}) => {
          // success
          if (data) this.data = data
        }, (rep) => {
          // error
        })
      }
    }
  }
</script>

<style lang="stylus">
  H = 1.6rem
  .order-list
    .el-table
    // width "calc(100% - %s)" % s
      .el-table__body-wrapper
        // padding-right .3rem
        max-height H
      
</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
</style>
  
 

