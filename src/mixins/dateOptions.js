// 团队盈亏 tab 彩票，三方...  时间区间为：前三个月的1号到今天
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date() || time.getTime() < new Date()._setD(1)._bfM(-2)._setD(0).getTime()
        }
      }
    }
  }
}
