<script>
import common from './common'
export default {
  mixins: [common],
  data () {
    return {
      gameType: 'KL8',
      menus: [
        // {id: '-1-1-1-KL8', title: '任选一', description: '从01-80中任选1个以上号码。', example: ''},
        // {id: '-1-1-2-KL8', title: '任选二', description: '从01-80中任选2至8个号码。', example: ''},
        // {id: '-1-1-3-KL8', title: '任选三', description: '从01-80中任选3至8个号码。', example: ''},
        // {id: '-1-1-4-KL8', title: '任选四', description: '从01-80中任选4至8个号码。', example: ''},
        // {id: '-1-1-5-KL8', title: '任选五', description: '从01-80中任选5至8个号码。', example: ''},
        // {id: '-1-1-6-KL8', title: '任选六', description: '从01-80中任选6至8个号码。', example: ''},
        // {id: '-1-1-7-KL8', title: '任选七', description: '从01-80中任选7或8个号码。', example: ''}
        {
          title: '任选',
          groups: [
            {
              // title: ''
              items: [
                {id: '-1-1-1-KL8', title: '任选一', description: '从01-80中任选1个及以上号码。', example: '投注方案：01； 开奖号码：01 * * * * * * * * * *，即中任选一。'},
                {id: '-1-1-2-KL8', title: '任选二', description: '从01-80中任选2个及以上号码。', example: '投注方案：01 02； 开奖号码：01 02 * * * * * * * * *，即中任选二。'},
                {id: '-1-1-3-KL8', title: '任选三', description: '从01-80中任选3个及以上号码。', example: '投注方案：01 02 03； 开奖号码：01 02 03 * * * * * * * *，即中任选三。'},
                {id: '-1-1-4-KL8', title: '任选四', description: '从01-80中任选4个及以上号码。', example: '投注方案：01 02 03 04； 开奖号码：01 02 03 04 * * * * * * *，即中任选四。'},
                {id: '-1-1-5-KL8', title: '任选五', description: '从01-80中任选5个及以上号码。', example: '投注方案：01 02 03 04 05； 开奖号码：01 02 03 04 05 * * * * * *，即中任选五。'},
                {id: '-1-1-6-KL8', title: '任选六', description: '从01-80中任选6个及以上号码。', example: '投注方案：01 02 03 04 05 06； 开奖号码：01 02 03 04 05 06 * * * * *，即中任选六。'},
                {id: '-1-1-7-KL8', title: '任选七', description: '从01-80中任选7个及以上号码。', example: '投注方案：01 02 03 04 05 06 07； 开奖号码：01 02 03 04 05 06 07 * * * *，即中任选七。'}
              ]
            }
          ]
        },
        {
          title: '趣味',
          groups: [
            {
              // title: ''
              items: [
                {id: '0-1-1-KL8', title: '上下盘', description: '20个开奖号码中“上盘(01-40)”与“下盘(41-80)”号码个数相比，上盘个数大于下盘个数，则为上盘，否则为下盘， 个数相等则为和盘', example: '投注方案：上盘；开奖号码中01-40占比超过10个，即中上下盘'},
                {id: '0-1-2-KL8', title: '奇偶盘', description: '0个开奖号码中“奇盘(奇数)”与“偶盘(偶数)”号码个数相比，奇盘个数大于偶盘个数，则为奇盘，否则为偶盘， 个数相等则为和盘', example: '投注方案：奇盘；开奖号码中奇数占比超过10个，即中奇偶盘'},
                {id: '0-1-3-KL8', title: '和值大小单双', description: '20个开奖号码总和值的“大(>810)小(<810)单双”属性组合。', example: '投注方案：大；20个开奖号码之和大于810，即中和值大小单双'},
                {id: '0-1-4-KL8', title: '五行', description: '开奖20个号码的总和分在5个波段中，5个波段以金、木、水、火、土命名：金（210～695）、木（696～763）、水（764～855）、火（856～923）和土（924～1410）', example: '投注方案：金；总和是693，即中五行'}
              ]
            }
          ]
        }
      ],
      // 玩法信息
      type: {
        id: '-1-1-1-KL8',
        // 玩法名
        title: '任选一',
        // 玩法描述
        description: '从01-80中任选1个及以上号码。'
      },
      // lucknumbers: [[50, 50, 50, 50, 50], [50, 50, 50, 50, 50], [50, 50, 50, 50, 50], [50, 50, 50, 50, 50]],
      lucknumbers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      getTitle () {
        switch (this.type.id.slice(0, 2)) {
          case '-1':
            return '任选'
          case '0-':
            return '趣味'
        }
      }
    }
  },
  methods: {
    getUpTitle () {
      switch (this.type.id.slice(0, 2)) {
        case '-1':
          return '任选'
        case '0-':
          return '趣味'
      }
    }
  }
}
</script>
