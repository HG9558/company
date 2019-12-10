<template lang="jade">
  .follow-list
    .ds-button-group
        .ds-button.x-small.text-button(v-bind:class="{selected: tabIndex === 1}" @click="tabIndex = 1") 同倍追号
        .ds-button.x-small.text-button(v-bind:class="{selected: tabIndex === 2}" @click="tabIndex = 2") 翻倍追号
        .ds-button.x-small.text-button(v-bind:class="{selected: tabIndex === 3}" @click="tabIndex = 3" v-if="nsl === 1") 利润率追号
    .form
      | 追号期数：
        

      el-autocomplete.inline-input(v-model=" nper_copy " v-bind:fetch-suggestions=" getNpers " placeholder="请选择追号期数" style="width: .5rem;")

      //- el-select(v-model="nper")
        el-option(v-for="i in npers" v-bind:label="i + '期' " v-bind:value="i")

      |  &nbsp;&nbsp;起始倍数：
      el-input-number.center.times.my-center(v-model="times" v-bind:min="1" v-bind:max="10000")
      |  倍
      span(v-if="tabIndex == 2") &nbsp;&nbsp;&nbsp;&nbsp;倍数 
        span(style="font-size: 9px") X&nbsp;&nbsp;
        el-input-number.center.times( v-model="xtimes" v-bind:min="1" v-bind:max="100")
      span(v-if="tabIndex === 3 && nsl === 1")
        | &nbsp;&nbsp;最低收益：
        el-input-number.center.get(v-model="get")
        |  %
    el-table.ghost(:data="data" stripe max-height="350" min-width="400" @selection-change="getSelection" ref="multipleTable" style="margin-bottom: 0")

      el-table-column(width="80"  type="selection")

      el-table-column(prop="issue" label="投注编号" width="200" inline-template)
        span {{ row.issue + (row.issue === CNPER? '(当前期)' : '期' ) }}
      el-table-column(prop="times" label="倍数" width="150" align="center" inline-template)
        el-input-number.center.blue(v-model="row.times"  v-bind:min="1" v-bind:max="10000" style="width: .75rem")
      el-table-column(prop="payV" label="金额" width="200" align="right"  inline-template)
        span 
          span.pay {{ (row.times * pay).toFixed(3) }}
          | &nbsp;元
      el-table-column(prop="saleend" label="开奖时间" align="center" )


</template>

