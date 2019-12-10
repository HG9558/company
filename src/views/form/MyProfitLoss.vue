<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content

      .form

        label.item 时间范围 
          el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")
        
        label.item 范围 
          el-select(clearable v-bind:disabled=" !ZONES[0] "  v-model="zone" style="width: 1rem" placeholder="全")
            el-option(v-for="(U, i) in ZONES" v-bind:label="U" v-bind:value="i")

        label.item 用户名 
          input.ds-input.small(v-model="name" style="width: 1rem")

        .buttons(style="margin-left: .6rem")
          .ds-button.primary.large.bold(@click="profitList()") 搜索
        
      
      .table-list(style="padding: .15rem .2rem ")
        p(style="margin: .3rem 0 .15rem 0")
          el-breadcrumb(separator=">")
            el-breadcrumb-item(v-for="(B, i) in BL" @click.native=" link(B, i) " ) {{ i === 0 ? '自己' : B.userName }}
      
        el-table.header-bold.nopadding(:data="data" @cell-click="cellClick" v-bind:row-class-name="tableRowClassName" style="margin: .2rem 0")

          el-table-column(prop="userName" label="用户名" width="100" v-bind:sortable="true")
            template(scope="scope")
              span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === me.account } ") {{ scope.row.userName }}
  
          el-table-column(prop="userPoint" label="返点级别" width="100" )
          
          el-table-column(prop="salaryAmount" label="工资总额" width="100" )
            template(scope="scope")
              span {{ numberWithCommas(scope.row.salaryAmount) }}

          el-table-column(prop="saveAmount" label="充值总额" width="100" )
            template(scope="scope")
              span {{ numberWithCommas(scope.row.saveAmount) }}

          el-table-column(prop="withdrawAmount" label="提款总额" width="100" )
            template(scope="scope")
              span {{ numberWithCommas(scope.row.withdrawAmount) }}


          el-table-column(prop="buyAmount" label="投注总额" width="100" )
            template(scope="scope")
              span {{ numberWithCommas(scope.row.buyAmount) }}

          el-table-column(prop="pointAmount" label="返点总额" width="100" )


          el-table-column(prop="prizeAmount" label="派奖总额" width="100" )
            template(scope="scope")
              span {{ numberWithCommas(scope.row.prizeAmount) }}

          el-table-column(prop="rewardsAmount" label="活动" width="100")
            template(scope="scope")
              span {{ numberWithCommas(scope.row.rewardsAmount) }}

          el-table-column(prop="profitAmount" label="盈亏结算"  v-bind:sortable="true")
            template(scope="scope")
              span {{ numberWithCommas(scope.row.profitAmount) }}

          // el-table-column(prop="salaryAmount" label="工资总额" width="100" )
          // el-table-column(prop="saveAmount" label="充值总额" width="100" )
          // el-table-column(prop="withdrawAmount" label="提款总额" width="100" )
          // el-table-column(prop="buyAmount" label="投注总额" width="100" )
          // el-table-column(prop="pointAmount" label="返点总额" width="100" )
          // el-table-column(prop="prizeAmount" label="派奖总额" width="100" )
          // el-table-column(prop="rewardsAmount" label="活动" width="100")
          // el-table-column(prop="profitAmount" label="盈亏结算" v-bind:sortable="true")

          // el-table-column(prop="userName" label="用户名" width="100" sortable="true")
          // el-table-column(prop="buy" label="投注总额" width="100" )
          // el-table-column(prop="point" label="返点总额" width="100" )
          // el-table-column(prop="prize" label="中奖总额" width="100" )
          // el-table-column(prop="profit" label="盈亏结算" width="100" )
          // el-table-column(prop="rate" label="中奖率" width="100" )
          
          // el-table-column(prop="userpoint" label="操作" align="center")
            template(scope="scope")
              .ds-button.text-button.blue(v-if="!scope.row.last" style="padding: 0 .05rem" @click.stop="goProfitLossDetail(scope.row.userId)") 明细
      
</template>

<script>
  import { numberWithCommas } from '../../util/Number'
  import { dateFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  export default {
    data () {
      return {
        numberWithCommas: numberWithCommas,
        me: store.state.user,
        clearableOnTime: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        stEt: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date(new Date().getTime())],
        data: [{}],
        BL: [
          {title: '自己'},
          {}
        ],
        ZONES: ['直接下级', '所有下级'],
        zone: '',
        name: ''
      }
    },
    computed: {
    },
    mounted () {
      this.profitList()
    },
    methods: {
      cellClick (row, column, cell, event) {
        if (column.property === 'userName') {
          // this.BL.push({
          //   id: row.userId,
          //   title: row.userName
          // })
          this.profitList(row.userId)
        }
      },
      link (B, i) {
        // if (i !== B.length - 1) {
          // this.BL = this.BL.slice(0, i + 1)
          // this.profitList()
        // }
        this.profitList(B.userId)
      },
      summary () {
        let s = {
          last: true,
          userPoint: '小结：',
          salaryAmount: 0,
          saveAmount: 0,
          withdrawAmount: 0,
          buyAmount: 0,
          pointAmount: 0,
          prizeAmount: 0,
          profitAmount: 0
        }
        this.data.forEach(d => {
          s.salaryAmount += parseFloat(d.salaryAmount) || 0
          s.saveAmount += parseFloat(d.saveAmount) || 0
          s.withdrawAmount += parseFloat(d.withdrawAmount) || 0
          s.buyAmount += parseFloat(d.buyAmount) || 0
          s.pointAmount += parseFloat(d.pointAmount) || 0
          s.prizeAmount += parseFloat(d.prizeAmount) || 0
          s.profitAmount += parseFloat(d.profitAmount) || 0
        })
        this.data[0] && this.data.push(s)
      },
      // 盈亏报表列表
      // http://192.168.169.44:9901/cagamesclient/report/profit.do?method=list&startDay=20170101&endDay=20170301
      // profitList: api + 'report/profit.do?method=list',
      // api.getTeamProfit
      profitList (id) {
        let loading = this.$loading({
          text: '盈亏报表加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        this.$http.get(api.personList, {
          startDay: dateFormat((window.newDate(this.stEt[0])).getTime()).replace(/[-]/g, ''),
          endDay: dateFormat((window.newDate(this.stEt[1])).getTime()).replace(/[-]/g, ''),
          userId: id || this.BL[this.BL.length - 2].userId,
          parentId: !id && this.zone !== '' ? this.zone + 1 : '',
          userName: id ? '' : this.name
          // userId: id || ''
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.data = data.allDate
            this.BL = (data.userBreads).concat([{}])
            // this.data = data.subUserProfit
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
            this.summary()
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      goProfitLossDetail (userId) {
        this.$router.push({
          path: '/form/4-5-4',
          query: {
            st: (window.newDate(this.stEt[0])).getTime(),
            et: (window.newDate(this.stEt[1])).getTime(),
            userId: userId
          }
        })
      },
      tableRowClassName (row) {
        if (this.me.account === row.userName) return 'text-danger'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .stock-list
    top TH
    .form
      padding PWX

  .item
    display inline-block
    margin 0 PW .1rem 0

    
  .el-select
  .el-input-number
    width 1rem

</style>
