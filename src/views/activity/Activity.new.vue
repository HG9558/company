<template lang="jade">
  .activity-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.activity-center
      div(v-if="!href")
        .banner.section(v-for=" (a, i) in activities " @click=" href = a.webPageUrl ")
          img(:src=" a.webPicPath ")
          h4.text-black {{ a.title }}
          h5 {{ a.subTitle }}
      
      iframe.iframe(:src="href" v-if="href" @load="load" ref="iframe" scrolling="no")

      .empty(v-if=" activities.length === 0 " style="padding: .15rem") 活动列表空空如也



</template>

<script>
// v-bind:class=" [ 'ds-icon-activity-' + (i + 1) ] "
// :src=" '/assets/activity/banner' + (i + 1) + '.jpg' "
  import api from '../../http/api'
  export default {
    data () {
      return {
        activities: [
        ],
        href: ''
      }
    },
    mounted () {
      this.getAllActivityList()
      window.closeIFrame = ({action}) => {
        switch (action) {
          case 'goToBag':
            this.$router.push('/activity/5-1-2')
            break
          case 'goToList':
            this.href = ''
        }
      }
    },
    methods: {
      load () {
        setTimeout(() => {
          this.$refs['iframe'].style.height = this.$refs['iframe'].contentWindow.document.body.clientHeight + 'px'
          this.$refs['iframe'].style.width = this.$refs['iframe'].contentWindow.document.body.clientWidth + 'px'
        }, 300)
      },
      getAllActivityList () {
        let loading = this.$loading({
          text: '活动列表加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        this.$http.get(api.getAllActivityList).then(({data}) => {
          // success
          if (data.success === 1) {
            this.activities = data.activityList || []
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
    .iframe
      margin 0 auto
      width CTW
      min-height 12rem
      border none
      
  </style>
