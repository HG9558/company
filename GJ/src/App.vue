<template lang="jade">

  #app(:class=" [state.user.css, 'app'] ")
    // vue-progress-bar
    
    // header
    // transition(name="slide-up" appear=true)
      dsHeader(:tabs="tabs" v-bind:starTabs="starTabs" v-on:open-tab="openTab" v-on:close-tab="closeTab" v-if="state.hasHeader && tabs.length > 0")

    
    // pages
    keep-alive
      transition(name="fade" appear=true)
        router-view.scroll-content.page(:pages="tabs" v-bind:prehref="prev.href" v-bind:menus="menus" v-on:close-tab="closeTab" v-on:open-tab="openTab" v-on:get-menus="getUserPrefence" v-on:get-userfund="__getUserFund"  v-bind:class="{ 'has-lefter': showLefter, 'has-footer': state.hasFooter, 'collapse-footer': collapseFooter }" v-bind:loop="loop" v-bind:max-pages="maxPages" v-bind:money="state.user.amoney" v-bind:free="state.user.free")

    // footer
    // transition(name="slide-down" appear=true)
    //  dsFooter(:menus="menus" v-bind:class="{'collapse-footer': collapseFooter}" v-bind:vip="state.user.vip" v-bind:name="state.user.name" v-bind:money="state.user.amoney" v-bind:free="state.user.free" v-on:open-page="openTab" v-if="state.hasFooter" v-on:logout="logout" v-on:collapse-footer="collapseFooter = !collapseFooter" v-show="displayFooter")
      
    // Chat
    // Print
    // Print(:data="printData" v-if="showPrint")

    // lefter
    transition(name="slide-left" appear=true)
      dsLefter.scroll-content.in-classic(:menus="activeMenu" v-bind:class="{ 'show-lefter': showLefter }" v-bind:name="state.user.name" v-bind:money="state.user.amoney" v-bind:free="state.user.free" v-on:open-page="openTab" v-if=" displayLefter " v-on:logout="logout" v-show="displayLefter")


</template>

