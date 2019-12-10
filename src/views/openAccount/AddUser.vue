<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .add-user.scroll-content

      .bgc-w.mg_20.pd_20
        
        .w_800.mg_0a.pd_20


          //- p.mb_20 剩余开户额：
            span.text-blue  *个

          p.mb_20 登录账号： &nbsp;&nbsp;
            input.ds-input.larget(v-model="n")
            span(style="color: #999; font-size: .12rem")（由0-9，a-z，A-Z组成的6-16个字符

          p 登录密码： &nbsp;&nbsp;
            //- input.ds-input.larget(v-model="pwd" v-bind:class=" {default: pwd === '123456a' } ")
            input.ds-input.larget(v-bind:value="pwd" class="default" readonly)
            span(style="color: #999; font-size: .12rem")（登录密码默认为：{{ pwd}} )
   
        hr(style="height: 0; border: 0; border-top: 1px solid #d4d4d4; margin: .15rem .2rem .1rem .2rem ")
      
        .w_800.mg_0a.pd_20
          .mb_20
            .ds-radio-label(:class="{active: i === 0 }" @click=" i = 0 " style="padding-left: 0")
              .ds-radio.white
              | 为下级进行设置
            .ds-radio-label(:class="{active: i === 1 }" @click=" i = 1 ")
              .ds-radio.white
              | 使用已有下级设置
          
          div(style="overflow: hidden")
            .users.inlb.v_t.w_200(v-if=" users.length > 0 && i ")
              .hlh_30
                el-autocomplete.inline-input.wp_100(v-model='un', v-bind:fetch-suggestions='querySearch', icon="search" placeholder='搜索用户', @select='handleSelect')

              ul.pd_0.mh_500.mg_0
                li.hlh_40.pointer(v-for=" (v, i) in users_ " @click=" (un_ = v.userName) && setBackWaters(v.back) ")
                  span.inlb.w_50
                    .ds-radio.white(v-bind:class="  {active: un_ === v.userName} "  )
                  span {{ v.userName }}

            ul.inlb.mh_500.pd_0.mg_0.v_t.as
              li.mb_20(v-for=" (v, i) in  data" v-bind:key="i" v-if=" v.$s ")
                span.text-danger.pd_5 *
                span.label(v-if=" !v.groupname ") 彩票返点 
                span.label(v-else) {{ v.groupname  }}返水 
                el-select(v-model="v.$" clearable style="width: 1.7rem")
                  el-option(v-bind:label=" '0.0' " v-bind:value=" '0.0' ")
                  el-option(v-for=" (x, j) in v.$s " v-bind:label=" (x * 0.1).toFixed(1) " v-bind:value=" (x * 0.1).toFixed(1)*1 ")

                span(v-if=" !v.groupname ")
                  span.text-blue  % 
                  span.c_03（百分符）
                span(v-else) 
                  span.text-blue  ‰
                  span.text-999（千分符）
                //- 彩票奖金
                //- 奖金计算公式 20 * 返点 + 1800
                div(v-if=" !v.groupname ")
                  span.label(style="width:0.92rem;")
                  el-slider.slidername(
                    v-model="v.$"
                    v-bind:max="v.backwater"
                    v-bind:step="0.1"
                    v-bind:show-tooltip="false"
                    v-bind:disabled="!v.backwater"
                    show-input
                  )
                  span.tips 奖金：{{20 * v.$ + 1800}}
                  span.tips 返点：{{v.$}}%
          
          .buttons.mb_20(:class=" i &&  users.length > 1 && 'mt_20' ")
            .ds-button.primary.large.bold.w_140.hlh_40(@click="openAccount") 开户
        
    el-dialog(
      title="确认信息"
      v-bind:visible.sync="COPYdialogVisible"
      v-bind:modal="!1"
      v-bind:close-on-click-modal="!1"
      v-bind:close-on-press-escape="!1"
      v-bind:show-close="!1"
      custom-class="dialogCopy"
      )
      br
      .ml_20(v-html="dataCopyHtml") 
      span(slot="footer")
        .ds-button.outline.bold.mr10(
          v-clipboard:copy="dataCopy"
          v-clipboard:success="copySuccess"
        ) 一键复制
        .ds-button.primary.large.bold(type="primary" @click="COPYdialogVisible=!1 && openAccountOK()") 确 定
