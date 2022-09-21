<template>
  <div class="d-flex flex-grow-1 flex-column">
    <client-only>
      <v-row class="flex-grow-0" dense>
        <v-col v-if="hasPermission('billing viewAny')" cols="12">
          <sales-card
            class="h-full"
            style="min-height: 380px"
            :value="weeksales"
            :percentage="3.2"
            :loading="isLoading1"
            :percentage-label="$t('dashboard.lastweek')"
            :action-label="$t('dashboard.viewReport')"
            :series="seriesWeeklly"
            :monthly="monthSales"
            :xaxis="dateChart"
          ></sales-card>
        </v-col>

        <v-col v-permissions="'statistic view'" cols="12" md="3">
          <v-card class="pa-1">
            <v-card-title>{{ $t('dashboard.totalCountCard') }}</v-card-title>
            <v-card-title class="info--text">
              <v-icon x-large color="info">mdi-credit-card-outline</v-icon>
              <v-spacer></v-spacer>
              <v-icon color="info">mdi-arrow-up</v-icon>
              {{ cardCount.total }}
            </v-card-title>
          </v-card>
        </v-col>
        <v-col v-permissions="'statistic view'" cols="12" md="3">
          <v-card class="pa-1">
            <v-card-title> {{ $t('dashboard.activeCountCard') }} </v-card-title>
            <v-card-title class="info--text">
              <v-icon x-large color="info">mdi-credit-card-check-outline</v-icon>
              <v-spacer></v-spacer>
              <v-icon color="info">mdi-arrow-up</v-icon>
              {{ cardCount.active }}
            </v-card-title>
          </v-card>
        </v-col>
        <v-col v-permissions="'statistic view'" cols="12" md="3">
          <v-card class="pa-1">
            <v-card-title> {{ $t('dashboard.onlineCountCard') }} </v-card-title>
            <v-card-title class="info--text">
              <v-icon x-large color="info">mdi-credit-card-wireless-outline</v-icon>
              <v-spacer></v-spacer>
              <v-icon color="info">mdi-arrow-up</v-icon>
              {{ cardCount.inusage }}
            </v-card-title>
          </v-card>
        </v-col>
        <v-col v-permissions="'statistic view'" cols="12" md="3">
          <v-card class="pa-1">
            <v-card-title> {{ $t('dashboard.onlineUser') }} </v-card-title>
            <v-card-title class="primary--text">
              <v-icon x-large color="primary">mdi-account-group</v-icon>
              <v-spacer></v-spacer>
              <v-icon color="primary">mdi-arrow-up</v-icon>
              {{ usersOnline }}
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-1">
            <v-card-title class=""> {{ $t('dashboard.dollarPrice' ) }}  <v-btn v-permissions="'currency update'" icon color="primary" @click="dialogCurrency = true"> <v-icon>mdi-circle-edit-outline</v-icon></v-btn>

            </v-card-title>
            <v-card-title class="primary--text mb-0">
              <v-icon color="primary">mdi-currency-try</v-icon>
              <h3>{{ TRYPrice }}</h3>
              <v-spacer></v-spacer>
              <v-icon color="primary">mdi-currency-usd</v-icon>
              <h3 class="ml-1">1</h3>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </client-only>

    <v-dialog
      v-model="dialogCurrency"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('dashboard.currencyChange') }}
        </v-card-title>
        <v-card-text>
          <p>{{ $t('dashboard.currencyChangeParagrapg') }}</p>
          <v-text-field
            v-model="tlPrice"
            outlined
            hide-details
            dense
            @keyup.enter="changeCurrency"
          ></v-text-field>

        </v-card-text>
        <v-card-actions>
          
          <v-btn
            color="primary"
            @click="changeCurrency"
          >
            {{ $t('common.save') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="dialogCurrency = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// DEMO Cards for dashboard
import SalesCard from '@/components/dashboard/SalesCard'
import Rules from '~/apps/validation/index'

export default {
  components: {
    SalesCard
  },
  mixins: [Rules] ,
  data() {
    return {
      loadingInterval: null,
      isLoading1: true ,
      usersOnline : null,
      cardCount : {},
      TRYPrice : null,
      tlPrice : null ,

      dialogCurrency: false ,
      sales : null ,
      seriesWeeklly : [{ 'data' :  [18 , 18 , 18 , 18 , 18 , 18 , 18] }],
      weeksales : 0 ,
      monthSales : 10 ,
      dateChart : {
        categories : ['2018-09-19',
          '2018-09-20',
          '2018-09-21',
          '2018-09-22',
          '2018-09-23',
          '2018-09-24',
          '2018-09-25']
      }

    }
  },
  mounted() {
    if (this.hasPermission('nas viewAny')) {
      this.getUserOnline()
    }
    this.getCardCount()
    this.getCurrency()
    if (this.hasPermission('billing viewAny')) {
      this.getSales()
    }
    
    let count = 0

    this.loadingInterval = setInterval(() => {
      this[`isLoading${count++}`] = false
      if (count === 4) this.clear()
    }, 400)
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    clear() {
      clearInterval(this.loadingInterval)
    },
    getUserOnline() {
      this.$axios
        .$get('/admin/statistics/online')
        .then((res) => {
          this.usersOnline = res.data.totalonline
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getCardCount() {
      this.$axios
        .$get('/admin/statistics/card')
        .then((res) => {
          this.cardCount = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getCurrency() {
      this.$axios
        .$get('/admin/currency/TRY')
        .then((res) => {
          this.TRYPrice = res.data.price
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    changeCurrency() {
      this.$axios
        .$put('/admin/currency/TRY' , { price : this.tlPrice })
        .then((res) => {
          this.TRYPrice = res.data.price
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.tlPrice = null
          this.dialogCurrency = false
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getSales() {
      // this.loadingChart = true
      this.$axios
        .$get('/admin/statistics/sales')
        .then((res) => {
          
          this.seriesWeeklly[0]['data'] = res.data.daily.map((item) => item.sales)
          this.dateChart.categories = res.data.daily.map((item) => item.date)
          this.weeksales = res.data.weeksales 
          this.monthSales = res.data.monthsales
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    }
  },
  head() {
    return {
      title: this.$t('menu.dashboard')
    }
  }
}
</script>