<script>
  import {getTimesArray} from '../util/Number'
  export default {
    props: {
      // 当前起始期数
      FCNPER: String,
      // 当前期数
      CNPER: String,
      pay: Number,
      ns: Array,
      nsl: Number,
      // type: Number,
      // t: Number,
      // point: Number,
      // dates: Array,
      issues: Array
    },
    data () {
      return {
        nper_copy: '5',
        npers: [5, 10, 15, 20, 25, 30, 50, 100, 120],
        nperss: [
          {label: '5 期', value: '5'},
          {label: '10 期', value: '10'},
          {label: '15 期', value: '15'},
          {label: '20 期', value: '20'},
          {label: '25 期', value: '25'},
          {label: '30 期', value: '30'},
          {label: '50 期', value: '50'},
          {label: '100 期', value: '100'},
          {label: '120 期', value: '120'}
        ],
        times: 1,
        xtimes: 2,
        get: 50,
        tabIndex: 1,
        selection: [],
        ta: []
      }
    },
    computed: {
      nper () {
        return Number(this.nper_copy) || 0
      },
      // data () {
      //   return Array(this.nper).fill(0).map((d, index) => {
      //     return (d = {
      //       NPER: this.FCNPER + index,
      //       times: this.tabIndex === 2 ? this.times * Math.pow(2, index) : this.times,
      //       date: (this.dates.find(d => d.issue === String((this.FCNPER + index))) || {}).saleend || '获取开奖时间失败'
      //     })
      //   })
      // },
      data () {
        let ii = this.issues.findIndex(i => i.issue === this.FCNPER)
        return this.issues.slice(ii, ii + this.nper).map((iii, index) => {
          // iii.times = this.tabIndex === 2 ? this.times * Math.pow(2, index) : this.times
          // iii.selected = false
          // iii.payV = (iii.times * this.pay).toFixed(3)
          // this.$set(iii, 'times', this.tabIndex === 2 ? this.times * Math.pow(2, index) : this.times)
          // this.$set(iii, 'selected', false)
          // return iii
          return (iii = {
            issue: iii.issue,
            times: this.tabIndex === 3 ? this.ta[index] || 0 : this.tabIndex === 2 ? this.times * Math.pow(this.xtimes, index) : this.times,
            saleend: iii.saleend
          })
        })
      },
      PAY () {
        let pay = 0
        this.selection.forEach(d => {
          pay += d.times * this.pay
        })
        return pay
      }
    },
    mounted () {
      this.$emit('set-follow', {NPER: this.selection.length, pay: this.PAY})
      // this.times = this.t
      // this.get = this.point
    },
    watch: {
      data () {
        setTimeout(() => {
          this.selectAll()
        }, 100)
      },
      PAY () {
        this.$emit('set-follow', {NPER: this.selection.length, pay: this.PAY})
      },
      tabIndex () {
        this.$emit('set-follow', {type: this.tabIndex})
        this.setTa()
      },
      nsl () {
        if (this.nsl !== 1 && this.tabIndex === 3) {
          this.tabIndex = 1
        }
      },
      xtimes () {
        setTimeout(() => {
          this.xtimes = Math.floor(this.xtimes)
        })
      },
      times () {
        setTimeout(() => {
          this.times = Math.floor(this.times)
          this.$emit('set-follow', {t: this.times})
        })
        this.setTa()
      },
      get () {
        if (this.tabIndex === 3 && this.get > 0) this.adjustList()
        this.$emit('set-follow', {point: this.get / 100})
        this.setTa()
      },
      selection () {
        this.$emit('set-follow', {items: this.selection})
      },
      nper () {
        this.setTa()
      }
    },
    methods: {
      getNpers (s, cb) {
        // cb(this.nperss.filter(x => String(x.value).indexOf(s) !== -1))
        cb(this.nperss)
      },
      selectAll () {
        this.data.forEach(row => {
          // console.log('rowowowo')
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      },
      setTa () {
        if (this.tabIndex === 3) {
          // let getTimesArray = (min, rate, len, capital, reward) => {
          let ta = getTimesArray(this.times, this.get / 100, this.nper, this.pay, (this.ns[0] || {}).bonus.replace(',', ''))
          // console.info(ta);
          this.ta = ta.length === this.nper ? ta : []
          if (this.ta.length !== this.nper) {
            this.$modal.warn({
              content: '无法达到该利润率',
              btn: ['确定'],
              target: this.$el.parentNode
            })
          }
        }
      },
      getSelection (selection) {
        this.selection = selection.slice()
      },
      change () {
        this.$emit('set-follow', {NPER: this.selection.length, pay: this.getPay()})
      },
      getPay () {
        let pay = 0
        this.selection.forEach(d => {
          pay += d.times * this.pay
        })
        return pay
      },
      // 根据利润率调整各期倍数
      adjustList () {}
    }
  }
</script>

<style lang="stylus">
  H = 3.5rem
  s = .3rem
  
      
</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .follow-list
    text-align center
    background-color #fff
    .el-button-group
      padding PW
  .el-button
    background-color transparent
  .form
    padding 0 PWX
    text-align left
    color #666
    .el-select
      width 1.2rem
    .el-input
      display inline-block
      width .5rem

  .el-input-number
    width .5rem
    vertical-align middle
    text-align center
    &.get
      width .6rem
    &.blue
      color BLUE
  .pay
    color BLUE
    
  
  
  .el-table
    text-align left

</style>
 