</template>

<script>
  import Validate from '../../util/Validate'
  import api from '../../http/api'
  export default {
    data () {
      return {
        COPYdialogVisible: !1, // 一键复制弹窗
        n: '',
        pwd: '',
        i: 0,
        data: [],
        users: [],
        un: '',
        un_: ''
      }
    },
    computed: {
      dataCopyHtml () {
        return this.dataCopy.replace(/\n/g, '<br>');
      },
      //-
      dataCopy () {
        let r = `用户名:${this.n}
登录密码:${this.pwd}
`;
        this.data.forEach(v => {
          if (v.$ * 1) {
            if (!v.groupid) {
              r += `彩票返点:${v.$}%
`;
            } else {
              r += `${v.groupname}返水:${v.$}‰
`;
            }
          }
        });
        r += `登录网址:${window.location.origin}${window.location.pathname}
`;
        return r;
      },
      //-
      users_ () {
        return this.users.filter(x => x.userName.indexOf(this.un) !== -1)
      },
      user () {
        return this.users.filter(x => x.userName === this.un_)[0] || {}
      },
      // 最近搜索
      rs () {
        return this.local.search_un.split(',').filter(x => x.indexOf(this.un) !== -1)
      }
    },
    watch: {
      n () {
        this.n = this.n.trim()
      },
      pwd () {
        this.pwd = this.pwd.trim()
      },
      un () {
        this.un = this.un.trim()
      },
      user (n) {
        if (n && n.back && !n.back[1]) {
          this.getBackWater(n)
        } else if (n && n.back) {
          this.setBackWaters(n.back)
        }
        if (this.un) {
          this.__setLocal({search_un: this.un + ',' + this.local.search_un.replace(this.un + ',', '')})
        }
      }
    },
    mounted () {
      this.showRegistUser()
      this.getUserList()
    },
    methods: {
      copySuccess() {
        this.$message({
          type: "success",
          message: "已复制至剪贴板"
        });
      },
      openAccountOK () {
        this.n = ''
        this.pwd = '123456a'
        this.showRegistUser()
        this.$router.push('/group/2-3-4')
      },
      openAccount () {
        if (!this.n) return this.$message.warning({target: this.$el, message: '请输入用户名！'})
        if (!Validate.account(this.n)) return this.$message.warning({target: this.$el, message: '用户名格式不正确，请输入0-9，a-z，A-Z组成的6-16个字符!'})
        if (!this.pwd) return this.$message.warning({target: this.$el, message: '请输入密码！'})
        if (!Validate.pwd(this.pwd)) return this.$message.warning({target: this.$el, message: '您输入的密码不符合要求！1:由字母和数字组成6-20个字符;2:必须包含数字和字母，不允许连续三位相同！'})
        this.$http.post(api.registUser, {
          userName: this.n,
          password: this.pwd,
          keepPoint: (this.data[0].backwater - this.data[0].$).toFixed(1),
          proxyType: '',
          pointArr: JSON.stringify({
            myBack: this.data.slice(1).map(x => {
              return {
                groupid: x.groupid,
                groupname: x.groupname,
                backwater: x.$ / 1000
              }
            })
          }),
          type: 1
        }).then(({data}) => {
          if (data.success === 1) {
            this.$message.success(data.msg || '开户成功！')
            this.getUserList();
            this.COPYdialogVisible = !0;//显示弹窗复制
          } else this.$message.error(data.msg || '开户失败！')
        }, (rep) => {
          this.$message.error('开户失败！')
        })
      },
      showRegistUser () {
        this.$http.get(api.showRegistUser).then(({data}) => {
          if (data.success === 1) {
            this.pwd = data.defaultPwd
            data.back.unshift({
              backwater: data.userPoint
            })
            data.back.forEach((x, i) => {
              x.$ = ''
              x.$s = Math.ceil(x.backwater * (i ? 10000 : 10))
              if (!i) x.$ = 0
            })
            this.data = data.back
          } else this.$message.error(data.msg || '开户信息获取失败！')
        }, (rep) => {
          this.$message.error('开户信息获取失败！')
        })
      },
      querySearch (q, cb) {
        cb(this.local.search_un ? this.local.search_un.split(',').filter(x => x.indexOf(q.trim()) !== -1).map(y => ({ value: y })) : [])
      },
      handleSelect (item) {
      },
      getUserList () {
        this.$http.post(api.getUserList, {
          userId: '',
          userName: '',
          minPoint: '',
          maxPoint: '',
          cType: '',
          sortType: 3,
          sort: 2,
          page: 1,
          pageSize: 1000,
          subType: 1
        }).then(({data}) => {
          if (data.success === 1) {
            data.subUserInfo.forEach(x => {
              x.back = [
                {
                  backWater: x.userPoint
                }
              ]
            })
            this.users = data.subUserInfo
          }
        }, (rep) => {
        }).finally(() => {
        })
      },
      getBackWater (user) {
        this.$http.get(api.getBackWater, {
          userId: user.userId
        }).then(({data: {success, backWaterComb}}) => {
          if (success === 1) {
            user.back = user.back.slice(0, 1).concat(backWaterComb)
            this.setBackWaters(user.back)
          }
        })
      },
      setBackWaters(back) {
        back.forEach(x => {
          (
            this.data.find(
              y => y.groupid === x.groupId || (!x.groupId && !y.groupid)
            ) || {}
          ).$ = x.backWater
            ? (x.backWater * (!x.groupId ? 1 : 1000)).toFixed(1) * 1
            : "";
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .add-user
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
  
  .ds-radio-label
  .c_03
    color #033333
  
  .hlh_40
    line-height .4rem
  .users
  .as
    position relative
    list-style none
              
    padding-bottom 100%
    margin-bottom -100%
    background-color #fff
    overflow auto
  .users + .as
    padding-left .2rem
    padding-right .2rem
    padding-top .2rem
    background-color #f8f8f8

  .users
    padding-top .3rem
    &>.hlh_30
      // background-color #cccccc
      color #333
      font-weight bold
      position absolute
      top 0
      width 100%
      z-index 1
    li:nth-child(odd)
      background-color #e7e7e7
    li:nth-child(even)
      background-color #f8f8f8
    li.pointer:hover
      color #000
      font-weight bold
      // background-color #999
      
  ul
    overflow auto
  
  
    
    
    
    
</style>
<style lang="less">
.add-user {
  .label {
    width: 0.75rem;
    display: inline-block;
  }
  .tips {
    margin-left: 0.2rem;
    user-select: none;
  }
  .el-slider__button-wrapper {
    top: -8px;
  }
  .slidername {
    width: 2rem;
    position: relative;
    .el-slider__runway.show-input {
      margin-right: 40px;
      margin-left: 40px;
    }
    .el-input-number .el-icon-minus,
    .el-input-number .el-icon-plus {
      display: inline-block;
    }
    .el-input-number .el-input {
      display: none;
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      border: 0 none;
      position:absolute;top: 5px;
    }
    .el-slider__input{position: unset;}
    .el-input-number__decrease {
      left: 0;
    }
    .el-input-number__increase{
      right: 0;
    }
  }
}
</style>
<style lang="less">
 .el-dialog.dialogCopy{
   background: #fff;
   width: 3rem;
   .el-dialog__footer{
     text-align: center;
   }
}
</style>