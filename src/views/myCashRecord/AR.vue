<script>
  import BaseAR from '../cashRecord/AR'
  export default {
    mixins: [BaseAR],
    props: ['menus'],
    data () {
      return {
        noname: true
      }
    }
  }
</script>
