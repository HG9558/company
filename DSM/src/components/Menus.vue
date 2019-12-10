<template lang="jade">
  el-menu(router=true @open="handleopen" @close="handleclose"  v-bind:default-active="defaultUrl" v-bind:defaultOpeneds="defaultSubMenus"  unique-opened ref="M" v-if="menus[0]")
    template(v-if="menus.length > 1")
      //- 报表菜单
      el-submenu(v-for="(m, i) in menus" v-if="(m.title && m.url && menus.length > 1 || m.url === 'help') && !m.removed" v-bind:index="m.url")
        template(slot="title")
          i(:class="[m.class + '-menu']")
          | {{ m.stitle || m.title }}
        el-menu-item-group(v-for="(g, ii) in m.groups" v-if="g.items.filter(function(x){return !x.removed})[0]")
          template(slot="title") {{ g.title }}
          el-menu-item(style="margin: .05rem 0" v-for="(item, iii) in g.items" v-bind:class="[ item.class, {'is-active': defaultUrl === ('/' + m.url + '/' + item.id), 'notis-active': defaultUrl !== ('/' + m.url + '/' + item.id)} ]" v-bind:index=" '/' + m.url + '/' + item.id" v-if="!item.removed && item.id && !item.hide" ) {{ item.title }}
    template(v-else)
      //- 游戏菜单 收藏
      div(v-for="(m, i) in MYmenus"  v-if="menus.length < 2 && m.url !== 'help' " v-bind:class=" [ menus[0].url ] ")
        template(v-for="(g, ii) in m.groups")
          el-submenu(v-bind:index="g.url" popper-class="game-menu" v-bind:ref="'subMenu'+(ii + 1)")
            .ds-button.full(style="display: none" v-bind:class="[ m.url + '-myicon' ]" v-bind:index="g.url") {{ m.title }}
            template(slot="title")
              i(:class="g.class")
              span{{ g.title }}
            el-menu-item-group(v-if="g.items.filter(function(x){return !x.removed})[0]")
                //- template(slot="title") {{ g.title }}
                el-menu-item.ds-button.full( v-for="(item, iii) in g.items" v-bind:index=" !item.fn ? '/' + m.url + '/' + item.id : '' "  v-bind:class="[ item.class, {'is-active': defaultUrl === ('/' + m.url + '/' + item.id), 'notis-active': defaultUrl !== ('/' + m.url + '/' + item.id)} ]" v-if="!item.removed && item.id && !item.hide" style="font-size: .12rem;")
                  span(@click=" item.fn && openTab(item) ") {{ item.title }}
                  //- span.SealTime {{item.gameid}}
                  span.SealTime(v-bind:class="{'timeRed': timefind(item).timeLast<11000}") {{ timefind(item).timeStr }}
                  span.fav(v-if="!favGameIds.includes(item.gameid)" @click="favAdd(item)") ☆
                  span.fav(v-if="favGameIds.includes(item.gameid)" @click="favDel(item)") ★
      //- 游戏菜单
      div(v-for="(m, i) in menus"  v-if="menus.length < 2 && m.url !== 'help' " v-bind:class=" [ menus[0].url ] ")
        template(v-for="(g, ii) in m.groups")
          el-submenu(v-bind:index="g.url" v-if="g.items.length > 0" popper-class="game-menu" v-bind:ref="'subMenu'+(ii + 1)")
            .ds-button.full(style="display: none" v-bind:class="[ m.url + '-myicon' ]" v-bind:index="g.url") {{ m.title }}
            template(slot="title")
              i(:class="g.class")
              span{{ g.title }}
            el-menu-item-group(v-if="g.items.filter(function(x){return !x.removed})[0]")
                //- template(slot="title") {{ g.title }}
                el-menu-item.ds-button.full( v-for="(item, iii) in g.items" v-bind:index=" !item.fn ? '/' + m.url + '/' + item.id : '' "  v-bind:class="[ item.class, {'is-active': defaultUrl === ('/' + m.url + '/' + item.id), 'notis-active': defaultUrl !== ('/' + m.url + '/' + item.id)} ]" v-if="!item.removed && item.id && !item.hide" style="font-size: .12rem;")
                  span(@click=" item.fn && openTab(item) ") {{ item.title }}
                  //- span.SealTime {{item.gameid}}
                  span.SealTime(v-bind:class="{'timeRed': timefind(item).timeLast<11000}") {{ timefind(item).timeStr }}
                  span.fav(v-if="!favGameIds.includes(item.gameid)" @click="favAdd(item)") ☆
                  span.fav(v-if="favGameIds.includes(item.gameid)" @click="favDel(item)") ★
