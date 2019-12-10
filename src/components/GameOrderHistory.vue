<template lang="jade">

  .order-list.history

    .banner(style="padding: 15px; color: black; font-weight: bold") 投注记录

    el-table.ghost(:data="data" v-bind:row-class-name="tableRowClassName")

      el-table-column(prop="issue" label="期号")

      el-table-column(label="玩法、投注号码" width="200" show-overflow-tooltip=true)
        template(scope="scope") {{ scope.row.methodname  + '[' + scope.row.code + '] ' }}


      el-table-column(label="模式" width="80")
        template(scope="scope") {{ scope.row.modes === 1 ? '2元': scope.row.modes === 2 ? '2角': scope.row.modes === 3 ? '2分': scope.row.modes === 4 ? '2厘' : '1元' }}

      el-table-column(prop="multiple" label="倍投" width="80" align="right")

      el-table-column(prop="totalprice" label="金额" width="120" align="right")

      el-table-column(prop="bonus" label="奖金" width="100" align="right")

</template>

<script>
  import api from '../http/api'
  export default {
    data () {
      return {
        /*
          "bonus": 0,//奖金
          "code": "0123",//投注内容
          "isgetprize": 2,//0:未判断;1:中奖;2:未中奖)
          "issue": "161227039",//期号
          "methodid": 29,//玩法代码
          "methodname": "后二直选",//玩法名称
          "modes": 1,//模式,1-元，2-角，3-分，4-厘
          "multiple": 1,//倍数
          "projectid": 371,//方案id
          "totalprice": 20,//总金额
          "userid": 4,//用户id
          "username": "steven",//用户名
          "writetime": "2016-12-29 17:29:09"//时间
        */
        data: []
      }
    },
    computed: {
    },
    mounted () {
      this.__getOrderList()
    },
    methods: {
      __getOrderList () {
        this.$http.post(api.getOrderList, {size: 5}).then(({data}) => {
          // success
          if (data && data[0]) this.data = data
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
  
 

