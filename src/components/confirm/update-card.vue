<template>
  <v-dialog v-model="initialvalue.dialogUpdateCard" max-width="350">
    <v-card>
      <v-card-title class="headline">
        {{ $t("cards.updateCardInfo") }}
        
      </v-card-title>
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete
                v-model="dataForm.userid"
                :label="$t('cards.user')"
                :search-input.sync="userSearchKey"
                outlined
                dense
                :no-data-text="$t('common.noDataAvailable')"
                :items="usersList"
                item-text="name"
                item-value="userid"
                @keyup="getUsers"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" class="pt-1">
              <v-text-field
                v-model="dataForm.customer_name"
                :label="$t('cards.customer_name')"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="initialvalue.dialogUpdateCard = false">{{
          $t(`common.cancel`)
        }}</v-btn>
        <v-btn color="primary" :loading="loading" @click="updateCard">{{
          $t(`common.save`)
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Rules from '~/apps/validation/index'

export default {
  mixins: [Rules] ,
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      initialvalue: this.value ,
      usersList : [] ,
      userSearchKey : '' ,
      loading : false ,
      dataForm : {
        userid : '' ,
        customer_name : '' 
      }
    }
  },
  created() {
    this.usersList.push (this.initialvalue.userInfo)
    this.dataForm.userid = this.initialvalue.userInfo.userid
    this.dataForm.customer_name = this.initialvalue.customer_name
    
  },

  methods: {
    updateCard() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.$put(`/admin/card/${this.$route.params.id}` , this.dataForm)
          .then(() => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.initialvalue.status = true
            this.$refs.form.resetValidation()
            this.dataForm = {
              userid : '' ,
              customer_name : '' 
            }
            this.initialvalue.dialogUpdateCard = false
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          }).finally(() => {
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
        this.$axios
          .$get(`/admin/user?filter[name]=${this.userSearchKey}`)
          .then((res) => {
            this.usersList = res.data
           
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    }
  }
}
</script>
