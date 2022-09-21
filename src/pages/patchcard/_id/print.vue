<template>
  <div v-permissions="'patchcard create'" class="d-flex flex-grow-1 flex-column">
    <v-skeleton-loader
      v-if="loadingData"
      type="article"
    ></v-skeleton-loader>
    <v-card v-else>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="$router.push(`/patchcard/${$route.params.id}/show`)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title> {{ $t('common.printCard') }}</v-toolbar-title>
        <v-switch v-model="showPrice" class="mt-3 mr-2" inset :label="$t('patchcard.showPrice')"></v-switch>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="print"
          >
            {{ $t('common.print') }}
          </v-btn>
          
        </v-toolbar-items>
        
      </v-toolbar>
      <v-card-text id="sectionCards" class="pa-0">
        
        <div>
          <div
            v-for="(card , index) in patchcardInfo.cards"
            :key="index"
            class="colPrint page-break"
            style="width: 33.3% ; float:left ; direction: rtl;padding: 2px ; position: relative; display: block"
          >
            
            <v-card elevation="0" class="cardPrint" style=" border-radius : 0 ; box-shadow: none; background: linear-gradient(to right, rgb(255 217 156) 0%, rgb(255 243 222) 100%) ;     font-family: 'Tajawal', sans-serif;">
              <v-card-text class="card" style="border-radius : 0 ; padding-top: 10px;" > 
                <div 
                  class="cardbody"
                  :style="'background-image: url('+env.LOGO_URL+') ; position: relative; background-size: 55px; height: 86px;'"
                >
                  <h2 style="font-size: 15px; position: relative; top: -5px; color: #f9b343 ">{{ patchcardInfo.patchcard.packet.name }}</h2>
                  <h3 class="mt-2" style="color: #272570; position: absolute; bottom: -13px; right: 0px;">{{ convertSpeed(patchcardInfo.patchcard.packet.speed_up) }}</h3>
                  <p style="margin-bottom: 0; top: -4px; position: relative;"><span style="    background-image: url(/images/logo/username.png); width: 20px; height: 20px; display: inline-block; background-size: cover; position: relative; top: 4px; left : 5px"></span> <b
                    style="       line-height: 20px; font-size: 16px; border: 1px solid #f9b343; width: 130px; display: inline-block; background: #fff; border-radius: 5px; text-align: center; margin-top: 8px;"
                  >{{ card.username }}</b> </p>
                  <p style="top: -8px; position: relative;"><span style="    background-image: url(/images/logo/password.png); width: 20px; height: 20px; display: inline-block; background-size: cover; position: relative; top: 4px; left : 5px;"></span> <b
                    style="       line-height: 20px; font-size: 16px; border: 1px solid #f9b343; width: 130px; display: inline-block; background: #fff; border-radius: 5px; text-align: center; margin-top: 8px;"
                  >{{ card.password }}</b> </p>
                  <label v-if="showPrice" style="position: absolute; bottom : 6px ; left: -6px; font-weight: bold; font-size: 11px;"> <span
                    style="    border: 1px solid rgb(249, 179, 67); display: inline-block; height: 20px; text-align: center; line-height: 16px; border-radius: 10px; background: rgb(249, 179, 67); color: rgb(39, 37, 112); padding: 2px 6px;"
                  >{{ patchcardInfo.patchcard.packet.price + ' ' + patchcardInfo.patchcard.packet.currency }} </span></label>
                  <label style="position: absolute; bottom: -15px; left: -6px; font-weight: bold; color: rgb(43, 43, 43); font-size: 8px;">صالحة لمدة {{patchcardInfo.patchcard.packet.expirtion}} يوم </label>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingData : false ,
      patchcardInfo : null ,
      showPrice : true ,
      env : {
        LOGO_URL : process.env.LOGO_URL

      }

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
    print () {
      // Pass the element id here
      this.$htmlToPaper('sectionCards')
    },
    convertSpeed(speed) {
      if (speed / 1024 < 1024) {   
        return  Math.round(speed / 1024 * 100) / 100  + ' KB'
      } else if (speed / 1024 / 1024 <= 1024) {
        return  Math.round(speed / 1024 / 1024 * 100) / 100  + ' MB'
      } else {
        return  Math.round(speed / 1024 / 1024 / 1024 * 100) / 100  + ' GB'
      }
    }
  }
}
</script>