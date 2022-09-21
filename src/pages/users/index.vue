<template>
  <div v-permissions="'user viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="userItems"
      :header="userHeader"
      :loading="loadingItems"
      :filters="userFilter"
      :pagination="userPagination"
      :add="userAddPath"
      :delete="userDeleteApi"
      :actions="userActions"
      :permissions="userPermissions"
      @applyFilter="getUsers($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
      @addPermission="addAutherPermission($event)"
      @addBalance="openDialogAddBalance($event)"
    />
    <AddPermission v-if="addPermissionDialog.dialog" v-model="addPermissionDialog" @addPermission="saveAddPermission" />
    <AddBalance v-if="BalanceData.dialog" v-model="BalanceData" />
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
import AddPermission from '~/components/dialogs/AddPermission.vue'
import AddBalance from '~/components/dialogs/addBalance.vue'

export default {
  components:{
    DataTable , AddPermission , AddBalance
  },
  data() {
    return {
      userItems : [],
      userHeader : [
        { text: this.$t('user.name'), value: 'name' },
        { text: this.$t('user.subid'), value: 'subid' },
        { text: this.$t('user.email'), value: 'email' },
        { text: this.$t('user.mobile'), value: 'mobile' },
        { text: this.$t('user.status'), value: 'status' },
        { text: this.$t('user.lastlogin'), value: 'lastlogin' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      userFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('user.name') , key: 'filter[name]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('user.email') , key: 'filter[email]' , value : '' , type : 'text'  } ,
          { placeHolder : this.$t('user.mobile') , key: 'filter[mobile]' , value : '' , type : 'text'  } ,
          { placeHolder : this.$t('user.subid') , key: 'filter[subid]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('user.roles') , key: 'filter[roles.id]' , value : '' , type : 'autocomplete' , items: [] , itemText : 'name' , itemId : 'id'  , rol : 'role viewAny' } 
        ]
      },
      userPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      userPermissions:{
        show : 'user view' ,
        showAny : 'user viewAny' ,
        add : 'user create' ,
        edit : 'user update' ,
        delete : 'user delete',
        restore : 'user restore',
        forceDelete : 'user forceDelete',
        rolUpdate : 'role update' ,
        billingView : 'billing view' ,
        moneyTransfer : 'money transfer'
      },
      userAddPath : '/users/add',
      userDeleteApi : '' ,
      userActions : ['edit' , 'delete' , 'add-permission' , 'balance' , 'add-balance'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      },
      BalanceData : {
        dialog : false,
        userID : null ,
        dataForm : {
          amount : '' ,
          description : '' 
        },
        status : false 
      }
    }
  },
  watch : {
    'BalanceData.status' : function(status) {
      if (status) {
        
        this.getBilling()
        this.BalanceData.status = false
      }
    } 
  },

  created() {
    this.getUsers()
    if (this.hasPermission('role viewAny')) {
      this.getRols()
    }
  },
  methods: {
    openDialogAddBalance(item)  {
      if (this.$auth.user.User.userid === Number(item.userid)) {
        this.$store.dispatch('showError', this.$t('billing.sameUserError'))
        
        return
      }
      this.BalanceData.dialog = true
      this.BalanceData.userID = item.userid
    },
    getUsers(query = `?page[number]=${this.userPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.userPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/user${query}`)
        .then((res) => {
          this.userItems = res.data
          this.userPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    getRols() {
      this.$axios
        .$get('/admin/role?page[size]=100000')
        .then((res) => {
          const index = this.userFilter.items.findIndex((item) => {
            return item.key === 'filter[roles.id]'
          })

          this.userFilter.items[index]['items'] = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    goToEditItem(item) {
      this.$router.push('/users/' + item.userid + '/edit')
    },
    addAutherPermission(item) {
      this.addPermissionDialog.selectedItem = item
      this.addPermissionDialog.dialog = true
    },
    saveAddPermission(data) {
      const dataForm = {
        permission : []

      } 
 
      this.addPermissionDialog.loader = true
      dataForm.permission = data.items.map(({ id }) => id)
      this.$axios.post(`/admin/user/${this.addPermissionDialog.selectedItem.userid}/permission` , dataForm).then((res) => {
        this.$store.dispatch('showSuccess', this.$t('common.success'))

      }).catch((err) => {
        this.$store.dispatch('showError', err.response.data.message)
      }).finally(() => {
        this.addPermissionDialog.dialog = false
        this.addPermissionDialog.loader = false
        data.items = [] 
      })

    },
    deleteItem(item) {
      this.userDeleteApi = 'user/' + item.userid
    }
  },
  head() {
    return {
      title: this.$t('menu.users')
    }
  }
}
</script>