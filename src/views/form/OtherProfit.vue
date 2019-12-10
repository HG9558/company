// 我的其它游戏分红 下级其它游戏分红
<template lang="jade">
  .group-page
    slot(name='cover')
    slot(name='movebar')
    slot(name='resize-x')
    slot(name='resize-y')
    slot(name='toolbar')
    .stock-list.scroll-content
      .form
        .form-filters.my-el(style='padding: .15rem; margin: .1rem 0 .2rem 0;')
          span
            | 结算日 
            el-button(v-for='v in settlementSub', :key='v', size='small', @click='settlement=v') {{v}}
          span
            | 状态 
            el-button(v-for='v in STATUS', :key='v.title', size='small', @click='s=v.id') {{v.title}}
          span(v-if='$props.typeCode === 1')
            | 用户名 
            input.ds-input.small(v-model='name', style='width: 1rem;')
          .ds-button.primary.large.bold(@click='bonus') 搜索
        el-table.header-bold.nopadding(:data='bonusList', ref='table', stripe='stripe', show-summary='show-summary', v-bind:summary-method='getSummaries1', v-bind:max-height=' MH ', v-bind:row-class-name='tableRowClassName')
          el-table-column(class-name='pl2', prop='userName', label='用户名')
            template(scope='scope')
              span(:class=" { 'text-danger': scope.row.userName === me.account, 'pointer text-blue': scope.row.hasSub } ")
                | {{ scope.row.userName }}
                template(v-if='me.account==scope.row.userName') (我)
          el-table-column(align='center', prop='issue', label='结算日期')
          el-table-column(align='center', prop='sendCycle', label='其它游戏分红周期', width='100')
            template(scope='scope')
              span {{ ProfitPeriodCount(scope.row) }}
          el-table-column(align='center', prop='sptProfit', label='体育')
            template(scope='scope')
              span {{ scope.row.sptProfit && scope.row.sptProfit._nwc()}}
          el-table-column(align='center', prop='vidProfit', label='真人')
            template(scope='scope')
              span {{ scope.row.vidProfit && scope.row.vidProfit._nwc()}}
          el-table-column(align='center', prop='egameProfit', label='老虎机')
            template(scope='scope')
              span {{ scope.row.egameProfit && scope.row.egameProfit._nwc()}}
          el-table-column(align='center', prop='esptProfit', label='电竞')
            template(scope='scope')
              span {{ scope.row.esptProfit &&scope.row.esptProfit._nwc()}}
          el-table-column(align='center', prop='fishProfit', label='捕鱼')
            template(scope='scope')
              span {{ scope.row.fishProfit &&scope.row.fishProfit._nwc()}}
          el-table-column(align='center', prop='cheProfit', label='棋牌')
            template(scope='scope')
              span {{ scope.row.cheProfit &&scope.row.cheProfit._nwc()}}
          el-table-column(align='center', prop='othltrProfit', label='基诺彩')
            template(scope='scope')
              span {{ scope.row.othltrProfit &&scope.row.othltrProfit._nwc()}}
          el-table-column(align='center', label='总盈亏')
            template(scope='scope')
              span(:class=" {'text-green': scope.row.totProfit && scope.row.totProfit._o0(), 'text-danger': scope.row.totProfit && scope.row.totProfit._l0() } ") {{ scope.row.totProfit &&scope.row.totProfit._nwc() }}
          el-table-column(align='center', prop='lastProft', label='上期结余')
            template(scope='scope')
              span {{ scope.row.lastProft &&scope.row.lastProft._nwc() }}
          el-table-column(align='center', prop='actUser', label='有效人数')
          el-table-column(align='center', prop='bonusRate', label='其它游戏分红比例', width='100')
            template(scope='scope')
              span {{ scope.row.bonusRate }}%
          el-table-column(align='center', prop='bonus', label='其它游戏分红金额', width='100')
            template(scope='scope')
              span
                | {{ scope.row.bonus && scope.row.bonus._o0() ? '+' : '' }}{{ scope.row.bonus &&scope.row.bonus._nwc() }}
          el-table-column(align='center', prop='status', label='状态')
            template(scope='scope')
              span(:class=' STATUS[scope.row.isDone].css ') {{ STATUS[scope.row.isDone].title }}
          el-table-column(prop='userpoint', label='操作', align='center')
            template(scope='scope')
              .ds-button.text-button.blue(v-if='!scope.row.lst', style='padding: 0 .05rem;', @click.stop='(showDetail1 = true) && qryCommDetail(scope.row.userId,scope.row.issue)') 详情
              .ds-button.text-button.blue(v-if='scope.row.isDone === 2 && $props.typeCode === 0', style='padding: 0 .05rem;', @click.stop='showComm(scope.row)') 确认
              .ds-button.text-button.blue(v-if='scope.row.isDone === 0 && $props.typeCode === 1', style='padding: 0 .05rem;', @click.stop='showComm(scope.row)') 发放
        el-pagination(:total='total', v-bind:page-size='pageSize', layout='prev, pager, next, total', v-bind:page-sizes='[5, 10, 15, 20]', v-bind:current-page='currentPage', small='small', v-if=' total > pageSize ', v-on:current-change='pageChanged')
    .modal(v-if='showDetail')
      .mask
      .box-wrapper
        .box(ref='box', style='max-width: 5rem; max-height: 9rem; height: 6.2rem;')
          .tool-bar
            span.title 其它游戏分红详情
            el-button-group
              el-button.close(icon='close', @click="showDetail = ''")
          profitsend(style='min-height: 5.7rem;')
    .modal(v-show='showDetail1')
      .mask
      .box-wrapper
        .box(ref='box', style='width: 10rem; max-height: 9rem; height: 6.2rem;')
          .tool-bar
            span.title 其它游戏分红详情
            el-button-group
              el-button.close(icon='close', @click="showDetail1 = ''")
          .table-list(style='padding: .15rem .2rem ;')
            el-table.header-bold.nopadding(:data='cdata', stripe='stripe', ref='itable', show-summary='show-summary', v-bind:summary-method='getSummaries', max-height='500', v-bind:row-class-name='tableRowClassName', style='margin: .2rem 0 0 0;')
              el-table-column(class-name='pl2', prop='userName', label='用户名')
                template(scope='scope')
                  span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === me.account } ") {{ scope.row.userName }}
              el-table-column(align='left', prop='issue', label='其它游戏分红期号')
              el-table-column(align='left', prop='gameName', label='游戏')
              el-table-column(align='left', prop='profitAmt', label='游戏盈亏')
                template(scope='scope')
                  span(:class=" {'text-green': scope.row.profitAmt && scope.row.profitAmt._o0(), 'text-danger': scope.row.profitAmt && scope.row.profitAmt._l0() } ") {{ scope.row.profitAmt &&scope.row.profitAmt._nwc() }}
              el-table-column(align='left', prop='pointAmt', label='返水总额')
                template(scope='scope')
                  span {{ scope.row.pointAmt &&scope.row.pointAmt._nwc() }}
              el-table-column(align='left', prop='rewards', label='活动费用')
                template(scope='scope')
                  span {{ scope.row.rewards &&scope.row.rewards._nwc() }}
              el-table-column(align='left', prop='platFee', label='平台费总额')
                template(scope='scope')
                  span {{ scope.row.platFee &&scope.row.platFee._nwc() }}
              el-table-column(align='left', prop='settle', label='总结算', class-name='pr2')
                template(scope='scope')
                  span(:class=" {'text-green': scope.row.settle && scope.row.settle._o0(), 'text-danger': scope.row.settle && scope.row.settle._l0() } ") {{ scope.row.settle &&scope.row.settle._nwc() }}

