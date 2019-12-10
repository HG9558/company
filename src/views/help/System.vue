<template lang="jade">
  .help-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.function-help
      
      .content

        .item(v-for="(g, index) in notices" v-bind:class="{'active': openIndex === index}" @click=" (openIndex = index)") 
          .step.text-666
            span.date.text-black {{ g.sendTime.split(' ')[0].split('-')[1] + '-' + g.sendTime.split(' ')[0].split('-')[2] }}
            span.title {{ g.subject }}
              .time.text-666( v-bind:class="{'text-black': openIndex === index}") {{ g.sendTime.split(' ')[1] }}

      .with-content(v-if="  notices[openIndex] ")
        span.title {{  notices[openIndex].subject }}
          .time.text-666 {{  notices[openIndex].sendTime }}
        pre.value {{ notices[openIndex].content }}
         
        // el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

        p.class(v-if=" notices.length === 0 ") 暂无任何公告!
    
</template>

<script>
  import api from '../../http/api'
  export default {
    data () {
      return {
        notices: [],
        openIndex: 0,
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {}
      }
    },
    computed: {
      cg () {
        return this.notices[this.openIndex]
      }
    },
    mounted () {
      this.sysNotices()
    },
    methods: {
      pageChanged (cp) {
        this.sysNotices(cp, () => {
          this.currentPage = cp
        })
      },
      // 11、系统公告   ALL
      sysNotices (page, fn) {
        let loading = this.$loading({
          text: '公告加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            page: 1,
            pageSize: this.pageSize,
            isReleaseLine: 1
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.get(api.sysNotices, this.preOptions).then(({data}) => {
          // success
          if (data.success) {
            this.notices = data.sysNotices || []
            // this.notices = [{subject: '快投30秒 (1711201201) 期199000'}]
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.total = data.totalSize || this.notices.length
          }
        }, (rep) => {
          // error
        }).finally((rep) => {
          loading.close()
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .function-help
    top TH
    text-align center
    padding PWX
    .item:hover .text-666
      color #000
    .ds-button-group
      text-align left
      // height auto
    .time
      // margin-top .1rem
      text-align left
      font-size .12rem
    .title
      line-height .25rem
      font-size .14rem
      color #666
    .content
      background #e6e6e6
      position absolute
      left .2rem
      top 0
      bottom 0
      overflow auto
      text-align left
      width 3.69rem
      overflow hidden
      &:hover
        overflow auto
      // padding 0 PW
      .item
        &:hover
          background #ededed
          .date
            color #f37e0c
          .title
            font-weight bold 
            color #333
        &.active
          background #f3f3f3
          .title
            font-weight bold 
            color #333
        // margin PW 0
        // padding-bottom .2rem
        padding PW PW PW PWX
        .date
          position absolute
          left 0
          top 0
          font-size .36rem
          font-family Roboto
          // font-gradient()
          // background linear-gradient(90deg, #ff3350, #1a9ff3)
          // -webkit-background-clip text
          // -webkit-text-fill-color transparent
      .step
        position relative
        padding-left 1.05rem
        padding-top .05rem
        font-size .18rem
        font-weight bold
        cursor pointer
    .with-content
      margin-left 4rem
      text-align left
      .title
        font-size .18rem
        color #333
        font-weight bold

      .time
        text-align right
    .value
      margin-top 0
      line-height .22rem
      transition max-height 1s ease-in
          
</style>
<style lang="stylus">
    
  .night .function-help .item:hover .text-666
    color #fff

  .night .function-help .content
    background-color #454545
    .item
      .title
        color #888
    .item:hover
      .title
        color #999

    .item.active
      .title
        color #ccc

</style> 