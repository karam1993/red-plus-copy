<template>
  <v-dialog v-model="initialvalue.dialog" max-width="350">
    <v-card>
      <v-card-title class="headline">{{
        $t("cards.upgradeCardTitddle")
      }}</v-card-title>
      <v-card-text>{{ $t("cards.upgradeCardText") }}
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete
                v-model="dataForm.packet"
                :label="$t('cards.packet')"
                :rules=" [required] "
                outlined
                dense
                item-text="name" 
                item-value="packetid"
                :items="activePackets"
                return-object
                :no-data-text="$t('common.noDataAvailable')"
                @change="calcPrice"
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
              <p v-if="amountForUpgrade" class="text-caption error--text">{{ $t('billing.confirmMsg' , {price : amountForUpgrade} ) }}</p>
            </v-col>
          </v-row>
        </v-form>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="initialvalue.dialog = false">{{
          $t(`common.cancel`)
        }}</v-btn>
        <v-btn :disabled="amountForUpgrade == null" color="error" :loading="loading" @click="resetConfirm">{{
          $t(`common.ok`)
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Rules from '~/apps/validation/index'
export default {
  mixins: [Rules] ,
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      initialvalue: this.value ,
      loading : false ,
      activePackets : [] ,
      dataForm : {
        packet : null
      },
      amountForUpgrade  : null 
    }
  },
  created() {
    this.getActivePacket()
  },
  methods: {
    resetConfirm() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const dataForm = {
          packetid : this.dataForm.packet.packetid
        }
 
        this.$axios.$post('/admin/' + this.initialvalue.resetApi , dataForm)
          .then(() => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.initialvalue.status = true
            this.initialvalue.dialog = false
            this.getBalance()
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          }).finally(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    },
    getActivePacket() {
      this.$axios
        .$get('/admin/packet?page[size]=100000&filter[status]=true')
        .then((res) => {
          this.activePackets = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    getBalance() {
      this.$axios
        .$get('/balance')
        .then((res) => {
          this.$store.commit('setBalance', res.data.billing.balance + ' ' + res.data.billing.currency )       
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    calcPrice(item) {
      this.$axios
        .$get('/admin/card/' + this.$route.params.id + '/upgrade/' + item.packetid)
        .then((res) => {
          this.amountForUpgrade = res.data.amount
        }).catch((err) => {
          this.amountForUpgrade = null
          this.$store.dispatch('showError', err.response.data.message)
        })

      console.log(item.packetid)
    }
  }

}
</script>
