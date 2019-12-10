<template lang="jade">
  .me-page.safe-detail-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    MeSideView(type="safe")
    .safe-detail-info.scroll-content
      // 修改密码
      el-row.pwd(v-bind:class="{expand: index === 1 }")
        el-col
          el-row.static
            el-col(:span="6").title.ds-icon-lock 修改密码

            el-col(:span="6").login-pwd 登录密码：
              span.text-green.ds-icon-set(v-if="me.pwd") 已设置
              span.text-danger.ds-icon-unset(v-if="!me.pwd") 未设置

            el-col(:span="8").cash-pwd 资金密码：
              span.text-green.ds-icon-set(v-if="me.cashPwd") 已设置
              span.text-danger.ds-icon-unset(v-if="!me.cashPwd") 未设置

            el-col(:span="4").toggle
              .ds-button.text-button.blue(@click="index === 1 ? index = 0 : index = 1") {{ index === 1 ? '收起' : !me.pwd ? '立即设置' : '立即修改' }}

          el-row.action(v-if="index === 1")
            .ds-button-group
              .ds-button.large.text-button(v-bind:class="{selected: tabIndex === 1}" @click="tabIndex = 1") 修改登录密码
              .ds-button.large.text-button(v-bind:class="{selected: tabIndex === 2}" @click="tabIndex = 2") {{ !me.cashPwd ? '设置资金密码' : '修改资金密码' }}

            .pwd-form.form(v-if="tabIndex === 1")
              p 旧密码：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="oldPwd" type="password")

              p(v-if=" me.phone ") 手机验证码：
                input.ds-input.large(v-model="pc_"  style="width: 1.0rem")
                button.ds-button.secondary.outline(style="margin-left: .1rem;" @click="sendSms" v-bind:class="{ disabled: pt_ }" v-bind:disabled="pt_ > 0") 
                  span(v-if="!pt_") 发送验证码
                  span.text-333(v-if="pt_") {{ pt_ }} 
                    span.text-999 秒后可重新发送

                span.mynotice （旧密码与手机验证码输入其一）

              p 新密码：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="newPwd" type="password" name="newPwd" maxLength="20" v-on:keyup="pwdKeyUp")
                span.mynotice 由字母和数字组成6-20个字符;
                  br
                  | 必须包含数字和字母，不允许连续三位相同
              p.pwd-status-check-row(v-show="newPwd.length > 0")
                PwdStatusCheckBar(v-bind:state="pwdState")
              p 确认新密码：
                input.ds-input.large(v-model="newPwdAgain" type="password" name="newPwdAgain" maxLength="20" v-on:keyup="pwdKeyUp")
              p.pwd-status-check-row(v-show="newPwdAgain.length > 0")
                PwdStatusCheckBar(v-bind:state="aPwdState")

              

            .cashpwd-form.form(v-if="tabIndex === 2 && !me.cashPwd")

              p 设置密码：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="newCashPwd" type="password" name="newCashPwd" maxLength="20" v-on:keyup="pwdKeyUp")
                span.mynotice 由字母和数字组成6-20个字符;
                  br
                  | 必须包含数字和字母，不允许连续三位相同
              p.pwd-status-check-row(v-show="newCashPwd.length > 0")
                PwdStatusCheckBar(v-bind:state="newCashPwdState")
              p 确认密码：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="newCashPwdAgain" type="password" name="newCashPwdAgain" maxLength="20" v-on:keyup="pwdKeyUp")
              p.pwd-status-check-row(v-show="newCashPwdAgain.length > 0")
                PwdStatusCheckBar(v-bind:state="newCashPwdAgainState")


            .cashpwd-form.form(v-if="tabIndex === 2 && me.cashPwd")

              p 旧密码：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(type="password" v-model="oldCashPwd")
              
              p(v-if=" me.phone ") 手机验证码：
                input.ds-input.large(v-model="pc_"  style="width: 1.0rem")
                button.ds-button.secondary.outline(style="margin-left: .1rem;" @click="sendSms" v-bind:class="{ disabled: pt_ }" v-bind:disabled="pt_ > 0") 
                  span(v-if="!pt_") 发送验证码
                  span.text-333(v-if="pt_") {{ pt_ }} 
                    span.text-999 秒后可重新发送

                span.mynotice （旧密码与手机验证码输入其一）

              p 新密码：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(type="password"  v-model="newCashPwd" name="newCashPwd" maxLength="20" v-on:keyup="pwdKeyUp")
                span.mynotice 由字母和数字组成6-20个字符;
                  br
                  | 必须包含数字和字母，不允许连续三位相同
              p.pwd-status-check-row(v-show="newCashPwd.length > 0")
                PwdStatusCheckBar(v-bind:state="newCashPwdState")
              p 确认新密码：
                input.ds-input.large(type="password"  v-model="newCashPwdAgain" name="newCashPwdAgain" maxLength="20" v-on:keyup="pwdKeyUp")
              p.pwd-status-check-row(v-show="newCashPwdAgain.length > 0")
                PwdStatusCheckBar(v-bind:state="newCashPwdAgainState")

            .buttons(style="margin-left: .85rem")
              .ds-button.primary.large(@click="changePwd") 提交
              .ds-button.cancel.large(@click="clearPwd") 清空



      // 修改昵称
      el-row.nickname(v-bind:class="{expand: index === 2 }")
          el-col
            el-row.static
              el-col(:span="6").title.ds-icon-nickname 修改昵称

              el-col(:span="14")
                span.text-green.ds-icon-set(v-if="me.name") 已设置
                span.text-ellipsis( v-if="me.name" style="max-width: 70%; "  v-bind:title="me.name") &nbsp;&nbsp;{{ me.name }}
                span.text-danger.ds-icon-unset(v-if="!me.name") 未设置
                span(style="font-size: .12rem") （昵称只能修改一次）

              el-col(:span="4").toggle
                .ds-button.text-button.blue(@click="index === 2 ? index = 0 : index = 2") {{ index === 2 ? '收起' : !me.name ? '立即设置' : '立即修改' }}

            el-row.action(v-if="index === 2" style="padding-left: 0")
              
              .nickname-form.form
                div(style="text-align: center; ")
                  input.ds-input.large(:placeholder="nicknamePlaceholder" v-model="nickname" maxlength="20")
                  .ds-button.primary.large(style="margin-left: .15rem" @click="changNickName") 提交

      // 修改生日
      el-row.nickname(v-bind:class="{expand: index === 9 }")
          el-col
            el-row.static
              el-col(:span="6").title.ds-icon-birthday 设置生日

              el-col(:span="14")
                span.text-green.ds-icon-set(v-if="me.birthday") 已设置
                span.text-ellipsis( v-if="me.birthday" style="max-width: 70%; "  v-bind:title="me.birthday") &nbsp;&nbsp;{{ me.birthday }}
                span.text-danger.ds-icon-unset(v-if="!me.birthday") 未设置
                span(style="font-size: .12rem") （生日只能设置一次）

              el-col.toggle(:span="4" v-show=" !me.birthday ") 
                .ds-button.text-button.blue(@click="index === 9 ? index = 0 : index = 9") {{ index === 9 ? '收起' : !me.birthday ? '立即设置' : '立即修改' }}

            el-row.action(v-if="index === 9" style="padding-left: 0")
              
              .nickname-form.form
                div(style="text-align: center; ")
                  
                  el-date-picker(v-model="birthday" placeholder="选择您的生日")
                  //- input.ds-input.large(:placeholder="nicknamePlaceholder" v-model="nickname" maxlength="20")
                  .ds-button.primary.large(style="margin-left: .15rem" @click="changBirthday()") 提交
            

      // 登录问候语
      el-row.greeting(v-bind:class="{expand: index === 3 }")
         el-col
          el-row.static
            el-col(:span="6").title.ds-icon-greeting 登录问候语

            el-col(:span="14")
              span.text-green.ds-icon-set(v-if="me.greeting") 已设置
              span.text-ellipsis( v-if="me.greeting" style="max-width: 70%; " v-bind:title="me.greeting")  &nbsp;&nbsp;{{ me.greeting }}
              span.text-danger.ds-icon-unset(v-if="!me.greeting") 未设置

            el-col(:span="4").toggle
              .ds-button.text-button.blue(@click="index === 3 ? index = 0 : index = 3") {{ index === 3 ? '收起' : !me.greeting ? '立即设置' : '立即修改' }}

          el-row.action(v-if="index === 3" style="padding-left: 0")
            
            .nickname-form.form
              div(style="text-align: center; ")
                input.ds-input(:placeholder="greetingPlaceholder" style="width: 82%" v-model="greeting" maxlength="50")
                .ds-button.primary.large(style="margin-left: .15rem" @click="setGreetMsg") 提交
      
      //- 手机绑定
      el-row.phone(v-if="me.showPhoneEmail==1" v-bind:class="{expand: index === 4 }")
        el-col
          el-row.static
            el-col(:span="6").title.ds-icon-phone 手机绑定
            el-col(:span="14").phone
              span.text-green.ds-icon-set(v-if="me.phone") 已设置
              span.text-black(v-if="me.phone")  {{ me.phone }}
              span.text-danger.ds-icon-unset(v-if="!me.phone") 未设置
            el-col(:span="4").toggle
              .ds-button.text-button.blue(@click="index === 4 ? index = 0 : index = 4") {{ index === 4 ? '收起' : !me.phone ? '立即设置' : '立即修改' }}
          el-row.action(v-if="index === 4" )
           .phone-form.form
             p 资金密码：
               input.ds-input.large(v-model="newCashPwd" type="password")
             p(v-if="!me.phone") 绑定手机：
               input.ds-input.large(v-model="phone" v-bind:disabled="pt_ > 0")
               button.ds-button.secondary.outline(style="margin-left: .1rem;" @click="sendSms" v-bind:class="{ disabled: pt_ }" v-bind:disabled="pt_ > 0") 
                  span(v-if="!pt_") 发送验证码
                  span.text-333(v-if="pt_") {{ pt_ }} 
                    span.text-999 秒后可重新发送
              p(v-if="me.phone") 解绑手机：
                span {{ me.phone }}
                button.ds-button.secondary.outline(style="margin-left: .1rem;" @click="sendSms" v-bind:class="{ disabled: pt_ }" v-bind:disabled="pt_ > 0") 
                 span(v-if="!pt_") 发送验证码
                 span.text-black(v-if="pt_") {{ pt_ }} 
                   span.text-999 秒后可重新发送
             p 验证码：&nbsp;&nbsp;&nbsp;
               input.ds-input.large(v-model="pc_")
           .buttons(style="margin-left: .65rem")
             button.ds-button.primary.large(@click="bindPhone" v-if="!me.phone") 提交
             button.ds-button.primary.large(@click="unbindPhone" v-if="me.phone") 解绑
             .ds-button.cancel.large(@click="clearPhone") 清空

      //- 邮箱绑定
      el-row.email(v-if="me.showPhoneEmail==1" v-bind:class="{expand: index === 5 }")
        el-col
          el-row.static
            el-col(:span="6").title.ds-icon-email 邮箱绑定

            el-col(:span="14").email
              span.text-green.ds-icon-set(v-if="me.email") 已设置
              span.text-black(v-if="me.email")  {{ me.email }}
              span.text-danger.ds-icon-unset(v-if="!me.email") 未设置

            el-col(:span="4").toggle
              .ds-button.text-button.blue(@click="index === 5 ? index = 0 : index = 5") {{ index === 5 ? '收起' : !me.email ? '立即设置' : '立即修改' }}

          el-row.action(v-if="index === 5")
            
            .email-form.form
              p 资金密码：
                input.ds-input.large(v-model="newCashPwd" type="password")
              p(v-if="!me.email") 绑定邮箱：
                input.ds-input.large(v-model="email")
                span.ds-button.secondary.outline(style="margin-left: .1rem;" @click="sendMail"  v-bind:class="{ disabled: et_ }" v-bind:disabled="et_ > 0") 
                  span(v-if="!et_") 发送验证码
                  span.text-black(v-if="et_") {{ et_ }} 
                    span.text-999 秒后可重新发送
              
              p(v-if="me.email") 解绑邮箱：
                span {{ me.email }}
                span.ds-button.secondary.outline(style="margin-left: .1rem;" @click="sendMail"  v-bind:class="{ disabled: et_ }" v-bind:disabled="et_ > 0") 
                  span(v-if="!et_") 发送验证码
                  span.text-black(v-if="et_") {{ et_ }} 
                    span.text-999 秒后可重新发送

              p 验证码：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="ec_")

            .buttons(style="margin-left: .65rem")
              .ds-button.primary.large(@click="bindEmail" v-if="!me.email") 提交
              .ds-button.primary.large(@click="unbindEmail" v-if="me.email") 提交
              .ds-button.cancel.large(@click="clearEmail") 清空

      // 信游安全
      el-row.email(v-bind:class="{expand: index === 8 }")
        el-col
          el-row.static
            el-col(:span="6").title.ds-icon-cbsafe 信游安全

            el-col(:span="14").email
              span.text-green.ds-icon-set(v-if="me.cbsafe") 已设置
              // span.text-black(v-if="me.email")  {{ me.cbsafe }}
              span.text-danger.ds-icon-unset(v-if="!me.cbsafe") 未设置

            el-col(:span="4").toggle
              .ds-button.text-button.blue(@click="index === 8 ? index = 0 : index = 8") {{ index === 8 ? '收起' : !me.cbsafe ? '立即设置' : '立即修改' }}

          el-row.action(v-if="index === 8" )

            .email-form.form
              p(v-if="stepIndex === 0") 资金密码：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="newCashPwd" type="password" @keyup.enter="checkSecurityPwd()")
              
              transition(name="slide" appear=true)
                div(style="padding: 0 1rem;" v-if="stepIndex === 1 && !me.cbsafe")
                  .QR.ds-icon-QR(:style="myQR")
                  p.text-black(style="font-weight: bold; ") 扫码查看信游安全码{{ qrDescrb }}

              transition(name="slide" appear=true)
                p(v-if="stepIndex === 1") 信游安全码：
                  input.ds-input.large(v-model="cb_" @keyup.enter="switchGoogleAuth(me.cbsafe ? 0 : 1)")

            .buttons(style="margin-left: .85rem")
              .ds-button.primary.large(@click="checkSecurityPwd()" v-if="stepIndex === 0") 提交
              .ds-button.primary.large(@click="switchGoogleAuth(1)" v-if="stepIndex === 1 && !me.cbsafe") 立即开启
              .ds-button.primary.large(@click="switchGoogleAuth(0)" v-if="stepIndex === 1 && me.cbsafe") 立即关闭
              // .ds-button.cancel.large(@click="clearEmail") 清空

      // 安全问题
      el-row.safe-question(v-bind:class="{expand: index === 6 }")
        el-col
          el-row.static
            el-col(:span="6").title.ds-icon-safe 安全问题

            el-col(:span="14").email
              span.text-green.ds-icon-set(v-if="me.safe") 已设置
              span.text-danger.ds-icon-unset(v-if="!me.safe") 未设置

            el-col(:span="4").toggle
              .ds-button.text-button.blue(@click="index === 6 ? index = 0 : index = 6" v-if="!me.safe") {{ index === 6 ? '收起' : !me.safe ? '立即设置' : '立即修改' }}

          el-row.action(v-if="index === 6 && !me.safe")
            .safe-form.form
              p 选择问题：
                el-select(placeholder="请选择" style="width: 2.5rem" v-model="q1title")
                  el-option(v-for="q1 in Q" v-bind:label="q1.title" v-bind:value="q1.title" v-bind:disabled=" q1.title === q2title")
              p 您的答案：
                input.ds-input.large(v-model="a1_")
              p 选择问题：
                el-select(placeholder="请选择" style="width: 2.5rem" v-model="q2title")
                  el-option(v-for="q2 in Q" v-bind:label="q2.title" v-bind:value="q2.title" v-bind:disabled="q2.title === q1title")
              p 您的答案：
                input.ds-input.large(v-model="a2_")


            .buttons(style="margin-left: .65rem")
              .ds-button.primary.large(@click="setSafeQuestion") 提交
              .ds-button.cancel.large(@click="clearSafeQuestion") 清空
      // 安全验证
      el-row.safe-check(v-bind:class="{expand: index === 7 }")
        el-col
          el-row.static
            el-col(:span="6").title.ds-icon-safecheck 安全验证

            el-col(:span="14").safeCheck
              span.text-green.ds-icon-set(v-if="me.safeCheck") 已设置
              span.text-danger.ds-icon-unset(v-if="!me.safeCheck") 未设置
              span(style="font-size: .12rem") （设置提款、转账等操作的安全验证方式）

            el-col(:span="4").toggle
              .ds-button.text-button.blue(@click="index === 7 ? index = 0 : index = 7") {{ index === 7 ? '收起' : !pwd ? '立即设置' : '立即修改' }}

          el-row.action(v-if="index === 7" style="text-align: left;")
            
            .safe-check-form.form(style="margin-top: .3rem")
              .ds-checkbox-label.active.disabled
                .ds-checkbox 
                | 资金密码验证

              .ds-checkbox-label(@click="safeCheck === 2 ? safeCheck = 0 : safeCheck = 2" v-bind:class="{active: safeCheck === 2 }" v-bind:style=" me.safeCheck === 2 && {color: '#1a9ff3'} ")
                .ds-checkbox 
                | 邮箱验证
                
              // .ds-checkbox-label(@click="safeCheck === 1 ? safeCheck = 0 : safeCheck = 1" v-bind:class="{active: safeCheck === 1 }" v-bind:style=" me.safeCheck === 1 && {color: '#1a9ff3'} ")
              //  .ds-checkbox
              //  手机验证

              .ds-checkbox-label(@click="safeCheck === 3 ? safeCheck = 0 : safeCheck = 3" v-bind:class="{active: safeCheck === 3 }" v-bind:style=" me.safeCheck === 3 && {color: '#1a9ff3'} ")
                .ds-checkbox 
                | 信游安全认证

              //.ds-checkbox-label(@click="safeCheck4 = !safeCheck4" v-bind:class="{active: safeCheck4 }")
              //  .ds-checkbox
              //  安全问题验证
            p(style="margin-top: .2rem" v-if=" me.safeCheck != safeCheck ") 资金密码：&nbsp;&nbsp;&nbsp;
              input.ds-input.large(v-model="newCashPwd" type="password")

            p(v-if="  me.safeCheck != safeCheck && !((me.safeCheck === 3 && safeCheck === 0) || (me.safeCheck !== 3 && safeCheck === 3) ) " style="margin-top: .2rem") 验证码：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="safeCheckCode")
                span.ds-button.secondary.outline(style="margin-left: .1rem;" @click="getVerifyCode"  v-bind:class="{ disabled: safeCheck === 1 ? pt_ : et_  }" v-bind:disabled="(safeCheck === 1 ? pt_ : et_ ) > 0") 
                  span(v-if="!(safeCheck === 1 ? pt_ : et_ )") 发送验证码
                  span.text-black(v-if="(safeCheck === 1 ? pt_ : et_ )") {{ (safeCheck === 1 ? pt_ : et_ ) }} 
                    span.text-999 秒后可重新发送
            transition(name="slide" appear=true)
              p(v-if=" me.safeCheck != safeCheck &&  (me.safeCheck === 3 && safeCheck === 0) || (me.safeCheck !== 3 && safeCheck === 3) " style="margin-top: .2rem") 信游安全码：
                  input.ds-input.large(v-model="safeCheckCode")


            .buttons(style="margin: .2rem 0; padding-top: 0")
              .ds-button.primary.large(@click="checkSecurityPwd(setsecurityCheck)" v-if="safeCheckCode && me.safeCheck != safeCheck") 提交

      
      
