<template lang="jade">
  .ludan-view(v-show="show")
    el-row(class="tb-wp flex")
      el-col(v-for="(c, i) in maxColumns" v-bind:key="i")
        template(v-for="(r, j) in maxRows")

          div(class="tb-cell flex ai-c jc-c" v-bind:key="j" v-if="j === maxRows.length - 1")
            span(class="open-item txt-c" v-bind:class="getCellStyle(ludanList, i, j)" )
              {{getCellData(ludanList, i, j) | cellData}}

          div(class="tb-cell flex ai-c jc-c" v-bind:key="j" v-else)
            span(class="open-item txt-c" v-bind:class="getCellStyle(ludanList, i, j)" )
              {{getCellData(ludanList, i, j) | cellData}}

</template>

<script>
import api from '../http/api'
const LOTTERY_TYPES = {
  SSC: 'SSC',
  G11X5: 'G115',
  PK10: 'PK10',
  K3: 'K3'
}
export default {
  name: 'ludan',
  data() {
    return {
      ludanMethods: [
        {id: '1', title: '总和大小', methodId: '1251', method: 'zh_dx', type: LOTTERY_TYPES.SSC},
        {id: '2', title: '总和单双', methodId: '1251', method: 'zh_ds', type: LOTTERY_TYPES.SSC},
        {id: '14', title: '万千龙虎和', methodId: '1200', method: '1v2', type: LOTTERY_TYPES.SSC},
        {id: '15', title: '万百龙虎和', methodId: '1200', method: '1v3', type: LOTTERY_TYPES.SSC},
        {id: '16', title: '万十龙虎和', methodId: '1200', method: '1v4', type: LOTTERY_TYPES.SSC},
        {id: '17', title: '万个龙虎和', methodId: '1200', method: '1v5', type: LOTTERY_TYPES.SSC},
        {id: '18', title: '千百龙虎和', methodId: '1200', method: '2v3', type: LOTTERY_TYPES.SSC},
        {id: '19', title: '千十龙虎和', methodId: '1200', method: '2v4', type: LOTTERY_TYPES.SSC},
        {id: '20', title: '千个龙虎和', methodId: '1200', method: '2v5', type: LOTTERY_TYPES.SSC},
        {id: '21', title: '百十龙虎和', methodId: '1200', method: '3v4', type: LOTTERY_TYPES.SSC},
        {id: '22', title: '百个龙虎和', methodId: '1200', method: '3v5', type: LOTTERY_TYPES.SSC},
        {id: '23', title: '十个龙虎和', methodId: '1200', method: '4v5', type: LOTTERY_TYPES.SSC},
        {id: '4', title: '万位大小', methodId: '1250', method: 'ww_dx', type: LOTTERY_TYPES.SSC, pos: 0},
        {id: '5', title: '万位单双', methodId: '1250', method: 'ww_ds', type: LOTTERY_TYPES.SSC, pos: 0},
        {id: '6', title: '千位大小', methodId: '1250', method: 'qw_dx', type: LOTTERY_TYPES.SSC, pos: 1},
        {id: '7', title: '千位单双', methodId: '1250', method: 'qw_ds', type: LOTTERY_TYPES.SSC, pos: 1},
        {id: '8', title: '百位大小', methodId: '1250', method: 'bw_dx', type: LOTTERY_TYPES.SSC, pos: 2},
        {id: '9', title: '百位单双', methodId: '1250', method: 'bw_ds', type: LOTTERY_TYPES.SSC, pos: 2},
        {id: '10', title: '十位大小', methodId: '1250', method: 'sw_dx', type: LOTTERY_TYPES.SSC, pos: 3},
        {id: '11', title: '十位单双', methodId: '1250', method: 'sw_ds', type: LOTTERY_TYPES.SSC, pos: 3},
        {id: '12', title: '个位大小', methodId: '1250', method: 'gw_dx', type: LOTTERY_TYPES.SSC, pos: 4},
        {id: '13', title: '个位单双', methodId: '1250', method: 'gw_ds', type: LOTTERY_TYPES.SSC, pos: 4},

        {id: '50', title: '总和大小', methodId: '2050', method: 'zh_dx', type: LOTTERY_TYPES.G11X5},
        {id: '51', title: '总和单双', methodId: '2050', method: 'zh_ds', type: LOTTERY_TYPES.G11X5},
        {id: '52', title: '总和尾大小', methodId: '2050', method: 'zhw_wsdx', type: LOTTERY_TYPES.G11X5},
        {id: '53', title: '总和尾单双', methodId: '2050', method: 'zhw_wsds', type: LOTTERY_TYPES.G11X5},
        {id: '55', title: '龙虎', methodId: '2053', method: 'wg_lhh', type: LOTTERY_TYPES.G11X5},
        {id: '56', title: '第一位大小', methodId: '2051', method: 'ww_dx', type: LOTTERY_TYPES.G11X5, pos: 0},
        {id: '57', title: '第一位单双', methodId: '2051', method: 'ww_ds', type: LOTTERY_TYPES.G11X5, pos: 0},
        {id: '58', title: '第二位大小', methodId: '2051', method: 'qw_dx', type: LOTTERY_TYPES.G11X5, pos: 1},
        {id: '59', title: '第二位单双', methodId: '2051', method: 'qw_ds', type: LOTTERY_TYPES.G11X5, pos: 1},
        {id: '60', title: '第三位大小', methodId: '2051', method: 'bw_dx', type: LOTTERY_TYPES.G11X5, pos: 2},
        {id: '61', title: '第三位单双', methodId: '2051', method: 'bw_ds', type: LOTTERY_TYPES.G11X5, pos: 2},
        {id: '62', title: '第四位大小', methodId: '2051', method: 'sw_dx', type: LOTTERY_TYPES.G11X5, pos: 3},
        {id: '63', title: '第四位单双', methodId: '2051', method: 'sw_ds', type: LOTTERY_TYPES.G11X5, pos: 3},
        {id: '64', title: '第五位大小', methodId: '2051', method: 'gw_dx', type: LOTTERY_TYPES.G11X5, pos: 4},
        {id: '65', title: '第五位单双', methodId: '2051', method: 'gw_ds', type: LOTTERY_TYPES.G11X5, pos: 4},
        {id: '67', title: '万千龙虎和', methodId: '2035', method: '1v2', type: LOTTERY_TYPES.G11X5},
        {id: '68', title: '万百龙虎和', methodId: '2035', method: '1v3', type: LOTTERY_TYPES.G11X5},
        {id: '69', title: '万十龙虎和', methodId: '2035', method: '1v4', type: LOTTERY_TYPES.G11X5},
        {id: '70', title: '万个龙虎和', methodId: '2035', method: '1v5', type: LOTTERY_TYPES.G11X5},
        {id: '71', title: '千百龙虎和', methodId: '2035', method: '2v3', type: LOTTERY_TYPES.G11X5},
        {id: '72', title: '千十龙虎和', methodId: '2035', method: '2v4', type: LOTTERY_TYPES.G11X5},
        {id: '73', title: '千个龙虎和', methodId: '2035', method: '2v5', type: LOTTERY_TYPES.G11X5},
        {id: '74', title: '百十龙虎和', methodId: '2035', method: '3v4', type: LOTTERY_TYPES.G11X5},
        {id: '75', title: '百个龙虎和', methodId: '2035', method: '3v5', type: LOTTERY_TYPES.G11X5},
        {id: '76', title: '十个龙虎和', methodId: '2035', method: '4v5', type: LOTTERY_TYPES.G11X5},

        {id: '100', title: '冠亚和大小', methodId: '4050', method: 'zh_dx', type: LOTTERY_TYPES.PK10},
        {id: '101', title: '冠亚和单双', methodId: '4050', method: 'zh_ds', type: LOTTERY_TYPES.PK10},
        {id: '102', title: '冠军大小', methodId: '4053', method: 'ww_dx', type: LOTTERY_TYPES.PK10, pos: 0},
        {id: '103', title: '冠军单双', methodId: '4053', method: 'ww_ds', type: LOTTERY_TYPES.PK10, pos: 0},
        {id: '104', title: '亚军大小', methodId: '4053', method: 'qw_dx', type: LOTTERY_TYPES.PK10, pos: 1},
        {id: '105', title: '亚军单双', methodId: '4053', method: 'qw_ds', type: LOTTERY_TYPES.PK10, pos: 1},
        {id: '106', title: '季军大小', methodId: '4053', method: 'bw_dx', type: LOTTERY_TYPES.PK10, pos: 2},
        {id: '107', title: '季军单双', methodId: '4053', method: 'bw_ds', type: LOTTERY_TYPES.PK10, pos: 2},
        {id: '108', title: '第四位大小', methodId: '4053', method: 'sw_dx', type: LOTTERY_TYPES.PK10, pos: 3},
        {id: '109', title: '第四位单双', methodId: '4053', method: 'sw_ds', type: LOTTERY_TYPES.PK10, pos: 3},
        {id: '110', title: '第五位大小', methodId: '4053', method: 'gw_dx', type: LOTTERY_TYPES.PK10, pos: 4},
        {id: '111', title: '第五位单双', methodId: '4053', method: 'gw_ds', type: LOTTERY_TYPES.PK10, pos: 4},
        {id: '112', title: '冠军vs第十名龙虎', methodId: '4011', method: '1v10', type: LOTTERY_TYPES.PK10},
        {id: '113', title: '亚军vs第九名龙虎', methodId: '4011', method: '2v9', type: LOTTERY_TYPES.PK10},
        {id: '114', title: '季军vs第八名龙虎', methodId: '4011', method: '3v8', type: LOTTERY_TYPES.PK10},
        {id: '115', title: '第四名vs第七名龙虎', methodId: '4011', method: '4v7', type: LOTTERY_TYPES.PK10},
        {id: '116', title: '第五名vs第六名龙虎', methodId: '4011', method: '5v6', type: LOTTERY_TYPES.PK10},

        {id: '200', title: '大小', methodId: '5018', method: 'zh_dx', type: LOTTERY_TYPES.K3},
        {id: '201', title: '单双', methodId: '5018', method: 'zh_ds', type: LOTTERY_TYPES.K3}

      ],
      ludanList: []
    }
  },
  props: {
    maxColumns: {
      type: Number,
      default: 40
    },
    maxRows: {
      type: Number,
      default: 6
    },
    gameType: String,
    gameid: Number,
    issueList: Array,
    methodName: String,
    show: {
      type: Boolean,
      default: true
    }
  },
  filters: {
    cellData(value) {
      return ['icon-cur', 'icon-qs'].indexOf(value) !== -1 ? '' : value
    }
  },
  mounted() {
    this.getLudanList()
  },
  watch: {
    methodName() {
      this.getLudanList()
    },
    issueList () {
      this.getLudanList()
    }
  },
  methods: {
    getLudanList () {
      this.ludanList = this.getLuDanListByMethod(this.issueList, this.gameType, this.methodName, this.maxRows, this.maxColumns)
    },
    // getIssueList(gameid) {
    //   this.$http.myget(api.ludan, {gameid: gameid, size: 100}).then(({data}) => {
    //     if (data.success === 1) {
    //       data.items = data.items.reverse()
    //       this.issueList = data.items
    //       this.ludanList = this.getLuDanListByMethod(data.items, this.gameType, this.methodName, this.maxRows, this.maxColumns)
    //     }
    //   })
    // },
    getMethodDataByName(type, name) {
      return this.ludanMethods.find((m) => {
        return type === m.type && name === m.method
      })
    },
    getLHHValueByPos(data, pos) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].pos === pos) {
          return data[i].val;
        }
      }
    },
    getLuDanListByMethod(issueList, type, name, maxRows, maxColumns) {
      if (!issueList || issueList.length < 1 || !name) {
        return []
      }
      const mObj = this.getMethodDataByName(type, name)
      if (!mObj) {
        return []
      }
      let ludanItems = []
      let item = ''
      let ludanList = []
      let codeStyles
      issueList.forEach((issue, i) => {
        codeStyles = JSON.parse(issue.codeStyle || '[]')
        codeStyles.forEach((cs, j) => {
          if (cs.methodId.indexOf(mObj.methodId) !== -1) {
            switch (mObj.method) {
              case 'zh_dx':
              case 'zh_ds':
              case 'zhw_wsdx':
              case 'zhw_wsds':
                item = cs.value[0][mObj.method.split('_')[1]]
                break;
              case '1v2':
              case '1v3':
              case '1v4':
              case '1v5':
              case '2v3':
              case '2v4':
              case '2v5':
              case '3v4':
              case '3v5':
              case '4v5':
              case '1v10':
              case '2v9':
              case '3v8':
              case '4v7':
              case '5v6':
                item = this.getLHHValueByPos(cs.data, mObj.method)
                break;
              case 'ww_dx':
              case 'ww_ds':
              case 'qw_dx':
              case 'qw_ds':
              case 'bw_dx':
              case 'bw_ds':
              case 'sw_dx':
              case 'sw_ds':
              case 'gw_dx':
              case 'gw_ds':
                item = cs.value[mObj.pos][mObj.method.split('_')[1]]
                break;
              default:
                break;
            }
            if (ludanItems.indexOf(item) !== -1) {
              ludanItems.push(item);
            } else {
              if (ludanItems.length > 0) {
                ludanList.push(ludanItems)
                ludanItems = []
              }
              ludanItems.push(item);
            }
            // 最个一个
            // if (issueList.length - 1 === i) {
            //   if (ludanItems.length < maxRows) {
            //     ludanItems.push('icon-cur')
            //     ludanList.push(ludanItems)
            //     ludanItems = []
            //   } else {
            //     ludanList.push(ludanItems)
            //     ludanItems = []
            //     ludanItems.push('icon-cur')
            //     ludanList.push(ludanItems)
            //   }
            // }
          }
        });
        // 最个一个
        if (issueList.length - 1 === i) {
          if (ludanItems.length < maxRows) {
            ludanItems.push('icon-cur')
            ludanList.push(ludanItems)
            ludanItems = []
          } else {
            ludanList.push(ludanItems)
            ludanItems = []
            ludanItems.push('icon-cur')
            ludanList.push(ludanItems)
          }
        }
      });
      return ludanList.slice(ludanList.length >= maxColumns ? Math.abs(ludanList.length - maxColumns + 1) : 0)
    },
    getCellData(ludanList, c, r, maxRows = this.maxRows) {
      if (!ludanList) return ''
      if (ludanList[c] && ludanList[c][r]) {
        if (['icon-cur', 'icon-qs'].indexOf(ludanList[c][r]) !== -1) {
          return ludanList[c][r]
        }
        if (r === (maxRows - 1) && ludanList[c].length > maxRows) {
          return String(ludanList[c].length)
        } else {
          return ludanList[c][r]
        }
      } else {
        return ''
      }
    },
    getCellStyle(ludanList, col, row, maxRows = this.maxRows) {
      if (this.getCellData(ludanList, col, row, maxRows) === 'icon-cur') return 'icon-cur'
      if (this.getCellData(ludanList, col, row, maxRows) === 'icon-qs') return 'icon-qs'
      return this.getStyle(this.getCellData(ludanList, col, row, maxRows))
    },
    getStyle(d) {
      switch (d) {
        case '大':
        case '单':
        case '龙':
        case '总大':
        case '总单':
        case '和尾大':
          return 'bgc-r'
        case '小':
        case '总小':
        case '双':
        case '总双':
        case '虎':
        case '和尾小':
          return 'bgc-b'
        case '和':
        case '30':
        case '11':
          return 'bgc-g'
        default:
          if (/\d/.test(d)) return 'bgc-y'
          return ''
      }
    }
  }
}
</script>

