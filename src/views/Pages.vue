<template lang="jade">

  transition-group.dialog-container(adjusting="adjusting" appear=true v-bind:name="transition ? transition : 'zoom' " tag="section")
    component.dialog-page(v-for="(page, index) in pages" v-on:close="close" v-bind:key="page.href" v-bind:is="page.url" v-bind:page="page"  v-bind:class="[{active: page.active}, page.size, 'page-' + page.id ]" v-bind:style="[ Object.assign({ 'z-index': page.prev },  pageSizes.default,  (page.position = Object.assign(PPP[index < maxPages ? index : maxPages - 1], page.position)), page.position, pageSizes[page.size] || {})]"  @click.native="openAPage(page.id)" v-bind:money="money" v-bind:free="free" v-bind:menus="menus" v-on:tab-idx-change="tabIdxChange")

        // .cover(slot="cover" v-bind:class="{show: !page.active}" )
        //- .move-bar(slot="movebar")
        //- .resize-x(slot="resize-x")
        //- .resize-y(slot="resize-y")
        ToolBar(slot="toolbar" v-bind:volume= "page.volume" v-bind:title="page.title" v-bind:tabs="page.tabs" v-bind:tabfn="page.tabfn" v-bind:star="page.star" v-on:full="full(page, this)" v-on:minus="minus(page)" v-on:close="close(page.id)" v-on:star="star(page)" v-bind:menuid = "page.menuid" v-on:volume="volume(page)" v-bind:tabIndex="tabIndex" v-on:tab-idx-change="tabIdxChange")

</template>

<script>
import api from '../http/api'
import base from 'components/base'
import ToolBar from 'components/ToolBar'
// import util from '../util'
// game
import SSC from './game/SSC'
import SSL from './game/SSL'
import SSL3D from './game/SSL3D'
import G115 from './game/G115'
import PK10 from './game/PK10'
import KL8 from './game/KL8'
import K3 from './game/K3'
import LHG from './game/LHG'
import HC6 from './game/HC6'
import PCDD from './game/PCDD'
import IFRAME from './game/IFRAME'

// me
// import Me from './me/Me'
import SafeCenter from './me/SafeCenter'
import Bonus from './me/Bonus'
// import TopUp from './me/TopUp'
// import WithDraw from './me/WithDraw'
import Bank from './me/Bank'
import BGTransaction from './me/BGTransaction'

// group
import UserList from './group/UserList'
import SetDaySalary from './group/SetDaySalary'
import AddUser from './group/AddUser'
import Ad from './group/Ad'
import Contract from './group/Contract'
import OtherContract from './group/OtherContract'
import ContractDetail from './group/ContractDetail'
import Stock from './group/Stock'
// import StockDetail from './group/StockDetail'
import DataAnalysis from './group/DataAnalysis'
import ChartAnalysis from './group/ChartAnalysis'

// Form
import Account from './form/Account'
import Follow from './form/Follow'
import VRFollow from './form/VRFollow'
import FollowDetail from './form/FollowDetail'
import FollowOrder from './form/FollowOrder'
import Order from './form/Order'
import VROrder from './form/VROrder'
import VRTip from './form/VRTip'
import LuckyPool from './form/LuckyPool'
import ProfitLoss from './form/ProfitLoss'
import OutProfitLoss from './form/OutProfitLoss'
import OtherProfit from './form/OtherProfit'
import MyProfitLoss from './form/MyProfitLoss'
import ProfitLossDetail from './form/ProfitLossDetail'
// import Today from './form/Today'
// import TotalReport from './form/TotalReport'
// import DaySalary from './form/DaySalary'
import BGFishRecord from './form/BGFishRecord'
import BGGameRecord from './form/BGGameRecord'
import BGVedioRecord from './form/BGVedioRecord'
import Sports from './form/Sports'
// import LUL from './form/LUL'
// import ActivityReport from './form/ActivityReport'
import TotalAccount from './form/TotalAccount'
// 趋势图
// import TrendChart from './form/TrendChart'

