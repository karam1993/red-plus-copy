<template>
  <div v-permissions="'radlog viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="logsItems"
      :header="logsHeader"
      :loading="loadingItems"
      :filters="logsFilter"
      :pagination="logsPagination"
      :permissions="logsPermissions"
      @applyFilter="getLogs($event)"
    />
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
export default {
  components:{
    DataTable
  },
  data() {
    return {
      logsItems : [],
      logsHeader : [
        { text: this.$t('logs.username'), value: 'username' },
        { text: this.$t('logs.reply'), value: 'reply' },
        { text: this.$t('logs.message'), value: 'message' },
        { text: this.$t('logs.authdate'), value: 'authdate' } 
      ],
      loadingItems : false ,
      logsFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('logs.username') , key: 'filter[username]' , value : '' , type : 'text' } 
        ]
      },
      logsPagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      logsPermissions:{
        show : 'radlog view',
        showAny : 'radlog viewAny' 
        
      }
    }
  },
  created() {
    this.getLogs()
  },
  methods: {
    getLogs(query = `?page[number]=${this.logsPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.logsPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/radlog${query}`)
        .then((res) => {
          this.logsItems = res.data
          this.logsPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    }

  },
  head() {
    return {
      title: this.$t('menu.log')
    }
  }
}
</script>