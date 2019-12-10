<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content

      // 用户列表
      .form.form-filters
        label.item 用户名
          input.ds-input.small(v-model="name" @keyup.enter="searNow")

        label.item 返点级别
          el-input(v-model="minPoint" style="width: .5rem")
          |  至
          el-input(v-model="maxPoint" style="width: .5rem")


        label.item 注册方式&nbsp;&nbsp;
          .ds-button.primary.mr_5(v-for=" (v, i) in RG " @click=" rg = rg !== v.id ? v.id : ''  " v-bind:class=" {cancel: rg !== v.id} ") {{ v.title }}


        span.ds-button.primary.large.bold(@click="searNow") 搜索

      .table-list(style="padding: .15rem .2rem ")
        p(style="margin: 0 0 .15rem 0" )
          .ds-button.primary.large.bold.inlb.mr_15.vm(@click.stop="addUserNow") 增加用户
          el-breadcrumb.inlb.vm(separator=">")
            el-breadcrumb-item(v-for="(B, i) in BL" @click.native=" link(B, i) " ) {{ i === 0 ? '我的用户' : B.userName }}

        el-table.header-bold.nopadding(ref="table" v-bind:data="data" v-bind:max-height=" MH "  @cell-click="cellClick" v-bind:row-class-name="tableRowClassName" stripe)

          // 用户名
          el-table-column(class-name="pl2" prop="userName"  label="用户名" min-width=" 100 ")
            template(scope="scope")
              div
                span.pointer.text-blue(:class=" { 'text-danger': scope.row.userId === id } ") {{ scope.row.userName }}
                span.text-danger(v-if=" scope.row.isFrozen  ") (已冻结)

          // 返点级别
          el-table-column(prop="userPoint"  label="返点级别")

          // 团队总数
          el-table-column(prop="teamCount"  label="团队总数" )

          // 日工资 ? if showSalary
          el-table-column(prop="daySalary"  label="日工资" v-if=" showSalary  ")

          el-table-column(prop="teamBalance"  label="主账户余额"  align="right")
              template(scope="scope")
                  span {{ numberWithCommas(scope.row.teamBalance) }}

          el-table-column(prop="speBalance"  label="特殊余额"  align="right")
              template(scope="scope")
                  span {{ numberWithCommas(scope.row.speBalance) }}


          el-table-column.pl1(class-name=" pl2"  prop="registerTime" label="注册时间" show-overflow-tooltip min-width="100" align="center")
            template(scope="scope")
              span(slot="reference") {{ scope.row.registerTime.split(' ')[0] }}
              //- el-popover(v-bind:popper-class=" 'table-popover' " trigger="hover" placement="top")
                slot
                  span {{ scope.row.registerTime }}

          el-table-column.pl1(prop="lastTime" label="最后登录时间" min-width="100" align="center")
            template(scope="scope")
              span {{ new Date(scope.row.lastTime)._toDayGapString() }}


          el-table-column(label="代充"  align="center")
            template(scope="scope")
              span {{ scope.row.uploadlevel !== "0" ? '开启' : '关闭' }}

          el-table-column.pl1(class-name=" pl1 " label="注册方式" )
            template(scope="scope")
              span {{ scope.row.isAuto ? '自动' : '手动' }}


          el-table-column(label="操作" width="300")
            template(scope="scope")
              .ds-button.text-button.blue(style="padding: 0 .05rem; vertical-align: top;" @click="getTeamBalance(scope.row)") 团队余额
                div(v-if="scope.row.showTeanBalance")
                 span.text-danger {{numberWithCommas(scope.row.myTeamBalance) }}

              .ds-button.text-button.blue(v-if=" canTopUp && (scope.row.userId !== id) "  style="padding: 0 .05rem" @click=" (stepType = 'topUp') && ++stepIndex && (user = scope.row) ") 给下级转账

              .ds-button.text-button.blue(v-if=" scope.row.isSub && (showback || showpoint)"  style="padding: 0 .05rem" @click=" (stepType = 'point') && ++stepIndex && (user = scope.row) && showAdjustInfo()  ") 调整返点/返水

              .ds-button.text-button.blue(style="padding: 0 .05rem" v-if=" showSalary && scope.row.isSub" @click.stop=" AS(scope.row) ") 调整工资

              .ds-button.text-button.blue(v-if=" scope.row.isSub  && showcpfh && me.role !== 1 " style="padding: 0 .05rem" @click=" contract(x => (stepType = 'contract') && ++stepIndex && (user = scope.row), '0')   ") 调整彩票分红
              .ds-button.text-button.blue(v-if=" scope.row.isSub  && showsfyj && me.role !== 1 " style="padding: 0 .05rem" @click=" contract(x => (stepType = 'bonus') && ++stepIndex && (user = scope.row), '1')   ") 调整其他分红

              .ds-button.text-button.blue(v-if=" scope.row.isSub && me.role !== 1 " style="padding: 0 .05rem" @click=" (stepType = 'copy') && ++stepIndex && (user = scope.row)  && getSubInfo()  ") 复制下级设置


              //- .ds-button.text-button.blue(style="padding: 0 .05rem" v-if=" me.showBackWater && scope.row.isSub" @click.stop=" ABW(scope.row) ") 调整返水



        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")


      .modal(v-show=" stepType " v-bind:class=" 'stepType_' + stepType ")
        .mask
        .box-wrapper
          .box(ref="box" style="width: 10rem; max-height: 9rem; min-height: 5rem;")
            .tool-bar
              span.title {{ stepTitle[stepType] }}
              el-button-group
                el-button.close(icon="close" @click=" (stepType = '') || (stepIndex = 0) || (topUpIndex = 0) ")

            // 充值
            div(key="1" v-if="stepIndex === 1 && stepType === 'topUp' ")

              p(style="padding-left: 30%; margin-top: 1.8rem" v-if="topUpIndex === 0")


                | 资金密码：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="cpwd" type="password" @keyup.enter="checkSecurityPwd")
                span(v-if=" me.safeCheck ")
                  br
                  br
                  label(v-if=" me.safeCheck && me.safeCheck !== 3" ) 安全验证码：
                      input.ds-input.large(v-model="safeCheckCode" @keyup.enter="checkNow")
                      button.ds-button.secondary.outline(style="margin-left: .1rem;" @click="me.safeCheck === 1 ? sendSms() :  sendMail()"  v-bind:class="{ disabled: me.safeCheck === 1 ? pt_: et_ }" v-bind:disabled="(me.safeCheck === 1 ? pt_ : et_) > 0")
                        span(v-if="!(me.safeCheck === 1 ? pt_ : et_ )") 发送验证码
                        span.text-black(v-if="(me.safeCheck === 1 ? pt_ : et_  )") {{ (me.safeCheck === 1 ? pt_ : et_ ) }}
                          span.text-999 秒后可重新发送

                  label(v-if="me.safeCheck === 3 " style="margin: .2rem 0") 信游安全码：
                      input.ds-input.large(v-model="safeCheckCode" @keyup.enter="checkNow")
                br
                span.ds-button.primary.large.bold(style="margin-left: .7rem; margin-top: .2rem; width: 2.2rem" @click="checkNow") 下一步


              div(v-if="topUpIndex === 1")

                p.title.text-black.hlh_120.t_c.ft16(style="background-color: #ededed;") 您正在给下级用户
                  span.text-blue {{ user.userName }}
                  |  进行充值

                .mg_0a.w_500.pd_30
                  | 代充来源：&nbsp;&nbsp;&nbsp;
                  .ds-radio-label(v-for=" (v, i) in moneyTypes " v-bind:class=" {active: i === mtype} " @click=" mtype = i " style="padding: 0; margin-right: .15rem")
                    .ds-radio
                    | {{ v }}

                  //- el-select(v-model=" mtype " style="width: 2.2rem; position: relative; top: -.01rem")
                    el-option(v-for=" (m, i) in moneyTypes " v-bind:label=" m " v-bind:value="i ")
                  br
                  br
                  | 可用余额：&nbsp;&nbsp;&nbsp;&nbsp;{{ mtype ? me.smoney : me.amoney }}
                  br
                  br
                  |充值金额：&nbsp;&nbsp;&nbsp;
                  el-input-number.large(style="width: 2.2rem" v-model="money" @keyup.enter.native=" checkTopup ")
                  span.text-money  {{ textMoney }}
                  span.text-999(v-if=" topUpMax || topUpMin ")  ({{ topUpMin }} - {{ topUpMax }}元)

                  <br>
                  span.ds-button.primary.large.bold(style="margin-left: .7rem; margin-top: .2rem; width: 2.2rem" @click=" checkTopup") 下一步

              p(style="padding-left: 30%; margin-top: 1.5rem" v-if="topUpIndex === 2") 充值金额：
                span.amount {{ money }}
                | 元
                span.text-money  {{ textMoney }}
                br
                span.ds-button.primary.large.bold(style="margin-left: .7rem; margin-top: .15rem; width: 2.2rem" @click="recharge") 确认

            div(key="2" v-if="stepIndex === 1 && stepType === 'salary' ")
              p.title.text-black.hlh_120.t_c.ft16(style="padding: .2rem 0 .2rem .2rem; background-color: #ededed;") 您正在给下级用户
                span.text-blue {{ user.userName }}
                |  调整工资级别

              p(style="padding-left: 30%; margin-top: .7rem")
                span.text-danger *
                日工资：&nbsp;&nbsp;
                el-select(v-model="o" style="width: 2.2rem; position: relative; top: -.01rem")
                  el-option(v-for="O in OL.filter(x => x.value >= user.daySalary) " v-bind:label="O.name" v-bind:value="O.value")

              p(style="padding-left: 30%; margin-top: .15rem")
                | 团队销量：
                el-input-number(v-model="teamSales" style="width: 1.7rem")
                |  万

              p(style="padding-left: 30%; margin-top: .15rem")
                | 有效用户：
                el-input-number(v-model="activityCount")
                |  人
                span.text-999（投注达到500为有效用户）
                br
                span.ds-button.primary.large.bold.w_140(style="margin-left: .2rem; margin-top: .15rem" @click="setSalary") 确认
                span.ds-button.cancel.large.bold.w_140(style="margin-left: .1rem; margin-top: .15rem" @click=" (stepType = '') || (stepIndex = 0) ") 取消

            // 升点、降点
            div(key="3" v-if="stepIndex === 1 && stepType === 'point' ")

              p.title.text-black.hlh_120.t_c.ft16(style="padding: .2rem 0 .2rem .2rem; background-color: #ededed;") 您正在给下级用户
                span.text-blue {{ user.userName }}
                |  调整返点/返水

              .mh_500.w_500.mg_0a.pd_50
                .mb_20(v-for=" (v, i) in  user.back" v-bind:key="i" v-if=" v.$s ")
                  span.text-danger.pd_5 *
                  span(v-if=" !v.groupName ") 彩票返点
                  span(v-else) {{ v.groupName  }}返水
                  el-select(v-model="v.$" clearable style="width: 1.7rem")
                    el-option(v-for=" (x, j) in v.$s " v-bind:label=" (x * 0.1).toFixed(1) " v-bind:value=" (x * 0.1).toFixed(1) " v-show=" (x*0.1 >= Number(v.$$)) ")

                  span(v-if=" !v.groupName ")
                    span.text-blue  %
                    span.c_03（百分符）
                  span(v-else)
                    span.text-blue  ‰
                    span.text-999（千分符）



                  span.text-black(v-if=" Number(v.$$) ")
                    span(v-if=" !v.groupName ") 当前返点：{{ v.$$ }}%
                    span(v-else) 当前返水： {{ v.$$ }}‰
                .buttons
                  .ds-button.primary.large(style="width: 2rem" @click="setPointAndBackWater") 确定
                  .ds-button.cancel.large(style="width: 2rem" @click=" (stepType = '') || (stepIndex = 0) ") 取消
            //- 调整分红
            div(key="4" v-if="stepIndex === 1 && stepType === 'contract' ")
              p.title.text-black.hlh_120.t_c.ft16(style="padding: .2rem 0 .2rem .2rem; background-color: #ededed;") 您正在给下级用户
                span.text-blue {{ user.userName }}
                |  调整彩票分红


              div(style="margin: 0 10% 0 15%; margin-top: .3rem; margin-bottom: .3rem; min-width: 6rem" v-bind:class="[ user.state ]")
                .item.block
                  span.text-danger *
                  | 契约时间：
                  el-date-picker(:picker-options="ApickerOptions" v-model="stEtA" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")

                p.item.block(style="display: block")
                   span.text-danger *
                   | 发放周期：
                   //- span 半月
                   el-select(v-model=" SV " style="width: .7rem" placeholder="无")
                      el-option(v-for="S in sendCycle" v-bind:label=" time[S - 1] " v-bind:value="S")


                p.item.block
                  span.text-danger *
                  | 发放方式：
                  label.text-black(style="padding: 0; margin-left: -.05rem ").ds-radio-label(@click=" sendType = 0 " v-bind:class=" { active: sendType === 0 } ")
                     span.ds-radio.white.
                     | 手动发放
                  label.text-black(style="padding: 0 .1rem").ds-radio-label(@click=" sendType = 1 " v-bind:class=" { active: sendType === 1 } ")
                    span.ds-radio.white.
                    | 自动发放
                    span.text-green  ( 推荐 )

                p.item.block(v-for=" (CR, i) in CRULES ")
                  span.text-danger {{ i===0? '*': '&nbsp;'}}
                  | {{ CR.title }} ：&nbsp;&nbsp;&nbsp;
                  span.text-black 累计
                  el-select(v-model="CR.ruletype" style="width: .7rem" placeholder="全")
                    el-option(v-for="R in TYPE" v-bind:label="R.title" v-bind:value="R.id")
                  | &nbsp;&nbsp;
                  el-input-number.text-danger.text-right(style="width: .8rem;" v-model="CR.sales")
                  span.text-black &nbsp;万，有效人数&nbsp;
                  el-input-number.text-danger.text-right(style="width: .6rem;" v-model="CR.actUser")
                  span.text-black  人，分红比例
                  //- el-input-number.text-danger.text-right(style="width: .6rem;" v-model="CR.bounsRate" v-bind:max="40")
                  el-select(v-model=" CR.bounsRate " style="width: .7rem" placeholder="全")
                    el-option(v-for="R in ruleCfg.filter(x => x.ruletype === CR.ruletype) " v-bind:label="R.bounsRate + '%' " v-bind:value="R.bounsRate")
                  span(v-if="CR.bounsRate") &nbsp;最低
                    span.text-blue  {{ ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate).sales }}
                    | 万，
                    span.text-blue  {{ ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate).actUser }}
                    | 人


                .buttons.item.block(style="padding-left: .55rem; display: block")
                  .ds-button.x-small.text-button.el-icon-plus.blue(@click=" ruleLength++ " v-if="ruleLength < 21")
                    span.text-black &nbsp;再加一行

                  .ds-button.x-small.text-button.el-icon-minus.blue(@click=" ruleLength-- " v-if="ruleLength > 3 ")
                    span.text-black &nbsp;减最后一行

                .buttons.item.block(style="padding-left: .6rem")
                  .ds-button.primary.bold(style="width: 2rem" @click="createContract") 确定
                  .ds-button.cancel.bold(style="width: 2rem" @click=" (stepType = '') || (stepIndex = 0) ") 取消
            //- 调整其它游戏分红
            div(key="5" v-if="stepIndex === 1 && stepType === 'bonus' ")
              p.title.text-black.hlh_120.t_c.ft16(style="padding: .2rem 0 .2rem .2rem; background-color: #ededed;") 您正在给下级用户
                span.text-blue {{ user.userName }}
                |  调整其它游戏分红


              div(style="margin: 0 10% 0 15%; margin-top: .3rem; margin-bottom: .3rem; min-width: 6rem" v-bind:class="[ user.state ]")
                .item.block
                  span.text-danger *
                  | 契约时间：
                  el-date-picker(:picker-options="ApickerOptions" v-model="stEtA" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")

                p.item.block(style="display: block")
                   span.text-danger *
                   | 发放周期：
                   //- span 半月
                   el-select(v-model=" SV " style="width: .7rem" placeholder="无")
                      el-option(v-for="S in sendCycle1" v-bind:label=" time[S - 1] " v-bind:value="S")

                p.item.block
                  span.text-danger *
                  | 发放方式：
                  label.text-black(style="padding: 0; margin-left: -.05rem ").ds-radio-label(@click=" sendType = 0 " v-bind:class=" { active: sendType === 0 } ")
                     span.ds-radio.white.
                     | 手动发放
                  label.text-black(style="padding: 0 .1rem").ds-radio-label(@click=" sendType = 1 " v-bind:class=" { active: sendType === 1 } ")
                    span.ds-radio.white.
                    | 自动发放
                    span.text-green  ( 推荐 )

                p.item.block(v-for=" (CR, i) in CRULES ")
                  span.text-danger {{ i===0? '*': '&nbsp;'}}
                  | {{ CR.title }} ：&nbsp;&nbsp;&nbsp;
                  span.text-black 累计
                  el-select(v-model="CR.ruletype" style="width: .7rem" placeholder="全")
                    el-option(v-for="R in TYPE" v-bind:label="R.title" v-bind:value="R.id")
                  | &nbsp;&nbsp;
                  el-input-number.text-danger.text-right(style="width: .8rem;" v-model="CR.sales")
                  span.text-black &nbsp;万，有效人数&nbsp;
                  el-input-number.text-danger.text-right(style="width: .6rem;" v-model="CR.actUser")
                  span.text-black  人，分红比例
                  //- el-input-number.text-danger.text-right(style="width: .6rem;" v-model="CR.bounsRate" v-bind:max="40")
                  el-select(v-model=" CR.bounsRate " style="width: .7rem" placeholder="全")
                    el-option(v-for="R in ruleCfg.filter(x => x.ruletype === CR.ruletype) " v-bind:label="R.bounsRate + '%' " v-bind:value="R.bounsRate")
                  span(v-if="CR.bounsRate") &nbsp;最低
                    span.text-blue  {{ ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate).sales }}
                    | 万，
                    span.text-blue  {{ ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate).actUser }}
                    | 人


                .buttons.item.block(style="padding-left: .55rem; display: block")
                  .ds-button.x-small.text-button.el-icon-plus.blue(@click=" ruleLength++ " v-if="ruleLength < 21")
                    span.text-black &nbsp;再加一行

                  .ds-button.x-small.text-button.el-icon-minus.blue(@click=" ruleLength-- " v-if="ruleLength > 3 ")
                    span.text-black &nbsp;减最后一行

                .buttons.item.block(style="padding-left: .6rem")
                  .ds-button.primary.bold(style="width: 2rem" @click="createContract") 确定
                  .ds-button.cancel.bold(style="width: 2rem" @click=" (stepType = '') || (stepIndex = 0) ") 取消

            div(key="6" v-if="stepIndex === 1 && stepType === 'copy' " ref="copy")
              .bgc-w.pd_15
                p 下级用户名：
                  span.text-blue {{ user.userName }}
                p.ft18.t_c.pb_15 第一步 选择复制内容
              .pd_15(v-if=" user.all ")
                .wp_15.h_450.inlb.relative(v-if=" user.all.subPointArr && user.all.subPointArr[0] ")
                  .absolute.hlh36.plr15
                    .ds-checkbox-label.text-bold(v-bind:class=" { active: rp } " @click=" rp = !rp ")
                      .ds-checkbox
                      | 返水/返点
                  .xcontent.pd_15
                    .hlh3(v-for=" (v, i)  in user.all.subPointArr " )
                      span 彩票返点：{{ (v.userpoint * 100).toFixed(1) }}%

                    .hlh3(v-for=" (v, i)  in user.all.backArr " )
                      span {{ v.groupname }}返水：{{ (v.backwater * 1000).toFixed(1) }}‰


                .wp_15.h_450.inlb.relative(v-if=" user.all.myDayArr && user.all.myDayArr[0] ")
                  .absolute.hlh36.plr15
                    .ds-checkbox-label.text-bold(v-bind:class=" { active: ds } " @click=" ds = !ds ")
                      .ds-checkbox
                      | 日工资
                  .xcontent.pd_15
                      .hlh3 团队销量>={{ user.all.myDayArr[0].teamsales }}万
                      .hlh3 有效人数>={{ user.all.myDayArr[0].activityuser }}
                      .hlh3 每1万{{ user.all.myDayArr[0].salary }}

                .wp_35.h_450.inlb.relative(v-if=" user.all.cpArr && user.all.cpArr[0] ")
                  .absolute.hlh36.plr15
                    .ds-checkbox-label.text-bold(v-bind:class=" { active: _contract } " @click=" _contract = !_contract ")
                      .ds-checkbox
                      | 彩票分红
                  .xcontent.pd_15
                    .hlh3 每{{ TIME[user.all.cpArr[0].sendcycle] }}，{{ STYPE[user.all.cpArr[0].sendtype] }}
                    .hlh3 {{ user.all.cpArr[0].begintm.split(' ')[0] }} 开始， {{ user.all.cpArr[0].expiretm.split(' ')[0] }} 结束
                    .hlh3(v-for=" (v, i) in  user.all.cpArr[0].myBounCpArr ") 规则{{ i + 1 }}： 累计{{ TYPE[v.ruletype].title }}>={{ v.sales / 10000 }}万，有效人数>={{ v.actuser }}，分红比例{{ parseInt(v.bounsrate * 100) }}%

                .wp_35.h_450.inlb.relative(v-if=" user.all.yjArr && user.all.yjArr[0] ")
                  .absolute.hlh36.plr15
                    .ds-checkbox-label.text-bold(v-bind:class=" { active: _bonus } " @click=" _bonus = !_bonus ")
                      .ds-checkbox
                      | 其它游戏分红
                  .xcontent.pd_15
                    .hlh3 每{{ TIME[user.all.yjArr[0].sendcycle] }}，{{ STYPE[user.all.yjArr[0].sendtype] }}
                    .hlh3 {{ user.all.yjArr[0].begintm.split(' ')[0] }} 开始， {{ user.all.yjArr[0].expiretm.split(' ')[0] }} 结束
                    .hlh3(v-for=" (v, i) in  user.all.yjArr[0].myBounYjArr ") 规则{{ i + 1 }}： 累计{{ TYPE[v.ruletype].title }}>={{ v.sales / 10000 }}万，有效人数>={{ v.actuser }}，分红比例{{ parseInt(v.bounsrate * 100) }}%

                .buttons.h_30.pt_15
                  .ds-button.primary.large.w_180.f_r(v-show=" rp || ds || _contract || _bonus " @click=" $refs.copy.scrollTop = 10000 ") 下一步

              .bgc-w.pd_20
                .h_5
                p.ft18.t_c 第二步 选择复制用户
              .pl_15.pt_15.pr_15
                div(style="overflow: hidden; height: 4.2rem")
                  .users.inlb.v_t.wp_20(v-if=" users.length > 0")
                    .hlh_30
                      el-autocomplete.inline-input.wp_100(v-model='un', v-bind:fetch-suggestions='querySearch', icon="search" placeholder='搜索用户')

                    ul.pd_0.mh_390.mg_0
                      li.hlh_40.pointer(v-for=" (v, i) in users_ " @click=" v.checked = !v.checked ")
                        span.inlb.w_50.t_c
                          .ds-checkbox.white(v-bind:class="  {active: v.checked} "  )
                        span {{ v.userName }}

                  .inlb.v_t.as.wp_80
                    .hlh_40
                      span 将复制的内容同步给以下用户
                      span.pd_5
                      .ds-button.outline(@click=" users_.forEach(x => (x.checked = false)) ") 清空
                      span.f_r {{ users_.filter(x => x.checked).length }} / {{ users_.length }}
                    .mh_350.pd_0.mg_0
                      .ds-button.outline.withclose(v-for=" (v, i) in users_.filter(x => x.checked) ") {{ v.userName }}
                        el-button.close(icon="close" @click=" v.checked = false ")


                .t_c.pd_10.bgc-w
                  .ds-button.success.large.w_180(@click="keepSame") 同步数据

                .t_c.pt_10.pl_10.pb_5(style="text-align: right")
                  .ds-button.primary.large.w_180(@click=" (stepType = '') || (stepIndex = 0) ") 完成
                  span.pd_5
                  .ds-button.cancel.large.w_180(@click=" $refs.copy.scrollTop = 0 ") 上一步