// 帮助中心
import PlayHelp from './help/PlayHelp'
import FunctionHelp from './help/FunctionHelp'
import QuestionHelp from './help/QuestionHelp'
import System from './help/System'
import Feedback from './help/Feedback'
import VIP from './help/VIP'

// 活动中心
import Activity from './activity/Activity.new'
import Gift from './activity/Gift'
import MyCoupon from './activity/MyCoupon'

// 活动详情
import ForRegister from './activity/ForRegister'
import ForNewUser from './activity/ForNewUser'
import ForAll from './activity/ForAll'
import ForTopup from './activity/ForTopup'
import ForTopupA from './activity/ForTopupA'
import ForWithdraw from './activity/ForWithdraw'
import ForOther from './activity/ForOther'
import FindMe from './activity/FindMe'
import Fight from './activity/Fight'
import Salary from './activity/Salary'
import HC6E from './activity/HC6E'
import NewYear from './activity/NewYear'
import NewSalary from './activity/NewSalary'
import WorldCup from './activity/WorldCup'
import ReturnPoint from './activity/ReturnPoint'
// 下载
import Download from './download/Download'

// new============================================================
// 资金中心
import Load from './cashcenter/Load'
import Withdraw from './cashcenter/Withdraw'
import Transfer from './cashcenter/Transfer'
import XYB from './cashcenter/XYB'
// 个人中心
import myCashRecord from './myCashRecord'
import personalReport from './myGameRecord/report'
// 代理中心
import subGameRecord from './subGameRecord'
import myGameRecord from './myGameRecord'
import openAccount from './openAccount'
import salary from './salary'
import lotteryStock from './lotteryStock'
import otherStock from './otherStock'
import subCashRecord from './subCashRecord'
import subProfitLoss from './agent/SubProfitLoss'

