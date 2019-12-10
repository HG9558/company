<template lang="jade">
  .activity-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.activity-center
      router-link.banner.section(v-for=" (a, i) in activities " v-bind:to=" sources[a.activityType - 1].href + '?id=' + a.entry " @click.native.stop="")
        img(:src=" sources[a.activityType - 1].src ")
        h4.text-black {{ a.title }}
        h5 {{ a.subTitle }}

      .empty(v-if=" activities.length === 0 " style="padding: .15rem") 活动列表空空如也


</template>

<script>
// v-bind:class=" [ 'ds-icon-activity-' + (i + 1) ] "
// :src=" '/assets/activity/banner' + (i + 1) + '.jpg' "
  import api from '../../http/api'
  export default {
    data () {
      return {
        sources: [
          {href: '/activity/5-2-1', src: '/static/activity/activity1.jpg', title: '注册就送', describe: '全新的游戏体验，来玩就送'},
          {href: '/activity/5-2-2', src: '/static/activity/activity2.jpg', title: '新用户有礼了', describe: '绑定手机、银行卡、邮箱，即可领取58元优惠券'},
          {href: '/activity/5-2-3', src: '/static/activity/nds/activity1.jpg', title: '每日签到', describe: '每日来我签到，好礼不断'},
          {href: '/activity/5-2-4', src: '/static/activity/activity4.jpg', title: '充值送好礼', describe: '我们一直在送礼，一直在等你'},
          {href: '/activity/5-2-5', src: '/static/activity/activity5.jpg', title: '首提大返利', describe: '首次成功提现，即送18元大礼金'},
          {href: '/activity/5-2-6', src: '/static/activity/activity4.jpg', title: '首提大返利', describe: '首次成功提现，即送18元大礼金'},
          {href: '/activity/5-2-7', src: '/static/activity/activity7.jpg', title: '充值送好礼', describe: '我们一直在送礼，一直在等你'},
          {href: '/activity/5-2-8', src: '/static/activity/activity8.png', title: '大家来找茬', describe: '只要你敢找茬，我保证不拍屎你'},
          {href: '/activity/5-2-9', src: '/static/activity/activity9.jpg', title: '王者争霸赛', describe: '王者争霸赛，注册就送2万体验币'},
          {href: '/activity/5-2-10', src: '/static/activity/activity10.jpg', title: '直属总代日工资增加1w20', describe: '开业活动：直属总代日工资增加1w2'},
          {href: '/activity/5-2-11', src: '/static/activity/activity11.jpg', title: '六合彩专属活动', describe: '六合彩专属鸿运金！投注就送20000'},
          {href: '/activity/5-2-12', src: '/static/activity/activity12.png', title: '迎新春闯关活动', describe: '天天信游 全民闯关'},
          {href: '/activity/5-2-13', src: '/static/activity/activity13.jpg', title: '全新日工资', describe: '上班工资每月发，平台工资天天领'},
          {href: '/activity/5-2-14', src: '/static/activity/activity14.jpg', title: '助力世界杯', describe: '你投我就送，返点无上限'},
          {href: '/activity/5-2-15', src: '/static/activity/activity15.png', title: '助力世界杯', describe: '你投我就送，返点无上限'}
        ],
        activities: [
        ]
      }
    },
    mounted () {
      this.getAllActivityList()
    },
    methods: {
      getAllActivityList () {
        let loading = this.$loading({
          text: '活动列表加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        this.$http.get(api.getAllActivityList).then(({data}) => {
          // success
          if (data.success === 1) {
            this.activities = data.activityList || []
            // this.activities = [{activityType: 1}, {activityType: 2}, {activityType: 3}, {activityType: 8}, {activityType: 4}, {activityType: 5}, {activityType: 6}, {activityType: 9}, {activityType: 10}]
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          } else this.$message.error('活动列表加载失败！')
        }, (rep) => {
          // error
          this.$message.error('活动列表加载失败！')
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
  .activity-center
    top TH
    padding PWX
    .section
      display inline-block
      // width 4.15rem
      width 50%
      max-width 5rem
      vertical-align top
      // margin PW
      padding PW
      box-sizing border-box
      // padding PW
      // border 1px solid #d4d4d4
      // padding-top 1.5rem
      radius()
      cursor pointer
      background-size 100%
      &:hover
        background-color #fff

      h4,h5
        margin .08rem .05rem
        margin-bottom 0
      h4
        font-size .14rem
        font-weight bold
      h5
        font-size .12rem
      img
        width 100%

</style>
