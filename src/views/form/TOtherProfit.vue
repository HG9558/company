<template lang="jade">
  .group-page
    slot(name='cover')
    slot(name='movebar')
    slot(name='resize-x')
    slot(name='resize-y')
    slot(name='toolbar')
    .stock-list.scroll-content
      .form
        .form-filters(style='padding: .05rem; margin: .1rem 0;')
        el-table.header-bold.nopadding(:data='bonusList', ref='table', stripe='stripe', show-summary='show-summary', v-bind:summary-method='getSummaries1', v-bind:max-height=' MH ', v-bind:row-class-name='tableRowClassName')
          el-table-column(class-name='pl2', prop='userName', label='用户名')
            template(scope='scope')
              span
                | {{ scope.row.userName }}
                template(v-if='me.account==scope.row.userName') (队长)
          el-table-column(align='center', prop='startDate', label='预算开始时间')
          el-table-column(label='预算结束时间')
            template(scope='scope')
              span {{new Date()._toDayString()}}
          el-table-column(label='距离结算日')
            template(scope='scope')
              span {{DistanceSettlementDate(scope.row)}}
          el-table-column(align='center', label='总盈亏')
            template(scope='scope')
              span(:class=" {'text-green': scope.row.totProfit && scope.row.totProfit._o0(), 'text-danger': scope.row.totProfit && scope.row.totProfit._l0() } ") {{ scope.row.totProfit &&scope.row.totProfit._nwc() }}
          el-table-column(align='center', prop='actUser', label='有效人数')
          el-table-column(prop='ruleid', label='对应其它游戏分红规则')
            template(scope='scope')
              span(@click='ruleInfoList=!0,ruleInfoListRow=scope.row', style='cursor:pointer;') {{ GetRuleName(scope.row) }}
          el-table-column(align='center', prop='bonusRate', label='其它游戏分红比例')
            template(scope='scope')
              span {{ scope.row.bonusRate }}%
          el-table-column(align='center', prop='bonus', label='个人预期其它游戏分红金额')
            template(scope='scope')
              span(:class=" {'text-green': scope.row.bonus && scope.row.bonus._o0(), 'text-danger': scope.row.bonus && scope.row.bonus._l0() } ")
                | {{ scope.row.bonus && scope.row.bonus._o0() ? '+' : '' }}{{ scope.row.bonus &&scope.row.bonus._nwc() }}
        el-pagination(:total='total', v-bind:page-size='pageSize', layout='prev, pager, next, total', v-bind:page-sizes='[5, 10, 15, 20]', v-bind:current-page='currentPage', small='small', v-if=' total > pageSize ', v-on:current-change='pageChanged')
        p(style='margin: 10px;font-size: 12px;color: #999;') 温馨提示：预期其它游戏分红是基于阶段性数据测算得出，仅为预测下一次其它游戏分红发放提供参考，不作为发放其它游戏分红的依据。
      // 弹窗 规则列表
      .modal(v-if='ruleInfoList')
        .mask
        .box-wrapper
          .box(ref='box', style='max-width: 5rem;min-width: 3rem;  max-height: 6rem;')
            .tool-bar
              // <span class="title">分红详情</span>
              el-button-group
                el-button.close(icon='close', @click='ruleInfoList = 0')
            .ruleInfoLists
              ul
                li(v-for='(v, i) in ruleInfoListRow.bounsruleListBy', :class="{'on':v.id==ruleInfoListRow.ruleid}", :key='v.id')
                  | {{RULES[i]}}：累计{{TYPE[v.ruletype]}}{{v.sales}}万，有效人数>{{v.actuser}}，其它游戏分红比例{{v.bounsrate}}%
              .my-el.ruleInfoListSub
                el-button(size='small', @click='ruleInfoList = 0') 确定
      // 弹窗 ↑↑

</template>