export default {
  components: {
    // new======================================
    // 资金中心
    Load,
    Withdraw,
    Transfer,
    XYB,
    // 个人中心
    myCashRecord,
    personalReport,
    // 代理中心
    myGameRecord,
    subGameRecord,
    openAccount,
    salary,
    lotteryStock,
    otherStock,
    subCashRecord,
    subProfitLoss,

    // new
    ToolBar,
    // game
    SSC,
    SSL,
    SSL3D,
    G115,
    PK10,
    KL8,
    K3,
    LHG,
    HC6,
    PCDD,
    IFRAME,
    // me
    // Me,
    SafeCenter,
    Bonus,
    // WithDraw,
    // TopUp,
    Bank,
    BGTransaction,
    // group
    UserList,
    SetDaySalary,
    AddUser,
    Ad,
    Contract,
    OtherContract,
    ContractDetail,
    Stock,
    // StockDetail,
    DataAnalysis,
    ChartAnalysis,
    // form
    Account,
    Follow,
    VRFollow,
    FollowDetail,
    FollowOrder,
    Order,
    VROrder,
    VRTip,
    LuckyPool,
    ProfitLoss,
    OutProfitLoss,
    OtherProfit,
    MyProfitLoss,
    ProfitLossDetail,
    // Today,
    // TotalReport,
    // DaySalary,
    BGFishRecord,
    BGGameRecord,
    BGVedioRecord,
    Sports,
    // LUL,
    // ActivityReport,
    TotalAccount,
    // 走势图
    // TrendChart,
    // Help
    PlayHelp,
    FunctionHelp,
    QuestionHelp,
    System,
    Feedback,
    VIP,
    // 活动
    Activity,
    Gift,
    MyCoupon,
    // 活动详情
    ForRegister,
    ForNewUser,
    ForAll,
    ForTopup,
    ForTopupA,
    ForWithdraw,
    ForOther,
    FindMe,
    Fight,
    Salary,
    HC6E,
    NewYear,
    NewSalary,
    WorldCup,
    ReturnPoint,
    // 下载
    Download
  },
  name: 'Pages',
  mixins: [base],
  props: ['pages', 'prehref', 'loop', 'maxPages', 'transition', 'free', 'money', 'menus'],
  data () {
    return {
      tabIndex: 0,
      hasHeader: true,
      hasFooter: true,
      // 可打开的最大的页数
      // H: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem',
      pageSizes: {
        full: {
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        },
        minus: {
          top: '80%',
          left: '50%',
          transform: 'perspective(100px) translateZ(-100px) translateX(-100%)',
          'transition-duration': '0.3s',
          opacity: 0
        },
        default: {
          top: '15%',
          left: '25%',
          width: '9.3rem',
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        static: {
          top: 0,
          left: 0,
          minWidth: '70%',
          maxWidth: '100%',
          height: '100%'
        }
      },
      // 提供随机的位置
      // 没有记录过位置的窗口将自动分配位置
      PPP: [
        {
          top: document.body.clientHeight < 900 ? '0.36rem' : 'calc(10% + 0.15rem)',
          left: 'calc(20% + 0.15rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '0.5rem' : 'calc(10% + 0.5rem)',
          left: 'calc(20% + 0.5rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '0.85rem' : 'calc(10% + 0.85rem)',
          left: 'calc(20% + 0.85rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '1.2rem' : 'calc(10% + 1.2rem)',
          left: 'calc(20% + 1.2rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '1.55rem' : 'calc(10% + 1.55rem)',
          left: 'calc(20% + 1.55rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '1.9rem' : 'calc(10% + 1.9rem)',
          left: 'calc(20% + 1.9rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '2.25rem' : 'calc(10% + 2.25rem)',
          left: 'calc(20% + 2.25rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '2.6rem' : 'calc(10% + 2.6rem)',
          left: 'calc(20% + 2.6rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '2.95rem' : 'calc(10% + 2.95rem)',
          left: 'calc(20% + 2.95rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        },
        {
          top: document.body.clientHeight < 900 ? '3.3rem' : 'calc(10% + 3.3rem)',
          left: 'calc(20% + 3.3rem)',
          width: '9.3rem',
          // width: '50%',
          // height: '50%'
          height: (window.document.body.clientHeight || 800) >= 720 ? '6.4rem' : '5.8rem'
        }
      ]
      // PPP: [
      //   // center
      //   {
      //     top: '15%',
      //     left: '25%',
      //     width: '9.3rem',
      //     height: '6.4rem'
      //   },
      //   // left top
      //   {
      //     left: '.15rem',
      //     top: '.15rem',
      //     right: 'auto',
      //     bottom: 'auto'
      //   },
      //   // right top
      //   {
      //     right: '.15rem',
      //     top: '.15rem',
      //     left: 'auto',
      //     bottom: 'auto'
      //   },
      //   // left bottom
      //   {
      //     left: '.15rem',
      //     bottom: 'auto',
      //     top: '50%',
      //     right: 'auto'
      //   },
      //   // right bottom
      //   {
      //     right: '.15rem',
      //     bottom: 'auto',
      //     top: '50%',
      //     left: 'auto'
      //   },
      //   // center left top
      //   {
      //     top: '5%',
      //     left: '10%',
      //     right: 'auto',
      //     bottom: 'auto'
      //   },
      //   // center right top
      //   {
      //     top: '5%',
      //     right: '10%',
      //     left: 'auto',
      //     bottom: 'auto'
      //   },
      //   // center left bottom
      //   {
      //     bottom: 'auto',
      //     left: '10%',
      //     right: 'auto',
      //     top: '30%'
      //   },
      //   // center right bottom
      //   {
      //     bottom: 'auto%',
      //     right: '10%',
      //     left: 'auto',
      //     top: '30%'
      //   }
      // ]
    }
  },
  computed: {
    furl () {
      return (this.pages[0] || {}).id
    },
    curl () {
      return (this.pages.find(p => p.active) || {}).id
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'openRoute'
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      return vm.openAPage(to.params.url)
    })
  },
  mounted () {
  },
  beforeDestroy () {
    // this.pages.forEach(t => console.log(t.title, 'minus', '????') && this.updatePage('', {size: 'minus'}, t))
  },
  methods: {
    tabIdxChange (index) {
      this.tabIndex = index
    },
    openRoute ({path, params: {url}}) {
      if (url) this.openAPage(url)
    },
    openAPage (url) {
      if (this.pages.length >= this.maxPages && !(this.pages.find(p => p.id === url))) {
        if (!this.loop) return false
        else if (this.curl !== url) {
          this.$emit('close-tab', this.furl, url)
        }
      } else {
        this.$emit('open-tab', url)
      }
    },
    full (page) {
      if (page.size !== 'full') this.setDefaultPosition(page)
      // console.log('fullnow', page.size, page.url, page.id)
      this.updatePage(page.id, {size: page.size === 'full' ? '' : 'full'}, page)
    },
    minus (page) {
      if (page.size !== 'full') this.setDefaultPosition(page)
      // console.log('minusnow', page.size, page.url, page.id)
      this.updatePage(page.id, {size: 'minus'}, page)
      if (page.opened && page.active) this.prehref && this.$router.push(this.prehref)
    },
    close (url, nurl) {
      this.$router.push('/')
      // this.$emit('close-tab', url, nurl)
    },
    star (page) {
      if (!page.star) this.addPrefence(page)
      else this.delPrefence(page)
    },
    volume (page) {
      page.volume = !page.volume
    },
    __volume () {
      if (this.pages[0]) {
        this.pages[0].volume = !this.pages[0].volume
      }
    },
    addPrefence (page) {
      this.$http.get(api.addPrefence, {
        menuId: page.menuid,
        isDesk: 0,
        sort: 1
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          this.updatePage(page.id, {star: !page.star}, page)
        } else this.$message.warning('收藏失败!')
      }, (rep) => {
        // error
        this.$message.warning('收藏失败!')
      })
    },
    delPrefence (page) {
      this.$http.get(api.delPrefence, {
        menuId: page.menuid,
        isDesk: 0,
        sort: 1
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          this.updatePage(page.id, {star: !page.star}, page)
        } else this.$message.warning(data.msg || '收藏删除失败!')
      }, (rep) => {
        // error
        this.$message.warning('收藏删除失败!')
      })
    },
    setDefaultPosition (page) {
      let el = this.$el.querySelector('.page-' + page.id)
      // block8/3 console.log(el.style.top, el.style.left, el.style.width, el.style.height)
      let position = {
        top: el.style.top,
        left: el.style.left,
        right: el.style.right,
        bottom: el.style.bottom,
        width: el.style.width,
        height: el.style.height
      }
      this.updatePage(page.id, {position: position}, page)
    }
  }
  // directives: {
  //   moveable: {
  //     // inserted () {
  //     // },
  //     inserted (el, binding, vnode) {
  //       let canMove = false
  //       let wantMove = false
  //       let {top, left, width, height} = util.getOffset(el, 0)
  //       let boxOffset = util.getOffset(el.parentNode)
  //       let target = el.querySelector('.move-bar')
  //       let sx = 0
  //       let sy = 0
  //       let dx = 0
  //       let dy = 0
  //       util.addEvent('click', target, (evt) => {
  //         if (wantMove) {
  //           // 移动时， 窗口不上浮为当前活动窗口
  //           // evt.preventDefault()
  //           // evt.stopPropagation()
  //           wantMove = false
  //         }
  //       })
  //       util.addEvent('mousedown', target, (evt) => {
  //         target.setAttribute('expand', 'expand')
  //         el.setAttribute('adjusting', 'adjusting')
  //         el.parentNode.setAttribute('adjusting', 'adjusting')
  //         // el.parentNode.parentNode.setAttribute('adjusting', 'adjusting')
  //         let offset = util.getOffset(el, 0)
  //         top = offset.top
  //         left = offset.left
  //         width = offset.width
  //         height = offset.height
  //         boxOffset = util.getOffset(el.parentNode)
  //         canMove = true
  //         sx = evt.clientX
  //         sy = evt.clientY
  //       })
  //       util.addEvent('mousemove', target, (evt) => {
  //         if (!canMove) return
  //         wantMove = true
  //         el.style.transition = 'none'
  //         dx = evt.movementX || (evt.clientX - sx)
  //         dy = evt.movementY || (evt.clientY - sy)
  //         if (left > (boxOffset.width - width - left)) el.setAttribute('h-align', 'right')
  //         else el.setAttribute('h-align', 'left')
  //         if (top > (boxOffset.height - height - top)) el.setAttribute('v-align', 'bottom')
  //         else el.setAttribute('v-align', 'top')
  //         if (dx > 0 && (boxOffset.width - 15 <= left + width)) (dx = 0)
  //         if (dx < 0 && left <= 15) dx = 0
  //         if (dy > 0 && (boxOffset.height - 15 <= top + height)) dy = 0
  //         if (dy < 0 && top <= (15 + 36)) dy = 0
  //         if (dx === 0 && dy === 0) return
  //         left += dx
  //         el.style.left = left + 'px'
  //         sx = evt.clientX
  //         top += dy
  //         el.style.top = top + 'px'
  //         sy = evt.clientY
  //       })
  //       util.addEvent('mouseup', target, (evt) => {
  //         target.removeAttribute('expand')
  //         el.removeAttribute('adjusting')
  //         el.parentNode.removeAttribute('adjusting')
  //         // el.parentNode.parentNode.removeAttribute('adjusting', 'adjusting')
  //         canMove = false
  //         el.style.transition = ''
  //       })
  //       util.addEvent('mouseleave', target, (evt) => {
  //         target.removeAttribute('expand')
  //         el.removeAttribute('adjusting')
  //         el.parentNode.removeAttribute('adjusting')
  //         // el.parentNode.parentNode.removeAttribute('adjusting', 'adjusting')
  //         canMove = false
  //         el.style.transition = ''
  //       })
  //     },
  //     unbind (el) {
  //     }
  //   },
  //   resizeable: {
  //     inserted (el, binding) {
  //       let canResizeX = false
  //       let canResizeY = false
  //       let {top, left, width, height} = util.getOffset(el, 0)
  //       let boxOffset = util.getOffset(el.parentNode)
  //       let targetX = el.querySelector('.resize-x')
  //       let targetY = el.querySelector('.resize-y')
  //       let sx = 0
  //       let sy = 0
  //       let dx = 0
  //       let dy = 0
  //       util.addEvent('click', targetX, (evt) => {
  //         // 窗口不上浮为当前活动窗口
  //         // evt.preventDefault()
  //         // evt.stopPropagation()
  //       })
  //       util.addEvent('click', targetY, (evt) => {
  //         // 窗口不上浮为当前活动窗口
  //         // evt.preventDefault()
  //         // evt.stopPropagation()
  //       })
  //       // X
  //       util.addEvent('mousedown', targetX, (evt) => {
  //         targetX.setAttribute('expand', 'expand')
  //         el.setAttribute('adjusting', 'adjusting')
  //         el.parentNode.setAttribute('adjusting', 'adjusting')

  //         evt.preventDefault()
  //         evt.stopPropagation()
  //         let offset = util.getOffset(el, 0)
  //         top = offset.top
  //         left = offset.left
  //         width = offset.width
  //         height = offset.height
  //         boxOffset = util.getOffset(el.parentNode)
  //         canResizeX = true
  //         el.style.transition = 'none'
  //         sx = evt.clientX
  //       })
  //       util.addEvent('mousemove', targetX, (evt) => {
  //         evt.preventDefault()
  //         evt.stopPropagation()
  //         if (!canResizeX) return
  //         // if (left > (boxOffset.width - width - left)) el.setAttribute('h-align', 'right')
  //         // else el.setAttribute('h-align', 'left')
  //         // if (top > (boxOffset.height - height - top)) el.setAttribute('v-align', 'bottom')
  //         // else el.setAttribute('v-align', 'top')
  //         dx = evt.movementX || (evt.clientX - sx)
  //         if (dx > 0 && (boxOffset.width - 15 <= left + width)) return
  //         width += dx
  //         el.style.width = width + 'px'
  //         if (width > 800) el.removeAttribute('w')
  //         if (width < 800) el.setAttribute('w', '800')
  //         if (width < 700) el.setAttribute('w', '700')
  //         sx = evt.clientX
  //       })
  //       util.addEvent('mouseup', targetX, (evt) => {
  //         targetX.removeAttribute('expand')
  //         el.removeAttribute('adjusting')
  //         el.parentNode.removeAttribute('adjusting')
  //         evt.preventDefault()
  //         evt.stopPropagation()
  //         canResizeX = false
  //         el.style.transition = ''
  //       })
  //       util.addEvent('mouseleave', targetX, (evt) => {
  //         targetX.removeAttribute('expand')
  //         el.removeAttribute('adjusting')
  //         el.parentNode.removeAttribute('adjusting')
  //         canResizeX = false
  //         el.style.transition = ''
  //       })
  //       // Y
  //       util.addEvent('mousedown', targetY, (evt) => {
  //         targetY.setAttribute('expand', 'expand')
  //         el.setAttribute('adjusting', 'adjusting')
  //         el.parentNode.setAttribute('adjusting', 'adjusting')
  //         evt.preventDefault()
  //         evt.stopPropagation()
  //         let offset = util.getOffset(el)
  //         top = offset.top
  //         left = offset.left
  //         width = offset.width
  //         height = offset.height
  //         boxOffset = util.getOffset(el.parentNode)
  //         canResizeY = true
  //         el.style.transition = 'none'
  //         sy = evt.clientY
  //       })
  //       util.addEvent('mousemove', targetY, (evt) => {
  //         evt.preventDefault()
  //         evt.stopPropagation()
  //         if (!canResizeY) return
  //         // if (left > boxOffset.width / 2) el.setAttribute('h-align', 'right')
  //         // else el.setAttribute('h-align', 'left')
  //         // if (top > boxOffset.height / 2) el.setAttribute('v-align', 'bottom')
  //         // else el.setAttribute('v-align', 'top')
  //         dy = evt.movementY || (evt.clientY - sy)
  //         if (dy > 0 && (boxOffset.height - 15 <= top + height)) return
  //         height += dy
  //         el.style.height = height + 'px'
  //         sy = evt.clientY
  //       })
  //       util.addEvent('mouseup', targetY, (evt) => {
  //         targetY.removeAttribute('expand')
  //         el.removeAttribute('adjusting')
  //         el.parentNode.removeAttribute('adjusting')
  //         evt.preventDefault()
  //         evt.stopPropagation()
  //         canResizeY = false
  //         el.style.transition = ''
  //       })
  //       util.addEvent('mouseleave', targetY, (evt) => {
  //         targetY.removeAttribute('expand')
  //         el.removeAttribute('adjusting')
  //         el.parentNode.removeAttribute('adjusting')
  //         canResizeY = false
  //         el.style.transition = ''
  //       })
  //     },
  //     unbind (el) {
  //     }
  //   }
  // }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  .dialog-page.active .tool-bar
    // background-color WHITE
  .page .dialog-page.full
    background rgba(0,0,0,0)
    &:after
      content ''
      position absolute
      top .36rem
      left 0
      right 0
      bottom 0
      background-color #ededed
      z-index -1
    // & > div:not(.tool-bar):not(.move-bar):not(.resize-x):not(.resize-y):not(.modal):not([class*='el-'])
    //   background-color #ededed
    & > .tool-bar
      background rgba(0,0,0,0)
      .title
        display none
      .el-button-group
        background-color #668ccb
        .el-button
          color WHITE
          .full
            border-color WHITE

          &:hover
            background-color rgba(255, 255, 255, .2)
            color WHITE
            .full
              border-color WHITE
            &.close
              background-color DANGER


  @media(max-width: 1024px)
    .page .dialog-page
      top 0 !important
      left 0 !important
      width 100% !important
      height 100% !important
      border-radius 0 !important
      .tool-bar
        background none
        .title
          display none
  //   html
  //     overflow auto
  //     font-size 80px
  //   header
  //     display none
  //   footer
  //     z-index 1
  //     background none
  //     background-color GREY !important
  //   .page
  //   .game-content
  //   .dialog-page
  //     position relative !important
  //     left 0 !important
  //     top 0 !important
  //   .dialog-page
  //     width 100% !important
  //     height 80% !important
  //     .cover
  //     .move-bar
  //     .resize-x
  //     .resize-y
  //     .tool-bar
  //       display none !important
  //     .amout-bar
  //       position relative !important

  //     // max-width 1024px !important
  //   .dialog-page ~ .dialog-page
  //     display none
  // @media(max-width: 600px)
  //   footer
  //     position relative !important
  //     top 0 !important
