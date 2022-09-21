<template>
  <div v-permissions="'user view'" class="d-flex flex-grow-1 flex-column" >
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
                v-model="userInfo.name"
                :rules="[required]"
                :label="$t('user.name')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="userInfo.email"
                :rules="[emailSyntax]"
                style="direction: ltr;"
                :label="$t('user.email')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="userInfo.mobile"
                :rules=" [required ]"
                style="direction: ltr;"
                :label="$t('user.mobile')"
                outlined
                dense
                @input="typePhoneNumner"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete
                v-model="selectedRols"
                :rules="[]"
                :label="$t('user.roles')"
                outlined
                multiple
                :items="roleItems"
                :disabled="!hasPermission('role viewAny')"
                item-text="name"
                item-value="id"
                return-object
                dense
                chips
                small-chips
                :no-data-text="$t('common.noDataAvailable')"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-switch
                v-model="userInfo.status"
                class="mt-0 pt-1"
                :label="$t('user.status')"
                outlined
                inset
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-switch
                v-model="changePasswordStatus"
                class="mt-0 pt-1"
                :label="$t('user.changePassword')"
                outlined
                inset
                @change="changePassword"
              ></v-switch>
            </v-col>
            <v-col v-if="changePasswordStatus" cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="userInfo.password"
                :type="show1 ? 'text' : 'password'"
                :rules="[required]"
                :label="$t('user.password')"
                outlined
                dense
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
            <v-col v-if="changePasswordStatus" cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="userInfo.password_confirm"
                :type="show2 ? 'text' : 'password'"
                :rules="[required]"
                :label="$t('user.password_confirm')"
                outlined
                dense
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show2 = !show2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0 pt-1">
              <v-textarea
                v-model="userInfo.note"
                :rules=" []"
                :label="$t('user.nots')"
                outlined
                dense
              ></v-textarea>
            </v-col>
            <v-col cols="12" >
              <v-btn :loading="loadingSave" color="primary" @click="save">
                {{ $t('common.save') }}
              </v-btn>
            </v-col>

            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-alert
                dense
                :type="userInfo.isEmailVerified ? 'success' : 'warning'"
              > 
                <span v-if="userInfo.isEmailVerified">{{ $t('user.email_verified') }} {{ userInfo.email_verified_at }}</span>
                <span v-else>{{ $t('user.email_not_verified') }}<v-btn color="info" class="px-1" @click="resendCode('email')"> <v-icon class="px-1">mdi-send-circle-outline</v-icon>{{$t('common.resend')}}</v-btn></span>
              </v-alert>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-alert
                dense
                :type="userInfo.isMobileVerified ? 'success' : 'warning'"
              > 
                <span v-if="userInfo.isMobileVerified">{{ $t('user.mobile_verified') }} {{ userInfo.mobile_verified_at }}</span>
                <span v-else> {{ $t('user.mobile_not_verified') }} <v-btn color="info" class="px-1" @click="resendCode('mobile')"> <v-icon class="px-1">mdi-send-circle-outline</v-icon>{{$t('common.resend')}}</v-btn></span>
              </v-alert>
            </v-col>
            <v-col v-if="userInfo.ref" cols="12" md="6" class="pb-0 pt-1">
              <v-alert
                border="left"
                colored-border
                type="info"
                elevation="2"
              >
                <h3 class="mb-1">{{ $t('user.ref') }}</h3>
                <p class="mb-1">{{ $t('user.regestedBy') }} 
                  <NuxtLink :to="localePath(`/users/${userInfo.ref.userid}/edit`)">
                    {{ userInfo.ref.name }}
                  </NuxtLink>
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
                <b class="mb-1">{{ $t('user.balance') }}  </b> 
                <v-btn small color="info" @click="$router.push('/users/'+$route.params.id+'/billing')">{{ $t('common.balanceList') }}  <v-icon small>mdi-currency-usd</v-icon></v-btn>
                <p class="mb-1 mt-2">{{ $t('user.balanceInfo') }} 
                  {{ userInfo.billing.balance }} {{ userInfo.billing.currency }}
                  
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
                <b class="mb-1">{{ $t('user.antherpermission') }}</b>
                <p v-if="antherPremissions.length != 0 " class="mb-1 mt-2">
                  <v-chip v-for="(permission , index) in antherPremissions" :key="index" color="primary" class="mb-1 ml-1">
                    {{ permission.name }}
                  </v-chip>
                </p>
                <p v-else style="font-size:18px ; user-select: none;" class="text-center mt-1">{{ $t('common.noData') }}</p>
              </v-alert>
            </v-col> 
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-alert
                border="left"
                colored-border
                type="info"
                elevation="2"
              >
                <b class="mb-1">{{ $t('user.userCards') }}  </b> 
                <v-btn small color="info" @click="$router.push('/cards?userid='+ $route.params.id + '&name=' + userInfo.name )" >{{ $t('user.cardList') }}  </v-btn>
                <p class="mb-1 mt-2">
                  {{ $t('user.userCardsParagraph' , {name : userInfo.name}) }}
                </p>
              </v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'
// import dateFormat, { masks } from 'dateformat'

export default {
  mixins: [Rules] ,
  data() {
    return {
      userInfo : null ,  
      loadingData: false,
      roleItems: [] ,
      changePasswordStatus : false ,
      show1 : false ,
      show2 : false ,
      loading : false,
      selectedRols : [],
      loadingSave : false,
      antherPremissions : [] 
    }
  },
  created() {
    this.getUserInfo()
    if (this.hasPermission('role viewAny')) {
      this.getRols()
    }
    this.getAnotherPermission()
  },
  methods: {
    getUserInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/user/${this.$route.params.id}`)
        .then((res) => {
          this.userInfo  = res.data
          this.userInfo.mobile = '+' + this.userInfo.mobile
          this.selectedRols = this.userInfo.roles
          // this.userInfo.email_verified_at =  dateFormat(this.userInfo.email_verified_at, 'HH:MM yyyy-mm-dd')
          // this.userInfo.mobile_verified_at =  dateFormat(this.userInfo.mobile_verified_at, 'HH:MM yyyy-mm-dd')
          
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    getAnotherPermission() {
      this.$axios
        .$get(`/admin/user/${this.$route.params.id}/permission`)
        .then((res) => {
          this.antherPremissions  = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getRols() {
      this.$axios
        .$get('/admin/role?page[size]=100000')
        .then((res) => {
          this.roleItems = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    changePassword(val) {
      if (val) {
        this.$set(this.userInfo , 'password' , '')
        this.$set(this.userInfo , 'password_confirm' , '')
            
      } else {
        this.$delete(this.userInfo , 'password' )
        this.$delete(this.userInfo , 'password_confirm' )
      }
    },
    typePhoneNumner() {
      if (this.userInfo.mobile.charAt(0) !== '+') {
        this.userInfo.mobile = '+' + this.userInfo.mobile
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.userInfo.roles = this.selectedRols.map(({ id }) => id)

        const userInfo = { ...this.userInfo }

        if (this.userInfo.mobile.charAt(0)) {
          userInfo.mobile = this.userInfo.mobile.substring(1) 
        }

        this.$axios
          .$put(`/admin/user/${this.$route.params.id}`, userInfo)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.getUserInfo()
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
    },
    resendCode(type) {
      let api = ''

      if (type === 'mobile') {
        api = `/admin/user/${this.$route.params.id}/resend/mobile`
      }
      else {
        api = `/admin/user/${this.$route.params.id}/resend/email`
      }
      this.$axios
        .$post(api)
        .then((res) => {
          this.$store.dispatch('showSuccess', this.$t('common.success'))
        })
    }
  }
}
</script>