<script>
// import util from './util'
import dsLefter from './components/Lefter'
import dsHeader from 'components/Header'
import dsFooter from 'components/Footer'
import Print from 'components/Print'
// import Chat from 'components/Chat'
import base from 'components/base'
import store from 'src/store'
import cookie from 'js-cookie'
import api from 'src/http/api'
export default {
  name: 'App',
  mixins: [base],
  data () {
    return {
      displayFooter: true,
      displayScrollInfo: true,
      displayLefter: false,
      showLefter: true,
      showPrint: false,
      printData: {},
      collapseFooter: false,
      // skin: 'day',
      loop: true,
      maxPages: 5,
      state: store.state,
      Me: store.state.user,
      tabs: [],
      menus: [
        {
          class: 'ds-icon-record',
          hide: true,
          url: 'form',
          size: 'full',
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
          groups: [
            {
              items: [
                {
                  id: '3-3-2',
                  // menuid: '29',
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
          size: 'full',
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
                {id: '5-2-10', position: {width: '7.6rem'}, title: '日工资扶持', url: 'Salary'}
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
          title: '游戏中心',
          url: 'game',
          hide: true,
          hideIcon: false,
          // size: 'full',
          groups: [
            {
              title: '时时彩',
              // withIcon: true,
              // class: 'ds-icon-item',
              url: 'SSC',
              // id: 2,
              // width: '8rem',
              items: [
                {class: 'ds-icon-game-chq sign hot', id: '1-1-1', menuid: '11', title: '重庆时时彩', gameid: 1},
                {class: 'ds-icon-game-xj', id: '1-1-2', menuid: '12', title: '新疆时时彩', gameid: 3},
                {class: 'ds-icon-game-tj', id: '1-1-3', menuid: '9', title: '天津时时彩', gameid: 4},
                // {class: 'ds-icon-game-bjssc', id: '1-1-4', menuid: '73', title: '北京时时彩', gameid: 17},
                {class: 'ds-icon-game-hlffc', id: '1-1-4', menuid: '73', title: '欢乐分分彩', gameid: 17},
                {class: 'ds-icon-game-twssc', id: '1-1-5', menuid: '76', title: '台湾5分彩', gameid: 20},
                {class: 'ds-icon-game-ffcqq sign hot', id: '1-2-6', menuid: '8', title: 'QQ分分彩', gameid: 2},
                {class: 'ds-icon-game-ffctx sign hot', id: '1-1-7', menuid: '96', title: '腾讯分分彩', gameid: 29}
              ]
            },
            {
              url: 'SSC',
              // id: 2,
              // width: '8rem',
              items: [
                {class: 'ds-icon-game-cb30 sign hot', id: '1-2-1', menuid: '13', title: '快投30秒', gameid: 16},
                {class: 'ds-icon-game-cb60', id: '1-2-2', menuid: '79', title: '快投1分彩', gameid: 12},
                {class: 'ds-icon-game-cb120', id: '1-2-3', menuid: '80', title: '快投2分彩', gameid: 21},
                {class: 'ds-icon-game-hg15', id: '1-2-4', menuid: '74', title: '韩国1.5分彩', gameid: 18},
                {class: 'ds-icon-game-dj15', id: '1-2-5', menuid: '75', title: '东京1.5分彩', gameid: 19}
              ]
            },
            {
              title: '11选5',
              // withIcon: true,
              // class: 'ds-icon-item',
              url: 'G115',
              // width: '1.8rem',
              items: [
                {class: 'ds-icon-game-gd', id: '1-3-1', menuid: '15', title: '广东11选5', gameid: 8},
                {class: 'ds-icon-game-jx115', id: '1-3-2', menuid: '62', title: '江西11选5', gameid: 7},
                {class: 'ds-icon-game-hb115', id: '1-3-3', menuid: '81', title: '湖北11选5', gameid: 22},
                {url: 'G115', class: 'ds-icon-game-11ydj', id: '1-3-4', menuid: '16', title: '11运夺金', gameid: 6},
                {url: 'G115', class: 'ds-icon-game-kt115', id: '1-3-5', menuid: '14', title: '快投11选5', gameid: 11}
              ]
            },
            {
              title: '快三',
              url: 'K3',
              // width: '1.8rem',
              items: [
                {class: 'ds-icon-game-ahK3', id: '1-4-1', menuid: '82', title: '安徽快三', gameid: 23},
                {class: 'ds-icon-game-jsK3', id: '1-4-2', menuid: '83', title: '江苏快三', gameid: 24},
                {class: 'ds-icon-game-jlK3', id: '1-4-3', menuid: '84', title: '吉林快三', gameid: 25},
                {class: 'ds-icon-game-bjK3', id: '1-4-4', menuid: '85', title: '北京快三', gameid: 26},
                {class: 'ds-icon-game-ktK3', id: '1-4-5', menuid: '19', title: '快投快三', gameid: 15}
              ]
            },
            {
              title: '其它游戏',
              // withIcon: true,
              // class: 'ds-icon-item',
              // url: 'K3',
              items: [
                {url: 'PK10', class: 'ds-icon-game-bjpk10 sign hot', id: '1-5-1', menuid: '18', title: '北京PK10', gameid: 13},
                {url: 'KL8', class: 'ds-icon-game-bj', id: '1-5-6', menuid: '92', title: '北京快乐8', gameid: 27},
                {url: 'SSL3D', class: 'ds-icon-game-fc', id: '1-5-2', menuid: '60', title: '福彩3D', gameid: 9},
                {url: 'SSL', class: 'ds-icon-game-pl35', id: '1-5-3', menuid: '61', title: '排列三、五', gameid: 10},
                {url: 'SSL', class: 'ds-icon-game-pl5', id: '1-5-4', menuid: '10', title: '快投排列五', gameid: 5},
                {url: 'SSL3D', class: 'ds-icon-game-kt3D sign new', id: '1-5-5', menuid: '17', title: '快投3D', gameid: 14},
                {url: 'HC6', class: 'ds-icon-game-lhc sign new', id: '1-1-6', menuid: '95', title: '六合彩', gameid: 28}
              ]
            },
            {
              title: '老虎机',
              hide: true,
              url: 'LHG',
              items: [
                {class: 'ds-icon-game-lhg01', id: '1-6-1', title: 'Sugar parade'},
                {class: 'ds-icon-game-lhg02', id: '1-6-2', title: 'Sugar Lion'},
                {class: 'ds-icon-game-lhg00', title: 'more'}
              ]
            }
          ]
        },
        {
          id: 2,
          menuid: '3',
          class: 'ds-icon-me',
          title: '个人',
          url: 'me',
          groups: [
            {
              id: '2-1',
              title: '个人中心',
              items: [
                // {
                //   id: '2-1-1',
                //   menuid: '20',
                //   title: '个人信息',
                //   url: 'Me'
                // },
                {
                  id: '2-2-1',
                  menuid: '87',
                  title: '安全中心',
                  url: 'SafeCenter'
                },
                {
                  id: '2-3-1',
                  menuid: '29',
                  title: '奖金详情',
                  url: 'Bonus'
                },
                {
                  id: '2-4-1',
                  menuid: '30',
                  title: '充值申请',
                  url: 'TopUp'
                },
                {
                  id: '2-5-1',
                  menuid: '32',
                  title: '提现申请',
                  url: 'WithDraw'
                },
                {
                  id: '2-6-1',
                  menuid: '34',
                  title: '我的银行卡',
                  url: 'Bank'
                }
              ]
            }
          ]
        },
        {
          id: 3,
          class: 'ds-icon-group',
          title: '团队',
          menuid: '4',
          url: 'group',
          groups: [
            {
              id: '3-1',
              title: '用户中心',
              items: [
                {
                  id: '3-1-1',
                  menuid: '38',
                  title: '用户列表',
                  url: 'UserList',
                  size: 'full',
                  position: {
                    width: '11rem'
                  }
                },
                {
                  id: '3-2-1',
                  menuid: '42',
                  title: '增加用户',
                  url: 'AddUser'
                },
                {
                  id: '3-2-2',
                  menuid: '43',
                  title: '推广设置',
                  url: 'Ad'
                },
                {
                  id: '3-2-3',
                  menuid: '93',
                  title: '设置日工资',
                  url: 'SetDaySalary'
                }
              ]
            },
            // {
            //   id: '3-2',
            //   title: '开户中心',
            //   items: [
            //     {
            //       id: '3-2-1',
            //       menuid: '42',
            //       title: '增加用户',
            //       url: 'AddUser'
            //     },
            //     {
            //       id: '3-2-2',
            //       menuid: '43',
            //       title: '推广设置',
            //       url: 'Ad'
            //     }
            //   ]
            // },
            {
              id: '3-3',
              title: '契约分红',
              items: [
                {
                  id: '3-3-1',
                  menuid: '45',
                  title: '分红列表',
                  url: 'Stock'
                },
                // {
                //   id: '3-3-2',
                //   menuid: '29',
                //   title: '分红详情',
                //   url: 'StockDetail'
                //   // position: {
                //   //   width: '5.4rem',
                //   //   height: '6.8rem'
                //   // }
                // },
                {
                  id: '3-3-3',
                  menuid: '44',
                  title: '契约列表',
                  url: 'Contract'
                },
                {
                  id: '3-3-4',
                  menuid: '88',
                  title: '契约详情',
                  url: 'ContractDetail',
                  position: {
                    width: '5.4rem',
                    height: '6.8rem'
                  }
                }
              ]
            },
            {
              id: '3-4',
              title: '团队统计',
              items: [
                {
                  id: '3-4-1',
                  menuid: '47',
                  title: '团队数据统计',
                  url: 'DataAnalysis'
                },
                {
                  id: '3-4-2',
                  menuid: '48',
                  title: '团队图表分析',
                  url: 'ChartAnalysis',
                  position: {
                    'min-width': '9.5rem'
                  }
                }
              ]
            }
          ]
        },
        {
          id: 4,
          class: 'ds-icon-record',
          title: '报表',
          menuid: '5',
          url: 'form',
          size: 'full',
          groups: [
            {
              id: '4-1',
              title: '游戏记录',
              items: [
                {
                  id: '4-1-1',
                  menuid: '50',
                  title: '投注记录列表',
                  url: 'Order',
                  position: {
                    width: '13rem'
                  }
                },
                {
                  id: '4-2-1',
                  menuid: '53',
                  title: '追号记录列表',
                  url: 'Follow',
                  position: {
                    width: '12rem'
                  }
                },
                {
                  id: '4-1-2',
                  menuid: '94',
                  title: '我的奖池号',
                  url: 'LuckyPool',
                  position: {
                    width: '12rem'
                  }
                },
                {
                  id: '4-5-3',
                  menuid: '89',
                  title: '走势图',
                  position: {
                    width: '16.3rem'
                  },
                  url: 'TrendChart'
                }
              ]
            },
            // {
            //   id: '4-2',
            //   title: '追号记录',
            //   items: [
            //     {
            //       id: '4-2-1',
            //       menuid: '53',
            //       title: '追号记录列表',
            //       url: 'Follow',
            //       position: {
            //         width: '12rem'
            //       }
            //     }
            //     // {
            //     //   id: '4-2-2',
            //     //   title: '追号记录详情',
            //     //   url: 'FollowDetail',
            //     //   position: {
            //     //     width: '10rem'
            //     //   }
            //     // }
            //   ]
            // },
            // @TODO @next
            // {
            //   id: '4-3',
            //   title: '跟单中心',
            //   items: [
            //     {
            //       id: '4-3-1',
            //       menuid: '56',
            //       title: '跟单中心',
            //       url: 'FollowOrder'
            //     }
            //   ]
            // },
            // {
            //   id: '4-4',
            //   title: '今日报表',
            //   items: [
            //     {
            //       id: '4-4-1',
            //       menuid: '57',
            //       title: '今日报表列表',
            //       url: 'Today'
            //     }
            //   ]
            // },
            {
              id: '4-5',
              title: '游戏报表',
              items: [
                {
                  id: '4-4-1',
                  menuid: '57',
                  title: '今日报表列表',
                  url: 'Today'
                },
                {
                  id: '4-5-1',
                  menuid: '58',
                  title: '盈亏报表列表',
                  url: 'ProfitLoss'
                },
                // {
                //   id: '4-5-4',
                //   title: '个人盈亏明细',
                //   url: 'ProfitLossDetail'
                // },
                {
                  id: '4-5-2',
                  menuid: '67',
                  title: '帐变列表',
                  position: {
                    width: '12rem'
                  },
                  url: 'Account'
                },
                {
                  id: '4-5-5',
                  menuid: '78',
                  title: '我的日工资详情',
                  url: 'DaySalary'
                }
              ]
            }
          ]
        },
        {
          id: 5,
          class: 'ds-icon-gift',
          title: '活动',
          // href: '/activity/5-1-1',
          url: 'activity',
          menuid: '6',
          groups: [
            {
              title: '活动中心',
              items: [
                {id: '5-1-1', menuid: '71', title: '活动中心', url: 'Activity'},
                {id: '5-1-2', menuid: '72', title: '礼品箱', url: 'Gift'}
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
                },
                {
                  id: '6-1-4',
                  title: 'VIP介绍',
                  url: 'VIP'
                }
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
          title: '下载'
        },
        {
          id: 8,
          class: 'ds-icon-chat',
          url: 'chat'
        }
      ],
      menuids: ''
      // activeMenu: []
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
    },
    activeMenu () {
      return [this.menus[6], this.menus[9]]
    }
  },
  watch: {
    mi () {
      // this.activeMenu = []
      setTimeout(() => {
        if (this.mi > 2 || this.mi < 0) {
          // this.activeMenu = [this.menus[6], this.menus[9]]
          if (this.mi === 6) {
            this.setUser({model: 'night'})
          } else {
            this.setUser({model: 'day'})
          }
        }
      }, this.mi ? 0 : 500)
    },
    'Me': {
      deep: true,
      handler () {
        if (this.Me.mode === 'classic') {
          this.maxPages = 1
          this.ctabs.forEach(t => {
            if (t.opened && !t.active) t.opened = false
          })
        } else this.maxPages = 5
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
    }
    // // 如果路由有变化，会再次执行该方法
    // '$route': 'openRoute'
  },
  mounted () {
    this.setUser({mode: 'classic', platform: 'nds', model: 'day'})
    // this.setUser({mode: 'classic', platform: 'nds', model: 'day'})
    // 登录isTop = 1
    this.setPages(this._getPages())
    window.NProgress.done()
    // console.log(this.$router)
    // no need login
    if (window.location.hash.startsWith('#/form/4-5-3')) {
      this.displayLefter = false
      this.showLefter = false
      this.displayScrollInfo = false
      this.displayFooter = false
      this.menuids = Array(100).fill(0).map((n, i) => { return (n = i) }).join(',')
      this.setPages(this._getPages())
      return false
    }
    if ((this.$router.options.routes.find(r => r.path.split('/')[1] === window.location.hash.split('/')[1].split('?')[0]) || {meta: {login: false}}).meta.login) this.tryLogin()
  },
  methods: {
    __toggleLefter () {
      this.showLefter = !this.showLefter
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
      let M = this.$modal.info({
        content: '授权登录中...',
        btn: [],
        close () {
          M = null
        },
        O: this
      })
      this.$http.get(api.validate, {timeout: 2000}).then(({data}) => {
        // success
        if (data.success === 1) {
          setTimeout(() => {
            this.loginSuccess(data)
            M.type = 'success'
            M.content = '登录成功！'
          }, 500)
          setTimeout(M._close, 1000)
        } else {
          this.setUser({login: false})
          M._close()
        }
      }, (rep) => {
        this.setUser({login: false})
        M._close()
      }).finally(() => {
      })
    },
    __loginSuccess (data) {
      // this.setUser({mode: 'classic', platform: 'nds', model: 'day'})
      this.loginSuccess(data)
    },
    loginSuccess (data) {
      this.displayLefter = true
      // this.__setCall({fn: '__getUserFund', callId: undefined})
      // setTimeout(this.getUserPrefence, 1000)
      this.getUserPrefence(() => {
        // this.getUserPrefence()
        this.__getUserFund()
        this.setUser({
          // mode: 'classic',
          // paltform: 'nds',
          model: 'day',
          login: true,
          name: data.nickName,
          pwd: data.hasLogPwd === '1',
          cashPwd: data.hasSecurityPwd === '1',
          type: data.identity,
          account: data.userName,
          shareCycle: data.shareCycle,
          role: data.roleId,
          hasBankCard: data.hasBankCard === '1',
          isTry: data.isTry === '1',
          guide: data.isTry === '1' ? false : (!data.nickName || data.hasLogPwd !== '1' || data.hasSecurityPwd !== '1'),
          cbsafe: !!data.isOpenKey,
          safeCheck: data.verifyType,
          vip: data.isVip
        })
        this.$router.push('/')
        // this.$router.push(this.state.user.guide ? '/' : '/help/6-2-1')
        // window.accessAngular.setUser({
        //   id: data.userId,
        //   key: data.token,
        //   pltCd: data.platId,
        //   socketUrl: data.platUrl
        // })
        // window.accessAngular.isStranger(false)
        // window.accessAngular.connect()
        // setTimeout(window.accessAngular.connect, api.preApi && api.preApi !== api.api ? 1000 : 0)
        window.localStorage.setItem('api', api.api)
      })
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
        if (this.menuids && m.menuid && this.menuids.indexOf(m.menuid) === -1) {
          // this.menus.splice(mi, 1)
          this.$set(m, 'removed', true)
          return p
        } else {
          this.$set(m, 'removed', false)
        }
        m.groups = m.groups || []
        return m.groups.reduce((p, g, gi) => {
          // delete un authority
          if (m.removed || (this.menuids && g.menuid && this.menuids.indexOf(g.menuid) === -1)) {
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
            if (g.removed || (this.menuids && i.menuid && this.menuids.indexOf(i.menuid) === -1)) {
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
              href: i.href || ('/' + m.url + '/' + i.id),
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
      if (this.$route.params.url === url) !this.openPage(url) && this.$router.push('/')
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
                keep: true
              }
            })
          }, 100)
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
      // this.setUser({mode: 'classic', platform: 'nds', model: 'day'})
      cookie.remove('JSESSIONID')
      if (!args) this.$router.push('/login')
      if (args && args.fn) args.fn()
      // this.__logoutChat()
    },
    __logout (args) {
      this.logout(args)
    },
    __logoutChat () {
      window.accessAngular.close('您已退出聊天系统！')
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
          this.menuids = data.menuList
          this.setUser({canTopUp: data.menuList.indexOf('30') !== -1, canWithDraw: data.menuList.indexOf('32') !== -1})
           // this.setPages(
          let pages = this._getPages()
          let x = []
          this.tabs.forEach((t, i) => {
            if (!pages.find(x => x.id === t.id)) {
              // this.tabs.splice(i, 1)
            } else {
              // console.log(t.id)
              // this.tabs.splice(i, 1, Object.assign(pages.find(x => x.id === t.id), {opened: true, size: 'minus'}))
              x.push[Object.assign(pages.find(x => x.id === t.id), {opened: true, size: 'minus'})]
            }
          })
          this.tabs = x
          this.setPages(pages)
          // this.setPages(this._getPages())
          // this.tabs.forEach((t, i) => {
          //   if (!this.state.pages.find(x => x.id === t.id)) {
          //     this.tabs.splice(i, 1)
          //   } else {
          //     // console.log(t.id)
          //     this.tabs.splice(i, 1, Object.assign(this.state.pages.find(x => x.id === t.id), {opened: true, size: 'minus'}))
          //   }
          // })
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
          this.setUser({amoney: data.availableBalance, money: data.channelBalance, free: data.freeAvaiable})
        }
      }, (rep) => {
        // error
      })
    }
  },
  components: {
    dsHeader,
    dsFooter,
    Print,
    dsLefter
    // Chat
  }
}
</script>
<style lang="stylus">
  @import './var.stylus'
  // @import './path.stylus'
  // @import './chat.stranger.phone.stylus'
  html
    height 100%
    width 100%
    font-size 100px
    overflow hidden
    min-height 600px
    min-width 800px
    font-family Arial, Helvetica, sans-serif, 'Microsoft YaHei'
  
  body
    height 100%
    width 100%
    font-size .14rem
    color #666
    margin 0
    background url(./assets/bg.jpg) center center no-repeat
    // background url($ASSETS/bg.jpg) center center no-repeat
    background-size cover
  
  body:fullscreen #app > * {
    // background url($ASSETS/bg.jpg) center center no-repeat
  }
  body:full-screen #app > * {
    // background url($ASSETS/bg.jpg) center center no-repeat
  }
  body:-moz-full-screen #app > * {
    // background url($ASSETS/bg.jpg) center center no-repeat
  }
</style>
<style lang="less">
  @import url('../../src/chat.wap.less');
</style>
<style lang="stylus">
  @import './var.stylus'
  // @import './path.stylus'
  @import './main.stylus'
  // @import './classic.stylus'
  // @import './night.stylus'
  // @import './1280X800.stylus'
  // @import './chat.stranger.1366.stylus'
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
    z-index 1
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
  footer
    position absolute
    bottom 0
    left 0
    right 0
    min-width 8.5rem
    // z-index 1
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

// .dialog-container .dialog-page>.scroll-content
//   width 100%
//   left 50%
//   transform translateX(-50%)
</style>
