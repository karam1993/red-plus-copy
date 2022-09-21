<template>
  <v-dialog v-model="initialvalue.dialog" max-width="350">
    <v-card>
      <v-card-title class="headline">{{
        $t("common.confirmationSaveAttribute")
      }}</v-card-title>
      <v-card-text>{{ $t("common.confirmationSaveAttributePragraph") }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="initialvalue.dialog = false">{{
          $t(`common.cancel`)
        }}</v-btn>
        <v-btn color="primary" :loading="loading" @click="sendConfirm">{{
          $t(`common.confirm`)
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      initialvalue: this.value ,
      loading : false 
    }
  },

  methods: {
    sendConfirm() {
      this.loading = true
      this.$axios.$post(this.initialvalue.confirmApi , { 'attribute' : this.initialvalue.dataForm })
        .then(() => {
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.initialvalue.status = true
          this.initialvalue.dialog = false
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
