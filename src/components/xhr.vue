<script>
  import api from '../http/api'
  import store from '../store'
  export default {
    data () {
      return {
        // 验证码图片
        img_: '',
        // 验证码
        code_: '',
        // 手机邮箱验证码时间
        time_: 60,
        // 手机验证码发送倒计时
        pt_: 0,
        // 邮箱验证码发送倒计时
        et_: 0,
        // 手机验证码
        pc_: '',
        // 邮箱验证码
        ec_: '',
        // 信游安全码
        cb_: '',
        // 安全问答1、2
        q1_: '',
        q2_: '',
        a1_: '',
        a2_: '',
        // 用户名
        un_: '',
        // 邮箱
        email_: '',
        // 手机号
        phone_: ''
      }
    },
    mounted () {
    },
    computed: {
      ppp () {
        return this.pt_
      }
    },
    watch: {
      // code_ () {
      //   if (this.code_.length === 4) this._checkVerifyCode()
      // },
      pt_ () {
        if (this.pt_ === this.time_) {
          let t = setInterval(() => {
            if (this.pt_ > 0) this.pt_--
            else clearInterval(t)
          }, 1000)
        }
      },
      et_ () {
        if (this.et_ === this.time_) {
          let t = setInterval(() => {
            if (this.et_ > 0) this.et_--
            else clearInterval(t)
          }, 1000)
        }
      }
    },
    methods: {
      // 校验安全验证二维码
      _checkGoogleAuth (fn) {
        this.$http.post(api.checkGoogleAuth, {verifyCode: this.cb_}).then(({data}) => {
          // success
          // if (data.success !== 1) this.notice = '验证码输入不正确！'
          if (data.success !== 1) {
            this.$message.warning('信游安全码输入不正确！')
          } else {
            if (fn) fn()
            else {
              // this.$message.success('验证码正确！')
            }
          }
        }, (rep) => {
          // error
        })
      },
      // 获取验证码
      _getVerifyImage () {
        this.$http.myget(api.getVerifyImage).then(({data}) => {
          // success
          if (data.success === 1) this.img_ = 'data:image/png;base64,' + data.data
          else this.$message.warning('验证码获取失败')
        }, (rep) => {
          // error
        })
      },
      // 校验验证码
      _checkVerifyCode (fn) {
        this.$http.post(api.checkVerifyCode, {verifyCode: this.code_}).then(({data}) => {
          // success
          // if (data.success !== 1) this.notice = '验证码输入不正确！'
          if (data.success !== 1) {
            this.$message.warning('验证码输入不正确！')
            this._getVerifyImage()
            this.code_ = ''
          } else {
            if (fn) fn()
            else {
              // this.$message.success('验证码正确！')
            }
          }
        }, (rep) => {
          // error
        })
      },
      // 检查用户名是否存在
      _checkUserName (fn) {
        this.$http.post(api.checkUserName, {userName: this.un_, verifyCode: this.code_}).then(({data}) => {
          // success
          if (data.success === 1) {
            fn && fn()
          } else {
            this.$message.error(data.msg || '用户名不存在！')
            this._getVerifyImage()
          }
        }, (rep) => {
          // error
        })
      },
      _getEmail (fn) {
        this.$http.get(api.getEmail).then(({data}) => {
          // success
          if (data.success === 1) {
            this.email_ = data.email
            store.actions.setUser({email: data.email})
            fn && fn()
          } else {
            this.$message.warning(data.msg || '您还没有绑定邮箱！')
          }
        }, (rep) => {
          // error
        })
      },
      _getMobile (fn) {
        this.$http.get(api.getMobile).then(({data}) => {
          // success
          if (data.success === 1) {
            fn && fn()
            this.phone_ = data.mobile
            store.actions.setUser({phone: data.mobile})
          } else {
            this.$message.warning(data.msg || '您还没有绑定手机！')
          }
        }, (rep) => {
          // error
        })
      },
      _isOpenCbAuth (fn) {
        this.$http.get(api.isOpenCbAuth).then(({data}) => {
          // success
          if (data.success === 1 && data.openCbAuth === '1') {
            fn && fn()
            // this.phone_ = data.mobile
            store.actions.setUser({cbsafe: true})
          } else {
            this.$message.warning(data.msg || '您还没有开启信游安全！')
          }
        }, (rep) => {
          // error
        })
      },
      // 发送手机验证码
      _sendSms (fn) {
        this.$http.get(api.sendSms).then(({data}) => {
          this.pt_ = this.time_
          // success
          if (data.success === 1) {
            fn && fn()
            // this.$message.success('手机短信验证码已经发送，请查收！')
            this.pt_ = this.time_
          } else {
            // this.$message.error(data.msg || '您还没有绑定手机！')
          }
        }, (rep) => {
          // error
        })
      },
      // 发送邮箱验证码
      _sendMail (fn) {
        this.$http.get(api.sendMail).then(({data}) => {
          // success
          if (data.success === 1) {
            fn && fn()
            // this.$message.success('邮箱验证码已经发送，请查收！')
            this.et_ = this.time_
          } else {
            // this.$message.error(data.msg || '您还没有绑定邮箱！')
          }
        }, (rep) => {
          // error
        })
      },
      _safeQuestion (fn) {
        this.$http.get(api.safeQuestion).then(({data}) => {
          // success
          if (data.success === 1) {
            this.q1_ = data.question1
            this.q2_ = data.question2
            fn && fn()
          } else {
            this.$message.warning(data.msg || '您还没有设置安全问答！')
          }
        }, (rep) => {
          // error
        })
      },
      _checkSmsVerifyCode (fn) {
        this.$http.post(api.checkSmsVerifyCode, {verifyCode: this.pc_}).then(({data}) => {
          // success
          if (data.success !== 1) {
            this.$message.warning(data.msg || '验证码输入不正确！')
          } else {
            if (fn) fn()
            else {
              // this.$message.success('验证成功，请修改密码！')
            }
          }
        }, (rep) => {
          // error
        })
      },
      _checkMailVerifyCode (fn) {
        this.$http.post(api.checkMailVerifyCode, {verifyCode: this.ec_}).then(({data}) => {
          // success
          if (data.success !== 1) {
            this.$message.warning('验证码输入不正确！')
          } else {
            if (fn) fn()
            else {
              // this.$message.success('验证码正确！')
            }
          }
        }, (rep) => {
          // error
        })
      },
      _safeAnswer (fn) {
        this.$http.post(api.safeAnswer, {answer1: this.a1_, answer2: this.a2_}).then(({data}) => {
          // success
          // if (data.success !== 1) this.notice = '验证码输入不正确！'
          if (data.success !== 1) {
            this.$message.warning('安全问答不正确！')
          } else {
            if (fn) fn()
            else {
              // this.$message.success('安全问答正确！')
            }
          }
        }, (rep) => {
          // error
        })
      }
    }
  }
</script>