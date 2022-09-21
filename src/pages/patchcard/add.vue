<template>
  <div v-permissions="'patchcard create'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete
                v-model="dataForm.packetid"
                :items="packetsActive"
                :rules="[required]"
                :label="$t('patchcard.packetid')"
                outlined
                dense
                item-text="name"
                item-value="packetid"
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
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.totalCount"
                :rules="[required , number]"
                :label="$t('patchcard.totalCount')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.prefix"
                :label="$t('patchcard.prefix')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.userLength"
                :label="$t('patchcard.userLength')"
                outlined
                :rules="[required , number]"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.passLength"
                :label="$t('patchcard.passLength')"
                outlined
                :rules="[required , number]"
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="6" md="3" class="pb-0 pt-1">
              <v-switch
                v-model="dataForm.useInt"
                :label="$t('patchcard.useInt')"
                outlined
                inset
              ></v-switch>
            </v-col>
            <v-col cols="6" md="3" class="pb-0 pt-1">
              <v-switch
                v-model="dataForm.useChar"
                :label="$t('patchcard.useChar')"
                outlined
                inset
              ></v-switch>
            </v-col>

            <v-col cols="6" md="3" class="pb-0 pt-1">
              <v-switch
                v-model="dataForm.useFixPassword"
                :label="$t('patchcard.useFixPassword')"
                outlined
                inset
              ></v-switch>
            </v-col>

            <v-col v-if="dataForm.useFixPassword" cols="6" md="3" class="pb-0 mt-0 pt-2">
              <v-text-field
                v-model="dataForm.password"
                :label="$t('patchcard.password')"
                outlined
                inset
                dense
              ></v-text-field>
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
        packetid : null ,
        totalCount : '' ,
        prefix : '' ,
        useInt : true ,
        useChar : true ,
        useFixPassword : false ,
        password : '' ,
        userLength : 5 ,
        passLength : 5  
      },
      packetsActive: [] ,
      loadingSave :false 
    }
  },
  created() {
    this.getPackets()
  },

  methods: {
    getPackets() {
      this.$axios
        .$get('/admin/packet?page[size]=100000&filter[status]=true')
        .then((res) => {
          this.packetsActive = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.$axios
          .$post('/admin/patchcard', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/patchcard')
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