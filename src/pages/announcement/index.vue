<template>
  <div v-permissions="'send notification'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-title>
        {{ $t('announcement.sendNotify') }}
      </v-card-title>
      <v-card-text class="pb-0">
        <v-form ref="form" >
          <v-textarea
            v-model="message"
            :label="$t('announcement.message')"
            outlined
            :rules="[required]"
            dense
            clearable
          >
          </v-textarea>
          <v-autocomplete
            v-model="UserIDs"
            :search-input.sync="keySearchUser"
            :label="$t('cards.user')"
            outlined
            dense
            item-text="name" 
            item-value="userid"
            :items="usersActive"
            multiple
            chips
            small-chips
            return-object
            :no-data-text="$t('common.noDataAvailable')"
            @keyup="getUsers"
          >
          </v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="mr-1" :loading="loading" color="primary" @click="sendNotify">{{
          $t(`common.send`)
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'

export default {
  mixins: [Rules] ,
  data() {
    return {
      message : '' ,
      UserIDs : [] ,
      keySearchUser : null ,
      loading : false,
      usersActive : [] 
    }
  },
  methods: {
    sendNotify() {
      if (this.$refs.form.validate()) {

        const IDs = this.UserIDs.map(({ userid }) => userid)

        console.log(IDs)

        this.loading = true
        this.$axios
          .$post('/admin/notification', { 'message' : this.message , 'userid' : IDs })
          .then((res) => {
            this.message = '' 
            this.UserIDs = []
            this.$refs.form.resetValidation()
            this.$store.dispatch('showSuccess', this.$t('common.success'))
          })  
          .catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
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

            this.usersActive = this.usersActive.concat(this.UserIDs)

            // this.usersActive.push()
            
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
      
    }
  }
}
</script>