</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import { digitUppercase, numberWithCommas } from '../../util/Number'
  import store from '../../store'
  import xhr from 'components/xhr'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  export default {
    mixins: [xhr, setTableMaxHeight],
    data () {
      return {
        // 复制下级设置
        rp: true,
        ds: false,
        _contract: false,
        _bonus: false,
        STYPE: ['手动发放', '自动发放'],
        TIME: ['', '月', '半月', '周'],
        // 复制下级设置
        // 分红其它游戏分红
        stEtA: [new Date()._setHMS('0:0:0'), new Date()._bfY(10)._setHMS('23:59:59')],
        ApickerOptions: {
          shortcuts: [{
            text: '今起一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起六个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起一年',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        },
        time: ['月', '半月', '周'],
        sendCycle: [],
        sendCycle1: [1],
        SV: '',
        // 规则一：累计
        TYPE: [{id: 0, title: '销售'}, {id: 1, title: '亏损'}],
        r: {id: 0, title: '销售'},
        users: [],
        un: '',
        un_: '',
        // TYPE: [{id: 1, title: '亏损'}],
        // r: {id: 1, title: '亏损'},

        RULES: [
          {title: '规则一', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则三', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则四', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则五', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则六', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则七', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则八', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则九', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十一', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十二', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十三', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十四', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十五', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十六', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十七', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十八', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则十九', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十一', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十二', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十三', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十四', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十五', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十六', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十七', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十八', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则二十九', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0},
          {title: '规则三十', ruletype: 0, sales: 0, bounsRate: 0, actUser: 0}
        ],
        ruleLength: 3,
        cType: 0,
        ruleCfg: [],
        //
        numberWithCommas: numberWithCommas,
        TH: 300,
        showDaySalary: 0,
        // showSalary: 0,
        // me: store.state.user,
        me: store.state.user,
        id: '',
        myPoint: '',
        stepIndex: 0,
        stepTitle: {
          topUp: '下级充值',
          salary: '调整工资',
          point: '调整返点/返水',
          contract: '调整彩票分红',
          bonus: '调整其它游戏分红',
          copy: '复制下级设置'
        },
        // topUp, point
        stepType: '',
        topUpIndex: 0,
        pointType: 'up',
        name: '',
        minMoney: '',
        maxMoney: '',
        minPoint: '',
        maxPoint: '',
        // 日工资
        OL: [],
        o: '',
        // 中奖工资
        OOL: [],
        oo: '',
        rg: '',
        RG: [
          {id: 1, title: '自动'},
          {id: 2, title: '手动'}
        ],
        // 默认排序 返点级别，账户余额，注册时间，登录时间，日工资
        f: 2,
        Filters: [
          {id: 1, title: '返点级别'},
          {id: 2, title: '账户余额'},
          {id: 3, title: '注册时间'},
          {id: 4, title: '登录时间'}
          // {id: 5, title: '日工资'}
        ],
        // o: {},
        // // 用户级别
        // UL: [
        //   {id: 1, title: '代理用户'},
        //   {id: 2, title: '会员用户'}
        // ],
        // u: {},
        // 从大到小
        btos: 1,
        // 面包
        BL: [
          {title: '我的用户'},
          {}
        ],
        data: [],
        pageSize: 20,
        // pageSize: 10,
        total: 0,
        currentPage: 1,
        preOptions: {},
        // 下级
        user: { account: 'xxxx', name: 'xxxxx', point: 7.5 },
        cpwd: '',
        money: 0,

        // 调点
        PS: [],
        // 调点类型 1 2
        AT: 0,
        pointData: {
          up: [],
          down: []
        },
        range: {
          up: {},
          down: {}
        },
        point: '',
        threeDaysAmount: 0,
        sevenDaysAmount: 0,
        thirtyDaysAmount: 0,
        openUserData: [],
        isAddAccount: 0,
        // 给下级充值
        canTopUp: false,
        safeCheckCode: '',
        // checkSafeCodeUrl: ['', api.checkMailVerifyCode, api.checkSmsVerifyCode, api.checkGoogleAuth],
        checkSafeCodeUrl: ['', api.person_checkSmsVerifyCode, api.person_checkMailVerifyCode, api.checkGoogleAuth],
        topUpMax: '',
        topUpMin: '',
        moneyTypes: ['可用余额', '特殊金额'],
        mtype: 0,
        teamSales: 0,
        activityCount: 0,
        bwi: 0,
        bw: '',
        BWL: null,
        gogetUserList: false
      }
    },
    computed: {
      users_ () {
        return this.users.filter(x => x.userName.indexOf(this.un) !== -1 && x.userId !== this.user.userId)
      },
      user_ () {
        return this.users.filter(x => x.userName === this.un_)[0] || {}
      },
      // 最近搜索
      rs () {
        return this.local.search_un.split(',').filter(x => x.indexOf(this.un) !== -1)
      },
      hasBonus () {
        return this.$root
      },
      CRULES () {
        return this.RULES.slice(0, this.ruleLength)
      },
      dataRules () {
        return this.CRULES.filter(c => c.sales >= 0 && c.bounsRate > 0).map(n => {
          return {
            ruletype: n.ruletype,
            sales: n.sales,
            bounsRate: n.bounsRate,
            actUser: n.actUser
          }
        })
      },
      hasRepeat () {
        return this.dataRules.reduce((p, m, i) => {
          let M = Object.assign({}, m)
          delete M.bounsRate
          if (p[JSON.stringify(M)]) {
            p.flag = true
          } else {
            p[JSON.stringify(M)] = true
          }
          return p
        }, {}).flag
      },
      SetRule() {
        if (this.dataRules.length) {
          let r = [];
          // 0 销售 1 亏损
          let ruletype0 = null;
          let ruletype1 = null;
          this.dataRules.forEach((_, i) => {
            // 销售
            if (_.ruletype === 0) {
              // 分红比例
              if (ruletype0 && _.bounsRate <= ruletype0.bounsRate) {
                r.push(this.RULES[i]);
              }
              ruletype0 = _;
            }
            // 亏损
            if (_.ruletype === 1) {
              // 分红比例
              if (ruletype1 && _.bounsRate <= ruletype1.bounsRate) {
                r.push(this.RULES[i]);
              }
              ruletype1 = _;
            }
          });
          return r;
        } else {
          return [];
        }
      },
      textMoney () {
        return digitUppercase(this.money)
      },
      CBW () {
        return this.user.backWaterComb ? this.user.backWaterComb[this.bwi] : undefined
      },
      showSalary () {
        return this.me.displayPermission.showSalary === 1
      },
      showback () {
        return this.me.displayPermission.showback === 1
      },
      showpoint () {
        return this.me.displayPermission.showpoint === 1
      },
      showcpfh () {
        return this.me.displayPermission.showCpfh === 1
      },
      showsfyj () {
        return this.me.displayPermission.showSfyj === 1
      }
      // BWL () {
      //   if (this.CBW && this.CBW.maxBackWater) {
      //     let A = []
      //     let Max = this.CBW.maxBackWater * 1000
      //     let Min = this.CBW.minBackWater * 1000
      //     for (let i = Min; i <= Max; i += 0.1) {
      //       i = Number(i.toFixed(1))
      //       A.push(i)
      //     }
      //     return A
      //   } else {
      //     return []
      //   }
      // }
    },
    watch: {
      //监听 规则设置
      SetRule() {
        // console.log(this.SetRule);
        this.SetRule.length &&
          this.$modal.warn({
            target: this.$el,
            content: `${
              this.SetRule[0].title
            } 不符合契约规则:规则中分红比例"都必须成递增关系("分红比例"大于上一条规则的"分红比例")．`,
            btn: ["好的"]
          });
      },
      un () {
        this.un = this.un.trim()
      },
      user_ (n) {
        if (this.un) {
          this.__setLocal({search_un: this.un + ',' + this.local.search_un.replace(this.un + ',', '')})
        }
      },
      stepType (n) {
        if (n === 'bonus') {
          this.TYPE = [{id: 1, title: '亏损'}]
          this.r = {id: 1, title: '亏损'}
          this.time = ['月']
          this.cType = 1
          this.RULES.forEach(x => (x.ruletype = 1))
          this.SV = ''
          // this.contract()
        }
        if (n === 'contract') {
          this.TYPE = [{id: 0, title: '销售'}, {id: 1, title: '亏损'}]
          this.r = {id: 0, title: '销售'}
          this.time = ['月', '半月', '周']
          this.cType = 0
          this.RULES.forEach(x => (x.ruletype = 0))
          this.SV = ''
          // this.contract()
        }
        if (n === 'copy') {
          this._getUserList()
        }
        // if (!n) {
        //   let B = this.BL[this.BL.length - 2]
        //   this.getUserList(B.userId)
        // }
      },
      hasRepeat () {
        this.hasRepeat && this.$modal.warn({
          target: this.$el,
          content: '请不要输入相同相似的规则!',
          btn: ['好的']
        })
      },
      // stEt: {
      //   deep: true,
      //   handler () {
      //     if (!this.stEt) this.stEt = this.defaultStEt
      //     if (this.stEt[0] && this.stEt[1] && (window.newDate(this.stEt[0])).getTime() === (window.newDate(this.stEt[1])).getTime()) {
      //       this.stEt[1] = dateTimeFormat((window.newDate(this.stEt[1])).getTime() + 3600 * 1000 * 24 - 1000)
      //     }
      //   }
      // },
      CRULES: {
        deep: true,
        handler () {
          this.CRULES.forEach(CR => {
            setTimeout(() => {
              CR.actUser = parseInt(CR.actUser) || 0
              CR.sales = parseInt(CR.sales) || 0
            }, 0)
            let rule = this.ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate)
            if (!rule) return
            let sales = rule.sales
            let actUser = rule.actUser
            setTimeout(() => {
              if (CR.actUser < actUser) CR.actUser = actUser || 0
              if (CR.sales < sales) CR.sales = sales || 0
            }, 0)
            // if (CR.actUser < actUser) CR.actUser = actUser
            // if (CR.sales < sales) CR.sales = sales
          })
        }
      },
      CBW () {
        if (this.CBW) this.bw = this.CBW.backWater !== undefined ? Number((this.CBW.backWater * 1000).toFixed(1)) : ''
        else this.bw = ''
        setTimeout(() => {
          if (this.CBW && this.CBW.maxBackWater) {
            let A = []
            let Max = this.CBW.maxBackWater * 1000
            let Min = this.CBW.minBackWater * 1000
            for (let i = Min; i <= Max; i += 0.1) {
              i = Number(i.toFixed(1))
              A.push(i)
            }
            this.BWL = A
          } else {
            this.BWL = []
          }
        }, 0)
      },
      stepIndex () {
        if (this.stepIndex === 0) {
          if (this.gogetUserList) this.getUserList()
          this.gogetUserList = false
          this.cpwd = ''
          this.safeCheckCode = ''
          this.money = ''
          this.teamSales = ''
          this.activityCount = ''
          this.un = ''
          this.RULES.forEach(x => {
            x.sales = ''
            x.actUser = ''
            x.bounsRate = ''
          })
          this.ruleLength = 3
        }
      },
      point () {
        setTimeout(() => {
          this.point = this.point.trim()
          this.point = this.point.replace(/[^0-9,.]/g, '').replace(/[,.]{2,}/g, ',')
          let [l, r, t] = this.point.split('.')
          if (r) this.point = l + '.' + r.slice(0, 1)
          if ((r && r.split(/[,]/)[1]) || t) this.point = l + '.' + r.split(/[.,]/)[0].slice(0, 1)
        }, 0)
      },
      teamSales () {
        setTimeout(() => {
          this.teamSales = parseInt(this.teamSales)
        }, 0)
      },
      activityCount () {
        setTimeout(() => {
          this.activityCount = parseInt(this.activityCount)
        }, 0)
      }
    },
    mounted () {
      this.getUserList()
      this.getSysContractRange()
    },
    methods: {
      keepSame () {
        let ids = this.users_.filter(x => x.checked).map(y => y.userId)
        if (!ids[0]) return
        ids = ids.join(',')
        let cids = []
        if (this.rp) cids.push('1')
        if (this.ds) cids.push('2')
        if (this._contract) cids.push('3')
        if (this._bonus) cids.push('4')
        if (!cids[0]) return
        cids = cids.join(',')
        this.$http.get(api.getUserSubCopy, {
          subUserid: this.user.userId,
          useridArr: ids,
          settingArr: cids
        }).then(({data}) => {
          if (data.success === 1) {
            this.$modal.success({
              content: data.msg || '同步成功',
              btn: []
            })
            this.gogetUserList = true
          }
        })
      },
      querySearch (q, cb) {
        cb(this.local.search_un ? this.local.search_un.split(',').filter(x => x.indexOf(q.trim()) !== -1).map(y => ({ value: y })) : [])
      },
      _getUserList () {
        this.$http.post(api.getUserList, {
          userId: '',
          userName: '',
          minPoint: '',
          maxPoint: '',
          cType: '',
          sortType: 3,
          sort: 2,
          page: 1,
          pageSize: 1000,
          subType: 1
        }).then(({data}) => {
          if (data.success === 1) {
            this.users = data.subUserInfo
          }
        }, (rep) => {
        }).finally(() => {
        })
      },
      getSubInfo () {
        if (this.user.all) return
        this.$http.get(api.getUserAll, {subUserid: this.user.userId}).then(({data}) => {
          if (data.success === 1) {
            delete data.success
            this.$set(this.user, 'all', data)
          } else {
            return this.$message.warning({target: this.$el, message: data.msg || '获取用户信息失败'})
          }
        })
      },
      contract (fn, cType) {
        this.$http.get(api.rconfig, {
          cType: cType || this.cType
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.ruleCfg = data.ruleCfg || []
            fn && fn()
          }
        }, (rep) => {
        })
      },
      createContract () {
        // let data = this.CRULES.slice()
        // data.forEach(c => {
        //   c.bounsRate /= 100
        //   delete c.title
        // })
        if (!this.stEtA[0] || !this.stEtA[1]) {
          return this.$message.warning({target: this.$el, message: '请选择契约时间！'})
        }
        if (!this.SV) {
          return this.$message.warning({target: this.$el, message: '请选择发放周期！'})
        }
        if (!this.dataRules[0]) {
          return this.$message.warning({target: this.$el, message: '请至少设置一条契约规则！'})
        }
        if (this.hasRepeat) {
          return this.$modal.warn({
            target: this.$el,
            content: '请不要输入完全相同的规则!',
            btn: ['好的']
          })
        }
        this.$http.post(api.createContract, {
          beginTm: dateTimeFormat((window.newDate(this.stEtA[0])).getTime()).replace(/[\s:-]*/g, ''),
          expireTm: dateTimeFormat((window.newDate(this.stEtA[1])).getTime()).replace(/[\s:-]*/g, ''),
          userId: this.user.userId,
          sendType: this.sendType,
          sendCycle: parseInt(this.SV),
          cType: this.cType,
          // sendCycle: 2,
          // sharecycle: this.AT,
          // bonusRuleList: JSON.stringify(data)
          bonusRuleList: JSON.stringify(this.dataRules)
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.$modal.success({
              content: '契约发送成功！',
              btn: ['确定'],
              target: this.$el,
              close () {
                this.stepType = ''
                this.stepIndex = 0
              },
              O: this
            })
          } else this.$message.error(data.msg || '契约创建失败！')
        }, (rep) => {
          // error
          this.$message.error('契约创建失败！')
        })
      },
      getSysContractRange () {
        this.$http.get(api.getSysContractRange).then(({data}) => {
          // success
          if (data.success === 1) {
            this.sendCycle = data.sendCycle.split(',')
          }
        }, (rep) => {
          // error
        })
      },
      AS (row) {
        this.stepType = 'salary'
        this.stepIndex++
        this.user = row
        this.o = row.daySalary
        this.oo = row.winSalary
        this.teamSales = row.teamSales
        this.activityCount = row.actUser
        // (stepType = 'salary') && ++stepIndex && (user = scope.row) && ((o = scope.row.daySalary) || ( oo = scope.row.winSalary ))
      },
      ABW (row) {
        this.stepType = 'rebate'
        this.stepIndex++
        this.user = row
        this.o = row.daySalary
        this.oo = row.winSalary
        this.teamSales = row.teamSales
        this.activityCount = row.actUser
        this.getBackWater(row)
        // (stepType = 'salary') && ++stepIndex && (user = scope.row) && ((o = scope.row.daySalary) || ( oo = scope.row.winSalary ))
      },
      getBackWater (row) {
        this.$http.get(api.getBackWater, {
          userId: row.userId
        }).then(({data: {success, backWaterComb}}) => {
          if (success === 1) {
            backWaterComb.forEach((x, i) => {
              x.$$ = x.$ = x.backWater ? (x.backWater * 1000).toFixed(1) : ''
              x.$s = Math.ceil(x.maxBackWater * 10000)
            })
            row.back = row.back.slice(0, 1).concat(backWaterComb)
          }
        })
      },
      setBackWater ({backWater, groupId, groupName}) {
        this.$http.myget(api.setBackWater, {
          userId: this.user.userId,
          backWater: backWater / 1000,
          groupId: groupId
        }).then(({data: {success}}) => {
          if (success === 1) {
            this.$message.success({target: this.$el, message: '调整' + groupName + '返水成功'})
            this.user.back.find(x => x.groupId === groupId).$$ = backWater
          }
        })
      },
      setPointAndBackWater () {
        this.adjustPoint((this.user.back[0].$ - this.user.back[0].$$).toFixed(1))
        this.user.back.slice(1).forEach(x => {
          if (!x.$ || Number(x.$) === Number(x.$$)) return
          this.setBackWater({
            backWater: x.$,
            groupId: x.groupId,
            groupName: x.groupName
          })
        })
      },
      // 设置日工资：
      setSalary () {
        // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=recharge&destId=5&amount=100.5
        let loading = this.$loading({
          text: '工资调整中...',
          target: this.$el
        }, 10000, '工资调整超时...')
        this.$http.post(api.setSalary, {
          userId: this.user.userId,
          salary: this.o,
          activityCount: this.activityCount,
          teamSale: this.teamSales
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '工资调整成功!'
              this.stepIndex = 0
              this.stepType = ''
              this.getUserList()
              // this.subSalaryList()
            }, 100)
          } else loading.text = data.msg || '工资调整失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      pageChanged (cp) {
        this.getUserList('', cp, () => {
          this.currentPage = cp
        })
      },
      tableRowClassName (row) {
        if (this.id === row.userId) return 'text-danger'
      },
      checkTopup () {
        if ((this.money <= (this.mtype ? this.me.smoney : this.me.amoney)) && (this.topUpMax || this.topUpMin) && (this.money <= this.topUpMax && this.money >= this.topUpMin) || !(this.topUpMax || this.topUpMin)) {
          this.topUpIndex++
        } else {
          this.$message.warning({target: this.$el, message: '您输入的金额过小或过大！'})
        }
      },
      getTeamBalance (row) {
        row.showTeanBalance = !row.showTeanBalance
        if (!row.showTeanBalance) return false
        this.$http.post(api.getTeamBalance, {userId: row.userId}).then(({data}) => {
          if (data.success === 1) {
            // row.myTeamBalance = data.
            // this.pt_ = this.time_
            row.myTeamBalance = data.teamBalance
          } else {
            this.$message.error({target: this.$el, message: data.msg || '团队余额获取失败！'})
          }
        }).catch(rep => {
        })
      },
      sendSms () {
        this.$http.post(api.person_sendSms, {}).then(({data}) => {
          if (data.success === 1) {
            this.$message.success({target: this.$el, message: '恭喜您， 手机验证码发送成功，请注意查收。'})
            this.pt_ = this.time_
          } else {
            this.$message.error({target: this.$el, message: data.msg || '手机验证码发送失败！'})
          }
        }).catch(rep => {
        })
      },
      sendMail () {
        this.$http.post(api.person_sendMail, {}).then(({data}) => {
          if (data.success === 1) {
            this.$message.success({target: this.$el, message: '恭喜您， 邮箱验证码发送成功，请注意查收。'})
            this.et_ = this.time_
          } else {
            this.$message.error({target: this.$el, message: data.msg || '邮箱验证码发送失败！'})
          }
        }).catch(rep => {
        })
      },
      checkNow () {
        if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
        if (this.me.safeCheck && !this.safeCheckCode) return this.$message.warning({target: this.$el, message: '请输入安全验证码！'})
        this.checkSecurityPwd()
      },
      checkSafeCode () {
        this.$http.post(this.checkSafeCodeUrl[this.me.safeCheck], {verifyCode: this.safeCheckCode}).then(({data}) => {
          if (data.success === 1) {
            this.topUpIndex++
            this.$message.success({target: this.$el, message: data.msg || '安全码验证成功！'})
            this.__setCall({fn: '__getUserFund'})
            // this.getUserBankCards()
          } else {
            this.$message.error({target: this.$el, message: data.msg || '安全码错误！'})
          }
        }).catch(rep => {
          this.$message.error({target: this.$el, message: '安全验证失败！'})
        })
      },
      // 设置日工资：
      // http://192.168.169.161:8080/cagamesclient/team/useList.do?method=setSubDaySalary&destUserId=51&daySalary=50
      setSubDaySalary () {
        // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=recharge&destId=5&amount=100.5
        let loading = this.$loading({
          text: '工资调整中...',
          target: this.$el
        }, 10000, '工资调整超时...')
        this.$http.get(api.setSubDaySalary, {
          destUserId: this.user.userId,
          // daySalary: this.o
          winSalary: this.oo,
          loseSalary: this.o
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '工资调整成功!'
              this.stepIndex = 0
              this.stepType = ''
              this.topUpIndex = 0
            }, 100)
          } else loading.text = data.msg || '工资调整失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      clear () {
        this.name = ''
        // this.minMoney = ''
        // this.maxMoney = ''
        this.minPoint = ''
        this.maxPoint = ''
        this.rg = ''
        this.f = ''
        this.btos = ''
      },
      // sortByteamBalance (a, b) {
      //   console.log(a, b)
      //   return a > b
      // },
      cellClick (row, column, cell, event) {
        if (column.property === 'userName') {
          this.clear()
          // this.BL.push({
          //   id: row.userId,
          //   title: row.userName
          // })
          this.getUserList(row.userId)
        }
      },
      link (B, i) {
        // if (i !== B.length - 1) {
          // this.BL = this.BL.slice(0, i + 1)
          // this.getUserList()
        // }
        this.clear()
        this.getUserList(B.userId)
      },
      searNow () {
        this.BL = this.BL.slice(0, 1)
        this.getUserList()
      },
      addUserNow () {
        this.$router.push('/group/2-3-5')
      },
      getUserList (id, page, fn) {
        // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=getUserList&userName=dd&minPoint=0&maxPoint=8&maxBalance=100000&minBalance=0&startRegistTime=20161101000000&endRegistTime=20161231000000
        // console.log(this.$refs['table'])
        let loading = this.$loading({
          text: '用户列表加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')

        if (!fn) {
          this.preOptions = {
            userId: id || this.BL[this.BL.length - 1].id,
            userName: this.name,
            minPoint: this.minPoint,
            maxPoint: this.maxPoint,
            cType: this.rg,
            sortType: this.f,
            sort: !this.btos ? 1 : 2,
            // minBalance: this.minMoney || '',
            // maxBalance: this.maxMoney || '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }

        this.$http.post(api.getUserList, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            data.subUserInfo.forEach(x => {
              x.showTeanBalance = false
              x.myTeamBalance = '获取中...'
              x.back = [
                {
                  $: x.userPoint.toFixed(1),
                  $$: x.userPoint.toFixed(1),
                  $s: data.userPoint * 10
                }
              ]
            })
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
            // 当前登录用户的固定信息
            this.id = data.currUserId
            // 开户
            this.isAddAccount = data.isAddAccount
            // 代充
            this.canTopUp = data.uploadLevel !== '0'
            // 代充范围
            if (this.canTopUp) {
              this.topUpMax = parseInt(data.uploadLevel.split('-')[1])
              this.topUpMin = parseInt(data.uploadLevel.split('-')[0])
            }
            this.BL = (data.userBreads).concat([{}])

            // static 1st
            data.subUserInfo[0] && (data.subUserInfo[0].static = true)
            // self = self and 1st
            // data.subUserInfo[0] && (this.BL.length === 1) && (data.subUserInfo[0].userId === data.currUserId) && (data.subUserInfo[0].self = true)

            // 日工资已迁移至新页面
            // this.showSalary = data.showSalary
            // this.showDaySalary = data.showDaySalary
            // this.OL = data.loseSlaryData
            // this.OOL = data.winSlaryData

            // this.showSalary = data.showSalary
            this.OL = data.salaryComb

            this.data = data.subUserInfo
            this.total = data.totalSize || this.data.length
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            // this.data = data.recordList
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      checkSecurityPwd () {
        this.$http.post(api.checkSecurityPwd, {password: this.cpwd}).then(({data}) => {
          if (data.success === 1) {
            if (this.me.safeCheck) {
              return this.checkSafeCode()
            } else this.topUpIndex++
            // this.topUpIndex++
            // this.$message.success({target: this.$el, message: data.msg || '资金密码密码验证成功！'})
          } else {
            this.$message.error({target: this.$el, message: data.msg || '资金密码错误！'})
          }
        }).catch(rep => {
          this.$message.error({target: this.$el, message: '资金密码密码验证失败！'})
        })
      },
      recharge () {
        // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=recharge&destId=5&amount=100.5
        let loading = this.$loading({
          text: '充值中...',
          target: this.$el
        }, 10000, '充值超时...')
        this.$http.get(api.recharge, {
          destId: this.user.userId,
          amount: this.money,
          isSpe: this.mtype
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '充值成功!'
              this.stepType = ''
              this.stepIndex = 0
              this.topUpIndex = 0
              let B = this.BL[this.BL.length - 2]
              this.getUserList(B.userId)
            }, 100)
          } else loading.text = data.msg || '充值失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=showAdjustInfo&destUserId=5
      showAdjustInfo () {
        this.getBackWater(this.user)
        // this.$http.get(api.showAdjustInfo, {
        //   destUserId: this.user.userId
        // }).then(({data}) => {
        //   // success
        //   if (data.success === 1) {
        //     data.back = []
        //     data.back.unshift({
        //       backwater: data.rang
        //     })
        //     data.back.forEach((x, i) => {
        //       x.$ = data.userpoint.toFixed(1)
        //       x.$s = x.backwater * (i ? 10000 : 10)
        //     })
        //     this.$set(this.user, 'back', data.back)
        //     this.getBackWater(this.user)
        //   }
        // }, (rep) => {
        //   // error
        // })
      },
      adjustPoint (point) {
        if (!Number(point)) return
        this.$http.get(api.adjustPoint, {
          destUserId: this.user.userId,
          adjustType: this.pointType === 'up' ? 0 : 1,
          increaseType: this.AT,
          point: point
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.user.userPoint = this.user.back[0].$$ = (this.user.userPoint * 1 + point * 1).toFixed(1)
            this.$message.success('调点成功！')
            this.stepIndex = 0
            this.stepType = ''
          } else this.$message.error(data.msg || '调点失败！')
        }, (rep) => {
          // error
        })
      },
      showUserAddCount () {
        this.$http.post(api.showUserAddCount, {
          destUserId: this.user.userId
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            data.addUsersKeys.forEach(k => {
              k.i = 0
            })
            this.openUserData = data.addUsersKeys
          } else {
            this.openUserData = []
            this.$message.error(data.msg || '开户额数据获取失败！')
          }
        }, (rep) => {
          // error
          this.$message.error('开户额数据获取失败！')
        })
      },
      distriAddCount () {
        let items = []
        if (!this.openUserData.find(o => o.i > 0)) return this.$message.warning({target: this.$el, message: '您确定要调整下级开户额吗？ 输入的值需 >0 哦'})
        this.openUserData.forEach(o => {
          items.push({
            gId: o.gId,
            n: o.i
          })
        })
        this.$http.post(api.distriAddCount, {
          destUserId: this.user.userId,
          items: JSON.stringify(items)
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.showUserAddCount()
            this.$message.success('开户额调整成功！')
            this.stepIndex = 0
          } else this.$message.error(data.msg || '开户额调整失败！')
        }, (rep) => {
          // error
          this.$message.error('开户额调整失败！')
        })
      },
      goBonus () {
        if (this.user.userId) {
          this.$router.push({
            path: '/me/2-3-1',
            query: {
              userId: this.user.userId
            }
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .user-list
    top TH
    .form
      padding PWX

  .item
    display inline-block
    margin 0 PW .1rem 0


  .el-select
  .el-input-number
    width 1.2rem
  .el-select
    position relative
    top .01rem
  .amount
    font-family Roboto
    font-size 0.72rem
    color #333
  .text-money
    color #999

  .notice
    font-size .12rem
    line-height .22rem
    margin 0 .2rem
    padding PWX
    background-color #fffde8
    border 1px solid #d5d09b
    radius()
    .content
      display inline-block
      margin 0
      line-height .25rem
      vertical-align top
  .c_03
    color #033333
  .stepType_copy
    .box
      width 11rem !important
      height 6rem
      overflow hidden !important
      padding-top .4rem
      .tool-bar
        position absolute
        top 0
        left 0
        right 0
        &+div
          height 100%
          overflow-y auto

    .h_450
      overflow hidden
      margin-right 0 !important
      .xcontent
        height 100%
        width 100%
        overflow auto
        box-sizing border-box

      vertical-align top
      box-sizing border-box
      background-color #fff6ef
      padding-top .36rem
      &:not(:first-child)
        border-left 5px solid #fff
      .absolute
        background-color #d2d2d2
        top 0
        left 0
        right 0

  .users
  .as
    position relative
    list-style none
    box-sizing border-box
    padding-bottom 100%
    margin-bottom -100%
    background-color #fff
    overflow auto
  .users + .as
    padding .15rem
    padding-top .5rem
    padding-right 0
    background-color #f8f8f8
    .hlh_40
      position absolute
      top .08rem
      left .2rem
      right .2rem
    .mh_500
      overflow auto
    .ds-button.outline.withclose
      width 1.9rem
      text-align left
      margin .05rem
      // box-shadow none
      color BLUE
      padding-right 0
      .close
        float right
        border-radius 0
        border none
        padding-left .1rem
        padding-right .1rem
        font-size .1rem
        &:hover
          background-color BLUE
          color #fff


  .users
  .as
    padding-top .3rem
    &>.hlh_30
      // background-color #cccccc
      color #333
      font-weight bold
      position absolute
      top 0
      width 100%
      z-index 1
    li:nth-child(odd)
      background-color #e7e7e7
    li:nth-child(even)
      background-color #f8f8f8
    li.pointer:hover
      color #000
      font-weight bold
      // background-color #999

  ul
    overflow auto
  .as
    padding-top .4rem

</style>

<style lang="stylus" scoped>

  @import '../../var.stylus'

  bg = #d8d8d8
  bg-hover = #ececec
  bg-active = #e2e2e2
  .tool-bar
    height TH
    line-height TH
    background-color bg
    font-size .12rem
    border-top-right-radius .05rem
    border-top-left-radius .05rem
    overflow hidden
    background-position .2rem center

  .title
    color #333
    font-weight bold
    padding-left .2rem

  .el-button-group
    float right
    height 100%
    .el-button
      font-size .12rem
      color GREY
      border none
      height 100%
      width TH
      padding 0
      background-color transparent
      &:hover
        background-color bg-hover
      &:active
        background-color bg-active
      &:first-child
        font-size .16rem
      &.close
        &:hover
          background-color #f34
          color #fff
        &:active
          color #fff
          background-color #d40c1d

  .modal
    position absolute
    top TH
    bottom 0
    left 0
    right 0
    text-align center
    z-index 9999
    &:not(.stepType_copy) .box
      background-color #fff


    .mask
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      opacity .5
      background #000
      z-index 9998
    .box-wrapper
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      text-align center
      z-index 9999
      &:after
        content ''
        height 100%
        width 0
        vertical-align middle
        display inline-block
    .box
      position relative
      text-align left
      display inline-block
      vertical-align middle
      background-color #ededed
      font-size .12rem
      width 9rem
      radius()
    .content
      margin 0 .2rem
      .el-row
        margin PW 0
        word-wrap break-word
      .textarea-label
        position relative
        margin .3rem .3rem .3rem 0
        .label
          position absolute
          left 0
          top .05rem
        .el-textarea
          display inline-bock
          vertical-align top
          padding-left .6rem
          .textarea
            font-size .12rem

</style>
