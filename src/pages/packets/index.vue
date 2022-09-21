<template>
  <div v-permissions="'packet viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="packetItems"
      :header="packetHeader"
      :loading="loadingItems"
      :filters="packetFilter"
      :pagination="packetPagination"
      :add="packetAddPath"
      :delete="packetDeleteApi"
      :actions="packetActions"
      :permissions="packetPermissions"
      @applyFilter="getPacket($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
      @userCustomization="setPacketToUser($event)"
      @attribute="goToAttribute($event)"
    />
    <CustomizationUser v-if="customizationUserDialog.dialog" v-model="customizationUserDialog" @customizationUser="saveCustomizationUser" />
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
import CustomizationUser from '~/components/dialogs/CustomizationUser.vue'
export default {
  components:{
    DataTable , CustomizationUser
  },
  data() {
    return {
      packetItems : [],
      packetHeader : [
        { text: this.$t('packets.name'), value: 'name' },
        { text: this.$t('packets.price'), value: 'price' },
        { text: this.$t('packets.speed_down'), value: 'speed_down' },
        { text: this.$t('packets.speed_up'), value: 'speed_up' },
        { text: this.$t('packets.expirtion'), value: 'expirtion' },
        { text: this.$t('packets.cards_count'), value: 'cards_count' },
        { text: this.$t('packets.type'), value: 'type' },
        { text: this.$t('packets.status'), value: 'status' },
        { text: this.$t('packets.public'), value: 'public' },
        { text: this.$t('common.actions'), value: 'actions' }
          
      ],
      loadingItems : false ,
      packetFilter : {
        status : true , // filter is required
        items : [
          { placeHolder :  this.$t('packets.name') , key: 'filter[name]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('packets.status') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.active') , value : 'true' } , { name : this.$t('common.notActive') , value : 'false' }] , itemText : 'name' , itemId : 'value' } ,
          { placeHolder : this.$t('packets.public') , key: 'filter[public]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.public') , value : 'true' } , { name : this.$t('common.notPublic') , value : 'false' }] , itemText : 'name' , itemId : 'value' },
          { placeHolder : this.$t('packets.type') , key: 'filter[type]' , value : '' , type : 'autocomplete' , items: [{ name : 'ppp' , value : 'ppp' } , { name : 'hotspot' , value : 'hotspot' }, { name : 'any' , value : 'any' }] , itemText : 'name' , itemId : 'value' }  
        ]
      },
      packetPagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      packetPermissions:{
        show : 'packet view' ,
        showAny : 'packet viewAny' ,
        add : 'packet create' ,
        edit : 'packet update' ,
        delete : 'packet delete',
        restore : 'packet restore',
        packetUpdate : 'packet update' ,
        attributeView : 'attribute view'
      },
      packetAddPath : '/packets/add',
      packetDeleteApi : '' ,
      packetActions : ['edit' , 'delete' , 'user-customization' , 'attribute'],

      customizationUserDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
  created() {
    this.getPacket()
  },
  methods: {
    getPacket(query = `?page[number]=${this.packetPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.packetPagination.selectedPage}`
        }
      }

      this.loadingItems = true
      this.$axios
        .$get(`/admin/packet${query}`)
        .then((res) => {
          this.packetItems = res.data
          this.packetPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/packets/' + item.packetid + '/edit')
    },
    deleteItem(item) {
      this.packetDeleteApi = 'packet/' + item.packetid
    },
    setPacketToUser(item) {
      this.customizationUserDialog.selectedItem = item
      this.customizationUserDialog.dialog = true
    },
    saveCustomizationUser(data) {
      const dataForm = {
        user : []
      } 
 
      this.customizationUserDialog.loader = true
      dataForm.user = data.items.map(({ userid }) => userid)
      this.$axios.post(`/admin/packet/${this.customizationUserDialog.selectedItem.packetid}/permission` , dataForm).then((res) => {
        this.$store.dispatch('showSuccess', this.$t('common.success'))
      }).catch((err) => {
        this.$store.dispatch('showError', err.response.data.message)
      }).finally(() => {
        this.customizationUserDialog.dialog = false
        this.customizationUserDialog.loader = false
        data.items = [] 
      })

    } ,
    goToAttribute(item) {
      this.$router.push('/packets/' + item.packetid + '/edit-attribute')
    }

  },
  head() {
    return {
      title: this.$t('menu.packets')
    }
  }
}
</script>