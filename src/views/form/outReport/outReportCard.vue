// 团队盈亏-棋牌   gameType= 4
// 团队盈亏-微游   gameType= 8
<template lang="jade">
  .group-page
    slot(name='cover')
    slot(name='movebar')
    slot(name='resize-x')
    slot(name='resize-y')
    slot(name='toolbar')
    .stock-list.scroll-content
      div(v-if=' I === 0 ')
        .form.form-filters.my-el
          span
            | 时间&nbsp;&nbsp;
            // v-on:change="dateChange"
            // :picker-options="pickerOptions"
            el-date-picker(v-model='stEt', format='yyyy-MM-dd', type='daterange', placeholder='选择日期范围', v-bind:clearable='clearableOnTime' v-bind:picker-options="pickerOptions")
            | &nbsp;&nbsp;
            el-button(@click='ClickToday', size='small') 今天
            el-button(@click='ClickYesterday', size='small') 昨天
            el-button(@click='ClickBeforeYesterday', size='small') 前天
            el-button(@click='ClickMonth(0)', size='small') {{new Date()._setD(1)._bfM(0).getMonth() + 1}}月
            el-button(@click='ClickMonth(-1)', size='small') {{new Date()._setD(1)._bfM(-1).getMonth() + 1}}月
            el-button(@click='ClickMonth(-2)', size='small') {{new Date()._setD(1)._bfM(-2).getMonth() + 1}}月
          span.pl_5
            | 排序
            span.pl_5
            el-button(size='small', @click="ClickSort('realbuy')")
              | 投注
              template(v-if="orderBy=='realbuy'&&ascOrDesc==2") ↑
              template(v-if="orderBy=='realbuy'&&ascOrDesc==1") ↓
            el-button(size='small', @click="ClickSort('settle')")
              | 总盈亏
              template(v-if="orderBy=='settle'&&ascOrDesc==2") ↑
              template(v-if="orderBy=='settle'&&ascOrDesc==1") ↓
            el-button(size='small', @click="ClickSort('profit')")
              | 游戏盈亏
              template(v-if="orderBy=='profit'&&ascOrDesc==2") ↑
              template(v-if="orderBy=='profit'&&ascOrDesc==1") ↓
          span.item.pl_5
            | 显示
            span.pl_5
            el-select(v-model='ot', placeholder='请选择')
              el-option(label='投注的', value='0')
              el-option(label='全部', value='1')
          span.pl_5
            | 团队
            span.pl_5
            el-autocomplete(v-model='name', :fetch-suggestions='UserSearch', placeholder='请输入用户名', style='width: 1.1rem;', @select='profitList', popper-class='autocompleteuser')
          span.pl_5
          .ds-button.primary.large.bold(@click='profitList()') 搜索
        .table-list(style='padding: .15rem .2rem ;')
          p(style='margin: 0 0 .15rem 0;')
            el-breadcrumb(separator='>')
              el-breadcrumb-item(v-for='(B, i) in BL', @click.native=' link(B, i) ') {{ i === 0 ? '自己' : B.userName }}
          // v-bind:summary-method="getSummaries"
          el-table.header-bold.nopadding(:data='data', style='margin: 0;', ref='table', stripe='stripe', @cell-click='cellClick', v-bind:row-class-name='tableRowClassName', v-bind:max-height=' MH ', @sort-change='sortChange')
            el-table-column(class-name='pl2', prop='userName', label='用户名')
              template(scope='scope')
                span(:class=" { 'text-danger': scope.row.userName === me.account, 'pointer text-blue': scope.row.hasSub } ")
                  | {{ scope.row.userName }}
                  template(v-if='me.account==scope.row.userName') (我)
            el-table-column(prop='gameUserCount', :label="(Daily ? '日均' : '') +'游戏人数'", sortable='custom', align='center')
              template(scope='scope')
                span {{ scope.row.gameUserCount && scope.row.gameUserCount._nwc()}}
            el-table-column(prop='realBuy', label='投注', sortable='custom', align='center')
              template(scope='scope')
                span {{ scope.row.realBuy && scope.row.realBuy._nwc()}}
            el-table-column(align='right', prop='profit', label='游戏盈亏', sortable='custom')
              template(scope='scope')
                span(:class=" {'text-green': scope.row.profit && scope.row.profit._o0(), 'text-danger': scope.row.profit && scope.row.profit._l0() } ") {{ scope.row.profit && scope.row.profit._nwc()}}
            el-table-column(align='right', prop='getpoint', label='返水金额', sortable='custom', v-if="me.backWaters['groupId_'+$props.gameType]")
              template(scope='scope')
                span {{ scope.row.getpoint && scope.row.getpoint._nwc()}}
            el-table-column(align='right', prop='rewards', label='活动', sortable='custom')
              template(scope='scope')
                span {{ scope.row.rewards && scope.row.rewards._nwc()}}
            //- el-table-column(align='right', prop='platfee', label='平台费', sortable='custom')
            //-   template(scope='scope')
            //-     span {{ scope.row.platfee && scope.row.platfee._nwc()}}
            el-table-column(align='right', prop='settle', label='总盈亏', sortable='custom', class-name='pr2')
              template(scope='scope')
                span(:class=" {'text-green': scope.row.settle && scope.row.settle._o0(), 'text-danger': scope.row.settle && scope.row.settle._l0() } ") {{ scope.row.settle && scope.row.settle._nwc()}}
            el-table-column(prop='userpoint', label='操作', align='center')
              template(scope='scope')
                .ds-button.text-button.blue(v-show='scope.row.userId && Daily && scope.$index+1!=data.length', style='padding: 0 .05rem;', @click.stop='(showDetail = true) && profitDetail(undefined, undefined, scope.row.userId,scope.row)') 明细
          el-pagination(:total='total', v-bind:page-size='pageSize', layout='prev, pager, next, total', v-bind:page-sizes='[5, 10, 15, 20]', v-bind:current-page='currentPage', small='small', v-if=' total > pageSize ', v-on:current-change='pageChanged')
    .modal(v-show='showDetail')
      .mask
      .box-wrapper
        .box(ref='box', style='width: 10rem; max-height: 9rem; height: 6.2rem;')
          .tool-bar
            span.title 明细
            el-button-group
              el-button.close(icon='close', @click.native="showDetail = ''")
          .table-list(style='padding: .15rem .2rem ;')
            .lotterymyinfo(:class="profitDetailROW && profitDetailROW.hasSub==0 ? 'my' : 'team'")
              | 明细-{{profitDetailROW && profitDetailROW.userName}}(
              | {{profitDetailROW && profitDetailROW.hasSub==0 ? '个人' : '团队'}}
              | )
            el-table.header-bold.nopadding(:data='cdata', stripe='stripe', ref='itable', max-height='500', v-bind:row-class-name='tableRowClassName', style='margin: .2rem 0 0 0;')
              //
                <el-table-column class-name="pl2" prop="userName" label="用户名">
                <template scope="scope">
                <span
                class="pointer text-blue"
                :class=" { 'text-danger': scope.row.userName === me.account } "
                >{{ scope.row.userName }}</span>
                </template>
                </el-table-column>
              el-table-column(prop='date', label='日期', align='center')
                template(scope='scope')
                  span(v-if="scope.row.userName=='合计'") {{ scope.row.userName }}
                  span(v-if="scope.row.userName!='合计'") {{ scope.row.date }}
              el-table-column(align='right', prop='realBuy', label='投注')
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.realBuy) }}
              el-table-column(align='right', prop='profit', label='游戏盈亏')
                template(scope='scope')
                  span(:class=" {'text-green': scope.row.profit && scope.row.profit._o0(), 'text-danger': scope.row.profit && scope.row.profit._l0() } ") {{ numberWithCommas(scope.row.profit) }}
              // me.showBackWater ‰
              el-table-column(align='right', label='返水级别', v-if="profitDetailROW && profitDetailROW.hasSub==0 && me.backWaters['groupId_'+$props.gameType]")
                template(scope='scope')
                  span(v-if='numberWithCommas(cuserBackWater)') {{ numberWithCommas(Number(cuserBackWater))}}‰
                  span(v-if='!numberWithCommas(cuserBackWater)') --
              el-table-column(align='right', prop='getpoint', label='返水金额', v-if="me.backWaters['groupId_'+$props.gameType]")
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.getpoint) }}
              el-table-column(align='right', prop='rewards', label='活动')
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.rewards) }}
              //- el-table-column(align='right', prop='platfee', label='平台费', v-if='profitDetailROW && profitDetailROW.hasSub==1')
              //-   template(scope='scope')
              //-     span {{ numberWithCommas(scope.row.platfee) }}
              el-table-column(align='right', prop='settle', label='总盈亏', class-name='pr2')
                template(scope='scope')
                  span(:class=" {'text-green': scope.row.profit && scope.row.profit._o0(), 'text-danger': scope.row.profit && scope.row.profit._l0() } ") {{ numberWithCommas(scope.row.settle) }}
            //- el-pagination(:total='ctotal', v-bind:page-size='pageSize', layout='prev, pager, next, total', v-bind:page-sizes='[5, 10, 15, 20]', v-bind:current-page='ccurrentPage', small='small', v-if=' ctotal > pageSize ', v-on:current-change='cpageChanged')

