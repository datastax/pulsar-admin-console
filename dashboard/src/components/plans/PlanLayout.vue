<template>
  <div class="plan-layout" v-if="showBilling">
    <div v-if="billingProvider !== 'gcp'">
          <add-paid v-if="planAction=='add' && planToCreate" :defaultPlan="planToCreate"></add-paid>
          <add-paid v-if="planAction=='add' && !planToCreate"></add-paid>
          <change-plan v-if="planAction=='change'"></change-plan>
          <billing v-if="planAction=='billing'"></billing>
    </div>
      <div v-else class="va-row">
          <add-paid-gcp v-if="planAction=='add' && needToCreatePlan"></add-paid-gcp>
          <change-plan v-else-if="planAction=='change'"></change-plan>
          <div v-else class="flex md12">
            <vuestic-widget class="simple-vertical-wizard-widget">
            <p>
              Your plan is billed by the GCP Marketplace. To modify plans or view billing, go <a target="_blank" :href="gcpMarketplaceLink">here</a>.
            </p>
              </vuestic-widget>
            </div>
    </div>
  </div>
</template>

<script>
// d-none and d-lg-flex were deleted, bug will be fixed in the nearest update
import VuesticIconVuestic
  from '../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconVuestic'
import KesqueIcon from '../icon/KesqueIcon'
import AddPaid from './AddPaid'
import AddPaidGcp from './AddPaidGcp'
import Billing from './Billing'
import ChangePlan from './ChangePlan'
import { mapGetters } from 'vuex'

export default {
  name: 'PlanLayout',
  data () {
    return {
    }
  },
  components: {
    VuesticIconVuestic,
    AddPaid,
    KesqueIcon,
    ChangePlan,
    Billing,
    AddPaidGcp
  },
  computed: {
    ...mapGetters([
      'tenant',
      'counter',
      'plan',
      'billingProvider',
      'entitlementInfo',
      'needToCreatePlan',
      'planToCreate',
      'defaultPlan',
      'gcpMarketplaceLink',
      'disableBilling'
    ]),
    showBilling () {
      if (this.disableBilling === 'true') {
        return false
      }
      return true
    },
    planAction () {
      console.log('Route: ')
      console.log(this.$route)

      if (this.$route.name) {
        console.log('Action: ' + this.$route.name)
        return this.$route.name
      }

      if (this.$route.query.action) {
        console.log('Action: ' + this.$route.query.action)
        return this.$route.query.action
      }

      return 'add'
    },
    // defaultPlan() {
    //   if (this.planToCreate === "free") {
    //     return 'starter'
    //   } else {
    //     return this.planToCreate
    //   }
    // }
  },
  methods: {
    getDefaultTenant () {
      let email = wpData.email

      if (email.includes('change_this_email')) {
        // Need to generate something randomly
        return 'tenant_' + Math.random().toString(36).substr(2, 9)
      } else {
        return email.replace(/[\W]+/g, '-')
      }
    },
  },
  beforeMount () {
    // If user doesn't have a tenant name, redirect to welcome
    if ((this.tenant === '') || (this.tenant === '::needs_to_be_created::')) {
      this.$router.push('/welcome')
    }
  },
  mounted () {
    // Turn off stats polling
    // this.$store.commit('setRunTimer', false)
    // this.$store.commit('setRunFunctionTimer', false)
    // this.$store.commit('setRunSinkTimer', false)
    this.$store.commit('stopAllTimers')

    console.log('Stopping regular polling')
  },
  beforeDestroy () {
    // Turn on stats polling
    this.$store.commit('setRunTimer', true)
    console.log('Starting regular polling')

    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  }
}
</script>

<style lang="scss">
.welcome-layout {
  height: 100vh;
  margin: 0;

  &__auth-wallpaper {
    position: relative;
    background-color: $top-nav-bg;
    overflow: hidden;
    @include va-flex-center();
    &__logo {
      z-index: 2;
      position: absolute;
      height: $auth-wallpaper-ivuestic-h;
      width: 100%;
    }
    .vuestic-icon-vuestic {
      height: $auth-wallpaper-ivuestic-h;
      width: 100%;
    }

    &__cross-line {
      z-index: 1;
      position: absolute;
      background-color: $auth-wallpaper-oblique-line;
      left: calc(50% - 27% / 2);
      transform: rotate(15deg);
      width: 27%;
      height: 115%;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    height: $top-mobile-nav-height;
    background-color: $top-nav-bg;
    .vuestic-icon-vuestic {
      height: $auth-mobile-nav-ivuestic-h;
      width: 100%;
    }
  }
  .main {
    margin: 0;
    height: 100vh;
    .auth-content {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
    }
  }

  @include media-breakpoint-down(md) {
    .main {
      height: $auth-mobile-main-h;
      .auth-content {
        align-items: flex-start;
        padding-top: $auth-content-padding-t;
      }
      .auth-wallpaper {
        display: none;
      }
      .sidebar {
        display: none;
      }
    }
  }
}
</style>
