// 我的分红  下级分红
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
          span
            .ds-button.primary.large.bold(@click='bonus') 搜索
        el-table.header-bold.nopadding(:data='bonusList', ref='table', stripe='stripe', show-summary='show-summary', v-bind:summary-method='getSummaries', v-bind:max-height=' MH ', v-bind:row-class-name='tableRowClassName')
          el-table-column(class-name='pl2', prop='userName', label='用户名')
            template(scope='scope')
              span(:class=" { 'text-danger': scope.row.userName === me.account, 'pointer text-blue': scope.row.hasSub } ")
                | {{ scope.row.userName }}
                template(v-if='me.account==scope.row.userName') (我)
          el-table-column(prop='issue', label='结算日期')
          el-table-column(label='分红周期')
            template(scope='scope')
              span {{ ProfitPeriodCount(scope.row) }}
          el-table-column(label='彩票总销量')
            template(scope='scope')
              span {{ numberWithCommas(scope.row.saleAmount) }}
          el-table-column(label='彩票总盈亏')
            template(scope='scope')
              span(:class=" {'text-green': scope.row.profitAmount && scope.row.profitAmount._o0(), 'text-danger': scope.row.profitAmount && scope.row.profitAmount._l0() } ") {{ scope.row.profitAmount &&scope.row.profitAmount._nwc() }}
          el-table-column(prop='actUser', label='有效人数')
          el-table-column(prop='rewards', label='活动费用')
            template(scope='scope')
              span {{ scope.row.rewards &&scope.row.rewards._nwc() }}
          el-table-column(prop='bonusRate', label='分红比例')
            template(scope='scope')
              span {{ scope.row.bonusRate }}%
          el-table-column(prop='bonus', label='分红金额')
            template(scope='scope')
              span
                | {{ scope.row.bonus && scope.row.bonus._o0() ? '+' : '' }}{{ scope.row.bonus._nwc() }}
          el-table-column(prop='status', label='状态')
            template(scope='scope')
              span(:class=' STATUS[scope.row.isDone].css ') {{ STATUS[scope.row.isDone].title }}
          el-table-column(prop='userpoint', label='操作', align='center')
            template(scope='scope')
              .ds-button.text-button.blue(style='padding: 0 .05rem;', @click.stop=' (showDetail = scope.row.id)') 查看详情
        el-pagination(:total='total', v-bind:page-size='pageSize', layout='prev, pager, next, total', v-bind:page-sizes='[5, 10, 15, 20]', v-bind:current-page='currentPage', small='small', v-if=' total > pageSize ', v-on:current-change='pageChanged')
    .modal(v-if='showDetail')
      .mask
      .box-wrapper
        .box(ref='box', style='max-width: 5rem; max-height: 9rem; height: 6.2rem;')
          .tool-bar
            span.title 分红详情
            el-button-group
              el-button.close(icon='close', @click="showDetail = ''")
          stockdetail(v-bind:id=' showDetail ', v-bind:myself=' !$props.typeCode ', v-bind:type="'qryBonusById'", style='min-height: 5.7rem;')

</template>

<script>
import setTableMaxHeight from "components/setTableMaxHeight";
import stockdetail from "./StockDetail";
import api from "../../http/api";
import store from "../../store";
import { dateFormat } from "../../util/Date";
import { numberWithCommas } from "../../util/Number";
export default {
  mixins: [setTableMaxHeight],
  components: {
    stockdetail
  },
  props: ["typeCode"],
  data() {
    return {
      numberWithCommas: numberWithCommas,
      TH: 250,
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
      // 0 我的分红
      // 1 下级分红
      // typeCode: 0,
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
      showDetail: false,
      name: "",
      settlementSub: [], //结算日 按钮组
      settlement: "", //当前结算日
      bonusSent: "", //@只需对分红金额进行总计
      groupId: 0
    };
  },
  computed: {},
  watch: {
    // //监听 当前结算日
    // settlement() {
    //   this.bonus();
    // },
    // //监听 状态
    // s() {
    //   this.bonus();
    // },
    typeCode(n) {
      this.bonus();
    }
  },
  mounted() {
    this.settlementInit(); //结算日初始化
    this.bonus();
  },
  methods: {
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        } else if (column.label === "分红金额") {
          sums[index] = this.bonusSent;
        } else {
          sums[index] = "";
        }
      });
      // 我的分红 接口数据异常暂时不暂时 合计
      return this.$props.typeCode === 1 ? sums : [];
    },
    //结算日 init
    settlementInit() {
      //结算日按钮组
      //显示结算日为  前三个 1号,16号 包含当天是1号,16号
      let r = [];
      if (new Date().getDate() >= 16) {
        r.push(new Date()._setD(16)._toDayString());
        r.push(new Date()._setD(1)._toDayString());
        r.push(
          new Date()
            ._setD(16)
            ._bfM(-1)
            ._toDayString()
        );
      }
      if (new Date().getDate() < 16) {
        r.push(new Date()._setD(1)._toDayString());
        r.push(
          new Date()
            ._setD(16)
            ._bfM(-1)
            ._toDayString()
        );
        r.push(
          new Date()
            ._setD(1)
            ._bfM(-1)
            ._toDayString()
        );
      }
      // console.log(JSON.stringify(r));
      this.settlement = this.settlement || r[0]; //初始化 当前结算日
      this.settlementSub = r;
    },
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
    pageChanged(cp) {
      this.bonus(cp, () => {
        this.currentPage = cp;
      });
    },
    expand(row, expanded) {
      // console.log(111, row);
      if (expanded && !row.topDetailList) {
        this.topBonuDetail(row);
      }
    },
    topBonuDetail(row) {
      // console.log(222, row);
      let loading = this.$loading(
        {
          text: "分红详情加载中...",
          target: this.$el
        },
        10000,
        "加载超时..."
      );
      this.$http
        .get(api.topBonuDetail, {
          issue: row.issue
        })
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.topDetailList = data.topDetailList;
              setTimeout(() => {
                loading.text = "加载成功!";
              }, 100);
            } else loading.text = "加载失败!";
          },
          rep => {
            // error
            this.$message.error("加载失败！");
          }
        )
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 100);
        });
    },
    // goContractDetail(id) {
    //   this.$router.push({
    //     path: "/group/3-3-4",
    //     query: { id: id }
    //   });
    // },
    // goStockDetail(id) {
    //   this.$router.push({
    //     path: "/group/3-3-2",
    //     query: { id: id, self: !this.$props.typeCode }
    //   });
    // },
    __bonus() {
      this.bonus();
    },
    bonus(page, fn) {
      let loading = this.$loading(
        {
          text: "分红加载中...",
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
          groupId: this.groupId
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
    }
    // 查询我的奖金
    // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=myBonus&startDate=20170101200000&endDate=20170115200000
    // 查询下级奖金
    // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=mySubContract&issue=20170301&sendType=1
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