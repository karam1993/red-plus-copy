<template>
  <div v-permissions="'session viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="sessionItems"
      :header="sessionHeader"
      :loading="loadingItems"
      :filters="sessionFilter"
      :pagination="sessionPagination"
      :delete="sessiondDeleteApi"
      :actions="sessionActions"
      :permissions="sessionPermissions"
      @deleteItem="deleteItem($event)"
      @applyFilter="getSessions($event)"
      @showItem="showSessionsData($event)"
    />
    <SessionsInfo v-model="sessionsData" />
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
import SessionsInfo from '~/components/dialogs/SessionsInfo.vue'
export default {
  components:{
    DataTable , SessionsInfo
  },
  data() {
    return {
      sessionItems : [],
      sessionHeader : [
        { text: this.$t('sessions.username'), value: 'username' },
        { text: this.$t('sessions.acctstarttime'), value: 'acctstarttime' },
        { text: this.$t('sessions.acctstoptime'), value: 'acctstoptime' },
        { text: this.$t('sessions.acctsessiontime'), value: 'acctsessiontime' },
        { text: this.$t('sessions.acctinputoctets'), value: 'acctinputoctets' },
        { text: this.$t('sessions.acctoutputoctets'), value: 'acctoutputoctets' },
        { text: this.$t('sessions.calledstationid'), value: 'calledstationid' },
        { text: this.$t('sessions.callingstationid'), value: 'callingstationid' },
        { text: this.$t('common.actions'), value: 'actions' , width:'100' }
          
      ],
      loadingItems : false ,
      sessionFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('sessions.username') , key: 'filter[username]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('sessions.framedipaddress') , key: 'filter[framedipaddress]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('sessions.calledstationid') , key: 'filter[calledstationid]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('sessions.callingstationid') , key: 'filter[callingstationid]' , value : '' , type : 'text' } 
          
        ]
      },
      sessionPagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      sessionPermissions:{
        show : 'session view' ,
        showAny : 'session viewAny'  ,
        delete : 'session delete'
        
      },
      sessionActions : ['show' , 'delete'] ,
      sessiondDeleteApi : '' ,
      sessionsData : {
        dialog : false,
        item : {}
      }
    }
  },
  created() {
    let filter = `?page[number]=${this.sessionPagination.selectedPage}`
 
    if (this.$route.query.username) {
      const index = this.sessionFilter.items.findIndex((item) => {
        return item.key === 'filter[username]'
      })

      this.sessionFilter.items[index]['value'] = this.$route.query.username      
      filter += '&filter[username]=' + this.$route.query.username
    }
    this.getSessions(filter)
  },
  methods: {
    getSessions(query = `?page[number]=${this.sessionPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.sessionPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/session${query}`)
        .then((res) => {
          this.sessionItems = res.data
          this.sessionPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    showSessionsData(item) {
      this.sessionsData.dialog = true
      this.sessionsData.item = item
    },
    deleteItem(item) {
      this.sessiondDeleteApi = 'session/' + item.id
    }

  },
  head() {
    return {
      title: this.$t('menu.sessions')
    }
  }
}
</script>