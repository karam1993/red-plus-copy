<template>
  <v-dialog v-model="initialvalue.dialog" max-width="650">
    <v-card>
      <v-card-title class="headline">{{ $t('sessions.sessionsInfo') }}</v-card-title>
      <v-card-text>
        
        <p class="mb-0 pa-1 grey lighten-4 "><b>{{ $t('sessions.username') }} : </b> <span class="float-left">{{ initialvalue.item.username }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.groupname') }} : </b> <span class="float-left">{{ initialvalue.item.groupname }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.acctsessionid') }} : </b> <span class="float-left">{{ initialvalue.item.acctsessionid }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.acctuniqueid') }} : </b> <span class="float-left">{{ initialvalue.item.acctuniqueid }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.realm') }} : </b> <span class="float-left">{{ initialvalue.item.realm }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.nasipaddress') }} : </b> <span class="float-left">{{ initialvalue.item.nasipaddress }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.nasportid') }} : </b> <span class="float-left">{{ initialvalue.item.nasportid }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.nasporttype') }} : </b> <span class="float-left">{{ initialvalue.item.nasporttype }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.acctstarttime') }} : </b> <span class="float-left">{{ initialvalue.item.acctstarttime }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.acctupdatetime') }} : </b> <span class="float-left">{{ initialvalue.item.acctupdatetime }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.acctstoptime') }} : </b> <span class="float-left">{{ initialvalue.item.acctstoptime }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.acctinterval') }} : </b> <span class="float-left">{{ initialvalue.item.acctinterval }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.acctsessiontime') }} : </b> <span class="float-left">{{ initialvalue.item.acctsessiontime }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.acctauthentic') }} : </b> <span class="float-left">{{ initialvalue.item.acctauthentic }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.connectinfo_start') }} : </b> <span class="float-left">{{ initialvalue.item.connectinfo_start }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.connectinfo_stop') }} : </b> <span class="float-left">{{ initialvalue.item.connectinfo_stop }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.acctinputoctets') }} : </b> <span class="float-left">{{ initialvalue.item.acctinputoctets }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.acctoutputoctets') }} : </b> <span class="float-left">{{ initialvalue.item.acctoutputoctets }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.lastacctinputoctets') }} : </b> <span class="float-left">{{ initialvalue.item.lastacctinputoctets }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.lastacctoutputoctets') }} : </b> <span class="float-left">{{ initialvalue.item.lastacctoutputoctets }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.calledstationid') }} : </b> <span class="float-left">{{ initialvalue.item.calledstationid }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.callingstationid') }} : </b> <span class="float-left">{{ initialvalue.item.callingstationid }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.acctterminatecause') }} : </b> <span class="float-left">{{ initialvalue.item.acctterminatecause }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.servicetype') }} : </b> <span class="float-left">{{ initialvalue.item.servicetype }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.framedprotocol') }} : </b> <span class="float-left">{{ initialvalue.item.framedprotocol }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.framedipaddress') }} : </b> <span class="float-left">{{ initialvalue.item.framedipaddress }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.framedipv6address') }} : </b> <span class="float-left">{{ initialvalue.item.framedipv6address }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.framedipv6prefix') }} : </b> <span class="float-left">{{ initialvalue.item.framedipv6prefix }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.framedinterfaceid') }} : </b> <span class="float-left">{{ initialvalue.item.framedinterfaceid }}</span></p>
        <p class="mb-0 pa-1"><b>{{ $t('sessions.delegatedipv6prefix') }} : </b> <span class="float-left">{{ initialvalue.item.delegatedipv6prefix }}</span></p>
        <p class="mb-0 pa-1 grey lighten-4"><b>{{ $t('sessions.class') }} : </b> <span class="float-left">{{ initialvalue.item.class }}</span></p> 
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      initialvalue: this.value 
    }
  }
}
</script>