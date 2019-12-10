<template lang="jade">
  .game-selection(:class= " { 'iskq' : rows[0] && rows[0].class && rows[0].class.indexOf('code square') !== -1 } " style="padding-left: .05rem; padding-right: .1rem")

    GameNumberRow(v-for="(row, i) in rows" v-bind:key="i" v-bind:row="row" v-bind:rowIndex = "i" v-bind:gameid="gameid" v-on:numbers-change="numbersChange" v-bind:titleSpan="titleSpan" v-on:select = "select" v-bind:class=" [ row.rowClass ] " v-bind:CMCH="CMCH")

    //- column - selected - bar
    .column-action-bar(v-if=" showColumnActionBar ")
      span.column-btn(v-for=" (x, i) in columnBtns " @click=" columnSelect(i) ") {{ !x ? '全' : '清' }}

    .f(v-if="rows.length === 0")
      el-row
        el-col(:span="20")
          el-input(v-model="V" type="textarea" autofocus  v-bind:autosize="{ minRows: 5, maxRows: 10 }" placeholder="" style="padding: 0 .1rem 0 .1rem")
        el-col.btn-groups(:span="4")
          .ds-button.outline.isworking(@click="removeRepeat") 删除重复号
          br
          .ds-button.outline(v-bind:class="{disabled: !upload}") {{ upload ? '导入文件' : '浏览器不支持' }}
            input(ref="file" type="file" @change="selectFiles" multiple v-if="upload")
          br
          .ds-button.outline(@click=" __clearValue ") 清空

      p.text-999(style="font-size: .12rem; padding: .1rem .15rem .1rem .15rem") 每一注号码之间请用一个 空格[ ]、逗号[,] 或者 分号[;] 隔开


    el-row.pos(v-if="show[0]" style="padding-left: .1rem")
      el-col(v-bind:span="24")
        label.ds-checkbox-label(v-for="p in positions" @click="p.selected = !p.selected" v-bind:class="{active: p.selected}")
          span.ds-checkbox
          | {{ p.title[show[1]] }}
      el-col(:span="24" )
        .notice(style="line-height: 1; margin: 0 0 0 0; padding: .1rem;")
          | 温馨提示：你选择了
          span.count {{ psl }}
          |  个位置， 系统自动根据位置组合成
          span.comb {{ comb }}
          |  个方案

</template>

