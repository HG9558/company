<script>
export default {
  name: 'page',
  props: [],
  data () {
    return {
      fn: 'list',
      data: [],
      total: 0,
      pageSize: 15,
      currentPage: 1
    }
  },
  created () {
  },
  methods: {
    pageChanged (p) {
      typeof this[this.fn] === 'function' && this[this.fn](
        {
          page: p,
          pageSize: this.pageSize,
          p: p,
          pagesize: this.pageSize
        },
        () => {
          this.currentPage = p
        })
    }
  }
}
</script>

