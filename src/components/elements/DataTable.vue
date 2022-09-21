<template>
  <div>
    <v-expansion-panels v-if="filters.status" v-permissions="permissions.showAny" class="mb-2">
      <v-expansion-panel>
        <v-expansion-panel-header><h3 class="primary--text">{{ $t('common.filter') }}<v-btn v-if="this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter" class="mx-2" color="error" @click="removeFilter"><v-icon>mdi-filter-off-outline</v-icon> {{ $t('common.removeFilter') }}</v-btn></h3> </v-expansion-panel-header>
        <v-expansion-panel-content >
          <v-row class="justify-space-around mt-1">
            <v-col
              v-for="(item , index) in filters.items"
              :key="index" 
              v-permissions="item.rol || ''"
              cols="12"
              md="4"
              class="my-0 py-0"
            >
              <v-text-field
                v-if="item.type == 'text'"
                v-model="item.value"
                :label="item.placeHolder"
                outlined
                dense
                clearable
                @input="typeFilter"
              ></v-text-field>
              <v-autocomplete
                v-else-if="item.type == 'autocomplete' && !item.searchable"
                v-model="item.value"
                :label="item.placeHolder"
                outlined
                dense
                clearable
                :items="item.items"
                :item-text="item.itemText"
                :item-value="item.itemId"
                :no-data-text="$t('common.noDataAvailable')"
                @input="typeFilter"
              ></v-autocomplete>
              <v-autocomplete
                v-else-if="item.type == 'autocomplete' && item.searchable"
                v-model="item.value"
                :label="item.placeHolder"
                :search-input.sync="item.searchKey"
                outlined
                dense
                clearable
                :items="item.items"
                :item-text="item.itemText"
                :item-value="item.itemId"
                :no-data-text="$t('common.noDataAvailable')"
                @keyup="searchItems(index , item)"
                @focus="searchItems(index , item)"
                @click:clear="searchItems(index , item)"
                @input="typeFilter"
              ></v-autocomplete>
              <v-menu
                v-else-if="item.type == 'date'"
                v-model="item.menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="item.value"
                    :label="item.placeHolder"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    outlined
                    dense
                    clearable
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="item.value"
                  @input="interTime(item)"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row >
      <v-col cols="12" class="pt-0 pb-1">
        <v-btn v-if="add" v-permissions="permissions.add" color="primary" @click="addItem">
          {{ $t('common.add') }}
        </v-btn>
        <div v-if="otherAction.length != 0" class="d-inline-block pr-1">
          <v-btn
            v-for="(btn , index) in otherAction"
            :key="index"
            v-permissions="btn.permissions"
            class="ml-1"
            color="primary"
            @click="openDialog(btn.emit , index)"
          >
            {{ btn.text }}
          </v-btn>
        </div>
        
      </v-col>
    </v-row>
    <v-data-table
      v-model="selectable.items"
      :show-select="selectable.status"
      :headers="header"
      :items="items"
      :items-per-page="20"
      :loading="loading"
      hide-default-footer
      :item-key="selectable.itemKey"
      class="elevation-1"
    >
      <template v-slot:[`item.status`]="{ item }">
        <div>
          <v-icon v-if="item.status" color="success">
            mdi-check-circle-outline
          </v-icon>
          <v-icon v-else color="error">
            mdi-close-circle-outline
          </v-icon>
        </div>
      </template>
      <template v-slot:[`item.done_at`]="{ item }">
        <div>
          <span v-if="item.done_at">
            <span>{{ item.done_at }}</span>
            <v-icon color="success">
              mdi-check-circle-outline
            </v-icon>
          
          </span>
          <span v-else>
            <span>{{ $t('common.notCompleted') }}</span>
            <v-icon color="error">
              mdi-close-circle-outline
            </v-icon>
          </span>
        </div>
      </template>
      
      <template v-slot:[`item.price`]="{ item }">
        <div>
          {{ item.price + ' ' + item.currency }}
        </div>
      </template>

      <template v-slot:[`item.workingStatus`]="{ item }">
        <div>
          <span v-if="item.workingStatus " :title="$t('cards.itWorking')"><v-icon color="success">mdi-wifi</v-icon></span>
          <span v-else :title="$t('cards.itNotWorking')"><v-icon color="error">mdi-wifi-off</v-icon></span>
          
        </div>
      </template>

      <template v-slot:[`item.changeStatus`]="{ item }">
        <div>
          <v-switch
            v-if="item.status"
            v-model="item.status"
            :disabled="!hasPermission('card update')"
            inset
            color="success"
            :label="$t('common.active')"
            @change="$emit('changeStatus' , item)"
          >

          </v-switch>
          <v-switch
            v-else
            v-model="item.status"
            :disabled="!hasPermission('card update')"
            inset
            color="success"
            :label="$t('common.notActive')"
            @change="$emit('changeStatus' , item)"
          >
          </v-switch>
        </div>
      </template>
      <template v-slot:[`item.expiry_day`]="{ item }">
        <div>
          {{ item.expiry_day }} {{ $t('common.day') }}
        </div>
      </template>
      <template v-slot:[`item.customer_name`]="{ item }">
        <div>
          <span v-if="!item.customer_name" :title="$t('common.noUserCustomerName')"><v-icon color="warning" >mdi-account-cancel-outline</v-icon></span>
          <span v-else>{{ item.customer_name }}</span>
        </div>
      </template>
      <template v-slot:[`item.expirtion`]="{ item }">
        <div>
          {{ item.expirtion }} {{ $t('common.day') }}
        </div>
      </template>
      <template v-slot:[`item.public`]="{ item }">
        <div>
          <v-icon v-if="item.public" color="info">
            mdi-earth
          </v-icon>
          <v-icon v-else color="warning">
            mdi-image-filter-center-focus-strong-outline
          </v-icon>
        </div>
      </template>
      <template v-slot:[`item.speed_down`]="{ item }">
        <div>
          {{ convertSpeed(item.speed_down) }}
        </div>
      </template>
      <template v-slot:[`item.speed_up`]="{ item }">
        <div>
          {{ convertSpeed(item.speed_up) }}
        </div>
      </template>
      <template v-slot:[`item.bw_down_used`]="{ item }">
        <div>
          {{ item.bw_down_max ? Math.round(item.bw_down_used * 100 / item.bw_down_max * 100) / 100 + '  % ' : $t('common.unlimit') }} 
        </div>
      </template>
      <template v-slot:[`item.bw_up_used`]="{ item }">
        <div>
          {{ item.bw_up_max ? Math.round(item.bw_up_used * 100 / item.bw_up_max * 100) / 100 + ' % ' : $t('common.unlimit') }}  
        </div>
      </template>
      <template v-slot:[`item.bw_total_used`]="{ item }">
        <div>
          {{ item.bw_total_max ? Math.round(item.bw_total_used * 100 / item.bw_total_max * 100) / 100 + '  % ' : $t('common.unlimit') }} 
        </div>
      </template>
      <template v-slot:[`item.ref`]="{ item }">
        <div class="mt-1">
          <p class="mb-1"><b >{{ item.ref }} </b>   </p>
        </div>
      </template>
      <template v-slot:[`item.amount`]="{ item }">
        <div class="mt-1">
          <p class="mb-1"><v-chip style="width:90px" class="text-center d-block" small :color="item.amount > 0 ? 'success' : 'error' ">{{ item.amount + ' ' + item.currency }}</v-chip>   </p>
        </div>
      </template>
      <template v-slot:[`item.reference`]="{ item }">
        <div v-if="item.reference.billable">
          <NuxtLink v-if="Object.keys(item.reference.billable)[0] == 'user'" :to="localePath(`/users/${item.reference.billable.user.userid}/edit`)">
            {{ $t('billing.user' , { name: item.reference.billable.user.name }) }}
          </NuxtLink>
          <NuxtLink v-else-if="Object.keys(item.reference.billable)[0] == 'card'" :to="localePath(`/cards/${item.reference.billable.card.id}/edit`)">
            {{ $t('billing.card' , { username: item.reference.billable.card.username }) }}
          </NuxtLink>
          <!-- {{Object.keys(item.reference.billable)[0]}} -->
          <NuxtLink v-else-if="Object.keys(item.reference.billable)[0] == 'patch'" :to="localePath(`/patchcard/${item.reference.billable.patch.patchid}/show`)">
            {{ $t('billing.patch' ) }}
          </NuxtLink>
        </div>
      </template>
      <template v-slot:[`item.packet.name`]="{ item }">
        <NuxtLink v-if="item.packet" :to="localePath(`/packets/${item.packet.packetid}/edit`)">
          {{ item.packet.name }}
        </NuxtLink>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-btn
            v-if="actions.includes('edit')"
            v-permissions="permissions.show"
            :title="$t('common.edit')"
            small
            icon
            color="info"
            @click="updateItem(item)"
          >
            <v-icon small>mdi-circle-edit-outline </v-icon>
          </v-btn>
          <v-btn
            v-if="actions.includes('show')"
            v-permissions="permissions.show"
            :title="$t('common.show')"
            small
            icon
            color="info"
            @click="showItem(item)"
          >
            <v-icon small>mdi-eye-outline </v-icon>
          </v-btn>
          <v-btn
            v-if="actions.includes('add-permission')"
            v-permissions="permissions.rolUpdate"
            :title="$t('common.addPermission')"
            small
            icon
            color="warning"
            @click="addPermission(item)"
          >
            <v-icon small>mdi-image-filter-center-focus-strong-outline </v-icon>
          </v-btn>

          <v-btn
            v-if="actions.includes('add-balance')"
            v-permissions="permissions.moneyTransfer"
            :title="$t('common.addBalance')"
            small
            icon
            color="info"
            @click="addBalance(item)"
          >
            <v-icon small>mdi-cash-multiple </v-icon>
          </v-btn>

          <v-btn
            v-if="actions.includes('balance')"
            v-permissions="permissions.billingView"
            :title="$t('common.balanceList')"
            small
            icon
            color="success"
            @click="showBalanceList(item)"
          >
            <v-icon small>mdi-currency-usd </v-icon>
          </v-btn>

          <v-btn
            v-if="actions.includes('user-customization') && item.public == false "
            :title="$t('common.userCustomization')"
            small
            icon
            color="warning"
            @click="userCustomization(item)"
          >
            <v-icon small>mdi-image-filter-center-focus-strong-outline </v-icon>
          </v-btn>
          <v-btn
            v-if="actions.includes('attribute')"
            v-permissions="permissions.attributeView"
            :title="$t('common.attribute')"
            small
            icon
            color="success"
            @click="attribute(item)"
          >
            <v-icon small>mdi-cog-transfer-outline </v-icon>
          </v-btn>
          <v-btn
            v-if="actions.includes('delete')"
            v-permissions="permissions.delete"
            :title="$t('common.delete')"
            small
            icon
            color="error"
            @click="deleteItem(item)"
          >
            <v-icon small>mdi-trash-can-outline </v-icon>
          </v-btn>

        </div>
      </template>
    </v-data-table>

    <v-pagination
      v-model="pagination.selectedPage"
      v-permissions="permissions.showAny"
      class="my-4"
      :length="pagination.pagesCounts"
      :total-visible="7"
      circle
    ></v-pagination>
    <DeleteConfirm v-model="formDataDelete" />
  </div>
