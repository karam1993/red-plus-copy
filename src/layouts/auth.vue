<template>
  <v-app>
    <div class="d-flex text-center flex-column flex-md-row flex-grow-1">
      <v-sheet class="layout-side mx-auto mx-md-1 d-none d-md-flex flex-md-column justify-space-between px-2">
        <div class="mt-10 mt-md-10 pa-2">
          <img class="w-full mt-12 pt-5" :src="env.LOGO_URL" />
        </div>
      </v-sheet>

      <div class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column">
        <div class="layout-content ma-auto w-full">
          <!-- <toolbar-language /> -->
          <nuxt />
          <v-snackbar :value="toast.show" :timeout="toast.timeout" :color="toast.color" bottom>
            {{ toast.message }}
            <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false">{{ $t('common.close') }}</v-btn>
          </v-snackbar> 
        </div>

      </div>
    </div>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
// import ToolbarLanguage from '../components/toolbar/ToolbarLanguage'

export default {
  middleware: 'auth',
  components: {
    // ToolbarLanguage
  },
  computed: {
    ...mapState(['product', 'toast'])
  },
  data() {
    return {
      env : {
        LOGO_URL : process.env.LOGO_URL

      }
    }
  },
}
</script>

<style scoped>
.layout-side {
  width: 420px;
}

.layout-content {
  max-width: 480px;
}
</style>