</template>

<script>
import util from '@/util'
import api from '@/http/api'
import $store from 'store'
export default {
  props: ['menus'],
  data () {
    return {
      favGameIds: [], // 收藏夹游戏id集合
      MYmenus: [],
      Timer: null, //奖期时间计时器
      curTime: '', //奖期当前时间
      curList: [], //奖期列表
      defaultUrl: '/me/2-1-1',
      defaultMenuItem: '',
      defaultSubMenus: ['SSC']
    }
  },
  methods: {
    //删除收藏夹
    favDel(row) {
      // console.log('del', row);
      this.MYmenus[0].groups.forEach(a => {
        if (a.url === 'fav') {
          a.items.forEach((b, bInx) => {
            b.gameid === row.gameid && (a.items.splice(bInx, 1))
          })
          this.favGameIds.splice(this.favGameIds.indexOf(row.gameid), 1);//当前收藏夹游戏ID合集
          $store.set('favGames', a.items);//存储本地
          this.$message.success(`已移除收藏夹!`);
          this.MYmenus.splice(0, 0);
        }
      });
    },
    //添加收藏夹
    favAdd(row) {
      // console.log('add', row);
      this.MYmenus[0].groups.forEach(a => {
        if (a.url === 'fav') {
          let rf = a.items.filter(b => { return b.gameid === row.gameid });
          if (!rf.length) {
            a.items.unshift(row);
            this.favGameIds.push(row.gameid);//当前收藏夹游戏ID合集
            $store.set('favGames', a.items);//存储本地
            this.$message.success(`已添加收藏夹!`);
          }
          this.MYmenus.splice(0, 0);
        }
      });
    },
    // 本地收藏数据初始化
    fav() {
      if (this.$props.menus.length < 2 && this.$props.menus[0].url === "game") {
        let arr = $store.get("favGames") || [];
        this.favGameIds = arr.map(a => {
          return a.gameid;
        }); //当前收藏夹游戏ID合集
        let r = {
          class: "ds-icon-game",
          hideIcon: false,
          id: 1,
          menuid: "2",
          removed: false,
          title: "彩票",
          url: "game",
          groups: [
            {
              title: "收藏夹",
              class: "icon-menu-fav",
              url: "fav",
              items: arr,
              removed: false
            }
          ]
        };
        this.MYmenus = [r];
      }
    },
    // 倒计时时间返回
    timefind(row) {
      let r = this.curList.find(a => {
        return a.timeStr && row.gameid === a.lotteryid;
      });
      return r && r.timeStr ? r : { timeStr: "", timeLast: "99999" };
    },
    // 多个彩种同时获取正在销售的奖期
    currentList() {
      if (this.$props.menus.length < 2 && this.$props.menus[0].url === "game") {
        let ids = [];
        this.$props.menus[0].groups.forEach(a => {
          a.items.forEach(b => {
            b.gameid && ids.push(b.gameid);
          });
        });
        // console.log(ids);
        this.$http
          .post(api.currentList, {
            gameid: ids.join(",")
          })
          .then(
            ({ data }) => {
              if (data.success === 1) {
                this.curTime = data.current;
                data.items.forEach(a => {
                  let time = a.saleend - this.curTime;
                  a["timeLast"] = time;
                  a["timeStr"] = util.timeFormat(parseInt(time / 1000));
                });
                this.curList = data.items;
                //-
                this.Timer && clearInterval(this.Timer);
                this.Timer = setInterval(() => {
                  this.curList.forEach(a => {
                    let time = a.saleend - this.curTime;
                    time <= 1000 && this.currentList(); // 多并发bug由 拦截器拦截
                    time < 0 && (time = 0);
                    a["timeLast"] = time;
                    a["timeStr"] = util.timeFormat(parseInt(time / 1000));
                  });
                  this.curTime += 1000;
                  this.MYmenus.splice(0, 0);
                  // console.log(JSON.stringify(this.curList[0]))
                }, 1000);
              }
            },
            rep => {
              // error
            }
          );
      }
    },
    handleopen () {
    },
    handleclose () {
    },
    openTab (item) {
      // let fn = (this.pages.find(p => p.id === id && p.fn) || {}).fn
      this.defaultUrl = ''
      if (item.fn) return this.__setCall({fn: '__openWindowWithPost', args: item.fn})
      this.$emit('open-tab', item)
    },
    getUrlNameByMenuId (menuId) {
      let name = ''
      this.menus.forEach((menu, i) => {
        menu.groups.forEach((group, j) => {
          group.items.forEach((item, k) => {
            if (menuId === item.id) {
              // 彩票
              if (menu.url === 'game') {
                name = group.url
              } else {
                // 非彩票
                name = menu.url || group.url || group.innerurl || item.url
              }
              return
            }
          })
        })
      })
      return name
    }
  },
  computed: {
  },
  watch: {
    menus () {
      // this.MYmenus = JSON.parse(JSON.stringify(this.$props.menus));
      // this.MYmenus = this.$props.menus;
      this.fav();
    },
    '$route' ({path}) {
      // this.MYmenus = this.$props.menus;
      let b = this.defaultUrl
      this.defaultUrl = path
      if (!this.$route.params.url) {
        return
      }
      setTimeout(() => {
        this.currentList();
        let url = this.getUrlNameByMenuId(this.$route.params.url)
        // console.log(url);
        this.defaultSubMenus = url ? [url] : this.defaultSubMenus
        // this.$refs.M && this.$refs.M.closeMenu && this.$refs.M.closeMenu(b.split('/')[1])
        // this.$refs.M && this.$refs.M.openMenu && this.$refs.M.openMenu(path.split('/')[1])
        // this.$forceUpdate()
      }, 300)
    }
  },
  mounted () {
    // console.log(this.$refs.M)
    // this.MYmenus = this.$props.menus;
  },
  beforeDestroy () {
  }
}
</script>

<style lang="stylus" scoped>

  .el-menu-item.ds-button.full
    background none
</style>

<style lang="stylus">
  .el-menu 
    .el-submenu[popper-class="game-menu"]
      .el-submenu__title
        height 46px
        line-height 46px
        background linear-gradient(to bottom, #5d5d5d, #525252, #484848)
        color #fff
        for n, i in ssc g115 k3 pk10 other kl fav
          .icon-menu-{n}
            width 28px
            height 24px
            display inline-block
            background url('../assets/icon-'+n+'.png') no-repeat
            background-size 100%
        .icon-menu-fav
            width 32px
            height 32px
            margin-left -5px
      .el-icon-arrow-down:before
        width 10px
        height 6px
        display inline-block
        content ''
        background url('../assets/icon_leftnav_down.png') no-repeat
        background-size 100%
</style>
<style lang="stylus">
// .chrome
//   .lefter.game .el-menu-item.ds-button
//     .SealTime
//       right 2.6em
//     .fav
//       right 1.4em
.lefter.game .el-menu-item.ds-button
  .SealTime
    position absolute
    right 2.6em
    &.timeRed
      color red
  .fav
    position absolute
    display none
    right 1.4em
  &:hover
    .fav
      display inline-block
</style>