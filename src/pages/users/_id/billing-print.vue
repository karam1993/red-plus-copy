<template>
  <div v-permissions="'billing viewAny'" class="d-flex flex-grow-1 flex-column" >
    <v-card>
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="$router.push(`/users/${$route.params.id}/billing`)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title> {{ $t('billing.printBilling') }}</v-toolbar-title>
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
        <v-card-text id="sectionCards" class="">
          <div v-if="userInfo" class="tabelPrint" style="font-family: &quot;Tajawal&quot;, sans-serif;">
            <div style="width: 180px; float:right ;     text-align: right;margin-bottom: 15px">
              <h3>{{ env.CITY }}</h3>
              <p class="mb-1">{{ env.ADDRESS }}</p>
              <p> <span style="unicode-bidi: plaintext;" class="mr-1">{{ env.PHONE }}</span> <v-icon small>mdi-phone</v-icon></p>
            </div>
            <div style="width: 180px; float:left ;     text-align: right;margin-bottom: 15px">
              <img style="width: 150px !important;" :src="env.LOGO_URL" />
            </div>
            <h3 style="direction: rtl; text-align:center ;margin-top: 20px; font-size:24px ; color: #272570" class=" mt-1 mb-2 primary--text">{{ $t('billing.billingHeder' , {name : userInfo.name} ) }}</h3>
            <v-row
              style="text-align: end; direction: rtl;"
              class="justify-center"
            >
              <v-col v-for="(filter , index) in filterInvoice" :key="index" cols="5">
                <h4 style="font-size: 12px;">{{ filter.name + ' : ' + filter.value }}</h4>
              </v-col>
            </v-row>
            <table width="100%" style="border: 1px solid;     direction: rtl;  border-collapse: collapse; text-align: right;">
              <thead>
                <tr style="background-color: #b1b1b1; height:40px ; -webkit-print-color-adjust: exact; " >
                  <th width="20%" class="text-right" style="border: 1px solid; padding:4px">
                    {{ $t('billing.data') }}
                  </th>
                  <th width="20%" class="text-right" style="border: 1px solid; padding:4px">
                    {{ $t('billing.info') }}
                  </th>
                  <th width="20%" class="text-right" style="border: 1px solid; padding:4px">
                    {{ $t('billing.forHe') }}
                  </th>
                  <th width="20%" class="text-right" style="border: 1px solid; padding:4px">
                    {{ $t('billing.forWe') }}
                  </th>
                  <th width="20%" class="text-right" style="border: 1px solid; padding:4px">
                    {{ $t('billing.amounts') }}
                  </th>

                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(balance , index) in balanceData"
                  :key="index"
                  style="height:40px"
                >
                  <td style="border: 1px solid; padding:4px">{{ balance.created_at }}</td>
                  <td style="border: 1px solid; padding:4px">{{ balance.description }} <b v-if="balance.reference.billable">{{ Object.keys(balance.reference.billable)[0] == 'user' ? balance.reference.billable['user']['name'] : '' }}</b></td>
                  <td style="border: 1px solid; padding:4px" v-text="balance.debit ? balance.debit + ' ' + balance.currency : 0 "></td>
                  <td style="border: 1px solid; padding:4px" v-text="balance.credit ? balance.credit + ' ' + balance.currency : 0 "></td>
                  <td style="border: 1px solid; padding:4px">{{ balance.balance + ' ' + balance.currency }}</td>
                </tr>
                <tr style="height:40px">
                  <td style="border: 1px solid; padding:4px"></td>
                  <td style="border: 1px solid; padding:4px">{{ $t('billing.allProcess') }}</td>
                  <td style="border: 1px solid; padding:4px">{{ totalDebit }}  TRY</td>
                  <td style="border: 1px solid; padding:4px">{{ totalCredit }}  TRY</td>
                  <td style="border: 1px solid; padding:4px"></td>
                        
                </tr>
              </tbody>
            </table >
            <h3 style="direction: rtl; text-align:center ; margin-top:10px ; font-size:20px ; color: #272570" class="text-center primary--text  mt-1 , pb-2">الاجمالي  - <span v-text="balanceType != 'credit' ? $t('billing.forHe') : $t('billing.forWe') "></span> {{ lastBalance }} <span>TRY</span> </h3>
          </div>
        </v-card-text>

      </v-card>

    </v-card>
  </div>
</template>
<script>
// import dateFormat, { masks } from 'dateformat'

export default {
  data() {
    return {
      balanceData : [] ,
      lastBalance : 0 ,
      totalDebit : 0 ,
      totalCredit : 0 ,
      balanceType : null ,
      userInfo : null ,
      env : {
        CITY : process.env.CITY ,
        ADDRESS : process.env.ADDRESS ,
        PHONE :  process.env.PHONE ,
        LOGO_URL : process.env.LOGO_URL

      },
      filterInvoice : []

    }
  },
  created() {
    this.filterInvoice = this.$store.getters.filterInvoice
    this.getBilling()
    this.getUserInfo()
  },
  methods: {
    getBilling() {

      this.filterInvoice = this.$store.getters.filterInvoice
      let query = '?page[size]=10000&'
    
      if (this.filterInvoice.length !== 0) {
        for (let index = 0; index < this.filterInvoice.length; index++) {
          query += this.filterInvoice[index]['filter'] + '=' + this.filterInvoice[index]['value'] + '&'
        }
      }
        
      this.$axios
        .$get(`/admin/user/${this.$route.params.id}/billing${query}`)
        .then((res) => {
          this.balanceData = res.data
          this.totalDebit = res.totalDebit
          this.totalCredit = res.totalCredit
          this.lastBalance = res.lastBalance ,
          this.balanceType = res.BalanceType
          
          // this.balanceData.map((item) => (
          //   item.control_at = item.control_at !== '' ? dateFormat(item.control_at, 'HH:MM dd-mm-yyyy') : '' ,
          //   item.created_at = item.created_at !== '' ? dateFormat(item.created_at, 'HH:MM dd-mm-yyyy') : '' 
            
          // ))
           
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    getUserInfo() {
      this.$axios
        .$get(`/admin/user/${this.$route.params.id}`)
        .then((res) => {
          this.userInfo  = res.data
        })
    },
    print() {
      this.$htmlToPaper('sectionCards')
    }
  }
}
</script>