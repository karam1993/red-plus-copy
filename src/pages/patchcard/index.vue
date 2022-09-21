<template>
  <div v-permissions="'patchcard viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="patchcardItems"
      :header="patchcardHeader"
      :loading="loadingItems"
      :filters="patchcardFilter"
      :pagination="patchcardPagination"
      :add="patchcardAddPath"
      :actions="patchcardActions"
      :permissions="patchcardPermissions"
      @showItem="showPatchcardItems($event)"
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
      patchcardItems : [],
      patchcardHeader : [
        { text: this.$t('patchcard.packetid'), value: 'packet.name' },
        { text: this.$t('patchcard.totalCount'), value: 'totalCount' },
        { text: this.$t('patchcard.done_at'), value: 'done_at' },
        { text: this.$t('common.actions'), value: 'actions' }   
      ],
      loadingItems : false ,
      patchcardFilter : {
        status : false , // filter is required
        items : []
      },
      patchcardPagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      patchcardPermissions:{
        show : 'patchcard view' ,
        showAny : 'patchcard viewAny' ,
        add : 'patchcard create'
      },
      patchcardAddPath : '/patchcard/add',
      patchcardActions : ['show']
    }
  },
  created() {
    this.getPatchcard()
  },
  methods: {
    getPatchcard(query = `?page[number]=${this.patchcardPagination.selectedPage}`) {
      this.loadingItems = true
      this.$axios
        .$get(`/admin/patchcard${query}`)
        .then((res) => {
          this.patchcardItems = res.data
          // this.patchcardItems.map((item) => (
          //   item.done_at = item.done_at !== null ? dateFormat(item.done_at, 'HH:MM dd-mm-yyyy') : null 
          // ))
          this.patchcardPagination.pagesCounts = res.meta.last_page

        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    showPatchcardItems(item) {
      this.$router.push('/patchcard/' + item.patchid + '/show')
    }

  },
  head() {
    return {
      title: this.$t('menu.patchcard')
    }
  }
}
</script>