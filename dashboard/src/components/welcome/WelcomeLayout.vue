<template>
  <div class="welcome-layout">
    <div class="main va-row">
      <div class="auth-content flex lg9 xs12 fill-height">
        <div>
          <div v-if="billingProvider === 'gcp'">
            <welcome-gcp :defaultTenantName="getDefaultTenant()"/>
          </div>
          <div v-else>
            <welcome-free v-if="planToCreate.includes('free')" :defaultTenantName="getDefaultTenant()"/>
            <welcome-paid v-else :defaultTenantName="getDefaultTenant()" :defaultPlan="planToCreate"/>
          </div>

        </div>
      </div>
      <div class="welcome-layout__auth-wallpaper flex md3">
        <div class="flex-center sidebar">
          <div class="welcome-layout__auth-wallpaper__cross-line"/>

          <kesque-icon/>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// d-none and d-lg-flex were deleted, bug will be fixed in the nearest update
import VuesticIconVuestic
  from '../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconVuestic'
import KesqueIcon from '../icon/KesqueIcon'
import WelcomeFree from './WelcomeFree'
import WelcomePaid from './WelcomePaid'
import WelcomeGcp from './WelcomeGcp'
import { mapGetters } from 'vuex'

export default {
  name: 'WelcomeLayout',
  data () {
    return {
    }
  },
  components: {
    VuesticIconVuestic,
    WelcomeFree,
    KesqueIcon,
    WelcomePaid,
    WelcomeGcp
  },
  computed: {
    ...mapGetters([
      'tenant',
      'counter',
      'plan',
      'needToCreatePlan',
      'planToCreate',
      'billingProvider',
      'planInfo'
    ]),
    planToCreateObj () {
      var planName = this.planInfo[this.planToCreate] ? this.planInfo[this.planToCreate].display_name : 'unknown'
      return {
        id: this.planToCreate,
        name: planName
      }
    }
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
    // If user has a tenant name, redirect to dashboard
    if ((this.tenant !== '') && (this.tenant !== '::needs_to_be_created::')) {
      this.$router.push('/dashboard')
    }
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
