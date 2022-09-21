<template>
  <div v-permissions="'patchcard create'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-skeleton-loader
        v-if="loadingData"
        type="article"
      ></v-skeleton-loader>
      <v-card-text v-else>
        <v-row v-if="patchcardInfo">
          <v-col cols="12" md="6" class="pb-0 pt-1">
            <v-alert
              border="left"
              colored-border
              type="info"
              elevation="2"
            >
              <b class="mb-1">{{ $t('packets.info') }}  </b> 
              <p class="mb-1 text-caption mt-2">
                <b> {{ $t('packets.name') }} </b> <span class="float-end">
                  <NuxtLink :to="localePath(`/packets/${patchcardInfo.patchcard.packet.packetid}/edit`)">
                    {{ patchcardInfo.patchcard.packet.name }}
                  </NuxtLink>

                </span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('packets.price') }} </b> <span class="float-end">{{ patchcardInfo.patchcard.packet.price + ' ' + patchcardInfo.patchcard.packet.currency }}</span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('packets.speed_down') }} </b> <span class="float-end">{{ convertSpeed(patchcardInfo.patchcard.packet.speed_down) }}</span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('packets.speed_up') }} </b> <span class="float-end">{{ convertSpeed(patchcardInfo.patchcard.packet.speed_up) }}</span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('packets.expirtion') }} </b> <span class="float-end">{{ patchcardInfo.patchcard.packet.expirtion }} {{ $t('common.day') }} </span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('packets.public') }} </b> <span class="float-end" v-text="patchcardInfo.patchcard.packet.public ? $t('common.yes') : $t('common.no') "></span>
              </p>
                
            </v-alert>
          </v-col>

          <v-col cols="12" md="6" class="pb-0 pt-1">
            <v-alert
              border="left"
              colored-border
              type="info"
              elevation="2"
            >
              <b class="mb-1">{{ $t('patchcard.info') }}  </b> 
              <p class="mb-1 text-caption mt-2">
                <b> {{ $t('patchcard.totalCount') }} </b> <span class="float-end">{{ patchcardInfo.patchcard.totalCount }}</span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('patchcard.prefix') }} </b> <span class="float-end">{{ patchcardInfo.patchcard.prefix }}</span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('patchcard.useInt') }} </b> <span class="float-end" v-text="patchcardInfo.patchcard.useInt ? $t('common.yes') : $t('common.no') "></span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('patchcard.useChar') }} </b> <span class="float-end" v-text="patchcardInfo.patchcard.useChar ? $t('common.yes') : $t('common.no') "></span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('patchcard.userLength') }} </b> <span class="float-end">{{ patchcardInfo.patchcard.userLength }}</span>
              </p>
              <p class="mb-1 text-caption mt-0">
                <b> {{ $t('patchcard.passLength') }} </b> <span class="float-end">{{ patchcardInfo.patchcard.passLength }}</span>
              </p>

            </v-alert>
          </v-col>
          <v-col cols="12" class="py-0">
            <v-btn color="primary" @click="printCard">
              {{ $t('common.printCard') }}
            </v-btn>
            <v-btn color="primary" :loading="loadingExport" @click="exportCards">
              {{ $t('common.export') }}
            </v-btn>

            <!-- <v-btn v-if="urlDownload" icon color="primary" class="mx-1" @click="downloadFile">
              <v-icon>mdi-download</v-icon>
            </v-btn> -->
          </v-col>

          <v-col cols="12">
            <v-data-table
              :headers="headersCard"
              :items="patchcardInfo.cards"
              :items-per-page="1000000"
              class="elevation-1"
              hide-default-footer
            ></v-data-table>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>
  </div>
      
</template>
<script>
export default {
  data() {
    return {
      patchcardInfo : null ,
      loadingExport : false ,
      urlDownload : null ,
      loadingData : false ,
      headersCard : [
        {
          text: this.$t('cards.username'),
          value: 'username'
        },
        { text: this.$t('cards.password') , value: 'password' }
      ]
    }
  },
  created() {
    this.getPatchcardInfo()
  },
  methods: {
    getPatchcardInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/patchcard/${this.$route.params.id}`)
        .then((res) => {
          this.patchcardInfo  = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    convertSpeed(speed) {
      if (speed / 1024 < 1024) {   
        return  Math.round(speed / 1024 * 100) / 100  + ' KB'
      } else if (speed / 1024 / 1024 <= 1024) {
        return  Math.round(speed / 1024 / 1024 * 100) / 100  + ' MB'
      } else {
        return  Math.round(speed / 1024 / 1024 / 1024 * 100) / 100  + ' GB'
      }
    },
    exportCards() {
      this.loadingExport = true
      this.$axios
        
        .$get(`/admin/patchcard/${this.$route.params.id}/export`)
        .then((res) => {
          this.loadingExport = false
          this.urlDownload  = res.data.url
          this.downloadFile()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    printCard() {
      this.$router.push(`/patchcard/${this.$route.params.id}/print`  )
    },
    downloadFile() {
      window.open(this.urlDownload)
    }
    
  }
}
</script>