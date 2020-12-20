/* global wpData */

<template>
  <div id="app" class="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      cancelTimer: false,
      cancelFunctionTimer: false,
      cancelSinkTimer: false,
      wasRegularTimerRunning: false,
      wasFunctionTimerRunning: false,
      wasSinkTimerRunning: false
    }
  },
  created: async function () {
  },
  beforeMount () {
    // If the user is not logged in, redirect to the login page
    // And don't do anything else
    if (wpData.login === '') {
      window.location = '/wp-login.php'
    } else {
      this.$nextTick(() => {
        window.addEventListener('visibilitychange', this.onVisiblityChange)
      })

      let i = window.document.currentScript
      i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)

      let public_path = i[1]

      // Get data injected 
      // console.log(wpData);

      this.$store.commit('setTest', wpData.test)
      this.$store.commit('setTenant', wpData.tenant)
      this.$store.commit('changeActiveCluster', wpData.home_cluster)

      const allowClusterList = wpData.cluster_list

      this.$store.commit('updateAllowedClusters', allowClusterList)
      this.$store.commit('updateNumAllowedClusters', allowClusterList.length)

      this.$store.commit('setClientToken', wpData.client_token)
      this.$store.commit('setPlan', wpData.plan)
      this.$store.commit('setAdminToken', wpData.admin_token)
      this.$store.commit('setApiBaseUrl', wpData.api_base_url)
      this.$store.commit('setCaCertficate', wpData.ca_certificate)
      this.$store.commit('setNoticeText', wpData.notice_text)
      this.$store.commit('setChargebeeSite', wpData.chargebee_site)
      this.$store.commit('setBillingProvider', wpData.billing_provider)
      this.$store.commit('setApiVersion', wpData.api_version)
      this.$store.commit('setDefaultPlan', wpData.default_plan)
      this.$store.commit('setUserRole', wpData.user_role)
      this.$store.commit('setFeatureFlags', wpData.feature_flags)
      this.$store.commit('setPollingInterval', wpData.polling_interval)
      this.$store.commit('setWssUrlOverride', wpData.wss_url)
      this.$store.commit('setGrafanaUrlOverride', wpData.grafana_url)
      this.$store.commit('setDisableBilling', wpData.disable_billing)
      this.$store.commit('setRunningEnv', wpData.running_env)
      this.$store.commit('setAuthMode', wpData.auth_mode)
      this.$store.commit('setLogin', wpData.login)
      this.$store.commit('setEmail', wpData.email)
      this.$store.commit('setHostOverrides', wpData.host_overrides)

      console.log('plan to create: ' + wpData.plan_to_create)
      console.log('need to create plan: ' + wpData.need_to_create_plan)
      console.log('disable billing: ' + wpData.disable_billing)

      if (wpData.plan_to_create) {
        this.$store.commit('setPlanToCreate', wpData.plan_to_create)
        this.$store.commit('setNeedToCreatePlan', wpData.need_to_create_plan)
      }

      if (wpData.private_org === 'true') {
        this.$store.commit('setPrivateOrg', wpData.private_org)
      }

      if (wpData.use_token_list === 'true') {
        this.$store.commit('setUseTokenList', wpData.use_token_list)
      }

      if (wpData.functions_disabled === 'true') {
        this.$store.commit('setFunctionsDisabled', wpData.functions_disabled)
      }

      if (wpData.clients_disabled === 'true') {
        this.$store.commit('setClientsDisabled', wpData.clients_disabled)
      }

      if (this.runningEnv === 'web') {
        try {
          heap.identify(wpData.email)
        } catch (error) {
          console.log('Error calling heap', error)
        }
      }
      // If user doesn't nave a tenant name, redirect to welcome
      if ((this.tenant === '') || (this.tenant === '::needs_to_be_created::')) {
        // Make sure the plan to create is set to something before the redirect
        if (this.planToCreate === '') {
          this.$store.commit('setPlanToCreate', wpData.default_plan)
        }
        this.$router.push('/welcome')
      }

      // If plan needs to be created, redirect to plans
      if (this.needToCreatePlan) {
        this.$router.push('/admin/plans/add')
      }
      if ((this.tenant !== '') && (this.tenant !== '::needs_to_be_created::')) {
        this.$store.dispatch('updateAll')
      } else {
        console.log('Tenant could not be found or is invalid', this.tenant)
      }
      // Start the auto refresh timer since the tenant may be configured later
      this.startAutoUpdate()

      if (this.featureFlags.function && this.functionsDisabled === 'false') {
        //  Starting the timer loop for functions but displaying the running of code
        this.startAutoFunctionUpdate()
        this.cancelAutoFunctionUpdate()
      }
      if (this.featureFlags.sink && this.functionsDisabled === 'false') {
        //  Starting the timer loop for sinks but displaying the running of code
        this.startAutoSinkUpdate()
        this.cancelAutoSinkUpdate()
      }
      if (this.featureFlags.source && this.functionsDisabled === 'false') {
        //  Starting the timer loop for sources but displaying the running of code
        this.startAutoSourceUpdate()
        this.cancelAutoSourceUpdate()
      }
    }
  },
  mounted () {
    // Initialize Chargebee
    if (this.runningEnv === "web") {
      let chargebeeInstance = Chargebee.init({
        site: this.chargebeeSite
      })
    }

    console.log(`Build URL: ${process.env.BASE_URL}`)
  },
  beforeDestroy () {
    this.cancelAutoUpdate()
    this.cancelAutoFunctionUpdate()
    this.cancelAutoSinkUpdate()
    this.cancelAutoSourceUpdate()
    window.removeEventListener('resize', this.onVisiblityChange)
  },
  computed: {
    ...mapGetters([
      'tenant',
      'clusterInfo',
      'needToCreatePlan',
      'runTimer',
      'entitlementInfo',
      'chargebeeSite',
      'runFunctionTimer',
      'runSinkTimer',
      'runSourceTimer',
      'featureFlags',
      'planToCreate',
      'pollingInterval',
      'disableBilling',
      'wssUrlOverride',
      'grafanaUrlOverrride',
      'login',
      'email',
      'orgInfo',
      'functionsDisabled',
      'runningEnv'
    ]),
  },
  methods: {
    onVisiblityChange () {
      if (document.hidden) {
        console.log('Page is hidden, stopping API polling')
        this.wasRegularTimerRunning = this.runTimer
        this.wasFunctionTimerRunning = this.runFunctionTimer
        this.wasSinkTimerRunning = this.runSinkTimer
        this.wasSourceTimerRunning = this.runSourceTimer
        // this.$store.commit('setRunTimer', false)
        // this.$store.commit('setRunFunctionTimer', false)
        // this.$store.commit('setRunSinkTimer', false)
        this.$store.commit('stopAllTimers')
      } else {
        console.log('Welcome back, starting API polling')
        if (this.wasRegularTimerRunning) {
          console.log('Starting regular polling after visibility')
          this.$store.commit('setRunTimer', true)
          if ((this.tenant !== '') && (this.tenant !== '::needs_to_be_created::')) {
            this.$store.dispatch('updateAll')
          }
        }

        if (this.wasFunctionTimerRunning && this.featureFlags.function && this.functionsDisabled === 'false') {
          console.log('Starting function polling after visibility')
          this.$store.commit('setRunFunctionTimer', true)
          if ((this.tenant !== '') && (this.tenant !== '::needs_to_be_created::')) {
            this.$store.dispatch('updateAllFunctions')
          }
        }

        if (this.wasSinkTimerRunning && this.featureFlags.sink && this.functionsDisabled === 'false') {
          console.log('Starting sink polling after visibility')
          this.$store.commit('setRunSinkTimer', true)
          if ((this.tenant !== '') && (this.tenant !== '::needs_to_be_created::')) {
            this.$store.dispatch('updateAllSinks')
          }
        }
        if (this.wasSourceTimerRunning && this.featureFlags.source && this.functionsDisabled === 'false') {
          console.log('Starting source polling after visibility')
          this.$store.commit('setRunSourceTimer', true)
          if ((this.tenant !== '') && (this.tenant !== '::needs_to_be_created::')) {
            this.$store.dispatch('updateAllSources')
          }
        }
      }
    },
    cancelAutoUpdate () {
      console.log('Stopping the main polling loop')

      this.$store.commit('setRunTimer', false)
      // this.cancelTimer = true
    },
    startAutoUpdate () {
      console.log('Starting the main polling loop')

      this.$store.commit('setRunTimer', true)

      // this.cancelTimer = false
      this.updateStats()
    },
    async updateStats () {
      if (this.cancelTimer) {
        return
      }
      // console.log(`Running regular poll: ${this.runTimer}`);

      if ((this.tenant !== '') &&
            (this.tenant !== '::needs_to_be_created::') &&
            (this.runTimer)) {
        try {
          this.$store.dispatch('updateAll')
        } catch (error) {
          console.log(error)
        }
      }
      setTimeout(this.updateStats, this.pollingInterval)
    },
    cancelAutoFunctionUpdate () {
      console.log('Stopping function polling loop')
      this.$store.commit('setRunFunctionTimer', false)
    },
    cancelAutoSinkUpdate () {
      console.log('Stopping sink polling loop')
      this.$store.commit('setRunSinkTimer', false)
    },
    cancelAutoSourceUpdate () {
      console.log('Stopping source polling loop')
      this.$store.commit('setRunSourceTimer', false)
    },
    startAutoFunctionUpdate () {
      console.log('Starting function polling loop')
      this.$store.commit('setRunFunctionTimer', true)
      this.updateFunctionStats()
    },
    startAutoSinkUpdate () {
      console.log('Starting sink polling loop')
      this.$store.commit('setRunSinkTimer', true)
      this.updateSinkStats()
    },
    startAutoSourceUpdate () {
      console.log('Starting source polling loop')
      this.$store.commit('setRunSourceTimer', true)
      this.updateSourceStats()
    },
    async updateFunctionStats () {
      if (this.cancelFunctionTimer) {
        return
      }
      if ((this.tenant !== '') &&
            (this.tenant !== '::needs_to_be_created::') &&
            (this.runFunctionTimer)) {
        try {
          this.$store.dispatch('updateAllFunctions')
        } catch (error) {
          console.log(error)
        }
      }
      setTimeout(this.updateFunctionStats, this.pollingInterval)
    },
    async updateSinkStats () {
      if (this.cancelSinkTimer) {
        return
      }
      if ((this.tenant !== '') &&
            (this.tenant !== '::needs_to_be_created::') &&
            (this.runSinkTimer)) {
        try {
          this.$store.dispatch('updateAllSinks')
        } catch (error) {
          console.log(error)
        }
      }
      setTimeout(this.updateSinkStats, this.pollingInterval)
    },
    async updateSourceStats () {
      if (this.cancelSourceTimer) {
        return
      }
      if ((this.tenant !== '') &&
            (this.tenant !== '::needs_to_be_created::') &&
            (this.runSourceTimer)) {
        try {
          this.$store.dispatch('updateAllSources')
        } catch (error) {
          console.log(error)
        }
      }
      setTimeout(this.updateSourceStats, this.pollingInterval)
    },
  }
}
</script>

<style lang="scss">
@import "sass/main";

body {
  height: 100%;
  background-color: #353535;
  #app {
    height: 100%;
    font-family: "Roboto Condensed", sans-serif;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    color: black;
    background-color: #353535;
    text-align: left;
    p {
      margin-bottom: 1rem;
    }
    h5 {
      font-family: "Roboto Condensed", sans-serif;
      font-weight: 600;
      font-size: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      font-weight: 500;
      line-height: 1;
    }
    table {
      border: 0;
      td {
        border: 0;
      }
    }
    .globebackground {
    background-image: url("/wp-content/uploads/2019/04/globe-background.png");
    }
    .partitionbackground {
    background: #cacccc;
    }
  }
}
</style>