</template>

<script>
import setTableMaxHeight from "@/components/setTableMaxHeight";
import { numberWithCommas } from "@/util/Number";
import dateOptions from '@/mixins/dateOptions'
import api from "@/http/api";
import store from "@/store";
const $store = require("store"); //localstorage封装方法
export default {
  mixins: [setTableMaxHeight, dateOptions],
  components: {
    // ProfitLossDetail: resolve => require(["../ProfitLossDetail"], resolve)
  },
  props: ["gameType"],
  data() {
    return {
      numberWithCommas,
      TH: 270,
      me: store.state.user,
      clearableOnTime: false,
      // stEt: [new Date()._setD(1)._setHMS("0:0:0"),new Date()._setD(1)._setHMS("0:0:0")._bfM(1)._setS(-1)],
      stEt: [new Date(), new Date()], // 今天[2019-05-21 , 2019-05-21]
      tableTime: [new Date(), new Date()], //表格当前筛选时间
      profitDetailROW: null,
      data: [],
      pageSize: 20,
      total: 0,
      currentPage: 1,
      preOptions: {},
      BL: [{ title: "自己" }, {}],
      // 平台
      PL: ["BG", "体育"],
      platid: "",
      ZONES: ["直接下级", "所有下级"],
      zone: "",
      name: "",
      SS: ["投注总额", "盈亏金额", "工资总额", "返点级别"],
      S: "",
      btos: "",
      cdata: [],
      cuserBackWater: null,
      ctotal: 0,
      ccurrentPage: 1,
      cpreOptions: {},
      showDetail: false,
      I: 0,
      ot: "0",
      orderBy: "",
      ascOrDesc: 1
    };
  },
  watch: {
    //时间范围
    // stEt() {
    //   this.profitList();
    // },
    // ot() {
    //   this.profitList();
    // },
    gameType() {
      this.profitList();
    }
  },
  computed: {
    //统计时间是否大于1天
    Daily() {
      //统计时间为1天时,为【游戏人数】，大于1天时为【日均游戏人数】
      return new Date(this.tableTime[1]).getTime() -
        new Date(this.tableTime[0]).getTime() >
        1000 * 60 * 60 * 24
        ? !0 //每天
        : !1; //时间范围是一天
    }
    //上个月
    //上上个月
  },
  mounted() {
    this.profitList();
  },
  methods: {
    // getSummaries(param) {
    //   const { columns } = param;
    //   const sums = [];
    //   columns.forEach((column, index) => {
    //     if (index === 0) {
    //       sums[index] = "总计";
    //       return;
    //     } else {
    //       sums[index] = numberWithCommas(this.totalJson[column.property]);
    //     }
    //   });
    //   return sums;
    // },
    //点击筛选 某月
    ClickMonth(multiple) {
      let r = [];
      r.push(
        new Date()
          ._setD(1)
          ._bfM(multiple)
      );
      r.push(
        new Date()
          ._setD(1)
          ._bfM(multiple + 1)
          ._setD(0)
      );
      r.push;
      // console.log(222, r);
      this.stEt = r;
    },
    //用户名搜索
    UserSearch(queryString, cb) {
      let list = [];
      let param = $store.get("SearchUserNameList") || {};
      if (!param[this.me.account]) {
        param[this.me.account] = []; //用户搜索有效列表
      }
      param[this.me.account].reverse().forEach((_, i) => {
        i < 5 && list.push({ value: _, label: _ }); //显示最后5条
      });
      let results = queryString
        ? list.filter(this.createFilter(queryString))
        : list;
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.indexOf(queryString.toLowerCase()) === 0;
      };
    },
    sortChange({ column, prop, order }) {
      this.ascOrDesc = order === "ascending" ? 2 : 1;
      prop = prop === "gameUserCount" ? prop : prop.toLowerCase(); //除 gameUserCount 外 其余的排序参数都要小写
      this.orderBy = prop;
      this.profitList();
    },
    //点击排序
    ClickSort(orderBy) {
      this.ascOrDesc = this.ascOrDesc === 2 ? 1 : 2;
      this.orderBy = orderBy;
      // this.profitList();
    },
    //点击 今天
    ClickToday() {
      this.stEt = [new Date(), new Date()];
    },
    //点击 昨天
    ClickYesterday() {
      this.stEt = [
        new Date()._bf(-1),
        new Date()._bf(-1)
      ];
    },
    //点击 前天
    ClickBeforeYesterday() {
      this.stEt = [
        new Date()._bf(-2),
        new Date()._bf(-2)
      ];
    },
    pageChanged(cp) {
      this.profitList(cp, () => {
        this.currentPage = cp;
      });
    },
    cpageChanged(cp) {
      this.profitDetail(cp, () => {
        this.ccurrentPage = cp;
      });
    },
    cellClick(row, column, cell, event) {
      if (column.property === "username") {
        this.profitList(undefined, undefined, row.userId);
      }
    },
    link(B, i) {
      this.profitList(undefined, undefined, B.userId);
    },
    // 盈亏报表列表
    profitList(page, fn, id) {
      let loading = this.$loading(
        {
          text: "加载中...",
          target: this.$refs["table"].$el
        },
        10000,
        "加载超时..."
      );
      if (!fn) {
        this.preOptions = {
          gameType: this.$props.gameType,
          username: this.name.replace(/(^\s*)|(\s*)$/g, ""),
          userId: id || this.BL[this.BL.length - 2].userId,
          scope: this.zone !== "" ? this.zone + 1 : "",
          page: 1,
          pageSize: this.pageSize,
          beginDate: this.stEt[0]._toDayString(),
          endDate: this.stEt[1]._toDayString(),
          listAll: this.ot,
          orderBy: this.orderBy || "",
          ascOrDesc: this.ascOrDesc || ""
        };
      } else {
        this.preOptions.page = page;
      }
      this.$http
        .myget(api.outerReport, this.preOptions)
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.tableTime = this.stEt; //当前表格筛选时间
              //记录当前用户搜索的有效用户名
              let param = $store.get("SearchUserNameList") || {};
              if (!param[this.me.account]) {
                param[this.me.account] = []; //用户搜索有效列表
              }
              if (
                data.items.length &&
                this.name &&
                this.name.replace(/(^\s*)|(\s*)$/g, "") !== this.me.account //搜索内容过滤前后空格
                // && param[this.me.account].indexOf(this.name) === -1 //过滤 重复
              ) {
                //去除 搜索 name 保留后4个不包含 name值
                let inx = param[this.me.account].indexOf(
                  this.name.replace(/(^\s*)|(\s*)$/g, "")
                );
                let r = [];
                if (inx > -1) {
                  param[this.me.account].splice(inx, 1);
                }
                r = param[this.me.account]
                  .reverse()
                  .slice(0, 4)
                  .reverse()
                  .concat([this.name.replace(/(^\s*)|(\s*)$/g, "")]);

                param[this.me.account] = r;
              }
              /**
               * 用户搜索有效列表 缓存格式
               * key SearchUserNameList
               * value {
               *    username:[username1,username2]
               * }
               */
              $store.set("SearchUserNameList", param);
              data.items.forEach(_ => {
                _.userName = _.userName === "团队合计" ? "合计" : _.userName;
              });
              this.data = data.items;
              this.BL = data.userBreads.concat([{}]);
              if (
                this.name &&
                !data.userBreads.find(_ => _.userName === this.name)
              ) {
                this.$modal.warn({
                  // target: VM.$el,
                  content: "该下级不存在",
                  btn: ["确定"],
                  close() {}
                });
              }
              this.total = data.totalSize || this.data.length;
              typeof fn === "function" && fn();
              !fn && (this.currentPage = 1);
              setTimeout(() => {
                loading.text = "加载成功!";
              }, 100);
            } else loading.text = "加载失败!";
          },
          rep => {
            // error
          }
        )
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 100);
        });
    },
    // 盈亏详情列表（按用户和时间范围查询）
    profitDetail(page, fn, id, row) {
      if (row) this.profitDetailROW = row;
      this.cdata = [];
      let loading = this.$loading(
        {
          text: "加载中...",
          target: this.$refs["itable"].$el
        },
        10000,
        "加载超时..."
      );
      if (!fn) {
        this.cpreOptions = {
          groupid: this.$props.gameType,
          gameType: this.$props.gameType,
          username: this.name,
          userId: id,
          scope: this.zone !== "" ? this.zone + 1 : "",
          page: 1,
          pageSize: this.pageSize,
          beginDate: this.stEt[0]._toDayString(),
          endDate: this.stEt[1]._toDayString()
        };
      } else {
        this.cpreOptions.page = page;
      }
      this.$http
        .get(api.outerReportDetail, this.cpreOptions)
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.cdata = data.items;
              this.ctotal = data.totalSize || this.data.length;
              this.cuserBackWater = data.userBackWater;
              typeof fn === "function" && fn();
              !fn && (this.currentPage = 1);
              setTimeout(() => {
                loading.text = "加载成功!";
              }, 100);
            } else loading.text = "加载失败!";
          },
          rep => {
            // error
          }
        )
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 100);
        });
    },
    tableRowClassName(row) {
      // if (this.me.account === row.userName) return 'text-danger'
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../../var.stylus';

.stock-list {
  // top TH
  .form {
    padding: PWX;
  }
}

.item {
  display: inline-block;
  margin: 0 PW 0.1rem 0;
}

.el-select, .el-input-number {
  width: 1rem;
}
</style>


<style lang="stylus" scoped>
@import '../../../var.stylus';

bg = #d8d8d8;
bg-hover = #ececec;
bg-active = #e2e2e2;

.tool-bar {
  height: TH;
  line-height: TH;
  background-color: bg;
  font-size: 0.12rem;
  border-top-right-radius: 0.05rem;
  border-top-left-radius: 0.05rem;
  overflow: hidden;
  background-position: 0.2rem center;
}

.title {
  color: #333;
  font-weight: bold;
  padding-left: 0.2rem;
}

.el-button-group {
  float: right;
  height: 100%;

  .el-button {
    font-size: 0.12rem;
    color: GREY;
    border: none;
    height: 100%;
    width: TH;
    padding: 0;
    background-color: transparent;

    &:hover {
      background-color: bg-hover;
    }

    &:active {
      background-color: bg-active;
    }

    &:first-child {
      font-size: 0.16rem;
    }

    &.close {
      &:hover {
        background-color: #f34;
        color: #fff;
      }

      &:active {
        color: #fff;
        background-color: #d40c1d;
      }
    }
  }
}

.modal {
  position: absolute;
  top: TH;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 9999;

  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 9998;
  }

  .box-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 9999;

    &:after {
      content: '';
      height: 100%;
      width: 0;
      vertical-align: middle;
      display: inline-block;
    }
  }

  .box {
    position: relative;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    background-color: #ededed;
    font-size: 0.12rem;
    width: 9rem;
    radius();
  }

  .content {
    margin: 0 0.2rem;

    .el-row {
      margin: PW 0;
      word-wrap: break-word;
    }

    .textarea-label {
      position: relative;
      margin: 0.3rem 0.3rem 0.3rem 0;

      .label {
        position: absolute;
        left: 0;
        top: 0.05rem;
      }

      .el-textarea {
        display: inline-bock;
        vertical-align: top;
        padding-left: 0.6rem;

        .textarea {
          font-size: 0.12rem;
        }
      }
    }
  }
}
</style>
<style lang="less">
.lotterymyinfo {
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  font-weight: bold;
}
.lotterymyinfo.team {
  background: #f37e0c;
}
.lotterymyinfo.my {
  background: #2d86ea;
}
.autocompleteuser {
  .el-autocomplete-suggestion__list::before {
    content: "近期搜索";
    display: block;
    padding: 0 10px;
  }
}
</style>
