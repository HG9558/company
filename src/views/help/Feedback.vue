<template lang="jade">
  .help-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    

    .scroll-content.feedback-help(style="top: .82rem")

      div(style="text-align: center;")

        .ds-button-group
          .ds-button.x-small.text-button(v-bind:class="{selected: type === 1}" @click="type = 1") 我要反馈
          .ds-button.x-small.text-button(v-bind:class="{selected: type === 2}" @click="type = 2") 我的反馈

      div(v-if="type === 1")
        label.item
          span 标题：
          input.ds-input(ref="t" v-model="t" placeholder="请输入意见标题" style="width: 3rem")

        label.item
          span 内容：
          el-input(v-model="v" type="textarea" v-bind:autosize="{ minRows: 5, maxRows: 20 }" placeholder="请输入您的意见哦，不得少于5个字（若意见被采纳，将有机会获得现金红包奖励）")
        
        .buttons.item
          .ds-button.primary.large(@click="addFeedback") 提交

      .content(v-if="type === 2")
        .item(v-for="(g, index) in list") 
          .step.text-666(@click="openIndex === index ?  (openIndex = -1) : (openIndex = index)") {{ g.title }}
            .status.text-green(v-if="g.status === 1" style="float: right; font-size: .12rem") 已采纳 
            .time.text-666 {{ g.addTime }}
          pre.value(v-show=" openIndex === index ") {{ g.content }}
         
        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

        p.class(v-if=" list.length === 0 ") 您还未提交过意见!




    
</template>

<script>
  import api from '../../http/api'
  export default {
    data () {
      return {
        t: '',
        v: '',
        type: 1,
        list: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {}
      }
    },
    computed: {
    },
    watch: {
      t () {
        this.t = this.t.trim()
      },
      v () {
        this.v = this.v.trim()
      },
      type () {
        if (this.type === 2) this.getFeedbackList()
      }
    },
    mounted () {
    },
    methods: {
      pageChanged (cp) {
        this.getFeedbackList(cp, () => {
          this.currentPage = cp
        })
      },
      getFeedbackList (page, fn) {
        let loading = this.$loading({
          text: '意见反馈加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.get(api.getFeedbackList, this.preOptions).then(({data}) => {
          // success
          if (data.success) {
            if (data.data && data.data[0]) this.list = data.data
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.total = data.totalSize || this.list.length
          }
        }, (rep) => {
          // error
        }).finally((rep) => {
          loading.close()
        })
      },
      // 意见反馈
      // http://192.168.169.161:8080/cagamesclient//help/feeback.do?method=add&title=xxx&content=xxxxx&priority=1
      addFeedback () {
        if (!this.t) return this.$message.warning('请输入意见标题') && this.$refs.t.focus()
        if (this.t.length > 30) return this.$message.warning('标题过长') && this.$refs.t.focus()
        if (!this.v || this.v.length < 5) return this.$message.warning('请输入您的意见哦，不得少于5个字') && this.$el.querySelector('textarea').focus()
        this.$http.post(api.addFeedback, {priority: 1, title: this.t, content: this.v}).then(({data}) => {
          if (data.success === 1) {
            this.$modal.success({
              target: this.$el,
              content: '感谢您宝贵的建议，我们会仔细核对您的建议，让平台越来越好。',
              btn: ['确定']
            })
            this.t = ''
            this.v = ''
          } else this.$message.warning({target: this.$el, message: '反馈添加失败！'})
        }, (rep) => {
          this.$message.warning({target: this.$el, message: '反馈添加失败！'})
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .feedback-help
    top TH
    padding 0*PW 2*PWX
    .item
      position relative
      display block
      line-height .3rem
      margin PW 0
      padding-left .5rem
      span
        position absolute
        left 0
  

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
    color #999
  .content
    text-align left
    
    .item
      margin PW 0
    .step
      position relative
      top -.02rem
      font-size .18rem
      font-weight bold
      cursor pointer
    .value
      line-height .22rem
</style>
