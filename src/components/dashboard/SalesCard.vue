<template>
  <v-card class="d-flex flex-grow-1 primary darken-4" dark>

    <!-- loading spinner -->
    <div v-if="loading" class="d-flex flex-grow-1 align-center justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- information -->
    <div v-else class="d-flex flex-column flex-grow-1">
      <v-card-title>
        <div>{{$t('dashboard.robor')}}</div>
        <v-spacer></v-spacer>
        <!-- <v-btn text color="secondary" @click="$emit('action-clicked')">{{ actionLabel }}</v-btn> -->
      </v-card-title>

      <div class="d-flex flex-column flex-grow-1">
        <div class="pa-2">
          <div class="secondary--text text--lighten-1 mb-1">
            {{$t('dashboard.roborMonthes')}}
          </div>
          <div class="text-h4">
            {{ formatCurrency }} {{ monthly.toFixed(2) }}
          </div>
        </div>
        <v-spacer></v-spacer>

        <div class="px-2 pb-2">
          <div class="secondary--text text--lighten-1 mb-1 mb-1">{{ $t('dashboard.weeklySales') }}</div>
          <div class="d-flex align-center">
            <div class="text-h4">
              {{ formatCurrency }} {{ value.toFixed(2) }}
            </div>
            <v-spacer></v-spacer>
            <!-- <div class="d-flex flex-column text-right">
              <div class="font-weight-bold">
                <trend-percent :value="percentage" />
              </div>
              <div class="caption">{{ percentageLabel }}</div>
            </div> -->
          </div>
        </div>
      </div>

      <apexchart
        type="area"
        height="120"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'
import TrendPercent from '../common/TrendPercent'

function formatDate(date) {
  return date ? moment(date).format('D MMM') : ''
}

/*
|---------------------------------------------------------------------
| DEMO Dashboard Card Component
|---------------------------------------------------------------------
|
| Demo card component to be used to gather some ideas on how to build
| your own dashboard component
|
*/
export default {
  components: {
    // TrendPercent
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    monthly : {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    percentageLabel: {
      type: String,
      default: 'vs. last week'
    },
    series: {
      type: Array,
      default: () => [{
        name: 'Sales',
        data: [0, 0, 0, 0, 0, 0, 0]
      }]
    },
    xaxis: {
      type: Object,
      default: () => ({
        type: 'datetime',
        categories: [
          '2022-06-20',
          '2022-06-21',
          '2022-06-22',
          '2022-06-23',
          '2022-06-24',
          '2022-06-25'
          
        ]
      })
    },
    label: {
      type: String,
      default: 'dashboard.sales'
    },
    actionLabel: {
      type: String,
      default: 'View Report'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formatCurrency : 'TRY'
    }
  },
  computed: {
    chartOptions() {
      const primaryColor = this.$vuetify.theme.isDark
        ? this.$vuetify.theme.themes.dark.primary
        : this.$vuetify.theme.themes.light.primary

      return {
        chart: {
          height: 120,
          type: 'area',
          sparkline: {
            enabled: true
          },
          animations: {
            speed: 400
          }
        },
        colors: [primaryColor],
        fill: {
          type: 'solid',
          colors: [primaryColor],
          opacity: 0.15
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },

        tooltip: {
          followCursor: true,
          theme: 'dark',
          custom: function({ ctx, series, seriesIndex, dataPointIndex, w }) {
            // const seriesName = w.config.series[seriesIndex].name

            return `<div class="rounded-lg pa-1 caption">
              <div class="font-weight-bold"></div>
              <div>${series[seriesIndex][dataPointIndex]}  TRY </div>
            </div>`
          }
        },
        ...this.options
      }
    }
  }
}
</script>
