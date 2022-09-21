<template>
  <div v-permissions="'nas viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="nasItems"
      :header="nasHeader"
      :loading="loadingItems"
      :filters="nasFilter"
      :pagination="nasPagination"
      :other-action="[checkServer , restartServer] "
      :add="nasAddPath"
      :delete="nasDeleteApi"
      :actions="nasActions"
      :permissions="nasPermissions"
      @applyFilter="getNases($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
      @checkServer="checkServerStatus($event)"
      @restartServer="resetartServers($event)"
    />
    <ServerStatus v-if="serverStatus.dialog" v-model="serverStatus" />
    <ConfirmServerRestart v-if="restartServerDialog.dialog" v-model="restartServerDialog" />
    
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
import ServerStatus from '~/components/confirm/server-status.vue'
import ConfirmServerRestart from '~/components/confirm/confirm-server-restart.vue'

export default {
  components:{
    DataTable , ServerStatus , ConfirmServerRestart
  },
  data() {
    return {
      nasItems : [],
      nasHeader : [
        { text: this.$t('nas.nasname'), value: 'nasname' },
        { text: this.$t('nas.secret'), value: 'secret' },
        { text: this.$t('common.actions'), value: 'actions' }
          
      ],
      loadingItems : false ,
      nasFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('nas.nasname') , key: 'filter[nasname]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('nas.shortname') , key: 'filter[shortname]' , value : '' , type : 'text' } 
        ]
      },
      serverStatus :{
        dialog : false
      },
      restartServerDialog :{
        dialog : false
      },
      checkServer : {
        text : this.$t('nas.checkServer') ,
        permissions : 'service view' ,
        emit : 'checkServer'
      },
      restartServer : {
        text : this.$t('nas.restartServer') ,
        permissions : 'service update' ,
        emit : 'restartServer'
      },
      nasPagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      nasPermissions:{
        show : 'nas view' ,
        showAny : 'nas viewAny' ,
        add : 'nas create' ,
        edit : 'nas update' ,
        delete : 'nas delete',
        restore : 'nas restore'
      },
      nasAddPath : '/nases/add',
      nasDeleteApi : '' ,
      nasActions : ['edit' , 'delete']
    }
  },
  created() {
    this.getNases()
  },
  methods: {
    getNases(query = `?page[number]=${this.nasPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.nasPagination.selectedPage}`
        }
      }

      this.loadingItems = true
      this.$axios
        .$get(`/admin/nas${query}`)
        .then((res) => {
          this.nasItems = res.data
          this.nasPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/nases/' + item.id + '/edit')
    },
    deleteItem(item) {
      this.nasDeleteApi = 'nas/' + item.id
    },
    checkServerStatus() {
      this.serverStatus.dialog = true
    },
    resetartServers() {
      this.restartServerDialog.dialog = true
    }

  },
  head() {
    return {
      title: this.$t('menu.nas')
    }
  }
}
</script>