</template>
<script>
import DeleteConfirm from '~/components/confirm/delete.vue'
export default {
  components :{
    DeleteConfirm 
  },
  props:{
    items: {
      type: Array,
      default: () => []
    },
    header: {
      type: Array,
      default: () => []
    },
    loading :{
      type: Boolean,
      default: false
    },
    filters :{
      type: Object,
      default: null
    },
    pagination :{
      type: Object,
      default: null
    },
    permissions :{
      type: Object, 
      default : null,
      required: true
    },
    selectable : {
      type: Object, 
      default () {
        return {
          status: false ,
          items : [] 
        }
      },
      required: false
    },
    add: {
      type : String ,
      default: '' ,
      required: false
    },
    otherAction: {
      type : Array ,
      default: () => [] ,
      required: false
    },
    delete : {
      type : String ,
      default: '' ,
      required: false
    },
    actions:{
      type : Array ,
      default: () => [] ,
      required: false
    }
  },
  data() {
    return {
      timer : null ,
      formDataDelete : {
        deleteApi : this.delete ,
        dialog : false ,
        status : false 
      },
      speeds : [{ name : 'KB' , value : 1024 }, { name : 'MB' , value : 1048576 }, { name : 'GB' , value : 1073741824 }] ,
      bw_down_max : 1024,
      bw_down_max_wuth_spped : '' 
    }
  },
  watch: {
    'pagination.selectedPage': function (selectedPage) {
      let query = `?page[number]=${selectedPage}&` 

      for (let index = 0; index < this.filters.items.length; index++) {
        if (this.filters.items[index]['value']) {
          query += `${this.filters.items[index]['key']}=${this.filters.items[index]['value']}&`
        }
      }
      this.$emit('applyFilter' , query)
    },
    'formDataDelete.status' : function(status) {
      if (status) {
        let query = `?page[number]=${this.pagination.selectedPage}&`

        for (let index = 0; index < this.filters.items.length; index++) {
          if (this.filters.items[index]['value']) {
            query += `${this.filters.items[index]['key']}=${this.filters.items[index]['value']}&`
          }
        }
        this.$emit('applyFilter' , query)
        this.formDataDelete.status = false
      }
    } 
  },
  created() {
    this.checkFilterToGetData(this.filters.items)
  },
  methods: {
    interTime(item) {
      item.menu = false
      this.typeFilter()
    },
    removeFilter() {
      this.$router.push({ query: { 'queryFilter': '?' } } )
      for (let index = 0; index < this.filters.items.length; index++) {
        this.filters.items[index]['value'] = ''
      }
      this.$emit('applyFilter' , '?')
    },
    typeFilter() {
      const value = this.filters
      let query = '?'
 
      for (let index = 0; index < value.items.length; index++) {
        if (value.items[index]['value']) {
          query += `${value.items[index]['key']}=${value.items[index]['value']}&`
        }
      }

      this.$router.push({ query: { 'queryFilter': query } } )
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.pagination.selectedPage  = 1
        this.$emit('applyFilter' , query)
      }, 500)
    },
    searchItems(index , obj) {
      if (obj['key'] === 'filter[packetid]') {
        this.getPackets(index)
      } else if (obj['key'] === 'filter[userid]') {
        this.getUsers(index)
      }
    },
    checkFilterToGetData(myArray) {
      for (let index = 0; index < myArray.length; index++) {
        if (myArray[index]['key'] === 'filter[packetid]') {
          this.getPackets(index , myArray[index])
        }
        else if (myArray[index]['key'] === 'filter[userid]') {
          this.getUsers(index , myArray[index])
        }
        
      }
    },
    addItem() {
      this.$router.push(this.add)
    },
    getPackets(indexInFilter) {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.$axios
          .$get(`/admin/packet?filter[name]=${this.filters.items[indexInFilter]['searchKey'] || ''}`)
          .then((res) => {
            this.filters.items[indexInFilter]['items'] = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    },
    getUsers(indexInFilter) {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.$axios
          .$get(`/admin/user?filter[name]=${this.filters.items[indexInFilter]['searchKey'] || ''}`)
          .then((res) => {
            this.filters.items[indexInFilter]['items'] = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    },
    openDialog(emit , index) {
      this.$emit(emit ,  this.otherAction[index])
    },
    updateItem(item) {
      this.$emit('editItem', item)
    },
    showItem(item) {
      this.$emit('showItem', item)
    },
    addPermission(item) {
      this.$emit('addPermission', item)
    },
    addBalance(item) {
      this.$emit('addBalance', item)
    },
    userCustomization(item) {
      this.$emit('userCustomization', item)
    },
    attribute(item) {
      this.$emit('attribute', item)
    },
    showBalanceList(item) {
      this.$router.push('users/' + item.userid + '/billing')
    },
    deleteItem(item) {
      this.$emit('deleteItem', item)
      this.$nextTick(() => {
        this.formDataDelete.dialog = true
        this.formDataDelete.deleteApi = this.delete 
      })
    },
    convertSpeed(speed) {
      if (speed / 1024 < 1024) {   
        return  Math.round(speed / 1024 * 100) / 100  + ' KB'
      } else if (speed / 1024 / 1024 <= 1024) {
        return  Math.round(speed / 1024 / 1024 * 100) / 100  + ' MB'
      } else {
        return  Math.round(speed / 1024 / 1024 / 1024 * 100) / 100  + ' GB'
      }
    }
  }
}
</script>