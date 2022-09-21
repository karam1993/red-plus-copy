<template>
  <v-dialog v-model="initialvalue.dialog" max-width="750">
    <v-card>
      <v-card-title class="headline mb-2">{{$t('user.antherpermission')}}</v-card-title>
      <v-card-text>
        <DataTable
          :selectable="permissionSelectable"
          :items="permissionItems"
          :header="permissionHeader"
          :loading="loadingItems"
          :filters="permissionFilter"
          :pagination="permissionPagination"
          :permissions="listPermissions"
          @applyFilter="getPermission($event)"
        />

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="initialvalue.dialog = false">{{
          $t(`common.cancel`)
        }}</v-btn>
        <v-btn :loading="initialvalue.loader" color="primary" @click="save">{{
          $t(`common.save`)
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'
export default {
  components:{
    DataTable
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      initialvalue: this.value ,
      //   ----------------------
      permissionItems : [],
      permissionHeader : [
        { text: this.$t('rols.name'), value: 'name' },
        { text: this.$t('rols.guardName'), value: 'guard_name' }
      ],
      loadingItems : false ,
      permissionFilter : {
        status : false , // filter is required
        items : []
      },
      permissionPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      listPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : '',
        restore : '',
        forceDelete : ''
      },
      permissionSelectable : {
        status : true ,
        itemKey : 'id' ,
        items : [] 
      }
    }
  },
  created() {
    this.getPermission()
    this.getAnotherPermission()
  },

  methods: {
    getPermission(query = '?filter[guard_name]=isolated&page[size]=1000000') {
      this.loadingItems = true
      this.$axios
        .$get(`/admin/permission${query}`)
        .then((res) => {
          this.permissionItems = res.data
          this.permissionPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    getAnotherPermission() {
      this.$axios
        .$get(`/admin/user/${this.initialvalue.selectedItem.userid}/permission`)
        .then((res) => {
          this.permissionSelectable.items = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    save() {
      this.$emit('addPermission' , this.permissionSelectable)
    }
  }
}
</script>