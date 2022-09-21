<template>
  <div v-permissions="'attribute create'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-text>
        <v-form ref="form" >
          <div v-for="(item , index ) in dataForm" :key="index">
            <v-row>
              <v-col cols="12" md="1" class="pb-0 pt-1 mx-0">
                <v-btn icon color="error" @click="removeRow(index)"> <v-icon>mdi-trash-can-outline</v-icon></v-btn>
              </v-col>
              <v-col cols="12" md="2" class="pb-0 pt-1 px-0">
                <v-autocomplete
                  v-model="item.mode"
                  :rules="[required]"
                  :label="$t('attribute.mode')"
                  outlined
                  :items="['check' , 'reply']"
                  dense
                  :no-data-text="$t('common.noDataAvailable')"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" class="pb-0 pt-1">
                <v-autocomplete
                  v-model="item.attributeid"
                  :rules="[required]"
                  :loading="loadingItems"
                  item-text="name"
                  item-value="attributeid"
                  :items="attributes"
                  :label="$t('attribute.attribute')"
                  outlined
                  dense
                  :no-data-text="$t('common.noDataAvailable')"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" class="pb-0 pt-1">
                <v-autocomplete
                  v-model="item.operator"
                  :rules="[required]"
                  :label="$t('attribute.operator')"
                  outlined
                  dense
                  :items="['=',':=','==','+=','!=','>','<','>=','<=','=~','!=']"
                  :no-data-text="$t('common.noDataAvailable')"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" class="pb-0 pt-1">
                <v-text-field
                  v-model="item.value"
                  :rules="[required]"
                  :label="$t('attribute.value')"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <v-btn color="primary" @click="save">
            {{ $t('common.save') }}
          </v-btn>
          <v-btn :title="$t('common.addRow')" color="primary" @click="addRow">
            <v-icon>mdi-plus-circle</v-icon>
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <AttributeConfirm v-model="formDataComfirm" />
  </div>
</template>

<script>
import Rules from '~/apps/validation/index'
import AttributeConfirm from '~/components/confirm/confirm-attribute.vue'

export default {
  components :{
    AttributeConfirm 
  },
  mixins: [Rules] ,
  data() {
    return {
      dataForm : [],
      attributes : [] ,
      loadingItems : false ,
      formDataComfirm : {
        confirmApi : `/admin/packet/${this.$route.params.id}/attribute` ,
        dialog : false ,
        status : false ,
        dataForm : [] 
      }
    }
  },
  watch :{
    'formDataComfirm.status' : function(status) {
      if (status) {
        this.getAttributsForPacket()
      }
    } 
  },
  created() {
    this.getAttribute()
    this.getAttributsForPacket()
  },
  methods: {
    getAttribute() {
      this.loadingItems = true 
      this.$axios
        .$get('/admin/attribute')
        .then((res) => {
          this.attributes = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    getAttributsForPacket() {
      this.loadingItems = true
      this.$axios
        .$get(`/admin/packet/${this.$route.params.id}/attribute`)
        .then((res) => {
          this.dataForm = res.data
          if (this.dataForm.length === 0 ) {
            this.dataForm.push({ 'mode' : '' , 'operator' : '' , 'value' : '' , 'attributeid' : '' 
            })
          }
          this.formDataComfirm.status = false
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.formDataComfirm.dialog = true
        this.formDataComfirm.dataForm = this.dataForm
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
      
    },
    addRow () {
      this.dataForm.push({
        mode : '' ,
        operator : '' ,
        value : '' ,
        attributeid : '' 
      })
    },
    removeRow(index) {
      this.dataForm.splice(index, 1)
    }
  }
}
</script>