</template>

<script>
import setTableMaxHeight from "components/setTableMaxHeight";
import profitsend from "./profitSend";
import { numberWithCommas } from "../../util/Number";
import api from "../../http/api";
import store from "../../store";
import { dateFormat } from "../../util/Date";
export default {
  mixins: [setTableMaxHeight],
  components: {
    profitsend
  },
  props: ["typeCode"],
  data() {
    return {
      TH: 250,
      numberWithCommas: numberWithCommas,
      defaultStEt: ["", ""],
      stEt: [
        new Date()
          ._setHMS("0:0:0")
          ._bfM(-2)
          ._setD(1),
        new Date()
          ._setD(1)
          ._setHMS("0:0:0")
          ._bfM(1)
          ._setS(-1)
      ],
      me: store.state.user,
      // 0 我的其它游戏分红
      // 1 下级其它游戏分红
      // type: 0,
      // st: '',
      // et: '',
      // 分红状态
      STATUS: [
        { css: "text-danger", id: "0", title: "未发放", class: "waiting-pay" },
        { css: "text-green", id: "1", title: "已发放", class: "paid" },
        { css: "text-oblue", id: "2", title: "待确认", class: "wait" },
        { css: "text-oblue", id: "", title: "全部", class: "all" }
        // {id: 2, title: '已发放', class: 'paid'},
        // {id: 3, title: '平台外已发放', class: 'paid-out'}
      ],
      s: "",
      bonusList: [],
      topBonuList: [],
      topDetailList: [],
      pageSize: 20,
      // pageSize: 5,
      total: 0,
      currentPage: 1,
      preOptions: {},
      showDetail1: false,
      showDetail: false,
      name: "",
      I: 1,
      cdata: [],
      // groupId: 1,
      userId: 0,
      issue: "",
      commissionDetail: {},
      bonusSent: "", //@只需对分红金额进行总计
      settlementSub: [], //结算日 按钮组
      settlement: "", //当前结算日
      sendCycles: {
        //契约发放周期（1:月 2：半月 3：周）
        1: "月",
        2: "半月",
        3: "周"
      }
    };
  },
  computed: {},
  watch: {
    typeCode(n) {
      this.bonus();
    }
    // settlement() {
    //   this.bonus();
    // }
  },
  mounted() {
    this.settlementInit(); //结算日初始化
    this.bonus();
  },
  methods: {
    //分红周期计算
    //月       [开始时间]<15 && [结束时间] > 16
    //月上半月  [开始时间]<15 && [结束时间]<= 16
    //月下半月  [开始时间]>15
    //return '4月上半月'
    ProfitPeriodCount({ startDate, endDate }) {
      if (new Date(startDate).getDate() < 15) {
        if (new Date(endDate).getDate() > 16) {
          return `${new Date(startDate).getMonth() + 1}月`;
        } else {
          return `${new Date(endDate).getMonth() + 1}月上半月`;
        }
      } else {
        return `${new Date(startDate).getMonth() + 1}月下半月`;
      }
    },
    getSummaries1(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        } else if (column.label === "其它游戏分红金额") {
          sums[index] = this.bonusSent;
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    //结算日 init
    settlementInit() {
      //结算日按钮组
      //显示结算日为  前三个 1号 包含当天是1号
      let r = [
        new Date()._setD(1)._toDayString(),
        new Date()
          ._setD(1)
          ._bfM(-1)
          ._toDayString(),
        new Date()
          ._setD(1)
          ._bfM(-2)
          ._toDayString()
      ];
      // console.log(JSON.stringify(r));
      this.settlement = this.settlement || r[0]; //初始化 当前结算日
      this.settlementSub = r;
    },
    __setGOI(i) {
      this.I = i;
    },
    showComm(obj) {
      this.showDetail = true;
      this.commissionDetail = obj;
      // console.log('=====>', this.commissionDetail)
      window.localStorage.cdetail = JSON.stringify(obj);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item =>
          Number((item[column.property] + "").replace(/,/g, ""))
        );
        if (values.every(value => !isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2);
          sums[index] = sums[index]._nwc();
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    pageChanged(cp) {
      this.bonus(cp, () => {
        this.currentPage = cp;
      });
    },
    bonus(page, fn) {
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
          startDate: this.settlement, //当前结算日
          endDate: this.settlement, //当前结算日
          status: this.s,
          page: 1,
          pageSize: this.pageSize,
          userName: this.$props.typeCode === 1 ? this.name : "",
          groupId: 1
        };
      } else {
        this.preOptions.page = page;
      }
      this.$http
        .get(api.myBonusMobile, this.preOptions)
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              // 我的分红列表   下级分红
              this.bonusList =
                this.$props.typeCode === 0 ? data.my : data.myBonus;
              this.total = data.totalSize;
              this.bonusSent = data.bonus.sent; //@只需对分红金额进行总计

              typeof fn === "function" && fn();
              !fn && (this.currentPage = 1);
              setTimeout(() => {
                loading.text = "加载成功!";
              }, 100);
            }
            // else loading.text = '加载失败...!'
          },
          rep => {
            // error
            // this.$message.error('加载失败...！')
          }
        )
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 100);
        });
    },
    // 其它游戏分红详情列表（按用户和时间范围查询）
    // http://192.168.169.71:8080/cagamesclient/team/contractBonus.do?method=qryCommDetail&userId=7&issue=2018-07-01
    // profitDetail: api + 'report/profit.do?method=detail',
    qryCommDetail(userId, issue) {
      this.cdata = [];
      let loading = this.$loading(
        {
          text: "加载中...",
          target: this.$refs["itable"].$el
        },
        10000,
        "加载超时..."
      );
      this.$http
        .myget(api.qryCommDetail, {
          startDay: dateFormat(window.newDate(this.stEt[0]).getTime()).replace(
            /[-]/g,
            ""
          ),
          endDay: dateFormat(window.newDate(this.stEt[1]).getTime()).replace(
            /[-]/g,
            ""
          ),
          userId: userId,
          issue: issue
        })
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.cdata = data.data;
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
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../var.stylus';

.stock-list {
  // top TH
  .form {
    padding: 0 PWX;
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