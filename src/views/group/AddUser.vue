<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .add-user.scroll-content

      .bgc-w

        p(style="padding: .05rem .4rem") 登录帐号： &nbsp;&nbsp;
          input.ds-input.larget(v-model="account")
          span(style="color: #999; font-size: .12rem") （由0-9，a-z，A-Z组成的6-16个字符）
        p(style="padding: .05rem .4rem") 登录密码： &nbsp;&nbsp;
          input.ds-input.larget(v-model="pwd" v-bind:class=" {default: pwd === '123456a' } ")
          span(style="color: #999; font-size: .12rem") （登录密码默认为：{{ '123456a'}} )
 
     
        hr(style="height: 0; border: 0; border-top: 1px solid #d4d4d4; margin: .15rem .2rem .1rem .2rem ")
      
        p(style="padding: .1rem .4rem" v-if="PS[0]") 剩余开户额：
          label(style="display: inline-block")
            span(style="margin: 0 .15rem " v-for="P in PS")
              // span.text-blue(v-if=" platform !== 'ds' ") [{{ P.point }}]:
              span.text-danger  {{ P.count }}个

        p(style="padding: 0rem .4rem") 您的返点级别：
          span.amount {{ point  }}
          | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 保留返点：
          el-input(v-model="p" style="width: .6rem")
          // |  % 
          span.text-money  (可填范围：{{ range.min }} ~ {{ range.max }})

        hr(style="height: 0; border: 0; border-top: 1px solid #d4d4d4; margin: .15rem .2rem .1rem .2rem ")
       
        div.buttons(style="padding: .1rem .4rem")
          .ds-button.primary.large.bold(@click="openAccount") 开户
          .ds-button.cancel.large.bold(@click="back()") 返回
        

      
</template>

<script>
  import store from '../../store'
  import Validate from '../../util/Validate'
  import api from '../../http/api'
  export default {
    data () {
      return {
        me: store.state.user,
        // 用户级别
        UL: [
          [
            {id: 2, title: '直属总代'},
            {id: 3, title: '总代'}
          ],
          [
            {id: 3, title: '总代'},
            {id: 4, title: '代理'}
          ]
        ],
        u: {},
        // 调点
        PS: [{}],
        account: '',
        // defaultPwd: this.platform === 'ds' ? '123456a' : '123qwe',
        pwd: '123456a',
        range: {
          min: 0.00,
          max: 3.00
        },
        point: '',
        p: ''
      }
    },
    computed: {
    },
    watch: {
      account () {
        this.account = this.account.trim()
      },
      pwd () {
        this.pwd = this.pwd.trim()
      },
      // p () {
      //   setTimeout(() => {
      //     this.p = parseFloat(this.p) || ''
      //     let i = (this.p + '').lastIndexOf('.')
      //     if (i !== -1 && (this.p + '').slice(i).length > 2) {
      //       this.p = parseFloat((Math.floor(this.p * 100) / 100).toFixed(1))
      //     }
      //   }, 1000)
      // },
      p () {
        setTimeout(() => {
          this.p = this.p.trim()
          this.p = this.p.replace(/[^0-9,.]/g, '').replace(/[,.]{2,}/g, ',')
          let [l, r, t] = this.p.split('.')
          if (r) this.p = l + '.' + r.slice(0, 1)
          if ((r && r.split(/[,]/)[1]) || t) this.p = l + '.' + r.split(/[.,]/)[0].slice(0, 1)
        }, 0)
      }
    },
    mounted () {
      // this.pwd = '123qwe'
      this.showRegistUser()
    },
    methods: {
      back () {
        window.history.back()
      },
      openAccount () {
        if (!this.account) return this.$message.warning({target: this.$el, message: '请输入用户名！'})
        if (!Validate.account(this.account)) return this.$message.warning({target: this.$el, message: '用户名格式不正确，请输入0-9，a-z，A-Z组成的6-16个字符!'})
        if (!this.pwd) return this.$message.warning({target: this.$el, message: '请输入密码！'})
        if (this.p > this.range.max || this.p < this.range.min) return this.$message.warning({target: this.$el, message: '返点值太大或太小！'})
        // http://192.168.169.44:9901/cagamesclient/team/createAccount.do?method=registUser&userName=abcdefg&password=123qwe&nickName=test1234&keepPoint=0.2
        this.$http.get(api.registUser, { userName: this.account, password: this.pwd, keepPoint: this.p, proxyType: this.u.id || '' }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.$message.success(data.msg || '开户成功！')
            this.account = ''
            this.pwd = '123456a'
            // this.point = ''
            this.u = {}
            this.showRegistUser()
            this.$router.push('/group/2-3-4')
          } else this.$message.error(data.msg || '开户失败！')
        }, (rep) => {
          // error
          this.$message.error('开户失败！')
        })
      },
      showRegistUser () {
        this.$http.get(api.showRegistUser).then(({data}) => {
          // success
          if (data.success === 1) {
            this.PS = data.addUsers || []
            if (data.range.min === 0) data.range.min = 0.00
            this.range = data.range
            this.point = data.userPoint
          } else this.$message.error(data.msg || '开户信息获取失败！')
        }, (rep) => {
          // error
          this.$message.error('开户信息获取失败！')
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .add-user
    top 0
    .form
      padding PWX
      
  input.default
    color #999
    
  .el-select
  .el-input-number
    width 1.2rem
  .el-select
    position relative
    top .01rem
  .amount
    font-family Roboto
    font-size 0.72rem
    color #333
  .text-money
    color #999
  
  .notice
    font-size .12rem
    line-height .22rem
    margin 0 .2rem
    padding PWX
    background-color #fffde8
    border 1px solid #d5d09b
    radius()
    .content
      display inline-block
      margin 0
      line-height .25rem
      vertical-align top
      
</style>
