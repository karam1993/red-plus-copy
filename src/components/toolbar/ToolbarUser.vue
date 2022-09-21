<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn icon class="elevation-2" v-on="on">
        <v-badge
          color="success"
          dot
          bordered
          offset-x="10"
          offset-y="10"
        >
          <v-avatar size="40">
            <v-img src="/images/avatars/avatar1.svg"></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>

    <!-- user menu list -->
    <v-list dense nav>
      <v-list-item @click="ShowMyProfile">
        <v-list-item-content>
          <v-list-item-title class="text-center">{{ $auth.user.User.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-1"></v-divider>

      <v-list-item @click="logout()">
        <v-list-item-icon>
          <v-icon small>mdi-logout-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t('menu.logout') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
//import config from '../../configs'
/*
|---------------------------------------------------------------------
| Toolbar User Component
|---------------------------------------------------------------------
|
| Quickmenu for user menu shortcuts on the toolbar
|
*/
export default {
  data() {
    return {
      //menu: config.toolbar.user
    }
  },
  methods: {
    ShowMyProfile() {
      console.log('my profile')
    },
    async logout() {
      await this.$auth.logout()
    }
  }
}
</script>
