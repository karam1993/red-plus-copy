<template>
  <v-menu offset-y left transition="slide-y-transition" max-height="400">
    <template v-slot:activator="{ on }">
      <v-badge 
        bordered
        :content="notificationListCount"
        offset-x="22"
        offset-y="22"
      >
        <v-btn icon v-on="on" @click="getNotify" >
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <!-- dropdown card -->
    <v-card>
      <v-list three-line dense max-width="400" >
        <v-subheader class="pa-2 font-weight-bold">{{ $t('notifications.header') }}</v-subheader>
        <div v-for="(item, index) in notificationList" :key="index">
          <v-divider v-if="index > 0 && index < notificationList.length" inset></v-divider>

          <v-list-item :class="item.read_at == '' ? 'blue-grey lighten-4' : '' ">
            <v-list-item-avatar size="32" class="mt-4" >
              <v-icon color="primary" >mdi-bell</v-icon>
            </v-list-item-avatar>

            <v-list-item-content class="">
              <v-list-item-title style="height: 35px" v-text="item.data.message"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action class="align-self-center mt-6">
              <v-list-item-action-text v-text="item.created_at"></v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
         
        </div>
      </v-list>
      <div class="text-center py-2">
        <v-btn color="primary" @click="readNotify">{{ $t('notifications.asRead') }}</v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
/*
|---------------------------------------------------------------------
| Toolbar Notifications Component
|---------------------------------------------------------------------
|
| Quickmenu to check out notifications
|
*/

export default {
  data() {
    return {
      notificationList : [] ,
      notificationListCount : 0 ,
      intervals : [
        { label: this.$t('notifications.year'), seconds: 31536000 },
        { label: this.$t('notifications.month'), seconds: 2592000 },
        { label: this.$t('notifications.day'), seconds: 86400 },
        { label: this.$t('notifications.hour'), seconds: 3600 },
        { label: this.$t('notifications.minute'), seconds: 60 },
        { label: this.$t('notifications.second'), seconds: 1 }
      ]
    }
  },
  created() {
    this.getNotify()
  },
  methods: {
    timeSince(date) {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
      const interval = this.intervals.find((i) => i.seconds < seconds)
      const count = Math.floor(seconds / interval.seconds)

      return `  ${this.$t('notifications.ago')} ${count} ${interval.label}`
    },
    getNotify() {
      this.$axios
        .$get('/notification')
        .then((res) => {
          this.notificationList = res.data

          const newArray = this.notificationList.filter((el) => {
            return el.read_at <= 1000
                
          })

          if (newArray.length === 0 ) {
            this.notificationListCount = '0'
          } else {
            this.notificationListCount = newArray.length
          }
          for (let index = 0; index < this.notificationList.length; index++) {
            this.notificationList[index]['created_at'] = this.timeSince( new Date(this.notificationList[index]['created_at']))
          }
        })
    },
    readNotify() {
      this.$axios
        .$put('/notification')
        .then((res) => {
          this.getNotify()
        })
    }
  }
}
</script>
