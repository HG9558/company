// 团队盈亏-彩票
<template lang="jade">
  .group-page
    slot(name='cover')
    slot(name='movebar')
    slot(name='resize-x')
    slot(name='resize-y')
    slot(name='toolbar')
    .stock-list.scroll-content
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
          el-button(v-for='v in dateSub', :key='v.label', size='small', @click='stEt = v.val') {{v.label}}
        span.pl_5
          | 排序
          span.pl_5
          el-button(size='small', @click="ClickSort('betAmount')")
            | 投注
            template(v-if="orderBy=='betAmount'&&ascOrDesc==2") ↑
            template(v-if="orderBy=='betAmount'&&ascOrDesc==1") ↓
          el-button(size='small', @click="ClickSort('settleAmount')")
            | 总盈亏
            template(v-if="orderBy=='settleAmount'&&ascOrDesc==2") ↑
            template(v-if="orderBy=='settleAmount'&&ascOrDesc==1") ↓
          el-button(size='small', @click="ClickSort('gameSettleAmount')")
            | 游戏盈亏
            template(v-if="orderBy=='gameSettleAmount'&&ascOrDesc==2") ↑
            template(v-if="orderBy=='gameSettleAmount'&&ascOrDesc==1") ↓
        span.pl_5
          | 显示
          span.pl_5
          el-select(v-model='ot', placeholder='请选择')
            el-option(label='投注的', value='0')
            el-option(label='全部', value='1')
        span.pl_5
          | 团队
          el-autocomplete(v-model='name', :fetch-suggestions='UserSearch', placeholder='请输入用户名', style='width: 1.1rem;', @select='profitList', popper-class='autocompleteuser')
        span.pl_5
        .ds-button.primary.large.bold(@click='profitList()') 搜索
      div
        .table-list(style='padding: .15rem .2rem;')
          p(style='margin: 0 0 .15rem 0;')
            el-breadcrumb(separator='>')
              el-breadcrumb-item(v-for='(B, i) in BL', :key='B.userId', @click.native=' link(B, i) ') {{ i === 0 ? '自己' : B.userName }}
          //
            show-summary="show-summary"
            v-bind:summary-method="getSummaries"
          el-table.header-bold.nopadding(:data='data', style='; margin: 0;', ref='table', stripe='stripe', @cell-click='cellClick', v-bind:row-class-name='tableRowClassName', v-bind:max-height=' MH ', @sort-change='sortChange')
            el-table-column(class-name='pl2', prop='userName', label='用户名')
              template(scope='scope')
                span(:class=" { 'text-danger': scope.row.userName === me.account, 'pointer text-blue': scope.row.hasSub } ")
                  | {{ scope.row.userName }}
                  template(v-if='me.account==scope.row.userName') (我)
            el-table-column(prop='gameUserCount', :label="(Daily ? '日均' : '') +'游戏人数'", sortable='custom', align='center')
            el-table-column(prop='betAmount', label='投注', sortable='custom', align='center')
              template(scope='scope')
                span {{ scope.row.betAmount && scope.row.betAmount._nwc()}}
                // <span>{{ numberWithCommas(scope.row.betAmount) }}</span>
            el-table-column(prop='prizeAmount', label='派奖', sortable='custom', align='center')
              template(scope='scope')
                span {{ scope.row.prizeAmount && scope.row.prizeAmount._nwc()}}
            el-table-column(prop='gameSettleAmount', label='游戏盈亏', sortable='custom', align='center')
              template(scope='scope')
                span(:class=" {'text-green': scope.row.gameSettleAmount && scope.row.gameSettleAmount._o0(), 'text-danger': scope.row.gameSettleAmount && scope.row.gameSettleAmount._l0() } ") {{ scope.row.gameSettleAmount && scope.row.gameSettleAmount._nwc()}}
            el-table-column(prop='pointAmount', label='返点金额', sortable='custom', align='center', v-if='me.displayPermission.showpoint')
              template(scope='scope')
                span {{ scope.row.pointAmount && scope.row.pointAmount._nwc()}}
            el-table-column(prop='activityAmount', label='活动', sortable='custom', align='center')
              template(scope='scope')
                span {{ scope.row.activityAmount && scope.row.activityAmount._nwc()}}
            el-table-column(prop='salaryAmount', label='日工资', sortable='custom', align='center', v-if='me.displayPermission.showSalary')
              template(scope='scope')
                span {{ scope.row.salaryAmount && scope.row.salaryAmount._nwc()}}
            el-table-column(prop='settleAmount', label='总盈亏', sortable='custom', align='center')
              template(scope='scope')
                span(:class=" {'text-green': scope.row.settleAmount && scope.row.settleAmount._o0(), 'text-danger': scope.row.settleAmount && scope.row.settleAmount._l0() } ") {{ scope.row.settleAmount && scope.row.settleAmount._nwc()}}
            el-table-column(label='操作', align='center')
              template(scope='scope')
                // 最后一条合计 不显示操作按钮
                .ds-button.text-button.blue(v-show='Daily && scope.$index+1!=data.length', style='padding: 0 .05rem;', @click.stop='(showDetail = true) && profitDetail(undefined, undefined, scope.row.userId,scope.row)') 明细
          el-pagination(:total='total', v-bind:page-size='pageSize', layout='prev, pager, next, total', v-bind:page-sizes='[5, 10, 15, 20]', v-bind:current-page='currentPage', small='small', v-if=' total > pageSize ', v-on:current-change='pageChanged')
      stock(v-if=' I === 1 ')
      tstock(v-if=' I === 2 ')
    .modal(v-show='showDetail')
      .mask
      .box-wrapper
        .box(ref='box', style='width: 10rem; max-height: 9rem; height: 6.2rem;')
          .tool-bar
            span.title 明细
            el-button-group
              el-button.close(icon='close', @click="showDetail = ''")
          .table-list(style='padding: .15rem .2rem ;')
            .lotterymyinfo(:class="profitDetailROW && profitDetailROW.hasSub==0 ? 'my' : 'team'")
              | 明细-{{profitDetailROW && profitDetailROW.userName}}(
              | {{profitDetailROW && profitDetailROW.hasSub==0 ? '个人' : '团队'}}
              | )
            // v-bind:summary-method="getSummaries"
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
              el-table-column(align='right', prop='betAmount', label='投注')
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.betAmount) }}
              el-table-column(align='right', prop='prizeAmount', label='派奖')
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.prizeAmount) }}
              el-table-column(align='right', prop='gameSettleAmount', label='游戏盈亏')
                template(scope='scope')
                  span(:class=" {'text-green': scope.row.gameSettleAmount && scope.row.gameSettleAmount._o0(), 'text-danger': scope.row.gameSettleAmount && scope.row.gameSettleAmount._l0() } ") {{ numberWithCommas(scope.row.gameSettleAmount) }}
              // me.showBackWater ‰
              el-table-column(align='right', label='返点级别', v-if='profitDetailROW && profitDetailROW.hasSub==0 && me.displayPermission.showpoint')
                template(scope='scope')
                  span(v-if='numberWithCommas(cuserPoint)') {{ numberWithCommas(cuserPoint)}}%
                  span(v-if='!numberWithCommas(cuserPoint)') --
              // me.showBackWate
              el-table-column(align='right', prop='pointAmount', label='返点金额', v-if='me.displayPermission.showpoint')
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.pointAmount) }}
              el-table-column(align='right', prop='activityAmount', label='活动')
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.activityAmount) }}
              el-table-column(align='right', prop='salaryAmount', label='日工资', v-if='me.displayPermission.showSalary')
                template(scope='scope')
                  span {{ numberWithCommas(scope.row.salaryAmount) }}
              el-table-column(align='right', class-name=' pr2 ', prop='settleAmount', label='总盈亏', min-width='120')
                template(scope='scope')
                  span(:class=" {'text-green': scope.row.settleAmount && scope.row.settleAmount._o0(), 'text-danger': scope.row.settleAmount && scope.row.settleAmount._l0() } ") {{ scope.row.settleAmount &&scope.row.settleAmount._nwc() }}
            el-pagination(:total='ctotal', v-bind:page-size='pageSize', layout='prev, pager, next, total', v-bind:page-sizes='[5, 10, 15, 20]', v-bind:current-page='ccurrentPage', small='small', v-if=' ctotal > pageSize ', v-on:current-change='cpageChanged')

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
    profitlossdetail: resolve => require(["./ProfitLossDetail"], resolve),
    stock: resolve => require(["../group/Stock"], resolve),
    tstock: resolve => require(["../group/TStock"], resolve)
  },
  data() {
    return {
      bonusReleaseCycle: null, // 分红周期，-1:没有契约(显示半月)； 1:月；2:半月；3:周；
      cuserPoint: null,
      TH: 270,
      numberWithCommas,
      me: store.state.user,
      clearableOnTime: false,
      // stEt: [new Date()._setD(new Date().getDate() > 15 ? 16 : 1)._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
      stEt: [new Date(), new Date()], // 今天[2019-05-21 , 2019-05-21]
      tableTime: [new Date(), new Date()], //表格当前筛选时间
      profitDetailROW: null,
      // IssalaryAmount: !1, //个人详情报表中  是否有日工资
      data: [],
      pageSize: 20,
      total: 0,
      currentPage: 1,
      preOptions: {},
      BL: [{ title: "自己" }, {}],
      name: "",
      I: 0,
      cdata: [],
      ctotal: 0,
      ccurrentPage: 1,
      cpreOptions: {},
      ot: "0",
      orderBy: "betAmount",
      ascOrDesc: 1,
      totalJson: {},
      showDetail: "",
      dateSub: [] //日期 按钮组
    };
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
  },
  watch: {
    //时间范围
    // stEt() {
    //   this.profitList();
    // },
    // ot() {
    //   this.profitList();
    // },
    I() {
      if (this.I === 0) {
        setTimeout(this.profitList);
      }
    },
    // 分红周期，-1:没有契约； 1:月；2:半月；3:周；
    bonusReleaseCycle(val) {
      let r = [];
      // 前三个月包括本月
      if (val && val === 1) {
        r.push(
          {
            label: `${new Date().getMonth() + 1}月`,
            val: [
              new Date()._setD(1),
              new Date()
                ._setD(1)
                ._bfM(1)
                ._bf(-1)
            ]
          },
          {
            label: `${new Date().getMonth()}月`,
            val: [
              new Date()
                ._setD(1)
                ._bfM(-1),
              new Date()
                ._setD(1)
                ._bf(-1)
            ]
          },
          {
            label: `${new Date()
              ._setD(1)
              ._bfM(-1)
              .getMonth()}月`,
            val: [
              new Date()
                ._setD(1)
                ._bfM(-2),
              new Date()
                ._setD(1)
                ._bfM(-1)
                ._bf(-1)
            ]
          }
        );
      }
      // 前三个半月
      if ((val && val === 2) || val === -1) {
        //
        if (new Date().getDate() > 16) {
          r.push(
            {
              label: `${new Date().getMonth() + 1}月下半月`,
              val: [
                new Date()._setD(16),
                new Date()
                  ._setD(1)
                  ._bfM(1)
                  ._bf(-1)
              ]
            },
            {
              label: `${new Date().getMonth() + 1}月上半月`,
              val: [
                new Date()._setD(1),
                new Date()._setD(15)
              ]
            },
            {
              label: `${new Date().getMonth()}月下半月`,
              val: [
                new Date()
                  ._setD(16)
                  ._bfM(-1),
                new Date()
                  ._setD(1)
                  ._bf(-1)
              ]
            }
          );
        } else {
          r.push(
            {
              label: `${new Date().getMonth() + 1}月上半月`,
              val: [
                new Date()._setD(1),
                new Date()._setD(15)
              ]
            },
            {
              label: `${new Date().getMonth()}月下半月`,
              val: [
                new Date()
                  ._setD(16)
                  ._bfM(-1),
                new Date()
                  ._setD(1)
                  ._bf(-1)
              ]
            },
            {
              label: `${new Date().getMonth()}月上半月`,
              val: [
                new Date()
                  ._setD(1)
                  ._bfM(-1),
                new Date()
                  ._setD(15)
                  ._bfM(-1)
              ]
            }
          );
        }
      }
      this.dateSub = r;
    }
  },
  mounted() {
    // console.log($store)
    this.profitList();
  },
  methods: {
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
    //点击排序
    ClickSort(orderBy) {
      this.ascOrDesc = this.ascOrDesc === 2 ? 1 : 2;
      this.orderBy = orderBy;
      // this.profitList();
    },
    sortChange({ column, prop, order }) {
      this.ascOrDesc = order === "ascending" ? 2 : 1;
      this.orderBy = prop;
      this.profitList();
    },
    sm(a, b) {
      // console.log(a, b, "???");
      return a - b;
    },
    __setProfitLossI(I) {
      this.I = I;
    },
    // getSummaries(param) {
    //   const { columns } = param;
    //   const sums = [];
    //   columns.forEach((column, index) => {
    //     if (index === 0) {
    //       sums[index] = "合计";
    //       return;
    //     } else {
    //       sums[index] = numberWithCommas(this.totalJson[column.property]);
    //     }
    //   });
    //   return sums;
    // },
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
      if (column.property === "userName" && row.hasSub) {
        // this.BL.push({
        //   id: row.userId,
        //   title: row.userName
        // })
        this.name = row.userName;
        this.profitList(undefined, undefined, row.userId);
      }
    },
    link(B, i) {
      // if (i !== B.length - 1) {
      // this.BL = this.BL.slice(0, i + 1)
      // this.profitList()
      // }
      this.name = i === 0 ? "" : B.userName || "";
      this.profitList(undefined, undefined, B.userId);
    },
    // 盈亏报表列表
    // http://192.168.169.44:9901/cagamesclient/report/profit.do?method=list&startDay=20170101&endDay=20170301
    // profitList: api + 'report/profit.do?method=list',
    // api.getTeamProfit
    profitList(page, fn, id) {
      this.totalJson = {};
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
          beginDate: this.stEt[0]._toDayString(),
          endDate: this.stEt[1]._toDayString(),
          userId: id || this.BL[this.BL.length - 2].userId,
          // parentId: this.zone !== "" ? this.zone + 1 : "",
          username: this.name.replace(/(^\s*)|(\s*)$/g, ""),
          // orderType: this.S === '' ? '' : this.S + 1,
          // sort: this.btos === '' ? 2 : this.btos + 1,
          page: 1,
          pageSize: this.pageSize,
          listAll: this.ot,
          orderBy: this.orderBy || "",
          ascOrDesc: this.ascOrDesc || ""
        };
      } else {
        this.preOptions.page = page;
      }
      this.$http
        .myget(api.profitList, this.preOptions)
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.bonusReleaseCycle = data.bonusReleaseCycle;
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
                _.userName = _.userName === "团队合计：" ? "合计" : _.userName;
              });
              // if (data.items.filter(x => x.userName === "团队合计：")[0]) {
              //   this.totalJson = data.items.pop();
              // }
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
              // this.data = data.subUserProfit
              setTimeout(() => {
                loading.text = "加载成功!";
              }, 100);
              // this.summary()
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
    // http://192.168.169.44:9901/cagamesclient/report/profit.do?method=detail&destUserId=2&startDay=20170101&endDay=20170301
    // profitDetail: api + 'report/profit.do?method=detail',
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
          userId: id,
          page: 1,
          pageSize: this.pageSize,
          beginDate: this.stEt[0]._toDayString(),
          endDate: this.stEt[1]._toDayString()
        };
      } else {
        this.cpreOptions.page = page;
      }
      this.$http
        .myget(api.profitDetail, this.cpreOptions)
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.cdata = data.items;
              this.ctotal = data.totalSize || this.data.length;
              this.cuserPoint = data.userPoint;
              typeof fn === "function" && fn();
              !fn && (this.ccurrentPage = 1);
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
    tableRowClassName(row, index) {
      // if (this.me.account === row.userName) return 'text-danger'
      if (row.lst) return "lst-row lst-row-greybg";
    }
  }
};
</script>



<style lang="stylus" scoped>
@import '../../var.stylus';

.stock-list {
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
@import '../../var.stylus';

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
