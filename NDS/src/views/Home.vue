<template lang="jade">
.dialog-container
  .help-page.dialog-page.scroll-content
    // slot(name="cover")
    // slot(name="movebar")
    // slot(name="resize-x")
    // slot(name="resize-y")
    // slot(name="toolbar")
    el-carousel(:interval="4000" type="card" height="200px")
      el-carousel-item(v-for="item in sources" v-bind:key="item" v-bind:style="{ ba }")
        img(:src=" item.src ")
        // h3 {{ item.describe }}
    .scroll-content.function-help

      // 新
      // .content.scroll-content(style="width: 4rem;")
      //   .item(v-for="(g, index) in notices") 
      //     .step.text-666( v-bind:class="{'text-black': openIndex === index}" @click="openIndex === index ?  (openIndex = -1) : (openIndex = index)") 
      //       span {{ g.subject }}
      //       .time.text-666( v-bind:class="{'text-black': openIndex === index}") {{ g.sendTime }}
      //     // pre.value(v-show=" openIndex === index ") {{ g.content }}

      // .detial.scroll-content(style="left: 4rem" v-if="cg")
      //   .step.text-666
      //     span {{ cg.subject }}
      //     .time.text-666 {{ cg.sendTime }}
      //   pre.value {{ cg.content }}
      
      .content
        .item(v-for="(g, index) in notices") 
          .step.text-666( v-bind:class="{'text-black': openIndex === index}" @click="openIndex === index ?  (openIndex = -1) : (openIndex = index)") 
            span {{ g.subject }}
            .time.text-666( v-bind:class="{'text-black': openIndex === index}") {{ g.sendTime.split(' ')[0] }}
           pre.value(v-bind:class=" { expand: openIndex === index } ") {{ g.content }}
         
         el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

        p.class(v-if=" notices.length === 0 ") 暂无任何公告!
    
</template>

<script>
  import api from 'src/http/api'
  import base from 'components/base'
  export default {
    mixins: [base],
    data () {
      return {
        hasFooter: true,
        notices: [],
        openIndex: 0,
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        sources: [
          {href: '/activity/5-2-1', src: '/static/activity/nds/activity1.jpg', title: '注册就送', describe: '全新的游戏体验，来玩就送'},
          {href: '/activity/5-2-2', src: '/static/activity/nds/activity2.jpg', title: '新用户有礼了', describe: '绑定手机、银行卡、邮箱，即可领取58元优惠券'},
          {href: '/activity/5-2-3', src: '/static/activity/nds/activity3.jpg', title: '每日签到', describe: '每日来我签到，好礼不断'}
        ]
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
  @import '../var.stylus'
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
      text-align right
      font-size .12rem
    .title
      font-size .14rem
      color #666
    .content
      text-align left
      
      .item
            
        margin PW 0
        padding-bottom .2rem
      .step
        position relative
        top -.02rem
        font-size .18rem
        font-weight bold
        cursor pointer
        &.text-black span
          // font-family Roboto
          // font-size 0.72rem
          // font-gradient()
          background linear-gradient(90deg, #ff3350, #1a9ff3)
          -webkit-background-clip text
          -webkit-text-fill-color transparent
      .value
        margin-top 0
        line-height .22rem
        overflow hidden
        transition max-height 1s ease-in
        max-height 0
        color #666 !important
        &.expand
          transition max-height .3s ease-in
          max-height 5rem
  
  body.nds #app .dialog-container
    .help-page
      // width 100% !important  
      .scroll-content
        top 230px !important
        

  .el-carousel__item
    img
      width 100%
      height 100%
      
    h3 {
      position absolute
      bottom 0
      left 0
      right 0
      color: #333;
      font-size: 14px;
      opacity: 0.75;
      margin: 0;
      text-align center
    }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }  
</style>
