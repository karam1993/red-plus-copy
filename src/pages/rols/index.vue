<template>
  <div v-permissions="'role viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="rolItems"
      :header="rolHeader"
      :loading="loadingItems"
      :filters="rolFilter"
      :pagination="rolPagination"
      :add="rolAddPath"
      :delete="rolDeleteApi"
      :actions="rolActions"
      :permissions="rolPermissions"
      @applyFilter="getRols($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
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
      rolItems : [],
      rolHeader : [
        { text: this.$t('rols.name'), value: 'name' },
        { text: this.$t('rols.guardName'), value: 'guard_name' },
        { text: this.$t('common.actions'), value: 'actions' }
          
      ],
      loadingItems : false ,
      rolFilter : {
        status : false , // filter is required
        items : [
          { placeHolder : 'name' , key: 'filter[name]' , value : '' , type : 'text' } ,
          { placeHolder : 'status' , key: 'filter[role]' , value : '' , type : 'text' } 
        ]
      },
      rolPagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      rolPermissions:{
        show : 'role view' ,
        showAny : 'role viewAny' ,
        add : 'role create' ,
        edit : 'role update' ,
        delete : 'role delete',
        restore : 'role restore'
      },
      rolAddPath : '/rols/add',
      rolDeleteApi : '' ,
      rolActions : ['edit' , 'delete']
    }
  },
  created() {
    this.getRols()
  },
  methods: {
    getRols(query = `?page[number]=${this.rolPagination.selectedPage}`) {
      this.loadingItems = true
      this.$axios
        .$get(`/admin/role${query}`)
        .then((res) => {
          this.rolItems = res.data
          this.rolPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/rols/' + item.id + '/edit')
    },
    deleteItem(item) {
      this.rolDeleteApi = 'role/' + item.id
    }

  },
  head() {
    return {
      title: this.$t('menu.rols')
    }
  }
}
</script>