<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content
      div(v-if=" I === 0 ")
        
        .form.form-filters
          
          label.item 类型 
            el-select(clearable multiple placeholder="全" v-model="type" v-bind:style="multipleSelectStyle" v-bind:multiple-limit="typeMax")
              el-option(v-for="(S, i) in TYPES" v-bind:label="S.cnTitle" v-bind:value="S.ordertypeId")

          label.item 时间 
            el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime" @change="detectDate")

          
          label.item 资金 
            el-select(clearable placeholder="全" v-model="isFree" style="width: .8rem")
              el-option(v-for="(S, i) in ISFREE" v-bind:label="S" v-bind:value="i")

          label.item(v-if=" !noname ") 用户 
            input.ds-input.small(v-model="name" style="width: 1rem")
          
          .item
            el-select(clearable  v-model="query" style="width: 1rem; margin-right: .1rem" placeholder="编号查询")
              el-option(v-for="(U, i) in QUERYS" v-bind:label="U" v-bind:value="i")
            el-input(v-model="id" style="width: 1rem")
          
          label.item 游戏 
            el-select(clearable placeholder="全" v-model="gameid" style="width: 1.2rem; ")
              el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")


         
          

          .buttons(style="margin-left: .3rem")
            .ds-button.primary.large.bold(@click="list") 搜索
            .ds-button.cancel.large(@click="clear(true)") 清空
            .ds-button.cancel.large(@click=" hideNumber = !hideNumber ") {{ hideNumber ? '显示' : '隐藏' }}小数
            label.item(style="margin-left: .32rem") 自身快捷查询：
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myTopup") 充值
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myWithdraw") 提现
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myOrder") 投注
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myFollow") 追号
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myBonus") 奖金
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myPoint") 返点
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="mySalary" v-if="ME.showSalary") 工资
              span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myTransfer") 转账
        
        .table-list(style="padding: .15rem .2rem ")
        
          el-table.header-bold.nopadding(:data="data"  style=""   ref="table" stripe show-summary v-bind:summary-method="getSummaries" v-bind:max-height=" MH " v-bind:row-class-name="tableRowClassName"  v-on:row-click="setSelected")

            el-table-column(class-name="pl2" prop="entry" label="帐变编号"  )
              template(scope="scope")
                div
                  .text-blue(v-if="!scope.row.last" style="padding: 0") {{ scope.row.entry }}
                  span(v-if="scope.row.last" style="padding: 0") {{ scope.row.entry }}


            el-table-column(prop="userName" label="用户名" )
              template(scope="scope")
                span(v-if="!scope.row.last") {{ scope.row.userName }}
                span.text-blue(v-if="scope.row.last") {{ scope.row.difMoney }}
            
            el-table-column(prop="times" label="时间" min-width="120")

            el-table-column(prop="orderType" label="类型"  )

            el-table-column(prop="lotteryName" label="游戏"  )

            el-table-column(prop="issue" label="期号"  )

            el-table-column(prop="inout" label="收支"  align="right")
              template(scope="scope")
                span(:class=" {'text-green': parseFloat(scope.row.inout) > 0, 'text-danger': parseFloat(scope.row.inout) < 0} ") {{  parseFloat(scope.row.inout) > 0 ? '+' : '' }}{{ numberWithCommas(scope.row.inout) }}


            el-table-column(prop="balance" label="主账户余额"  align="right")
              template(scope="scope")
                span {{ numberWithCommas(scope.row.balance) }}
            
            el-table-column(prop="speBalance"  label="特殊余额"  align="right")
              template(scope="scope")
                span {{ numberWithCommas(scope.row.speBalance) }}

            //- el-table-column(prop="isFree"  label="优惠券"  align="right")
              template(scope="scope")
                span{{ numberWithCommas(scope.row.speBalance) }}


            el-table-column(label="备注" align="center")
              template(scope="scope")
                span {{ ISFREE[scope.row.isFree] }}


          el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

      LoadRecord.scroll-content(v-if=" I === 1 ")
      WithdrawRecord.scroll-content(v-if=" I === 2 ")
      TransferRecord.scroll-content(v-if=" I === 3 ")
      
</template>

