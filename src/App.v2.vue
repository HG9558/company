 <template lang="jade">

  #app(:class=" [state.user.css, 'app', appcls, state.user.login ? 'applogin' : 'appunlogin'] ")


    // pages
    // keep-alive
    transition(name="fade" appear=true)
      router-view.scroll-content.page.collapse-footer(:pages="tabs" v-bind:prehref="prev.href" v-bind:menus="menus" v-on:close-tab="closeTab" v-on:open-tab="openTab" v-on:get-menus="getUserPrefence" v-on:get-userfund="__getUserFund"  v-bind:class="{ 'has-header': state.hasHeader, 'has-footer has-righter': state.hasFooter}" v-bind:loop="loop" v-bind:max-pages="maxPages" v-bind:money="state.user.amoney" v-bind:free="state.user.free")


    // Print
    Print(:data="printData" v-if="showPrint")

    // lefter

    dsLefter.scroll-content.in-classic(:menus="activeMenu" v-bind:name="state.user.name" v-bind:money="state.user.amoney" v-bind:smoney="state.user.smoney" v-bind:free="state.user.free" v-on:open-page="openTab" v-show="state.user.mode.indexOf('classic') !== -1 && activeMenu[0] " v-on:logout="logout" v-bind:hideme="true")

    // righter
    //- transition(name="slide-right" appear=true)
    dsRighter(v-on:click="righterHandler")

    // ggl
    GGL(v-if="ggl")

    // Login
    Modal.common-login(v-bind:Ptitle=" Ptitle " v-bind:Ptype="Ptype" v-if="popuLogin" v-bind:Pbtn="Pbtn " v-bind:Phref="Phref" v-bind:Pclose = "Pclose" v-bind:Pok = "Pok" v-bind:PboxStyle="PboxStyle")
      .my-content.text-666(slot="my-content" style="text-align: left; font-size: .16rem; line-height: .3rem; user-select: text;")
        L

    // Guide
    .modal.menu-guide-modal(v-if=" showMenuGuide " )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 12.8rem")
          MenuGuide(v-bind:showMenuGuide.sync="showMenuGuide" v-on:hideMenuGuide="hideMenuGuide")

    // Task
    .modal.task-modal(v-if=" showTask " )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 7.5rem; border-radius: 10px; max-height: none")

          Task(v-bind:showTask.sync="showTask" v-on:hideTask="__hideTask")

    // Task
    .modal.annual-ceremony-modal(v-if=" showAnnual " )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 7rem; border-radius: 10px; height: 6.45rem; max-height: none; background: none")

          AnnualCeremoney(v-bind:showAnnual.sync="showAnnual" v-on:hideAnnual="__hideAnnual" v-bind:data=" oldUserInfo ")



</template>

