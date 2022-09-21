<template>
  <v-app>
    <div
      v-shortkey="['ctrl', '/']"
      class="d-flex flex-grow-1"
    >
      <!-- Navigation -->
      <v-navigation-drawer
        v-model="drawer"
        app
        floating
        class="elevation-1"
        :right="$vuetify.rtl"
        :light="menuTheme === 'light'"
        :dark="menuTheme === 'dark'"
      >
        <!-- Navigation menu info -->
        <template v-slot:prepend>
          <div class="pa-2 pb-0">
            <img class="pl-4 pr-4" width="220" :src="env.LOGO_URL" />
            <!-- <div class="title font-weight-bold text-uppercase primary--text">{{ product.name }}</div>
            <div class="overline grey--text">{{ product.version }}</div> -->
          </div>
        </template>

        <!-- Navigation menu -->
        <main-menu :menu="navigation.menu" />

        <!-- Navigation menu footer -->
      </v-navigation-drawer>

      <!-- Toolbar -->
      <v-app-bar
        app
        :color="isToolbarDetached ? 'surface' : undefined"
        :flat="isToolbarDetached"
        :light="toolbarTheme === 'light'"
        :dark="toolbarTheme === 'dark'"
      >
        <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
          <div class="d-flex flex-grow-1 align-center">

            <!-- search input mobile -->
            <div class="d-flex flex-grow-1 align-center">
              <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

              <v-spacer class="d-none d-lg-block"></v-spacer>
              <v-chip color="primary" style="    direction: ltr;"> {{ $store.getters.userBalance }} </v-chip>
              <ToolbarNotification />
              <toolbar-user />
            </div>
          </div>
        </v-card>
      </v-app-bar>

      <v-main>
        <v-container class="fill-height" :fluid="!isContentBoxed">
          <v-layout>
            <nuxt />
            <v-snackbar :value="toast.show" :timeout="toast.timeout" :color="toast.color" bottom>
              {{ toast.message }}
              <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false">{{ $t('common.close') }}</v-btn>
            </v-snackbar>
          </v-layout>
        </v-container>

        <v-footer app inset>
          <v-spacer></v-spacer>
          <div class="overline">
            {{ $t('footer.developedBy') }} <v-icon small color="primary">mdi-copyright</v-icon> <a class="text-decoration-none" href="https://smartizi.com.tr" target="_blank"> SmartIZI</a>
          </div>
        </v-footer>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

// navigation menu configurations
import config from '../configs'
import ToolbarNotification from '../components/toolbar/ToolbarNotifications.vue'
import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'
export default {
  middleware: 'auth',
  components: {
    MainMenu,
    ToolbarUser,
    ToolbarNotification
  },
  data() {
    return {
      drawer: null,
      navigation: config.navigation ,
      env : {
        LOGO_URL : process.env.LOGO_URL

      }
    }
  },
  computed: {
    ...mapState(['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached', 'toast'])
  },
  created() {
    this.getBalance()
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
    }
  }
}
</script>

<style scoped>
.buy-button {
  box-shadow: 1px 1px 18px #ee44aa;
}
</style>
