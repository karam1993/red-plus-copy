<template>
  <v-dialog v-model="initialvalue.dialog" max-width="350">
    <v-card>
      <v-card-title class="headline">
        {{ $t("cards.resetPasswordCardTitle") }}
        
      </v-card-title>
      <v-card-text>{{ $t("cards.resetPasswordCardText") }}
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="dataForm.password"
                :label="$t('cards.password')"
                :rules=" [required] "
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-1">
              <v-text-field
                v-model="dataForm.password_confirmation"
                :rules="[required]"
                :label="$t('cards.password_confirmation')"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="initialvalue.dialog = false">{{
          $t(`common.cancel`)
        }}</v-btn>
        <v-btn color="error" :loading="loading" @click="resetConfirm">{{
          $t(`common.ok`)
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
      loading : false ,
      dataForm : {
        password : '' ,
        password_confirmation : '' 
      }
    }
  },

  methods: {
    resetConfirm() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.$post('/admin/' + this.initialvalue.resetApi , this.dataForm)
          .then(() => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.initialvalue.status = true
            this.$refs.form.resetValidation()
            this.dataForm = {
              password : '' ,
              password_confirmation : '' 
            }
            this.initialvalue.dialog = false
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          }).finally(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  }
}
</script>
