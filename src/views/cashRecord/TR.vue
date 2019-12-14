<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content

      .form.form-filters

        //- span.mr10 时间
        //- el-button(v-for="(c, i) in searchConditions" v-bind:class="{selected: quickDateIdx === i}" @click="quickDateIdx = i") {{c}}
        SearchConditions(@choiced="choicedSearchCondition")

        //- label.item 时间范围
        //-   el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")
        //- | &nbsp;&nbsp;

        el-popover(placement="bottom" width="420" trigger="click" popper-class="account-popover" v-bind:visible-arrow="false" @show="outPopover = true" @hide="outPopover = false")
          acc-ls(v-bind:accHistory="outAccHistory" v-bind:froms="froms" trigerSource="out" @acc-choiced="accChoiced")
          span.flex.flex-ai-c.ml10(slot="reference")
            span.mr5 转出
            span.flex.flex-ai-c.out-acc
              i {{fromAcc}}
              i(v-bind:class="{'el-icon-caret-bottom': !outPopover, 'el-icon-caret-top': outPopover}")
            //- el-select(clearable v-model="f" style="width: 1.2rem" placeholder="无")
              el-option(v-for="(n, i) in froms" v-bind:label=" n.split(':')[0] " v-bind:value="i" v-if="n")

        | &nbsp;&nbsp;

        el-popover(placement="bottom" width="420" trigger="click" popper-class="account-popover" v-bind:visible-arrow="false" @show="inPopover = true" @hide="inPopover = false")
          acc-ls(v-bind:accHistory="inAccHistory" v-bind:froms="froms" trigerSource="in" @acc-choiced="accChoiced")
          span.flex.flex-ai-c.ml10(slot="reference")
            span.mr5 转入
            span.flex.flex-ai-c.in-acc
              i {{toAcc}}
              i(v-bind:class="{'el-icon-caret-bottom': !inPopover, 'el-icon-caret-top': inPopover}")
            //- el-select(clearable v-model="t" style="width: 1.2rem" placeholder="无")
              el-option(v-for="(n, i) in froms" v-bind:label=" n.split(':')[0] " v-bind:value="i" v-if="n")

        | &nbsp;&nbsp;


        label.item 状态
          el-select(clearable v-model="s" style="width: .8rem" placeholder="无")
            el-option(v-for="(n, i) in S" v-bind:label="n" v-bind:value="i" v-if="n")

        .ds-button.primary.large.bold(@click="getData" style="margin-left: .15rem;") 搜索
        //- .buttons(style="margin-left: .6rem; margin-top: .1rem")

      .table-list(style="padding: .15rem" stripe)

        el-table.header-bold.nopadding(:data="data"  style=""   ref="table" stripe v-bind:max-height=" MH ")

          el-table-column(class-name="pl2" prop="from" label="从...转出" )

          el-table-column(prop="to" label="转入到" )

          el-table-column(prop="time" label="时间" )

          el-table-column(prop="amount" label="金额" )

          el-table-column(prop="state" label="状态" )
            template(scope="scope")
              span(:class=" SC[scope.row.stateIndex] ") {{ S[scope.row.stateIndex] }}



        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import {dateTimeFormat} from '../../util/Date'
  import SearchConditions from 'components/SearchConditions'
  export default {
    name: 'BGTransaction',
    components: {
      'acc-ls': {
        data () {
          return {
            curAccIdx: -1,
            curHistoryIdx: -1
          }
        },
        props: ['accHistory', 'froms', 'trigerSource'],
        template: `<section>
          <section class="history-wp" v-show="accHistory.length > 0">
            <p>最近使用账户</p>
            <ul class="flex">
               <li v-for="(c, i) in accHistory" class="flex flex-ai-c flex-jt-c acc-item" v-bind:class="{selected: curHistoryIdx === i}" @click="choicedHistory(c, i, 'history')"> {{c.split(':')[0]}} </li>
            </ul>
          </section>
          <section class="all-acc-wp">
            <p>所有账户</p>
            <ul class="flex acc-ls-wp">
              <li v-for="(c, i) in froms" class="flex flex-ai-c flex-jt-c acc-item" v-bind:class="{'fixed-slted': i === 0, selected: curAccIdx === i}" @click="choiced(c, i)"> {{c.split(':')[0]}} </li>
            </ul>
          </section>
        </section>`,
        methods: {
          choiced (v, i) {
            this.curHistoryIdx = -1
            this.curAccIdx = i
            this.$emit('acc-choiced', i, this.trigerSource)
          },
          choicedHistory (v, i) {
            this.curAccIdx = -1
            this.curHistoryIdx = i
            let fromsIdx = this.froms.indexOf(v)
            this.$emit('acc-choiced', fromsIdx, this.trigerSource)
          }
        }
      },
      SearchConditions
    },
    mixins: [setTableMaxHeight],
    data () {
      return {
        stEt: [new Date().getTime() - 1000 * 3600 * 24 * 7, new Date()],
        // defaultStEt: [new Date(new Date().getTime() - 3600 * 1000 * 24), new Date(new Date().getTime())],
        // stEt: [new Date((new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate() + ' 00:00:00'), new Date((new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate() + ' 23:59:59')],
        // defaultStEt: ['', ''],
        // stEt: ['', ''],
        data: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        froms: [
          "主账户",
          "特殊账户",
          "BG账户:2",
          "开元账户:7",
          "PT账户:5",
          "AG账户:4",
          "沙巴账户:9",
          "乐游账户:15",
          "U赢账户:17",
          "KG账户:18",
          "微游账户:25",
          "平博账户:19",
          "LG账户:21",
          "幸运账户:22",
          // "财神账号:27",
          "GD账户:26",
          "德胜账户:28",
          "小艾账户:29",
          "SA账户:31",
          "SA电游账户:32",
          "OG账户:34",
          "欢乐账户:44"
          // 添加三方游需要调整
        ],
        f: "",
        t: "",
        S: ["失败", "成功", "处理中"],
        SC: ["text-danger", "text-green", "text-blue"],
        s: "",
        searchConditions: ["今天", "昨天", "前天", "最近一周"],
        quickDateIdx: -1,
        inAccHistory: [],
        outAccHistory: [],
        outPopover: false,
        inPopover: false
      };
    },
    watch: {
      // stEt: {
      //   deep: true,
      //   handler () {
      //     if (!this.stEt[0] && !this.stEt[1]) this.stEt = this.defaultStEt
      //     if ((window.newDate(this.stEt[0])).getTime() === (window.newDate(this.stEt[1])).getTime()) {
      //       this.stEt[1] = new Date((window.newDate(this.stEt[1])).getTime() + 3600 * 1000 * 24)
      //     }
      //   }
      // }
    },
    computed: {
      fromAcc () {
        return this.f !== '' ? this.froms[this.f].split(':')[0] : '无'
      },
      toAcc () {
        return this.t !== '' ? this.froms[this.t].split(':')[0] : '无'
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      pageChanged (cp) {
        this.getData(cp, () => {
          this.currentPage = cp
        })
      },
      getData (page, fn) {
        // this.processDate()
        // this.setOutAccHistory(this.froms[this.f])
        // this.setInAccHistory(this.froms[this.t])
        let loading = this.$loading({
          text: '转账记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            from: (this.froms[this.f] || '').split(':')[1] || this.f,
            to: (this.froms[this.t] || '').split(':')[1] || this.t,
            state: this.s,
            bgTm: this.stEt[0] ? dateTimeFormat(this.stEt[0]) : '',
            endTm: this.stEt[1] ? dateTimeFormat(this.stEt[1]) : '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.get(api.queryBalanceTransfer, this.preOptions).then(({data}) => {
          if (data && data.recordList) {
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.recordList
            this.total = data.totalSize || this.data.length
            if (this.preOptions.page === 1) {
              this.initHistory(data.recordList)
            }
          }
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      processDate () {
        if (this.quickDateIdx > -1) {
          let sDate = new Date()
          let daysConfig = {d0: 0, d1: 1, d2: 2, d3: 7}
          sDate.setDate(sDate.getDate() - daysConfig['d' + this.quickDateIdx])
          sDate.setHours(0)
          sDate.setMinutes(0)
          sDate.setSeconds(0)
          this.stEt = [sDate, new Date()]
        }
      },
      // setInAccHistory (acc) {
      //   if (!acc || this.inAccHistory.indexOf(acc) !== -1 || acc === '主账户') return
      //   this.inAccHistory.unshift(acc)
      //   if (this.inAccHistory.length > 3) this.inAccHistory.pop()
      // },
      // setOutAccHistory (acc) {
      //   if (!acc || this.outAccHistory.indexOf(acc) !== -1 || acc === '主账户') return
      //   this.outAccHistory.unshift(acc)
      //   if (this.outAccHistory.length > 3) this.outAccHistory.pop()
      // },
      setInAccHistory (acc) {
        if (!acc || this.inAccHistory.indexOf(acc) !== -1 || acc === '主账户' || this.inAccHistory.length >= 3) return
        this.inAccHistory.push(acc)
      },
      setOutAccHistory (acc) {
        if (!acc || this.outAccHistory.indexOf(acc) !== -1 || acc === '主账户' || this.outAccHistory.length >= 3) return
        this.outAccHistory.push(acc)
      },
      accChoiced (data, type) {
        if (type === 'out') this.f = data
        if (type === 'in') this.t = data
      },
      choicedSearchCondition (i, dates) {
        this.stEt = [dates.startDate, dates.endDate]
      },
      initHistory (data) {
        if (!data || data.length < 1) return
        let fromAccountIdx = 0
        let toAccountIdx = 0
        for (let i = 0; i < data.length; i++) {
          fromAccountIdx = this.froms.findIndex((acc) => {
            return data[i].from === acc.split(':')[0]
          })
          if (fromAccountIdx >= 0) {
            if (this.outAccHistory.length < 3) {
              this.setOutAccHistory(this.froms[fromAccountIdx])
            } else {
              break
            }
          }
        }
        for (let j = 0; j < data.length; j++) {
          toAccountIdx = this.froms.findIndex((acc) => {
            return data[j].to === acc.split(':')[0]
          })
          if (toAccountIdx >= 0) {
            if (this.inAccHistory.length < 3) {
              this.setInAccHistory(this.froms[toAccountIdx])
            } else {
              break
            }
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  i
    font-style normal
  .mr5
    margin-right 0.05rem
  .form
    padding PWX
    .item
      display inline-block
      // margin-top .1rem
      vertical-align top

  .form-filters
    display flex
    align-items center
    .el-button
      min-width 0.8rem
      height 0.3rem
      padding 0
    .el-button:focus,
    .el-button:hover
      border solid 1px #f37e0c
      color #666
    .el-button.selected
      background-image linear-gradient(0deg, #fff3e9 0%, #fffaf6 100%), linear-gradient(#f37e0c, #f37e0c)
      border solid 1px #f37e0c
    .ds-button
      border-radius 0.03rem

  .out-acc,
  .in-acc
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
  .account-popover
    background-color #fff !important
    padding 0.3rem 0.2rem
    ul,li
      list-style none
      margin 0
      padding 0
    .history-wp,
    .all-acc-wp
      &>p
        text-indent 0.05rem
        color #333333
        font-weight bold
    .history-wp
      margin-bottom 0.2rem
    .acc-ls-wp
      display flex
      justify-content space-between
      flex-wrap wrap
      &::after
        content ''
        flex 1
    .acc-item
      width 1.3rem
      height 0.3rem
      background-image linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%), linear-gradient(#000000, #000000)
      margin 0.05rem
      box-sizing border-box
      border-radius  0.03rem
      border solid 1px #e8e8e8
    .acc-item:hover
      border solid 1px #f37e0c
    .acc-item.selected
      background-image linear-gradient(0deg, #fff3e9 0%, #fffaf6 100%), linear-gradient(#000000, #000000) !important
      border solid 1px #f37e0c !important
    .acc-item.fixed-slted
      color #f37e0c
      background-image linear-gradient(0deg, #fff6c2 0%, #fff8d3 100%), linear-gradient(#000000, #000000)
      border solid 1px #dbd093
</style>
