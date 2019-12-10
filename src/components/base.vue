<script>
  import store from '../store'
  export default {
    data () {
      return {
        // show header and footer by default
        hasHeader: false,
        hasFooter: false
      }
    },
    created () {
      store.actions.setHeader(this.hasHeader)
      store.actions.setFooter(this.hasFooter)
    },
    activated () {
      store.actions.setHeader(this.hasHeader)
      store.actions.setFooter(this.hasFooter)
    },
    methods: {
      /*
       *for login
       */
      setUser (user) {
        store.actions.setUser(user)
      },
      getUser () {
        return store.state.user
      },
      /*
       *for page
       */
      openPage (url) {
        store.actions.updateAllPages({active: false})
        return this.updatePage(url, {active: true, opened: true})
        // if (page && page.size === 'minus') this.updatePage(url, {size: ''}, page)
        // return page
      },
      updatePage (url, options, page) {
        return store.actions.updatePage(url, options, page)
      },
      setPages (pages) {
        store.actions.setPages(pages)
      }
    },
    events: {
    }
  }
</script>