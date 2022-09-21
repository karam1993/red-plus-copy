<template>
  <div v-permissions="'card create'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="6" md="3" class="pb-0 pt-1">
              <v-autocomplete
                v-model="selectedUser"
                :search-input.sync="keySearchUser"
                :label="$t('cards.user')"
                outlined
                :items="usersActive"
                item-text="name"
                item-value="userid"
                dense
                :no-data-text="$t('common.noDataAvailable')"
                return-object
                @keyup="getUsers"
                @change="selectUserName"
              ></v-autocomplete>
            </v-col>

            <v-col cols="6" md="3" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.customer_name"
                :label="$t('cards.customer_name')"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.username"
                :label="$t('cards.username')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.password"
                :label="$t('cards.password')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete
                v-model="dataForm.packetid"
                :items="packetsActive"
                :rules="[required]"
                :label="$t('cards.packet')"
                outlined
                dense
                item-text="name"
                item-value="packetid"
                :no-data-text="$t('common.noDataAvailable')"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        v-for="(cur , index) in item.converter"
                        :key="index"
                        color="light"
                        class="ml-1"
                        small
                      >{{ cur.currency }} : {{ cur.price }}</v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" >
              <v-btn :loading="loadingSave" color="primary" @click="save">
                {{ $t('common.save') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'
export default {
  mixins: [Rules] ,
  data() {
    return {
      selectedUser : null ,
      dataForm :{
        userid : null ,
        username : null ,
        password : null ,
        packetid : null ,
        customer_name : null
      },
      loadingSave :false ,
      keySearchUser : null ,
      timer : null ,
      packetsActive : [],
      usersActive : [] 
    }
  },
  created() {
    this.getPackets()
    this.getUsers()
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.$axios
          .$post('/admin/card', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/cards/' + res.data.id + '/edit')
          })
          .catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loadingSave = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    },
    getPackets() {
      this.$axios
        .$get('/admin/packet?page[size]=100000&filter[status]=true')
        .then((res) => {
          this.packetsActive = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    selectUserName(name) {
      this.dataForm.userid = name.userid
      this.dataForm.customer_name = name.name
      
    },
    getUsers() {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        let query = ''

        if (this.keySearchUser) {
          query =  `/admin/user?filter[name]=${this.keySearchUser}`
        } else {
          query =  '/admin/user'
        }
        this.$axios.$get(query)
          .then((res) => {
            this.usersActive = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
      
    }
  }
}
</script>