</template>

<script>
import MeSideView from 'components/MeSideView'
import api from '../../http/api'
import store from '../../store'
import Validate from '../../util/Validate'
import xhr from 'components/xhr'
import PwdStatusCheckBar from 'components/PwdStatusCheckBar'
import md5 from 'md5'
export default {
  mixins: [xhr],
  data () {
    return {
      me: store.state.user,
      oldPwd: '',
      newPwd: '',
      newPwdAgain: '',
      oldCashPwd: '',
      newCashPwd: '',
      newCashPwdAgain: '',
      nickname: '',
      greeting: '',
      phone: '',
      email: '',
      Q: [],
      // q1: null,
      // q2: null,
      q1title: '',
      q2title: '',
      safeCheck: 0,
      safeCheckCode: '',

      index: 0,
      tabIndex: 1,
      stepIndex: 0,
      qrStr: '',
      qrDescrb: '',
      birthday: '',

      pwdState: -1,
      aPwdState: -1,
      newCashPwdState: -1,
      newCashPwdAgainState: -1

    }
  },
  computed: {
    nicknamePlaceholder () {
      return !this.me.name ? '请输入昵称' : this.me.name
    },
    greetingPlaceholder () {
      return !this.me.greeting ? '请输入登录问候语' : this.me.greeting
    },
    myQR () {
      return {
        background: 'url(' + this.qrStr + ') left top no-repeat',
        height: '1.4rem',
        width: '1.4rem',
        textAlign: 'center'
      }
    }
  },
  watch: {
    newPwd () {
      this.newPwd = this.newPwd.trim()
    },
    newPwdAgain () {
      this.newPwdAgain = this.newPwdAgain.trim()
    },
    newCashPwd () {
      this.newPwd = this.newPwd.trim()
    },
    newCashPwdAgain () {
      this.newPwdAgain = this.newPwdAgain.trim()
    },
    // q1 (n, o) {
    //   this.q1 && (this.q1.disabled = true)
    //   if (o) o.disabled = false
    // },
    // q2 (n, o) {
    //   this.q2 && (this.q2.disabled = true)
    //   if (o) o.disabled = false
    // },
    a1_ () {
      this.a1_ = this.a1_.trim()
    },
    a2_ () {
      this.a2_ = this.a2_.trim()
    },
    safeCheck () {
      if (!this.me.email && this.safeCheck === 2) {
        this.$message.error({target: this.$el, message: '请先绑定邮箱，再来绑定安全验证方式!'})
        this.safeCheck = 0
      }
      if (!this.me.phone && this.safeCheck === 1) {
        this.$message.error({target: this.$el, message: '请先绑定手机，再来绑定安全验证方式!'})
        this.safeCheck = 0
      }
      if (!this.me.cbsafe && this.safeCheck === 3) {
        this.$message.error({target: this.$el, message: '请先开启信游安全，再来绑定安全验证方式!'})
        this.safeCheck = 0
      }
    },
    index () {
      this.clearPwd()
      this.clearSafeQuestion()
      this.clearPhone()
      this.clearEmail()
      this.stepIndex = 0
      this.safeCheckCode = ''
    }
  },
  mounted () {
    this.acctSecureInfo()
    this.safeQuestionList()
    this.createCBqr()
  },
  methods: {
    pwdKeyUp (event) {
      switch (event.target.name) {
        case 'newPwd':
          this.pwdState = Validate.getPwdSafeLevel(this.newPwd) - 1
          break
        case 'newPwdAgain':
          this.aPwdState = Validate.getPwdSafeLevel(this.newPwdAgain) - 1
          break
        case 'newCashPwd':
          this.newCashPwdState = Validate.getPwdSafeLevel(this.newCashPwd) - 1
          break
        case 'newCashPwdAgain':
          this.newCashPwdAgainState = Validate.getPwdSafeLevel(this.newCashPwdAgain) - 1
          break
        default:
          break
      }
    },
    changBirthday () {
      if (!this.birthday) return
      this.$http.get(api.setBirthday + this.birthday._toDayString()).then(({data: {success, msg}}) => {
        if (success) {
          store.actions.setUser({birthday: this.birthday._toDayString()})
          this.$message.success('恭喜您，生日设置成功')
        } else {
          this.$message.error(msg || '生日设置失败')
        }
      })
    },
    createCBqr (type) {
      this.$http.get(api.createCBqr).then(({data}) => {
        // success
        if (data.success === 1) {
          this.qrStr = 'data:image/png;base64,' + data.qrStr
          this.qrDescrb = '(密钥: ' + data.authKey + ', 平台：' + data.plat + ')'
        } else this.$message.warning(data.msg || '信游二维码获取失败！')
      }, (rep) => {
        // error
      })
    },
    // http://192.168.169.161:8080/cagamesclient/person/accountSecur.do?method=swithGoogAuth& verifyCode=123456&type=1
    switchGoogleAuth (type) {
      this.$http.post(api.switchGoogleAuth, {verifyCode: this.cb_, type: type}).then(({data}) => {
        // success
        // if (data.success !== 1) this.mynotice = '验证码输入不正确！'
        this.newCashPwd = ''
        this.cb_ = ''
        if (data.success === 1) {
          this.$message.success(type ? '恭喜您，信游安全开启成功' : '您已成功关闭信游安全！')
          store.actions.setUser({
            cbsafe: !!type
          })
          this.stepIndex = 0
          if (this.me.safeCheck === 3) (this.safeCheck = 0) || store.actions.setUser({safeCheck: 0})
          // this.index = -1
        } else this.$message.warning(data.msg || '信游安全码输入不正确！')
      }, (rep) => {
        // error
      })
    },
    checkSecurityPwd (fn) {
      this.$http.post(api.checkSecurityPwd, {password: this.newCashPwd}).then(({data}) => {
        if (data.success === 1) {
          // stepIndex only for google safecheck
          if (!fn) {
            this.stepIndex = 1
            if (!this.qrStr) this.createCBqr()
            this.$message.success({target: this.$el, message: data.msg || '资金密码验证成功！'})
          } else {
            // if there is no callback
            typeof fn === 'function' && fn()
          }
        } else {
          this.$message.error({target: this.$el, message: data.msg || '资金密码错误！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '资金密码验证失败！'})
      })
    },
    acctSecureInfo () {
      this.$http.get(api.acctSecureInfo).then(({data}) => {
        if (data.success === 1) {
          store.actions.setUser({
            email: data.email,
            phone: data.mobile,
            greeting: data.greetMsg,
            pwd: data.isSetLoginPwd,
            cashPwd: data.isSetSecurityPwd,
            safe: data.isSetSafeQuest,
            safeCheck: data.isSetVerifytype,
            cbsafe: !!data.isOpenKey,
            safeScore: data.accountPoint,
            location: data.location,
            lastLoginTime: data.lastLoginTime,
            birthday: data.birthday
          })
          this.safeCheck = data.isSetVerifytype
          this.birthday = data.birthday
        }
      })
    },
    changLoginPwd () {
      this.$http.post(api.changLoginPwd, { password: this.oldPwdpwd, newPwd: this.newPwd }).then(({ data }) => {

      }, (rep) => {

      })
    },
    changePwd () {
      // 修改登录密码
      if (this.tabIndex === 1) {
        if (this.me.phone) {
          if (!this.oldPwd && !this.pc_) return this.$message.warning({target: this.$el, message: '请输入旧密码或手机验证码！'})
        } else {
          if (!this.oldPwd) return this.$message.warning({target: this.$el, message: '请输入旧密码！'})
        }
        if (!this.newPwd) return this.$message.warning({target: this.$el, message: '请输入新密码！'})
        if (!Validate.pwd(this.newPwd)) return this.$message.error({target: this.$el, message: '您输入的密码不符合要求！1:由字母和数字组成6-20个字符;2:必须包含数字和字母，不允许连续三位相同！'})
        if (this.newPwdAgain !== this.newPwd) return this.$message.error({target: this.$el, message: '两次新密码输入不一致！'})
        if (this.pwdState < 1) return this.$message.warning({target: this.$el, message: '您输入的密码安全级别比较弱'})
        // changLoginPwd: api + 'person/accountSecur.do?method=changLoginPwd&password=123456&newPwd=000000',
        this.$http.post(api.changLoginPwd, {password: md5(this.oldPwd), newPwd: this.newPwd, smsCode: this.pc_}).then(({data}) => {
          if (data.success === 1) {
            this.$message.success({target: this.$el, message: '恭喜您， 登录密码修改成功，系统即将退出，请重新登录。'})
            setTimeout(() => {
              this.__setCall({fn: '__logout', args: undefined, callId: undefined})
            }, 1500)
          } else {
            this.$message.error({target: this.$el, message: data.msg || '旧密码或手机验证码错误！'})
            this.clearPwd()
          }
        }, (rep) => {
        })
      } else {
        // 资金密码
        // 修改
        if (this.me.cashPwd) {
          if (this.me.phone) {
            if (!this.oldCashPwd && !this.pc_) return this.$message.warning({target: this.$el, message: '请输入旧密码或手机验证码！'})
          } else {
            if (!this.oldCashPwd) return this.$message.warning({target: this.$el, message: '请输入旧密码！'})
          }
        } else {}
        // 设置
        if (!this.newCashPwd) return this.$message.warning({target: this.$el, message: '请输入新密码！'})
        if (!Validate.pwd(this.newCashPwd)) return this.$message.error({target: this.$el, message: '您输入的密码不符合要求！1:由字母和数字组成6-20个字符;2:必须包含数字和字母，不允许连续三位相同！'})
        if (this.newCashPwdAgain !== this.newCashPwd) return this.$message.error({target: this.$el, message: '两次新密码输入不一致！'})
        if (this.newCashPwdState < 1) return this.$message.warning({target: this.$el, message: '您输入的密码安全级别比较弱'})
        // changSecurePwd: api + 'person/accountSecur.do?method=changSecurePwd&password=123456&newPwd=000000',
        this.$http.post(api.changSecurePwd, {password: md5(this.oldCashPwd), newPwd: this.newCashPwd, smsCode: this.pc_}).then(({data}) => {
          if (data.success === 1) {
            let message = '恭喜您， 资金密码修改成功。'
            if (!this.me.cashPwd) message = '恭喜您， 资金密码设置成功。'
            this.$message.success({target: this.$el, message: message})
            if (!this.me.cashPwd) store.actions.setUser({cashPwd: true})
          } else {
            this.$message.error({target: this.$el, message: data.msg || '旧密码或手机验证码错误！'})
            this.clearCashPwd()
          }
        }, (rep) => {
        })
      }
    },
    clearPwd () {
      this.oldPwd = ''
      this.newPwd = ''
      this.newPwdAgain = ''
      this.clearCashPwd()
    },
    clearCashPwd () {
      this.pc_ = ''
      this.oldCashPwd = ''
      this.newCashPwd = ''
      this.newCashPwdAgain = ''
    },
    changNickName () {
      if (!Validate.nickName(this.nickname)) return this.$message.error({target: this.$el, message: '昵称由2至8个字符组成，可中文，数字不能超过4个，不能含有QQ字样！'})
      this.$http.post(api.changNickName, {nickName: this.nickname}).then(({data}) => {
        if (data.success === 1) {
          let message = '恭喜您， 昵称修改成功。'
          if (!this.me.name) message = '恭喜您， 昵称设置成功。'
          this.$message.success({target: this.$el, message: message})
          store.actions.setUser({name: this.nickname})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '昵称修改或设置不成功！'})
        }
      }).catch(rep => {
      })
    },
    setGreetMsg () {
      this.$http.post(api.setGreetMsg, {greetMsg: this.greeting}).then(({data}) => {
        if (data.success === 1) {
          let message = '恭喜您， 问候语修改成功。'
          if (!this.me.greeting) message = '恭喜您， 问候语设置成功。'
          this.$message.success({target: this.$el, message: message})
          store.actions.setUser({greeting: this.greeting})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '问候语修改或设置不成功！'})
        }
      }).catch(rep => {
      })
    },
    sendSms () {
      let bind = !this.me.phone
      if (bind && !Validate.phone(this.phone)) return this.$message.error({target: this.$el, message: '手机号码输入不正确，请输入11位手机号！'})

      // this.$http.post(api.person_sendSms, bind ? {mobile: this.phone} : {}).then(({data}) => {
      this.$http.post(api.getSMSCode, bind ? {mobile: this.phone} : {}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 手机验证码发送成功，请注意查收。'})
          this.pt_ = this.time_
        } else {
          this.$message.error({target: this.$el, message: data.msg || '手机验证码发送失败！'})
        }
      }).catch(rep => {
      })
    },
    bindPhone () {
      if (!this.phone || !this.pc_ || !this.newCashPwd) return this.$message.error({target: this.$el, message: '请输入必要的信息！'})
      // this.$http.post(api.bindMobil, {mobile: this.phone, password: this.newCashPwd, verifyCode: this.pc_, type: 0}).then(({data}) => {
      this.$http.post(api.bindMobile, {mobile: this.phone, smsCode: this.pc_, password: this.newCashPwd}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 手机绑定成功。'})
          store.actions.setUser({phone: this.phone})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '手机绑定失败！'})
        }
        this.clearPhone()
      }).catch(rep => {
      })
    },
    unbindPhone () {
      if (!this.pc_ || !this.newCashPwd) return this.$message.error({target: this.$el, message: '请输入必要的信息！'})
      // this.$message.success({target: this.$el, message: '恭喜您， 验证码输入正确。'})
      this.$http.post(api.unbindMobile, {smsCode: this.pc_, password: this.newCashPwd}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 手机解绑成功。'})
          store.actions.setUser({phone: ''})
          // if (this.me.safeCheck === 2) (this.safeCheck = 0) || store.actions.setUser({safeCheck: 0})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '手机解绑失败！'})
        }
        this.clearPhone()
      }).catch(rep => {
      })
    },
    clearPhone () {
      this.newCashPwd = ''
      this.phone = ''
      this.pc_ = ''
      this.pt_ = 0
    },
    sendMail () {
      let bind = !this.me.email
      if (bind && !Validate.email(this.email)) return this.$message.error({target: this.$el, message: '邮箱输入不正确，请输入正确的邮箱！'})
      this.$http.post(api.person_sendMail, bind ? {email: this.email} : {}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 邮箱验证码发送成功，请注意查收。'})
          this.et_ = this.time_
        } else {
          this.$message.error({target: this.$el, message: data.msg || '邮箱验证码发送失败！'})
        }
      }).catch(rep => {
      })
    },
    bindEmail () {
      if (!this.newCashPwd || !this.email || !this.ec_) return this.$message.error({target: this.$el, message: '请输入必要的信息！'})
      // this.$message.success({target: this.$el, message: '恭喜您， 验证码输入正确。'})
      this.$http.post(api.bindEmail, {email: this.email, password: this.newCashPwd, verifyCode: this.ec_, type: 0}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 邮箱绑定成功。'})
          store.actions.setUser({email: this.email})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '邮箱绑定失败！'})
        }
        this.clearEmail()
      }).catch(rep => {
      })
    },
    unbindEmail () {
      if (!this.newCashPwd || !this.ec_) return this.$message.error({target: this.$el, message: '请输入必要的信息！'})
      // this.$message.success({target: this.$el, message: '恭喜您， 验证码输入正确。'})
      this.$http.post(api.bindEmail, {password: this.newCashPwd, verifyCode: this.ec_, type: 1}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 邮箱解绑成功。'})
          store.actions.setUser({email: ''})
          if (this.me.safeCheck === 1) (this.safeCheck = 0) || store.actions.setUser({safeCheck: 0})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '邮箱解绑失败！'})
        }
        this.clearEmail()
      }).catch(rep => {
      })
    },
    clearEmail () {
      this.newCashPwd = ''
      this.email = ''
      this.ec_ = ''
      this.et_ = 0
    },
    safeQuestionList () {
      this.$http.get(api.safeQuestionList).then(({data}) => {
        if (data.success === 1) {
          this.Q = data.allQuestions.filter(q => {
            q.disabled = false
            return true
          })
        } else {
          this.$message.error({target: this.$el, message: data.msg || '安全问答获取失败！'})
        }
      }).catch(rep => {
      })
    },
    setSafeQuestion () {
      if (!this.q1title || !this.q2title || !this.a1_ || !this.a2_) return this.$message.error({target: this.$el, message: '请输入必要的信息！'})
      // this.$message.success({target: this.$el, message: '恭喜您， 验证码输入正确。'})
      this.$http.post(api.setSafeQuestion, {question1: this.q1title, question2: this.q2title, answer1: this.a1_, answer2: this.a2_}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 安全问答设置成功。'})
          store.actions.setUser({safe: true})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '安全问答设置失败！'})
        }
        this.clearSafeQuestion()
      }).catch(rep => {
      })
    },
    clearSafeQuestion () {
      this.q1 = null
      this.q2 = null
      this.a1_ = ''
      this.a2_ = ''
    },
    getVerifyCode () {
      switch (this.safeCheck || this.me.safeCheck) {
        case 1:
          this.sendSms()
          break
        case 2:
          this.sendMail()
      }
    },
    setsecurityCheck () {
      // if (!this.safeCheckCode) return this.$message.warning({target: this.$el, message: '请输入验证码！'})
      this.$http.post(api.setsecurityCheck, {checkType: this.safeCheck, verifyCode: this.safeCheckCode}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 安全验证设置/修改成功。'})
          store.actions.setUser({safeCheck: this.safeCheck})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '安全验证设置/修改失败！'})
        }
      }).catch(rep => {
      }).finally(rep => {
        this.safeCheckCode = ''
      })
    }
  },
  // 发送手机短信
  // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=sendSms&mobile=18952000000
  // person_sendSms: api + 'person/accountSecur.do?method=sendSms&mobile=18952000000',
  // // 发送邮件
  // // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=sendMail&email=1@qq.com
  // person_sendMail: api + 'person/accountSecur.do?method=sendMail&email=1@qq.com',
  // // 验证短信验证
  // // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=checkSmsVerifyCode&verifyCode=4511
  // person_checkSmsVerifyCode: api + 'person/accountSecur.do?method=checkSmsVerifyCode&verifyCode=4511',
  // // 验证邮件验证
  // // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=checkMailVerifyCode&verifyCode=2664
  // person_checkMailVerifyCode: api + 'person/accountSecur.do?method=checkMailVerifyCode&verifyCode=2664',
  // // 绑定手机
  // // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=bindMobil&mobile=18952000000&type=0
  // bindMobil: api + 'person/accountSecur.do?method=bindMobil&mobile=18952000000&type=0',
  // // 绑定邮箱
  // // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=bindEmail&email=a1@qq.com&type=0
  // bindEmail: api + 'person/accountSecur.do?method=bindEmail&email=a1@qq.com&type=0',
  // // 获取所有安全问答
  // // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=safeQuestionList
  // safeQuestionList: api + 'person/accountSecur.do?method=safeQuestionList',
  // // 设置安全问答
  // // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=setSafeQuestion&question1=abc&question2=def&answer1=ghi&answer2=jkl
  // setSafeQuestion: api + 'person/accountSecur.do?method=setSafeQuestion&question1=abc&question2=def&answer1=ghi&answer2=jkl'
  // http://192.168.169.44:9901/cagamesclient/person/accountSecur.do?method=setsecurityCheck&checkType=1&verifyCode=2444
  components: {
    MeSideView,
    PwdStatusCheckBar
  }
}
</script>


