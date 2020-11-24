export default {
  data () {
    return {
      toastOptionsCopy: {
        theme: 'none',
        position: 'top-right',
        className: 'vuestic-toast',
        icon: 'fa-clipboard',
        iconPack: 'fontawesome',
        duration: 1000,
      },
      toastOptionsSuccess: {
        theme: 'none',
        position: 'top-right',
        className: 'vuestic-toast',
        icon: 'fa-check',
        iconPack: 'fontawesome',
        duration: 3000,
      },
      toastOptionsError: {
        theme: 'none',
        position: 'top-right',
        className: 'vuestic-toast-danger',
        icon: 'fa-exclamation-triangle',
        iconPack: 'fontawesome',
        fullWidth: false,
        duration: 7000,
        action: {
          text: 'Close',
          onClick: (e, toastObject) => {
            toastObject.goAway(0)
          }
        },
      }
    }
  },
  methods: {
    onCopy: function () {
      this.showToast('Copied', this.toastOptionsCopy)
    },
    onError: function (e) {
      if (e) {
        this.showToast(`Error: ${e}`, this.toastOptionsError)
      } else {
        this.showToast('Error', this.toastOptions)
      }
    },
    onSuccess: function (func) {
      if (func) {
        this.showToast(`${func} succesfully`, this.toastOptionsSuccess)
      } else {
        this.showToast('Success', this.toastOptions)
      }
    },
    cloudProvider (dataCenter) {
      let provider = ''
      if (dataCenter.includes('-gcp')) {
        provider = 'GCP'
      } else if (dataCenter.includes('-aws')) {
        provider = 'AWS'
      } else if (dataCenter.includes('-azure')) {
        provider = 'Azure'
      }
      return provider
    },
    splitClusterName (dataCenter) {

      let splitInfo = {
        name: dataCenter,
        cloud: ''
      }
      if (dataCenter.includes('-gcp')) {
        splitInfo = {
          name: dataCenter.replace('-gcp', ''),
          cloud: 'gcp'
        }
      } else if (dataCenter.includes('-aws')) {
        splitInfo = {
          name: dataCenter.replace('-aws', ''),
          cloud: 'aws'
        }
      } else if (dataCenter.includes('-azure')) {
        splitInfo = {
          name: dataCenter.replace('-azure', ''),
          cloud: 'azure'
        }
      } else if (dataCenter.includes('-tgtg')) {
        splitInfo = {
          name: dataCenter.replace('-tgtg', ''),
          cloud: 'tgtg'
        }
      }
      return splitInfo
    },
    getHumanReadable (statName, statValue) {
      const guaranteeLookup = {
        'ATLEAST_ONCE': 'At Least Once',
        'ATMOST_ONCE': 'At Most Once',
        'EFFECTIVELY_ONCE': 'Effectively Once'
      }

      if ((typeof statName === 'string' && statName.toLowerCase().includes('size'))) {
        return this.$options.filters.humanBytes(statValue)
      } else if (statName.toLowerCase().includes('latency')) {
        return this.$options.filters.toFixed(statValue, 4)
      } else if (statName.toLowerCase().includes('lastreceivedtime') || statName.toLowerCase().includes('timestamp')) {
        if (statValue > 0) {
          var s = new Date(statValue).toLocaleString('en-US')
          return s
        }
        return 'Unknown'
      } else if (statValue === true) {
        return 'True'
      } else if (statValue === false) {
        return 'False'
      } else if (statName === 'processingGuarantees') {
        return guaranteeLookup[statValue]
      } else {
        return statValue
      }
    },
    convertCamelCaseToTitleCase (text) {
      var result = text.replace(/([A-Z])/g, ' $1')
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1)
      return finalResult
    },
    convertUnderscoreToTitleCase (text) {
      var result = text.replace(/_/g, ' ')
      var finalResult = result.charAt(0).toUpperCase() + result.slice(1)
      return finalResult
    },
    toTitleCase (text) {
      const lower = text.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    },
    decodeErrorObject (error) {
      console.log('Error Object', error)
      console.log('Error Response', error.response)
      console.log('Error Code', error.code)

      let reason = 'Unknown'
      let statusCode = '000'

      if (error.code === 'ECONNABORTED') {
        reason = 'Request timed out.'
        // Borrowing status code from CloudFlare
        // 524 A Timeout Occurred
        //   Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.
        statusCode = '524'
      }

      // Default to the status text as the reason
      if (error.response && error.response.request) {
        if (error.response.request.statusText) {
          reason = error.response.request.statusText
        }
        if (error.response.request.status) {
          statusCode = error.response.request.status
        }
      }
      // If a more detailed reason was given, use that insteand
      if (error.response && error.response.data && error.response.data.reason) {
        reason = error.response.data.reason
      }

      return [reason, statusCode]
    }
  }
}
