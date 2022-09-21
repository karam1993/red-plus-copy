<template>
  <div v-permissions="'role view'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-skeleton-loader
        v-if="loadingData"
        type="article"
      ></v-skeleton-loader>
      <v-card-text v-else>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="rolInfo.name"
                :rules="[required]"
                :label="$t('rols.name')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="rolInfo.guard_name"
                :rules="[required]"
                :label="$t('rols.guardName')"
                outlined
                dense
                :items="['web']"
                clearable
                :no-data-text="$t('common.noDataAvailable')"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-card elevation="0" style="border: 1px solid #9e9e9e;">
                <v-card-title>
                  <span>
                    {{ $t('rols.activePermissions') }}
                  </span>
                </v-card-title>
                <v-card-text v-if="!loadingPermissions">
                  <v-data-table
                    v-model="selectedPermissions"
                    :headers="headers"
                    :items="activePermissions"
                    :items-per-page="1000000"
                    class="elevation-1"
                    show-select
                    hide-default-footer
                  ></v-data-table>
                </v-card-text>
                <v-card-text v-else>
                  <v-skeleton-loader
                    type="article"
                  ></v-skeleton-loader>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card elevation="0" style="border: 1px solid #9e9e9e;">
                <v-card-title>
                  {{ $t('rols.selectedPermissions') }}
                </v-card-title>
                <v-card-text v-if="selectedPermissions.length != 0" >
                  <div>
                    <v-chip
                      v-for="(permission , index ) in selectedPermissions"
                      :key="index"
                      close
                      color="primary"
                      class="mb-1 mr-1"
                      @click:close="removePermission(index)"
                    >
                      {{ permission.name }}
                    </v-chip>
                  </div>
                </v-card-text>
                <v-card-text v-else >
                  <p style="font-size:18px ; user-select: none;" class="text-center">{{ $t('common.noData') }}</p>
                </v-card-text>
              </v-card>
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
      rolInfo : {},
      loadingData : true ,
      loadingSave : false ,
      activePermissions : [] ,
      selectedPermissions : [] ,
      loadingPermissions : false ,
      isPermissionValid : true ,
      pagesCounts : 1  ,
      selectedPage : 1 ,
      headers: [
        { text: this.$t('rols.name'),  value: 'name' },
        { text: this.$t('rols.guardName') , value: 'guard_name' }
      ]
    }
  },
  created() {
    this.getRolInfo()
    this.getPermissions(this.selectedPage)
  },
  methods: {
    getRolInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/role/${this.$route.params.id}`)
        .then((res) => {
          this.rolInfo  = res.data
          this.selectedPermissions = this.rolInfo.permissions.slice()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    getPermissions(selectedPage) {
      this.loadingPermissions = true
      this.$axios.$get(`admin/permission?page[size]=10000&page[number]=${selectedPage}&filter[guard_name]=web`).then((res) => {
        this.activePermissions =  this.activePermissions.concat(res.data)
        this.pagesCounts = res.meta.last_page
      }).catch((err) => {
        this.$store.dispatch('showError', err.response.data.message)
      }).finally(() => {
        this.loadingPermissions = false
      })
    },
    removePermission(index) {
      this.selectedPermissions.splice(index, 1)
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.rolInfo.permissions = this.selectedPermissions.map((item) => item.id)
        this.$axios
          .$put(`/admin/role/${this.$route.params.id}`, this.rolInfo)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.getRolInfo()
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