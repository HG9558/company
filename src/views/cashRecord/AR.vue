<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content
        
      .form.form-filters
        .types-sec
          //- label.item 类型 
            el-select(clearable multiple placeholder="全" v-model="type" v-bind:style="multipleSelectStyle" v-bind:multiple-limit="typeMax")
              el-option(v-for="(S, i) in TYPES" v-bind:label="S.cnTitle" v-bind:value="S.ordertypeId")

          el-popover(placement="bottom" width="890" trigger="click" popper-class="search-lottery-popover" v-bind:visible-arrow="false" v-model="showOrderTypePopover" )
            SearchConditionOrderTypes(v-bind:typeData="typeData" v-on:sure="choicedTypeData")
            span.flex.flex-ai-c.types-choice-condi.mb15(slot="reference") 
              span.mr5 类型&nbsp;
              span.flex.flex-ai-c.types-choice
                el-input(v-bind:value="typesValue" v-bind:readonly="true" placeholder="更多类型（可多选）")
          
          span
            template(v-for="(type, i) in choicedTypes")
              ConditionItemButton(v-bind:id="type.id" v-bind:title="type.title" @close="removeCondiItem")
            span(v-if="choicedTypes.length >= 6") ...
        
        //- label.item 时间 
          el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime" @change="detectDate")

        //- label.item 彩票 
          el-select(clearable placeholder="全" v-model="gameid" style="width: 1.2rem; ")
            el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")
        
        label.item(v-if="!noname") 用户 
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
          
        span.item
          el-popover(placement="bottom" width="536" trigger="click" popper-class="search-lottery-popover" v-bind:visible-arrow="false" @show="lotteryPopover = true" @hide="lotteryPopover = false")
            SearchConditionLottery(v-bind:lotteryLs="menus.slice(6, 7)[0].groups" v-bind:historyLs="lotteryHistory" @choiced="choicedLottery")
            span.flex.flex-ai-c.lottery-choice-condi(slot="reference") 
              span.mr5 彩种&nbsp;
              span.flex.flex-ai-c.lottery-choice
                i {{curLotteryName}}
                i(v-bind:class="{'el-icon-caret-bottom': !lotteryPopover, 'el-icon-caret-top': lotteryPopover}")
        
        span.date-buts
          SearchConditions(v-bind:searchConditions="searchConditions" v-bind:dateMappingConfig="dateMappingConfig" @choiced="choicedSearchCondition")

        span.item.ml10 
          span 资金 
          el-select(clearable placeholder="全" v-model="isFree" style="width: .8rem")
            el-option(v-for="(S, i) in ISFREE" v-bind:label="S" v-bind:value="i")

        //- label.item(v-if=" !noname ") 用户 
          input.ds-input.small(v-model="name" style="width: 1rem")
        
        //- .item
          el-select(clearable  v-model="query" style="width: 1rem; margin-right: .1rem" placeholder="编号查询")
            el-option(v-for="(U, i) in QUERYS" v-bind:label="U" v-bind:value="i")
          el-input(v-model="id" style="width: 1rem")

        .buttons
          .ds-button.large.primary.large.bold(@click="list({}, null, 'search')") 搜索
          .ds-button.cancel.large(@click="clear(true)") 清空
          .ds-button.cancel.large(@click=" hideNumber = !hideNumber ") {{ hideNumber ? '显示' : '隐藏' }}小数
          //- label.item(style="margin-left: .32rem") 自身快捷查询：
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myTopup") 充值
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myWithdraw") 提现
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myOrder") 投注
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myFollow") 追号
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myBonus") 奖金
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myPoint") 返点
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="mySalary" v-if="me.showSalary") 工资
            span.ds-button.text-button.blue(style="padding: 0 .05rem" @click="myTransfer") 转账

      .user-breadcrumb(v-if="this.useSource === this.USE_SOURCE_AGENT")
        el-breadcrumb(separator=">")
          el-breadcrumb-item(v-for="(b, i) in userBreadcrumb"  @click.native="link(b, i)") {{ i === 0 ? '自己' : b.userName }}
  
      .table-list(style="padding: .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="data"  style=""   ref="table" stripe show-summary v-bind:summary-method="getSummaries" v-bind:max-height=" MH " v-bind:row-class-name="tableRowClassName"  v-on:row-click="setSelected")

          el-table-column(class-name="pl2" prop="entry" label="账变编号"  )
            template(scope="scope")
              div
                .text-blue(v-if="!scope.row.last" style="padding: 0") {{ scope.row.entry }}
                span(v-if="scope.row.last" style="padding: 0") {{ scope.row.entry }}


          el-table-column(prop="userName" label="用户名" v-if="!noname")
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

      //- SearchConditionOrderTypes(v-bind:typeData="typeData" v-bind:sure="choicedTypeData")  
</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import { digitUppercase, numberWithCommas } from '../../util/Number'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  import SearchConditionOrderTypes from 'components/SearchConditionOrderTypes'
  import ConditionItemButton from 'components/ConditionItemButton'
  import SearchConditions from 'components/SearchConditions'
  import SearchConditionLottery from 'components/SearchConditionLottery'
  export default {
    mixins: [setTableMaxHeight],
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
    components: {
      SearchConditions,
      SearchConditionLottery,
      SearchConditionOrderTypes,
      ConditionItemButton
    },
    data () {
      return {
        me: store.state.user,
        USE_SOURCE_AGENT: 2, // 使用：代理中心-下级资金记录
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
        QUERYS: ['注单编号', '追号编号', '账变编号'],
        query: '',
        data: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        amount: [{income: 0, expenditure: 0, difMoney: 0}],
        hideNumber: false,
        I: 0,

        typesValue: '',
        typeData: [],
        choicedTypes: [],

        lotteryHistory: [],
        lotteryPopover: false,
        curLotteryName: '全部',

        searchConditions: ['今天', '昨天', '前天'],
        dateMappingConfig: { d0: [0, 0], d1: [1, 1], d2: [2, 2], d3: [3, 3], d4: [4, 4], d5: [5, 5], d6: [6, 6] },
        names: [],
        showOrderTypePopover: false,
        userBreadcrumb: [{title: '自己'}, {}]
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
      // 代理中心入口，进入默认不查数据需用户手动搜索数据
      if (this.useSource !== this.USE_SOURCE_AGENT) {
        this.list()
      }
      if (this.platform === 'ds') {
        this.ISFREE.splice(2)
      }
      this.initQueryConditionDate()
      this.getGameHistory()
      this.names = JSON.parse(window.sessionStorage.getItem('AR_NAMES_HISTORY') || '[]')
    },
    methods: {
      __setCRI (i) {
        this.I = i
      },
      link (B, i) {
        if (String(B.userId) === String(this.me.userId)) return
        this.subUserId = B.userId
        this.name = ''
        this.list({}, null, '', {userName: B.userName})
      },
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        let N = this.noname ? 5 : 6
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
            sums[index] = (sums[index] > 0 ? '+' : '') + numberWithCommas(sums[index].toFixed(this.hideNumber ? 0 : N))
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      detectDate (v) {
        // console.log(v)
      },
      // myTopup () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [1]
      //   this.list()
      // },
      // myWithdraw () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [2, 3]
      //   this.list()
      // },
      // myOrder () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [7]
      //   this.list()
      // },
      // myFollow () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [9]
      //   this.list()
      // },
      // myBonus () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [12, 16]
      //   this.list()
      // },
      // myPoint () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [11, 15]
      //   this.list()
      // },
      // mySalary () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [37]
      //   this.list()
      // },
      // myTransfer () {
      //   this.clear()
      //   this.zone = 0
      //   this.type = [70]
      //   this.list()
      // },
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
      list (page, fn, source, params = {}) {
        this.hideNumber = false
        // if (this.useSource === this.USE_SOURCE_AGENT && source === 'search') {
        //   if (!this.name) {
        //     this.$message.warning({message: '请输入用户名'})
        //     return
        //   }
        // }
        // console.log(this.stEt[0], this.stEt[1], dateTimeFormat(this.stEt[0]).replace(/[-:\s]/g, ''), dateTimeFormat(this.stEt[1]).replace(/[-:\s]/g, ''))
        let loading = this.$loading({
          text: '账变记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        // OrderReport.do?method=list&orderId=7&beginDate=20170201000000&endDate=20170303000000&isFree=1&userName=test&scope=1&serialType=2&serialValue=3397&lotteryId=1&methodId=37&issueId=1111&modes=11&page=1&pageSize=20
        if (!fn) {
          this.type = this.getChoicedOrderType()
          this.preOptions = {
            orderId: this.type.join(','),
            beginDate: dateTimeFormat(this.stEt[0]).replace(/[-:\s]/g, ''),
            endDate: dateTimeFormat(this.stEt[1]).replace(/[-:\s]/g, ''),
            isFree: this.isFree,
            userName: this.name,
            scope: this.noname ? 0 : this.useSource === this.USE_SOURCE_AGENT ? 2 : this.zone,
            serialType: this.query,
            serialValue: this.id,
            lotteryId: this.gameid,
            methodId: this.method.methodId,
            issueId: this.issue,
            modes: this.mode !== '' ? this.mode + 1 : '',
            page: 1,
            pageSize: this.pageSize
          }
          // this.setLotteryHistory({gameid: this.gameid})
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.list, Object.assign({}, this.preOptions, params)).then(({data}) => {
          // success
          if (data.success === 1) {
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.orderRecordList
            // this.data.forEach(x => (x.inout = parseFloat(x.inout) * -1))
            this.total = data.totalSize || this.data.length
            if (this.useSource === this.USE_SOURCE_AGENT) {
              this.userBreadcrumb = data.userBreads.concat([{}])
            }
            if (this.preOptions.userName) {
              this.setNameHistory(this.preOptions.userName)
            }
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
        this.$http.get(api.getOrderType, {version: 1}).then(({data}) => {
          // success
          if (data.success === 1) {
            this.me.showSalary && data.orderTypeList.push({
              cnTitle: '日工资',
              ordertypeId: 37
            })
            this.TYPES = data.orderTypeList
          }
        }, (rep) => {
          // error
        })
      },
      initQueryConditionDate () {
        let count = 0
        let curDate = null
        let dateStr = ''
        for (let o in this.dateMappingConfig) {
          count++
          if (count > 3) {
            curDate = new Date()
            curDate.setDate(curDate.getDate() - this.dateMappingConfig[o][0])
            dateStr = `${String(curDate.getMonth() + 1).padStart(2, '0')}月${String(curDate.getDate()).padStart(2, '0')}日`
            this.searchConditions.push(dateStr)
          }
        }
      },
      choicedTypeData (types) {
        this.typeData = types
        this.inputLimitShowTypeData()
        this.quickChoiceLimitShowTypeData()
        this.showOrderTypePopover = false
      },
      inputLimitShowTypeData () {
        this.typesValue = ''
        let choiceds = []
        this.typeData.forEach((type) => {
          if (type.checked) choiceds.push(type.text)
        })
        if (choiceds.length > 0) this.typesValue = choiceds.join(' ') + '(可多选)'
        if (this.typesValue.length > 15) this.typesValue = this.typesValue.substr(0, 15) + '...'
      },
      // 限制显示6个
      quickChoiceLimitShowTypeData () {
        let ts = []
        let count = 6
        for (let i = 0; i < this.typeData.length; i++) {
          for (let j = 0; j < this.typeData[i].orderList.length; j++) {
            if (count < 1) break
            if (count > 0 && this.typeData[i].orderList[j].checked) {
              ts.push({id: `${i}-${j}`, title: this.typeData[i].orderList[j].cnTitle})
              count--
            }
          }
        }
        this.choicedTypes = ts
      },
      getChoicedOrderType () {
        let checkedList = []
        for (let i = 0; i < this.typeData.length; i++) {
          for (let j = 0; j < this.typeData[i].orderList.length; j++) {
            if (this.typeData[i].orderList[j].checked) {
              checkedList.push(this.typeData[i].orderList[j].ordertypeId)
            }
          }
        }
        return checkedList
      },
      removeCondiItem (id) {
        let [i, j] = id.split('-')
        let type = this.typeData[parseInt(i, 10)]
        type.checked = false
        type.orderList[parseInt(j, 10)].checked = false
        this.$set(this.typeData, parseInt(i, 10), type)
        this.choicedTypeData(this.typeData)
      },
      choicedSearchCondition (i, dates) {
        this.stEt = [dates.startDate, dates.endDate]
      },
      choicedLottery (lottery) {
        if (!lottery.gameid) return
        this.gameid = lottery.gameid
        this.curLotteryName = lottery.title + ((lottery.subTitle || '').length > 0 ? `(${lottery.subTitle})` : '')
      },
      setLotteryHistory (lottery) {
        if (!lottery || !lottery.gameid || this.findHistoryById(lottery.gameid) !== -1) return
        this.lotteryHistory.push(lottery)
        if (this.lotteryHistory.length > 3) this.lotteryHistory.shift()
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
      findHistoryById (gameid) {
        return this.lotteryHistory.findIndex((item) => {
          return item.gameid === gameid
        })
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
        window.sessionStorage.setItem('AR_NAMES_HISTORY', JSON.stringify(this.names || '[]'))
      },
      nameHandleSelect (e) {
        if (e.value === '近期搜索') this.name = ''
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

</style>
<style lang="stylus" scoped>
  @import '../../var.stylus'
  .form-filters
    .buttons
      display inline-block
      .ds-button
        min-width 0.87rem
        padding 0
        vertical-align inherit
      .cancel.large
        background #444444
    .el-select
      top 0
      vertical-align inherit
    .item
      display inline-block
  .types-sec
    &>span
      display inline-block
  .types-choice-condi
    width 2.4rem
  .user-list
    .form
      padding PWX

  .item
    display inline-block
    margin 0 PW .1rem 0
    &.ml10
      margin-left 0.1rem
  .block
    display block
    
  .el-select
  .el-input-number
    width 1.2rem
  .el-select
    position relative
    top .01rem

  .types-sec + span
    display inline-block
    margin-right 0.1rem
  .lottery-choice-condi
    width 2rem
  .lottery-choice
    // display inline-block
    width 1.68rem
    height 0.3rem
    background-image linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%)
    justify-content space-between
    padding 0 0.1rem
    box-sizing border-box
    border solid 1px #e8e8e8
    font-size 0.12rem
    
  .date-buts
    display inline-block
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