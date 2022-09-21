<template>
  <v-dialog v-model="initialvalue.dialog" max-width="350">
    <v-card>
      <v-card-title class="headline">{{
        $t("nas.serverStatus")
      }}</v-card-title>

      <v-card-text v-if="loading">
        <v-skeleton-loader
          v-bind="attrs"
          type="article"
        ></v-skeleton-loader>
      </v-card-text>

      <v-card-text v-else>
        <p>{{ $t('nas.serverStatusParagraph') }} <span v-text="serverStatus ? $t('common.active') : $t('common.notActive') "></span></p>
        <p class="text-center mb-0"><v-icon style="font-size: 90px;" :color="serverStatus ? 'success' : 'error' " v-text="serverStatus ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'" ></v-icon></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="initialvalue.dialog = false">{{
          $t(`common.ok`)
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
      loading : false ,
      serverStatus : null
    }
  },
  created() {
    this.checkServer()
  },
  methods: {
    checkServer() {
      this.loading = true
      this.$axios
        .$get('/admin/service')
        .then((res) => {
          this.serverStatus = res.data.radius
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>