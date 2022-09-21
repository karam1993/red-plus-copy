<template>
  <div v-permissions="'packet view'" class="d-flex flex-grow-1 flex-column">
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
                v-model="packetInfo.name"
                :rules="[required]"
                :label="$t('packets.name')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="packetInfo.price"
                :rules="[required , number]"
                :label="$t('packets.price')"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-row no-gutters class="mt-0">
                <v-col cols="8" >
                  <input v-model="packetInfo.speed_down" type="hidden">
                  <v-text-field
                    v-model="speed_down.speedValue"
                    :rules="[number]"
                    :label="$t('packets.speed_down')"
                    outlined
                    dense
                    @keyup="speadVal1 = true"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="speed_down.speedType"
                    :items="speeds"
                    outlined
                    dense
                    item-text="name" 
                    item-value="value"
                    class="mr-2"
                    :no-data-text="$t('common.noDataAvailable')"
                    @change="!speadVal1 ? speed_down.speedValue = packetInfo.speed_down / speed_down.speedType : packetInfo.speed_down = speed_down.speedType * speed_down.speedValue"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-row no-gutters class="mt-0">
                <v-col cols="8">
                  <input v-model="packetInfo.speed_up" type="hidden">
                  <v-text-field
                    v-model="speed_up.speedValue"
                    :rules="[number]"
                    :label="$t('packets.speed_up')"
                    outlined
                    dense
                    @keyup="speadVal2 = true"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="speed_up.speedType"
                    :items="speeds"
                    outlined
                    dense
                    item-text="name" 
                    item-value="value"
                    class="mr-2"
                    :no-data-text="$t('common.noDataAvailable')"
                    @change="!speadVal2 ? speed_up.speedValue = packetInfo.speed_up / speed_up.speedType : packetInfo.speed_up = speed_up.speedType * speed_up.speedValue "
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-row no-gutters class="mt-0">
                <v-col cols="8" >
                  <input v-model="packetInfo.bw_total" type="hidden">
                  <v-text-field
                    v-model="bw_total.speedValue"
                    :rules="[number]"
                    :label="$t('packets.bw_total')"
                    outlined
                    dense
                    @keyup="speadVal5 = true"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="bw_total.speedType"
                    :items="speeds"
                    outlined
                    dense
                    item-text="name" 
                    item-value="value"
                    class="mr-2"
                    :no-data-text="$t('common.noDataAvailable')"
                    @change="!speadVal5 ? bw_total.speedValue = packetInfo.bw_total / bw_total.speedType : packetInfo.bw_total = bw_total.speedType * bw_total.speedValue "
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="packetInfo.expirtion"
                :rules="[required , number]"
                :label="$t('packets.expirtion')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete
                v-model="packetInfo.type"
                :rules="[required]"
                :items="[{ name : 'ppp' , value : 'ppp' } , { name : 'hotspot' , value : 'hotspot' }, { name : 'any' , value : 'any' }]"
                :label="$t('packets.type')"
                outlined
                item-text="name" 
                item-value="value" 
                dense
                :no-data-text="$t('common.noDataAvailable')"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="packetInfo.max_session"
                :rules="[required , number]"
                :label="$t('packets.max_session')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-checkbox
                v-model="packetInfo.fap"
                class="mt-0 pt-1 d-inline-block"
                :label="$t('packets.fap')"
                outlined
                inset
              ></v-checkbox>
            </v-col>
            <v-col v-if="packetInfo.fap" cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete 
                v-model="packetInfo.fap_packetid"
                :items="activePacket"
                :rules="[required]"
                outlined
                dense
                item-text="name" 
                hide-details
                item-value="packetid"
                :no-data-text="$t('common.noDataAvailable')"
                :label="$t('packets.fap_packetid')"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip
                        v-for="(cur , index) in item.converter"
                        :key="index"
                        color="light"
                        class="ml-1"
                        small
                      >{{ cur.currency }} : {{ cur.price }}</v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" class="pb-0 pt-1">
              <v-row>

                <v-col cols="6" md="3" class="pb-0 pt-1">
                  <v-checkbox
                    v-model="packetInfo.reset_daily"
                    class="mt-0 pt-1"
                    :label="$t('packets.reset_daily')"
                    outlined
                    inset
                  ></v-checkbox>
                </v-col>
                <v-col cols="6" md="3" class="pb-0 pt-1">
                  <v-checkbox
                    v-model="packetInfo.reset_monthly"
                    class="mt-0 pt-1"
                    :label="$t('packets.reset_monthly')"
                    outlined
                    inset
                  ></v-checkbox>
                </v-col>
                <v-col cols="6" md="3" class="pb-0 pt-1">
                  <v-switch
                    v-model="packetInfo.status"
                    class="mt-0 pt-1"
                    :label="$t('packets.status')"
                    outlined
                    inset
                  ></v-switch>
                </v-col>
                <v-col cols="6" md="3" class="pb-0 pt-1">
                  <v-switch
                    v-model="packetInfo.public"
                    class="mt-0 pt-1"
                    :label="$t('packets.public')"
                    outlined
                    inset
                  ></v-switch>
                </v-col>
              </v-row>
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
      speadVal1 : false ,
      speadVal2 : false ,
      speadVal3 : false ,
      speadVal4 : false ,
      speadVal5 : false ,
        
      packetInfo : {},
      loadingData : false ,
      loadingSave : false ,
      activePacket :  [] ,
      speed_down :{
        speedValue : null ,
        speedType : 1024
      },
      speed_up :{
        speedValue : null ,
        speedType : 1024
      },
      bw_total :{
        speedValue : null ,
        speedType : 1024
      },
      speeds : [{ name : 'KB' , value : 1024 }, { name : 'MB' , value : 1048576 }, { name : 'GB' , value : 1073741824 }]
    }
  },

  watch: {
    'speed_down.speedValue': function (value) {
      if (this.speed_down.speedValue === '') {
        this.packetInfo.speed_down = null

        return
      }
      this.packetInfo.speed_down = Number(value) *  this.speed_down.speedType
    },
    'speed_up.speedValue': function (value) {
      if (this.speed_up.speedValue === '') {
        this.packetInfo.speed_up = null

        return
      }
      this.packetInfo.speed_up = Number(value) *  this.speed_up.speedType
    },
    'bw_total.speedValue': function (value) {
      if (this.bw_total.speedValue === '') {
        this.packetInfo.bw_total = null

        return
      }
      this.packetInfo.bw_total = Number(value) *  this.bw_total.speedType
    }
  },

  created() {
    this.getPacketInfo()
    this.getActivePacket()
  },
  methods: {
    getPacketInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/packet/${this.$route.params.id}`)
        .then((res) => {
          this.packetInfo  = res.data
          this.speed_down.speedValue = this.packetInfo.speed_down !== null ?  this.packetInfo.speed_down / 1024 : null
          this.speed_up.speedValue = this.packetInfo.speed_up !== null ?  this.packetInfo.speed_up / 1024 : null
          this.bw_total.speedValue = this.packetInfo.bw_total !== null ?  this.packetInfo.bw_total / 1024 : null

        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    getActivePacket() {
      this.$axios
        .$get('/admin/packet?page[size]=100000&filter[status]=true')
        .then((res) => {
          this.activePacket = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        const dataForm = { ...this.packetInfo }

        if (!dataForm.fap) {
          dataForm.fap_packetid = null
        }
        this.$axios
          .$put(`/admin/packet/${this.$route.params.id}` , dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.getPacketInfo()
          })
          .catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loadingSave = false
            this.speed_down.speedType = 1024 
            this.speed_up.speedType = 1024  
            this.bw_total.speedType = 1024 ,
            this.speadVal1 = false 
            this.speadVal2 = false 
            this.speadVal3 = false 
            this.speadVal4 = false 
            this.speadVal5 = false 

          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  }
}
</script>