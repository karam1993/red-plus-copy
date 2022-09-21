<template>
  <div v-permissions="'nas view'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-skeleton-loader
        v-if="loadingData"
        type="article"
      ></v-skeleton-loader>
      <v-card-text v-else>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="nasInfo.nasname"
                :rules="[required , ipv4]"
                :label="$t('rols.name')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="nasInfo.shortname"
                :label="$t('nas.shortname')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete
                v-model="nasInfo.type"
                :rules="[required]"
                :label="$t('nas.type')"
                outlined
                :items="[{name : 'Mikrotik' , value : 'mikrotik'} ]"
                item-text="name"
                item-value="value"
                :no-data-text="$t('common.noDataAvailable')"
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="nasInfo.ports"
                :rules="[number]"
                :label="$t('nas.ports')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="nasInfo.secret"
                :rules="[required]"
                :label="$t('nas.secret')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="nasInfo.server"
                :label="$t('nas.server')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="nasInfo.community"
                :label="$t('nas.community')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="nasInfo.description"
                :label="$t('nas.description')"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-alert
                border="left"
                colored-border
                type="info"
                elevation="2"
              >
                <b class="mb-1">{{ $t('nas.onlineServerCount') }}  </b> 
                
                <p class="mb-1 mt-2">{{ $t('nas.onlineServerCountParagrph') }} 
                  {{ nasCountOnline }}
                  
                </p>
              </v-alert>
            </v-col>
            <v-col cols="12" >
              <v-btn :loading="loadingSave" color="primary" @click="save">
                {{ $t('common.save') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'

export default {
  mixins: [Rules] ,
  data() {
    return {
      loadingData : false ,
      loadingSave : false ,
      nasInfo : {} ,
      nasCountOnline : '' 
    }
  },
  created() {
    this.getNasInfo()
    this.getNasOnlineCount()
  },
  methods: {
    getNasInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/nas/${this.$route.params.id}`)
        .then((res) => {
          this.nasInfo  = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },

    getNasOnlineCount() {
      this.$axios
        .$get(`/admin/statistics/online/${this.$route.params.id}`)
        .then((res) => {
          this.nasCountOnline  = res.data.totalonline
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.$axios
          .$put(`/admin/nas/${this.$route.params.id}`, this.nasInfo)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.getNasInfo()
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