<script>
import Modal from './components/Modal'
import MenuGuide from './components/MenuGuide'
import Task from './components/Task'
import AnnualCeremoney from './components/AnnualCeremoney'
import L from './components/L'
import dsLefter from 'mycomponents/Lefter'
import dsRighter from './components/Righter'
import dsHeader from './components/Header'
import GGL from './components/GGL'
import RightQuickThirdGame from './components/RightQuickThirdGame'
// import dsFooter from './components/Footer'
import Print from './components/Print'
// import Chat from './components/Chat'
import base from './components/base'
import store from './store'
// import cookie from 'js-cookie'
import api from './http/api'
import Socket from './socket'
export default {
  name: 'App',
  mixins: [base],
  data () {
    return {
      oldUserInfo: {},
      showAnnual: false,
      showTask: false,
      // 开奖通知只存在一个Modal
      NotifyModal: null,
      showMenuGuide: false,
      showPrint: false,
      printData: {},
      collapseFooter: false,
      // skin: 'day',
      loop: true,
      maxPages: 1,
      state: store.state,
      Me: store.state.user,
      tabs: [],
      menus: [
        {
          class: 'ds-icon-record',
          hide: true,
          url: 'form',
          // size: 'full',
          groups: [
            {
              items: [
                {
                  id: '4-2-2',
                  menuid: '54',
                  title: '追号记录详情',
                  url: 'FollowDetail',
                  position: {
                    width: '10rem'
                  }
                }
              ]
            }
          ]
        },
        {
          class: 'ds-icon-group',
          hide: true,
          url: 'group',
          removed: true,
          groups: [
            {
              items: [
                {
                  id: '3-3-2',
                  menuid: '45',
                  title: '分红详情',
                  url: 'StockDetail',
                  position: {
                    width: '5.4rem',
                    height: '6.8rem'
                  }
                }
              ]
            }
          ]
        },
        {
          class: 'ds-icon-record',
          hide: true,
          url: 'form',
          // size: 'full',
          groups: [
            {
              items: [
                {
                  id: '4-5-4',
                  menuid: '59',
                  title: '个人盈亏明细',
                  url: 'ProfitLossDetail'
                }
              ]
            }
          ]
        },
        {
          class: 'ds-icon-download',
          hide: true,
          url: 'download',
          groups: [
            {
              items: [
                {
                  id: '7-1-1',
                  title: '下载中心',
                  url: 'Download'
                }
              ]
            }
          ]
        },
        {
          class: 'ds-icon-gift',
          hide: true,
          url: 'activity',
          mi: 10,
          groups: [
            {
              title: '活动中心',
              items: [
                {id: '5-1-1', menuid: '71', title: '活动中心', url: 'Activity'},
                {id: '5-2-1', position: {width: '7.6rem'}, title: '亿元豪送', url: 'ForRegister'},
                {id: '5-2-2', position: {width: '7.6rem'}, title: '新用户有礼', url: 'ForNewUser'},
                {id: '5-2-3', position: {width: '7.6rem'}, title: '全民签到', url: 'ForAll'},
                {id: '5-2-4', position: {width: '7.6rem'}, title: '充值送', url: 'ForTopup'},
                {id: '5-2-5', position: {width: '7.6rem'}, title: '首提大返利', url: 'ForWithdraw'},
                {id: '5-2-6', position: {width: '7.6rem'}, title: '充值送', url: 'ForTopupA'},
                {id: '5-2-7', position: {width: '7.6rem'}, title: '最新活动', url: 'ForOther'},
                {id: '5-2-8', position: {width: '7.6rem'}, title: '大家来找茬', url: 'FindMe'},
                {id: '5-2-9', position: {width: '7.6rem'}, title: '王者争霸赛', url: 'Fight'},
                {id: '5-2-10', position: {width: '7.6rem'}, title: '日工资扶持', url: 'Salary'},
                {id: '5-2-11', position: {width: '7.6rem'}, title: '六合彩专属', url: 'HC6E'},
                {id: '5-2-12', position: {width: '7.6rem'}, title: '迎新春闯关', url: 'NewYear'},
                {id: '5-2-13', position: {width: '7.6rem'}, title: '全新日工资', url: 'NewSalary'},
                {id: '5-2-14', position: {width: '7.6rem'}, title: '助力世界杯', url: 'WorldCup'},
                {id: '5-2-15', position: {width: '7.6rem'}, title: '助力世界杯', url: 'ReturnPoint'}
              ]
            }
          ]
        },
        {
          id: 0,
          class: 'ds-icon-home',
          href: '/home',
          title: '首页',
          menuid: '1'
        },
        {
          id: 1,
          menuid: '2',
          class: 'ds-icon-game',
          title: '彩票',
          url: 'game',
          hideIcon: false,
          // size: 'full',
          groups: [
            {
              title: '时时彩',
              // withIcon: true,
              // class: 'ds-icon-item',
              class: 'icon-menu-ssc',
              url: 'SSC',
              // id: 2,
              // width: '8rem',
              items: [
                {class: 'ds-icon-game-hlsx_cq sign hot', id: '1-1-1', menuid: '11', title: '重庆欢乐生肖', volume: true, gameid: 1},
                {class: 'ds-icon-game-cqhjssc sign old new', id: '1-1-12', menuid: '116', title: '重庆怀旧时时彩', atitle: '重庆时时彩', subTitle: '怀旧', volume: true, gameid: 155},
                {class: 'ds-icon-game-cqhjffc sign old new', id: '1-1-14', menuid: '118', title: '重庆怀旧分分彩', atitle: '重庆分分彩', subTitle: '怀旧', volume: true, gameid: 157},
                {class: 'ds-icon-game-ffctx sign hot', id: '1-1-7', menuid: '96', title: '腾讯分分彩', volume: false, gameid: 29},
                {class: 'ds-icon-game-hlffc sign hot', id: '1-1-4', menuid: '79', title: '欢乐分分彩', volume: false, gameid: 17},
                {class: 'ds-icon-game-cb120 sign hot', id: '1-2-3', menuid: '80', title: '幸福三分彩', gameid: 21},
                {class: 'ds-icon-game-wbwfc sign new', id: '1-1-9', menuid: '75', title: '微博5分彩', volume: false, gameid: 150},
                {class: 'ds-icon-game-xj', id: '1-1-2', menuid: '12', title: '新疆时时彩', volume: true, gameid: 3},
                {class: 'ds-icon-game-xjhjssc sign old new', id: '1-1-13', menuid: '117', title: '新疆怀旧时时彩', atitle: '新疆时时彩', subTitle: '怀旧', volume: true, gameid: 156},
                {class: 'ds-icon-game-tj', id: '1-1-3', menuid: '9', title: '天津时时彩', volume: true, gameid: 4},
                {class: 'ds-icon-game-hlj', id: '1-1-5', menuid: '101', title: '黑龙江时时彩', volume: true, gameid: 35},
                {class: 'ds-icon-game-ffc_aly sign new', id: '1-1-122', menuid: '122', title: '阿里云分分彩', volume: false, gameid: 161},
                {class: 'ds-icon-game-hnwfc sign new', id: '1-1-119', menuid: '119', title: '河内5分彩', volume: true, gameid: 158},
                {class: 'ds-icon-game-hnyfc sign new', id: '1-1-126', menuid: '126', title: '河内1分彩', volume: true, gameid: 163},
                {class: 'ds-icon-game-qqtxffc sign hot', id: '1-1-127', menuid: '127', title: '奇趣腾讯分分彩', volume: false, gameid: 164},
                {class: 'ds-icon-game-tx2fcjs sign odd', id: '1-1-10', menuid: '113', title: '腾讯2分彩', subTitle: '奇数', volume: true, gameid: 152},
                {class: 'ds-icon-game-tx2fcos sign even', id: '1-1-11', menuid: '114', title: '腾讯2分彩', subTitle: '偶数', volume: true, gameid: 153},
                {class: 'ds-icon-game-qqtxwfc sign new', id: '1-1-16', menuid: '132', title: '奇趣腾讯5分彩', volume: true, gameid: 165},
                {class: 'ds-icon-game-qqtxsfc sign new', id: '1-1-15', menuid: '133', title: '奇趣腾讯10分彩', volume: true, gameid: 166}
              ]
            },
            {
              url: 'SSC',
              // id: 2,
              // width: '8rem',
              items: [
              ]
            },
            {
              title: '11选5',
              // withIcon: true,
              // class: 'ds-icon-item',
              class: 'icon-menu-g115',
              url: 'G115',
              // width: '1.8rem',
              items: [
                {url: 'G115', class: 'ds-icon-game-11ydj sign hot', id: '1-3-4', menuid: '16', title: '11运夺金', volume: true, gameid: 6},
                {url: 'G115', class: 'ds-icon-game-kt115 sign hot', id: '1-3-5', menuid: '14', title: '夺金120秒', gameid: 11},
                {class: 'ds-icon-game-jx115', id: '1-3-2', menuid: '62', title: '多乐彩', volume: true, gameid: 7},
                {class: 'ds-icon-game-gd', id: '1-3-1', menuid: '15', title: '广东11选5', volume: true, gameid: 8},
                {class: 'ds-icon-game-ln115 sign new', id: '1-3-131', menuid: '131', title: '辽宁11选5', volume: true, gameid: 40},
                {class: 'ds-icon-game-hb115', id: '1-3-3', menuid: '81', title: '湖北11选5', volume: true, gameid: 22},
                {class: 'ds-icon-game-js115', id: '1-3-8', menuid: '102', title: '江苏11选5', volume: true, gameid: 36},
                {class: 'ds-icon-game-sh115', id: '1-3-6', menuid: '103', title: '上海11选5', volume: true, gameid: 37},
                {class: 'ds-icon-game-ah115', id: '1-3-7', menuid: '104', title: '安徽11选5', volume: true, gameid: 38},
                {class: 'ds-icon-game-fj115 sign new', id: '1-3-9', menuid: '120', title: '福建11选5', volume: true, gameid: 159},
                {class: 'ds-icon-game-sx115 sign new', id: '1-3-124', menuid: '124', title: '山西11选5', volume: true, gameid: 46}
                // {url: 'G115', class: 'ds-icon-game-kt115', id: '1-3-5', menuid: '14', title: '快投11选5', volume: true, gameid: 11},
              ]
            },
            {
              title: '快三',
              class: 'icon-menu-k3',
              url: 'K3',
              // width: '1.8rem',
              items: [
                {class: 'ds-icon-game-ahK3  ', id: '1-4-1', menuid: '82', title: '安徽快三', volume: true, gameid: 23},
                {class: 'ds-icon-game-jsK3', id: '1-4-2', menuid: '83', title: '江苏快三', volume: true, gameid: 24},
                {class: 'ds-icon-game-jlK3 ', id: '1-4-3', menuid: '84', title: '吉林快三', volume: true, gameid: 25},
                {class: 'ds-icon-game-bjK3 ', id: '1-4-4', menuid: '85', title: '北京快三', volume: true, gameid: 26},
                {class: 'ds-icon-game-xfK3', id: '1-4-5', menuid: '19', title: '幸福快三', volume: true, gameid: 33},
                {class: 'ds-icon-game-fjK3 sign new', id: '1-4-6', menuid: '121', title: '福建快三', volume: true, gameid: 160}
              ]
            },
            {
              title: 'PK10',
              class: 'icon-menu-pk10',
              url: 'PK10',
              items: [
                {url: 'PK10', class: 'ds-icon-game-pk10ft sign hot', id: '1-5-7', menuid: '105', title: '幸运飞艇', volume: true, gameid: 39},
                {url: 'PK10', class: 'ds-icon-game-bjpk10 sign hot', id: '1-5-1', menuid: '18', title: '北京PK10', volume: true, gameid: 13},
                {url: 'PK10', class: 'ds-icon-game-pk10sc sign hot', id: '1-5-10', menuid: '109', title: '幸运赛车', volume: true, gameid: 43},
                {url: 'PK10', class: 'ds-icon-game-txsc sign new', id: '1-5-11', menuid: '74', title: '腾讯赛车', volume: true, gameid: 151},
                {url: 'PK10', class: 'ds-icon-game-alysc sign new', id: '1-5-123', menuid: '123', title: '阿里云赛车', volume: true, gameid: 162}
              ]
            },
            {
              title: '其它游戏',
              // withIcon: true,
              // class: 'ds-icon-item',
              class: 'icon-menu-other',
              url: 'OTHER',
              items: [
                // {url: 'KL8', class: 'ds-icon-game-kl8 sign', id: '1-5-8', menuid: '106', title: '澳洲快乐8', volume: true, gameid: 40},
                // {url: 'KL8', class: 'ds-icon-game-kl8 ', id: '1-5-6', menuid: '107', title: '加拿大卑斯快乐8', volume: true, gameid: 41},
                // {url: 'KL8', class: 'ds-icon-game-kl8 ', id: '1-5-5', menuid: '108', title: '加拿大西部快乐8', volume: true, gameid: 42},
                {url: 'SSL3D', class: 'ds-icon-game-fc', id: '1-5-2', menuid: '60', title: '福彩3D', volume: true, gameid: 9},
                {url: 'SSL3D', class: 'ds-icon-game-hl3d', id: '1-5-8', menuid: '17', title: '欢乐3D', volume: true, gameid: 32},
                {url: 'SSL3D', class: 'ds-icon-game-shssl', id: '1-5-4', menuid: '100', title: '上海时时乐', volume: true, gameid: 5},
                {url: 'SSL', class: 'ds-icon-game-pl35', id: '1-5-3', menuid: '61', title: '排列三、五', volume: true, gameid: 10},
                {url: 'HC6', class: 'ds-icon-game-lhc', id: '1-5-6', menuid: '95', title: '六合彩', volume: true, gameid: 28},
                // {menuid: '98', class: 'ds-icon-game-jn sign', id: '1-7-1', title: 'KG', fn: '18:203'},
                // {url: 'IFRAME', hide: true, class: 'ds-icon-game-lhc', id: '1-8-1', menuid: '98', title: '六合彩', volume: true, gameid: 28}
                {url: 'KL8', class: 'ds-icon-game-kl8 sign hot', id: '1-5-20', menuid: '92', title: '北京快乐8', volume: true, gameid: 27},
                {url: 'PCDD', class: 'ds-icon-game-pcdd', id: '1-5-21', menuid: '112', title: 'PC蛋蛋', volume: false, gameid: 45},
                {menuid: '98', class: 'ds-icon-game-jn sign hot', id: '1-5-22', title: '基诺彩', fn: '18:203'}
              ]
            }
            // {
            //   title: '基诺彩票',
            //   class: 'icon-menu-kl',
            //   url: 'KG',
            //   items: [
            //     {menuid: '98', class: 'ds-icon-game-jn sign hot', id: '1-7-1', title: '基诺彩', fn: '18:203'}
            //   ]
            // }
            // {
            //   title: 'VR游戏',
            //   url: 'VR',
            //   items: [
            //     {menuid: '98', class: 'ds-icon-game-vr', id: '1-7-1', title: 'VR1.5分彩', fn: '1'},
            //     {menuid: '98', class: 'ds-icon-game-vr3', id: '1-7-3', title: 'VR3分彩', fn: '11'},
            //     {menuid: '98', class: 'ds-icon-game-vr4', id: '1-7-4', title: 'VR赛车', fn: '2'},
            //     {menuid: '98', class: 'ds-icon-game-vr5', id: '1-7-5', title: 'VR快艇', fn: '13'},
            //     {menuid: '98', class: 'ds-icon-game-vr6', id: '1-7-6', title: 'VR百家乐', fn: '15'}
            //   ]
            // }
          ]
        },
        {
          menuid: '98',
          title: '棋牌',
          big: true,
          info: [
            {menuid: '98', class: 'ds-icon-game-bg4 ', title: '棋牌游戏', descrb: '多人对战，畅玩无限'},
            {menuid: '98', class: 'ds-icon-logo-ky ', id: '9-9-9', fn: '7:202'},
            {menuid: '98', class: 'ds-icon-logo-ly ', id: '9-9-9', fn: '15:202'},
            {menuid: '98', class: 'ds-icon-logo-xy ', id: '9-9-9', fn: '22:202'},
            // {menuid: '98', class: 'ds-icon-logo-vg ', id: '9-9-9', fn: '27:202'}, //27 平台ID  财神
            {menuid: '98', class: 'ds-icon-logo-ds ', id: '9-9-9', fn: '28:202'},
            {menuid: '98', class: 'ds-icon-logo-happygaming ', id: '9-9-9', fn: '44:69'}//欢乐棋牌  平台id：44,gameId:  69
          ]
        },
        {
          menuid: '98',
          title: '真人',
          big: true,
          info: [
            {class: 'ds-icon-game-bg1 ', title: '真人娱乐大厅', descrb: '真人娱乐场，美女如云'},
            {menuid: '98', class: 'ds-icon-logo-pt ', id: '9-9-9', ff: '/egame/2', fn: '5:203:iframe:/egame/2'},
            {menuid: '98', class: 'ds-icon-logo-ag ', id: '9-9-9', fn: '4:0'},
            {menuid: '98', class: 'ds-icon-logo-bg ', id: '9-9-9', fn: '2:201'},
            {menuid: '98', class: 'ds-icon-logo-gd ', id: '9-9-9', fn: '26:201'},
            {menuid: '98', class: 'ds-icon-logo-sa ', id: '9-9-9', fn: '31:35'},
            {menuid: '98', class: 'ds-icon-logo-og', id: '9-9-9', fn: '34:41'}
          ]
        },
        {
          menuid: '98',
          title: '老虎机',
          big: true,
          info: [
            {class: 'ds-icon-game-bg2 ', title: '老虎机', descrb: '趣味玩法 回味经典'},
            {menuid: '98', class: 'ds-icon-logo-pt ', id: '9-9-9', ff: '/egame/2', fn: '5:203:iframe:/egame/2'},
            {menuid: '98', class: 'ds-icon-logo-ag ', id: '9-9-9', fn: '4:500'},
            {menuid: '98', class: 'ds-icon-logo-bg ', id: '9-9-9', ff: '/egame/1', fn: '2:203:iframe:/egame/1'},
            {menuid: '98', class: 'ds-icon-logo-lg ', id: '9-9-9', ff: '/egame/3', fn: '21:203:iframe:/egame/3'},
            {menuid: '98', class: 'ds-icon-logo-sa ', id: '9-9-9', fn: '32:37'}
          ]
        },
        {
          menuid: '98',
          title: '体育',
          big: true,
          // hide: true,
          // info: {menuid: '98', class: 'ds-icon-game-sports ', id: '9-9-9', title: '体育赛事', descrb: '五大联赛，硝烟再起', fn: '3:301:iframe:/sports'},
          info: [
            {class: 'ds-icon-game-sports ', title: '体育赛事', descrb: '五大联赛，硝烟再起'},
            // {menuid: '98', class: 'ds-icon-logo-saba', id: '9-9-9', fn: '3:301:iframe:/sports'},
            {menuid: '98', class: 'ds-icon-logo-spb ', id: '9-9-9', fn: '9:203:iframe:/sports'},
            {menuid: '98', class: 'ds-icon-logo-pb ', id: '9-9-9', fn: '19:203:iframe:/sports'}
          ]
        },
        {
          menuid: '98',
          title: '电竞',
          // temp: true,
          big: true,
          // hide: true,
          // info: {menuid: '98', class: 'ds-icon-game-sports ', id: '9-9-9', title: '体育赛事', descrb: '五大联赛，硝烟再起', fn: '3:301:iframe:/sports'},
          info: [
            {class: 'ds-icon-game-egaming ', title: '电竞赛事', descrb: '众多盘口，超高赔率'},
            // {menuid: '98', class: 'ds-icon-logo-uwin ', id: '9-9-9', fn: '17:203:iframe:/egaming'}
            {menuid: '98', class: 'ds-icon-logo-uwin ', id: '9-9-9', fn: '17:203'},
            {menuid: '98', class: 'ds-icon-logo-xa ', id: '9-9-9', fn: '29:203'}
          ]
        },
        {
          menuid: '98',
          title: '捕鱼',
          big: true,
          info: [
            {class: 'ds-icon-game-bg3 ', title: '捕鱼达人', descrb: '一炮万金，畅快秒杀'},
            {menuid: '98', class: 'ds-icon-logo-pt ', id: '9-9-9', ff: '/egame/2', fn: '5:203:iframe:/egame/2'},
            {menuid: '98', class: 'ds-icon-logo-ag ', id: '9-9-9', fn: '4:6'},
            {menuid: '98', class: 'ds-icon-logo-bg ', id: '9-9-9', fn: '2:202'},
            {menuid: '98', class: 'ds-icon-logo-sa ', id: '9-9-9', fn: '32:EG-FISHING-001'}
          ]
        },
        {
          id: 2,
          menuid: '3',
          class: 'ds-icon-me',
          title: '管理中心',
          url: 'me',
          groups: [
            // {
            //   id: '2-1',
            //   title: '资金中心',
            //   innerurl: 'me',
            //   items: [
            //     {
            //       id: '2-1-1',
            //       menuid: '30',
            //       title: '充值',
            //       url: 'Load'
            //     },
            //     {
            //       id: '2-1-2',
            //       menuid: '32',
            //       title: '提现',
            //       url: 'Withdraw'
            //     },
            //     {
            //       id: '2-1-3',
            //       menuid: '20',
            //       title: '转账',
            //       url: 'Transfer'
            //     }
            //   ]
            // },
            {
              id: '2-2',
              title: '个人中心',
              innerurl: 'group',
              items: [
                {
                  id: '2-2-1',
                  menuid: '50',
                  title: '彩票记录',
                  // tabs: ['彩票', 'VR彩票:18718185', '体育:18718185', '真人:18718185', '电游:18718185', '捕鱼:18718185', '棋牌:18718185'],
                  // tabs: ['彩票', 'VR彩票', '体育', '真人', '电游', '捕鱼', '棋牌'],
                  tabs: ['投注记录', '追号记录'],
                  tabfn: '__setMyGameRecordI',
                  url: 'myGameRecord'
                },
                {
                  id: '2-2-6',
                  menuid: '99',
                  title: '盈亏报表',
                  // tabs: ['盈亏总表', '彩票', '体育:18718185', '真人:18718185', '老虎机:18718185', '电竟:18718185', '捕鱼:18718185', '棋牌:18718185', '基诺彩:18718185'],
                  tabs: ['盈亏总表', '彩票', '体育', '真人', '老虎机', '电竟', '捕鱼', '棋牌', '基诺彩'],
                  tabfn: '__setReportI',
                  url: 'personalReport'
                },
                {
                  id: '2-2-2',
                  menuid: '67',
                  title: '资金记录',
                  tabs: ['账变明细', '充值记录', '提现记录', '转账记录'],
                  tabfn: '__setMyCashRecordI',
                  url: 'myCashRecord'
                },
                {
                  id: '2-2-3',
                  menuid: '87',
                  title: '账户安全',
                  url: 'SafeCenter'
                },
                {
                  id: '2-2-4',
                  menuid: '34',
                  title: '银行卡管理',
                  url: 'Bank'
                },
                {
                  id: '2-2-5',
                  menuid: '29',
                  title: '奖金详情',
                  url: 'Bonus'
                }
              ]
            },
            {
              id: '2-3',
              title: '代理中心',
              innerurl: 'form',
              items: [
                {
                  id: '2-3-1',
                  menuid: '57',
                  title: '团队盈亏',
                  // tabs: ['总账', '彩票', '其它彩票', '体育', '真人', '电游', '捕鱼', '棋牌', '电竞', '活动', '充提', '团队统计', '团队分析'],
                  tabs: ['彩票', '三方', '微游', '充提统计', '活动统计'],
                  tabfn: '__setTotalAccountI',
                  url: 'TotalAccount',
                  position: {
                    width: '13rem'
                  }
                },
                {
                  id: '2-3-9',
                  menuid: '38',
                  title: '下级个人盈亏',
                  tabs: ['盈亏总表', '彩票', '体育', '真人', '老虎机', '电竟', '捕鱼', '棋牌', '基诺彩'],
                  tabfn: '__setReportI',
                  url: 'subProfitLoss'
                },
                {
                  id: '2-3-2',
                  menuid: '50',
                  title: '下级彩票记录',
                  // tabs: ['彩票', 'VR彩票:18718185', '体育:18718185', '真人:18718185', '电游:18718185', '捕鱼:18718185', '棋牌:18718185'],
                  tabs: ['投注记录', '追号记录'],
                  tabfn: '__setSubGameRecordI',
                  url: 'subGameRecord'
                },
                {
                  id: '2-3-3',
                  menuid: '67',
                  title: '下级账变明细',
                  // tabs: ['账变明细'],
                  tabfn: '__setSubCashRecordI',
                  url: 'subCashRecord'
                },
                {
                  id: '2-3-4',
                  menuid: '38',
                  title: '下级管理',
                  tabs: ['下级列表'],
                  url: 'UserList'
                },
                {
                  id: '2-3-5',
                  menuid: '42',
                  title: '开户管理',
                  tabs: ['新增下级', '推广链接管理'],
                  tabfn: '__setOpenAccountI',
                  url: 'openAccount'
                },
                {
                  id: '2-3-6',
                  menuid: '78',
                  title: '日工资管理',
                  tabs: ['我的日工资', '下级日工资', '日工资设置'],
                  url: 'salary',
                  tabfn: '__setSalaryI'
                },
                {
                  id: '2-3-7',
                  menuid: '45',
                  title: '彩票分红管理',
                  tabs: ['我的分红', '下级分红', '预期分红', '彩票分红契约'],
                  url: 'lotteryStock',
                  tabfn: '__setLotteryStockI'
                },
                {
                  id: '2-3-8',
                  menuid: '44',
                  title: '其它游戏分红管理',
                  tabs: ['我的其它游戏分红', '下级其它游戏分红', '预期其它游戏分红', '其它游戏分红契约'],
                  url: 'otherStock',
                  tabfn: '__setOtherStockI'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          menuid: '3',
          class: 'ds-icon-cash',
          title: '资金中心',
          url: 'me',
          hide: true,
          groups: [
            {
              id: '2-1',
              title: '个人中心',
              items: [
                {
                  id: '2-1-1',
                  menuid: '30',
                  title: '充值',
                  url: 'Load',
                  tabs: ['充值', '充值记录'],
                  tabfn: '__setLoadI'
                },
                {
                  id: '2-1-2',
                  menuid: '32',
                  title: '提现',
                  url: 'Withdraw',
                  tabs: ['提现', '提现记录'],
                  tabfn: '__setWithdrawI'
                },
                {
                  id: '2-1-3',
                  menuid: '20',
                  title: '钱包转账',
                  url: 'Transfer',
                  tabs: ['钱包转账', '转账记录'],
                  tabfn: '__setTransferI'
                },
                {
                  id: '2-1-4',
                  menuid: '115',
                  title: '信游宝',
                  url: 'XYB'
                }
              ]
            }
          ]
        },
        {
          id: 3,
          class: 'ds-icon-me',
          title: '个人中心',
          menuid: '4',
          url: 'group',
          hide: true,
          groups: [
            {
              id: '2-2',
              title: '用户中心',
              items: [
                {
                  id: '2-2-1',
                  menuid: '50',
                  title: '彩票记录',
                  // tabs: ['彩票', 'VR彩票:18718185', '体育', '真人', '电游', '捕鱼', '棋牌'],
                  tabs: ['投注记录', '追号记录'],
                  tabfn: '__setMyGameRecordI',
                  url: 'myGameRecord'
                },
                {
                  id: '2-2-6',
                  menuid: '99',
                  title: '盈亏报表',
                  tabs: ['盈亏总表', '彩票', '体育:18718185', '真人:18718185', '老虎机:18718185', '电竟:18718185', '捕鱼:18718185', '棋牌:18718185', '基诺彩:18718185'],
                  tabfn: '__setReportI',
                  url: 'personalReport'
                },
                {
                  id: '2-2-2',
                  menuid: '67',
                  title: '资金记录',
                  tabs: ['账变明细', '充值记录', '提现记录', '转账记录'],
                  tabfn: '__setMyCashRecordI',
                  url: 'myCashRecord'
                },
                {
                  id: '2-2-3',
                  menuid: '87',
                  title: '账户安全',
                  url: 'SafeCenter'
                },
                {
                  id: '2-2-4',
                  menuid: '34',
                  title: '银行卡管理',
                  url: 'Bank'
                },
                {
                  id: '2-2-5',
                  menuid: '29',
                  title: '奖金详情',
                  url: 'Bonus'
                }
              ]
            }
          ]
        },
        {
          id: 4,
          class: 'ds-icon-agent',
          title: '代理中心',
          menuid: '5',
          url: 'form',
          hide: true,
          groups: [
            {
              id: '2-3',
              title: '游戏记录',
              items: [
                {
                  id: '2-3-1',
                  menuid: '57',
                  title: '团队盈亏',
                  tabs: ['总账', '彩票', '其它彩票', '体育', '真人', '电游', '捕鱼', '棋牌', '电竞', '活动', '充提', '团队统计', '团队分析'],
                  tabfn: '__setTotalAccountI',
                  url: 'TotalAccount',
                  position: {
                    width: '13rem'
                  }
                },
                {
                  id: '2-3-9',
                  menuid: '38',
                  title: '下级个人盈亏',
                  tabs: ['盈亏总表', '彩票', '体育', '真人', '老虎机', '电竟', '捕鱼', '棋牌', '基诺彩'],
                  tabfn: '__setReportI',
                  url: 'subProfitLoss'
                },
                {
                  id: '2-3-2',
                  menuid: '50',
                  title: '下级彩票记录',
                  // tabs: ['彩票', 'VR彩票:18718185', '体育', '真人', '电游', '捕鱼', '棋牌'],
                  tabs: ['投注记录', '追号记录'],
                  tabfn: '__setSubGameRecordI',
                  url: 'subGameRecord'
                },
                {
                  id: '2-3-3',
                  menuid: '67',
                  title: '下级账变明细',
                  // tabs: ['账变明细'],
                  tabfn: '__setSubCashRecordI',
                  url: 'subCashRecord'
                },
                {
                  id: '2-3-4',
                  menuid: '38',
                  title: '下级管理',
                  tabs: ['下级列表'],
                  url: 'UserList'
                },
                {
                  id: '2-3-5',
                  menuid: '42',
                  title: '开户管理',
                  tabs: ['新增下级', '推广链接管理'],
                  tabfn: '__setOpenAccountI',
                  url: 'openAccount'
                },
                {
                  id: '2-3-6',
                  menuid: '78',
                  title: '日工资管理',
                  tabs: ['我的日工资', '下级日工资', '日工资设置'],
                  url: 'salary',
                  tabfn: '__setSalaryI'
                },
                {
                  id: '2-3-7',
                  menuid: '45',
                  title: '彩票分红管理',
                  tabs: ['我的分红', '下级分红', '预期分红', '彩票分红契约'],
                  url: 'lotteryStock',
                  tabfn: '__setLotteryStockI'
                },
                {
                  id: '2-3-8',
                  menuid: '44',
                  title: '其它游戏分红管理',
                  tabs: ['我的其它游戏分红', '下级其它游戏分红', '预期其它游戏分红', '其它游戏分红契约'],
                  url: 'otherStock',
                  tabfn: '__setOtherStockI'
                }
              ]
            }
          ]
        },
        {
          id: 8,
          class: 'ds-icon-gift',
          title: '贵族俱乐部',
          outerhref: '/xy_activity/vipClub.html',
          hot: true,
          big: true,
          info: {class: 'ds-icon-vipclub ', id: '9-9-9', title: '贵族俱乐部', descrb: '全民VIP 贵气来袭'}
        },
        {
          id: 5,
          class: 'ds-icon-gift',
          title: '优惠活动',
          stitle: '活动',
          url: 'activity',
          menuid: '6',
          defaultUrl: '/activity/5-1-1',
          hot: true,
          hideSub: true,
          groups: [
            {
              title: '活动中心',
              items: [
                {id: '5-1-1', menuid: '71', title: '活动中心', url: 'Activity'},
                {id: '5-1-2', menuid: '72', title: '礼品箱', url: 'Gift'},
                {id: '5-1-3', menuid: '110', title: '优惠券', url: 'MyCoupon'}
              ]
            }
          ]
        },
        {
          id: 6,
          class: 'ds-icon-help',
          title: '帮助',
          url: 'help',
          menuid: '7',
          defaultUrl: '/help/6-1-1',
          groups: [
            {
              id: '6-1',
              title: '帮助中心',
              items: [
                {
                  id: '6-1-1',
                  title: '玩法介绍',
                  url: 'PlayHelp',
                  menuid: '68'
                },
                {
                  id: '6-1-2',
                  title: '功能介绍',
                  url: 'FunctionHelp',
                  menuid: '69'
                },
                {
                  id: '6-1-3',
                  title: '常见问题',
                  url: 'QuestionHelp',
                  menuid: '70'
                }
                // {
                //   id: '6-1-4',
                //   title: 'VIP介绍',
                //   url: 'VIP'
                // }
              ]
            },
            {
              id: '6-2',
              title: '系统',
              // hide: true,
              items: [
                {
                  id: '6-2-1',
                  title: '系统公告',
                  menuid: '90',
                  url: 'System'
                  // menuid: '68'
                },
                {
                  id: '6-2-2',
                  title: '意见反馈',
                  menuid: '91',
                  url: 'Feedback'
                }
              ]
            }
          ]
        },
        {
          id: 7,
          class: 'ds-icon-download',
          href: '/download/7-1-1',
          defaultUrl: '/download/7-1-1',
          title: '下载'
        }
      ],
      menuids: '',
      activeMenu: [],
      audio: null,
      ggl: false,
      // 弹出登录框
      popuLogin: false,
      Ptitle: '登录',
      Pbtn: [],
      PboxStyle: {
        backgroundColor: '#e9e9e9'
      },
      redirect: '',
      // {'game': currentab[0] && currentab[0].href.indexOf('game') !== -1 }
      appcls: ''
    }
  },
  computed: {

    starTabs () {
      return this.state.pages.filter(t => t.star)
    },
    ctabs () {
      return this.state.pages.filter(t => {
        return t.opened && !t.removed
      })
    },
    currentab () {
      return this.ctabs.filter(t => {
        return t.active
      })
    },
    // 1: pre !== current 2: pre.size !== 'minus'
    prev () {
      let prev = {prev: 0, href: '/'}
      this.tabs.find(t => {
        if (t.prev > prev.prev && t.id !== (this.currentab[0] || {}).id && t.size !== 'minus') prev = t
      })
      return prev
    },
    mi () {
      return (this.currentab[0] || {mi: -1}).mi
    }
  },
  watch: {
    // currentab (nn, o) {
    //   setTimeout(() => {
    //     this.checkAppClassState(nn)
    //   }, 100)
    //   setTimeout(() => {
    //     this.checkAppClassState(nn)
    //   }, 300)
    //   setTimeout(() => {
    //     this.checkAppClassState(nn)
    //   }, 500)
    //   setTimeout(() => {
    //     this.checkAppClassState(nn)
    //   }, 800)
    // },
    tabs (n, o) {
      setTimeout(() => {
        if (n.length > 1) {
          n.forEach((x, i) => {
            if (n[i + 1]) {
              x.opened = false
            }
          })
        }
      }, 50)
    },
    mi () {
      setTimeout(() => {
        if (this.mi < 0) {
          this.activeMenu = []
        }
        if (this.mi > 2) {
          if (this.mi === 6) {
            this.activeMenu = [this.menus[this.mi]]
          } else {
            if (this.Me.login) {
              this.activeMenu = [this.menus[9 + 5], this.menus[10 + 5], this.menus[11 + 5], this.menus[12 + 5], this.menus[13 + 5], this.menus[14 + 5]]
            } else {
              this.activeMenu = [this.menus[14 + 5]]
            }
          }
        }
      }, this.mi ? 0 : 0)
    },
    'Me': {
      deep: true,
      handler () {
        if (this.Me.mode.indexOf('classic') !== -1) {
          this.maxPages = 1
          this.ctabs.forEach(t => {
            if (t.opened && !t.active) t.opened = false
          })
        } else this.maxPages = 5
        if (this.Me.login) {
          this.popuLogin = false
        }
      }
    },
    menus () {
      this.setPages(this._getPages())
    },
    // tabs () {
    //   return this..filter(p => {
    //     console.log(p.opened, 2)
    //     return p.opened
    //   })
    // }
    'ctabs': {
      // deep: true,
      immediate: true,
      handler () {
        this.ctabs.forEach(tab => {
          if (!this.tabs.find(t => t.id === tab.id)) this.tabs.push(tab)
          else this.tabs.find(t => t.id === tab.id && (t = tab))
        })
        this.tabs = this.tabs.filter(t => t.opened && !t.removed)
      }
    },
    // // 如果路由有变化，会再次执行该方法
    '$route': 'openRoute'
  },
  mounted () {
    this.getLotterys()
    this.getCfgInfo()
    this.chatUrl()
    this.setUser({mode: 'classic v2'})
    // 登录isTop = 1
    this.setPages(this._getPages())
    window.NProgress.done()
    // 如果去趋势图不用尝试登录了
    if (this.$route.path.indexOf('/trend') === -1) {
      this.tryLogin()
    }
    // window.dodd = () => {
    //   this.message({type: 'drawSucc', content: [{succ: '2', amt: '100.00'}, {succ: '2', amt: '100.00'}]})
    //   this.message({type: 'prizeNotice', content: [{lottName: '时时彩', issue: '19202020', amt: '100.00'}, {lottName: 'xxxx', issue: 'xxxxx', amt: '100.00'}, {lottName: 'xxxx', issue: 'xxxxx', amt: '100.00'}, {lottName: 'xxxx', issue: 'xxxxx', amt: '100.00'}, {lottName: 'xxxx', issue: 'xxxxx', amt: '100.00'}, {lottName: 'xxxx', issue: 'xxxxx', amt: '100.00'}]})
    //   this.message({type: 'saveSucc', content: [{bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}, {bankName: '工商银行', amt: '100.00'}]})
    // }
    if (!window.localStorage.getItem('showDF')) window.localStorage.setItem('showDF', true)
    // this.$forceUpdate()
  },
  methods: {
    checkAppClassState (nn) {
      let n = nn[0]
      if (n && n.href && n.href.indexOf('game') !== -1) {
        const app = document.getElementById('app')
        if (app.className.indexOf('game') === -1) {
          this.openTab(n.id)
        }
      }
    },
    showBonus () {
      return this.menuids.indexOf(',45,') !== -1
    },
    getLotterys () {
      this.$http.get(api.getLotterys).then(({data}) => {
        // success
        // data.lotteryList.splice(0, 5)
        if (data.success === 1) {
          this.menus[6].groups.forEach(x => {
            x.items.forEach(y => {
              // delete y.menuid
              if (y.gameid && data.lotteryList.findIndex(z => z.lotteryId === y.gameid) === -1) {
                this.$set(y, '$removed', true)
              }
            })
          })
          let pages = this._getPages()
          let x = []
          this.tabs.forEach((t, i) => {
            if (!pages.find(x => x.id === t.id)) {
            } else {
              x.push[Object.assign(pages.find(x => x.id === t.id), {opened: true, size: 'minus'})]
            }
          })
          this.tabs = x
          this.setPages(pages)
          this.openTab(this.$route.params.url)
          // this.setPages(this._getPages())
        }
      }, (rep) => {
        // error
      })
    },
    canGetIngots () {
      this.$http.get(api.canGetIngots).then(({data: {success, showIngots, beginTime, endTime}}) => {
        if (success) {
          this.setUser({showIngots: showIngots})
          if (beginTime && endTime) this.setUser({taskTime: (new Date(endTime)) - (new Date(beginTime))})
        }
      })
    },
    getIngotsTaskProgress () {
      this.$http.get(api.getIngotsTaskProgress).then(({data: {success, userBankProgress, userPayRecordProgress, userProjectProgress}}) => {
        if (success) {
          this.showTask = true
          this.setUser({t1: userBankProgress === '1', t2: userPayRecordProgress === '1', t3: userProjectProgress === '1'})
        }
      })
    },
    __showAnnual () {
      // this.getIngotsTaskProgress()
    },
    __hideAnnual () {
      this.showAnnual = false
    },
    __showTask () {
      this.getIngotsTaskProgress()
    },
    __hideTask () {
      this.showTask = false
    },
    hideMenuGuide () {
      this.showMenuGuide = false
      window.localStorage.setItem('menu_guide', 'true')
    },
    __setUser () {
      return this.setUser()
    },
    Pclose () {
      this.popuLogin = false
      window.NProgress.done()
      this.redirect = ''
      return false
    },
    __popLogin (au) {
      if (this.Me.login) return (this.popuLogin = false)
      if (typeof au === 'string') {
        this.redirect = au.split(':')[1]
      }
      this.popuLogin = !!au
    },
    __setGGL () {
      this.ggl = !this.ggl
    },
    // 11、系统公告   ALL
    sysNotices () {
      this.$http.get(api.sysNotices, {page: 1, pageSize: 1, isReleaseLine: 1}).then(({data}) => {
        // success
        if (data.success) {
          let n = (data.sysNotices || [])[0]
          let modal = this.$modal.confirm({
            title: n.subject || '特别提醒',
            boxStyle: {
              width: '580px'
            },
            content: '<pre class="text-666" style="text-align: left;">' + n.content + '</pre>',
            btn: ['知道了'],
            ok () {
              if (!store.state.user.isTry && !(store.state.user.cashPwd) && modal.btn[0] === '知道了') {
                modal.btn = ['立即前往设置']
                modal.content = '尊敬的用户，您还未设置资金密码，为了不影响您的提款，请立即前往设置资金密码'
                return false
              }
            },
            close () {
              if (!store.state.user.isTry && !(store.state.user.cashPwd) && modal.btn[0] === '知道了') {
                modal.btn = ['立即前往设置']
                modal.content = '尊敬的用户，您还未设置资金密码，为了不影响您的提款，请立即前往设置资金密码'
                return false
              }
              if (modal.btn[0] === '立即前往设置') {
                this.$router.push('/me/2-2-3')
              }
            },
            O: this
          })
        }
      }, (rep) => {
        // error
      })
    },
    openRoute ({path, params: {url}}) {
      // console.log(this.$route, '!')
      this.appcls = this.$route.path.indexOf('game') === -1 ? '' : 'game'
      if (!url) store.actions.updateAllPages({active: false})
      else {
        // [0, 50, 100, 150, 200, 250].forEach(t => {
        //   setTimeout(() => {
        //     if (this.$route.params.url && !this.ctabs[0]) this.openTab(url)
        //   }, 50)
        // })
        setTimeout(() => {
          this.openTab(url)
        }, 0)
        // setTimeout(() => {
        //   !this.ctabs[0] && this.$router.push('/')
        // }, 300)
      }
    },
    __music () {
      if (!this.audio) this.audio = new window.Audio('/static/media/24_Ctu.mp3')
      this.audio.paused && this.audio.play()
      // setTimeout(() => {
      //   this.audio.pause()
      //   this.audio.currentTime = 0
      // }, 500)
    },
    __print (data) {
      this.printData = data
      this.showPrint = true
    },
    __unprint () {
      this.printData = {}
      this.showPrint = false
    },
    tryLogin () {
      // let M = this.$modal.info({
      //   content: '授权登录中...',
      //   btn: [],
      //   close () {
      //     M = null
      //   },
      //   O: this
      // })
      this.$http.get(api.validate, {isAuto: 1}).then(({data}) => {
        // success
        if (data.success === 1) {
          this.loginSuccess(data)
          // setTimeout(() => {
          //   this.loginSuccess(data)
          //   M.type = 'success'
          //   M.content = '登录成功！'
          // }, 500)
          // setTimeout(M._close, 1000)
        } else {
          this.setUser({login: false})
          // M._close()
        }
      }, (rep) => {
        this.setUser({login: false})
        // M._close()
      }).finally(() => {
      })
    },
    chatUrl () {
      this.$http.get(api.chatUrl).then(({data}) => {
        // success
        if (data.success === 1) {
          this.setUser({chatUrl: data.chatUrl, chatUrlSlave: data.chatUrlSlave})
        }
      })
    },
    __loginSuccess (data) {
      this.loginSuccess(data)
    },
    loginSuccess (data) {
      // this.__setCall({fn: '__getUserFund', callId: undefined})
      // setTimeout(this.getUserPrefence, 1000)
      if (this.redirect) this.$router.push(this.redirect)
      this.redirect = ''
      this.getUserPrefence(() => {
        // this.getUserPrefence()
        this.__getUserFund()
        let backWaters = {}
        data.backWater.forEach((b) => {
          backWaters['groupId_' + b.groupId] = b.backWater > 0
        })
        this.setUser({login: true,
          displayPermission: data.displayPermission, // 显示权限
          showPhoneEmail: data.showPhoneEmail, // 0 : 不显示手机邮箱   1：显示手机邮箱
          showBackWater: data.showBackWater,
          showSalary: data.showSalary === 1,
          name: data.nickName,
          pwd: data.hasLogPwd === 1,
          cashPwd: data.hasSecurityPwd === 1,
          type: data.identity,
          account: data.userName,
          userId: data.userId,
          shareCycle: data.shareCycle,
          role: data.roleId,
          hasBankCard: data.hasBankCard === 1,
          isTry: data.isTry === 1,
          guide: data.isTry === 1 ? false : (!data.nickName || data.hasLogPwd !== 1 || data.hasSecurityPwd !== 1),
          cbsafe: !!data.isOpenKey,
          safeCheck: data.verifyType,
          vip: data.isVip,
          isVip: data.isVip,
          vipChatUrl: data.vipChatUrl,
          backWaters,
          platId: data.platId,
          token: data.token
          // isOldUser: data.isOldUser
        })
        this.showAnnual = !!data.isOldUser
        this.oldUserInfo = {
          //  string  年（周年庆活动弹出框使用）
          year: data.year,
          // string  月（周年庆活动弹出框使用）
          month: data.month,
          // string  日（周年庆活动弹出框使用）
          day: data.day,
          // string  刮刮卡数量（周年庆活动弹出框使用）
          scratch: data.scratch,
          //  string  游戏体验金券金额（周年庆活动弹出框使用）
          giftTicket: data.giftTicket,
          // string  待激活礼金券金额（周年庆活动弹出框使用）
          expTicket: data.expTicket,
          //  string  待激活礼金券充值要求金额（周年庆活动弹出框使用）
          rechargeAmount: data.rechargeAmount,
          // string  待激活礼金券投注要求金额（周年庆活动弹出框使用）
          buyAmount: data.buyAmount
        }
        // this.$router.push('/')
        // this.$router.push(this.state.user.guide ? '/' : '/help/6-2-1')
        window.accessAngular.setUser({
          id: data.userId,
          key: data.token,
          pltCd: data.platId,
          socketUrl: data.platUrl
        })
        window.accessAngular.isStranger(false)
        // window.accessAngular.connect()
        // setTimeout(window.accessAngular.connect, api.preApi && api.preApi !== api.api ? 1000 : 0)
        window.localStorage.setItem('api', api.api)
        this.sysNotices()
        Socket.sockets.user && this.connected(Socket.sockets.user)
        // this.showMenuGuide = !window.localStorage.getItem('menu_guide') // 关闭新功能引导
      })
      // this.canGetIngots()
      if (this.$route.path.indexOf('game') !== -1) this.__setCall({fn: '__upDatePoints', callId: undefined})
    },
    connected (socket) {
      setTimeout(() => {
        socket.send(JSON.stringify({
          parameter: {
            userId: this.Me.userId,
            app: 'web'
          },
          action: 'auth'
        }))
      }, 3000)
    },
    // openRoute ({path}) {
    //   // 如果出现在登录页面并且用户是登录状态
    //   if (path.startsWith('/login') && store.state.user.login) {
    //     this.logout(true)
    //   }
    // },
    _getPages () {
      // console.log('menus changed!!! or Menu need reauthority')
      return this.menus.reduce((p, m, mi) => {
        // delete un authority
        if (this.menuids && m.menuid && this.menuids.indexOf(',' + m.menuid + ',') === -1) {
          // this.menus.splice(mi, 1)
          this.$set(m, 'removed', true)
          return p
        } else {
          this.$set(m, 'removed', false)
        }
        m.groups = m.groups || []
        return m.groups.reduce((p, g, gi) => {
          // delete un authority
          if (m.removed || (this.menuids && g.menuid && this.menuids.indexOf(',' + g.menuid + ',') === -1)) {
            // m.groups.splice(gi, 1)
            this.$set(g, 'removed', true)
            return p
          } else {
            this.$set(g, 'removed', false)
          }
          g.items = g.items || []
          // if (g.items.length >= 8) g.items = util.groupArray(g.items, 4)
          return g.items.reduce((p, i, ii) => {
            // delete un authority
            if (i.$removed || g.removed || (this.menuids && i.menuid && this.menuids.indexOf(',' + i.menuid + ',') === -1)) {
              // g.items.splice(ii, 1)
              this.$set(i, 'removed', true)
              return p
            } else {
              this.$set(i, 'removed', false)
            }
            i.menuClass = g.class || m.class
            i = Object.assign({}, {
              mi: m.mi || mi,
              opened: false,
              active: false,
              // pre activated
              prev: 0,
              star: false,
              defaultSize: m.size || i.size || g.size || '',
              size: m.size || i.size || g.size || '',
              url: g.url || '',
              href: i.href || ('/' + (g.innerurl || m.url) + '/' + i.id),
              // class: g.class || '',
              menuClass: g.class || m.class
              // can't be star
              // noStar: m.hide
            }, i)
            if (g.position) i.position = g.position
            p.push(i)
            return p
          }, p)
        }, p)
      }, [])
    },
    openTab (url, same) {
      // some url likes /form/4-2-1 !== page.id != 4-2-1
      if (url && url.indexOf('/') !== -1) url = url.slice(url.lastIndexOf('/') + 1)
      // console.log(this.$route.params.url === url, url, '|||||')
      if (this.$route.params.url === url && url) !this.openPage(url) && this.$router.push('/')
      else this.openAnotherPage(url)
    },
    openAnotherPage (url) {
      // console.log('openAnotherPage', url)
      if (url === '/') return this.$router.push('/')
      if (this.tabs.length < this.maxPages || this.loop || this.tabs.find(t => t.id === url)) this.state.pages.find(p => p.id === url) && this.$router.push(this.state.pages.find(p => p.id === url).href)
      // else {
      //   this.$modal.warn({
      //     content: '最大窗口打开数：' + this.maxPages,
      //     btn: ['确定']
      //   })
      // }
    },
    closeTab (url, nurl) {
      // console.log('closeTab', url)
      // console.log(this.tabs.length, nurl, this.prev)
      this.updatePage(url, {opened: false, position: null})
      this.$nextTick(() => {
        // after close open the pre one
        if (nurl && nurl !== '/') {
          this.openTab(nurl)
        } else if (this.tabs.length === 0) {
          setTimeout(() => {
            this.$router.push({
              path: '/',
              query: {
                // keep: true
              }
            })
          }, 0)
        } else {
          !this.currentab[0] && this.openTab(this.prev.href === '/' && this.ctabs.length > 0 ? this.ctabs[0].href : this.prev.href)
        }
      })
    },
    // setMenus (menus) {
    //   this.menus = menus
    // },
    logout (args) {
      this.$http.get(api.logout)
      this.setUser()
      document.body.className = this.Me.css
      // cookie.remove('JSESSIONID')
      // if (!args) this.$router.push('/login/login')
      if (args && args.fn) args.fn()
      this.__logoutChat()
      if (this.$route.meta.rl) this.$router.push('/')
      Socket.close('user')
      // re-connect after logout
      this.getCfgInfo()
    },
    __logout (args) {
      this.logout(args)
    },
    __logoutChat () {
      window.accessAngular.close('您已退出聊天系统！')
      // document.querySelector('.custom-service-box') && (document.querySelector('.custom-service-box').className += 'opacity-0')
    },
    __getUserPrefence () {
      this.getUserPrefence()
    },
    // 5、查询菜单、桌面、收藏夹 PC接口
    getUserPrefence (fn) {
      let M = this.$modal.info({
        content: '获取权限信息中...',
        btn: [],
        close () {
          M = null
        },
        O: this
      })
      this.$http.get(api.getUserPrefence).then(({data}) => {
        // success
        if (data.success === 1) {
          this.menuids = ',' + data.menuList + ','
          if (this.menuids.indexOf(',98') === -1) {
            this.menuids += ',!98,'
          }
          this.setUser({menuids: this.menuids, canTopUp: data.menuList.indexOf('30') !== -1, canWithDraw: data.menuList.indexOf('32') !== -1})
          let pages = this._getPages()
          let x = []
          this.tabs.forEach((t, i) => {
            if (!pages.find(x => x.id === t.id)) {
            } else {
              x.push[Object.assign(pages.find(x => x.id === t.id), {opened: true, size: 'minus'})]
            }
          })
          this.tabs = x
          this.setPages(pages)
          this.openTab(this.$route.params.url)

          this.$nextTick(() => {
            data.favoriteList.forEach((d, i) => {
              store.actions.updatePage(d.menuId + '', {star: true})
            })
            // data.deskList.forEach((d, i) => {
            //   store.actions.updatePage(d.menuId + '', {desk: true})
            // })
          })
          typeof fn === 'function' && fn()
          M._close()
        } else {
          M._close()
        }
      }, (rep) => {
        // error
        M._close()
      })
    },
    // 6、用户资金信息  ALL
    __getUserFund () {
      this.$http.get(api.getUserFund).then(({data}) => {
        // success
        if (data.success) {
          this.setUser({amoney: data.availableBalance, money: data.channelBalance, free: data.freeAvaiable, smoney: data.specialBalance})
        }
      }, (rep) => {
        // error
      })
    },
    message (msg) {
      // console.log('messge', msg.content[0])
      if (!msg || !msg.type) return
      switch (msg.type) {
        case 'openWinCode':
          this.__setCall({fn: '__openWinCode', args: msg.content[0]})
          break
        case 'prizeNotice':
          // 中将提醒默认提醒
          (window.localStorage.getItem('WinningReminder') ? window.localStorage.getItem('WinningReminder') * 1 : 1) && !this.NotifyModal && (this.NotifyModal = this.$modal.success({
            close () {
              this.NotifyModal = null
            },
            O: this,
            content: msg.content.reduce((p, x, i) => {
              p += '<div style="text-align: left">恭喜您在<span class="text-blue">' + x.lottName + x.issue + '</span>期中奖了<span class="text-danger">' + x.amt + '</span>元</div>'
              return p
            }, ''),
            // content: '<div style="text-align: left">恭喜您在<span class="text-blue">' + msg.content[0].lottName + msg.content[0].issue + '</span>中奖了<span class="text-danger">' + msg.content[0].amt + '</span>元</div>',
            btn: []
          }))
          // this.$message.success({message: '恭喜您在' + msg.content[0].lottName + msg.content[0].issue + '期的投注' + msg.content[0].code + '中奖了' + msg.content[0].amt + '元'})
          this.__getUserFund();
          this.__setCall({fn: '__orderlist'})
          break
        case 'saveSucc':
          !this.NotifyModal && (this.NotifyModal = this.$modal.success({
            close () {
              this.NotifyModal = null
            },
            O: this,
            content: msg.content.reduce((p, x, i) => {
              p += '<div style="text-align: left">您通过<span class="text-blue">' + x.bankName + '</span>充值<span class="text-danger">' + x.amt + '</span>元已到账，请注意查收</div>'
              return p
            }, ''),
            // content: '<div style="text-align: left">您通过<span class="text-blue">' + msg.content[0].bankName + '</span>充值<span class="text-danger">' + msg.content[0].amt + '</span>元已到账，请注意查收</div>',
            btn: []
          }))
          // this.$message.success({message: '您通过' + msg.content[0].bankName + '充值' + msg.content[0].amt + '元已到账，请注意查收'})
          break
        case 'drawSucc':
          !this.NotifyModal && (this.NotifyModal = this.$modal[['warn', 'warn', 'success'][msg.content[0].succ]]({
            close () {
              this.NotifyModal = null
            },
            O: this,
            content: msg.content.reduce((p, x, i) => {
              p += '<div style="text-align: left">您申请提款<span class="text-blue">' + x.amt + '</span>元<span class="' + ['', 'text-danger', 'text-green'][x.succ] + '">' + ['', '失败', '成功'][x.succ] + '</span>，请注意查看</div>'
              return p
            }, ''),
            // content: '<div style="text-align: left">您申请提款<span class="text-blue">' + msg.content[0].amt + '</span>元<span class="' + ['', 'text-danger', 'text-green'][msg.content[0].succ] + '">' + ['', '失败', '成功'][msg.content[0].succ] + '</span>，请注意查看</div>',
            btn: []
          }))
          // this.$message[['error', 'error', 'success'][msg.content[0].succ]]({message: '您申请提款' + msg.content[0].amt + '元' + ['', '失败', '成功'][msg.content[0].succ] + '，请注意查看'})
          break
      }
    },
    getCfgInfo () {
      this.$http.get(api.getCfgInfo).then(({data: {success, broadcaseWSUrl}}) => {
        if (success) {
          !Socket.sockets.user && Socket.connect('user', broadcaseWSUrl)
          !Socket.notify.messages.find(fn => fn.name === this.message.name) && Socket.notify.messages.push(this.message)
          !Socket.notify.messages.find(fn => fn.name === this.open.name) && Socket.notify.opens.push(this.open)
        }
      })
    },
    open () {
      // console.log('open')
      if (this.Me.login) {
        this.connected(Socket.sockets.user)
      } else {
        Socket.sockets.user && Socket.sockets.user.send(JSON.stringify({action: 'noauth'}))
      }
    },
    righterHandler (type, data) {
      if (type === 'chess') {
        if (!this.$root.showMiniIframeGame) {
          this.$root.showMiniIframeGame = !this.$root.showMiniIframeGame
        }
        this.$root.miniIframeGameRetract = !this.$root.miniIframeGameRetract
      }
    }
  },
  components: {
    Task,
    dsHeader,
    // dsFooter,
    Print,
    dsLefter,
    dsRighter,
    GGL,
    Modal,
    L,
    MenuGuide,
    AnnualCeremoney,
    // Chat
    RightQuickThirdGame
  }
}
</script>
<style lang="stylus">
  .common-login.modal
    .box
      box-shadow 0 0 10px rgba(0,0,0, .5)
    .box-wrapper
      .header-bar
        padding-left .3rem !important
        .title
          padding-top .05rem
</style>

<style lang="stylus">
  @import './var.stylus'
  @import './path.stylus'
  // @import './chat.stranger.phone.stylus'
  html, body
    position static !important
  html
    height 100%
    width 100%
    font-size 100px
    overflow hidden
    min-height 600px
    min-width 800px
    font-family Arial, Helvetica, sans-serif, 'Microsoft YaHei'

  pre
    font-family Arial, Helvetica, sans-serif, 'Microsoft YaHei'

  body
    height 100%
    width 100%
    font-size .14rem
    color #666
    margin 0
    background url(/static/skins/big_bg.jpg) center no-repeat
    // background-size 100% 100% !important
    transition background linear .5s
    &.skin-new-year
      #app.classic .lefter.game .game
        background-color rgba(0,0,0, .7)

      .page.home > .container
        margin-top 18%
        @media(max-height: 768px)
            margin-top 10%
      .page.login > .logo
        margin-top 17%
        @media(max-height: 768px)
          margin-top 12%


      @media(max-height: 1200px)
        background-size 130% 130% !important
      @media(max-height: 900px)
        background-size 140% 140% !important
      @media(max-width: 1366px)
        background-size 160% 160% !important
      @media(max-height: 768px)
        background-size 160% 160% !important
      @media(max-width: 1280px)
        background-size 170% 170% !important
      @media(max-width: 1200px)
        background-size 200% 170% !important
        // background-position 200% 200% !important

    background-size cover

  body:fullscreen #app > * {
    background url(/static/skins/bg.jpg) center no-repeat
  }
  body:full-screen #app > * {
    background url(/static/skins/bg.jpg) center no-repeat
  }
  body:-moz-full-screen #app > * {
    background url(/static/skins/bg.jpg) center no-repeat
  }

</style>
<style lang="less">
  @import url('./chat.wap.less');
</style>
<style lang="stylus">
  @import './common.stylus'
  @import './var.stylus'
  @import './path.stylus'
  @import './main.stylus'
  @import './css/index.stylus'
  @import './classic.stylus'
  @import './night.stylus'
  @import './1280X800.stylus'
  @import './chat.stranger.1366.stylus'
  @import './classic.v2.stylus'
  @import './chat.fix.stylus'
  // @import './chat.wap.stylus'
  // @import './chat.wap.iphone.less'
  // @import './pad.stylus'
  // @import './phone.stylus'
  // @import './chat.night.stylus'



  header
    position absolute
    top 0
    // right: 1.2rem
    max-width "calc(100% - %s)" % 1.5rem
    left 0
    right 0
    height HH
    z-index 3
    & + .scroll-content
      top HH
    // &:after
    //   content ''
    //   position absolute
    //   left 0
    //   right -1.5rem
    //   top 0
    //   bottom 0
    //   background-color rgba(55,255,255,.1)
    //   z-index -9999
  // footer
  //   position absolute
  //   bottom 0
  //   left 0
  //   right 0
  //   min-width 8.5rem
    // z-index 1

  #app:not(.classic) .dialog-container
    z-index 2


  .scroll-content
    position absolute
    left 0
    right 0
    top 0
    bottom 0
    overflow-x hidden
    overflow-y auto
    overflow-scrolling touch
    // radius(x = .05rem)
    // &.has-header
    //   top HH
    &.has-footer:not(.collapse-footer)
      // bottom FH
      // @media(max-width: 1362px)
      @media(max-width: 1500px)
        // bottom 2*FH
      @media(max-width: 862px)
        // bottom 3*FH



// define transition common timming function and time
[class*=-enter]
[class*=-leave]
// [class*=-move]
  transition all linear .2s // @static 2

.zoom-enter-active, .zoom-leave-active
    // opacity 0
    // transform perspective(500px) translateZ(-5000px)
    opacity .2
    transform perspective(500px) translateZ(-1000px)


.slide-enter, .slide-leave-active
  opacity 0
  transform translateX(100%)

.slide-up-enter, .slide-up-leave-active
  opacity 0
  transform translateY(-100%)
.slide-down-enter, .slide-down-leave-active
  opacity 0
  transform translateY(100%)
.slide-left-enter, .slide-left-leave-active
  opacity 0
  transform translateX(-100%)
.fade-enter, .fade-leave-active
  opacity 0
  &.dialog-container
    transition all linear 0s // @static 2

.from-down-leave-up-enter
  transform translateY(100%)








// define for main page
.page
  &[class*=-leave]
    // transition-delay .5s

  // &[adjusting]
  //   top 0
  //   bottom 0

.back
  // define for main page when back
  &>.page
    &[class*=-leave]
      transition-delay 0s
      z-index 1
    &[class*=-enter]
      transform none

#app.appunlogin.classic.v2
  .new-home .dialog-container .help-page.dialog-page
  .new-home .dialog-container .activity-page.dialog-page
    left -.2rem !important
  .lefter.help
    display none !important

</style>
