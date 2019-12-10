<script>
import common from './common'
export default {
  mixins: [common],
  data () {
    return {
      gameType: 'PCDD',
      menus: [
        {
          title: '趣味',
          groups: [
            {
              items: [
                {mutilpOrderPerRow: true, id: '1-1-1-PCDD', title: '和值', description: 'PC蛋蛋开奖结果来源于国家福利彩票北京快乐8开奖号码。\n北京快乐8每期开奖共开出20个数字，PC蛋蛋将这20个开奖号码按照由小到大的顺序依次排列；取其1-6位开奖号码相加，和值的末位数作为PC蛋蛋开奖第一个数值； 取其7-12位开奖号码相加，和值的末位数作为PC蛋蛋开奖第二个数值，取其13-18位开奖号码相加，和值的末位数作为PC蛋蛋开奖第三个数值；三个数值相加即为PC蛋蛋最终的开奖结果。', example: ''},
                {mutilpOrderPerRow: true, id: '1-1-2-PCDD', title: '极值', description: '开奖号码和值在0-5内为极小，和值范围在22-27为极大。', example: ''},
                {mutilpOrderPerRow: true, id: '1-1-3-PCDD', title: '大小单双', description: '开奖号码和值在0-13为小，14-27为大，单数为单，双数为双。', example: ''},
                {mutilpOrderPerRow: true, id: '1-1-4-PCDD', title: '大小单双组合', description: '开奖号码和值在0-13内且为双数为小双，反之为小单；开奖号码和值在14-27内且为双数为大双，反之为大单。', example: ''}
              ]
            }
          ]
        }
      ],
      // 玩法信息
      type: {
        id: '1-1-1-PCDD',
        // 玩法名
        title: '和值',
        // 玩法描述
        description: 'PC蛋蛋开奖结果来源于国家福利彩票北京快乐8开奖号码。\n北京快乐8每期开奖共开出20个数字，PC蛋蛋将这20个开奖号码按照由小到大的顺序依次排列；取其1-6位开奖号码相加，和值的末位数作为PC蛋蛋开奖第一个数值； 取其7-12位开奖号码相加，和值的末位数作为PC蛋蛋开奖第二个数值，取其13-18位开奖号码相加，和值的末位数作为PC蛋蛋开奖第三个数值；三个数值相加即为PC蛋蛋最终的开奖结果。',
        join: '|',
        mutilpOrderPerRow: true
      },
      lucknumbers: ['01', '01', '01', '01', '01', '01', '01'],
      getTitle () {
        switch (this.type.id.slice(0, 2)) {
          case '1-':
            return '趣味'
        }
      }
    }
  },
  methods: {
    getUpTitle () {
      switch (this.type.id.slice(0, 2)) {
        case '1-':
          return '趣味'
      }
    }
  }
}
</script>
