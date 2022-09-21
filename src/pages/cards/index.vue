<template>
  <div v-permissions="'card viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="cardItems"
      :header="cardHeader"
      :loading="loadingItems"
      :filters="cardFilter"
      :pagination="cardPagination"
      :actions="cardActions"
      :delete="cardDeleteApi"
      :add="cardAddPath"
      :permissions="cardPermissions"
      @applyFilter="getCards($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
      @changeStatus="changeStatus($event)"
      @attribute="goToAttribute($event)"
    />
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
// import dateFormat, { masks } from 'dateformat'

export default {
  components:{
    DataTable
  },
  data() {
    return {
      cardItems : [],
      cardHeader : [
        { text: this.$t('cards.username'), value: 'username' },
        { text: this.$t('cards.customer_name'), value: 'customer_name' },
        { text: this.$t('cards.start_at'), value: 'start_at' },
        { text: this.$t('cards.end_at'), value: 'end_at' },
        { text: this.$t('packets.expirtion'), value: 'expiry_day' },
        { text: this.$t('cards.bw_total_used'), value: 'bw_total_used' },
        { text: this.$t('cards.workingStatus'), value: 'workingStatus' },
        { text: this.$t('cards.status'), value: 'changeStatus' },
        { text: this.$t('common.actions'), value: 'actions' , width:'160' } 
          
      ],
      loadingItems : false ,
      cardFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('cards.username') , key: 'filter[username]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('cards.customer_name') , key: 'filter[customer_name]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('cards.status') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.active') , value : 'true' } , { name : this.$t('common.notActive') , value : 'false' }] , itemText : 'name' , itemId : 'value' } ,
          { placeHolder : this.$t('cards.packet') , key: 'filter[packetid]' , value : '' , type : 'autocomplete' , searchable : true , searchKey : '', items: [] , itemText : 'name' , itemId : 'packetid' } ,
          { placeHolder : this.$t('cards.fap') , key: 'filter[is_fap]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('cards.is_fap') , value : 'true' } , { name : this.$t('cards.is_not_fap') , value : 'false' }] , itemText : 'name' , itemId : 'value' } ,
          { placeHolder : this.$t('cards.user') , key: 'filter[userid]' , value : '' , type : 'autocomplete' , searchable : true , searchKey : '' , items: [] , itemText : 'name' , itemId : 'userid' } 
        ]
      },
      cardPagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      cardPermissions:{
        show : 'card view' ,
        showAny : 'card viewAny' ,
        add : 'card create' ,
        edit : 'card update' ,
        delete : 'card delete',
        restore : 'card restore',
        attributeView : 'attribute view'
      },
      cardAddPath : '/cards/add',
      cardDeleteApi : '' ,
      cardActions : ['edit', 'delete', 'attribute']
    }
  },
  mounted() {

    if (!this.$route.query.userid) {
      this.getCards()
    }
    if (this.$route.query.userid) {
      this.getUsers() 
    }
  },
  methods: {
    getCards(query = `?page[number]=${this.cardPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.cardPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/card${query}`)
        .then((res) => {
          this.cardItems = res.data
          this.cardPagination.pagesCounts = res.meta.last_page
          // this.cardItems.map((item) => (
          //   item.start_at = item.start_at !== '' ? dateFormat(item.start_at, 'HH:MM dd-mm-yyyy') : '' ,
          //   item.end_at = item.end_at !== '' ? dateFormat(item.end_at, 'HH:MM dd-mm-yyyy') : '' 
          // ))
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    deleteItem(item) {
      this.cardDeleteApi = 'card/' + item.id
    },
    // getPackets() {
    //   this.$axios
    //     .$get('/admin/packet?page[size]=100000')
    //     .then((res) => {
    //       const index = this.cardFilter.items.findIndex((item) => {
    //         return item.key === 'filter[packetid]'
    //       })

    //       this.cardFilter.items[index]['items'] = res.data
    //     }).catch((err) => {
    //       this.$store.dispatch('showError', err.response.data.message)
    //     })
    // },
    getUsers(name) {
      this.$axios
        .$get('/admin/user?filter[name]=' + name)
        .then((res) => {
          const index = this.cardFilter.items.findIndex((item) => {
            return item.key === 'filter[userid]'
          })

          this.cardFilter.items[index]['items'] = res.data
          this.cardFilter.items[index]['items'].push({ 'name' : this.$route.query.name , 'userid' : Number(this.$route.query.userid) })
          this.cardFilter.items[index]['value'] = Number(this.$route.query.userid)          

        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    goToEditItem(item) {
      this.$router.push('/cards/' + item.id + '/edit')
    },
    checkStatus(id , item) {
      this.$axios
        .$get(`/admin/card/${id}`)
        .then((res) => {
          if (res.data.status !== item.status) {
            item.status = !item.status
          }          
        })
    },
    changeStatus(item) {
      let endPoint = ''
 
      if (item.status) {
        endPoint = `admin/card/${item.id}/activate`
      } else {
        endPoint = `admin/card/${item.id}/deactivate`
      }
      this.$axios
        .$put(endPoint)
        .then(() => {
          this.$store.dispatch('showSuccess', this.$t('common.success'))
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.checkStatus(item.id , item)
        })
    },
    goToAttribute(item) {
      this.$router.push('/cards/' + item.id + '/edit-attribute')
    }
  },
  head() {
    return {
      title: this.$t('menu.cards')
    }
  }
}
</script>