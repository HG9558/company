<template lang="jade">
  // transition(appear=true name="zoom")
  .game-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")

    <!-- 游戏信息 -->
    //- GameInfo.fixed(v-on:set-timeout="fetchTimeout" v-bind:v-bind:NPER="NPER" v-bind:CNPER="CNPER" v-bind:timeout="timeout" v-bind:type="type" v-bind:class="[page.class, page.class + '-middle', {show: scrollAtBottom}]" v-on:set-NPER = "setNPER" v-bind:gameid = "page.gameid" v-show="scrollAtBottom")
    
    //- GameSideButtons(v-bind:gameid = "page.gameid" v-bind:game-type="gameType" v-bind:type="type" style="display: none")

    .game-content.scroll-content(ref="GC" )
      <!-- 开奖信息 -->
      //- GameLuckyNumberWithHistory(v-bind:gameid = "page.gameid" v-bind:game-type="gameType" v-bind:overtime="overtime" v-bind:lucknumbers="lucknumbers" v-bind:NPER="NPER" v-bind:PNPER="PNPER" v-bind:FNPER="FNPER" @click.native="showLuckyNumberHistory = !showLuckyNumberHistory" v-bind:allLuckyNumbers="allLuckyNumbers" )

      iframe(ref="pk10df" src="/xy_activity/pk10/index.html " v-if=" gameType === 'PK10' && showDF && gameid !==  39 " style="border: 0; width: 100%; height: 6.1rem" id="pk10df" @load=" pk10dfload() ")
      
      <!-- 游戏信息 -->
      GameInfo(v-on:set-timeout="fetchTimeout" ref="GI" v-bind:game-type="gameType" v-bind:NPER="NPER" v-bind:CNPER="CNPER" v-bind:timeout="timeout" v-bind:type="type" v-bind:class="['game-header-' + page.class]" v-on:set-NPER = "setNPER" v-bind:gameid = "page.gameid" v-bind:allLuckyNumbers="allLuckyNumbers" v-bind:methodid="methodid" v-bind:overtime="overtime" v-bind:lucknumbers="lucknumbers")

      <!-- 东森专用 -->
      //- NewGameInfo(v-bind:volume="page.volume" v-bind:overtime="overtime" v-bind:lucknumbers="lucknumbers" v-bind:PNPER="PNPER" v-bind:FNPER="FNPER" v-on:set-timeout="fetchTimeout" ref="GI" v-bind:game-type="gameType" v-bind:NPER="NPER" v-bind:CNPER="CNPER" v-bind:timeout="timeout" v-bind:type="type" v-bind:class="[page.class, page.class + '-middle', { 'my-hide' : scrollAtBottom}]" v-on:set-NPER = "setNPER" v-bind:gameid = "page.gameid" v-bind:allLuckyNumbers="allLuckyNumbers" v-bind:methodid="methodid")
      .relative
        .inlb(style="width: 75%")
          <!-- 游戏菜单 -->
          GameMenu(v-bind:type="type" v-bind:game-type="gameType" v-on:type="setType" v-bind:menus="menus" v-bind:getTitle="getTitle" v-bind:getUpTitle="getUpTitle" v-bind:mt = "mt" v-bind:gameid=" page.gameid " v-bind:CMCH=" CMCH ")

          //- 快钱下单
          GameKQOrderBar.onbefore(v-bind:currency="currency" v-bind:ns =" ns " v-bind:game-type="gameType"  v-bind:type="type" style="box-shadow: none;" v-bind:class="{ 'opacity-1' : wn > 0, 'opacity-0' : wn === 0 }" v-bind:n="n" v-bind:pay="pay"    v-bind:times="times" v-bind:canOrder="canOrder" v-on:set-times="setTimes"  v-on:order="order" v-on:quickbook="quickbook" v-if=" mt === 'kq' && type.toporderbar ")


          <!-- 选号区 -->
          GameSelection(v-bind:type="type" v-bind:gameid="page.gameid" v-on:n-change="Nchange" v-on:wn-change="WNchange"  v-on:set-nsns="setNsns" v-on:set-ps="setPs" v-bind:CMCH=" CMCH ")

          //- 快钱下单
          GameKQOrderBar.onafter(v-bind:currency="currency"  v-bind:ns =" ns " v-bind:game-type="gameType"  v-bind:type="type" style="box-shadow: none;" v-bind:class="{ 'opacity-1' : wn > 0, 'opacity-0' : wn === 0 }" v-bind:n="n" v-bind:pay="pay"  v-bind:times="times"  v-bind:canOrder="canOrder" v-on:set-times="setTimes"  v-on:order="order" v-on:quickbook="quickbook" v-if=" mt === 'kq' || gameType === 'PCDD' ")


          <!-- 下单 -->
          GameOrderBar.inner-bar(v-bind:timeout="timeout" v-bind:ns =" ns " v-bind:game-type="gameType"  v-bind:type="type" style="box-shadow: none; height: auto"  v-bind:n="n" v-bind:wn="nw" v-bind:pay="pay" v-bind:times="times" v-bind:currency="currency" v-bind:point="point"  v-bind:P="P" v-bind:PA="PA" v-bind:canOrder="canOrder" v-bind:dtMaxPrize = "dtMaxPrize" v-bind:dzMaxPrize = "dzMaxPrize" v-on:set-times="setTimes" v-on:set-currency = "setCurrency" v-on:set-point="setPoint" v-on:order="order" v-on:quickbook="quickbook" v-if=" mt !== 'kq' &&  gameType !== 'PCDD' ")


          <!-- 投注单 -->
          GameOrderList(v-bind:ns="ns" v-on:remove-order="removeOrder" ref="orders" v-bind:show="follow.show" v-bind:CNPER="CNPER" v-bind:issues="issues" v-bind:n="N" v-bind:pay="NPAY"  v-bind:NPER="follow.NPER" v-bind:PAY="follow.pay" v-bind:checked="checked" v-bind:pot="pot" v-on:toggle-checked="toggleChecked" v-on:toggle-pot="togglePot" v-on:showFollow="showFollow" v-on:book="book" )

          <!-- 追号栏 -->
          transition(name="slide-left" appear=true key="follow")
            GameFollowbar.inner-bar(v-if="follow.show" v-bind:stop="follow.stop" v-bind:CNPER="CNPER" v-bind:issues="issues" v-on:close-follow="closeFollow"  v-on:set-follow="setFollow")

          <!-- 追号单 -->
          transition(name="slide-left" appear=true key="follow")
            GameFollowList(v-if="follow.show" v-bind:FCNPER="follow.CNPER" v-bind:CNPER="CNPER" v-bind:pay="N1PAY" v-on:set-follow="setFollow" v-bind:issues="issues" v-bind:ns="ns" v-bind:nsl="ns.length")
          
          <!-- 总计栏 -->
          GameAmountBar.inner-bar.inner-amount-bar(:show="follow.show" v-bind:CNPER="CNPER" v-bind:issues="issues" v-bind:n="N" v-bind:pay="NPAY"  v-bind:NPER="follow.NPER" v-bind:PAY="follow.pay" v-bind:checked="checked" v-bind:pot="pot" v-on:toggle-checked="toggleChecked" v-on:toggle-pot="togglePot" v-on:showFollow="showFollow" v-on:book="book" v-if="ns.length > 0 && follow.show" style="display: none")

        .inlb.absolute(style="width: 25%; top: 0; right: 0; bottom: 0; background: #999; vertical-align: top")
          GameRecent(v-bind:gameid="gameid" v-bind:NPER="NPER" v-bind:CNPER="CNPER" v-bind:gameType="gameType" v-bind:allLuckyNumbers="allLuckyNumbers.slice(0, 30)" v-bind:methodid="methodid" v-bind:type="type")
          
      .bgc-w.mt_10.pt_15.pb_15(style="background-color: #fff")
        .pl_15
          span.mr_10.pointer(v-for=" (x, i) in gameMoreInfo " @click=" gameMoreInfoI = i " v-bind:style=" gameMoreInfoI === i ? {color: '#333', fontWeight: 'bold'} : {} " v-show=" i !== 2 || type.ludan ") {{ x.n }}
            span(v-if=" i === 2 && type.ludan ") ({{ type.ludantitle }})
        .pl_15.pr_15.pt_10
          component(:is=" gameMoreInfo[gameMoreInfoI].component " v-bind:gameType="gameType" v-bind:type="type"  v-bind:gameid="page.gameid" v-bind:methodName="type.ludan" v-bind:issueList="allLuckyNumbers.map(x => x).reverse()")
        //- GameRecentOrder( v-bind:type="type"  v-bind:gameid="page.gameid")
        //- Ludan(v-bind:gameType="gameType" v-bind:gameid="page.gameid" v-bind:methodName="ludanMethodName" )
    <!-- 下单 -->
    //- GameOrderBar.fixed.inner-bar(v-bind:ns="ns" v-bind:game-type="gameType"  v-bind:type="type" v-if="ns.length === 0"  v-bind:n="n" v-bind:times="times" v-bind:currency="currency" v-bind:point="point"  v-bind:P="P" v-bind:canOrder="canOrder" v-bind:pay="pay" v-on:set-times="setTimes" v-on:set-currency = "setCurrency" v-on:set-point="setPoint" v-on:order="order" v-on:quickbook="quickbook")


