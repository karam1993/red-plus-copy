<template>
  <div v-permissions="'packet create'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.name"
                :rules="[required]"
                :label="$t('packets.name')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.price"
                :rules="[required , number]"
                :label="$t('packets.price')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-row no-gutters class="mt-0">
                <v-col cols="8" >
                  <v-text-field
                    v-model="speed_down.speedValue"
                    :rules="[number]"
                    :label="$t('packets.speed_down')"
                    outlined
                    dense
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
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-row no-gutters class="mt-0">
                <v-col cols="8">
                  <v-text-field
                    v-model="speed_up.speedValue"
                    :rules="[number]"
                    :label="$t('packets.speed_up')"
                    outlined
                    dense
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
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-row no-gutters class="mt-0">
                <v-col cols="8" >
                  <v-text-field
                    v-model="bw_total.speedValue"
                    :rules="[number]"
                    :label="$t('packets.bw_total')"
                    outlined
                    dense
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
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.expirtion"
                :rules="[required , number]"
                :label="$t('packets.expirtion')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete
                v-model="dataForm.type"
                :rules="[required]"
                :items="[{ name : 'ppp' , value : 'ppp' } , { name : 'hotspot' , value : 'hotspot' } , { name : 'any' , value : 'any' }]"
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
                v-model="dataForm.max_session"
                :rules="[required , number]"
                :label="$t('packets.max_session')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-checkbox
                v-model="dataForm.fap"
                class="mt-0 pt-1 d-inline-block"
                :label="$t('packets.fap')"
                outlined
                inset
              ></v-checkbox>
            </v-col>      
            <v-col v-if="dataForm.fap" cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete 
                v-model="dataForm.fap_packetid"
                hide-details
                :items="activePacket"
                :rules="[required]"
                outlined
                dense
                item-text="name" 
                item-value="packetid"
                :label="$t('packets.fap_packetid')"
                :no-data-text="$t('common.noDataAvailable')"
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
                    v-model="dataForm.reset_daily"
                    class="mt-0 pt-1"
                    :label="$t('packets.reset_daily')"
                    outlined
                    inset
                  ></v-checkbox>
                </v-col>
                <v-col cols="6" md="3" class="pb-0 pt-1">
                  <v-checkbox
                    v-model="dataForm.reset_monthly"
                    class="mt-0 pt-1"
                    :label="$t('packets.reset_monthly')"
                    outlined
                    inset
                  ></v-checkbox>
                </v-col>
                <v-col cols="6" md="3" class="pb-0 pt-1">
                  <v-switch
                    v-model="dataForm.status"
                    class="mt-0 pt-1"
                    :label="$t('packets.status')"
                    outlined
                    inset
                  ></v-switch>
                </v-col>
                <v-col cols="6" md="3" class="pb-0 pt-1">
                  <v-switch
                    v-model="dataForm.public"
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
      dataForm :{
        name : '' ,
        price : '',
        speed_down : null ,
        speed_up : null ,
        expirtion : null,
        bw_total : null ,
        type : ''  ,
        max_session : '' ,
        reset_daily : true ,
        reset_monthly : true ,
        status : true ,
        public : true ,
        fap : false ,
        fap_packetid : null 
      } ,
      activePacket : [] ,
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
      speeds : [{ name : 'KB' , value : 1024 }, { name : 'MB' , value : 1048576 }, { name : 'GB' , value : 1073741824 }] ,
      loadingSave : false
    }
  },
  computed :{
    speedDownCalc() {
      return this.speed_down.speedValue * this.speed_down.speedType
    },
    speedUpCalc() {
      return this.speed_up.speedValue * this.speed_up.speedType
    },
    bwTotalCalc() {
      return this.bw_total.speedValue * this.bw_total.speedType
    }
      
  },
  created() {
    this.getActivePacket()
  },
  methods: {
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
        this.dataForm.speed_down = this.speedDownCalc === 0 ? null  : this.speedDownCalc
        this.dataForm.speed_up = this.speedUpCalc === 0 ? null  : this.speedUpCalc
        this.dataForm.bw_total = this.bwTotalCalc === 0 ? null  : this.bwTotalCalc
        if (!this.dataForm.fap) {
          this.dataForm.fap_packetid = null
        }
        this.$axios
          .$post('/admin/packet', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/packets')
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