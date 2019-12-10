<script>
import common from './common'
export default {
  mixins: [common],
  data () {
    return {
      gameType: 'HC6',
      menus: [
        {
          title: '特码',
          groups: [
            {
              items: [
                {mutilpOrderPerRow: true, id: '1-1-1-HC6', title: '特码', description: '香港六合彩公司当期开出的最后一码为特别号或特码', example: '投注方案：08； 开奖号码最后一位为08，即中特码。'},
                {mutilpOrderPerRow: true, id: '1-1-2-HC6', title: '正码', description: '香港六合彩公司当期开出之前6个号码叫正码。每一个号码为一投注组合，假如投注号码为开奖号码之 正码，视为中奖，其余情形视为不中奖。', example: '投注方案：08；开奖号码前6位出现一次08， 即中正码'},
                {mutilpOrderPerRow: true, join: ',', id: '1-1-3-HC6', title: '特肖', description: '香港六合彩公司当期开出的最后一码为特别号或特码, 特码所属的生肖称为特肖', example: '投注方案：鼠； 开奖号码最后一位所属生肖为鼠，即中特肖。'},
                {mutilpOrderPerRow: true, join: ',', id: '3-1-1-HC6', title: '色波', description: '香港六合彩公司当期开出的最后一码为特别号或特码, 特码所属的色彩称为色波', example: '投注方案：红波； 开奖号码最后一位所属色彩为红波，即中色波。'}

                // {id: '1-1-3-HC6', title: '正码特', description: '正码特是指 正1特、正2特、正3特、正4特、正5特、正6特：其下注的正码特号与现场摇珠开出之正码其开奖顺序及开奖号码相同，视为中奖，如现场摇珠第一个正码开奖为49号，下注第一个正码特为49则视为中奖，其它号码视为不中奖。。', example: ''}
              ]
            }
          ]
        },
        {
          title: '连肖',
          groups: [
            {
              items: [
                {join: ',', id: '2-1-4-HC6', title: '一 肖', description: '依选择的连肖类别挑选 1 个生肖（排列如同生肖）为一个组合，当期的开奖号码 （六个正码及特码）座落于所勾选之生肖组合所属号码内，且所勾选之生肖皆至少有中一个号码，则视为中奖；其余情形一律视为不中奖；若选择的生肖组合内有包含本年生肖则称之为正肖，没有包含本年生肖则称之为平肖，正肖与平肖的中奖赔率不同(请注意49亦算输赢，不为和)。', example: '投注方案：鼠；开奖号码中只要出现[鼠]， 即中1 肖'},
                {join: ',', id: '2-1-1-HC6', title: '2连肖', description: '依选择的连肖类别挑选 2 ～ 4 个生肖（排列如同生肖）为一个组合，当期的开奖号码 （六个正码及特码）座落于所勾选之生肖组合所属号码内，且所勾选之生肖皆至少有中一个号码，则视为中奖；其余情形一律视为不中奖；若选择的生肖组合内有包含本年生肖则称之为正肖，没有包含本年生肖则称之为平肖，正肖与平肖的中奖赔率不同(请注意49亦算输赢，不为和)。', example: '投注方案：鼠、虎；开奖号码中任意的2位出现[鼠虎]或[虎鼠]， 即中2连肖'},
                {join: ',', id: '2-1-2-HC6', title: '3连肖', description: '依选择的连肖类别挑选 2 ～ 4 个生肖（排列如同生肖）为一个组合，当期的开奖号码 （六个正码及特码）座落于所勾选之生肖组合所属号码内，且所勾选之生肖皆至少有中一个号码，则视为中奖；其余情形一律视为不中奖；若选择的生肖组合内有包含本年生肖则称之为正肖，没有包含本年生肖则称之为平肖，正肖与平肖的中奖赔率不同(请注意49亦算输赢，不为和)。', example: '投注方案：鼠、虎、龙；开奖号码中任意的3位出现[鼠虎龙]，顺序不限， 即中3连肖'},
                {join: ',', id: '2-1-3-HC6', title: '4连肖', description: '依选择的连肖类别挑选 2 ～ 4 个生肖（排列如同生肖）为一个组合，当期的开奖号码 （六个正码及特码）座落于所勾选之生肖组合所属号码内，且所勾选之生肖皆至少有中一个号码，则视为中奖；其余情形一律视为不中奖；若选择的生肖组合内有包含本年生肖则称之为正肖，没有包含本年生肖则称之为平肖，正肖与平肖的中奖赔率不同(请注意49亦算输赢，不为和)。', example: '投注方案：鼠、虎、龙、马；开奖号码中任意的4位出现[鼠虎龙马]，顺序不限， 即中4连肖'}
              ]
            }
          ]
        },
        {
          title: '大小单双',
          groups: [
            {
              items: [
                {mutilpOrderPerRow: true, id: '4-1-1-HC6', title: '正一码', description: '对开奖号码的第一位形态(大/小/单/双)进行购买，所选形态与开奖号码对应位置的形态相同，即为中奖。', example: '投注方案：小双；开奖号码第一位为小或者双，即中大小单双。'},
                {mutilpOrderPerRow: true, id: '4-1-2-HC6', title: '正二码', description: '对开奖号码的第二位形态(大/小/单/双)进行购买，所选形态与开奖号码对应位置的形态相同，即为中奖。', example: '投注方案：小双；开奖号码第二位为小或者双，即中大小单双。'},
                {mutilpOrderPerRow: true, id: '4-1-3-HC6', title: '正三码', description: '对开奖号码的第三位形态(大/小/单/双)进行购买，所选形态与开奖号码对应位置的形态相同，即为中奖。', example: '投注方案：小双；开奖号码第三位为小或者双，即中大小单双。'},
                {mutilpOrderPerRow: true, id: '4-1-4-HC6', title: '正四码', description: '对开奖号码的第四位形态(大/小/单/双)进行购买，所选形态与开奖号码对应位置的形态相同，即为中奖。', example: '投注方案：小双；开奖号码第四位为小或者双，即中大小单双。'},
                {mutilpOrderPerRow: true, id: '4-1-5-HC6', title: '正五码', description: '对开奖号码的第五位形态(大/小/单/双)进行购买，所选形态与开奖号码对应位置的形态相同，即为中奖。', example: '投注方案：小双；开奖号码第五位为小或者双，即中大小单双。'},
                {mutilpOrderPerRow: true, id: '4-1-6-HC6', title: '正六码', description: '对开奖号码的第六位形态(大/小/单/双)进行购买，所选形态与开奖号码对应位置的形态相同，即为中奖。', example: '投注方案：小双；开奖号码第六位为小或者双，即中大小单双。'},
                {mutilpOrderPerRow: true, id: '4-1-7-HC6', title: '特码', description: '对开奖号码的特码位形态(大/小/单/双)进行购买，所选形态与开奖号码对应位置的形态相同，即为中奖。', example: '投注方案：小双；开奖号码特码位为小或者双，即中大小单双。'},
                {mutilpOrderPerRow: true, id: '4-1-8-HC6', title: '正特和值', description: '对开奖号码的各位之和形态(大/小/单/双)进行购买，所选形态与开奖号码各位之和的形态相同，即为中奖。', example: '投注方案：小双；开奖号码各位之和为小或者双，即中大小单双。'}
              ]
            }
          ]
        },
        {
          title: '尾数',
          groups: [
            {
              items: [
                {mutilpOrderPerRow: true, id: '5-1-1-HC6', title: '1尾', description: '对任意一位开奖号码的最后一位进行购买，所选尾数号码与任意一位开奖号码的尾数相同，即为中奖。', example: '投注方案：0尾；开奖号包含10，即中尾数; 其中0尾为一等奖，其它为二等奖'}
              ]
            }
          ]
        }
        // {
        //   title: '波色',
        //   groups: [
        //     {
        //       items: [
        //         {mutilpOrderPerRow: true, join: ',', id: '3-1-1-HC6', title: '波色', description: '', example: ''}
        //       ]
        //     }
        //   ]
        // }
      ],
      // 玩法信息
      type: {
        id: '1-1-1-HC6',
        // 玩法名
        title: '特码',
        // 玩法描述
        description: '香港六合彩公司当期开出的最后一码为特别号或特码',
        join: '|',
        mutilpOrderPerRow: true
      },
      lucknumbers: ['01', '01', '01', '01', '01', '01', '01'],
      getTitle () {
        switch (this.type.id.slice(0, 2)) {
          case '1-':
            return '特码'
          case '2-':
            return '连肖'
          case '3-':
            return '特码'
          case '4-':
            return '大小单双'
          case '5-':
            return '尾数'
        }
      }
    }
  },
  methods: {
    getUpTitle () {
      switch (this.type.id.slice(0, 2)) {
        case '1-':
          return '特码'
        case '2-':
          return '连肖'
        case '3-':
          return '特码'
        case '4-':
          return '大小单双'
        case '5-':
          return '尾数'
      }
    }
  }
}
</script>
