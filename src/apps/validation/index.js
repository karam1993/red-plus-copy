const rules = {
  data() {
    return {
      required: (value) => !!value || this.$t('rules.required'),
      requiredPhoneOrEmail : (value) => !!value || this.$t('rules.requiredPhoneOrEmail'),
      requiredArray: (value) => value.length !== 0 || this.$t('rules.required'),
      number: (value) => (value >= 0) || this.$t('rules.onlyNumber'),

      ipv4:(value) => (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) || this.$t('rules.IPv4'),
      mac:(value) => ((/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(value)) || value === '') || this.$t('rules.mac'),
      emailSyntax: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 

        return (pattern.test(value) || !value ) || this.$t('rules.emailSyntax')
      },
      phoneNumber: (v) => {
        if (!v.trim()) return true
        if (!isNaN(parseFloat(v)) && v >= 111111111 && v <= 999999999999) return true

        return this.$t('rules.phoneNumber')
      },

      passwordCounter: (value) => (value.length >= 6 || value === '') || this.$t('rules.password_rules'),
      passwordConfairm: (value) => (value !== false) || this.$t('rules.passwordNotConfairm'),
      spaces: (value) => (value || '').indexOf(' ') < 0 || this.$t('spaces-rules'),
      counter: (value) => value.length === 11 || this.$t('tc-rules'),
      zipCounter: (value) =>
        (value || '').toString().length === 5 || this.$t('zip-rules'),

      taxCounter: (value) => value.length === 10 || this.$t('tax-rules'),
      taxRules: (value) => /^\d*$/.test(value) || this.$t('tax-rules'),
      tcFormula: (value) =>
        (Number(value[9]) ===
          ((Number(value[0]) +
            Number(value[2]) +
            Number(value[4]) +
            Number(value[6]) +
            Number(value[8])) *
            7 -
            (Number(value[1]) +
              Number(value[3]) +
              Number(value[5]) +
              Number(value[7]))) %
          10 &&
          Number(value[10]) ===
          (Number(value[0]) +
            Number(value[1]) +
            Number(value[2]) +
            Number(value[3]) +
            Number(value[4]) +
            Number(value[5]) +
            Number(value[6]) +
            Number(value[7]) +
            Number(value[8]) +
            Number(value[9])) %
          10) || 'TC Not Valid'
    }
  },
  methods: {

  }

}

export default rules