<style lang="stylus" scoped>
  @import '../../var.stylus'
  H = .7rem
  W = .5rem
  .secondary
    position relative
    top -3px
    
  .ds-input
    // height .32rem
    // line-height .32rem

  .text-ellipsis
    color #000
  .me-page[w='800']
  .me-page[w='700']
    .me-sideview
      display none
    .scroll-content
      left 0
  .scroll-content
    top TH
    left 2.5rem
      
  .safe-detail-info
    .pwd-status-check-row
      padding-left 0.84rem
    &>.el-row
      padding 0 PWX
      &:hover
        background-color #fff
      &:last-child
        .static
          border-bottom none
      
    .el-row.expand
      background-color #f8f8f8
      .static
        border-bottom none
      .action
        // border-bottom 1px solid #ccc
    .el-row.static
      height H
      line-height H
      // border-bottom 1px solid #ccc
      .title
        color #333
        padding-left .5rem
        font-weight bold
      .toggle
        text-align right
    .el-row.action
      padding-left W
      padding-bottom .3rem
      .ds-button-group
        margin-left .82rem
    .el-col-14
      padding-left .7rem
  
  .nickname-form
    padding .2rem 0
    
  .mynotice
    display inline-block
    vertical-align middle
    padding-left .1rem
    font-size .12rem
    color #999
  .buttons
    .ds-button:first-child
      margin-right .1rem
  .ds-checkbox-label
    margin-right .3rem

  p
    margin 0
    margin-bottom PW
    
  .buttons
    padding-top .05rem
</style>


<style lang="stylus" scoped>
// to imitate the old ds
  @import '../../var.stylus'
  body.nds
  body.cb.v2
    .safe-detail-info.scroll-content
      // position relative
      left 0
      top 2rem !important
      .el-row
        &:before
          content ''
          position absolute
          top 0
          left 0
          // z-index 1
          height 3px
          width 0
          background-color BLUE
          transition width linear .2s
        &.expand:before
          width 100%
  body.cb.v2
    .safe-detail-info.scroll-content
        // top 0 !important
        // position relative
        // max-width 10rem
        margin 0 auto
        padding 0 10%
    @media screen and (max-width: 1200px)
      .safe-detail-info.scroll-content
        top 2rem !important
        // position relative
        max-width 10rem
        margin 0 auto
</style>
