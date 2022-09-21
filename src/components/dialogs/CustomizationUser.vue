<template>
  <v-dialog v-model="initialvalue.dialog" max-width="950">
    <v-card>
      <v-card-title class="headline">{{ $t('packets.customizationUser') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="(item , index ) in usersSelectable.items" :key="index" cols="12" md="4">
            <v-card>
              <v-card-title>
                <v-chip class="text-capitalize"> {{ item.name }} <v-icon small color="info" class="mr-1" @click="$router.push('users/'+item.userid+'/edit')">mdi-circle-edit-outline</v-icon></v-chip>
              </v-card-title>
              <v-card-text>
                <p class="mb-1"><b>{{ $t('user.email') }} : </b> <span class="float-left" style="font-size: 12px;">{{ item.email }}</span></p>
                <p class="mb-1"><b> {{ $t('user.mobile') }} : </b> <span class="float-left" style="font-size: 12px;">{{ item.mobile }}</span></p>
                <p class="mb-1"><b>{{ $t('user.lastlogin') }} : </b> <span class="float-left" style="font-size: 12px;">{{ item.lastlogin }}</span></p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <DataTable
          :selectable="usersSelectable"
          :items="userItems"
          :header="userHeader"
          :loading="loadingItems"
          :filters="userFilter"
          :pagination="userPagination"
          :permissions="userPermissions"
          @applyFilter="getUsers($event)"
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
      userItems : [],
      userHeader : [
        { text: this.$t('user.name'), value: 'name' },
        { text: this.$t('user.subid'), value: 'subid' },
        { text: this.$t('user.email'), value: 'email' },
        { text: this.$t('user.mobile'), value: 'mobile' },
        { text: this.$t('user.status'), value: 'status' },
        { text: this.$t('user.lastlogin'), value: 'lastlogin' }
      ],
      loadingItems : false ,
      userFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('user.name') , key: 'filter[name]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('user.email') , key: 'filter[email]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('user.mobile') , key: 'filter[mobile]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('user.subid') , key: 'filter[subid]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('user.roles') , key: 'filter[roles.id]' , value : '' , type : 'autocomplete' , items: [] , itemText : 'name' , itemId : 'id' } 
        ]
      },
      userPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      userPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : '',
        restore : '',
        forceDelete : ''
      },
      usersSelectable : {
        status : true ,
        itemKey : 'userid' ,
        items : [] 
      }
    }
  },
  created() {
    this.getUsers()
    this.getCustimizedUsersForPacket()
  },

  methods: {
    getUsers(query = `?page[number]=${this.userPagination.selectedPage}`) {
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
    getCustimizedUsersForPacket() {
      this.$axios
        .$get(`/admin/packet/${this.initialvalue.selectedItem.packetid}/permission`)
        .then((res) => {
          this.usersSelectable.items = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    save() {
      this.$emit('customizationUser' , this.usersSelectable)
    }
  }
}
</script>