<template lang="jade">
  .login-test
    h2 线路检测
    el-row.routers.font-white(:gutter="30" style="padding-left: 0; padding-right: 0")
      el-col(:span="8" v-for=" (r, index) in lineList "  @click.native="goLogin(r.line)")
        .col-content(v-bind:class="{ fast:  index === 0, usual: r.usual, current: r === currentServer ||  r.line.replace('www.', '') === currentServer.replace('www.', '') }")
          // p {{ r }}
          span.route-index(:class=" {ft36: index > 8} ") {{ index + 1 }}
          |  线 
          SignalBar(:value=" r.speedFlag || 0 ")
          .timer 
            span.time {{ r.speed >= 10000 ? '> ' : '' }}{{ r.speed }}
            span.text-danger(v-if=" !r.speed && r.speed !== 0  ") {{ '计算中...' }}
            |  毫秒
</template>

<script>
  import SignalBar from 'components/SignalBar'
  import api from '../../http/api'
  import store from '../../store'
  import { listOrderByField } from '../../util'
  // import Url from '../../util/Url'
  // import cookie from 'js-cookie'
  export default {
    // if show server
    props: ['server', 'm'],
    components: {
      SignalBar
    },
    data () {
      return {
        api: api.api,
        frontList: [],
        frontTimeList: [],
        frontTimeListValue: [],
        serverList: [],
        serverTimeList: [],
        serverTimeListValue: [],
        timeout: 2000,
        auto: 0,
        currentServer: '',
        T: 0,
        lineList: [],
        reqCount: 0
      // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        // cs: ''
      // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      }
    },
    computed: {
      list () {
        return this.server ? this.serverList : this.frontList
      },
      timeList () {
        return this.server ? this.serverTimeList : this.frontTimeList
      },
      timeListValue () {
        return this.server ? this.serverTimeListValue : this.frontTimeListValue
      },
      fast () {
        let v = 10000
        this.timeList.forEach(t => {
          t < v && (v = t)
        })
        return v
      },
      fastServer () {
        let v = 10000
        let index = 0
        this.serverTimeList.forEach((t, i) => {
          if (t && t < v) {
            v = t
            index = i
          }
        })
        return this.serverList[index]
      }
      // currentServer () {
      //   return this.server ? api.api : window.location.origin
      // }
    },
    watch: {
      fastServer () {
        // if (!this.server && !window.localStorage.getItem('api')) api.api = this.fastServer
        if (!this.server) {
          // setTimeout(() => {
          //   if (!store.state.user.login) api.api = this.fastServer
          // }, 3000)
        }
        // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        // this.cs = this.fastServer
        // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      }
    },
    mounted () {
      this.auto = this.$route.query.auto
      this.getEnableLines()
      this.currentServer = this.server ? api.api : window.location.origin
      // this.currentServer = this.server ? api.api : 'http://game.com:8080'
      // cookie.set('mySession', 'xxsffe-fe-s-f-esf-se-fe-s-f', {domain: ''})
      // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      // this.cs = api.api
      // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    },
    methods: {
      getEnableLines () {
        this.$http.get(api.getEnableLines).then(({data}) => {
          if (data.success === 1) {
            this.T = new Date().getTime()
            this.frontList = !this.m ? data.frontList : data.managerList
            this.serverList = data.serverList
            this.lineList = this.server ? this.serverList : this.frontList
            this.test()
          } else this.$message.warning({target: this.$el, message: '线路信息获取失败！'})
        }, (rep) => {
          this.$message.warning({target: this.$el, message: '线路信息获取失败！'})
        })
      },
      test () {
        // this.frontList = ['http://www.baidu.com']
        // !this.server && this.frontList.forEach((url, i) => {
        let lineJsonpTestApi = api.lineJsonpTest
        if (/^https?:\/\//g.test(lineJsonpTestApi)) {
          lineJsonpTestApi = lineJsonpTestApi.substring(lineJsonpTestApi.indexOf('/dscagamesclient'))
        }
        this.lineList.forEach((url, i) => {
          // this.testAline(url.line + '/static/cb.js', i, 'frontTimeList')
          // this.testLine(url.line + '/static/cb.js', i, 'frontTimeList')
          this.testLine(url.line + lineJsonpTestApi, i, 'frontTimeList', url.line)
          // this.testLine(url.line + '/login/lineTest.do?method=lineTest', i, 'frontTimeList')
          if (url.line.replace('www.', '') === this.currentServer.replace('www.', '')) {
            // if get tapi don't change again
            if (window.localStorage.getItem('tapi')) return false
            // api.api = (this.serverList.find(n => n.group === url.group) || {line: ''}).line || api.api
          }
        })
        // let SESSION = cookie.get('SESSION', {domain: Url.extractHostname(api.api)})
        // console.log(Url.extractHostname(api.api), SESSION)
        this.serverList.forEach((url, i) => {
          // this.testAline(url, i, 'serverTimeList')
          // this.testAline(url + '/login/login.do?method=getVerifyImage', i, 'serverTimeList')
          // this.server == change server router
          // if (this.server) {
          //   cookie.set('SESSION', SESSION, {domain: Url.extractHostname(url)})
          // }
        })
      },
      // loadImg (url, i, timeList) {
      //   console.log(url, '?????????')
      //   const et = new Date().getTime()
      //   const v = this.getValue(et - this.T)
      //   this.$set(this[timeList], i, et - this.T)
      //   this.$set(this[timeList + 'Value'], i, v)
      //   this.$set(this[timeList], i, '> 10000')
      //   this.$set(this[timeList + 'Value'], i, 0)
      //   if (window.localStorage.getItem('api') && window.localStorage.getItem('api').replace('www.', '') === url.line.replace('www.', '')) {
      //     window.localStorage.removeItem('api')
      //   }
      // },
      testAline (line, i, timeList) {
        const st = new Date().getTime()
        this.$http.jsonp(line).then((rep) => {
        }, (rep) => {
          const et = new Date().getTime()
          const v = this.getValue(et - st)
          this.$set(this[timeList], i, et - st)
          this.$set(this[timeList + 'Value'], i, v)
          if (rep.status !== 0) {
            this.$set(this[timeList], i, '> 10000')
            this.$set(this[timeList + 'Value'], i, 0)
            if (window.localStorage.getItem('api') && window.localStorage.getItem('api').replace('www.', '') === line.replace('www.', '')) {
              window.localStorage.removeItem('api')
            }
          }
        }).finally((rep) => {
          // console.log('final', rep)
          if (this.auto && timeList === 'serverTimeList' && i === this.serverList.length - 1) {
            setTimeout(() => {
              this.$router.push('/login/login')
            }, 0)
          }
        })
      },
      testLine (line, i, timeList, lineHost) {
        this.reqCount++
        const st = new Date().getTime()
        this.$http.jsonp(line).then((rep) => {
          let curLine = this.findLineItemByHost(lineHost) // this.lineList[i]
          curLine = this.setCurSpeedLineData(st, curLine)
          this.$set(this.lineList, i, curLine)
        }, (rep) => {
          let curLine = this.findLineItemByHost(lineHost) // this.lineList[i]
          curLine = this.setCurSpeedLineData(st, curLine)
          if (rep.status !== 0) {
            curLine.speed = 10000
            curLine.speedFlag = 0
            if (window.localStorage.getItem('api') && window.localStorage.getItem('api').replace('www.', '') === line.replace('www.', '')) {
              window.localStorage.removeItem('api')
            }
          }
          this.$set(this.lineList, i, curLine)
        }).finally((rep) => {
          this.orderLlinBySpeed()
          if (this.auto && timeList === 'serverTimeList' && i === this.serverList.length - 1) {
            setTimeout(() => {
              this.$router.push('/login/login')
            }, 0)
          }
        })
      },
      findLineItemByHost (lineAddress) {
        return this.lineList.find((line) => {
          return line.line === lineAddress
        })
      },
      setCurSpeedLineData (st, curLine) {
        const et = new Date().getTime()
        const v = this.getValue(et - st)
        curLine.speed = et - st
        curLine.speedFlag = v
        return curLine
      },
      getValue (t) {
        if (t < 100) return 10
        else if (t < 200) return 9
        else if (t < 300) return 8
        else if (t < 400) return 7
        else if (t < 500) return 6
        else if (t < 600) return 5
        else if (t < 700) return 4
        else if (t < 800) return 3
        else if (t < 900) return 2
        else return 1
      },
      orderLlinBySpeed () {
        this.lineList = this.listOrderByField(this.lineList, 'speed')
        this.$forceUpdate()
      },
      // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      // switchCS (r) {
      //   api.api = r
      //   this.cs = api.api
      //   this.$message.success('线路切换成功！')
      // },
      // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
      goLogin (r) {
        if (this.server) {
          if (r === this.currentServer) {
            this.$emit('close')
            return this.$message.warning('已是当前线路，无需切换')
          }
          api.preApi = api.api
          api.api = r
          this.currentServer = api.api
          this.$message.success('线路切换成功，您将需要重新去登录')
          this.$emit('close')
          this.__setCall({
            fn: '__logoutChat',
            args: {
              stay: true,
              fn () {
                api.api = r
              }
            }
          })
          store.actions.setUser()
          this.$router.push('/login/login')
          // this.$router.push({
          //   path: '/login/login'
          //   // query: {
          //   //   un_: this.account,
          //   //   pwd: '123qwe'
          //   // }
          // })
        } else {
          if (r !== this.currentServer) window.location.href = r + '/'
          else this.$router.push('/')
        }
      },
      listOrderByField
    }
  }
</script>

<style lang="stylus">

  .login-test + .download
    display none
    
</style>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  W = 2.7rem
  H = 1.8rem
  .route-index
  .time
    font-family Roboto
    font-size 0.72rem
    vertical-align sub
    text-shadow()
    &.ft36
      font-size .36rem
  .time
    font-size .3rem
  .login-test
    text-align center
    color #fff
    &.no-title
      h2 
        display none
    h2
      font-size .18rem
      font-weight normal

      
  .routers
    width 9.2rem;
    padding .5rem 1rem
    text-align center
    display inline-block
    .col-content
      position relative
      height H
      padding 0 PWX
      margin-bottom .3rem
      radius()
      text-align left
      overflow hidden
      background-color rgba(255, 255, 255, .2)
      box-shadow .02rem .02rem .02rem rgba(0, 0, 0, .2)
      cursor pointer
      &:hover
        background-color rgba(255, 255, 255, .4)
      &:active
        background-color rgba(255, 255, 255, .6)
      &:after
      &:before
        background-color GOLD
        position absolute
        right 0
        top 0
        width 2rem
        text-align center
        padding 0.05rem 0
        font-shadow()
        transform rotateZ(42deg) translateY(-160%)  translateX(30%) 
      &.fast.current
        &:before
          padding .1rem 0 0.05rem 0
          transform rotateZ(42deg) translateY(-190%)  translateX(30%) 
        &:after
          transform rotateZ(42deg) translateY(-110%)  translateX(30%) 
          
        
        
      &.fast:after
        content '最快'
        bg-gradient(180deg, #ff7200, #ff5e00)
      &.usual:before
        content '常用'
        bg-gradient(180deg, #1ab8f3, #1a9ff3)
      &.current:before
        content '当前'
        bg-gradient(180deg, #1ab8f3, #1a9ff3)
        // transform rotateZ(-42deg) translateY(-215%) translateX(-32%)
        
        
      
      .timer
        text-align right
      
  .login-test
    .routers
      width 10rem
      .el-col-8
        width 50%
    .col-content
      height 1rem
      .signal-bar
        position relative
        line-height 1.3rem
        top .1rem
        margin-left PWX
        display inline-block
      
      .timer
        position absolute
        right PWX
        top 0
        line-height 1.3rem
        .time
          font-size .2rem
</style>