<script>
import setTableMaxHeight from "components/setTableMaxHeight";
import api from "../../http/api";
import store from "../../store";
// import { dateFormat } from '../../util/Date'
import { numberWithCommas } from "../../util/Number";
export default {
  mixins: [setTableMaxHeight],
  components: {},
  data() {
    return {
      numberWithCommas: numberWithCommas,
      RULES: [
        "规则一",
        "规则二",
        "规则三",
        "规则四",
        "规则五",
        "规则六",
        "规则七",
        "规则八",
        "规则九",
        "规则十",
        "规则十一",
        "规则十二",
        "规则十三",
        "规则十四",
        "规则十五",
        "规则十六",
        "规则十七",
        "规则十八",
        "规则十九",
        "规则二十",
        "规则二十一",
        "规则二十二",
        "规则二十三",
        "规则二十四",
        "规则二十五",
        "规则二十六",
        "规则二十七",
        "规则二十八",
        "规则二十九",
        "规则三十"
      ],
      ruleInfoList: !1, //规则列表弹窗
      ruleInfoListRow: {},
      TH: 250,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
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
      type: 0,
      STATUS: [
        { css: "text-danger", id: "0", title: "未发放", class: "waiting-pay" },
        { css: "text-green", id: 1, title: "已发放", class: "paid" },
        { css: "text-oblue", id: 2, title: "待确认", class: "wait" }
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
      // groupId: 1,
      bonusSent: "" //@总计
    };
  },
  computed: {},
  watch: {
    type(n) {
      if (n) {
        this.stEt = [
          new Date()._setD(new Date().getDate() > 15 ? 16 : 1)._setHMS("0:0:0"),
          new Date()._setHMS("23:59:59")
        ];
      } else {
        this.stEt = [
          new Date()
            ._setHMS("0:0:0")
            ._bfM(-2)
            ._setD(1),
          new Date()
            ._setD(1)
            ._setHMS("0:0:0")
            ._bfM(1)
            ._setS(-1)
        ];
      }
      this.bonus();
    }
  },
  mounted() {
    this.bonus();
  },
  methods: {
    //根据规则列表 获取规则名
    GetRuleName({ bounsruleListBy, ruleid }) {
      let r = null;
      bounsruleListBy.forEach((v, i) => {
        if (v.id === ruleid) r = i;
      });
      return this.RULES[r];
    },
    getSummaries1(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "下级预期总其它游戏分红金额";
          return;
        } else if (column.label === "个人预期其它游戏分红金额") {
          sums[index] = this.bonusSent;
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    //距离结算日       结算日时间减去当前时间
    DistanceSettlementDate({ issue }) {
      return (
        (new Date(issue).getTime() -
          new Date(new Date()._toDayString()).getTime()) /
        1000 /
        60 /
        60 /
        24
      );
    },
    pageChanged(cp) {
      this.bonus(cp, () => {
        this.currentPage = cp;
      });
    },
    expand(row, expanded) {
      if (expanded && !row.topDetailList) {
        this.topBonuDetail(row);
      }
    },
    topBonuDetail(row) {
      let loading = this.$loading(
        {
          text: "详情加载中...",
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
    goContractDetail(id) {
      this.$router.push({
        path: "/group/3-3-4",
        query: { id: id }
      });
    },
    goStockDetail(id) {
      this.$router.push({
        path: "/group/3-3-2",
        query: { id: id, self: !this.type }
      });
    },
    __bonus() {
      this.bonus();
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
          startDate: new Date()._toDayString(), //当前日期
          endDate: new Date()._toDayString(), //当前日期
          page: 1,
          pageSize: this.pageSize,
          userName: this.type === 1 ? this.name : "",
          groupId: 1
        };
      } else {
        this.preOptions.page = page;
      }

      this.$http
        .get(api.mySubExpectedBounsMobile, this.preOptions)
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              //
              this.bonusList = data.my.concat(data.myBonus);
              this.total = data.totalSize;
              this.bonusSent = data.bonus.sent; //@只需对分红金额进行总计

              this.total = data.totalSize;

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
    // myExpectedBonus
    // mySubExpectedBouns
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
  vertical-align: top;
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