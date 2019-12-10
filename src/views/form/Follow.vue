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
          
          label.item 用户 
            input.ds-input.small(v-model="name" style="width: 1rem")
          
          label.item 追号时间 
            el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")

          label.item 游戏 
            el-select(clearable v-bind:disabled=" !gameList[0] " placeholder="全" v-model="gameid" style="width: 1.2rem")
              el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")

          label.item 奖期 
            el-autocomplete.inline-input(v-model=" issue " v-bind:fetch-suggestions=" getIssueList " placeholder="请输入奖期号" style="width: 1.2rem;")



          label.item 追号编号 
            el-input(v-model="id" style="width: 1rem")


          .ds-button.primary.large.bold(@click="followList()") 搜索
          //- .buttons(style="margin-left: .3rem")
            .ds-button.cancel.large(@click="clear(true)") 清空
        
        .table-list(style="padding: .15rem .2rem ")
        
          el-table.header-bold.nopadding(:data="Cdata"  style=""   ref="table" show-summary v-bind:summary-method="getSummaries" v-bind:max-height=" MH " stripe v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" )

            el-table-column(label="追号编号" class-name="pl2")
              template(scope="scope")
                div
                  span( style="padding: 0") {{ scope.row.taskId }}

            el-table-column(prop="userName" label="用户")
            
            el-table-column(prop="beginTime" label="追号时间"  min-width="120")
              template(scope="scope")
                span() {{ scope.row.beginTime }}

            el-table-column(prop="lotteryName" label="游戏" )

            el-table-column(prop="methodName" label="玩法"  min-width="120")
              template(scope="scope")
                div() {{ scope.row.methodName }}（{{ scope.row.codeType === 1 ? '复式' : '单式'}}）

            el-table-column(prop="beginIssue" label="开始期数" )

            el-table-column(class-name="pl2" prop="issuecount" label="总期数")

            el-table-column(prop="finishedcount" label="完成期数")

            el-table-column(class-name="pl1" prop="modes" label="模式" )
              template(scope="scope")
                span {{ MODES[scope.row.modes - 1] }}            

            el-table-column(prop="taskprice" label="总金额" align="right")
              template(scope="scope")
                span.text-danger() -{{ numberWithCommas(scope.row.taskprice) }}


            el-table-column(class-name="pl2"   label="状态" align="center")
              template(scope="scope")
                span(:class=" STATUSCLASS[scope.row.status] ") {{ STATUS[scope.row.status] }}

            el-table-column(label="操作")
              template(scope="scope")

                div()

                  .ds-button.text-button.blue(v-if="scope.row.taskId !== '0' " style="padding: 0 .05rem" @click.stop=" showFollow = scope.row.taskId") 追号详情


          el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")
      
       VRFollow.scroll-content(v-if=" I === 1 ")


    .modal(v-show="showFollow" )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 10rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 追号详情
            el-button-group
              el-button.close(icon="close" @click="showFollow = ''")
          Follow.followDetail-page(v-bind:id=" showFollow " style="min-height: 5.7rem")



</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import Follow from './FollowDetail'
  import VRFollow from './VRFollow'
  import { digitUppercase, numberWithCommas } from '../../util/Number'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  // import util from '../../util'
  export default {
    components: {
      Follow,
      VRFollow
    },
    mixins: [setTableMaxHeight],
    data () {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
          // {
          //   text: '最近一个月',
          //   onClick (picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          //     picker.$emit('pick', [start, end])
          //   }
          // }, {
          //   text: '最近三个月',
          //   onClick (picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          //     picker.$emit('pick', [start, end])
          //   }
          // }
          ],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        defaultStEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        stEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        STATUS: ['进行中', '已取消', '已完成'],
        STATUSCLASS: ['text-danger', 'text-grey', 'text-green'],
        status: '',
        ISFREE: ['现金', '优惠券'],
        isFree: '',
        gameList: [],
        gameid: '',
        methodList: [],
        method: '',
        issueList: [],
        issue: '',
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
        row: {},
        modalTitles: ['投注详情', '发起跟单', '撤销'],
        // 用户级别
        UL: [
          {id: 1, title: '代理用户'},
          {id: 2, title: '会员用户'}
        ],
        u: {},
        user: {name: 'it001', game: '美国时时彩'},
        amount: [{}],
        Cdata: [],
        showFollow: '',
        numberWithCommas: numberWithCommas,
        I: 0
      }
    },
    computed: {
      textMoney () {
        return digitUppercase(this.money)
      }
    },
    watch: {
      '$route': 'openRoute',
      gameid () {
        this.getMethods()
        this.getRecentIssueList()
      },
      I () {
        if (this.I === 0) {
          setTimeout(this.getData)
        }
      }
    },
    mounted () {
      this.getLotterys()
      this.$route.query.gameid && (this.gameid = this.$route.query.gameid)
      this.followList()
    },
    methods: {
      __setGFI (i) {
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
          if (index === 9) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            // sums[index] += ' 元'
            sums[index] = numberWithCommas('-' + sums[index].toFixed(4))
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      openRoute ({path, query: {gameid}}) {
        if (path !== '/form/4-2-1') return false
        if (gameid && gameid !== this.gameid) {
          this.gameid = gameid
          this.followList()
        }
      },
      summary () {
        this.amount[0].income = 0
        this.amount[0].expectCost = 0
        this.amount[0].expenditure = 0
        this.amount[0].difMoney = 0
        this.Cdata.forEach(d => {
          this.amount[0].expectCost += parseFloat(d.taskprice)
          // this.amount[0].expenditure += parseFloat(d.finishprice)
        })
        this.amount[0].difMoney = this.amount[0].income - this.amount[0].expenditure
        this.amount[0].income = this.amount[0].income.toFixed(3)
        // this.amount[0].expenditure = this.amount[0].expenditure.toFixed(3)
        this.amount[0].difMoney = this.amount[0].difMoney.toFixed(3)
        if (!this.amount[0].difMoney.startsWith('-')) this.amount[0].difMoney = '+' + this.amount[0].difMoney
        this.Cdata[0] && this.Cdata.push({
          last: true,
          difMoney: this.amount[0].difMoney,
          entry: '小结：',
          userName: '本页变动金额',
          times: '',
          title: '',
          lotteryName: '',
          methodName: '',
          issue: '',
          modes: '',
          income: '+' + this.amount[0].income,
          expectCost: '-' + this.amount[0].expectCost,
          expenditure: '-' + this.amount[0].expectCost,
          balance: ''
        })
      },
      tableRowClassName (row, index) {
        if (row.selected) return 'selected-row'
      },
      setSelected (row) {
        this.$set(row, 'selected', !row.selected)
        // row.selected = !row.selected
      },
      goFollowDetail (id) {
        this.$router.push({
          path: '/form/4-2-2',
          query: {
            id: id
          }
        })
      },
      pageChanged (cp) {
        this.followList(cp, () => {
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
        a && this.followList()
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
      followList (page, fn) {
        let loading = this.$loading({
          text: '追号记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            projectId: this.id,
            // beginDate: this.st ? dateTimeFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            // endDate: this.et ? dateTimeFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            // beginDate: this.st ? dateTimeFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            beginDate: this.stEt[0] ? dateTimeFormat(this.stEt[0]).replace(/[\s:-]*/g, '') : '',
            // endDate: this.et ? dateTimeFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            endDate: this.stEt[1] ? dateTimeFormat(this.stEt[1]).replace(/[\s:-]*/g, '') : '',
            // stat: this.status,
            isFree: this.isFree,
            userName: this.name,
            scope: this.zone,
            lotteryId: this.gameid,
            methodId: this.method.methodId,
            issue: this.issue,
            modes: this.mode !== '' ? this.mode + 1 : '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.followList, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
            typeof fn === 'function' && fn()
            if (!fn) this.currentPage = 1
            this.Cdata = data.taskList
            this.total = data.totalSize || this.data.length
            // this.summary()
          } else loading.text = '加载失败!'
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
      getIssueList (s, cb) {
        cb(this.issueList.filter(issue => issue.issue.indexOf(s) !== -1))
      },
      getRecentIssueList () {
        this.$http.get(api.getRecentIssueList, {lotteryId: this.gameid, issCount: 30}).then(({data}) => {
          // success
          if (data.success === 1) {
            data.issueList.forEach(x => (x.value = x.issue))
            this.issueList = data.issueList
          } else {
            this.issueList = []
            this.issue = ''
          }
        }, (rep) => {
          // error
        })
      }
      // 追号列表
      // http://192.168.169.44:9901/cagamesclient/report/taskBuy.do?method=list&beginDate=20170201000000&endDate=20170303000000&isFree=0&userName=test&scope=0&lotteryId=1&methodId=14&issue=170216085&modes=1&projectId=120
      // followList: api + 'report/taskBuy.do?method=list',
      // 根据追号号查看追号详情
      // ttp://192.168.169.44:9901/cagamesclient/report/taskBuy.do?method=detail&projectId=120
      // followDetail: api + 'report/taskBuy.do?method=detail',
      // 在追号详情页面，取消追号（没有）
      // http://192.168.169.44:9901/cagamesclient/booking.do?method=cancel&id=1304
      // followCancel: api + 'booking.do?method=cancel',
    }
  }
</script>

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
