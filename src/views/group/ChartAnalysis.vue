<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.chart

      .ds-button-group
        .ds-button.text-button(:class="{ selected: type === 0 } " @click="type = 0" ) 团队用户图表
        .ds-button.text-button(:class="{ selected: type === 1 } " @click="type = 1" ) 团队销量图表
        // .ds-button.text-button(:class="{ selected: type === 2 } " @click="type = 2" ) 团队盈亏图表
      
      // LineChart.line-chart(style="width: 10rem height: 6rem")
      .filters(style="width: 1.6rem; position: absolute; right: .2rem; top: 1.2rem; line-height: .4rem; z-index: 1; text-align: left")
        .ds-radio-label(:class="{active: timeType === 0 }" @click=" timeType = 0 ")
          .ds-radio.white
          | 最近一周
        .ds-radio-label(:class="{active: timeType === 1 }" @click=" timeType = 1 ")
          .ds-radio.white
          | 最近一月
        .ds-radio-label(:class="{active: timeType === 2 }" @click=" timeType = 2 ")
          .ds-radio.white
          | 最近3月
        .ds-radio-label(:class="{active: timeType === 3 }" @click=" timeType = 3 ")
          .ds-radio.white
          | 最近6月
        .ds-radio-label(:class="{active: timeType === 4 }" @click=" timeType = 4 ")
          .ds-radio.white
          | 最近一年
      IEcharts(:option="line" @ready="onReady" @click="onClick" resizable=true style="height: 80%; width: 80%; margin: 0 auto")
      
</template>