</template>
<script>
import GameLuckyNumber from 'components/GameLuckyNumber'
import GameLuckyNumberWithHistory from 'components/GameLuckyNumberWithHistory'
import GameLuckyNumberHistory from 'components/GameLuckyNumberHistory'
import GameRecent from 'components/GameRecent'
import GameSideButtons from 'components/GameSideButtons'
import GameInfo from 'components/GameInfo'
import NewGameInfo from 'components/NewGameInfo'
import GameMenu from 'components/GameMenu'
import GameSelection from 'components/GameSelection'
import GameOrderBar from 'components/GameOrderBar'
import GameKQOrderBar from 'components/GameKQOrderBar'
import GameOrderList from 'components/GameOrderList'
import GameAmountBar from 'components/GameAmountBar'
import GameFollowbar from 'components/GameFollowbar'
import GameFollowList from 'components/GameFollowList'
import GameRecentOrder from 'components/GameRecentOrder'
import GameRecentChaseOrder from 'components/GameRecentChaseOrder'
import Ludan from 'components/Ludan'
import api from '../../http/api'
import M from '../../util/M'
import util from '../../util'
import store from '../../store'
// import GameOrderHistory from 'components/GameOrderHistory'
// import GameFollowHistory from 'components/GameFollowHistory'

export default {
  props: ['page', 'money', 'free'],
  data () {
    return {
      gameMoreInfoI: 0,
      gameMoreInfo: [
        {n: '投注记录', component: 'GameRecentOrder'},
        {n: '追号记录', component: 'GameRecentChaseOrder'},
        {n: '路单', component: 'Ludan'}
      ],
      showDF: window.localStorage.getItem('showDF') === 'true',
      ME: store.state.user,
      isTry: store.state.user.isTry,
      scrollAtBottom: false,
      // 页面的url
      // url: 'one',
      updateFromSocket: false,
      // 最近的已开奖期数
      NPER: '100000000', // 下一期
      CNPER: '100000000', // 当前
      // 用户选择投注的起始期数
      // usernper: '100000000',
      // 最近的已开奖期号码
      lucknumbers: [0, 0, 0, 0, 0],
      // 即将开奖的期数
      // CNPER: 150730053 + 1,
      // 即将开奖倒计时
      // 秒
      timeout: (100 * 3600) - 1,
      // timeout: 10,
      // 剩余的奖期数
      FNPER: 0,
      // 开过的奖期数
      PNPER: 0,
      // 玩法信息
      // type: {
      //   id: '5-1-1',
      //   // 玩法名
      //   title: '',
      //   // 玩法描述
      //   description: ''
      // },
      wnt: 0,
      // delay by n
      wn: 0,
      // 选择的注数
      n: 0,
      // 可能中奖的注数
      nw: 1,
      // 投注列表
      ns: [],
      // 投注号码
      nsns: [],
      // 投注号码文字表示
      nsnsTitle: '',
      // 投注号码倍数表示
      nsnsTimes: '',
      // 投注号码万千百十个表示
      nsnsAtitle: '',
      // 倍数
      times: 1,
      // 金额单位
      /***
      * 1 元
      *.1 角
      *.01 分
      *.001 厘
      ***/
      currency: {
        value: 1,
        title: '2元',
        model: 1
      },
      // 奖金
      bonus: 0.00,
      // 返点
      point: 0.00,
      // 单挑、限额
      dtMaxPrize: 0,
      dzMaxPrize: 0,
      // 追号信息
      follow: {
        // 显示追号单
        show: false,
        // 追号期数
        NPER: 0,
        // 追号金额
        pay: 0,
        // 追号起始期
        CNPER: '100000000',
        // 中奖后停止追号
        stop: true,
        // 追号类型，1-同步，2-翻倍，3-利润率
        type: 1,
        // 翻倍追号倍数
        t: 2,
        // 低收益率
        point: 50,
        items: []
      },
      // 使用优惠卷
      checked: false,
      // 奖池投注
      pot: false,
      // 位置集合
      ps: [],
      // 游戏所有玩法的返点信息
      PS: [],
      // 游戏所有奖期的开奖时间
      issues: [],
      showLuckyNumberHistory: false,
      overtime: false,
      lucknumbersTimeout: 0,
      allLuckyNumbers: [],
      notify: null,
      notifyshow: true,
      hasUnable: false,
      // missCodeHot
      MCH: {}
    }
  },
  computed: {
    // current MCH
    CMCH () {
      return this.methodidtype === '1' ? this.MCH[this.methodid] : null
    },
    gameid () {
      return this.page.gameid
    },
    allMenus () {
      return this.mt !== 'kq' && this.kqmenus ? this.menus.concat(this.kqmenus) : this.menus
    },
    menuItemArray () {
      return this.allMenus.reduce((p, m, i) => {
        return m.groups.reduce((p, g, j) => {
          return g.items.reduce((p, it, k) => {
            p.push(it)
            return p
          }, p)
        }, p)
      }, [])
    },
    pricePerOrder () {
      return this.gameType === 'HC6' || this.mt === 'kq' ? 1 : 2
    },
    callId () {
      return this.page.gameid + '|' + this.type.id
    },
    pay () {
      return this.nsnsTimes ? ((this.nsnsTimes.split(',').reduce((p, n) => { return (p += parseFloat(n)) }, 0) || 0) * this.currency.value) : Number((this.n * this.times * this.currency.value * this.pricePerOrder))
    },
    // CNPER () {
    //   return this.NPER + 1
    // },
    canOrder () {
      return this.n && this.pay > 0
    },
    // 已投注注数
    N () {
      return this.ns.reduce((p, n) => {
        return (p += n.n)
      }, 0)
    },
    // 已投注注数金额
    NPAY () {
      return this.ns.reduce((p, n) => {
        return (p += n.pay)
      }, this.pot ? this.ns.length : 0)
    },
    // 已投注注数金额不包含times
    N1PAY () {
      return this.ns.reduce((p, n) => {
        return (p += n.pay / n.times)
      }, 0)
    },
    // P () {
    //   return this.PS.find(p => {
    //     return (p.methodid + '') === this.methodid
    //   }) || {maxprize: 0, minprize: 0, scale: 0, maxpoint: 0.00, minpoint: 0}
    // },
    // newUserPoint
    P () {
      return (this.PS[this.methodid] || [{maxprize: 0, minprize: 0, scale: 0, maxpoint: 0.00, minpoint: 0}])[0]
    },
    PA () {
      return (this.PS[this.methodid] || [{maxprize: 0, minprize: 0, scale: 0, maxpoint: 0.00, minpoint: 0}])
    },
    AFTERS () {
      return this.PA.reduce((p, x, i) => {
        p.push(x.maxprize)
        return p
      }, [])
    },
    methodid () {
      return M[this.type.id + this.idType].split(':')[0]
    },
    methodidtype () {
      return M[this.type.id + this.idType].split(':')[1]
    },
    idType () {
      return this.gameType === 'SSL' ? '-' + this.gameType : ''
    },
    hasRepeatOrder () {
      return this.ns.filter(o => (o.methodid + '') === this.methodid && o.codes === this.nsns && o.pos === this._getPsstring(this.ps))[0]
    }
  },
  watch: {
    'type.ludan' (n, o) {
      if (n) {
        this.gameMoreInfoI = 2
      } else {
        this.gameMoreInfoI = 0
      }
    },
    overtime () {
      setTimeout(() => {
        this.__setCall({fn: '__orderlist'})
      }, 1000)
      setTimeout(() => {
        this.__setCall({fn: '__orderlist'})
      }, 3000)
      setTimeout(() => {
        this.__setCall({fn: '__orderlist'})
      }, 10000)
    },
    methodid () {
      this.__setCall({
        fn: '__setRowsSl',
        args: (this.PS[this.methodid] || [{maxprize: 0, minprize: 0, scale: 0, maxpoint: 0.00, minpoint: 0, singleRowMaxLen: 0}])[0].singleRowMaxLen || 0
        // args: (this.PS.find(p => {
          // return (p.methodid + '') === this.methodid
        // }) || {maxprize: 0, minprize: 0, scale: 0, maxpoint: 0.00, minpoint: 0, singleRowMaxLen: 0}).singleRowMaxLen})
      })
    },
    n (n, o) {
      clearTimeout(this.wnt)
      if (this.ns.length === 0) return (this.wn = 0)
      this.wnt = setTimeout(() => {
        this.wn = n
      }, n === 0 ? 1000 : 0)
    },
    ns () {
      if (this.ns.length === 0) this.closeFollow()
    },
    // P () {
    //   this.p && (this.point = this.P.minpoint)
    //   this.p && (this.bonus = this.P.maxprize)
    // },
    timeout () {
      if (this.timeout === 0) {
        setTimeout(this.__getIssue, 1000)
        this.__getTraceIssueList()
        setTimeout(this.__recentlyCode, 1000)
        setTimeout(this.__recentlyCode, 5000)
      } else if (this.timeout < 1) {
        setTimeout(this.__getIssue, 1000)
      }
    },
    showLuckyNumberHistory () {
      if (this.showLuckyNumberHistory) {
        this.__recentlyCode(true)
      }
    },
    // 如果当前奖期改变，那么提示已投注的期数直接过渡到下期
    CNPER (n, o) {
      if (this.ns.length > 0 && this.notifyshow) {
        if (!this.notify) {
          this.notify = this.$modal.question({
            content: '<div class="text-666" style="line-height: .3rem;text-indent: .15rem; text-align: left">当前期为<span class="text-danger">' + n + '</span>，您在<span class="text-danger">' + o + '</span>期的投注将默认直接转到当前期</div>',
            btn: ['转到当前期，不再提醒', '清空投注'],
            target: this.$el,
            ok () {
              this.notifyshow = false
            },
            cancel () {
              this.ns = []
            },
            close () {
              this.notify = null
            },
            O: this
          })
        } else {
          this.notify.content = '<div class="text-666" style="line-height: .3rem;">当前期为<span class="text-danger">' + n + '</span>，您在<span class="text-danger">' + o + '</span>期的投注将默认直接转到当前期</div>'
        }
      }
    },
    'follow.show' () {
      if (this.follow.show) {
        // this.__getTraceIssueList()
        // auto scroll to just can see orders
        setTimeout(() => {
          if (this.platform !== 'ds') this.$refs.GC.scrollTop = (util.getOffset(this.$refs.orders.$el, 1).top || this.$refs.GC.scrollTop)
        }, 0)
      }
    },
    P () {
      // this.__setCall({fn: '__setAfters', args: this.P.maxprize})
      this.__setCall({fn: '__setAfters', args: this.AFTERS})
    }
  },
  created () {
  },
  mounted () {
    // 获得当前奖期
    this.__getIssue()
    // 获得游戏所有奖期的开奖时间
    this.__getTraceIssueList()
    // 获得游戏所有玩法对应的返点信息
    this.getUserpoint()
    // 获得历史开奖号码
    this.__recentlyCode()
    // this.getLottSets()
    this.follow.CNPER = this.CNPER
    // setInterval(() => {
    //   this.CNPER = parseInt(this.CNPER) + 1 + ''
    // }, 3000)
    if (this.isTry) this.checked = true
  },
  beforeDestroy () {
    clearTimeout(this.lucknumbersTimeout)
  },
  methods: {
    pk10dfload () {
      let w = this.$refs['pk10df'].contentWindow
      w.onReady = () => {
        this.__setCall({fn: '__startpk10Game', callId: undefined})
      }
    },
    __showDF (showDF) {
      this.showDF = showDF
    },
    // 隐藏返点为0的方法
    hideItem (id) {
      let x = this.menuItemArray.find(i => M[i.id + this.idType].split(':')[0] === id)
      if (x) x.hide = true
    },
    scrollHander (evt) {
      if (this.$refs.GC.scrollTop > 96) this.scrollAtBottom = true
      else this.scrollAtBottom = false
    },
    getLottSets () {
      this.$http.myget(api.getLottSets).then(({data}) => {
        // console.log(data)
      })
    },
    // 获得当前已开奖信息
    __recentlyCode (noloop) {
      if (!noloop && this.lucknumbersTimeout) clearTimeout(this.lucknumbersTimeout)
      this.$http.mypost(api.recentlyCodeNew, {gameid: this.page.gameid, pageNum: 1, size: 100}).then(({data}) => {
        // success
        if (data.success > 0 && data.items.length > 0) {
          data.items.forEach(d => {
            d.lucknumbers = d.code.split(',')
            // 如果没有code, 但已经有了code
            if (!d.code) {
              let the = this.allLuckyNumbers.find(x => String(x.issue) === String(d.issue))
              the && (d = Object.assign(d, the))
            }
          })
          let lst = data.items[1] || data.items[0]
          if (data.items[0] && data.items[0].code) lst = data.items[0]
          this.overtime = false
          this.NPER = lst.issue + ''
          this.lucknumbers = lst.lucknumbers
          this.allLuckyNumbers = data.items || []
          // 如果最后一期已经在allLuckyNumbers中了， 就不再做后续操作
          // if (this.allLuckyNumbers.find(x => String(x.issue) === String(lst.issue))) {
          //   if (lst.codeStyle) this.allLuckyNumbers.find(x => String(x.issue) === String(lst.issue)).codeStyle = lst.codeStyle
          //   if (this.updateFromSocket) {
          //     this.updateFromSocket = false
          //     return
          //   }
          // }
          // if (this.NPER === lst.issue + '' && !noloop) {
          //   this.overtime = true
          //   this.lucknumbersTimeout = setTimeout(() => {
          //     this.__recentlyCode()
          //     clearTimeout(this.lucknumbersTimeout)
          //     this.lucknumbersTimeout = 0
          //   }, 3000000)
          // } else {
          //   this.overtime = false
          //   this.NPER = lst.issue + ''
          //   this.lucknumbers = lst.lucknumbers
          //   // this.page.volume && this.__setCall({fn: '__music', callId: undefined})
          //   parseInt(window.localStorage.getItem('volume')) && this.__setCall({fn: '__music', callId: undefined})
          // }
          // this.allLuckyNumbers = data.items || []
        } else if (data.success >= 0) {
          this.overtime = true
          this.lucknumbersTimeout = setTimeout(() => {
            this.__recentlyCode()
            clearTimeout(this.lucknumbersTimeout)
            this.lucknumbersTimeout = 0
          }, 3000)
        }
      }, (rep) => {
        // error
      })
    },
    // 获得当前正在进行的奖期信息
    __getIssue () {
      this.$http.mypost(api.getIssue, {gameid: this.page.gameid}).then(({data}) => {
        // success
        if (data.success > 0) {
          // 当前期
          // this.NPER = (parseInt(data.issue) || 1) - 1
          this.CNPER = data.issue
          this.PNPER = data.openedCount
          this.FNPER = data.dailyCount
          this.timeout = Math.floor((data.saleend - data.current) / 1000) || Math.random()
          this.codeMissColdHeat()
        } else {
          // this.$message.error({message: '当前奖期获取失败！'})
          this.$modal.warn({
            target: this.$el,
            content: '当前奖期已停止销售！',
            btn: ['好的']
          })
          // this.timeout += 0.05
        }
      }, (rep) => {
        // error
        this.$message.error({message: '当前奖期获取失败！'})
        this.timeout += 0.05
      })
    },
    // lotteryId=17
    codeMissColdHeat () {
      this.$http.mypost(api.codeMissColdHeat, {lotteryId: this.page.gameid}).then(({data}) => {
        // success
        if (data.success > 0) {
          delete data.success
          for (const k in data) {
            if (k.indexOf('|') !== -1) {
              k.split('|').forEach(x => {
                data[x] = data[k]
              })
            }
          }
          this.MCH = data
        }
      }, (rep) => {
        // error
        this.$message.error({message: '当前遗漏和冷热信息获取失败！'})
      })
    },
    __upDatePoints () {
      this.getUserpoint()
    },
    // 获得该游戏所有返点信息
    getUserpoint () {
      this.$http.mypost(api.getUserpoint, {gameid: this.page.gameid}).then(({data}) => {
        // success
        // Object.values(data.items).forEach(x => {
        //   x.forEach(y => {
        //     y.maxpoint = '0.078'
        //     y.minpoint = '0.078'
        //   })
        // })
        if (data.success > 0) {
          this.PS = data.items
          this.dtMaxPrize = (data.dtMaxPrize * 1) || 30000
          this.dzMaxPrize = (data.dzMaxPrize * 1) || 400000
        }
        this.menuItemArray.forEach(mi => {
          this.$set(mi, 'hide', !data.items[M[mi.id + this.idType].split(':')[0]])
        })
        this.updateDefaultMenu()
        setTimeout(() => {
          window.localStorage.getItem('point') && Number(this.P.maxpoint) >= Number(window.localStorage.getItem('point')) && (this.point = window.localStorage.getItem('point'))
        }, 0)
      }, (rep) => {
        // error
      })
    },
    updateDefaultMenu () {
      let menu = this.menuItemArray.find((item) => !item.hide)
      if (menu) this.type = menu
    },
    __getTraceIssueList () {
      // if (!this.ME.login) return (this.issues = [])
      if (this.issues && this.issues.length > 20) return this.issues.shift()
      this.$http.mypost(api.getTraceIssueList, {gameid: this.page.gameid}).then(({data}) => {
        // success
        if (data.success > 0) {
          // data.items.forEach(d => (d.selected = false))
          this.issues = data.items
        }
      }, (rep) => {
        // error
      })
    },
    __storeHistoryItem () {
      let pre = JSON.parse(window.localStorage.getItem('historyItems' + this.gameType + this.gameid + this.mt) || '[]')
      let index = pre.findIndex(x => x.id === this.type.id)
      if (index !== -1) pre.splice(index, 1)
      this.type.upTitle = (this.getUpTitle || this.getTitle)()

      pre.unshift(this.type)
      if (pre.length > 5) pre.length = 5
      window.localStorage.setItem('historyItems' + this.gameType + this.gameid + this.mt, JSON.stringify(pre))
      this.__setCall({fn: '__getHistoryItems', callId: undefined})
    },
    book (pot, nper) {
      this.booking(pot, nper)
      this.__storeHistoryItem()
    },
    // 投注
    booking (pot, nper) {
      if (this.follow.show && !this.follow.items[0]) {
        return this.$modal.warn({
          target: this.$el,
          content: '您还没有勾选任何追号奖期！',
          btn: ['确定']
        })
      }
      if (!this.ME.login) return this.__setCall({fn: '__popLogin', callId: undefined, args: true})
      if ((this.follow.show && this.follow.pay > (this.checked ? this.free : this.money)) || (!this.follow.show && this.NPAY > (this.checked ? this.free : this.money))) {
        return this.$modal.question({
          target: this.$el,
          content: (this.checked ? '信游币' : '余额') + '不足, 请充值。',
          btn: [(this.checked ? '确定' : '去充值')],
          ok () {
            if (!this.checked) {
              this.$router.push('/me/2-1-1')
            }
          },
          O: this
        })
      }

      let loading = this.$loading({
        text: '投注中...',
        target: this.$el
      }, 10000, '投注超时...')
      this.$http.post(api.booking, {
        gameid: parseInt(this.page.gameid), // 游戏代码
        issue: String(nper || this.CNPER), // 起始期号
        totalnums: this.N, // 总注数
        totalmoney: this.NPAY, // 总投注金额
        type: this.follow.show ? 2 : 1, // 类型：1-投注；2-追号
        isusefree: this.checked ? 1 : 0, // 是否使用优惠券，0-否，1-是
        items: JSON.stringify(this._getOrderItems()),
        trace: this.follow.show ? JSON.stringify(this._getTrace()) : '',
        isJoinPool: !this.follow.show && pot ? 1 : 0
      }).then(({data}) => {
        // success
        if (data.success > 0) {
          // this.$message.success('投注成功')
          loading.text = '投注成功'
          this.$modal.success({
            target: this.$el,
            content: '投注成功',
            btn: ['确定'],
            timeout: 3000
          })
          // setTimeout()
          // this.__loading({
          //   text: '投注成功.',
          //   target: this.$el
          // }, 1000)
          // this.__setCall({fn: '__getOrderList'})
          // this.__setCall({fn: '__getFollowList'})
          this.__setCall({fn: '__getUserFund', callId: undefined})
          setTimeout(() => {
            this.__setCall({fn: '__orderlist'})
          }, 200)
          this.ns = []
          this.follow.items = []
        } else {
          // this.$message.warning('投注失败！')
          let temp = []
          // data.failItems.split(',').map(i => parseInt(i)).sort((a, b) => b - a).forEach(i => {
          //   this.ns.splice(i, 1)
          // })
          loading.text = data.msg || '投注失败！'
          !data.msg && this.$modal.warn({
            target: this.$el,
            content: data.msg || '投注失败！',
            btn: ['确定']
          })
          if (parseInt(data.msg)) {
            data.msg.split(',').map(i => parseInt(i)).forEach(i => {
              temp.push(this.ns[i - 1])
            })
            this.ns = temp
            loading.close()
            this.$modal.warn({
              target: this.$el,
              content: '投注列表中的第' + data.msg + '项投注失败！',
              btn: ['确定']
            })
            this.$modal.warn({
              target: this.$el,
              content: '投注成功',
              btn: ['确定'],
              timeout: 3000
            })
          }
          // this.__loading({
          //   text: '投注失败！',
          //   target: this.$el
          // }, 1000)
        }
      }, (rep) => {
        loading.text = '投注失败！'
        this.$modal.warn({
          target: this.$el,
          content: '投注失败！',
          btn: ['确定']
        })
        // this.__loading({
        //   text: '投注失败！',
        //   target: this.$el
        // }, 1000)
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    extract () {
      let items = []
      this.nsns.split('|')[0].split(',').forEach((n, i) => {
        this.nsns.split('|')[1].split(',').forEach((m, j) => {
          items.push({
            methodId: parseInt(this.methodid), // 玩法编号
            projs: 1,
            money: this.times,
            content: n + ',' + m
          })
        })
      })
      return items
    },
    kqquickbook () {
      let loading = this.$loading({
        text: '投注中...',
        target: this.$el
      }, 10000, '投注超时...')
      let items = []
      if (this.type.extract) {
        // 解析出组合的各种结果
        items = this.extract()
      } else {
        this.nsns.split(',').forEach((n, i) => {
          items.push({
            methodId: parseInt(this.methodid), // 玩法编号
            projs: 1,
            money: (this.nsnsTimes.split(',') || [])[i] || 0,
            content: ((this.nsnsAtitle.split(',') || [])[i] ? (this.nsnsAtitle.split(',') || [])[i] + '-' : '') + ((this.nsnsTitle.split(',') || [])[i] || '')
          })
        })
      }
      this.$http.post(api.doBet, {
        betData: JSON.stringify({
          lotteryId: parseInt(this.page.gameid), // 游戏代码
          issue: String(this.CNPER), // 起始期号
          totProjs: this.n, // 总注数
          totMoney: this.pay / this.currency.value, // 总投注金额
          isusefree: 0, // 是否使用优惠券，0-否，1-是
          betList: items
        })
      }).then(({data}) => {
        // success
        if (data.success > 0) {
          // this.$message.success('投注成功')
          loading.text = '投注成功'
          this.$modal.success({
            target: this.mt === 'kq' && this.type.toporderbar ? undefined : this.$el,
            content: '投注成功',
            btn: ['确定'],
            timeout: 3000
          })
          this.__setCall({fn: '__clearSelectedNumbers'})
          setTimeout(() => {
            this.__setCall({fn: '__clearValue'})
          }, 0)
          setTimeout(() => {
            this.__setCall({fn: '__getUserFund', callId: undefined})
          }, 200)
          setTimeout(() => {
            this.__setCall({fn: '__orderlist'})
          }, 400)

          // this.__loading({
          //   text: '投注成功.',
          //   target: this.$el
          // }, 1000)
          // this.__setCall({fn: '__getOrderList'})
          // this.__setCall({fn: '__getFollowList'})
          // this.__setCall({fn: '__getUserFund', callId: undefined})
          // this.ns = []
          // this.follow.items = []
        } else {
          // this.$message.warning('投注失败！')
          // let temp = []
          // data.failItems.split(',').map(i => parseInt(i)).sort((a, b) => b - a).forEach(i => {
          //   this.ns.splice(i, 1)
          // })
          loading.text = parseInt(data.msg) ? '投注失败！' : data.msg
          !data.msg && this.$modal.warn({
            target: this.mt === 'kq' && this.type.toporderbar ? undefined : this.$el,
            content: parseInt(data.msg) ? '投注失败！' : data.msg,
            btn: ['确定']
          })
          // if (parseInt(data.msg)) {
          //   data.msg.split(',').map(i => parseInt(i)).forEach(i => {
          //     temp.push(this.ns[i - 1])
          //   })
          //   this.ns = temp
          //   loading.close()
          //   this.$modal.warn({
          //     target: this.$el,
          //     content: '投注列表中的第' + data.msg + '项投注失败！',
          //     btn: ['确定']
          //   })
          // }
        }
      }, (rep) => {
        loading.text = '投注失败！'
        this.$modal.warn({
          target: this.mt === 'kq' && this.type.toporderbar ? undefined : this.$el,
          content: '投注失败！',
          btn: ['确定']
        })
        // this.__loading({
        //   text: '投注失败！',
        //   target: this.$el
        // }, 1000)
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    quickbook () {
      this.__storeHistoryItem()
      if (!this.ME.login) return this.__setCall({fn: '__popLogin', callId: undefined, args: true})
      let checked = false
      if (this.pay > (checked ? this.free : this.money)) {
        return this.$modal.question({
          target: this.$el,
          content: (checked ? '信游币' : '余额') + '不足, 请充值。',
          btn: [(checked ? '确定' : '去充值')],
          ok () {
            if (!checked) {
              this.$router.push('/me/2-1-1')
            }
          },
          O: this
        })
      }
      if (this.mt === 'kq') return this.kqquickbook()

      let loading = this.$loading({
        text: '投注中...',
        target: this.$el
      }, 10000, '投注超时...')
      let items = []
      if (this.type.mutilpOrderPerRow) {
        this.nsns.split(',').forEach((n, i) => {
          items.push({
            methodid: parseInt(this.methodid), // 玩法编号
            type: parseInt(this.methodidtype),
            pos: this._getPsstring(),
            codes: n,
            count: 1,
            times: (this.nsnsTimes.split(',') || [])[i] || 0,
            money: ((this.nsnsTimes.split(',') || [])[i] || 0) * this.currency.value,
            mode: this.currency.model,
            userpoint: Number(this.point).toFixed(4)
          })
        })
      } else {
        items.push({
          methodid: parseInt(this.methodid), // 玩法编号
          type: parseInt(this.methodidtype),
          pos: this._getPsstring(),
          codes: this._getCodes(),
          count: this.n,
          times: this.times,
          money: this.pay,
          mode: this.currency.model,
          userpoint: Number(this.point).toFixed(4)
        })
      }
      this.$http.post(api.booking, {
        gameid: parseInt(this.page.gameid), // 游戏代码
        issue: String(this.CNPER), // 起始期号
        totalnums: this.n, // 总注数
        totalmoney: this.pay, // 总投注金额
        type: 1, // 类型：1-投注；2-追号
        isusefree: 0, // 是否使用优惠券，0-否，1-是
        items: JSON.stringify(items),
        trace: '',
        isJoinPool: 0
      }).then(({data}) => {
        // success
        if (data.success > 0) {
          // this.$message.success('投注成功')
          loading.text = '投注成功'
          this.$modal.success({
            target: this.$el,
            content: '投注成功',
            btn: ['确定'],
            timeout: 3000
          })
          this.__setCall({fn: '__clearSelectedNumbers'})
          setTimeout(() => {
            this.__setCall({fn: '__clearValue'})
          }, 0)
          setTimeout(() => {
            this.__setCall({fn: '__getUserFund', callId: undefined})
          }, 200)
          setTimeout(() => {
            this.__setCall({fn: '__orderlist'})
          }, 400)
          this.setHistoryLottery(parseInt(this.page.gameid))
          // this.__loading({
          //   text: '投注成功.',
          //   target: this.$el
          // }, 1000)
          // this.__setCall({fn: '__getOrderList'})
          // this.__setCall({fn: '__getFollowList'})
          // this.__setCall({fn: '__getUserFund', callId: undefined})
          // this.ns = []
          // this.follow.items = []
        } else {
          // this.$message.warning('投注失败！')
          // let temp = []
          // data.failItems.split(',').map(i => parseInt(i)).sort((a, b) => b - a).forEach(i => {
          //   this.ns.splice(i, 1)
          // })
          loading.text = parseInt(data.msg) ? '投注失败！' : data.msg
          !data.msg && this.$modal.warn({
            target: this.$el,
            content: parseInt(data.msg) ? '投注失败！' : data.msg,
            btn: ['确定']
          })
          // if (parseInt(data.msg)) {
          //   data.msg.split(',').map(i => parseInt(i)).forEach(i => {
          //     temp.push(this.ns[i - 1])
          //   })
          //   this.ns = temp
          //   loading.close()
          //   this.$modal.warn({
          //     target: this.$el,
          //     content: '投注列表中的第' + data.msg + '项投注失败！',
          //     btn: ['确定']
          //   })
          // }
        }
      }, (rep) => {
        loading.text = '投注失败！'
        this.$modal.warn({
          target: this.$el,
          content: '投注失败！',
          btn: ['确定']
        })
        // this.__loading({
        //   text: '投注失败！',
        //   target: this.$el
        // }, 1000)
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    setHistoryLottery (gameId) {
      if (!gameId || !window.localStorage) return
      let historis = JSON.parse(window.localStorage.getItem('STORAGE_HISTORY_LOTTERIES') || '[]')
      if (historis.indexOf(gameId) !== -1) return
      historis.unshift(gameId)
      if (historis.length > 3) historis.pop()
      window.localStorage.setItem('STORAGE_HISTORY_LOTTERIES', JSON.stringify(historis))
    },
    setType (type) {
      this.type = type
      this.__setCall({fn: '__clearSelectedNumbers'})
      this.__setCall({fn: '__setDefaultTimes', args: this.times})
      setTimeout(() => {
        this.__setCall({fn: '__clearValue'})
      }, 0)
      setTimeout(() => {
        this.__setCall({fn: '__setFt', callId: undefined})
      }, 100)
    },
    toggleChecked () {
      this.checked = !this.checked
    },
    togglePot () {
      this.pot = !this.pot
    },
    showFollow () {
      this.pot = 0
      this.follow.show = true
      this.$nextTick(() => {
        this.$el.querySelector('.follow-list').scrollIntoViewIfNeeded()
      })
    },
    closeFollow () {
      this.pot = false
      this.follow.show = false
      this.clearFollow()
    },
    setFollow ({NPER, pay, CNPER, stop, type, t, point, items}) {
      NPER !== undefined && (this.follow.NPER = NPER)
      pay !== undefined && (this.follow.pay = pay)
      CNPER !== undefined && (this.follow.CNPER = CNPER)
      stop !== undefined && (this.follow.stop = stop)
      type !== undefined && (this.follow.type = type)
      t !== undefined && (this.follow.t = t)
      point !== undefined && (this.follow.point = point)
      items !== undefined && (this.follow.items = items)
    },
    clearFollow () {
      this.follow.NPER = 0
      this.follow.pay = 0
    },
    // 注数
    Nchange (n, hasUnable) {
      this.n = n
      this.hasUnable = hasUnable
    },
    // 注数
    WNchange (nw) {
      this.nw = nw
    },
    // 当前注的号码
    setNsns (nsns, nsnsTitle, nsnsTimes, nsnsAtitle) {
      this.nsns = nsns.replace(/[,]+/g, ',').replace(/^[,]+/g, '').replace(/[,]+$/g, '')
      this.nsnsTitle = nsnsTitle
      this.nsnsTimes = nsnsTimes
      this.nsnsAtitle = nsnsAtitle
    },
    // 当前注的位置
    setPs (ps) {
      this.ps = ps
    },
    setTimes (t) {
      this.times = t
      // if (this.times <= 0) this.times = 1
    },
    setCurrency (c) {
      this.currency = c
    },
    setPoint (p, b) {
      this.point = p
      this.bonus = b
      if (parseFloat(p) > 0) window.localStorage.setItem('point', p)
    },
    // beforeOrder () {
    //   this.__setCall({fn: '__removeRepeat'})
    // },
    // __order () {
    //   this.order()
    // },
    order ({maxWinAmount}) {
      if (this.hasUnable) {
        return this.$modal.warn({
          content: '<div class="text-666" style="line-height: .3rem;text-indent: .15rem; text-align: left">您输入了<span class="text-danger">无效号码</span>，系统已自动删除无效号码</div>',
          btn: ['确定', '取消'],
          target: this.$el,
          ok () {
            if (this.ns.length === 10) {
              return this.$modal.warn({
                content: '<div class="text-666" style="text-align: center; line-height: .3rem;text-indent: .15rem">一次最多只能投注：<span class="text-danger">10</span> 个方案',
                btn: ['确定'],
                target: this.$el
              })
            }
            this.ns.push(Object.assign({title: this.type.title, $: this.currency.title, n: this.n, times: this.times, pay: this.pay, bonus: maxWinAmount || this.bonus, point: (this.point * 100).toFixed(1) + '%', selected: false}, {
              methodid: parseInt(this.methodid), // 玩法编号
              type: parseInt(this.methodidtype),
              pos: this._getPsstring(), // 任选位置信息 ,万千百十个,以逗号“,”连接; w,q,b,s,g
              codes: this._getCodes(), // 投注内容,不同位的用竖线“|”连接，相同位选多个号码用“,”连接.
              nsnsTitle: this.nsnsTitle,
              count: this.n, // 注数
              times: this.times, // 倍数
              money: this.pay, // 金额
              mode: this.currency.model, // 1-元，2-角，3-分，4-厘
              userpoint: this.point // 用户选择的返点
            }))
            this.__setCall({fn: '__clearSelectedNumbers'})
            setTimeout(() => {
              this.__setCall({fn: '__clearValue'})
            }, 0)
          },
          O: this
        })
      } else if (this.hasRepeatOrder) {
        this.$modal.warn({
          content: '<div class="text-666" style="line-height: .3rem;text-indent: .15rem; text-align: left">已存在<span class="text-danger">相同订单</span>了！</div>',
          btn: ['确定'],
          target: this.$el
        })
        this.__setCall({fn: '__clearSelectedNumbers'})
        setTimeout(() => {
          this.__setCall({fn: '__clearValue'})
        }, 0)
      } else {
        if (this.ns.length === 10) {
          return this.$modal.warn({
            content: '<div class="text-666" style="text-align: center; line-height: .3rem;text-indent: .15rem">一次最多只能投注：<span class="text-danger">10</span> 个方案',
            btn: ['确定'],
            target: this.$el
          })
        }
        this.ns.push(Object.assign({ttitle: this.getUpTitle ? this.getUpTitle() : this.getTitle(), title: this.type.title, $: this.currency.title, n: this.n, times: this.times, pay: this.pay, bonus: maxWinAmount || this.bonus, point: (this.point * 100).toFixed(1) + '%', selected: false, new: true}, {
          methodid: parseInt(this.methodid), // 玩法编号
          type: parseInt(this.methodidtype),
          pos: this._getPsstring(), // 任选位置信息 ,万千百十个,以逗号“,”连接; w,q,b,s,g
          codes: this._getCodes(), // 投注内容,不同位的用竖线“|”连接，相同位选多个号码用“,”连接.
          nsnsTitle: this.nsnsTitle,
          count: this.n, // 注数
          times: this.times, // 倍数
          money: this.pay, // 金额
          mode: this.currency.model, // 1-元，2-角，3-分，4-厘
          userpoint: this.point // 用户选择的返点
        }))
        this.__setCall({fn: '__clearSelectedNumbers'})
        setTimeout(() => {
          this.__setCall({fn: '__clearValue'})
        }, 0)
      }
      // this.currency = {
      //   value: 1,
      //   title: '元',
      //   model: 1
      // }
      // this.point = 0.00
      // this.times = 1
      // after push need initial the selected numbers
    },
    _getOrderItems () {
      let items = []
      this.ns.forEach(item => {
        items.push({
          methodid: item.methodid, // 玩法编号
          type: item.type,
          pos: item.pos,
          codes: item.codes,
          count: item.count,
          times: this.follow.show ? 1 : item.times,
          money: this.follow.show ? item.money / item.times : item.money,
          mode: item.mode,
          userpoint: Number(item.userpoint).toFixed(4)
        })
      })
      return items
    },
    _getTrace () {
      return {
        task_type: this.follow.type,
        task_stop: this.follow.stop ? 1 : 0,
        task_begin: this.follow.CNPER,
        task_double_times: this.follow.t,
        task_min_rate: this.follow.point,
        task_money: this.follow.pay,
        items: this._getTraceItems()
      }
    },
    _getTraceItems () {
      let items = []
      this.follow.items.forEach(item => {
        items.push({
          issue: item.issue,
          times: item.times
        })
      })
      return items
    },
    _getPsstring () {
      if (this.type.ps) return this.type.ps
      let psstring = ''
      this.ps.forEach(ps => {
        switch (ps) {
          case 1:
            psstring += 'g,'
            break
          case 2:
            psstring += 's,'
            break
          case 3:
            psstring += 'b,'
            break
          case 4:
            psstring += 'q,'
            break
          case 5:
            psstring += 'w,'
            break
        }
      })
      return psstring ? psstring.slice(0, psstring.length - 1) : ''
    },
    _getCodes () {
      return this.nsns.replace(/[,]+/g, ',').replace(/^[,]+/g, '').replace(/[,]+$/g, '')
    },
    removeOrder (index) {
      if (index === undefined) this.ns = []
      else {
        this.ns.splice(index, 1)
        if (this.ns.length === 0) this.closeFollow()
      }
    },
    setNPER (n) {
      this.NPER = n
    },
    fetchTimeout () {
      this.timeout = 0
    },
    __openWinCode (x) {
      if (String(this.page.gameid) === String(x.lottId)) {
        x.lucknumbers = x.code.split(',')
        this.overtime = false
        // this.NPER = x.issue + ''
        this.lucknumbers = x.lucknumbers
        parseInt(window.localStorage.getItem('volume')) && this.__setCall({fn: '__music', callId: undefined})
        // this.allLuckyNumbers.splice(0, 0, x)
        let the = this.allLuckyNumbers.find(y => String(x.issue) === String(y.issue))
        if (the) {
          the = Object.assign(the, x)
          this.NPER = x.issue + ''
        } else {
          this.allLuckyNumbers.splice(0, 0, x)
          this.NPER = x.issue + ''
        }
        this.__setCall({fn: '__orderlist'})
        this.updateFromSocket = true
        this.codeMissColdHeat()
      }
    }
  },
  components: {
    GameRecent,
    GameLuckyNumber,
    GameLuckyNumberWithHistory,
    GameSideButtons,
    GameInfo,
    NewGameInfo,
    GameMenu,
    GameSelection,
    GameOrderBar,
    GameOrderList,
    GameAmountBar,
    GameFollowbar,
    GameFollowList,
    GameLuckyNumberHistory,
    GameRecentOrder,
    GameRecentChaseOrder,
    GameKQOrderBar,
    Ludan
    // GameOrderHistory,
    // GameFollowHistory
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import '../../var.stylus'
  .game-page
    user-select none
    
  .game-info.show + .game-content
    top TH + GH
  .game-content
    top TH
    bottom GAH * 2
    // padding-bottom GAH * 2
    max-width 9.3rem
    // max-height "calc(100% - %s)" % (TH + GAH)
    margin 0 auto
    overflow-x hidden
    overflow-y auto
  
  .inner-bar
    padding 0 PWX
    line-height .5rem
    bg-gradient(180deg, #fff, #efefef)
    box-shadow 0 0 .05rem rgba(0,0,0,.1)

</style>



