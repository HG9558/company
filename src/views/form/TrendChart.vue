<template lang="jade">
  .trend-chart-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .game-info()
      .wrap
        .left(:span="4" style="min-width: 1.8rem" v-bind:class=" gg.class ")
          .item 
            el-select(v-model="game" style="width: 1.5rem")
              el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")

        .right(:span="20")
          .item 
            .ds-checkbox-label(:class="{ active: polyline }" @click=" polyline = !polyline ")
              .ds-checkbox
              |  折线
            | &nbsp;&nbsp;
            .ds-checkbox-label(:class="{ active: shown }" @click=" shown = !shown")
              .ds-checkbox
              |  遗漏
            // | &nbsp;&nbsp;
            // .ds-checkbox-label(:class="{ active: quick }" @click=" quick = !quick")
            //   .ds-checkbox
            //   |  简易
            .ds-button.text-button.blue(@click="size = 30") 最近30期
            .ds-button.text-button.blue(@click="size = 50") 最近50期
            .ds-button.text-button.blue(@click=" size = 100 ") 最近100期
            .ds-button.text-button.blue(@click=" size = 120 ") 最近120期
            .ds-button.text-button.blue(@click=" st = lyd ") 前天
            .ds-button.text-button.blue(@click=" st = yd ") 昨天
            .ds-button.text-button.blue(@click=" st = td ") 今天

          .item 时间范围  
            el-date-picker( :picker-options="pickerOptions" v-model="st" type="date" placeholder="选择日期")
            

          .item
            .ds-button.primary 搜索

    .trend-chart.scroll-content
      
      // quick
      .quick(v-show="quick")
        el-table.nopadding.header-bold.has-border(:data="myData" border v-bind:row-class-name="tableRowClassName" stripe max-height="8rem")
          el-table-column(prop="belongdate" label="时间" width="180" align="center" class-name="bg-white")
          el-table-column(prop="issue" label="期号" width="80" align="center" class-name="bg-white")
          el-table-column(prop="code" label="开奖号码" align="center" class-name="bg-white")
      

      .chart(style="position: relative; display: inline-block;" v-show="!quick")

        // el-table.nopadding.header-bold.has-border(:data="data" border v-bind:row-class-name="tableRowClassName")
        //   el-table-column(prop="issue" label="期号" width="100" align="center" class-name="bg-white")
        //   el-table-column(v-for="(P, k) in PS" v-bind:label="P.title" align="center" v-bind:class-name=" k % 2 === 0 ? 'bg-light-blue' : 'bg-light-danger' ")
        //     el-table-column(align="center" width="30" v-for="(n, i) in P.numbers" v-bind:label="n+'' " v-bind:class-name=" (i % 2 === 0 ? 'bg-light-blue' : 'bg-light-danger')")
        //       template(scope="scope")
        //         div
        //           span(:class="[ scope.row.numbers && scope.row.numbers[i + k*12].class ]") {{ scope.row.numbers ? scope.row.numbers[i + k*12].n: 0 }}

        el-table.trend-table.nopadding.header-bold.has-border(:data="myData" border v-bind:row-class-name="tableRowClassName")
          el-table-column(:resizable=" resizable " prop="issue" label="期号" width="80" align="center" class-name="bg-white")
          el-table-column(:resizable=" resizable " prop="code" label="开奖号码" v-bind:width="pl > 5 ? 140 : 80" align="center" class-name="bg-white")
          el-table-column(:resizable=" resizable " v-for="(P, k) in PS" v-bind:label="P.title" align="center" v-bind:class-name=" k % 2 === 0 ? 'bg-light-blue' : 'bg-light-danger' ")
            el-table-column(:resizable=" resizable " align="center" width="25" v-for="(n, i) in P.numbers" v-bind:label="n+'' " v-bind:class-name=" (k % 2 === 0 ? 'bg-light-blue' : 'bg-light-danger')")
              template(scope="scope")
                div
                  span(:class="{ball: i === parseInt(scope.row.code.split(',')[k]), danger: k % 2 !== 0  }" v-show=" i === parseInt(scope.row.code.split(',')[k]) || shown ") {{ i === parseInt(scope.row.code.split(',')[k]) ? i : scope.row.misseddata[k] && scope.row.misseddata[k]['d' + i] || ''}}

        
        svg(width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" v-bind:style="svgstyle" v-show="polyline")
          polyline(fill="none"  v-for="(l, i) in lines" v-bind:points="l" v-bind:stroke="i % 2 === 0 ? '#1a9ff3' : '#ff5f6a' " )
          // polyline(fill="none"  v-for="(l, i) in lines" v-bind:points="l" v-bind:stroke="i % 2 === 0 ? '#89d2ff' : '#ff7f8a' " )

        el-table.nopadding.header-bold.has-border(:data="fData" border v-bind:row-class-name="tableRowClassName"  v-bind:show-header="false" style="position: relative; top: -5px;")
          el-table-column(:resizable=" resizable " prop="issue" label="期号" v-bind:width="pl > 5 ? 220 : 160" align="center")
          el-table-column(:resizable=" resizable " v-for="(P, k) in PS" v-bind:label="P.title" align="center" )
            el-table-column(:resizable=" resizable " align="center" width="25" v-for="(n, i) in P.numbers" v-bind:label="n+'' ")
              template(scope="scope")
                div
                  span(v-if="!scope.row.total") {{ scope.row.numbers ? scope.row.numbers[k*12 + i].n || '' : '' }}
                  span(v-if="scope.row.total") {{ scope.row.numbers ? (scope.row.numbers[k*12 + i].n / scope.row.total) > 0 ? (scope.row.numbers[k*12 + i].n / scope.row.total).toFixed(0) : '' : '' }}
                  // span(v-if="scope.row.total") {{ scope.row.numbers.length }} {{ k * 12 + i }} 
    // .result(style="position: absolute; bottom: -5px; left: .2rem; right: .2rem; overflow: hidden")
</template>

<script>
import api from '../../http/api'
import util from '../../util'
import { dateFormat } from '../../util/Date'
import store from '../../store'
export default {
  data () {
    return {
      // dateTimeFormat: dateTimeFormat,
      // dateFormat: dateFormat,
      quick: false,
      size: 100,
      st: '',
      td: new Date(new Date().getTime()),
      yd: new Date((new Date().getTime()) - 3600 * 24 * 1000),
      lyd: new Date((new Date().getTime()) - 3600 * 24 * 2 * 1000),
      resizable: false,
      gameList: [],
      game: {lotteryId: 0},
      polyline: true,
      shown: true,
      pickerOptions: {
        // shortcuts: [{
        //   text: '最近一周',
        //   onClick (picker) {
        //     const end = new Date()
        //     const start = new Date()
        //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        //     picker.$emit('pick', [start, end])
        //   }
        // }, {
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
        // }],
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      stEt: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date(new Date().getTime())],
      PPS: [
        {title: '第一位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第二位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第三位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第四位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第五位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第六位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第七位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第八位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第九位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
        {title: '第十位', numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
      ],
      pl: 5,
      // line 遗漏
      type: 0,
      // data: [
      // ],
      myData: [],
      fData: [
        {issue: '出现总次数', myClass: 'bg-white border-top', numbers: Array(120).fill(0).map(n => (n = {n: 0}))},
        {total: 1, issue: '平均遗漏值', myClass: 'bg-white ', numbers: Array(120).fill(0).map(n => (n = {n: 0}))},
        {issue: '最大遗漏值', myClass: 'bg-white', numbers: Array(120).fill(0).map(n => (n = {n: 0}))},
        {issue: '最大连出值', myClass: 'bg-white', numbers: Array(120).fill(0).map(n => (n = {n: 0}))}
      ],
      lines: [],
      x: 1
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'openRoute',
    gameid () {
      this.trendData()
    },
    size () {
      if (this.st) this.st = ''
      this.trendData()
    },
    st () {
      if (this.st) this.trendData()
      this.size = 0
    }
  },
  computed: {
    gg () {
      return this.gameList.filter(x => String(x.lotteryId) === String(this.game))[0] || {}
    },
    PS () {
      return this.PPS.slice(0, this.pl)
    },
    gameid () {
      return this.game
    },
    svgstyle () {
      return {
        position: 'absolute',
        left: (this.pl > 5 ? 225 : 165) + 'px',
        top: 69 * this.x + 'px'
      }
    }
    // Cdata () {
    //   return this.myData.map(c => {
    //     return {
    //       issue: c.issue,
    //       numbers: c.misseddata.replace(/\[/g, '').replace(/]/g, '').replace(/\{/g, '').replace(/\},/g, ',')
    //     }
    //   })
    // }
  },
  created () {
    // this.data = []
    // for (let i = 18820; i < 18830; i++) {
    //   let o = {issue: i, numbers: [], myClass: 'text-bbb'}
    //   let k = i - 18820
    //   for (let j = 0; j < 50; j++) {
    //     // o['prop' + j] = j
    //     o.numbers.push({n: j, class: (j + k) === 1 || (j + k) === 10 || (j + k) === 20 || (j + k) === 30 || (j + k) === 40 || (j + k) === 50 ? 'ball' : ''})
    //   }
    //   this.data.push(o)
    // }
    // this.data.push({issue: '出现总次数', myClass: 'bg-white border-top'})
    // this.data.push({issue: '平均遗漏值', myClass: 'bg-white '})
    // this.data.push({issue: '最大遗漏值', myClass: 'bg-white'})
    // this.data.push({issue: '最大连出值', myClass: 'bg-white '})
    // this.data.forEach((d, j) => {
    //   d.numbers && d.numbers.forEach((s, i) => {
    //     if (s.class !== 'ball') return false
    //     if (i < 10) {
    //       !this.lines[0] && (this.lines[0] = '')
    //       this.lines[0] += 30.5 * (i + 0.5) + ',' + (34 * j + 15) + ' '
    //     } else if (i < 20) {
    //       !this.lines[1] && (this.lines[1] = '')
    //       this.lines[1] += 30.4 * (i + 0.5) + ',' + (34 * j + 15) + ' '
    //     } else if (i < 30) {
    //       !this.lines[2] && (this.lines[2] = '')
    //       this.lines[2] += 30.3 * (i + 0.5) + ',' + (34 * j + 15) + ' '
    //     } else if (i < 40) {
    //       !this.lines[3] && (this.lines[3] = '')
    //       this.lines[3] += 30.2 * (i + 0.5) + ',' + (34 * j + 15) + ' '
    //     } else if (i < 50) {
    //       !this.lines[4] && (this.lines[4] = '')
    //       this.lines[4] += 30.1 * (i + 0.5) + ',' + (34 * j + 15) + ' '
    //     }
    //   })
    // })
  },
  mounted () {
    util.addEvent('resize', window, () => {
      !((this.W > 900) === (window.document.body.clientHeight > 900)) && this.draw((window.document.body.clientHeight > 900 ? 1 : 0.9))
    })
    this.getLotterys()
    this.$route.query.gameid && (this.game = parseInt(this.$route.query.gameid))
  },
  methods: {
    draw (x) {
      this.x = x
      this.lines = []
      // console.log(this.fData[0].numbers[10].n, '*************************')
      this.myData.forEach((d, j) => {
        d.code.split(',').forEach((s, i) => {
          !this.lines[i] && (this.lines[i] = '')
          // width height 30*30
          // this.lines[i] += 30.5 * (parseInt(s) + 11.8 * i + 0.5) + ',' + (35 * j + 15) + ' '
          // width height 25*25
          this.lines[i] += 24.99 * (parseInt(s) + (12 * i) + 0.5 + ((i === 1) ? 0.2 * i : 0)) + ',' + ((19.9 * x + (j - 1) / (j + 1) + 0.05) * j + 14 * x) + ' '
          // 总出现
          // this.$set(this.fData[0].numbers, i * 12 + parseInt(s), parseInt(s))
          // if (i === 1) {
          //   console.log(s, i * 12 + parseInt(s), this.fData[0].numbers[i * 12 + parseInt(s)].n)
          // }
          // this.fData[0].numbers[i * 12 + parseInt(s)].n += 1
          // // 最大连出值
          // if (this.fData[3].numbers[i * 12 + parseInt(s)].i === j - 1) {
          //   this.fData[3].numbers[i * 12 + parseInt(s)].temp += 1
          //   this.fData[3].numbers[i * 12 + parseInt(s)].i = j
          // } else {
          //   this.fData[3].numbers[i * 12 + parseInt(s)].temp = 1
          //   this.fData[3].numbers[i * 12 + parseInt(s)].i = j
          // }
          // if (this.fData[3].numbers[i * 12 + parseInt(s)].temp > this.fData[3].numbers[i * 12 + parseInt(s)].n) {
          //   this.fData[3].numbers[i * 12 + parseInt(s)].n = this.fData[3].numbers[i * 12 + parseInt(s)].temp
          // }
        })
      })
    },
    openRoute ({path, query: {gameid}}) {
      // if (path !== '/form/4-5-3') return false
      if (gameid) {
        this.game = gameid
        // TODO update data
      }
    },
    tableRowClassName (row, i) {
      return row.myClass
    },
    getLotterys () {
      this.$http.get(api.getLotterys).then(({data}) => {
        // success
        if (data.success === 1) {
          data.lotteryList.forEach(d => {
            d.class = (store.state.pages.find(p => p.gameid === d.lotteryId) || {}).class
            // if (this.game && (this.game + '') === (d.lotteryId + '')) {
              // this.gg = d
            // }
          })
          this.gameList = data.lotteryList
          // if (!this.game) {
          //   this.gg = this.gameList[0]
          // }
        }
      }, (rep) => {
        // error
      })
    },
    trendData () {
      let loading = this.$loading({
        text: '数据查询中...',
        target: this.$el
      }, 10000, '数据查询超时...')
      this.$http.get(api.trendData, {id: this.gameid, size: this.st ? '' : this.size, date: this.st ? dateFormat((window.newDate(this.st)).getTime(), 6).replace(/[\s-]*/g, '') : ''}).then(({data}) => {
        // success
        if (data.success === 1) {
          if (data.items[0] && data.items[0].code) this.pl = Math.max(data.items[0].code.split(',').length, this.pl)
          this.fData[0].numbers = Array(120).fill(0).map(n => (n = {n: 0}))
          this.fData[1].numbers = Array(120).fill(0).map(n => (n = {n: 0}))
          this.fData[2].numbers = Array(120).fill(0).map(n => (n = {n: 0}))
          this.fData[3].numbers = Array(120).fill(0).map(n => (n = {n: 0}))
          data.items.forEach(d => {
            d.misseddata = JSON.parse(d.misseddata)
            d.myClass = 'text-bbb'
            // d.series = JSON.parse(d.series)
            // d.totalmissed = JSON.parse(d.totalmissed)
            // d.totalseries = JSON.parse(d.totalseries)
            d.misseddata.forEach((s, i) => {
              Object.keys(s).forEach((key) => {
                // if (i * 10 + parseInt(key.replace(/[a-zA-Z]/g, '')) === 6) console.log(s[key])
                // 平均遗漏值
                this.fData[1].numbers[i * 12 + parseInt(key.replace(/[a-zA-Z]/g, ''))].n += parseInt(s[key])
                // 最大遗漏值
                parseInt(s[key]) > this.fData[2].numbers[i * 12 + parseInt(key.replace(/[a-zA-Z]/g, ''))].n && (this.fData[2].numbers[i * 12 + parseInt(key.replace(/[a-zA-Z]/g, ''))].n = parseInt(s[key]))
              })
            })
          })
          this.fData[1].total = data.items.length
          this.myData = data.items
          this.lines = []
          // console.log(this.fData[0].numbers[10].n, '*************************')
          this.draw((window.document.body.clientHeight > 900 ? 1 : 0.9))
          this.myData.forEach((d, j) => {
            d.code.split(',').forEach((s, i) => {
              // !this.lines[i] && (this.lines[i] = '')
              // width height 30*30
              // this.lines[i] += 30.5 * (parseInt(s) + 11.8 * i + 0.5) + ',' + (35 * j + 15) + ' '
              // width height 25*25
              // this.lines[i] += 24.46 * (parseInt(s) + (12.25 * i) + 0.5) + ',' + ((30 + (j - 1) / (j + 1)) * j + 15) + ' '
              // 总出现
              // this.$set(this.fData[0].numbers, i * 12 + parseInt(s), parseInt(s))
              // if (i === 1) {
              //   console.log(s, i * 12 + parseInt(s), this.fData[0].numbers[i * 12 + parseInt(s)].n)
              // }
              this.fData[0].numbers[i * 12 + parseInt(s)].n += 1
              // 最大连出值
              if (this.fData[3].numbers[i * 12 + parseInt(s)].i === j - 1) {
                this.fData[3].numbers[i * 12 + parseInt(s)].temp += 1
                this.fData[3].numbers[i * 12 + parseInt(s)].i = j
              } else {
                this.fData[3].numbers[i * 12 + parseInt(s)].temp = 1
                this.fData[3].numbers[i * 12 + parseInt(s)].i = j
              }
              if (this.fData[3].numbers[i * 12 + parseInt(s)].temp > this.fData[3].numbers[i * 12 + parseInt(s)].n) {
                this.fData[3].numbers[i * 12 + parseInt(s)].n = this.fData[3].numbers[i * 12 + parseInt(s)].temp
              }
            })
          })
          setTimeout(() => {
            loading.text = '查询成功!'
          }, 100)
          // this.gameList = data.lotteryList
        } else loading.text = '查询失败!'
      }, (rep) => {
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 1000)
      })
    }
  },
  components: {
  }
}
</script>


<style lang="stylus">
.app.night .trend-chart-page
  BC = #999
  BOC = #000
  .el-table
    // color BC
    border-color BOC
    thead
    table
    th
    tr
    td
      background-color #333
      border-color BOC
      color BC
      
    .bg-light-blue
      background-color #666
      // color #ccc
    .bg-light-danger
      background-color #555
      // color #ccc
      
    .bg-white
      background-color #333
      border-color BOC
      color BC
  
</style>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  H = 1rem
  .el-table
    font-size .1rem
  .scroll-content
    overflow-x auto
    top 1.3rem
    // bottom TH * 1.7
  .game-info
    text-align left
    padding PWX
    .text-button
      padding 0 .05rem
    

  .trend-chart
    padding 0 PWX 
    text-align center
    .chart
      // min-width 14.4rem
      .el-row
        height .4rem
        line-height .4rem
        &.header
          height .8rem
          color #333
          font-weight bold
          border-top 1px solid #d4d4d4
          &:first-child
            line-height .8rem
      .el-row
          border-bottom 1px solid #d4d4d4
      .el-col
        text-align center
        height 100%
        border-right 1px solid #e6e6e6
        
        
  .ds-icon-item
    background-position .2rem .2rem
  .item
    display inline-block
    margin .1rem PW
  
  .wrap
    margin 0 auto
    max-width 1300px

  .left
  .right
    display inline-block
    vertical-align top

  .left
    width 2.6rem
    padding-top .65rem
    background-position top center
    background-repeat no-repeat
    for n, i in chq xj tj hlj hlffc cb120 ffctx ffc_aly '11ydj' jx115 gd hb115 js115 sh115 ah115 kt115 kt115 ahK3 jsK3 jlK3 bjK3 xfK3 bjpk10 pk10sc pk10ft kl8 fc hl3d shssl pl35 lhc lhc pcdd wbwfc hnwfc hnyfc txsc alysc tx2fcjs tx2fcos cqhjssc hlsx_cq xjhjssc cqhjffc fj115 fjK3 sx115 ffc_qq ln115
      &.ds-icon-game-{n}
        background-image url('../../assets/gameheader/ng/' + n '.png')
</style>

