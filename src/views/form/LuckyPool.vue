<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content

      .form.form-filters
        label.item 参与时间 
          el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")


        label.item 状态 
          el-select(clearable v-bind:disabled=" !STATUS[0] "  v-model="status" style="width: .8rem" placeholder="全")
            el-option(v-for="(S, i) in STATUS" v-bind:label="S" v-bind:value="i")

        label.item 奖期 
          el-autocomplete.inline-input(v-model=" issue " v-bind:fetch-suggestions=" getIssueList " placeholder="奖池期号" style="width: .8rem;")




        .buttons(style="margin-left: .6rem")
          .ds-button.primary.large.bold(@click="poolList") 搜索
          .ds-button.cancel.large(@click="clear(true)") 清空
      
      .table-list(style="padding: .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="Cdata" show-summary v-bind:summary-method="getSummaries" stripe v-bind:max-height=" MH "  v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected")


          el-table-column(class-name="pl2" prop="userName" label="用户")
          
          el-table-column(prop="writeTime" label="参与时间")
            template(scope="scope")
              span(v-if="!scope.row.last") {{ scope.row.writeTime }}
              span.text-blue(v-if="scope.row.last") {{ scope.row.difMoney }}

          el-table-column(prop="projectId" label="注单编号" )
            template(scope="scope")
              div
                span(v-if="!scope.row.last" style="padding: 0") {{ scope.row.projectId }}
                span(v-if="scope.row.last" style="padding: 0") {{ scope.row.entry }}
          

          el-table-column(class-name="pl2" prop="poolCode" label="奖池号" align="center")


          el-table-column(prop="poolIssue" label="奖池期号")


          el-table-column(prop="poolTotalPrice" label="参与金额" align="right")

          el-table-column(class-name="pr2" prop="poolBonus" label="奖金" align="right")


          el-table-column(class-name="pl2" prop="prizeCode" label="奖池开奖号" align="center")

         
          el-table-column(label="状态")
            template(scope="scope")
              span(:class=" STATUSCLASS[scope.row.stat] ") {{ STATUS[scope.row.stat] }}

        

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

      



      
</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import { digitUppercase } from '../../util/Number'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  // import util from '../../util'
  export default {
    mixins: [setTableMaxHeight],
    data () {
      return {
        ACCOUNT: store.state.user.account,
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
        // stEt: [dateTimeFormat(new Date().getTime() - 3600 * 1000 * 24 * 7), dateTimeFormat(new Date().getTime())],
        defaultStEt: ['', ''],
        stEt: ['', ''],
        STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
        STATUSCLASS: ['text-green', 'text-danger', 'text-grey', 'text-orange'],
        // STATUS: ['未开奖', '已中奖', '未中奖'],
        status: '',
        ISFREE: ['现金', '信游币'],
        isFree: '',
        gameList: [],
        gameid: '',
        methodList: [],
        method: '',
        issueList: [],
        issue: '',
        // MODES: ['元', '角', '分', '厘'],
        MODES: ['2元', '2角', '2分', '2厘', '1元'],
        mode: '',
        id: '',
        name: '',
        ZONES: ['自己', '直接下级', '所有下级'],
        zone: '',
        data: [{}],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        // modal
        show: false,
        type: 0,
        row: {prizeCode: ''},
        modalTitles: ['投注详情', '发起跟单', '撤销'],
        expandList: [],
        amount: [{income: 0, expenditure: 0, difMoney: 0}],
        Cdata: []
      }
    },
    computed: {
      textMoney () {
        return digitUppercase(this.money)
      },
      codePosition () {
        return this.row.position ? (this.row.code + '[' + this.row.position + ']') : this.row.code
      }
      // Cdata () {
      //   // if (this.data.length <= this.pageSize) return this.data
      //   // else {
      //   //   return util.groupArray(this.data.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage), this.pageSize, {_empty: true})[0]
      //   // }
      // }
    },
    watch: {
      '$route': 'openRoute',
      gameid () {
        this.getMethods()
        this.getRecentIssueList()
      },
      stEt: {
        deep: true,
        handler () {
          if (!this.stEt[0] && !this.stEt[1]) this.stEt = this.defaultStEt
          if ((window.newDate(this.stEt[0])).getTime() === (window.newDate(this.stEt[1])).getTime()) {
            this.stEt[1] = new Date((window.newDate(this.stEt[1])).getTime() + 3600 * 1000 * 24 - 1000)
          }
        }
      }
    },
    mounted () {
      this.poolIssue()
      // this.$route.query.gameid && (this.gameid = this.$route.query.gameid)
      this.poolList()
    },
    methods: {
      // poolIssue: '/report/buyReport.do?method=poolIssue',
      // poolList: '/report/buyReport.do?method=poolList&beginDate=20171011000000&endDate=20171014000000&issue=201701&stat=0',
      callPrint (row) {
        this.__setCall({
          fn: '__print',
          args: {
            // '注单编号': row.projectId,
            // '用户': row.userName,
            '投注时间': row.writeTime,
            '游戏': row.lotteryName,
            '玩法': row.methodName,
            '期号': row.issue,
            // '投注内容': row.code,
            // '投注位置': row.position,
            '投注内容': row.code + (row.position ? '[' + row.position + ']' : ''),
            // '倍数': row.multiple,
            // '模式': row.modes,
            '总金额': row.totalPrice + '元'
            // '奖金': row.bonus,
            // '开奖号码': row.prizeCode
          },
          callId: undefined
        })
      },
      openRoute ({path, query: {gameid}}) {
        if (path !== '/form/4-1-1') return false
        if (gameid && gameid !== this.gameid) {
          this.gameid = gameid
          this.poolList()
        }
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
          if (values.every(value => !isNaN(value)) && index !== 3 && index !== 4 && index !== 7) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            // sums[index] += ' 元'
            sums[index] = (index === 5 ? '+' : '-') + sums[index].toFixed(4)
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      summary () {
        this.amount[0].income = 0
        this.amount[0].expenditure = 0
        this.amount[0].difMoney = 0
        this.Cdata.forEach(d => {
          this.amount[0].income += d.poolBonus
          this.amount[0].expenditure += parseFloat(1)
        })
        this.amount[0].difMoney = this.amount[0].income - this.amount[0].expenditure
        this.amount[0].income = this.amount[0].income.toFixed(3)
        this.amount[0].expenditure = this.amount[0].expenditure.toFixed(3)
        this.amount[0].difMoney = this.amount[0].difMoney.toFixed(3)
        if (!this.amount[0].difMoney.startsWith('-')) this.amount[0].difMoney = '+' + this.amount[0].difMoney

        this.Cdata[0] && this.Cdata.push({
          last: true,
          difMoney: this.amount[0].difMoney,
          userName: '小结：',
          writeTime: '本页变动金额',
          times: '',
          title: '',
          lotteryName: '',
          methodName: '',
          issue: '',
          modes: '',
          income: '+' + this.amount[0].income,
          expenditure: '-' + this.amount[0].expenditure,
          balance: ''
        })
      },
      goFollowDetail (id) {
        this.$router.push({
          path: '/form/4-2-2',
          query: {
            id: id
          }
        })
      },
      tableRowClassName (row, index) {
        if (row.selected) return 'selected-row'
      },
      setSelected (row) {
        this.$set(row, 'selected', !row.selected)
        // row.selected = !row.selected
      },
      pageChanged (cp) {
        this.poolList(cp, () => {
          this.currentPage = cp
        })
      },
      clear (a) {
        // this.st = ''
        // this.et = ''
        this.stEt = this.defaultStEt
        this.status = ''
        this.isFree = ''
        this.gameid = ''
        this.method = {}
        this.issue = ''
        this.mode = ''
        this.id = ''
        this.name = ''
        this.zone = ''
        a && this.poolList()
      },
      cancel () {
        let loading = this.$loading({
          text: '撤单中...',
          target: this.$el
        }, 10000, '撤单超时...')
        this.$http.get(api.cancel, {id: this.row.projectId}).then(({data}) => {
          // success
          if (data.success === 1) {
            this.show = false
            setTimeout(() => {
              loading.text = '撤单成功!'
              setTimeout(() => {
                this.poolList()
                this.__setCall({fn: '__getUserFund', callId: undefined})
              }, 500)
            }, 500)
          } else loading.text = '撤单失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      // poolIssue: '/report/buyReport.do?method=poolIssue',
      // poolList: '/report/buyReport.do?method=poolList&beginDate=20171011000000&endDate=20171014000000&issue=201701&stat=0',
      poolList (page, fn) {
        let loading = this.$loading({
          text: '奖池记录加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            projectId: this.id,
            // beginDate: this.st ? dateTimeFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            beginDate: this.stEt[0] ? dateTimeFormat(this.stEt[0]).replace(/[\s:-]*/g, '') : '',
            // endDate: this.et ? dateTimeFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            endDate: this.stEt[1] ? dateTimeFormat(this.stEt[1]).replace(/[\s:-]*/g, '') : '',
            stat: this.status,
            // isFree: this.isFree,
            userName: this.name,
            // scope: this.zone,
            // lotteryId: this.gameid,
            // methodId: this.method.methodId,
            issue: this.issue,
            // modes: this.mode !== '' ? this.mode + 1 : '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.poolList, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 500)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.Cdata = data.recordList
            this.total = data.totalSize || this.data.length
            // this.summary()
          } else loading.text = data.msg || '加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      // 根据投注号Id查询投注详情
      // http://192.168.169.44:9901/cagamesclient/report/buyReport.do?method=list&projectId=2290
      OrderDetail (row, type) {
        this.show = true
        this.type = type
        this.row = row
        let loading = this.$loading({
          text: '详情加载中...',
          target: this.$refs.box
        }, 10000, '详情加载超时...')
        this.$http.get(api.OrderDetail, {projectId: this.row.projectId}).then(({data}) => {
          // success
          if (data.success === 1) {
            // this.show = false
            this.expandList = data.expandList
            row.userPoint = data.userPoint
            row.poolIssue = data.poolIssue
            row.poolCode = data.poolCode
            row.poolBonus = data.poolBonus
            row.poolIsGetPrize = data.poolIsGetPrize
            setTimeout(() => {
              loading.text = '详情加载成功!'
            }, 500)
          } else loading.text = '详情加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      // poolIssue: '/report/buyReport.do?method=poolIssue',
      poolIssue () {
        this.$http.get(api.poolIssue).then(({data}) => {
          // success
          if (data.success === 1) {
            let X = []
            data.issueList.forEach(x => X.push({value: x}))
            this.issueList = X
          } else {
            this.issueList = []
            this.issue = ''
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
      getIssueList (s, cb) {
        cb(this.issueList.filter(issue => issue.value.indexOf(s) !== -1))
      },
      getRecentIssueList () {
        this.$http.get(api.getRecentIssueList, {lotteryId: this.gameid, issCount: 30}).then(({data}) => {
          // success
          if (data.success === 1) {
            let X = []
            data.issueList.forEach(x => X.push({value: x}))
            console.log(X)
            this.issueList = X
          } else {
            this.issueList = []
            this.issue = ''
          }
        }, (rep) => {
          // error
        })
      }
    }
  }
  // 投注列表
  // http://192.168.169.44:9901/cagamesclient/report/buyReport.do?method=list&beginDate=20170101000000&endDate=20170303000000&stat=1&isFree=1&userName=test&scope=1&lotteryId=1&methodId=16&issue=170104071&modes=1
  // poolList: api + 'report/buyReport.do?method=list',
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
  // http://192.168.169.44:9901/cagamesclient/report/OrderReport.do?method=poolIssue
  // poolIssue: api + 'report/OrderReport.do?method=poolIssue',
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

    
  .el-select
  .el-input-number
    width 1.2rem
  .el-select
    position relative
    top .01rem

</style>

<style lang="stylus" scoped>

  @import '../../var.stylus'

  bg = #d8d8d8
  bg-hover = #ececec
  bg-active = #e2e2e2
  .tool-bar
    height TH
    line-height TH 
    background-color bg
    font-size .12rem
    border-top-right-radius .05rem
    border-top-left-radius .05rem
    overflow hidden
    background-position .2rem center

  .title
    color #333
    font-weight bold
    padding-left .2rem

  .el-button-group
    float right
    height 100%
    .el-button
      font-size .12rem
      color GREY
      border none
      height 100%
      width TH
      padding 0
      background-color transparent
      &:hover
        background-color bg-hover
      &:active
        background-color bg-active
      &:first-child
        font-size .16rem
      &.close
        &:hover
          background-color #f34
          color #fff
        &:active
          color #fff
          background-color #d40c1d

  .modal 
    position absolute
    top TH
    bottom 0
    left 0
    right 0
    text-align center
    z-index 9999
    
    .mask
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      opacity .5
      background #000
      z-index 9998
    .box-wrapper
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      text-align center
      z-index 9999
      &:after
        content ''
        height 100%
        width 0
        vertical-align middle
        display inline-block
    .box
      position relative
      text-align left
      display inline-block
      vertical-align middle
      background-color #ededed
      font-size .12rem
      width 9rem
      radius()
    .content
      margin 0 .2rem
      .el-row
        margin PW 0
        word-wrap break-word
      .textarea-label
        position relative
        margin .3rem .3rem .3rem 0
        .label
          position absolute
          left 0
          top .05rem
        .el-textarea
          display inline-bock
          vertical-align top
          padding-left .6rem 
          .textarea
            font-size .12rem

</style>