<style lang="stylus">

$ludan-bg-color = #ffffff
$ludan-tabs-color = #cc8f30
$ludan-tabs-item-bg-color = linear-gradient(to bottom, #902900, #6e1f00, #531800)
$ludan-tabs-active-color = #4f0000
$ludan-tabs-active--bd-color = #e03636
$ludan-tabs-item-active-bg-color = #cc913c
$ludan-tb-cell-bd-color = #dfe6ec
$ludan-tb-cell-color = #ffffff
$ludan-tb-cell-bg-color = #371b03
$ludan-open-item-bg-color-red = red
$ludan-open-item-bg-color-green = green
$ludan-open-item-bg-color-blue = blue
$ludan-open-item-bg-color-yellow = #fbff00
$ludan-open-item-icon-cur = '../assets/icon_ludan_02.png'
$ludan-open-item-icon-qs = '../assets/icon_ludan_01.png'

.ai-c {
  align-items center
}
.jc-c {
  justify-content center
}

bg(uri, size=100%) {
  background-image url(uri)
  background-repeat no-repeat
  background-position center
  background-size size
}

.ludan-view {
  background-color $ludan-bg-color !important
  .tb-wp {
    border-top solid 1px $ludan-tb-cell-bd-color
  }
  .tb-cell {
    width 0.25rem
    height 0.25rem
    border-right solid 1px $ludan-tb-cell-bd-color
    border-bottom solid 1px $ludan-tb-cell-bd-color
    box-sizing border-box
    color $ludan-tb-cell-color
    // background-color $ludan-tb-cell-bg-color
  }
  .open-item {
    width 0.20rem
    height 0.20rem
    line-height 0.20rem
    border-radius 50%
    &.bgc-r {
      background $ludan-open-item-bg-color-red
    }
    &.bgc-g {
      background $ludan-open-item-bg-color-green
    }
    &.bgc-b {
      background $ludan-open-item-bg-color-blue
    }
    &.bgc-y {
      // background $ludan-open-item-bg-color-yellow
      color red
      font-size .17rem
    }
    &.icon-cur {
      bg($ludan-open-item-icon-cur)
      background-color #aaa
    }
    &.icon-qs {
      bg($ludan-open-item-icon-qs)
    }
  } 
}
</style>
