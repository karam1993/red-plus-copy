<template>
  <v-dialog v-model="initialvalue.dialog" max-width="550">
    <v-card>
      <v-card-title class="headline">{{ $t('billing.addAmount') }}</v-card-title>
      <v-card-text>
        <v-form ref="form" >
          <v-alert
            border="left"
            colored-border
            type="info"
            elevation="2"
          >
            <div v-if="userInfo">
              <p class="mb-1"><span>{{ $t('billing.receiverName') }} : </span> <span class="float-end">{{ userInfo.name }}</span></p>
              <p class="mb-1"><span>{{ $t('billing.receiverPhone') }} : </span> <span class="float-end">{{ userInfo.mobile }}</span></p>
              <p class="mb-1"><span>{{ $t('billing.receiverEmail') }} : </span> <span class="float-end">{{ userInfo.email }}</span></p>
            </div>
          </v-alert>
         
          <v-row>
            <v-col cols="12" class="pb-0 ">
              <v-text-field
                v-model="initialvalue.dataForm.amount"
                :rules="[required , number]"
                :label="$t('billing.amount')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0 pt-1">
              <v-text-field
                v-model="initialvalue.dataForm.description"
                :rules="[required]"
                :label="$t('billing.description')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" >
              <v-btn :loading="loadingSave" color="primary" @click="save">
                {{ $t('common.send') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        
      </v-card-text>
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
      loadingSave : false ,
      userInfo : null 
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getBalance() {
      this.$axios
        .$get('/balance')
        .then((res) => {
          this.$store.commit('setBalance', res.data.billing.balance + ' ' + res.data.billing.currency )       
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getUserInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/user/${this.initialvalue.userID}`)
        .then((res) => {
          this.userInfo  = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },

    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        
        this.$axios
          .$post(`/admin/user/${this.initialvalue.userID}/billing`, this.initialvalue.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.getBalance()
            this.initialvalue.dataForm = {}
            this.$refs.form.resetValidation()
            this.initialvalue.dialog = false 
            this.initialvalue.status = true
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
      
    }
  }
}
</script>