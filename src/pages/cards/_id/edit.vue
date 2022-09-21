<template>
  <div v-permissions="'card view'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-skeleton-loader
        v-if="loadingData"
        type="article"
      ></v-skeleton-loader>
      <v-card-text v-else>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="5" xl="3">
              <v-card :style="cardInfo.workingStatus ? 'background: linear-gradient(to right, rgb(240 151 8) 0%, rgb(255 201 113) 100%);' : 'background: linear-gradient(to right, rgb(240 8 8) 0%, rgb(255 113 113) 100%);' " style="    border-radius: 15px;" height="230">
                <v-card-title class="white--text pb-1">
                  {{ cardInfo.packet ? cardInfo.packet.name: 'اسم البطاقة مفقود' }}
                  <v-spacer></v-spacer>
                  <v-img :src="env.LOGO_URL" width="0" ></v-img>
                </v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="4">
                      <apexchart
                        style="position: relative; top: -30px;"
                        type="radialBar"
                        :height="heightScreen"
                        :options="chartOptions"
                        :series="series"
                      ></apexchart>
                    </v-col>
                    <v-col cols="8" class="">
                      <v-row no-gutters class="mt-2 mr-2">
                        <v-col cols="12">
                          <p class="mb-0"><span style="width: 15px;height: 15px;border-radius: 5px;display: inline-block;background: #222071;"></span>  
                            <span class="white--text" style="position: relative; top: -4px; left: -4px;" >{{ $t('cards.avilable') }}  <span class="mx-4">{{ cardInfo.bandwidth_usage ? 100 - cardInfo.bandwidth_usage + ' %' : $t('common.unlimit') }} </span> 
                            </span>
                          </p>
                          <p class="mb-0"><span style="width: 15px;height: 15px;border-radius: 5px;display: inline-block;background: #f3e9da;"></span> 
                            <span class="white--text" style="position: relative; top: -4px; left: -4px;" >{{ $t('cards.used') }}   <span class="mx-2">{{ cardInfo.bandwidth_usage ? cardInfo.bandwidth_usage + ' %' : $t('common.unlimit') }} </span> 
                            </span>
                          </p>
                          <p class="mb-1 white--text" style="font-size: 13px;"> 
                            <span class="mr-3">{{ $t('cards.username') }} : {{ cardInfo.username }}  </span>
                          </p>
                          <p class="mb-1 text-left white--text" style="font-size: 13px;"> 
                            <span class="text-center" style="width: 100px ; top: 2px; position: relative; border: 1px solid; height: 20px; display: inline-block;">{{ cardPassword }}</span> <v-btn v-permissions="'card viewPassword'" icon small @click="getPasswordCard"><v-icon small class="" color="white">mdi-eye</v-icon></v-btn> 
                          </p> 
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-row>
                <v-col cols="12">
                  <v-card >
                    <v-card-title>
                      {{ $t('cards.userInfo') }}
                    </v-card-title>
                    <v-card-text v-if="cardInfo.user">
                      <p class="mb-1"><b>{{ $t('user.name') }} : </b> <span>
                        <NuxtLink :to="localePath(`/users/${cardInfo.user.userid}/edit`)">
                          {{ cardInfo.user.name }}
                        </NuxtLink>
                      </span> </p>
                      <p class="mb-1"><b>{{ $t('user.email') }} : </b> <span>
                        {{ cardInfo.user.email }}
                      </span> </p>
                      <p class="mb-1"><b>{{ $t('user.mobile') }} : </b> <span>
                        {{ cardInfo.user.mobile }}
                      </span> </p>
                    </v-card-text>
                    <v-card-text v-else>
                      <p style="font-size:18px ; user-select: none;" class="text-center">{{ $t('common.noData') }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" class="pt-0">
                  <v-card>
                    <v-card-title>
                      {{ $t('cards.packetInfo') }}
                    </v-card-title>
                    <v-card-text v-if="cardInfo.packet">
                      <p class="mb-1"><b>{{ $t('packets.name') }} : </b> <span>
                        <NuxtLink :to="localePath(`/packets/${cardInfo.packet.packetid}/edit`)">
                          {{ cardInfo.packet.name }}
                        </NuxtLink>
                      </span> </p>
                      <p class="mb-1"><b>{{ $t('packets.price') }} : </b> <span>
                        {{ cardInfo.packet.price + ' ' + cardInfo.packet.currency }}
                      </span> </p>
                      <p class="mb-1"><b>{{ $t('packets.type') }} : </b> <span>
                        {{ cardInfo.packet.type }}
                      </span> </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="7" xl="9">
              <v-card>
                <v-card-title>
                  {{ $t('cards.cardOtherInfo') }}
                  <v-btn
                    v-permissions="'card disconnect'"
                    small
                    :loading="loadingReset"
                    class=" mx-2"
                    rounded
                    :disabled="!isCardOnline"
                    :color="isCardOnline ? 'success': 'light'"
                    @click="resetCard"
                  >  {{ $t('cards.restart') }} <v-icon class="mr-1" small>mdi-credit-card-refresh-outline </v-icon></v-btn>
                  <v-btn
                    v-permissions="'card update'"
                    small
                    class=" mx-0"
                    rounded
                    color="primary"
                    @click="openDialogToUpdateCard"
                  >  {{ $t('cards.update') }} <v-icon class="mr-1" small>mdi-credit-card-edit-outline </v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                  <p class="mb-1"><b>{{ $t('cards.status') }} : </b> <span v-text="cardInfo.status ? this.$t('common.active') : this.$t('common.notActive')" ></span > <v-icon :color="cardInfo.status ? 'success' : 'error' " v-text="cardInfo.status ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"></v-icon></p>
                  <p class="mb-1"><b>{{ $t('cards.hidden') }} : </b> <span v-text="cardInfo.hidden ? this.$t('common.hidden') : this.$t('common.notHidden')" ></span > <v-icon :color="cardInfo.hidden ? 'warning' : 'info' " v-text="cardInfo.hidden ? 'mdi-dots-square ' : 'mdi-crop-square'"></v-icon></p>
                  <p v-if="cardInfo.customer_name" class="mb-1"><b>{{ $t('cards.customer_name') }} : </b> <span> {{ cardInfo.customer_name }}</span> </p>
                  <p class="mb-1"><b>{{ $t('cards.start_at') }} :</b> <span>{{ cardInfo.start_at }}</span></p>
                  <p class="mb-1"><b>{{ $t('cards.end_at') }} :</b> <span>{{ cardInfo.end_at }}</span></p>
                  <p class="mb-1"><b>{{ $t('packets.expirtion') }} :</b> <span>{{ cardInfo.expiry_day }} {{ $t('common.day') }}</span></p>
                  <p class="mb-1"><b>{{ $t('packets.bw_down') }} :</b> <span>{{ convertSpeed(cardInfo.bw_down_used) }}</span></p>
                  <p class="mb-1"><b>{{ $t('packets.bw_up') }} :</b> <span>{{ convertSpeed(cardInfo.bw_up_used) }}</span></p>
                  <p class="mb-1"><b>{{ $t('cards.bw_total_max') }} :</b> <span>{{ convertSpeed(cardInfo.bw_total_max) }} </span></p>
                  <p class="mb-1"><b>{{ $t('cards.reset_at') }} :</b> <span>{{ cardInfo.reset_at }}</span></p>
                  
                  <p v-if="cardInfo.is_fap" class="mb-1"><b>{{ $t('cards.is_fap') }} :</b> <span>{{ cardInfo.fap_at }}</span></p>
                </v-card-text>
                <div class="px-1">
                  <v-row no-gutters>
                    <v-col md="4" cols="12" class="px-1">
                      <v-btn
                        v-permissions="'card reset'"
                        small
                        class="px-2  mb-1  d-inline-block"
                        width="100%"
                        rounded
                        color="secondary"
                        @click="formDataReset.dialog = true"
                      >  {{ $t('cards.reset') }} <v-icon class="mr-1" small>mdi-refresh </v-icon></v-btn>
                    </v-col>
                    <v-col md="4" cols="12" class="px-1">
                      <v-btn
                        v-permissions="'session viewAny'"
                        small
                        class="px-2  mb-1  d-inline-block"
                        width="100%"
                        rounded
                        color="secondary"
                        @click="$router.push('/sessions?username=' + cardInfo.username)"
                      >  {{ $t('menu.sessions') }} <v-icon class="mr-1" small>mdi-clipboard-text-clock-outline </v-icon></v-btn>
                    </v-col>
                    <v-col md="4" cols="12" class="px-1">
                      <v-btn
                        v-permissions="'card editPassword'"
                        small
                        class="px-2  mb-1  d-inline-block"
                        width="100%"
                        rounded
                        color="secondary"
                        @click="formDataResetPassword.dialog = true"
                      >  {{ $t('cards.resetPassword') }} <v-icon class="mr-1" small>mdi-lock-reset </v-icon></v-btn>
                    </v-col>
                    <v-col md="4" cols="12" class="px-1">
                      <v-btn
                        v-permissions="'card buy'"
                        small
                        class="px-2  mb-1  d-inline-block"
                        width="100%"
                        rounded
                        color="secondary"
                        @click="formDataAddNewPacket.dialog = true"
                      >  {{ $t('cards.addNewPacket') }} <v-icon class="mr-1" small>mdi-package-variant-closed </v-icon></v-btn>
                    </v-col>
                    <v-col md="4" cols="12" class="px-1">
                      <v-btn
                        v-permissions="'card renew'"
                        small
                        class="px-2  mb-1  d-inline-block"
                        width="100%"
                        rounded
                        color="secondary"
                        @click="formReNewPacket.dialog = true , formReNewPacket.oldPacket = cardInfo.packet"
                      >  {{ $t('cards.renewCard') }} <v-icon class="mr-1" small>mdi-autorenew </v-icon></v-btn>
                    </v-col>
                    <v-col md="4" cols="12" class="px-1">
                      <v-btn
                        v-permissions="'card upgrade'"
                        small
                        class="px-2  mb-1  d-inline-block"
                        width="100%"
                        rounded
                        color="secondary"
                        @click="formUpgradePacket.dialog = true"
                      >  {{ $t('cards.upgrade') }} <v-icon class="mr-1" small>mdi-cog-transfer </v-icon></v-btn>
                    </v-col>
                  </v-row>
                  
                </div>
              </v-card>
              <v-card class="mt-3">
                <v-card-title>
                  {{ $t('cards.macAddressHeader') }}    
                  <v-btn
                    v-permissions="'mac update'"
                    icon
                    color="info"
                    @click="macAddrssDialog = true"
                  >  <v-icon small>mdi-circle-edit-outline</v-icon></v-btn>            
                </v-card-title>
                <v-card-text v-if="macs.length !== 0">
                  <v-chip
                    v-for="(mac , index ) in macs"
                    :key="index"
                    color="primary"
                    class="ml-1 mb-1"
                  >
                    {{ mac.mac }}
                  </v-chip>
                </v-card-text>
                <v-card-text v-else>
                  <p style="font-size:18px ; user-select: none;" class="text-center">{{ $t('common.noData') }}</p>
                </v-card-text>
              </v-card>
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-dialog v-model="macAddrssDialog" max-width="450">
      <v-card>
        <v-card-title class="headline"> {{ $t('cards.macAddressHeader') }}</v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="10" md="11" class="mb-0 pb-0 ">
              <v-form ref="form" >
                <v-text-field
                  v-model="macAddress"
                  :label="$t('cards.macAddress')"
                  outlined
                  :rules="[mac]"
                  dense
                  class="ml-1"
                  @keyup.enter="addMacToArray"
                ></v-text-field>
                <v-text-field style="display:none"></v-text-field>
              </v-form>
            </v-col>
            <v-col cols="2" md="1" class="mb-0 pb-0 ">
              <v-btn icon class="float-left" color="info" @click="addMacToArray"><v-icon>mdi-plus-circle</v-icon></v-btn>
            </v-col>

            <v-col cols="12" class="mb-0 pb-0 pt-1 " >
              <v-chip
                v-for="(mac , index ) in macAddresses"
                :key="index"
                color="secondary"
                small
                class="ml-1 mb-1"
                close
                @click:close="removeMac(index)"
              >
                {{ mac }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" :loading="loadingAddMac" @click="deleteAllMac">{{
            $t(`common.deleteAll`)
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="macAddrssDialog = false">{{
            $t(`common.cancel`)
          }}</v-btn>
          <v-btn :disabled="macAddresses.length == 0" color="primary" :loading="loadingAddMac" @click="addNewMac">{{
            $t(`common.save`)
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <MessageResetConfirm v-if="formDataReset.dialog" v-model="formDataReset" />
    <MessageResetPasswordConfirm v-if="formDataResetPassword.dialog" v-model="formDataResetPassword" />
    <AddNewPacketConfirm v-if="formDataAddNewPacket.dialog" v-model="formDataAddNewPacket" />
    <MessageReNewConfirm v-if="formReNewPacket.dialog" v-model="formReNewPacket" />
    <MessageUpgradeConfirm v-if="formUpgradePacket.dialog" v-model="formUpgradePacket" />
    <UpdateCard v-if="updateCard.dialogUpdateCard" v-model="updateCard" />
    
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'

import MessageResetConfirm from '~/components/confirm/reset-card.vue'
import MessageResetPasswordConfirm from '~/components/confirm/reset-password-card.vue'
import AddNewPacketConfirm from '~/components/confirm/add-new-packet.vue'
import MessageReNewConfirm from '~/components/confirm/renew-card.vue'
import MessageUpgradeConfirm from '~/components/confirm/upgrate-card.vue'
import UpdateCard from '~/components/confirm/update-card.vue'

// import dateFormat, { masks } from 'dateformat'
export default {
  components :{
    MessageResetConfirm , MessageResetPasswordConfirm , AddNewPacketConfirm , MessageReNewConfirm ,MessageUpgradeConfirm , UpdateCard
  }, 
  mixins: [Rules] ,
  data() {
    return {
      isCardOnline : false ,
      updateCard : {
        dialogUpdateCard : false ,
        userInfo : {},
        customer_name : '' ,
        status : false 
      },
      heightScreen : 200 ,
      cardInfo : {
        userid : null ,
        packet : {
          name : '' 
        }
      } ,
      env : {
        LOGO_URL : process.env.LOGO_URL

      },
      cardPassword : '****************' ,
      loadingData : false,
      series: [60],
      chartOptions: {
        chart: {
          height: 200,
          type: 'radialBar'
          
        },
        colors:['#222071'],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                color: undefined
              },
              value: {
                offsetY: -10,
                fontSize: '16px',
                color: '#fff',
                formatter: function (val) {
                  return val + '%'
                }
              } },
                  
            hollow: {
              size: '40%'
            }
          }
        },
        labels: ['']
      },
      dataForm : {
        password : null ,
        userid : null,
        packetid : null
      },
      keySearchUser : null ,
      timer : null ,
      usersActive : [] ,
      loadingSave : false ,
      loadingReset : false ,
      macAddrssDialog : false ,
      loadingAddMac : false ,
      macs : [],
      macAddress : '' ,
      macAddresses : [] ,
      dialogReset : false ,
      formDataReset : {
        resetApi : 'card/' + this.$route.params.id + '/reset' ,
        dialog : false ,
        status : false 
      },
      formDataResetPassword :{
        resetApi : 'card/' + this.$route.params.id + '/password' ,
        dialog : false ,
        status : false 
      },
      formDataAddNewPacket :{
        resetApi : 'card/' + this.$route.params.id + '/packet' ,
        dialog : false ,
        status : false 
      },
      formReNewPacket :{
        resetApi : 'card/' + this.$route.params.id + '/renew' ,
        dialog : false ,
        status : false ,
        oldPacket : null
      },
      formUpgradePacket :{
        resetApi : 'card/' + this.$route.params.id + '/upgrade' ,
        dialog : false ,
        status : false 
      }
    }
  },
  watch : {
    'formDataReset.status' : function(status) {
      if (status) {
        this.getCardInfo()
        this.formDataReset.status = false
      }
    },

    'updateCard.status' : function(status) {
      if (status) {
        this.getCardInfo()
        this.formDataReset.status = false
      }
    },
    
    'formDataAddNewPacket.status' : function(status) {
      if (status) {
        this.getCardInfo()
        this.formDataAddNewPacket.status = false
      }
    },
    'formReNewPacket.status' : function(status) {
      if (status) {
        this.getCardInfo()
        this.formReNewPacket.status = false
      }
    },
    'formUpgradePacket.status' : function(status) {
      if (status) {
        this.getCardInfo()
        this.formUpgradePacket.status = false
      }
    }
  },
  created() {
    if (document.documentElement.clientWidth < 450) {
      this.heightScreen = 150
    }
    this.getCardInfo(),
    this.getCardIsOnline()
    if (this.hasPermission('mac viewAny')) {
      this.getMacAddress()
    }
  },
  methods: {
    openDialogToUpdateCard() {
      this.updateCard.dialogUpdateCard = true
      this.updateCard.userInfo = this.cardInfo.user
      this.updateCard.customer_name = this.cardInfo.customer_name
    },
    getCardInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/card/${this.$route.params.id}`)
        .then((res) => {
          this.cardInfo  = res.data
          this.series = this.cardInfo.bandwidth_usage ?  [100 - this.cardInfo.bandwidth_usage] : [100]
          this.usersActive.push(this.cardInfo.user)

          // this.cardInfo.start_at = this.cardInfo.start_at !== '' ? dateFormat(this.cardInfo.start_at, 'HH:MM yyyy-mm-dd') : ''
          // this.cardInfo.end_at = this.cardInfo.end_at !== '' ? dateFormat(this.cardInfo.end_at, 'HH:MM yyyy-mm-dd') : ''
          // this.cardInfo.reset_at = this.cardInfo.reset_at !== '' ? dateFormat(this.cardInfo.reset_at, 'HH:MM yyyy-mm-dd') : ''
          // this.cardInfo.fap_at = this.cardInfo.fap_at !== '' ? dateFormat(this.cardInfo.fap_at, 'HH:MM yyyy-mm-dd') : ''
         
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    getPasswordCard() {
      this.$axios
        .$get(`/admin/card/${this.$route.params.id}/password`)
        .then((res) => {
          this.cardPassword  = res.data.password          
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getCardIsOnline() {
      this.$axios
        .$get(`/admin/card/${this.$route.params.id}/online`)
        .then((res) => {
          this.isCardOnline  = res.data.online          
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getUsers() {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        let query = ''

        if (this.keySearchUser) {
          query =  `/admin/user?filter[name]=${this.keySearchUser}`
        } else {
          query =  '/admin/user'
        }
        this.$axios.$get(query)
          .then((res) => {
            this.usersActive = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
      
    },
    resetCard() {
      this.loadingReset = true
      this.$axios
        .$delete(`/admin/card/${this.$route.params.id}/online`)
        .then((res) => {
          this.$store.dispatch('showSuccess', this.$t('cards.successRest'))  
          this.getCardIsOnline()   
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingReset = false
        })
    },
    addMacToArray() {
      if (this.$refs.form.validate() && this.macAddress) {
        this.macAddresses.push(this.macAddress)
        this.macAddress = '' 
        this.$refs.form.resetValidation()
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    },
    getMacAddress() {
      this.$axios
        .$get(`/admin/card/${this.$route.params.id}/mac`)
        .then((res) => {
          this.macs  = res.data   
          this.macAddresses = this.macs.map( (a) => a.mac )   
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    addNewMac() {
      this.$axios
        .$post(`/admin/card/${this.$route.params.id}/mac` , { mac :  this.macAddresses })
        .then((res) => {
          this.$store.dispatch('showSuccess', this.$t('common.success'))  
          this.getMacAddress()    
          this.macAddresses = [] 
          this.macAddrssDialog = false
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    removeMac(index) {
      this.macAddresses.splice(index, 1)
    },
    convertSpeed(speed) {
      if (speed === null) {
        return this.$t('common.unlimit')
      }
      if (speed / 1024 < 1024) {   
        return  Math.round(speed / 1024 * 100) / 100  + ' KB'
      } else if (speed / 1024 / 1024 <= 1024) {
        return  Math.round(speed / 1024 / 1024 * 100) / 100  + ' MB'
      } else {
        return  Math.round(speed / 1024 / 1024 / 1024 * 100) / 100  + ' GB'
      }
    },
    deleteAllMac() {
      this.macAddrssDialog = false
      this.macAddresses = []  
      this.addNewMac()
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.dataForm.packetid = this.cardInfo.packetid
        this.dataForm.userid = this.cardInfo.userid
        
        this.$axios
          .$put(`/admin/card/${this.$route.params.id}`, this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            // this.$router.push('/cards')
            this.dataForm.password = null
            this.cardPassword = '****************'
            this.getCardInfo()
            this.getCardIsOnline()
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