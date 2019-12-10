<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content

      .form.form-filters
        
        label.item 游戏时间  
          el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")

        label.item 游戏名称 
          el-select(clearable v-bind:disabled=" !gameList[0] "  v-model="gameid" style="width: 1.5rem" placeholder="全")
            el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")

        label.item 用户 
          input.ds-input.small(v-model="name" style="width: 1rem")



        label.item 范围 
            el-select(clearable v-bind:disabled=" !ZONES[0] "  v-model="zone" style="width: 1rem" placeholder="全")
              el-option(v-for="(U, i) in ZONES" v-bind:label="U" v-bind:value="i")


       

        .ds-button.primary.large.bold(@click="Orderlist") 搜索
        //- .buttons(style="margin-left: .3rem")
          //- .ds-button.cancel.large(@click="clear(true)") 清空
      
      .table-list(style="padding: .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="Cdata" ref="table" stripe v-bind:max-height=" MH "  v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected")

          el-table-column(class-name="pl2" prop="serialNumber" label="订单号"  show-overflow-tooltip=true)
            template(scope="scope")
              div
                .text-blue(v-if="!scope.row.last" style="padding: 0" @click=" ") {{ scope.row.serialNumber }}
                span(v-if="scope.row.last" style="padding: 0") {{ scope.row.entry }}

          el-table-column(prop="createTime" label="打赏时间" )
          
          el-table-column(prop="channelName" label="游戏" )

          el-table-column(prop="cost" label="打赏金额")

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
        // st: '',
        // et: '',
        STATUS: ['进行中', '追号完成', '中奖后停止追号', '延迟开奖停止追号'],
        status: '',
        ISFREE: ['现金', '优惠券'],
        isFree: '',
        gameList: [{lotteryId: 1, cnName: 'VR 金星1.5分彩'}, {lotteryId: 2, cnName: 'VR 赛车'}, {lotteryId: 11, cnName: 'VR 3分彩'}, {lotteryId: 12, cnName: 'VR火星5分彩'}, {lotteryId: 13, cnName: 'VR 快艇'}, {lotteryId: 15, cnName: 'VR 百家乐'}, {lotteryId: 16, cnName: 'VR 六合彩'}],
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
        fullCode: '获取失败...',
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
        return this.row.position ? (this.fullCode || this.row.code + '[' + this.row.position + ']') : this.fullCode || this.row.code
      }
      // Cdata () {
      //   // if (this.data.length <= this.pageSize) return this.data
      //   // else {
      //   //   return util.groupArray(this.data.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage), this.pageSize, {_empty: true})[0]
      //   // }
      // }
    },
    watch: {
      show () {
        if (!this.show) this.fullCode = '获取失败...'
      },
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
      // this.getLotterys()
      this.$route.query.gameid && (this.gameid = this.$route.query.gameid)
      this.Orderlist()
    },
    methods: {
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
          this.Orderlist()
        }
      },
      summary () {
        this.amount[0].expectCost = 0
        this.amount[0].expenditure = 0
        this.amount[0].difMoney = 0
        this.Cdata.forEach(d => {
          this.amount[0].expectCost += d.totalAmount
          this.amount[0].expenditure += parseFloat(d.completedAmount)
        })
        this.amount[0].difMoney = -(this.amount[0].expectCost + this.amount[0].expenditure)
        this.amount[0].expectCost = this.amount[0].expectCost.toFixed(3)
        this.amount[0].expenditure = this.amount[0].expenditure.toFixed(3)
        this.amount[0].difMoney = this.amount[0].difMoney.toFixed(3)
        if (!this.amount[0].difMoney.startsWith('-')) this.amount[0].difMoney = '+' + this.amount[0].difMoney

        this.Cdata[0] && this.Cdata.push({
          last: true,
          difMoney: '-' + this.amount[0].expenditure,
          entry: '小结：本页变动金额',
          userName: '本页变动金额',
          times: '',
          title: '',
          lotteryName: '',
          methodName: '',
          issue: '',
          modes: '',
          expectCost: '-' + this.amount[0].expectCost,
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
        cp--
        this.Orderlist(cp, () => {
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
        a && this.Orderlist()
      },
      cancel (force) {
        // if (!force && parseInt(this.row.totalPrice) >= 5000) {
        //   return this.$modal.question({
        //     content: '<div class="text-666" style="text-align: left; line-height: .3rem;text-indent: .15rem">投注注单金额超过 <span class="text-danger">5000</span> 会收取 <span class="text-danger">0.5%</span> 的手续费注，将扣除您<span class="text-danger"> ' + parseFloat(this.row.totalPrice) * 0.005 + ' </span>元手续费， 您确定要撤单吗？</div>',
        //     target: this.$el.parentNode,
        //     O: this,
        //     ok () {
        //       this.cancel(true)
        //     }
        //   })
        // }
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
                this.Orderlist()
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
      Orderlist (page, fn) {
        let loading = this.$loading({
          text: '打赏记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            // projectId: this.id,
            // beginDate: this.st ? dateTimeFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            startTime: this.stEt[0] ? dateTimeFormat(this.stEt[0]).replace(' ', 'T') + 'Z' : '',
            // endDate: this.et ? dateTimeFormat(this.et.getTime()).replace(' ', 'T') + 'Z' : '',
            endTIme: this.stEt[1] ? dateTimeFormat(this.stEt[1]).replace(' ', 'T') + 'Z' : '',
            // stat: this.status,
            // isFree: this.isFree,
            userName: this.name,
            scope: this.zone,
            // lotteryId: this.gameid,
            // methodId: this.method.methodId,
            // issue: this.issue,
            // modes: this.mode !== '' ? this.mode + 1 : '',
            channelId: this.gameid || -1,
            // issueNumber: '',
            // playerName: '',
            // seriaNumber: '',
            // state: -1,
            // isUpdateTime: false,
            recordPage: 0,
            recordCountPerPage: this.pageSize
          }
        } else {
          this.preOptions.recordPage = page
        }
        this.$http.post(api.VRdonate, this.preOptions).then(({data}) => {
          // success
          if (data.donateRecords) {
            data.success = 1
            data.recordList = data.donateRecords
            data.totalSize = data.totalRecords
          }
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 500)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            // data.recordList.forEach(d => {
            //   d.code = '177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755177551775517755'
            // })
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
            this.fullCode = data.code
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
      }
    }
  }
  // 投注列表
  // http://192.168.169.44:9901/cagamesclient/report/buyReport.do?method=list&beginDate=20170101000000&endDate=20170303000000&stat=1&isFree=1&userName=test&scope=1&lotteryId=1&methodId=16&issue=170104071&modes=1
  // Orderlist: api + 'report/buyReport.do?method=list',
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
<style lang="stylus">
  .vtop table td
    padding-top .1rem
    vertical-align top

</style>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .user-list
    // top TH
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
