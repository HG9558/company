<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content.data-analysis

      .form.form-filters(style="display: none;")

        label 日期 
          el-date-picker(:picker-options="options" v-model="st" type="date" placeholder="请选择日期")

        | &nbsp;&nbsp;
        .ds-button.primary.large.bold(@click="getTeamTodayData") 提交


      .form.form-filters(style=" padding-top: .4rem")
        
        div.bbbb(style="border-bottom: 1px solid #eee; padding-bottom: .15rem")
          .slot.me.text-black
              | 我的账户：
              span {{ me.account }}
              span

        .content
            .slot.money
              
              div(style="display: inline-block; vertical-align: top; min-width: 6rem")
                p.text-999(style="font-size: .16rem") 团队余额
                span.amount.text-black {{ numberWithCommas(data.availBal || 0)}}
                span.text-black  元 

              div(style="display: inline-block; vertical-align: top; text-align: right; position: relative; font-size: .16rem")
                div(style="position: relative;  padding-left: 1.2rem;")
                  span.text-999.ft14 团队特殊余额：
                  span.amount.text-black(style="font-size: .36rem") {{ numberWithCommas(data.speBal || 0)}}
                  span.text-black  元 
                div(style="position: relative;  padding-left: 1.2rem;")

                  span.text-999.ft14 团队充值金额：
                  span.amount.text-black(style="font-size: .36rem") {{ numberWithCommas(data.saveAmount || 0)}}
                  span.text-black  元 
                div(style="position: relative;  padding-left: 1.2rem;")
                
                  span.text-999.ft14 团队提款金额：
                  span.amount.text-black(style="font-size: .36rem") {{ numberWithCommas(data.withdrawAmount || 0)}}
                  span.text-black  元 

            .slot.team
              div(style="display: inline-block; vertical-align: top; min-width: 6rem")

                p.text-999(style="font-size: .16rem") 团队总人数
                span.amount.text-black {{ numberWithCommas(data.teamCount || 0)}}
                span.text-black  人

              div(style="display: inline-block; vertical-align: top;  position: relative; font-size: .16rem")
                div(style="position: relative;  padding-left: .8rem;")

                  span.text-999.ft14 有投注的：
                  span.amount.text-black(style="font-size: .36rem") {{ numberWithCommas(data.playCount || 0)}}
                  span.text-black  人 

                div(style="position: relative;  padding-left: .8rem;")
                
                  span.text-999.ft14 有活动的：
                  span.amount.text-black(style="font-size: .36rem") {{ numberWithCommas(data.actUser || 0)}}
                  span.text-black  人 

            .slot.lteam
              
              div(style="display: inline-block; vertical-align: top; min-width: 6rem")

                p.text-999(style="font-size: .16rem") 团队在线用户
                span.amount.text-black {{ numberWithCommas(data.online || 0)}}
                span.text-black  人

              div(style="display: inline-block; vertical-align: top;  position: relative; font-size: .16rem")
                div(style="position: relative;  padding-left: .8rem;")

                  span.text-999.ft14 电脑在线：
                  span.amount.text-black(style="font-size: .36rem") {{ numberWithCommas(data.onlinePc || 0)}}
                  span.text-black  人 

                div(style="position: relative;  padding-left: .8rem;")
                
                  span.text-999.ft14 手机在线：
                  span.amount.text-black(style="font-size: .36rem") {{ numberWithCommas(data.onlineMobile || 0)}}

        


        
</template>

<script>
  import store from '../../store'
  import { digitUppercase, numberWithCommas } from '../../util/Number'
  // import { dateFormat } from '../../util/Date'
  import api from '../../http/api'
  export default {
    data () {
      return {
        me: store.state.user,
        st: new Date(new Date().getTime() - 3600 * 1000 * 24),
        options: {
          disabledDate (time) {
            return time.getTime() > (Date.now() - 24 * 3600 * 1000)
          }
        },
        data: {},
        numberWithCommas: numberWithCommas
      }
    },
    computed: {
      textMoney () {
        return digitUppercase(this.data.totalBalance || 0)
      }
    },
    mounted () {
      this.getTeamTodayData()
    },
    methods: {
      // 团队数据统计（pc端团队数据统计接口）
      // http://192.168.169.44:9901/cagamesclient/team/teamStatistic.do?method=getTeamTodayData&startDay=170226
      getTeamTodayData () {
        let loading = this.$loading({
          text: '团队数据加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        this.$http.get(api.getTeamTodayData, {
          // startDay: this.st ? dateFormat((window.newDate(this.st)).getTime(), 6).replace(/[\s-]*/g, '') : ''
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.data = data
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
          this.$message.error('加载失败！')
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .form-filters
    background-image: linear-gradient(0deg, #ffffff 0%, #ffffff 80%, #fffae5 100%)

    
  .stock-list
    .form
      padding PWX PWX*2

  .amount
    font-family Roboto
    font-size 0.6rem
    &.gradient
      font-gradient()

  .slot
    position relative
    font-size .24rem
    padding .25rem PW .25rem 2rem
    &:not(:last-child)
      border-bottom: 1px solid #eee

  .ft14
    font-size .14rem
    position absolute
    left 0
    line-height .5rem

  .f
    position absolute
    left .6rem
    top 1.2rem
    font-size .16rem

  .slot.me
    padding PW
    border none
    margin 0 auto
    padding-top 1.2rem
    width 3rem
    text-align center
    background url(../../assets/v2/td_icon_04.png) center top no-repeat

  .slot.money
    background url(../../assets/v2/td_icon_01.png) .5rem .15rem no-repeat
  .slot.team
    background url(../../assets/v2/td_icon_02.png) .5rem .1rem no-repeat
    .f
      top 1.1rem
  .slot.lteam
    background url(../../assets/v2/td_icon_03.png) .5rem .15rem no-repeat
</style>

<style lang="stylus">
#app.night .data-analysis
  .bbbb
  .slot:not(.me)
    border-color #666 !important

</style>
