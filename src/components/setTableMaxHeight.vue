<script>
  export default {
    data () {
      return {
        MH: 500
      }
    },
    mounted () {
      this.MH = this.$el.clientHeight - (this.TH || 300)
    }
  }
</script>