<script>
  // import LoadRecord from './LoadRecord'
  // import WithdrawRecord from './WithdrawRecord'
  import TransferRecord from '../me/BGTransaction'
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import { digitUppercase, numberWithCommas } from '../../util/Number'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  export default {
    mixins: [setTableMaxHeight],
    components: {
      TransferRecord
    },
    data () {
      return {
        ME: store.state.user,
        numberWithCommas: numberWithCommas,
        clearableOnTime: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        defaultStEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        stEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        ISFREE: ['现金', '信游币', '积分'],
        isFree: '',
        gameList: [],
        gameid: '',
        methodList: [],
        method: '',
        issueList: [],
        issue: '',
        MODES: ['2元', '2角', '2分', '2厘', '1元'],
        mode: '',
        TYPES: '',
        multipleSelectStyle: {minWidth: '1rem'},
        typeMax: 5,
        type: [],
        preTypeLength: 0,
        id: '',
        name: '',
        ZONES: ['自己', '直接下级', '所有下级'],
        zone: '',
        QUERYS: ['注单编号', '追号编号', '帐变编号'],
        query: '',
        data: [{}],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        amount: [{income: 0, expenditure: 0, difMoney: 0}],
        hideNumber: false,
        I: 0
      }
    },
    computed: {
      textMoney () {
        return digitUppercase(this.money)
      }
      // Cdata () {
      //   if (this.data.length <= this.pageSize) return this.data
      //   else {
      //     return util.groupArray(this.data.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage), this.pageSize, {_empty: true})[0]
      //   }
      // }
    },
    watch: {
      hideNumber () {
        this.data.forEach(x => {
          if (this.hideNumber) {
            x.inout = (x.copyinout = (x.inout || '0')).split('.')[0]
            x.balance = (x.copybalance = (x.balance || '0')).split('.')[0]
            x.speBalance = (x.copyspeBalance = (x.speBalance || '0')).split('.')[0]
            x.isFree = (x.copyisFree = (x.isFree || '0')).split('.')[0]
          } else {
            x.inout = x.copyinout
            x.balance = x.copybalance
            x.speBalance = x.copyspeBalance
            x.isFree = x.copyisFree
          }
        })
      },
      type (o, n) {
        // this.preTypeLength = o.length
        this.preTypeLength > n.length ? setTimeout(() => {
          this.multipleSelectStyle = {
            minWidth: '1rem',
            height: '.3rem',
            width: this.type.length + 0.3 + 'rem'
          }
        }, 300) : this.multipleSelectStyle = {
          minWidth: '1rem',
          height: '.3rem',
          width: this.type.length + 0.3 + 'rem'
        }
        this.preTypeLength = n.length
      },
      gameid (o, n) {
        this.getMethods()
        this.getRecentIssueList()
      }
    },
    mounted () {
      this.getLotterys()
      this.getOrderType()
      this.list()
      if (this.platform === 'ds') {
        this.ISFREE.splice(2)
      }
    },
    methods: {
      __setCRI (i) {
        this.I = i
      },
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (index === 6) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = (sums[index] > 0 ? '+' : '') + numberWithCommas(sums[index].toFixed(this.hideNumber ? 0 : 6))
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      detectDate (v) {
        // console.log(v)
      },
      myTopup () {
        this.clear()
        this.zone = 0
        this.type = [1]
        this.list()
      },
      myWithdraw () {
        this.clear()
        this.zone = 0
        this.type = [2, 3]
        this.list()
      },
      myOrder () {
        this.clear()
        this.zone = 0
        this.type = [7]
        this.list()
      },
      myFollow () {
        this.clear()
        this.zone = 0
        this.type = [9]
        this.list()
      },
      myBonus () {
        this.clear()
        this.zone = 0
        this.type = [12, 16]
        this.list()
      },
      myPoint () {
        this.clear()
        this.zone = 0
        this.type = [11, 15]
        this.list()
      },
      mySalary () {
        this.clear()
        this.zone = 0
        this.type = [37]
        this.list()
      },
      myTransfer () {
        this.clear()
        this.zone = 0
        this.type = [70]
        this.list()
      },
      tableRowClassName (row, index) {
        if (row.selected) return 'selected-row'
      },
      setSelected (row) {
        this.$set(row, 'selected', !row.selected)
        // row.selected = !row.selected
      },
      pageChanged (cp) {
        this.list(cp, () => {
          this.currentPage = cp
        })
      },
      clear (a) {
        this.stEt = this.defaultStEt
        this.isFree = ''
        this.game = {}
        this.method = {}
        this.issue = ''
        this.mode = ''
        this.id = ''
        this.name = ''
        this.zone = ''
        this.type = []
        this.query = ''
        a && this.list()
      },
      cancel () {
        let loading = this.$loading({
          text: '撤单中...',
          target: this.$el
        }, 10000, '撤单超时...')
        this.$http.get(api.cancel, {id: this.row.projectId}).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '撤单成功!'
            }, 100)
          } else loading.text = '撤单失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      list (page, fn) {
        // console.log(this.stEt[0], this.stEt[1], dateTimeFormat(this.stEt[0]).replace(/[-:\s]/g, ''), dateTimeFormat(this.stEt[1]).replace(/[-:\s]/g, ''))
        let loading = this.$loading({
          text: '帐变记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        // OrderReport.do?method=list&orderId=7&beginDate=20170201000000&endDate=20170303000000&isFree=1&userName=test&scope=1&serialType=2&serialValue=3397&lotteryId=1&methodId=37&issueId=1111&modes=11&page=1&pageSize=20
        if (!fn) {
          this.preOptions = {
            orderId: this.type.join(','),
            beginDate: dateTimeFormat(this.stEt[0]).replace(/[-:\s]/g, ''),
            endDate: dateTimeFormat(this.stEt[1]).replace(/[-:\s]/g, ''),
            isFree: this.isFree,
            userName: this.name,
            scope: this.noname ? 0 : this.zone,
            serialType: this.query,
            serialValue: this.id,
            lotteryId: this.gameid,
            methodId: this.method.methodId,
            issueId: this.issue,
            modes: this.mode !== '' ? this.mode + 1 : '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.list, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.orderRecordList
            // this.data.forEach(x => (x.inout = parseFloat(x.inout) * -1))
            this.total = data.totalSize || this.data.length
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          } else loading.text = data.msg || '加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      getLotterys () {
        this.$http.get(api.getLotterys).then(({data}) => {
          // success
          if (data.success === 1) {
            this.gameList = data.lotteryList
          }
        }, (rep) => {
          // error
        })
      },
      getMethods () {
        this.$http.get(api.getMethods, {lotteryId: this.gameid}).then(({data}) => {
          // success
          if (data.success === 1) {
            this.methodList = data.methodList
          } else {
            this.methodList = []
            this.method = {}
          }
        }, (rep) => {
          // error
        })
      },
      getRecentIssueList () {
        this.$http.get(api.getRecentIssueList, {lotteryId: this.gameid, issCount: 30}).then(({data}) => {
          // success
          if (data.success === 1) {
            this.issueList = data.issueList
          } else {
            this.issueList = []
            this.issue = ''
          }
        }, (rep) => {
          // error
        })
      },
      getOrderType () {
        this.$http.get(api.getOrderType).then(({data}) => {
          // success
          if (data.success === 1) {
            this.TYPES = data.orderTypeList
          }
        }, (rep) => {
          // error
        })
      }
    }
  }
  // 投注列表
  // http://192.168.169.44:9901/cagamesclient/report/buyReport.do?method=list&beginDate=20170101000000&endDate=20170303000000&stat=1&isFree=1&userName=test&scope=1&lotteryId=1&methodId=16&issue=170104071&modes=1
  // list: api + 'report/buyReport.do?method=list',
  // 根据投注号Id查询投注详情
  // http://192.168.169.44:9901/cagamesclient/report/buyReport.do?method=detail&projectId=2290
  // OrderDetail: api + 'report/buyReport.do?method=list',
  // 撤单
  // http://192.168.169.44:9901/cagamesclient/booking.do?method=cancel&id=1304
  // cancel: api + '/booking.do?method=cancel',
  // 获取玩法
  // http://192.168.169.44:9901/cagamesclient/report/OrderReport.do?method=getMethods&lotteryId=1
  // getMethods: api + 'report/OrderReport.do?method=getMethods',
  // 获取期号
  // http://192.168.169.44:9901/cagamesclient/issue.do?method=getRecentIssueList&lotteryId=1&issCount=10
  // getRecentIssueList: api + 'issue.do?method=getRecentIssueList'
  // 获取彩种列表
  // http://192.168.169.44:9901/cagamesclient/report/OrderReport.do?method=getLotterys
  // getLotterys: api + 'report/OrderReport.do?method=getLotterys',
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .user-list
    top TH
    .form
      padding PWX

  .item
    display inline-block
    margin 0 PW .1rem 0
  .block
    display block
    
  .el-select
  .el-input-number
    width 1.2rem
  .el-select
    position relative
    top .01rem

</style>
