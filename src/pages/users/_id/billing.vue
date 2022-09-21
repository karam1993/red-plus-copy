<template>
  <div v-permissions="'billing viewAny'" class="d-flex flex-grow-1 flex-column" >
    <DataTable
      :items="billingItems"
      :header="billingHeader"
      :loading="loadingItems"
      :other-action="[billingAddBalance , billingOpenPrintBalance] "
      :filters="billingFilter"
      :pagination="billingPagination"
      :permissions="billingPermissions"
      @applyFilter="getBilling($event)"
      @addBalanceDialog="addBalance($event)"
      @openBalancePrintDialog="balancePrint($event)"   
    />
    <AddBalance v-model="BalanceData" />
    
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
import AddBalance from '~/components/dialogs/addBalance.vue'

// import dateFormat, { masks } from 'dateformat'
export default {
  components:{
    DataTable , AddBalance
  },
  data() {
    return {
      billingItems : [],
      billingHeader : [
        { text: this.$t('billing.amount'), value: 'amount' },
        { text: this.$t('billing.billable'), value: 'reference' },
        { text: this.$t('billing.description'), value: 'description' },
        { text: this.$t('billing.created_at'), value: 'created_at' }
      ],
      loadingItems : false ,
      billingFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('billing.from_date') , key: 'filter[from_date]' , value : '' , type : 'date' , menu : false } ,
          { placeHolder : this.$t('billing.to_date') , key: 'filter[to_date]' , value : '' , type : 'date' , menu : false }
        ]
      },
      billingPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      billingPermissions:{
        showAny : 'billing viewAny' ,
        show : 'billing view'
        
      },
      billingAddBalance : {
        text : this.$t('billing.addAmount') ,
        permissions : 'money transfer' ,
        emit : 'addBalanceDialog'
      },
      billingOpenPrintBalance : {
        text : this.$t('billing.printBilling') ,
        permissions : 'billing viewAny' ,
        emit : 'openBalancePrintDialog'
      },
      dialogInvoice : false ,
      BalanceData : {
        dialog : false,
        userID : this.$route.params.id ,
        dataForm : {
          amount : '' ,
          description : '' 
        },
        status : false 
      },
      filterTime  : [] 
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
    this.getBilling()
  },
  methods: {
    getBilling(query = `?page[number]=${this.billingPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.billingPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/user/${this.$route.params.id}/billing${query}&sort[id]=-id`)
        .then((res) => {
          this.billingItems = res.data
          // this.billingItems.map((item) => (
          //   item.control_at = item.control_at !== '' ? dateFormat(item.control_at, 'HH:MM dd-mm-yyyy') : '' ,
          //   item.created_at = item.created_at !== '' ? dateFormat(item.created_at, 'HH:MM dd-mm-yyyy') : '' 
            
          // ))
          this.billingPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    addBalance() {
      if (this.$auth.user.User.userid === Number(this.$route.params.id)) {
        this.$store.dispatch('showError', this.$t('billing.sameUserError'))

        return
      }
      this.BalanceData.dialog = true
    },
    balancePrint() {
      this.filterTime = []
      for (let index = 0; index < this.billingFilter.items.length; index++) {
        if (this.billingFilter.items[index]['value'] ) {
          if (this.billingFilter.items[index]['key'] === 'filter[from_date]' || this.billingFilter.items[index]['key'] === 'filter[to_date]') {
            this.filterTime.push({ name : this.billingFilter.items[index]['placeHolder'] ,  filter : this.billingFilter.items[index]['key']  , value : this.billingFilter.items[index]['value']  })
          }
        } 
      }

      this.$store.commit('setFilterInvoice', this.filterTime ) 
      this.$nextTick(() => {
        this.$router.push(`/users/${this.$route.params.id}/billing-print`)
      })

    }

  },
  head() {
    return {
      title: this.$t('menu.billing')
    }
  }
}
</script>