<script>
  // import 'echarts/lib/chart/pie'
  // import 'echarts/lib/chart/scatter'
  // import 'echarts/lib/chart/radar'

  // import 'echarts/lib/chart/map'
  // import 'echarts/lib/chart/treemap'
  // import 'echarts/lib/chart/graph'
  // import 'echarts/lib/chart/gauge'
  // import 'echarts/lib/chart/funnel'
  // import 'echarts/lib/chart/parallel'
  // import 'echarts/lib/chart/sankey'
  // import 'echarts/lib/chart/boxplot'
  // import 'echarts/lib/chart/candlestick'
  // import 'echarts/lib/chart/effectScatter'
  // import 'echarts/lib/chart/lines'
  // import 'echarts/lib/chart/heatmap'

  // import 'echarts/lib/component/graphic'
  // import 'echarts/lib/component/grid'
  // import 'echarts/lib/component/polar'
  // import 'echarts/lib/component/geo'
  // import 'echarts/lib/component/parallel'
  // import 'echarts/lib/component/singleAxis'
  // import 'echarts/lib/component/brush'
  // import 'echarts/lib/component/markLine'
  // import 'echarts/lib/component/markArea'

  // import 'echarts/lib/component/timeline'
  // import 'zrender/lib/vml/vml'
  // ^^^^^^^^^^^^^^
  import IEcharts from 'vue-echarts-v3/src/lite.js'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'

  import 'echarts/lib/component/title'

  import 'echarts/lib/component/dataZoom'
  import 'echarts/lib/component/visualMap'

  import 'echarts/lib/component/markPoint'
  import 'echarts/lib/component/toolbox'
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  import api from '../../http/api'
  import { dateFormat } from '../../util/Date'
  import store from '../../store'

  export default {
    components: {
      // LineChart,
      IEcharts
    },
    data () {
      return {
        me: store.state.user,
        type: 0,
        url: [api.teamStatistic, api.getTeamSale, api.getTeamProfit],
        timeType: 1,
        stEt: [
          [new Date().getTime() - 3600 * 1000 * 24 * (7 + 1), new Date().getTime() - 3600 * 1000 * 24],
          [new Date().getTime() - 3600 * 1000 * 24 * (30 + 1), new Date().getTime() - 3600 * 1000 * 24],
          [new Date().getTime() - 3600 * 1000 * 24 * (90 + 1), new Date().getTime() - 3600 * 1000 * 24],
          [new Date().getTime() - 3600 * 1000 * 24 * (180 + 1), new Date().getTime() - 3600 * 1000 * 24],
          [new Date().getTime() - 3600 * 1000 * 24 * (364 + 1), new Date().getTime() - 3600 * 1000 * 24]
        ],
        // loading: true,
        line: {
          // title: {
          //   text: '团队近期图表'
          // },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            left: 'right',
            feature: {
              magicType: {type: ['line', 'bar']},
              // saveAsImage: {show: true},
              // dataZoom: {
              //   yAxisIndex: 'none'
              // },
              // restore: {},
              saveAsImage: {},
              myToolweek: {
                show: true,
                title: '最近一周',
                icon: '周'
              }
            }
          },
          xAxis: {
            data: []
          },
          // dataZoom: [{
          //   startValue: '2014-06-01'
          // }, {
          //   type: 'inside'
          // }],
          // visualMap: {
          //   top: 50,
          //   right: 0,
          //   pieces: [{
          //     gt: 0,
          //     lte: 50,
          //     color: '#096'
          //   }, {
          //     gt: 50,
          //     lte: 100,
          //     color: '#ffde33'
          //   }, {
          //     gt: 100,
          //     lte: 150,
          //     color: '#ff9933'
          //   }, {
          //     gt: 150,
          //     lte: 200,
          //     color: '#cc0033'
          //   }, {
          //     gt: 200,
          //     lte: 300,
          //     color: '#660099'
          //   }, {
          //     gt: 300,
          //     color: '#7e0023'
          //   }],
          //   outOfRange: {
          //     color: '#999'
          //   }
          // },
          yAxis: {
            splitLine: {
              show: true
            }
          },
          series: []
        }
      }
    },
    computed: {
      defaultLegend () {
        return this.me.model === 'night' ? {
          borderWidth: 0,
          borderColor: '#ccc',
          textStyle: {
            color: '#ccc'
          }
        } : {
          borderWidth: 0,
          borderColor: '#333',
          textStyle: {
            color: '#333'
          }
        }
      },
      defaultXAxis () {
        return this.me.model === 'night' ? {
          axisLabel: {
            textStyle: {
              color: '#ccc'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        } : {
          axisLabel: {
            textStyle: {
              color: '#333'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          }
        }
      },
      defaultYAxis () {
        return this.me.model === 'night' ? {
          axisLabel: {
            textStyle: {
              color: '#ccc'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#666']
            }
          }
        } : {
          axisLabel: {
            textStyle: {
              color: '#333'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#ccc']
            }
          }
        }
      }
    },
    watch: {
      type () {
        this.loading = true
        // this.CHART.clear()
        this.getData()
        // setTimeout(() => {
        //   this.CHART.setOption(this.line)
        // }, 1000)
      },
      timeType () {
        this.getData()
      },
      defaultLegend: {
        deep: true,
        handler () {
          this.line.legend = Object.assign(this.line.legend, this.defaultLegend)
          this.line.xAxis = Object.assign(this.line.xAxis, this.defaultXAxis)
          this.line.yAxis = Object.assign(this.line.yAxis, this.defaultYAxis)
          this.CHART.setOption(this.line)
        }
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      symbolSize (value) {
        return [Math.max(value.toFixed(0).length * (1 + 0.1 * parseInt((value + '').slice(0, 1))) * 20.5, 50), Math.max(value.toFixed(0).length * (1 + 0.03 * parseInt((value + '').slice(0, 1))) * 10, 50)]
      },
      // 7.团队盈亏图表（投注+返点+中奖+结算+中奖率） http://192.168.169.44:9901/cagamesclient/team/teamStatistic.do?method=getTeamProfit&startDay=170226&endDay=170303
      // getTeamProfit: api + 'team/teamStatistic.do?method=getTeamProfit',
      // 10.团队总销量（投注+返奖数据）  http://192.168.169.44:9901/cagamesclient/team/teamStatistic.do?method=getTeamSale&startDay=170226&endDay=170303
      // getTeamSale: api + 'team/teamStatistic.do?method=getTeamSale'
      // 12 团队用户图表（用户数图表：总用户数，活跃用户数，投注用户数）  http://192.168.169.44:9901/cagamesclient/team/teamStatistic.do?method=getTeamUserChart&startDay=170226&endDay=170303
      // teamStatistic: api + 'team/teamStatistic.do?method=getTeamUserChart'
      getData () {
        // let loading = this.$loading({
        //   text: '数据获取中...',
        //   target: this.$el
        // }, 10000, '数据获取失败...')
        this.$http.get(this.url[this.type], {
          startDay: dateFormat(this.stEt[this.timeType][0], 6).replace(/[-]/g, ''),
          endDay: dateFormat(this.stEt[this.timeType][1], 6).replace(/[-]/g, '')
        }).then(({data}) => {
          // success
          this.CHART.clear()
          if (data.success === 1) {
            this.line.xAxis = Object.assign({
              data: data.chartData.map(function (item) {
                item.days += ''
                return item.days.slice(0, 2) + '/' + item.days.slice(2, 4) + '/' + item.days.slice(4, 6)
              })
            }, this.defaultXAxis)
            if (this.type === 0) {
              this.line.legend = Object.assign({
                data: ['总人数', '活跃人数', '参与游戏人数']
              }, this.defaultLegend)
              this.line.series = [{
                name: '总人数',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.userCount
                }),
                markPoint: {
                  symbolSize: this.symbolSize,
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                }
                // markLine: {
                //   data: [
                //       {type: 'average', name: '平均值'}
                //   ]
                // }
              }, {
                name: '活跃人数',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.userActivity
                }),
                markPoint: {
                  symbolSize: this.symbolSize,
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                }
                // markLine: {
                //   data: [
                //       {type: 'average', name: '平均值'}
                //   ]
                // }
              }, {
                name: '参与游戏人数',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.buyUserCount
                }),
                markPoint: {
                  symbolSize: this.symbolSize,
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                }
                // markLine: {
                //   data: [
                //       {type: 'average', name: '平均值'}
                //   ]
                // }
              }]
            }
            if (this.type === 1) {
              this.line.legend = Object.assign({
                data: ['投注额', '中奖额']
              }, this.defaultLegend)
              this.line.series = [{
                name: '投注额',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.buy
                }),
                markPoint: {
                  symbolSize: this.symbolSize,
                  data: [
                    // {type: 'max', name: '最大值', label: {normal: {textStyle: {color: '#000'}}}},
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }, {
                name: '中奖额',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.prize
                }),
                markPoint: {
                  symbolSize: this.symbolSize,
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }]
            }
            if (this.type === 2) {
              this.line.legend = Object.assign({
                data: ['投注额', '中奖额', '中奖率', '返点额', '结算额']
              }, this.defaultLegend)
              this.line.series = [{
                name: '投注额',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.buy
                }),
                markPoint: {
                  data: [
                    {type: 'max', name: '最大值', label: {emphasis: {textStyle: {color: '#000'}}}},
                    {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }, {
                name: '中奖额',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.prize
                }),
                markPoint: {
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }, {
                name: '返点额',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.point
                }),
                markPoint: {
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }, {
                name: '结算额',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.profit
                }),
                markPoint: {
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }, {
                name: '中奖率',
                type: 'line',
                smooth: true,
                data: data.chartData.map(function (item) {
                  return item.rate
                }),
                markPoint: {
                  data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                  ]
                },
                markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
                }
              }]
            }
            this.CHART.setOption(this.line)
          }
          // else loading.text = '数据获取失败'
        }, (rep) => {
          // error
        }).finally(() => {
          // setTimeout(() => {
          //   loading.close()
          // }, 1000)
        })
      },
      onReady (instance) {
        this.CHART = instance
      },
      onClick (event, instance, echarts) {
        // block8/3 console.log(arguments)
      }
    }
  }
</script>


<style lang="stylus" scoped>
  @import '../../var.stylus'
  .chart
    text-align center

  .ds-radio-label
    color #999
  .ds-radio-label.active
    color BLUE
</style>