<script>
  import GameNumberRow from './GameNumberRow'
  import {
    // digitUppercase,
    // numberWithCommas,
    // getAnimalOfNumber,
    getNumberOfAnimal,
    getColorsOfNumberArray
    // getColorOfNumber
  } from '../util/Number'
  import N from '../util/N'
  import WN from '../util/WN'
  import { C, removeDuplicate } from '../util/base'
  export default {
    props: ['type', 'gameid', 'CMCH'],
    data () {
      return {
        defaultRowToRowJoin: '|',
        // 所有玩法号码工作区
        allRows: [
          // PCDD
          {ids: '1-1-1-PCDD', class: 'code square width1-8 width1-9 blue default-color', min: 0, max: 27, times: 0, afters: Array(28).fill(0).map(n => (n = 47))},
          {ids: '1-1-2-PCDD', class: 'code square width1-8 width1-9 blue default-color', titleClass: '', values: [{selected: false, title: '极大', value: '1', times: null, after: 18.8}, {selected: false, title: '极小', value: '2', times: 0, after: 18.8}]},
          {ids: '1-1-3-PCDD', class: 'code square width1-8 width1-9 blue default-color', titleClass: '', values: [{selected: false, title: '大', value: '1', times: null, after: 18.8}, {selected: false, title: '小', value: '2', times: 0, after: 18.8}, {selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '1-1-4-PCDD', class: 'code square width1-8 width1-9 blue default-color', titleClass: '', values: [{selected: false, title: '大单', value: '1', times: null, after: 18.8}, {selected: false, title: '大双', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '小单', value: '4', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '小双', value: '2', times: 0, after: 18.8}]},
          {ids: '9-1-1', class: 'code square width1-8 blue default-color', innertitle: '万位', titleClass: '', values: [{selected: false, title: '大', value: '1', times: null, after: 18.8}, {selected: false, title: '小', value: '2', times: 0, after: 18.8}, {selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}, {selected: false, title: '质', value: '5', times: 0, after: 18.8}, {selected: false, title: '合', value: '6', times: 0, after: 18.8}]},
          {ids: '9-1-1', class: 'code square width1-8 blue default-color', innertitle: '千位', titleClass: '', values: [{selected: false, title: '大', value: '1', times: null, after: 18.8}, {selected: false, title: '小', value: '2', times: 0, after: 18.8}, {selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}, {selected: false, title: '质', value: '5', times: 0, after: 18.8}, {selected: false, title: '合', value: '6', times: 0, after: 18.8}]},
          {ids: '9-1-1', class: 'code square width1-8 blue default-color', innertitle: '百位', titleClass: '', values: [{selected: false, title: '大', value: '1', times: null, after: 18.8}, {selected: false, title: '小', value: '2', times: 0, after: 18.8}, {selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}, {selected: false, title: '质', value: '5', times: 0, after: 18.8}, {selected: false, title: '合', value: '6', times: 0, after: 18.8}]},
          {ids: '9-1-1', class: 'code square width1-8 blue default-color', innertitle: '十位', titleClass: '', values: [{selected: false, title: '大', value: '1', times: null, after: 18.8}, {selected: false, title: '小', value: '2', times: 0, after: 18.8}, {selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}, {selected: false, title: '质', value: '5', times: 0, after: 18.8}, {selected: false, title: '合', value: '6', times: 0, after: 18.8}]},
          {ids: '9-1-1', class: 'code square width1-8 blue default-color', innertitle: '个位', titleClass: '', values: [{selected: false, title: '大', value: '1', times: null, after: 18.8}, {selected: false, title: '小', value: '2', times: 0, after: 18.8}, {selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}, {selected: false, title: '质', value: '5', times: 0, after: 18.8}, {selected: false, title: '合', value: '6', times: 0, after: 18.8}]},
          {ids: '9-1-2', class: 'code square width1-8 blue default-color', innertitleCopy: '总和、龙虎', titleClass: '', values: [{selected: false, title: '总大', value: '1', times: null, after: 18.8, afterIndex: 2}, {selected: false, title: '总小', value: '2', times: 0, after: 18.8, afterIndex: 2}, {selected: false, title: '总单', value: '3', times: 0, after: 18.8, afterIndex: 2}, {selected: false, title: '总双', value: '4', times: 0, after: 18.8, afterIndex: 2}, {selected: false, title: '龙', value: '5', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和', value: '7', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎', value: '6', times: 0, after: 18.8, afterIndex: 1}]},

          {ids: '9-2-1', class: 'code square width1-8 blue default-color', innertitle: '万位', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-2-1', class: 'code square width1-8 blue default-color', innertitle: '千位', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-2-1', class: 'code square width1-8 blue default-color', innertitle: '百位', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-2-1', class: 'code square width1-8 blue default-color', innertitle: '十位', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-2-1', class: 'code square width1-8 blue default-color', innertitle: '个位', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-3-1', class: 'code square width1-8 blue default-color', innertitle: '万定位', titleClass: '', values: [{selected: false, title: '0', value: '0', times: null, after: 18.8}, {selected: false, title: '1', value: '0', times: null, after: 18.8}, {selected: false, title: '2', value: '0', times: null, after: 18.8}, {selected: false, title: '3', value: '0', times: null, after: 18.8}, {selected: false, title: '4', value: '0', times: null, after: 18.8}, {selected: false, title: '5', value: '0', times: null, after: 18.8}, {selected: false, title: '6', value: '0', times: null, after: 18.8}, {selected: false, title: '7', value: '0', times: null, after: 18.8}, {selected: false, title: '8', value: '0', times: null, after: 18.8}, {selected: false, title: '9', value: '0', times: null, after: 18.8}, {selected: false, title: '大', value: '1', times: null, after: 18.8, afterIndex: 1}, {selected: false, title: '小', value: '2', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '单', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '双', value: '4', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '质', value: '5', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '合', value: '6', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-3-1', class: 'code square width1-8 blue default-color', innertitle: '千定位', titleClass: '', values: [{selected: false, title: '0', value: '0', times: null, after: 18.8}, {selected: false, title: '1', value: '0', times: null, after: 18.8}, {selected: false, title: '2', value: '0', times: null, after: 18.8}, {selected: false, title: '3', value: '0', times: null, after: 18.8}, {selected: false, title: '4', value: '0', times: null, after: 18.8}, {selected: false, title: '5', value: '0', times: null, after: 18.8}, {selected: false, title: '6', value: '0', times: null, after: 18.8}, {selected: false, title: '7', value: '0', times: null, after: 18.8}, {selected: false, title: '8', value: '0', times: null, after: 18.8}, {selected: false, title: '9', value: '0', times: null, after: 18.8}, {selected: false, title: '大', value: '1', times: null, after: 18.8, afterIndex: 1}, {selected: false, title: '小', value: '2', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '单', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '双', value: '4', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '质', value: '5', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '合', value: '6', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-3-1', class: 'code square width1-8 blue default-color', innertitle: '百定位', titleClass: '', values: [{selected: false, title: '0', value: '0', times: null, after: 18.8}, {selected: false, title: '1', value: '0', times: null, after: 18.8}, {selected: false, title: '2', value: '0', times: null, after: 18.8}, {selected: false, title: '3', value: '0', times: null, after: 18.8}, {selected: false, title: '4', value: '0', times: null, after: 18.8}, {selected: false, title: '5', value: '0', times: null, after: 18.8}, {selected: false, title: '6', value: '0', times: null, after: 18.8}, {selected: false, title: '7', value: '0', times: null, after: 18.8}, {selected: false, title: '8', value: '0', times: null, after: 18.8}, {selected: false, title: '9', value: '0', times: null, after: 18.8}, {selected: false, title: '大', value: '1', times: null, after: 18.8, afterIndex: 1}, {selected: false, title: '小', value: '2', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '单', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '双', value: '4', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '质', value: '5', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '合', value: '6', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-3-1', class: 'code square width1-8 blue default-color', innertitle: '十定位', titleClass: '', values: [{selected: false, title: '0', value: '0', times: null, after: 18.8}, {selected: false, title: '1', value: '0', times: null, after: 18.8}, {selected: false, title: '2', value: '0', times: null, after: 18.8}, {selected: false, title: '3', value: '0', times: null, after: 18.8}, {selected: false, title: '4', value: '0', times: null, after: 18.8}, {selected: false, title: '5', value: '0', times: null, after: 18.8}, {selected: false, title: '6', value: '0', times: null, after: 18.8}, {selected: false, title: '7', value: '0', times: null, after: 18.8}, {selected: false, title: '8', value: '0', times: null, after: 18.8}, {selected: false, title: '9', value: '0', times: null, after: 18.8}, {selected: false, title: '大', value: '1', times: null, after: 18.8, afterIndex: 1}, {selected: false, title: '小', value: '2', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '单', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '双', value: '4', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '质', value: '5', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '合', value: '6', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-3-1', class: 'code square width1-8 blue default-color', innertitle: '个定位', titleClass: '', values: [{selected: false, title: '0', value: '0', times: null, after: 18.8}, {selected: false, title: '1', value: '0', times: null, after: 18.8}, {selected: false, title: '2', value: '0', times: null, after: 18.8}, {selected: false, title: '3', value: '0', times: null, after: 18.8}, {selected: false, title: '4', value: '0', times: null, after: 18.8}, {selected: false, title: '5', value: '0', times: null, after: 18.8}, {selected: false, title: '6', value: '0', times: null, after: 18.8}, {selected: false, title: '7', value: '0', times: null, after: 18.8}, {selected: false, title: '8', value: '0', times: null, after: 18.8}, {selected: false, title: '9', value: '0', times: null, after: 18.8}, {selected: false, title: '大', value: '1', times: null, after: 18.8, afterIndex: 1}, {selected: false, title: '小', value: '2', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '单', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '双', value: '4', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '质', value: '5', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '合', value: '6', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-4-1', class: 'code square width1-8 blue default-color', innertitleCopy: '全五', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-4-2', class: 'code square width1-8 blue default-color', innertitleCopy: '前三', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-4-3', class: 'code square width1-8 blue default-color', innertitleCopy: '中三', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-4-4', class: 'code square width1-8 blue default-color', innertitleCopy: '后三', min: 0, max: 9, times: 0, afters: Array(10).fill(0).map(n => (n = 47))},
          {ids: '9-5-1, 9-5-2, 9-5-3', class: 'default sb-adjust', innertitleCopy: '第一个投注号码', min: 0, max: 9, afterONtitle: 18.88},
          {ids: '9-5-1, 9-5-2, 9-5-3', class: 'default sb-adjust', innertitleCopy: '第二个投注号码', min: 0, max: 9, afterONtitle: 18.88},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '万千', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '万百', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '万十', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '万个', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '千百', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '千十', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '千个', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '百十', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '百个', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-6-1', class: 'code square width1-8 small-space blue default-color', innertitle: '十个', titleClass: '', rowClass: 'halfhalf-row', values: [{selected: false, title: '单', value: '3', times: 0, after: 18.8}, {selected: false, title: '双', value: '4', times: 0, after: 18.8}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙1vs虎2', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙1', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎2', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙1vs虎3', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙1', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎3', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙1vs虎4', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙1', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎4', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙1vs虎5', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙1', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎5', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙2vs虎3', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙2', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎3', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙2vs虎4', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙2', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎4', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙2vs虎5', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙2', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎5', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙3vs虎4', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙3', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎4', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙3vs虎5', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙3', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎5', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          {ids: '9-7-1', class: 'code square width1-8 small-space small-space-s blue default-color', innertitle: '龙4vs虎5', vtitle: '龙', titleClass: '', rowClass: 'third-half-row', values: [{selected: false, title: '龙4', vtitle: '龙', value: '3', times: 0, after: 18.8, afterIndex: 1}, {selected: false, title: '和局', vtitle: '和', value: '4', times: 0, after: 18.8, afterIndex: 0}, {selected: false, title: '虎5', vtitle: '虎', value: '4', times: 0, after: 18.8, afterIndex: 1}]},
          /***
          ** 五星[直选复式,五星组合] | 四星[前四[直选复式,四星组合]] | 前三[直选复式] | 前二[直选复式] | 一星[定位胆] | 任选[任*[直选复式]]
          ***/
          {ids: '5-1-1, 5-1-3, 4-1-1, 4-1-3, +3-1-1, 2-1-1, 1-1-1, -1-1-1, -1-2-1, -1-3-1', title: '万位', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[直选复式,五星组合] | 四星[后四[直选复式,四星组合]] | 前三[直选复式] | 中三[直选复式] | 前二[直选复式] | 一星[定位胆] | 任选[任*[直选复式]]
          ***/
          {ids: '5-1-1, 5-1-3, 4-1-1, 4-1-3, 4-3-1, 4-3-3, +3-1-1, 3-1-1, 2-1-1, 1-1-1, -1-1-1, -1-2-1, -1-3-1', title: '千位', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[直选复式,五星组合] | 四星[后四[直选复式,四星组合]] | 前三[直选复式] | 中三[直选复式] | 后三[直选复式] | 一星[定位胆] | 任选[任*[直选复式]]
          ***/
          {ids: '5-1-1, 5-1-3, 4-1-1, 4-1-3, 4-3-1, 4-3-3, +3-1-1, 3-1-1, -3-1-1, 1-1-1, -1-1-1, -1-2-1, -1-3-1, 1-1-1-SSL, 2-1-1-SSL', title: '百位', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[直选复式,五星组合] | 四星[后四[直选复式,四星组合]] | 中三[直选复式] | 后三[直选复式] | 后二[直选复式] | 一星[定位胆] | 任选[任*[直选复式]]
          ***/
          {ids: '5-1-1, 5-1-3, 4-1-1, 4-1-3, 4-3-1, 4-3-3, 3-1-1, -3-1-1, 2-3-1, 1-1-1, -1-1-1, -1-2-1, -1-3-1, 1-1-1-SSL, 2-1-1-SSL', title: '十位', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[直选复式,五星组合] | 四星[后四[直选复式,四星组合]] | 后三[直选复式] | 后二[直选复式] | 一星[定位胆] | 任选[任*[直选复式]]
          ***/
          {ids: '5-1-1, 5-1-3, 4-3-1, 4-3-3, -3-1-1, 2-3-1, 1-1-1, -1-1-1, -1-2-1, -1-3-1, 1-1-1-SSL', title: '个位', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[组选120]
          ***/
          {ids: '5-2-1', title: '组选120', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[组选120,组选5]
          ***/
          {ids: '5-2-6', title: '四重号', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[组选60,组选20,组选10] | 四星[组选4] | 任四[组选4]
          ***/
          {ids: '5-2-4, 5-2-5, 4-2-4, 4-4-4, -1-3-6', title: '三重号', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[组选60,组选30,组选10] | 四星[组选12, 组选6] | 任四[组选12,组选6]
          ***/
          {ids: '5-2-2, 5-2-3, 5-2-5, 4-2-2, 4-4-2, 4-2-3, 4-4-3, -1-3-4, -1-3-5', title: '二重号', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[组选60,组选30,组选20,组选5] | 四星[组选12,组选4] | 任四[组选12] | 任四[组选4]
          ***/
          {ids: '5-2-2, 5-2-3, 5-2-4, 5-2-6, 4-2-2, 4-4-2, 4-2-4, 4-4-4, -1-3-4, -1-3-6', title: '单号', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[一帆风顺]
          ***/
          {ids: '5-3-1', title: '一帆风顺', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[好事成双]
          ***/
          {ids: '5-3-2', title: '好事成双', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[三星报喜]
          ***/
          {ids: '5-3-3', title: '三星报喜', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 五星[四季发财]
          ***/
          {ids: '5-3-4', title: '四季发财', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 四星[组选24] | 任四[组选24]
          ***/
          {ids: '4-2-1, 4-4-1, -1-3-3', title: '组选24', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 前三[直选和值] | 中三[直选和值] | 后三[直选和值]
          ***/
          {ids: '+3-1-3, 3-1-3, -3-1-3', title: '直选和值', min: 0, max: 27},
          /***
          ** 前三[直选跨度] | 中三[直选跨度] | 后三[直选跨度] | 前二[直选跨度] | 后二[直选跨度]
          ***/
          {ids: '+3-1-4, 3-1-4, -3-1-4, 2-1-3, 2-3-3', title: '跨度', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 前三[组三复式] | 中三[组三复式] | 后三[组三复式] | 任三[组三复式]
          ***/
          {ids: '+3-2-1, 3-2-1, -3-2-1, -1-2-3', title: '组三', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
           /***
          ** 前三[组六复式] | 中三[组六复式] | 后三[组六复式] | 任三[组六复式]
          ***/
          {ids: '+3-2-3, 3-2-3, -3-2-3, -1-2-5', title: '组六', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 前三[直选和值] | 中三[直选和值] | 后三[直选和值]
          ***/
          {ids: '+3-3-1, 3-3-1, -3-3-1', title: '和值', min: 1, max: 26},
          /***
          ** 前三[包胆] | 中三[包胆] | 后三[包胆] | 前二[包胆] | 后二[包胆]
          ***/
          {ids: '+3-3-2:1, 3-3-2:1, -3-3-2:1, 2-2-3:1, 2-4-3:1, ', title: '包胆', min: 0, max: 9},
          /***
          ** 前三[和值尾数] | 中三[和值尾数] | 后三[和值尾数]
          ***/
          {ids: '+3-3-3, 3-3-3, -3-3-3', title: '和值尾数', min: 0, max: 9},
          /***
          ** 前三[特殊号] | 中三[特殊号] | 后三[特殊号]          ***/
          {ids: '+3-3-4, 3-3-4, -3-3-4', title: '特殊号', values: [{selected: false, title: '豹', value: '1'}, {selected: false, title: '顺', value: '2'}, {selected: false, title: '对', value: '3'}]},
          /***
          ** 前二[组选复式] | 后二[组选复式] | 任二[组选复式] | 任三[组选复式]
          ***/
          {ids: '2-2-1, 2-4-1, -1-1-3, 2-2-1-SSL', title: '组选', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 不定位
          ***/
          {ids: '0-1-1, 0-1-2, 0-1-3, 0-1-4, 0-1-5, 0-1-6, 0-2-1, 0-2-2, 0-2-3, 0-2-4, 0-3-1, 0-3-2', title: '不定位', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          /***
          ** 趣味[前二大小单双]
          ***/
          {ids: '-2-1-1', title: '万位', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          /***
          ** 趣味[前二大小单双]
          ***/
          {ids: '-2-1-1', title: '千位', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
           /***
          ** 趣味[后二大小单双]
          ***/
          {ids: '-2-1-1-SSL', title: '百位', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},

          {ids: '-2-1-2, -2-1-1-SSL', title: '十位', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          /***
          ** 趣味[后二大小单双]
          ***/
          {ids: '-2-1-2', title: '个位', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          {ids: '-4-1-1:1, -4-1-2:1, -4-1-3:1, -4-1-4:1, -4-1-5:1, -4-1-6:1, -4-1-7:1, -4-1-8:1, -4-1-9:1, -4-1-10:1, -4-1-11:1', title: '龙虎和', values: [{selected: false, title: '龙', value: '1'}, {selected: false, title: '和', value: '3'}, {selected: false, title: '虎', value: '2'}]},
          {ids: '-6-1-1:1, -6-1-2:1, -6-1-3:1, -6-1-4:1, -6-1-5:1, -6-1-6:1, -6-1-7:1, -6-1-8:1, -6-1-9:1, -6-1-10:1, -6-1-11:1', title: '龙虎斗', values: [{selected: false, title: '龙', value: '1'}, {selected: false, title: '虎', value: '2'}]},
          {ids: '-5-1-1', title: '斗牛', class: 'default square', values: [{selected: false, title: '牛一', value: '1'}, {selected: false, title: '牛二', value: '2'}, {selected: false, title: '牛三', value: '3'}, {selected: false, title: '牛四', value: '4'}, {selected: false, title: '牛五', value: '5'}, {selected: false, title: '牛六', value: '6'}, {selected: false, title: '牛七', value: '7'}, {selected: false, title: '牛八', value: '8'}, {selected: false, title: '牛九', value: '9'}, {selected: false, title: '牛牛', value: '10'}, {selected: false, title: '没牛', value: '11'}], buttons: ['全', '大', '小', '奇', '偶', '清']},

          /***
          ** 趣味[猜遗漏]
          ***/
          {ids: '-2-2-1', title: '猜一', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-2-2-2', title: '猜二', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-2-2-3', title: '猜三', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-2-2-4', title: '猜四', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-2-2-5', title: '猜五', min: 0, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},

          // =========================================================115========================================================
          /***
          **
          ***/
          {ids: '1-1-1-115, 3-1-1-115, 3-2-1-115, 2-1-1-115', title: '第一位', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '1-1-1-115, 3-1-1-115, 3-2-1-115, 2-1-1-115', title: '第二位', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '1-1-1-115, 3-1-1-115, 3-2-1-115', title: '第三位', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '3-1-3-115, 2-1-3-115', title: '组选', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '3-1-5-115:2, 2-1-5-115:1, -1-3-1-115:1, -1-3-2-115:2, -1-3-3-115:3, -1-3-4-115:4, -1-3-5-115:5, -1-3-6-115:6, -1-3-7-115:7', title: '胆码', min: 1, max: 11, l: 2},
          {ids: '3-1-5-115, 2-1-5-115, -1-3-1-115, -1-3-2-115, -1-3-3-115, -1-3-4-115, -1-3-5-115, -1-3-6-115, -1-3-7-115', title: '拖码', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '0-1-1-115', title: '前三位', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-1-115', title: '选1中1', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-2-115', title: '选2中2', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-3-115', title: '选3中3', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-4-115', title: '选4中4', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-5-115', title: '选5中5', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-6-115', title: '选6中5', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-115', title: '选7中5', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-8-115', title: '选8中5', min: 1, max: 11, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-2-1-1-115', title: '定单双', class: 'default square', values: [{selected: false, title: '0单5双', value: '1'}, {selected: false, title: '5单0双', value: '2'}, {selected: false, title: '1单4双', value: '3'}, {selected: false, title: '4单1双', value: '4'}, {selected: false, title: '2单3双', value: '5'}, {selected: false, title: '3单2双', value: '6'}]},
          {ids: '-2-1-2-115', title: '猜中位', min: 3, max: 9, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-3-1-3-115:1, -3-1-4-115:1, -3-1-5-115:1, -3-1-6-115:1, -3-1-7-115:1, -3-1-8-115:1, -3-1-9-115:1, -3-1-10-115:1, -3-1-11-115:1, -3-1-12-115:1, -3-1-13-115:1', title: '龙虎', values: [{selected: false, title: '龙', value: '1'}, {selected: false, title: '虎', value: '2'}]},

          // =========================================================PK10========================================================
          /***
          **
          ***/
          {ids: '-1-1-1-PK10, -1-1-2-PK10, -1-1-3-PK10, -1-1-4-PK10, -1-1-5-PK10, -1-4-1-PK10, -1-5-1-PK10, -1-6-1-PK10, -1-7-1-PK10', class: window.platform === 'ds' ? '' : '', title: '冠军', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-2-PK10, -1-1-3-PK10, -1-1-4-PK10, -1-1-5-PK10, -1-4-1-PK10, -1-5-1-PK10, -1-6-1-PK10, -1-7-1-PK10', class: window.platform === 'ds' ? '' : '', title: '亚军', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-3-PK10, -1-1-4-PK10, -1-1-5-PK10, -1-2-1-PK10', class: window.platform === 'ds' ? '' : '', title: '季军', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-4-PK10, -1-1-5-PK10, -1-2-1-PK10', class: window.platform === 'ds' ? '' : '', title: '第四名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-5-PK10', class: window.platform === 'ds' ? '' : '', title: '第五名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-3-1-PK10:1, -1-3-2-PK10:1, -1-3-3-PK10:1, -1-3-4-PK10:1, -1-3-5-PK10:1', class: window.platform === 'ds' ? '' : '', title: '龙虎', values: [{selected: false, title: '龙', value: '1'}, {selected: false, title: '虎', value: '2'}]},
          // {ids: '-1-1-7-PK10:1', class: 'ds-icon-PK10', title: '定位胆', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10', class: '', title: '第一名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10', class: '', title: '第二名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10, -1-4-9-PK10, -1-5-1-PK10, -1-6-1-PK10, -1-7-1-PK10', class: '', title: '第三名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10, -1-4-9-PK10, -1-6-1-PK10, -1-7-1-PK10', class: '', title: '第四名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10, -1-7-1-PK10', class: '', title: '第五名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10, -1-7-5-PK10', class: '', title: '第六名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10, -1-6-5-PK10, -1-7-5-PK10', class: '', title: '第七名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-1-7-PK10, -1-5-5-PK10, -1-6-5-PK10, -1-7-5-PK10', class: '', title: '第八名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-4-5-PK10, -1-1-7-PK10, -1-5-5-PK10, -1-6-5-PK10, -1-7-5-PK10', class: '', title: '第九名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-4-5-PK10, -1-1-7-PK10, -1-5-5-PK10, -1-6-5-PK10, -1-7-5-PK10', class: '', title: '第十名', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-8-1-PK10', class: '', title: '前三', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-8-2-PK10', class: '', title: '后三', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-8-3-PK10', class: '', title: '前四', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-8-4-PK10', class: '', title: '后四', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-8-5-PK10', class: '', title: '前五', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-8-6-PK10', class: '', title: '后五', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '-1-9-1-PK10', title: '和值', min: 3, max: 19, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']}, // , bts: [2, 2, 4, 4, 6, 6, 8, 8, 10, 8, 8, 6, 6, 4, 4, 2, 2]
          {ids: '-1-9-2-PK10', class: '', title: '大小单双', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '冠军', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '亚军', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第三名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第四名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第五名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第六名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第七名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第八名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第九名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-10-1-PK10', class: '', title: '第十名', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '-1-4-3-PK10, -1-4-7-PK10, -1-4-11-PK10, -1-5-3-PK10, -1-5-7-PK10, -1-6-3-PK10, -1-6-7-PK10, -1-7-3-PK10, -1-7-7-PK10', title: '组选', min: 1, max: 10, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          // =========================================================KL8========================================================
          /***
          **
          ***/
          {ids: '-1-1-1-KL8, -1-1-2-KL8, -1-1-3-KL8, -1-1-4-KL8, -1-1-5-KL8, -1-1-6-KL8, -1-1-7-KL8', min: 1, max: 80, l: 2, buttons: ['全', '大', '小', '奇', '偶', '质', '合', '清'], btnClass: 'block'},
          {ids: '0-1-1-KL8', class: 'default square', title: '上下盘', values: [{selected: false, title: '上盘', value: '1'}, {selected: false, title: '下盘', value: '2'}, {selected: false, title: '和盘', value: '3'}]},
          {ids: '0-1-2-KL8', class: 'default square', title: '奇偶盘', values: [{selected: false, title: '奇盘', value: '1'}, {selected: false, title: '偶盘', value: '2'}, {selected: false, title: '和盘', value: '3'}]},
          {ids: '0-1-3-KL8', class: 'default square', title: '大小单双', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}]},
          {ids: '0-1-4-KL8', class: 'default square', title: '五行', values: [{selected: false, title: '金', value: '1'}, {selected: false, title: '木', value: '2'}, {selected: false, title: '水', value: '3'}, {selected: false, title: '火', value: '4'}, {selected: false, title: '土', value: '5'}]},

          // =========================================================KL8========================================================
          /***
          **
          ***/
          {ids: '0-1-1-K3', title: '和值号', min: 3, max: 18, l: 2, buttons: ['全', '大', '小', '奇', '偶', '清']},
          {ids: '2-1-1-K3, 2-1-2-K3', class: 'dice double-width', title: '同号', values: [{selected: false, dots: [1, 1], value: 1}, {selected: false, dots: [2, 2], value: 2}, {selected: false, dots: [3, 3], value: 3}, {selected: false, dots: [4, 4], value: 4}, {selected: false, dots: [5, 5], value: 5}, {selected: false, dots: [6, 6], value: 6}]},
          {ids: '2-1-2-K3', class: 'dice', title: '不同号', values: [{selected: false, dots: [1], value: 1}, {selected: false, dots: [2], value: 2}, {selected: false, dots: [3], value: 3}, {selected: false, dots: [4], value: 4}, {selected: false, dots: [5], value: 5}, {selected: false, dots: [6], value: 6}]},
          {ids: '-2-1-1-K3, -3-1-1-K3', class: 'dice', title: '标准', values: [{selected: false, dots: [1], value: 1}, {selected: false, dots: [2], value: 2}, {selected: false, dots: [3], value: 3}, {selected: false, dots: [4], value: 4}, {selected: false, dots: [5], value: 5}, {selected: false, dots: [6], value: 6}]},
          {ids: '-2-1-2-K3:1, -3-1-2-K3:2', class: 'dice', title: '胆码', values: [{selected: false, dots: [1], value: 1}, {selected: false, dots: [2], value: 2}, {selected: false, dots: [3], value: 3}, {selected: false, dots: [4], value: 4}, {selected: false, dots: [5], value: 5}, {selected: false, dots: [6], value: 6}]},
          {ids: '-2-1-2-K3, -3-1-2-K3', class: 'dice', title: '拖码', values: [{selected: false, dots: [1], value: 1}, {selected: false, dots: [2], value: 2}, {selected: false, dots: [3], value: 3}, {selected: false, dots: [4], value: 4}, {selected: false, dots: [5], value: 5}, {selected: false, dots: [6], value: 6}]},
          {ids: '3-1-1-K3', class: 'dice double-width', title: '三同号', values: [{selected: false, title: '111', dots: [1, 1, 1], value: 1}, {selected: false, title: '222', dots: [2, 2, 2], value: 2}, {selected: false, title: '333', dots: [3, 3, 3], value: 3}, {selected: false, title: '444', dots: [4, 4, 4], value: 4}, {selected: false, title: '555', dots: [5, 5, 5], value: 5}, {selected: false, title: '666', dots: [6, 6, 6], value: 6}]},
          // {ids: '3-1-2-K3', title: '通选', values: [{selected: false, title: '全', value: '1,1,1|2,2,2|3,3,3|4,4,4|5,5,5|6,6,6'}]},
          {ids: '3-1-2-K3', title: '通选', values: [{selected: false, title: '全', value: 1}]},
          {ids: '+3-1-2-K3', title: '通选', values: [{selected: false, title: '全', value: 1}]},
          // {ids: '+3-1-2-K3', title: '通选', values: [{selected: false, title: '全', value: '1,2,3|2,3,4|3,4,5|4,5,6'}]},
          {ids: '+3-1-1-K3', class: 'dice double-width', title: '三连号', values: [{selected: false, title: '123', dots: [1, 2, 3], value: '1'}, {selected: false, title: '234', dots: [2, 3, 4], value: '2'}, {selected: false, title: '345', dots: [3, 4, 5], value: '3'}, {selected: false, title: '456', dots: [4, 5, 6], value: '4'}]},
          {ids: '0-1-2-K3:1', class: 'dice', title: '1个号中奖', values: [{selected: false, dots: [1], value: 1}, {selected: false, dots: [2], value: 2}, {selected: false, dots: [3], value: 3}, {selected: false, dots: [4], value: 4}, {selected: false, dots: [5], value: 5}, {selected: false, dots: [6], value: 6}]},
          {ids: '1-1-1-HC6', class: 'code width1-8', title: '特码', min: 1, max: 49, l: 2, hover: true, times: 0, afters: Array(49).fill(0).map(n => (n = 47)), buttons: ['全', '大', '小', '奇', '偶', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪', '金', '木', '水', '火', '土', '清'], btnClass: 'block pl3'},
          {ids: '1-1-2-HC6', class: 'code width1-8', title: '正码', min: 1, max: 49, l: 2, hover: true, times: 0, afters: Array(49).fill(0).map(n => (n = 47)), buttons: ['全', '大', '小', '奇', '偶', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪', '金', '木', '水', '火', '土', '清'], btnClass: 'block pl3'},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '鼠', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('鼠').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('鼠')), checkbox: true, after: 47.7, value: 1}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '牛', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('牛').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('牛')), checkbox: true, after: 47.7, value: 2}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '虎', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('虎').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('虎')), checkbox: true, after: 47.7, value: 3}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '兔', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('兔').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('兔')), checkbox: true, after: 47.7, value: 4}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '龙', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('龙').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('龙')), checkbox: true, after: 47.7, value: 5}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '蛇', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('蛇').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('蛇')), checkbox: true, after: 47.7, value: 6}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '马', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('马').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('马')), checkbox: true, after: 47.7, value: 7}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '羊', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('羊').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('羊')), checkbox: true, after: 47.7, value: 8}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '猴', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('猴').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('猴')), checkbox: true, after: 47.7, value: 9}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '鸡', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('鸡').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('鸡')), checkbox: true, after: 47.7, value: 10}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '狗', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('狗').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('狗')), checkbox: true, after: 47.7, value: 11}]},
          {ids: '2-1-1-HC6, 2-1-2-HC6, 2-1-3-HC6, 2-1-4-HC6, ', class: 'number-array full-width', title: '猪', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('猪').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('猪')), checkbox: true, after: 47.7, afterIndex: 1, value: 12}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '鼠', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('鼠').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('鼠')), input: true, times: 0, after: 47.7, value: 1}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '牛', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('牛').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('牛')), input: true, times: 0, after: 47.7, value: 2}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '虎', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('虎').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('虎')), input: true, times: 0, after: 47.7, value: 3}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '兔', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('兔').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('兔')), input: true, times: 0, after: 47.7, value: 4}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '龙', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('龙').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('龙')), input: true, times: 0, after: 47.7, value: 5}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '蛇', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('蛇').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('蛇')), input: true, times: 0, after: 47.7, value: 6}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '马', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('马').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('马')), input: true, times: 0, after: 47.7, value: 7}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '羊', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('羊').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('羊')), input: true, times: 0, after: 47.7, value: 8}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '猴', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('猴').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('猴')), input: true, times: 0, after: 47.7, value: 9}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '鸡', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('鸡').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('鸡')), input: true, times: 0, after: 47.7, value: 10}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '狗', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('狗').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('狗')), input: true, times: 0, after: 47.7, value: 11}]},
          {ids: '1-1-3-HC6, ', class: 'number-array full-width', title: '猪', rowClass: 'half-row', values: [{class: 'small-circle', selected: false, title: getNumberOfAnimal('猪').join(', '), numbers: getColorsOfNumberArray(getNumberOfAnimal('猪')), input: true, times: 0, after: 47.7, afterIndex: 1, value: 12}]},
          {ids: '3-1-1-HC6', class: 'number-array full-width', title: '红波', values: [{class: 'small-circle', selected: false, title: '1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46', numbers: ['1:danger', '2:danger', '7:danger', '8:danger', '12:danger', '13:danger', '18:danger', '19:danger', '23:danger', '24:danger', '29:danger', '30:danger', '34:danger', '35:danger', '40:danger', '45:danger', '46:danger'], input: true, times: 0, after: 47.7, afterIndex: 1, value: 1}]},
          {ids: '3-1-1-HC6', class: 'number-array full-width', title: '蓝波', values: [{class: 'small-circle', selected: false, title: '3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48', numbers: ['3:oblue', '4:oblue', '9:oblue', '10:oblue', '14:oblue', '15:oblue', '20:oblue', '25:oblue', '26:oblue', '31:oblue', '36:oblue', '37:oblue', '41:oblue', '42:oblue', '47:oblue', '48:oblue', '-1:o0'], input: true, times: 0, after: 47.7, value: 2}]},
          {ids: '3-1-1-HC6', class: 'number-array full-width', title: '绿波', values: [{class: 'small-circle', selected: false, title: '5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49', numbers: ['5:green', '6:green', '11:green', '16:green', '17:green', '21:green', '22:green', '27:green', '28:green', '32:green', '33:green', '38:green', '39:green', '43:green', '44:green', '49:green', '-1:o0'], input: true, times: 0, after: 47.7, value: 3}]},
          // {ids: '4-1-1-HC6:1', title: '正一码', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          // {ids: '4-1-2-HC6:1', title: '正二码', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          // {ids: '4-1-3-HC6:1', title: '正三码', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          // {ids: '4-1-4-HC6:1', title: '正四码', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          // {ids: '4-1-5-HC6:1', title: '正五码', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          // {ids: '4-1-6-HC6:1', title: '正六码', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          // {ids: '4-1-7-HC6:1', title: '特码', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          // {ids: '4-1-8-HC6:1', title: '正特和值', values: [{selected: false, title: '大', value: '1'}, {selected: false, title: '小', value: '2'}, {selected: false, title: '单', value: '3'}, {selected: false, title: '双', value: '4'}], buttons: ['清']},
          {ids: '4-1-1-HC6', class: 'code width1-8 danger default-color', title: '正一码', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '小', times: 0, value: '2', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '单', times: 0, value: '3', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '双', times: 0, value: '4', hover: false, after: 4.7, afterIndex: 0}], buttons: ['全', '清']},
          {ids: '4-1-2-HC6', class: 'code width1-8 danger default-color', title: '正二码', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '小', times: 0, value: '2', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '单', times: 0, value: '3', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '双', times: 0, value: '4', hover: false, after: 4.7, afterIndex: 0}], buttons: ['全', '清']},
          {ids: '4-1-3-HC6', class: 'code width1-8 danger default-color', title: '正三码', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '小', times: 0, value: '2', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '单', times: 0, value: '3', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '双', times: 0, value: '4', hover: false, after: 4.7, afterIndex: 0}], buttons: ['全', '清']},
          {ids: '4-1-4-HC6', class: 'code width1-8 danger default-color', title: '正四码', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '小', times: 0, value: '2', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '单', times: 0, value: '3', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '双', times: 0, value: '4', hover: false, after: 4.7, afterIndex: 0}], buttons: ['全', '清']},
          {ids: '4-1-5-HC6', class: 'code width1-8 danger default-color', title: '正五码', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '小', times: 0, value: '2', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '单', times: 0, value: '3', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '双', times: 0, value: '4', hover: false, after: 4.7, afterIndex: 0}], buttons: ['全', '清']},
          {ids: '4-1-6-HC6', class: 'code width1-8 danger default-color', title: '正六码', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '小', times: 0, value: '2', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '单', times: 0, value: '3', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '双', times: 0, value: '4', hover: false, after: 4.7, afterIndex: 0}], buttons: ['全', '清']},
          {ids: '4-1-7-HC6', class: 'code width1-8 danger default-color', title: '特码', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '小', times: 0, value: '2', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '单', times: 0, value: '3', hover: false, after: 4.7, afterIndex: 0}, {selected: false, title: '双', times: 0, value: '4', hover: false, after: 4.7, afterIndex: 0}], buttons: ['全', '清']},
          {ids: '4-1-8-HC6', class: 'code width1-8 danger default-color', title: '正特和值', hover: true, times: 0, values: [{selected: false, title: '大', times: 0, value: '1', hover: false}, {selected: false, title: '小', times: 0, value: '2', hover: false}, {selected: false, title: '单', times: 0, value: '3', hover: false}, {selected: false, title: '双', times: 0, value: '4', hover: false}], buttons: ['全', '清']},
          {ids: '5-1-1-HC6', class: 'code width1-8', title: '1尾', min: 0, max: 9, l: 1, hover: true, times: 0, values: [{selected: false, title: '0', value: 0, times: 0, after: 18.8, hover: false, afterIndex: 0, class: 'danger'}, {selected: false, title: '1', value: 1, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'danger'}, {selected: false, title: '2', value: 2, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'danger'}, {selected: false, title: '3', value: 3, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'oblue'}, {selected: false, title: '4', value: 4, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'oblue'}, {selected: false, title: '5', value: 5, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'green'}, {selected: false, title: '6', value: 6, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'green'}, {selected: false, title: '7', value: 7, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'danger'}, {selected: false, title: '8', value: 8, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'danger'}, {selected: false, title: '9', value: 9, times: 0, after: 18.8, hover: false, afterIndex: 1, class: 'oblue'}]}
        ],
        V: '',
        // 输入的号码
        // value: '',
        // 位置选择
        positions: [
          {
            title: ['万位', '第一位'],
            value: 5,
            selected: false
          },
          {
            title: ['千位', '第二位'],
            value: 4,
            selected: true
          },
          {
            title: ['百位', '第三位'],
            value: 3,
            selected: true
          },
          {
            title: ['十位', '第四位'],
            value: 2,
            selected: true
          },
          {
            title: ['个位', '第五位'],
            value: 1,
            selected: true
          }
        ],
        // 要显示pos的玩法集
        allChecks: [
          // 最少2个位置
          {ids: '-1-1-2, -1-1-3, -1-1-4', min: 2},
          {ids: '-6-1-1, -4-1-1, -3-1-3-115', min: 2, ps: [0, 4]},
          // 最少3个位置
          {ids: '-1-2-2, -1-2-3, -1-2-4, -1-2-5, -1-2-6, -1-2-7', min: 3},
          // 最少4个位置
          {ids: '-1-3-2, -1-3-3, -1-3-4, -1-3-5, -1-3-6', min: 4}
        ],
        ids: '-1-1-2, -1-1-3, -1-1-4, -1-2-2, -1-2-3, -1-2-4, -1-2-5, -1-2-6, -1-2-7, -1-3-2, -1-3-3, -1-3-4, -1-3-5, -1-3-6, -4-1-1,  -6-1-1, -3-1-3-115,',
        // 号码集
        ns: [],
        // 号码的文字表示集
        nsTitle: [],
        // 号码的倍数集
        nsTimes: [],
        nsAtitle: [],
        // 导入文件
        upload: true,
        titleSpan: 0,
        legalValue: '',
        columnBtns: {
          '0': 0,
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0,
          '6': 0,
          '7': 0,
          '8': 0,
          '9': 0
        }
      }
    },
    computed: {
      showColumnActionBar () {
        return ',1-1-1,'.indexOf(',' + this.type.id + ',') !== -1
      },
      rowToRowJoin () {
        return this.type.join || this.defaultRowToRowJoin
      },
      callId () {
        return this.gameid + '|' + this.type.id
      },
      // 根据玩法确定是否为组选
      o () {
        return ['+3-2-2', '+3-2-4', '+3-2-5', '3-2-2', '3-2-4', '3-2-5', '-3-2-2', '-3-2-4', '-3-2-5', '2-2-2', '2-4-2', '-1-1-4', '-1-2-4', '-1-2-6', '-1-2-7', '-3-2-2-SSL', '-3-2-4-SSL', '-3-2-5-SSL', '2-2-2-SSL', '2-4-2-SSL', '3-1-4-115', '2-1-4-115', '-1-2-2-115', '-1-2-3-115', '-1-2-4-115', '-1-2-5-115', '-1-2-6-115', '-1-2-7-115', '-1-2-8-115'].indexOf(this.type.id) !== -1
      },
      // 根据玩法确定是与其它行不能重复
      nr () {
        return ['3-1-5-115', '2-1-5-115', '-1-3-1-115', '-1-3-2-115', '-1-3-3-115', '-1-3-4-115', '-1-3-5-115', '-1-3-6-115', '-1-3-7-115', '-2-1-2-K3', '-3-1-2-K3', '2-1-2-K3'].indexOf(this.type.id) !== -1
      },
      // 根据玩法确定要显示的号码工作区
      rows () {
        return this.allRows.filter((row, index) => {
          let matchid = ((' ' + row.ids + ',').match(
            new RegExp(this.type.id.match(/^[+-]/) ? ('\\' + this.type.id + '(:\\d)*,') : '[^+-]' + this.type.id + '(:\\d)*,', 'g')
          ) || [])[0]
          if (matchid) {
            this.$set(row, 'id', matchid)
            // this.$set(row, 'index', index)
          }
          return matchid
        })
      },
      // 显示位置选择
      show () {
        // console.log(this.type.id, this.type.id.match(/^[+-]/), ('\\' + this.type.id + '(:\\d)*,'), '[^+-]' + this.type.id + '(:\\d)*,')
        // return this.ids.match(new RegExp('[^+-]*' + (this.type.id.match(/^[+-]/) ? ('\\' + this.type.id) : this.type.id), 'g'))
        return [this.ids.match(new RegExp(this.type.id.match(/^[+-]/) ? ('\\' + this.type.id + '(:\\d)*,') : '[^+-]' + this.type.id + '(:\\d)*,', 'g')), this.type.id === '-3-1-3-115' ? 1 : 0]
      },
      // 位置集合
      ps () {
        // return this.show ? this.positions.filter(p => p.selected).map(p => {
        //   return (p = p.value)
        // }) : this.nsl.map((l, i) => {
        //   return l > 0 && (l = 5 - i)
        // })
        return this.positions.filter(p => p.selected).map(p => {
          return (p = p.value)
        })
      },
      // 位置长度
      psl () {
        return this.positions.filter(p => p.selected).length
      },
      // 号码集的长度集
      nsl () {
        return this.ns.map(n => {
          return (n = n.length)
        })
      },
      // 重复号码长度
      r () {
        return this.ns.join(',').split(',').filter(n => n !== '').reduce((p, n) => {
          if (p[n] !== undefined) p.repeat += 1
          else p[n] = n
          return p
        }, {repeat: 0}).repeat
      },
      // 注数
      no () {
        // for return a legal string
        let x = N[this.type.id] ? N[this.type.id]({
          ns: this.ns,
          nsl: this.nsl,
          ps: this.ps,
          psl: this.psl,
          value: this.value.replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' '),
          r: this.r
        }) : 0
        // 1、  所有单式，输入一个正确投注后在输入一个不正确投注，报投注失败
        typeof x === 'object' && typeof x[1] === 'object' && this.$emit('set-nsns', x[1].join(this.rowToRowJoin), this.nsTitle.join(','), this.nsTimes.join(','))
        // return typeof x === 'object' ? x[0] : x
        return x
        // return N[this.type.id] ? N[this.type.id]({
        //   ns: this.ns,
        //   nsl: this.nsl,
        //   ps: this.ps,
        //   psl: this.psl,
        //   value: this.value,
        //   r: this.r
        // }) : 0
      },
      // 注数
      n () {
        return typeof this.no === 'object' ? this.no[0] : this.no
      },
      // win n 可能中奖的注数
      wn () {
        // console.log('id', this.type.id)
        // console.log({
        //   ns: this.ns,
        //   nsl: this.nsl,
        //   ps: this.ps,
        //   psl: this.psl,
        //   value: this.value.replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' '),
        //   r: this.r
        // })
        // console.log('wn', WN[this.type.id] ? WN[this.type.id]({
        //   ns: this.ns,
        //   nsl: this.nsl,
        //   ps: this.ps,
        //   psl: this.psl,
        //   value: this.value.replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' '),
        //   r: this.r
        // }) : 1)
        return WN[this.type.id] ? WN[this.type.id]({
          ns: this.ns,
          nsl: this.nsl,
          ps: this.ps,
          psl: this.psl,
          value: this.value.replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' '),
          r: this.r
        }) : 1
      },
      // 位置组合
      comb () {
        let min = this.allChecks.filter(check => check.ids.match(
          new RegExp('[^+-]*' + (this.type.id.match(/^[+-]/) ? ('\\' + this.type.id) : this.type.id), 'g')
        ))[0]
        return min ? C(this.positions.filter(p => p.selected).length, min.min) : 0
      },
      // 当输入型时， 注数的分隔符
      // has ,; ? ,; : ' '
      // separator () {
      //   return this.V.match(/[,;|]/g) ? /[,;|]+/g : /[\s]+/g
      // },
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      value: {
        get: function () {
          if (this.V.length > 10000) {
            this.$worker.run((V, type) => {
              if ((type.id.indexOf('-115') !== -1 || type.id.indexOf('-PK10') !== -1) && (V.match(/[,;|\n]+/g) || (!V.match(/[\d]{3}/g) && type.id !== '-1-2-1-115'))) {
                return V.replace(/ +/g, '').replace(/[,;|\s\n]+/g, ' ')
              } else {
                return V.replace(/[,;|\s]+/g, ' ')
              }
            }, [this.V, this.type])
            .then(result => {
              this.value = result
            })
            .catch(e => {
              // console.error(e)
            })
            return this.V
          }
          // C2
          // 如果是115
          // if there is no 010203 6 numbers together, take it as special
          if ((this.type.id.indexOf('-115') !== -1 || this.type.id.indexOf('-PK10') !== -1) && (this.V.match(/[,;|\n]+/g) || (!this.V.match(/[\d]{3}/g) && this.type.id !== '-1-2-1-115'))) {
            return this.V.replace(/ +/g, '').replace(/[,;|\s\n]+/g, ' ')
          } else {
            return this.V.replace(/[,;|\s]+/g, ' ')
          }
        },
        set: function () {
        }
      },
      // test () {
      //   return this.value.trim().replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' ')
      // },
      // testV () {
      //   return this.value.trim().replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' ').split(' ').length
      // },
      // // 无效号码提醒
      hasUnable () {
        return this.rows.length[0] || !this.value.replace(/\s+/g, '') ? false : this.value.trim().replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' ').split(' ').length !== (typeof this.no === 'object' ? this.no[1].length : this.no)
      }
    },
    watch: {
      type () {
        // 根据allChecks确定默认的checkbox选中效果
        this.positions.forEach(check => (check.selected = false))
        let min = this.allChecks.filter(check => check.ids.match(
          new RegExp('[^+-]*' + (this.type.id.match(/^[+-]/) ? ('\\' + this.type.id) : this.type.id), 'g')
        ))[0]
        if (min) {
          if (typeof min.ps === 'object') {
            min.ps.forEach(m => {
              this.positions[m].selected = true
            })
          } else if (typeof min.min === 'number') {
            for (let k = 0; k < min.min; k++) {
              this.positions[4 - k].selected = true
            }
          }
        }
        // this.__resetColumnActionBar()
      },
      n () {
        this.$emit('n-change', this.n, this.hasUnable)
      },
      wn () {
        this.$emit('wn-change', this.wn)
      },
      hasUnable () {
        this.$emit('n-change', this.n, this.hasUnable)
      },
      // 传递value值到父
      // value () {
      //   this.value = this.value.replace(/[^0-9,;\s]+/g, '').replace(/[,;|\s]+/g, ' ')
      //   this.removeRepeat()
      //   // this.$emit('set-nsns', this.value ? this.value.trim().replace(/\s{1,}/g, '|') : '')
      // },
      // C2
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      V (n, o) {
        // console.log(o, '=>', n)
        setTimeout(() => {
          if (this.V.length > 10000) {
            this.$worker.run((V) => {
              return V.replace(/[^0-9,;|\s]+/g, '').replace(/([,;|\n]){2,}/g, '$1')
            }, [this.V])
            .then(result => {
              this.V = result
              this.$el.querySelector('textarea') && (this.$el.querySelector('textarea').value = this.V)
              // this.value = result
            })
            .catch(e => {
              // console.error(e)
            })
            return this.V
          }
          this.V = this.V.replace(/[^0-9,;|\s]+/g, '').replace(/([,;|\n]){2,}/g, '$1')
          this.$el.querySelector('textarea') && (this.$el.querySelector('textarea').value = this.V)
        }, 0)
      },
      value () {
        this.removeRepeat()
      },
      rows () {
        this.titleSpan = this.rows.reduce((p, r) => {
          if (r.title) p = Math.max(p, r.title.length - Math.ceil((r.title.match(/\d/g) || []).length / 2))
          return p
        }, 0)
      },
      ns () {
        // fixed 当只有有join的时候才需要forEach *****
        this.ns.forEach((ns, i) => {
          // fixed 当只有有join的时候才这样做
          if (this.rows[i].join) this.ns[i] = ns.join(this.rows[i].join || ',')
        })
        // fixed 当只有有join的时候才需要forEach *****
        this.$emit('set-nsns', this.ns.join(this.rowToRowJoin), this.nsTitle.join(','), this.nsTimes.join(','), this.nsAtitle.join(','))
      },
      ps () {
        this.$emit('set-ps', this.ps)
      }
    },
    mounted () {
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) this.upload = false
      this.$emit('set-ps', this.ps)
    },
    methods: {
      __resetColumnActionBar () {
        Object.entries(this.columnBtns).forEach(([k, v]) => (this.columnBtns[k] = 0))
      },
      columnSelect (i) {
        this.__setCall({fn: !this.columnBtns[i] ? '__select' : '__unselect', args: i})
        this.columnBtns[i] = !this.columnBtns[i]
      },
      // 动态改变afters
      __setAfters (arg) {
        let x = arg[0]
        let y = arg[1]
        let z = arg[2]
        this.rows.forEach(r => {
          // set after for all numbers, if
          if (r.afters && r.afters[0] !== undefined) {
            r.afters = r.afters.map((n, i) => {
              if (!y) n = x
              else {
                n = arg[i] ? arg[i] : arg[arg.length - (i - arg.length) - 1]
              }
              return n
            })
          }
          if (r.values) {
            r.values.forEach(v => {
              if (v.after && !v.afterIndex) v.after = x
              if (v.after && v.afterIndex === 1) v.after = y
              if (v.after && v.afterIndex === 2) v.after = z
            })
          }
          if (r.afterONtitle) r.afterONtitle = x
          // else if (r.after) r.after = x
          // this.$set(r, 'afters', r.afters)
          // this.$set(this.allRows, r.index, r)
          // this.$set(this.allRows,)
        })
        this.__setCall({fn: '__updateNumberRow'})
      },
      // 动态改变type.id， 加上:5表示每行最多可以选择5个号码, 设置NumberRow.sl
      /*
       * @params n {number}:
      */
      __setRowsSl (n) {
        if (!n) return false
        setTimeout(() => {
          if (this.rows) {
            this.rows.forEach(r => {
              r.ids = (' ' + r.ids + ',').replace(
                new RegExp(this.type.id.match(/^[+-]/) ? ('\\' + this.type.id + '(:\\d)*,') : '[^+-]' + this.type.id + '(:\\d)*,', 'g'), ' ' + (n ? (this.type.id + ':' + n) : ' ' + this.type.id) + ','
              )
            })
          }
        }, 300)
      },
      // 随机选择一个号码
      __random ({continuee}) {
        if (!continuee) {
          let t = setInterval(() => {
            if (this.n === 0) {
              let m = Math.min.apply(Math, this.nsl)
              let i = this.nsl.lastIndexOf(m)
              let timeout = 0
              // if all rows.length === 1, we should trigger selected one by one
              if (this.rows.every(r => r.values && r.values.length === 1)) (timeout = 10) && (i = parseInt(Math.random() * this.rows.length))
              this.__setCall({fn: '__random', args: {continuee: true, rowIndex: i, timeout: timeout}})
            } else clearInterval(t)
          }, 500)
        }
      },
      __clearValue () {
        this.V = ''
        this.$el.querySelector('textarea') && (this.$el.querySelector('textarea').value = '')
        this.__resetColumnActionBar()
      },
      // 选择号码发生变化
      numbersChange () {
        this.ns = this.rows.map(r => {
          return (r = r.ns || [])
        })
        this.nsTitle = this.rows.filter(x => x.nsTitle).map(r => {
          return (r = r.nsTitle || '')
        })
        this.nsTimes = this.rows.filter(x => x.nsTimes).map(r => {
          return (r = r.nsTimes || '')
        })
        this.nsAtitle = this.rows.filter(x => x.nsAtitle).map(r => {
          return (r = r.nsAtitle || '')
        })
      },
      // on number row selecting
      select ({args}) {
        if (this.nr) {
          this.__setCall({
            fn: '__unselectSelectedNumber',
            args: args
          })
        }
      },
      selectFiles (evt) {
        let allowedFiles = 'text/plain'
        let files = evt.target.files
        Array.from(files).forEach(f => {
          if (f.type.indexOf(allowedFiles) !== -1) {
            // this.$worker.run((arg) => {
            //   console.log('Z!!Z!')
            //   // if ((this.type.id.indexOf('-115') !== -1 || this.type.id.indexOf('-PK10') !== -1) && (this.V.match(/[,;|]+/g) || (!this.V.match(/[\d]{3}/g) && this.type.id !== '-1-2-1-115'))) {
            //   //   return this.V.replace(/ +/g, '').replace(/[,;|\s]+/g, ' ')
            //   // } else {
            //   //   return this.V.replace(/[,;|\s]+/g, ' ')
            //   // }
            // }, ['hello'])
            // .then(result => {
            //   console.log(result, '???')
            //   // this.value = result
            // })
            // .catch(e => {
            //   // console.error(e)
            // })

            let reader = new window.FileReader()
            // reader.onerror = this.error
            // reader.onprogress = this.progress
            // reader.onabort = this.abort
            // reader.onloadstart = this.loadstart
            reader.onload = this.load
            // reader.onload = (evt) => {
            //   console.log(evt.target.result)
            //   this.$worker.run((arg) => {
            //     console.log('Z!!Z!')
            //     // if ((this.type.id.indexOf('-115') !== -1 || this.type.id.indexOf('-PK10') !== -1) && (this.V.match(/[,;|]+/g) || (!this.V.match(/[\d]{3}/g) && this.type.id !== '-1-2-1-115'))) {
            //     //   return this.V.replace(/ +/g, '').replace(/[,;|\s]+/g, ' ')
            //     // } else {
            //     //   return this.V.replace(/[,;|\s]+/g, ' ')
            //     // }
            //   }, [evt.target.result])
            //   .then(result => {
            //     console.log(result, '???')
            //     // this.value = result
            //   })
            //   .catch(e => {
            //     // console.error(e)
            //   })
            // }
            reader.readAsText(f, 'utf-8')
          }
        })
        this.$refs.file.value = ''
      },
      load (evt) {
        // console.log(evt.target.result)
        this.V += this.V ? ',' + evt.target.result : evt.target.result
      },
      // __removeRepeat () {
      //   if (this.removeRepeat()) {
      //     this.$modal.warn({
      //       content: '系统已经自动去除重复号！',
      //       btn: ['确定']
      //     })
      //   }
      //   this.__setCall({fn: '__order'})
      // },
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      // ****************************************************************************************************************************this.V
      removeRepeat () {
        if (this.V.length > 10000) {
          this.$worker.run((V, type, o, removeDuplicate) => {
            if ((type.id.indexOf('-115') !== -1 || type.id.indexOf('-PK10') !== -1) && V.match(/[,;|\n]+/g)) {
              R = removeDuplicate(V.replace(/ +/g, ''), /[,;|\s\n]+/, ',', o, 2)
            } else {
              R = removeDuplicate(V.trim(), /[,;|\s]+/, null, o, ((type.id.indexOf('-115') !== -1 || type.id.indexOf('-PK10') !== -1) ? 2 : 1))
            }
          }, [this.V, this.type, this.o, removeDuplicate])
          .then(result => {
            if (result.has) this.V = result.s
          })
          .catch(e => {
            // console.error(e)
          })
          return this.V
        }
        let R = null
        if ((this.type.id.indexOf('-115') !== -1 || this.type.id.indexOf('-PK10') !== -1) && this.V.match(/[,;|\n]+/g)) {
          R = removeDuplicate(this.V.replace(/ +/g, ''), /[,;|\s\n]+/, ',', this.o, 2)
        } else {
          R = removeDuplicate(this.V.trim(), /[,;|\s]+/, null, this.o, ((this.type.id.indexOf('-115') !== -1 || this.type.id.indexOf('-PK10') !== -1) ? 2 : 1))
        }
        if (R.has) this.V = R.s
        return R.has
      }
    },
    components: {
      GameNumberRow
    }
  }
</script>

<style lang="stylus">
@import '../var.stylus'
.column-action-bar
  padding-left 0.75rem
  .column-btn
    cursor pointer
    display inline-block
    text-align center
    width .4rem
    margin .05rem .02rem
    &:hover
      color BLUE


</style>



<style lang="stylus">
  .el-textarea
    box-sizing border-box
    textarea
      resize none
      // min-height 1.06rem
</style>
<style lang="stylus" scoped>
  @import '../var.stylus'
  .game-selection
    &:not(.iskq)
      background-color #fff !important

    padding .05rem 0

    .pos
      padding-left .3rem
  .el-textarea
    padding 0 .1rem 0 PWX

  .el-col
    min-height GCH
    line-height GCH
    &.btn-groups
      line-height 0
      .ds-button
        margin-bottom .085rem
        position relative
        &:last-child
          margin-bottom 0
        input
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          opacity 0
          width 100%

    &.notice
      font-size .12rem
      color #999
      line-height .2rem
      padding PW PWX
  .count
  .comb
    color DANGER

</style>