</style>

<style lang="stylus">
  // .dialog-page.game-page.page-1-5-1.full
  .dialog-page.game-page.page-1-1-6.full
      .game-content
      .inner-bar
        max-width 100%
        // color red
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import '../var.stylus'
  .cover
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    z-index 1
    display none
    background-color rgba(0,0,0,.2)
    opacity 0
    &.show
      display: block
    // &.show ~ .move-bar
    // &.show ~ .resize-x
    // &.show ~ .resize-y
    //   display none
  .move-bar
    user-select none
    position absolute
    top 0
    left 4 * TH
    right 4 * TH
    height TH
    cursor move
    z-index 10000
    // background-color red
    &:hover
      height 2 * TH
      top -1 * TH
    &[expand]
      width 200rem
      height 200rem
      top -100rem
      left -100rem


  .resize-x
    user-select none
    position absolute
    right - TH
    top TH
    bottom TH
    width TH
    z-index 10000
    cursor e-resize
    &:hover
      width 2 * TH
      right -1 * TH
    &[expand]
      width 200rem
      height 200rem
      left -100rem
      top -100rem


  .resize-y
    user-select none
    position absolute
    right .5rem
    bottom - TH
    left .5rem
    height TH
    z-index 10000
    cursor n-resize
    &:hover
      height 2 * TH
      bottom -1.5 * TH
    &[expand]
      width 200rem
      height 200rem
      top -100rem
      left -100rem

  .page
    overflow hidden
    perspective 100px
    top 0
  .dialog-page
    // &>.scroll-content
    //   left 50%
    //   transform translateX(-50%)
    position absolute !important
    min-width 5.8rem
    min-height 4rem
    overflow visible
    z-index 0
    radius()
    // background-color #fff
    // background-color #ededed
    background-color #e9e9e9
    box-shadow 0 0 .1rem rgba(0,0,0,.5)
    transition transform linear 0.2s, width linear 0.2s, height linear 0.2s, left linear 0.2s, top linear 0.2s, opacity linear 0.2s
    // transform perspective(1rem) translate3D(-4rem, -4rem, -.8rem)
    // &[h-align=left]
    //   // &[v-align=bottom]
    //   transform perspective(1rem) rotateY(-1deg) translate3D(-3rem, 0rem, -.8rem)
    // &[h-align=right]
    //   transform perspective(1rem) rotateY(1deg) translate3D(3rem, 0, -.8rem)
    &[h-align=left]
      // &[v-align=bottom]
      // transform perspective(1rem) translate3D(0, 0, -.8rem)
    &[h-align=right]
      // transform perspective(1rem) translate3D(0, 0, -.8rem)
      // &[v-align=bottom]
      //   transform perspective(1rem) rotateY(1deg) translate3D(3rem, 2rem, -.8rem)
    &.active
      transform none
      // shadow(0 0 .1rem .1rem #fff)

      // transition-duration .5s
      z-index 9999 !important

    &[class*=-enter]
    &[class*=-leave]
    // [class*=-move]
      transition all linear .2s // @static 2

    &.zoom-enter-active
    &.zoom-leave-active
      // opacity 0
      // transform perspective(500px) translateZ(-5000px)
      opacity .2
      transform perspective(100px) translateZ(-1000px)
      // shadow(0 0 5rem 5rem #333)


    &[adjusting]
      z-index 2
      // shadow(0 0 5rem 2rem #333)

    &.minus
      // shadow(0 0 5rem 2rem #333)

    &.full
      // shadow(0 0 5rem 2rem #333)
      radius(0)
      .move-bar
        cursor default
        &:hover
          height TH
          top 0
          z-index 0


</style>


