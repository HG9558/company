<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content
     
      .form.form-filters

        label.item(v-if="!noname") 用户 
          //- input.ds-input.small(v-model="name" style="width: 1.2rem" placeholder="请输入用户名" maxLength="20")
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
        
        //- label.item 时间 
          //- el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime" size="small")
        span.date-wp 
          SearchConditions(@choiced="choicedSearchCondition")

        //- label.item 彩种  
        //-   el-select(clearable v-bind:disabled=" !gameList[0] "  v-model="gameid" style="width: 1.2rem" placeholder="全")
        //-     el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")

        el-popover(placement="bottom" width="536" trigger="click" popper-class="search-lottery-popover" v-bind:visible-arrow="false" @show="lotteryPopover = true" @hide="lotteryPopover = false")
          SearchConditionLottery(v-bind:lotteryLs="menus.slice(6, 7)[0].groups" v-bind:historyLs="lotteryHistory" @choiced="choicedLottery")
          span.flex.flex-ai-c.ml10.lottery-choice-condi(slot="reference") 
            span.mr5 彩种&nbsp;
            span.flex.flex-ai-c.lottery-choice
              i {{curLotteryName}}
              i(v-bind:class="{'el-icon-caret-bottom': !lotteryPopover, 'el-icon-caret-top': lotteryPopover}")

        label.item &nbsp;&nbsp;状态  
          el-select(clearable v-bind:disabled=" !STATUS[0] "  v-model="status" style="width: .9rem" placeholder="全")
            el-option(v-for="(S, i) in STATUS" v-bind:label="S" v-bind:value="i")

        label.item 编号 
          el-input(v-model="id" style="width: 1rem")
        
        label.item 奖期 
          el-autocomplete.inline-input(v-model=" issue " v-bind:fetch-suggestions=" getIssueList " placeholder="请输入奖期号" style="width: 1.2rem;")
        
        .ds-button.primary.large.bold(@click="Orderlist({}, null, 'search')" style="margin-left: .0rem") 搜索
        //- .buttons(style="margin-left: .3rem")
          .ds-button.cancel.large(@click="clear(true)") 清空
      
      .user-breadcrumb(v-if="this.useSource === this.USE_SOURCE_AGENT")
        el-breadcrumb(separator=">")
          el-breadcrumb-item(v-for="(b, i) in userBreadcrumb"  @click.native="link(b, i)") {{ i === 0 ? '自己' : b.userName }}

      .table-list(style="padding: 0 .2rem .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="Cdata"   style=""   ref="table" show-summary v-bind:summary-method="getSummaries"  stripe v-bind:max-height=" MH " v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected")
          el-table-column(class-name="pl2" prop="projectId" label="注单编号" )
            template(scope="scope")
              div
                span( style="padding: 0") {{ scope.row.projectId }}
          el-table-column(prop="userName" label="用户" v-if="!noname")
          el-table-column(prop="writeTime" label="投注时间" min-width="120")
            template(scope="scope")
              span() {{ scope.row.writeTime }}
          el-table-column(prop="lotteryName" label="游戏")
          el-table-column(prop="methodName" label="玩法" min-width="120")
            template(scope="scope")
              div() {{ scope.row.methodName }}（{{ scope.row.codeType === '1' ? '复式' : '单式'}}）
          el-table-column(prop="issue" label="期号")
          el-table-column(prop="multiple" label="倍数")
          el-table-column(prop="totalPrice" label="总金额" align="right")
            template(scope="scope")
              span.text-danger(v-if=" scope.row.totalPrice && scope.row.totalPrice._o0() ") -{{ scope.row.totalPrice && scope.row.totalPrice._nwc() }}
          el-table-column(class-name="pr2" prop="bonus" label="奖金" align="right")
            template(scope="scope")
              span.text-green(v-if=" scope.row.bonus && scope.row.bonus._o0() ") +{{ scope.row.bonus && scope.row.bonus._nwc() }}
          // STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
          el-table-column(label="状态" align="center")
            template(scope="scope")
              span(:class=" [STATUSCLASS[scope.row.stat]] ") {{ STATUS[scope.row.stat] }}
          el-table-column(label="操作" width="200")
            template(scope="scope")
              div()
                .ds-button.text-button.blue(style="padding: 0 .05rem" @click=" OrderDetail(scope.row, 0) ") 注单详情
                .ds-button.text-button.blue(v-if="scope.row.taskId !== '0' " style="padding: 0 .05rem" @click.stop="showFollow = scope.row.taskId ") 追号详情
                .ds-button.text-button.blue(style="padding: 0 .05rem" @click.stop=" callPrint(scope.row) " v-if="platform !== 'ds' ") 打印

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

    BetDetail(v-show="show" v-bind:row="row" v-on:close="show = $event" v-on:show-follow="showFollow = $event" v-on:cancel-order="cancelOrder" v-bind:showCancelOrder="showCancelOrder")  

    //- .modal.bet-detail-modal(v-show="show" )
      .mask
      .box-wrapper
        .box(ref="box")
          .tool-bar
            span.title {{ '投注详情' }}
            el-button-group
              el-button.close(icon="close" @click="show = false")
          .content.bet-detail-modal-c
            .top-info.bgc-w.pb20
              p.txt-c {{ row.lotteryName }}--{{ row.issue }}期
              .issue-nums.txt-c.mt10
                span.op-num.ft24(v-for="(n, i) in row.prizeCode ? (row.prizeCode.split(',')) : defaultPrizeCode" v-bind:class="{red: row.stat == 1 || row.stat == 1}") {{n}}
              el-row
                el-col(:span="12")
                  注单编号：
                  span.text-black {{ row.projectId }}
                  span.order-status.c_f(:class=" [STATUSCLASS[row.stat]] ") {{ STATUS[row.stat] }}
                el-col(:span="12")
                  投单时间：
                  span.text-black {{ row.writeTime }}
              el-row
                el-col(:span="12")
                是否追号：
                span {{row.taskId ? '是' : '否'}}
                span.c-o(v-if="!!row.taskId" @click.stop="showFollow = row.taskId ")&nbsp;&nbsp;查看追号单

            .middle-info
              el-row
                el-col(:span="12")
                  玩法：
                  span.text-black {{ row.methodName }}（{{ row.codeType === '1' ? '复式' : '单式'}}）
                el-col(:span="12")
                  是否单挑：
                  span.text-black {{ row.isLimitBonus === '1' ? '是' : '否'}}
              el-row
                el-col(:span="12")
                  投注金额：
                  span.text-black {{ row.TotalPrice }} &nbsp; ({{row.countDesc}})
                el-col(:span="12")
                  投注返点：
                  span.text-black {{ row.userPoint }}
              el-row
                el-col(:span="12")
                  中奖金额：
                  span.text-black(v-if=" row.bonus && row.bonus._o0() ") {{ row.bonus && row.bonus._nwc() }}
                el-col(:span="12")
                  中奖注数：
                  span.text-black {{ row.prize }}
                  



              //- el-row
                el-col(:span="6")
                  游戏用户：
                  span.text-black {{ row.userName }}
                el-col(:span="6")
                  游戏：
                  span.text-black {{ row.lotteryName }}
                el-col(:span="6")
                  span(v-if="!row.prizeCode || row.prizeCode.length <= 10") 开奖号码：
                      span.text-black {{ row.prizeCode  }}
                  el-tooltip(v-if="row.prizeCode.length > 10" placement="top")
                    div(slot="content") {{ row.prizeCode }}
                    span 开奖号码：
                      span.text-black {{ row.prizeCode.slice(0, 8) + '...'  }}

                el-col(:span="6")
                  总金额：
                  span.text-black {{ row.TotalPrice }}

              //- el-row
                el-col(:span="6")
                  注单编号：
                  span.text-black {{ row.projectId }}
                el-col(:span="6")
                  玩法：
                  span.text-black {{ row.methodName }}（{{ row.codeType === '1' ? '复式' : '单式'}}）

                el-col(:span="6")
                  注单状态：
                  span(:class=" [STATUSCLASS[row.stat]] ") {{ STATUS[row.stat] }}

                el-col(:span="6")
                  倍数模式：
                  span.text-black {{ row.multiple }} 
                    span ({{ MODES[row.modes - 1] }})

            
              //- el-row
                el-col(:span="6")
                  投单时间：
                  span.text-black {{ row.writeTime }}
                el-col(:span="6")
                  奖期：
                  span.text-black {{ row.issue }}
                el-col(:span="6")
                  注单奖金：
                  span.text-green(v-if=" row.bonus && row.bonus._o0() ") {{ row.bonus && row.bonus._nwc() }}

                el-col(:span="6" v-if="row.userPoint")
                  动态奖金返点：
                  span.text-black {{ row.userPoint }}

              //- el-row(v-if="row.isJoinPool")

              //-   el-col(:span="6")
              //-     奖池期号：
              //-     span.text-black {{ row.poolIssue}}

              //-   el-col(:span="6")
              //-     奖池状态：
              //-     span.text-black {{ row.poolIsGetPrize ? '已开奖' :  '未开奖' }}

              //-   el-col(:span="6")
              //-     奖池号码：
              //-     span.text-black {{ row.poolCode }}
                
              //-   el-col(:span="6")
              //-     奖池奖金：
              //-     span.text-black {{ row.poolBonus  }}


              p.textarea-label
                span.label 投注内容：
                el-input.font-12(disabled v-model=" codePosition " type="textarea" autofocus  v-bind:autosize="{ minRows: 5, maxRows: 10 }" placeholder="每一注号码之间请用一个 空格[ ]、逗号[,] 或者 分号[;] 隔开")

              p 可能中奖的情况：
            
              el-table.header-bold.nopadding.vtop(:data="expandList" stripe v-bind:row-class-name="tableRowClassName" style="margin: .15rem 0; vertical-align: top" max-height="200")

                el-table-column(class-name="pl2" prop="projectid" label="编号" width="160" )

                el-table-column(prop="codetimes" label="号码")
                  template(scope="scope")
                    p {{ scope.row.expandcode }}
                      span(v-if="scope.row.position") [{{ scope.row.position }}]
                

                el-table-column(prop="codetimes" label="倍数" )

                el-table-column(label="奖级")
                  template(scope="scope")
                    span {{ parseInt(scope.row.level) ? scope.row.level + '等奖' : scope.row.level}} 

                el-table-column(prop="prize" label="奖金")

            .buttons(style="margin: .3rem; text-align: center")
              // .ds-button.primary.large.bold(v-if="type === 1" @click="") 发起跟单
              .ds-button.primary.large.bold(v-if="row.canCancel && row.userName === ACCOUNT" @click="cancel()") 确认撤单

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
  import Follow from './FollowDetail'
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import { digitUppercase } from '../../util/Number'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  // import util from '../../util'
  import SearchConditions from 'components/SearchConditions'
  import SearchConditionLottery from 'components/SearchConditionLottery'
  import BetDetail from './BetDetail'
  export default {
    components: {
      Follow,
      SearchConditions,
      SearchConditionLottery,
      BetDetail
    },
    // props: ['menus'],
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
        TH: 300,
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
          }
          // , {
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
        stEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        defaultStEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
        STATUSCLASS: ['text-green', 'text-danger', 'text-grey', 'text-orange'],
        // STATUSCLASS: ['bgc-yellow', 'bgc-red', 'bgc-gray', 'bgc-green'],
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
        subUserId: '',
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
        row: {prizeCode: '?,?,?,?,?'},
        defaultPrizeCode: ['?', '?', '?', '?', '?'],
        modalTitles: ['投注详情', '发起跟单', '撤单'],
        expandList: [],
        amount: [{income: 0, expenditure: 0, difMoney: 0}],
        Cdata: [],
        showFollow: '',
        I: 0,

        lotteryHistory: [],
        lotteryPopover: false,
        curLotteryName: '全部',

        userBreadcrumb: [{title: '自己'}, {}],
        showCancelOrder: true,
        names: []
      }
    },
    computed: {
      textMoney () {
        return digitUppercase(this.money)
      },
      codePosition () {
        return this.row.position ? (this.fullCode || this.row.code + '[' + this.row.position + ']') : this.fullCode || this.row.code
      }
    },
    watch: {
      show () {
        if (!this.show) this.fullCode = '获取失败...'
      },
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
      //   this.Orderlist()
      // }
      this.Orderlist()
      this.getGameHistory()
      this.getBreadByUserId(this.me.userId)
      this.showCancelOrder = this.useSource !== this.USE_SOURCE_AGENT // 下级彩票记录不显示撤单
      this.names = JSON.parse(window.sessionStorage.getItem('ORDER_NAMES_HISTORY') || '[]')
    },
    methods: {
      __setGOI (i) {
        this.I = i
      },
      link (B, i) {
        if (String(B.userId) === String(this.me.userId)) return
        this.subUserId = B.userId
        // this.name = B.userName
        this.name = ''
        this.Orderlist({}, null, '', {userName: B.userName})
      },
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        let N = this.noname ? [4, 5, 6] : [5, 6, 7]
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (values.every(value => !isNaN(value)) && index !== N[0] && index !== N[1]) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            // sums[index] += ' 元'
            sums[index] = ((index === N[2] ? '-' : '+') + sums[index].toFixed(4))._nwc()
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex % 2 === 0) {
          if (columnIndex === 0) {
            return [1, 2]
          } else if (columnIndex === 1) {
            return [0, 0]
          }
        }
      },
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
      Orderlist (page, fn, source, params = {}) {
        // if (this.useSource === this.USE_SOURCE_AGENT && source === 'search') {
        //   if (!this.name) {
        //     this.$message.warning({message: '请输入用户名'})
        //     return
        //   }
        // }
        let loading = this.$loading({
          text: '投注记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            projectId: this.id,
            beginDate: this.stEt[0] ? dateTimeFormat(this.stEt[0]).replace(/[\s:-]*/g, '') : '',
            endDate: this.stEt[1] ? dateTimeFormat(this.stEt[1]).replace(/[\s:-]*/g, '') : '',
            stat: this.status,
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
        this.$http.post(api.Orderlist, Object.assign({}, this.preOptions, params)).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 500)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.Cdata = data.recordList
            this.total = data.totalSize || this.data.length
            if (this.useSource === this.USE_SOURCE_AGENT) {
              this.userBreadcrumb = data.userBreads.concat([{}])
            }
            if (!data.recordList || data.recordList.length < 1) {
              if (this.name && this.preOptions.scope === 1 && !data.userBreads.find((item) => { return item.userName === this.preOptions.userName }) && data.msg) {
                this.$message.error({target: this.$el, message: data.msg}) // || '该下级不存在'
              }
            }
            if (this.preOptions.userName) {
              this.setNameHistory(this.preOptions.userName)
            }
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
            // row.userPoint = data.userPoint
            // row.poolIssue = data.poolIssue
            // row.poolCode = data.poolCode
            // row.poolBonus = data.poolBonus
            // row.poolIsGetPrize = data.poolIsGetPrize
            this.row = data
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
      cancelOrder (status) {
        this.show = false
        this.Orderlist()
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
      getBreadByUserId (userId) {
        this.$http.get(api.subBread, {userId: userId}).then(({data: {success, userBreads}}) => {
          if (success === 1) {
            if (userBreads.length > 0) {
              this.userBreadcrumb = userBreads.concat([{}])
            }
          }
        })
      },
      querySearchName (name, cb) {
        let rs = name ? this.names.filter((n) => {
          return n.value.indexOf(name) === 0
        }) : this.names
        cb(rs)
      },
      setNameHistory (name) {
        if (!name || this.names.filter((n) => n.value.indexOf(name) === 0).length > 0) return
        let tipItem = this.names.length > 0 && this.names[0].value === '近期搜索' ? this.names.shift() : {value: '近期搜索', address: ''}
        this.names.unshift({value: name, address: name})
        if (this.names.length > 5) this.names.pop()
        this.names.unshift(tipItem)
        window.sessionStorage.setItem('ORDER_NAMES_HISTORY', JSON.stringify(this.names || '[]'))
      },
      nameHandleSelect (e) {
        if (e.value === '近期搜索') this.name = ''
      }
    }
  }
</script>
<style lang="stylus">
  .vtop table td
    vertical-align top
    padding-top .1rem

</style>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .user-list
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
  .form-filters > *
    display inline-block
  i
    font-style normal
  .c-o
    color #f37e0c
  .dis-ib
    display inline-block
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
        margin .1rem .3rem .2rem 0
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

  .bet-detail-modal
    .box-wrapper 
      .box
        width 6.7rem
        max-height 6.7rem
    .el-table__header
      background-image linear-gradient(0deg, #e7e7e7 0%, #cccccc 100%)
    .content
      margin 0
    .top-info
      padding 0 0.2rem 0.1rem 0.2rem
    .middle-info
      margin 0 0.2rem
  .bet-detail-modal-c
    .top-info
      padding-top 0.3rem 
    .bgc-red
      background #fc3220
    .bgc-yellow 
      background #ffaa01
    .bgc-green
      background #0faf0f
    .bgc-gray
      background #444444
  .op-num
    display inline-block
    width 0.4rem
    height 0.4rem
    line-height 0.4rem
    text-align center
    background-image linear-gradient(0deg, #e3e6ea 0%, #ffffff 100%)
    border-image-source linear-gradient(0deg,  #d8d8d8 0%, #e5e5e5 100%)
    border solid 1px #dfdfdf
    border-radius 50%
    margin 0 0.04rem
    &.red
      background-image linear-gradient(#fc3220, #fc3220), linear-gradient(0deg, #e3e6ea 0%, #ffffff 100%)
      color #fff
      border none
  .order-status
    width 0.6rem
    line-height 0.24rem
    display inline-block
    text-align center
    margin-left 0.12rem
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