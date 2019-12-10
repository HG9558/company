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
          
          label.item(v-if="!noname") 用户 
            //- input.ds-input.small(v-model="name" style="width: 1rem")
            el-autocomplete(
              class="inline-input uname-ipt"
              popper-class="username-auto-ipt"
              v-model="name"
              v-bind:fetch-suggestions="querySearchName"
              placeholder="请输入用户名"
              v-bind:maxlength="12"
              v-bind:clearable="true"
              v-on:select="nameHandleSelect"
            )

          //- label.item 追号时间 
          //-   el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")
          span.date-wp 
            SearchConditions(@choiced="choicedSearchCondition")

          //- label.item 彩种 
          //-   el-select(clearable v-bind:disabled=" !gameList[0] " placeholder="全" v-model="gameid" style="width: 1.2rem")
          //-     el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")

          el-popover(placement="bottom" width="536" trigger="click" popper-class="search-lottery-popover" v-bind:visible-arrow="false" @show="lotteryPopover = true" @hide="lotteryPopover = false")
            SearchConditionLottery(v-bind:lotteryLs="menus.slice(6, 7)[0].groups" v-bind:historyLs="lotteryHistory" @choiced="choicedLottery")
            span.flex.flex-ai-c.ml10.lottery-choice-condi(slot="reference") 
              span.mr5 彩种&nbsp;
              span.flex.flex-ai-c.lottery-choice
                i {{curLotteryName}}
                i(v-bind:class="{'el-icon-caret-bottom': !lotteryPopover, 'el-icon-caret-top': lotteryPopover}")

          label.item 奖期 
            el-autocomplete.inline-input(v-model=" issue " v-bind:fetch-suggestions=" getIssueList " placeholder="请输入奖期号" style="width: 1.2rem;")



          label.item 编号 
            el-input(v-model="id" style="width: 1rem")


          .ds-button.primary.large.bold(@click="followList({}, null, 'search')") 搜索
          //- .buttons(style="margin-left: .3rem")
            .ds-button.cancel.large(@click="clear(true)") 清空
        
        .user-breadcrumb(v-if="this.useSource === this.USE_SOURCE_AGENT")
          el-breadcrumb(separator=">")
            el-breadcrumb-item(v-for="(b, i) in userBreadcrumb"  @click.native="link(b, i)") {{ i === 0 ? '自己' : b.userName }}

        .table-list(style="padding: .15rem .2rem ")
        
          el-table.header-bold.nopadding(:data="Cdata"  style=""   ref="table" show-summary v-bind:summary-method="getSummaries" v-bind:max-height=" MH " stripe v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" )

            el-table-column(label="追号编号" class-name="pl2")
              template(scope="scope")
                div
                  span( style="padding: 0") {{ scope.row.taskId }}

            el-table-column(prop="userName" label="用户" v-if="!noname")
            
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
        .box(ref="box" style="width: 6.7rem; max-height: 6.7rem;")
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
  import store from '../../store'
  import SearchConditions from 'components/SearchConditions'
  import SearchConditionLottery from 'components/SearchConditionLottery'
  export default {
    components: {
      Follow,
      VRFollow,
      SearchConditions,
      SearchConditionLottery
    },
    props: {
      menus: {
        type: Array,
        default () {
          return []
        }
      },
      useSource: {
        type: Number,
        default: 0
      }
    },
    mixins: [setTableMaxHeight],
    data () {
      return {
        me: store.state.user,
        USE_SOURCE_AGENT: 2, // 使用：代理中心-下级彩票记录
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
        // STATUS: ['进行中', '已取消', '已完成'],
        // STATUSCLASS: ['text-danger', 'text-grey', 'text-green'],
        STATUS: ['进行中', '已取消', '已中奖', '未中奖'],
        STATUSCLASS: ['text-danger', 'text-black', 'text-red', 'text-grey'],

        // STATUSS: ['未生成', '进行中', '已取消', '已中奖', '未中奖'],
        // STATUSSCLASS: ['text-black', 'text-black', 'text-black', 'text-red', 'text-grey'],
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
        I: 0,
        lotteryHistory: [],
        lotteryPopover: false,
        curLotteryName: '全部',
        STATUS_FINISH: 2,
        names: [],
        userBreadcrumb: [{title: '自己'}, {}]
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
        if (this.gameid) {
          this.getMethods()
          this.getRecentIssueList()
        }
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
      // 代理中心入口，进入默认不查数据需用户手动搜索数据
      // patch 2019-06-11 放开规则(反复修改)，进入页面默认展示数据
      // if (this.useSource !== this.USE_SOURCE_AGENT) {
      //   this.followList()
      // }
      this.followList()
      this.getGameHistory()
      this.names = JSON.parse(window.sessionStorage.getItem('FOLLOW_NAMES_HISTORY') || '[]')
    },
    methods: {
      __setGFI (i) {
        this.I = i
      },
      link (B, i) {
        if (String(B.userId) === String(this.me.userId)) return
        this.subUserId = B.userId
        this.name = ''
        this.followList({}, null, '', {userName: B.userName})
      },
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        let N = this.noname ? 8 : 9
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (index === N) {
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
      followList (page, fn, source, params = {}) {
        // if (this.useSource === this.USE_SOURCE_AGENT && source === 'search') {
        //   if (!this.name) {
        //     this.$message.warning({message: '请输入用户名'})
        //     return
        //   }
        // }
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
            scope: this.noname ? 0 : this.useSource === this.USE_SOURCE_AGENT ? 2 : this.zone,
            lotteryId: this.gameid,
            methodId: this.method.methodId,
            issue: this.issue,
            modes: this.mode !== '' ? this.mode + 1 : '',
            page: 1,
            pageSize: this.pageSize
          }
          // this.setLotteryHistory({gameid: this.gameid})
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.followList, Object.assign({}, this.preOptions, params)).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
            typeof fn === 'function' && fn()
            if (!fn) this.currentPage = 1
            data.taskList = data.taskList.map((task) => {
              if (task.status === this.STATUS_FINISH) {
                // 中奖，未中奖
                task.status = task.winCount > 0 ? 2 : 3
              }
              return task
            })
            this.Cdata = data.taskList
            this.total = data.totalSize || this.data.length
            if (this.useSource === this.USE_SOURCE_AGENT) {
              this.userBreadcrumb = data.userBreads.concat([{}])
            }
            if (this.preOptions.userName) {
              this.setNameHistory(this.preOptions.userName)
            }
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
      },
      choicedSearchCondition (i, dates) {
        this.stEt = [dates.startDate, dates.endDate]
      },
      choicedLottery (lottery) {
        this.gameid = lottery.gameid
        this.curLotteryName = lottery.title
      },
      setLotteryHistory (lottery) {
        if (!lottery || !lottery.gameid || this.findHistoryById(lottery.gameid) !== -1) return
        this.lotteryHistory.push(lottery)
        if (this.lotteryHistory.length > 3) this.lotteryHistory.shift()
      },
      findHistoryById (gameid) {
        return this.lotteryHistory.findIndex((item) => {
          return item.gameid === gameid
        })
      },
      getGameById (id) {
        let gameGroups = this.menus.slice(6, 7)[0].groups
        for (let i = 0; i < gameGroups.length; i++) {
          for (let j = 0; j < gameGroups[i].items.length; j++) {
            if (id === gameGroups[i].items[j].gameid) {
              return gameGroups[i].items[j]
            }
          }
        }
      },
      getGameHistory () {
        let historis = JSON.parse(window.localStorage.getItem('STORAGE_HISTORY_LOTTERIES') || '[]')
        historis = historis.slice(0, 3)
        let game = null
        for (let i = 0; i < historis.length; i++) {
          game = this.getGameById(historis[i])
          if (game) {
            this.setLotteryHistory(game)
          }
        }
      },
      querySearchName (name, cb) {
        let rs = name ? this.names.filter((n) => {
          return n.value.indexOf(name) === 0
        }) : this.names
        cb(rs)
      },
      // setNameHistory (name) {
      //   if (!name || this.names.filter((n) => n.value.indexOf(name) === 0).length > 0) return
      //   this.names.push({value: name, address: name})
      //   if (this.names.length > 3) this.names.shift()
      // },
      setNameHistory (name) {
        if (!name || this.names.filter((n) => n.value.indexOf(name) === 0).length > 0) return
        let tipItem = this.names.length > 0 && this.names[0].value === '近期搜索' ? this.names.shift() : {value: '近期搜索', address: ''}
        this.names.unshift({value: name, address: name})
        if (this.names.length > 5) this.names.pop()
        this.names.unshift(tipItem)
        window.sessionStorage.setItem('FOLLOW_NAMES_HISTORY', JSON.stringify(this.names || '[]'))
      },
      nameHandleSelect (e) {
        if (e.value === '近期搜索') this.name = ''
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
    .form-filters > *
      display inline-block
    .form
      padding PWX
    .user-breadcrumb
      margin: 0.1rem 0.2rem 0rem 0.2rem
    .date-wp
      display inline-block
      .search-condition-date
        float none
    .uname-ipt
      width 1.3rem
  .item
    display inline-block
    margin 0 PW 0 0

    
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
  i
    font-style normal
  .text-red
    color red  
  .search-condition-date
    width 4.0rem
    float left
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
  .search-condition-date + span
    display inline-block
    margin-right 0.1rem
  .lottery-choice-condi
    width 1.8rem
  .lottery-choice
    // display inline-block
    width 1.48rem
    height 0.3rem
    background-image linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%)
    justify-content space-between
    padding 0 0.1rem
    box-sizing border-box
    border solid 1px #e8e8e8

  .el-icon-caret-bottom
    font-size 0.12rem
    margin-top 0.02rem
</style>
<style lang="stylus">
  .search-lottery-popover
    background-color #fff !important
</style>
<style lang="stylus">
.username-auto-ipt
  .el-scrollbar__wrap
    overflow auto
</style>