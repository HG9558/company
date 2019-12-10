<template lang="jade">
  .me-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .me-detail-info.scroll-content
      .base-info
        .ds-button-group
          .ds-button.text-button(v-bind:class="{selected: type === 0}" @click="type = 0") 跟单中心
          .ds-button.text-button(v-bind:class="{selected: type === 1}" @click="type = 1") 跟单记录

      div
        label.item 游戏名称 
          el-select(clearable v-model="game" style="width: 1.5rem" placeholder="所有游戏" v-bind:disabled="!gameList[0]")
            el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U")
        | &nbsp;&nbsp;&nbsp;&nbsp;
        label.item(v-if=" type === 1") 状态 
          el-select(clearable v-model="status" style="width: .8rem" v-bind:disabled=" !STATUS[0]" placeholder="全")
            el-option(v-for="(S, i) in STATUS" v-bind:label="S" v-bind:value="i" )

      // 跟单中心
      el-table.header-bold.nopadding(:data="Cdata" v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" style="margin-top: .1rem" v-show=" type === 0 ")

          el-table-column(prop="userName" label="用户" width="100" )
            template(scope="scope")
              .ds-button.text-button.blue(style="padding: 0" @click="OrderDetail(scope.row, 0)") {{ scope.row.userName }}

          el-table-column(prop="projectId" label="注单编号" width="80")
          
          el-table-column(prop="writeTime" label="发起时间" width="140")

          el-table-column(prop="lotteryName" label="游戏" width="100" )

          el-table-column(prop="methodName" label="玩法" width="100" )

          el-table-column(prop="issue" label="期号" width="100" )

          el-table-column(prop="code" label="投注内容" width="140")

          el-table-column(prop="multiple" label="倍数" width="50" align="right")

          el-table-column(class-name="pl1" prop="modes" label="模式" width="50")
            template(scope="scope")
                span {{ MODES[scope.row.modes - 1] }}     

          el-table-column(prop="totalPrice" label="总金额" width="100" align="right")

          el-table-column(prop="bonus" label="奖金" width="100" align="right")

          el-table-column(class-name="pl2" label="操作")
            template(scope="scope")
              div(v-if="scope.row.stat === 0 ")
                .ds-button.text-button.blue(style="padding: 0 .05rem" @click="OrderDetail(scope.row, 0) ") 跟单

      
      // 跟单记录
      el-table.header-bold.nopadding(:data="data" v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" style="margin: .2rem 0" v-show=" type === 1 ")

          el-table-column(prop="projectId" label="注单编号" width="100" )
            template(scope="scope")
              .ds-button.text-button.blue(style="padding: 0" @click="OrderDetail(scope.row, 1)") {{ scope.row.projectId }}

          el-table-column(prop="userName" label="用户" width="80")
          
          el-table-column(prop="writeTime" label="发起时间" width="140")

          el-table-column(prop="lotteryName" label="游戏" width="100")

          el-table-column(prop="methodName" label="玩法" width="100")

          el-table-column(prop="issue" label="期号" width="100")

          el-table-column(prop="code" label="投注内容"  width="140")

          el-table-column(prop="multiple" label="倍数" width="50" align="right")

          el-table-column(class-name="pl1" prop="modes" label="模式" width="50")
            template(scope="scope")
                span {{ MODES[scope.row.modes - 1] }}     

          el-table-column(prop="totalPrice" label="总金额" width="80" align="right")

          el-table-column(prop="bonus" label="奖金" width="80" align="right")

          el-table-column(class-name="pl2" prop="prizeCode" label="开奖号码" width="80" align="right")

          el-table-column(class-name="pl2" label="状态")
            template(scope="scope")
              span(:class="{ 'text-danger': scope.row.stat === 3,  'text-grey': scope.row.stat === 0, 'text-green': scope.row.stat === 2, 'text-black': scope.row.stat === 1}") {{ STATUS[scope.row.stat] }}

      el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")  

  
    .modal(v-show="show" )
      .mask
      .box-wrapper
        .box(ref="box")
          .tool-bar
            span.title {{ modalTitles[type] }}
            el-button-group
              el-button.close(icon="close" @click="show = false")
          .content
            el-row
              el-col(:span="9") 游戏用户：
                span.text-black {{ row.nickName }}
              el-col(:span="5") 游戏：
                span.text-black {{ row.lotteryName }}

              el-col(:span="5")
                span(v-if="!row.prizeCode || row.prizeCode.length <= 10") 开奖号码：
                    span.text-black {{ row.prizeCode  }}
                el-tooltip(v-if="row.prizeCode.length > 10" placement="top")
                  div(slot="content") {{ row.prizeCode }}
                  span 开奖号码：
                    span.text-black {{ row.prizeCode.slice(0, 8) + '...'  }}

              el-col(:span="5") 总金额：
                span.text-black {{ row.totalPrice }}

            el-row
              el-col(:span="9") 注单编号：
                span.text-black {{ row.projectId }}
              el-col(:span="5") 玩法：
                span.text-black {{ row.methodName }}
              el-col(:span="5") 注单状态：
                span.text-black {{ STATUS[row.stat] }}

              el-col(:span="5") 倍数模式：
                span.text-black {{ row.multiple }}

            
            el-row
              el-col(:span="9") 投单时间：
                span.text-black {{ row.writeTime }}
              el-col(:span="5") 奖期：
                span.text-black {{ row.issue }}
              el-col(:span="5") 注单奖金：
                span.text-black {{ row.bonus }}

              el-col(:span="5") 动态奖金返点：
                span.text-black {{ row.userPoint }}

            p.textarea-label
              span.label 投注内容：
              el-input.font-12(v-model="row.code" type="textarea" autofocus  v-bind:autosize="{ minRows: 5, maxRows: 10 }" placeholder="每一注号码之间请用一个 空格[ ]、逗号[,] 或者 分号[;] 隔开")

            p 可能中奖的情况：

            el-table.header-bold.nopadding(:data="expandList" v-bind:row-class-name="tableRowClassName" style="margin: .15rem 0" max-height="200")

              el-table-column(prop="projectid" label="编号" width="160" )

              el-table-column(prop="expandcode" label="号码" width="160")
              

              el-table-column(prop="codetimes" label="倍数" width="80" align="right")

              el-table-column(label="奖级" width="80" align="right")
                template(scope="scope")
                  span {{ scope.row.level }} 等奖

              el-table-column(prop="prize" label="奖金"  align="right")

            .buttons(style="margin: .3rem; text-align: center")
              .ds-button.primary.large.bold(v-if="type === 0" @click="") 确认跟单

      
</template>

<script>
  import { digitUppercase } from '../../util/Number'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  import util from '../../util'
  export default {
    data () {
      return {
        st: '',
        et: '',
        STATUS: ['未开奖', '未中奖', '已中奖', '已撤单'],
        status: '',
        ISFREE: ['现金', '信游币'],
        isFree: '',
        gameList: [],
        game: '',
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
        modalTitles: ['跟单详情', '跟单详情'],
        expandList: []
      }
    },
    computed: {
      textMoney () {
        return digitUppercase(this.money)
      },
      Cdata () {
        if (this.data.length <= this.pageSize) return this.data
        else {
          return util.groupArray(this.data.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage), this.pageSize, {_empty: true})[0]
        }
      }
    },
    watch: {
      game () {
        this.Orderlist()
      }
    },
    mounted () {
      this.getLotterys()
      this.Orderlist()
    },
    methods: {
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
      clear () {
        this.st = ''
        this.et = ''
        this.status = ''
        this.isFree = ''
        this.game = {}
        this.method = {}
        this.issue = ''
        this.mode = ''
        this.id = ''
        this.name = ''
        this.zone = ''
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
      Orderlist (page, fn) {
        let loading = this.$loading({
          text: '跟单记录加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            projectId: this.id,
            beginDate: this.st ? dateTimeFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            endDate: this.et ? dateTimeFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            stat: this.status,
            isFree: this.isFree,
            userName: this.name,
            scope: this.zone,
            lotteryId: this.game.lotteryId,
            methodId: this.method.methodId,
            issue: this.issue,
            modes: this.mode !== '' ? this.mode + 1 : '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.get(api.Orderlist, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.recordList
            this.total = data.totalSize || this.data.length
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
      }
    }
  }
  // 跟单列表
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

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .scroll-content
    top TH
  .me-detail-info
    padding 0 PWX
    .base-info
      text-align center
      color #333
      padding 0 .5rem
    .el-table
      color #333
      .th .cell
        font-weight bold
  .item
    display inline-block

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
      width 7rem
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
