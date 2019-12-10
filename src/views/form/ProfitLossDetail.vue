<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content


      
      .form.form-filters

        .ds-button.text-button.blue(@click="back()" style="float: right") 返回上一页
        
        label.item 帐变时间范围 
          el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围")
        
        .buttons(style="margin-left: .9rem")
          .ds-button.primary.large.bold(@click="profitDetail") 搜索

      .table-list(style="padding: .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="data" v-bind:row-class-name="tableRowClassName" style="margin: .2rem 0 0 0")

          el-table-column(class-name="pl2" prop="userName" label="用户名")
            template(scope="scope")
                span {{ scope.row.userName }}
          el-table-column(prop="date" label="日期")
          el-table-column(prop="userPoint" label="返点级别" )
            template(scope="scope")
              span {{ scope.row.userPoint }}
          el-table-column(align="rgiht" prop="salaryAmount" label="工资总额" )
          el-table-column(align="rgiht" prop="saveAmount" label="充值总额" )
          el-table-column(align="rgiht" prop="withdrawAmount" label="提款总额" )
          el-table-column(align="rgiht" prop="buyAmount" label="投注总额" )
          el-table-column(align="rgiht" prop="pointAmount" label="返点总额" )
          el-table-column(align="rgiht" prop="prizeAmount" label="派奖总额" )
          el-table-column(align="rgiht" prop="rewardsAmount" label="活动")
          el-table-column(align="rgiht" prop="profitAmount" label="盈亏结算")
        
</template>

<script>
  import { dateFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  export default {
    data () {
      return {
        me: store.state.user,
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
        userId: '',
        total: []
      }
    },
    watch: {
      '$route': 'openRoute'
    },
    computed: {
    },
    mounted () {
      let {st, et, userId} = this.$route.query
      // if (st) this.stEt[0] = new Date(Number(st))
      // if (et) this.stEt[1] = new Date(Number(et))
      if (st && et) this.stEt = [new Date(Number(st)), new Date(Number(et))]
      if (userId) this.userId = userId
      this.profitDetail()
    },
    methods: {
      summary () {
        let o = {
          last: true,
          userPoint: '合计：',
          userName: '',
          salaryAmount: 0,
          saveAmount: 0,
          withdrawAmount: 0,
          buyAmount: 0,
          pointAmount: 0,
          prizeAmount: 0,
          rewardsAmount: 0,
          profitAmount: 0
        }
        this.data.forEach(d => {
          o.salaryAmount += parseFloat(d.salaryAmount)
          o.saveAmount += parseFloat(d.saveAmount)
          o.withdrawAmount += parseFloat(d.withdrawAmount)
          o.buyAmount += parseFloat(d.buyAmount)
          o.pointAmount += parseFloat(d.pointAmount)
          o.prizeAmount += parseFloat(d.prizeAmount)
          o.rewardsAmount += parseFloat(d.rewardsAmount)
          o.profitAmount += parseFloat(d.profitAmount)
        })
        o.salaryAmount = o.salaryAmount.toFixed(4)
        o.saveAmount = o.saveAmount.toFixed(4)
        o.withdrawAmount = o.withdrawAmount.toFixed(4)
        o.buyAmount = o.buyAmount.toFixed(4)
        o.pointAmount = o.pointAmount.toFixed(4)
        o.prizeAmount = o.prizeAmount.toFixed(4)
        o.rewardsAmount = o.rewardsAmount.toFixed(4)
        o.profitAmount = o.profitAmount.toFixed(4)
        this.data[0] && this.data.push(o)
      },
      back () {
        window.history.back()
      },
      openRoute ({path, query: {st, et, userId}}) {
        // if (st) this.stEt[0] = new Date(Number(st))
        // if (et) this.stEt[1] = new Date(Number(et))
        if (st && et) this.stEt = [new Date(Number(st)), new Date(Number(et))]
        if (userId) this.userId = userId
        this.profitDetail()
      },
      tableRowClassName (row, index) {
        if (row.selected) return 'selected-row'
      },
      setSelected (row) {
        this.$set(row, 'selected', !row.selected)
        // row.selected = !row.selected
      },
      // 盈亏详情列表（按用户和时间范围查询）
      // http://192.168.169.44:9901/cagamesclient/report/profit.do?method=detail&destUserId=2&startDay=20170101&endDay=20170301
      // profitDetail: api + 'report/profit.do?method=detail',
      profitDetail () {
        let loading = this.$loading({
          text: '盈亏报表加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        this.$http.get(api.profitDetail, {
          startDay: dateFormat((window.newDate(this.stEt[0])).getTime()).replace(/[-]/g, ''),
          endDay: dateFormat((window.newDate(this.stEt[1])).getTime()).replace(/[-]/g, ''),
          destUserId: this.userId
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.data = data.allDate
            this.nickName = data.nickName
            this.userPoint = data.userPoint
            // this.total = [data.totalJson]
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
