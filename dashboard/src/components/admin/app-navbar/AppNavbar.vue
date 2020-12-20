<template>
  <vuestic-navbar>
    <vuestic-modal ref="tenantModal"
                    :okText="'modal.ok' | translate"
                    v-on:ok="createTenant()"
                    :okDisabled="!isFormValid"
                    :cancelText="'modal.cancel' | translate">
      <div slot="title">Create Tenant</div>
      <div>
          <fieldset>
            <div class="form-group">
                <div class="input-group">
                  <input id="tenantName"
                    name="Tenant Name"
                    ref="tenantName"
                    v-model="tenantName"
                    v-validate="'required|alpha_dash|min:1'"
                    required
                  />
                  <label class="control-label" for="tenantName">Tenant Name</label><i class="bar"></i>
                  <small v-show="errors.has('Tenant Name')"
                        class="help text-danger">
                  {{ errors.first('Tenant Name') }}
                </small>
                </div>
            </div>
          </fieldset>
      </div>
    </vuestic-modal>
    <header-selector slot="selector" :isOpen.sync="valueProxy"/>
    <span slot="center" v-if="runningEnv !== 'k8s'">
        <vuestic-tooltip v-if="privateOrg === 'false' || !tenantList" :options="{content: userInfo, placement: 'top'}">
          <div class="btn btn-dark">
            {{ tenant }}
          </div>
        </vuestic-tooltip>
        <template v-else>
        <button
          class="btn btn-dark dropdown-toggle"
          type="button"
          ref="activeTenantButton"
        >
          {{ tenant }}
          <i class="ion-ios-arrow-down arrow-down"></i>
          <vuestic-dropdown position="bottom">
            <template>
              <template v-for="allowedTenant in tenantList">

                <a class="dropdown-item" @click="setActiveTenant(allowedTenant)" :key="allowedTenant">
                  {{ allowedTenant }}
                </a>

              </template>
            </template>
          </vuestic-dropdown>
        </button>
          <div @click="openTenantModal()" class="btn btn-dark btn-with-icon-content" style="padding: 10px 20px;">
            <i class="ion-md-add ion"></i>
          </div>
      </template>

    </span>
    <div v-if="runningEnv !== 'k8s'">
      <vuestic-tooltip :options="{content: thisClusterInfo, placement: 'left'}">
        <button
          class="btn btn-primary dropdown-toggle theme-toggle nav-bar-btn-right"
          type="button"
          ref="activeClusterButton"
        >
          {{ activeCluster }}
          <i class="ion-ios-arrow-down arrow-down"></i>
          <vuestic-dropdown position="bottom">
            <template>
              <template v-for="allowedCluster in availableClusters">

                <a class="dropdown-item" @click="setActiveCluster(allowedCluster)" :key="allowedCluster">
                  {{ allowedCluster }}
                </a>

              </template>
            </template>
          </vuestic-dropdown>
        </button>
      </vuestic-tooltip>

    </div>
    <div v-else>
      
        <vuestic-tooltip v-if="privateOrg === 'false' || !tenantList" :options="{content: userInfo, placement: 'top'}">
          <div class="btn btn-primary">
            {{ tenant }}
          </div>
        </vuestic-tooltip>
        <template v-else>
        <button
          class="btn btn-primary dropdown-toggle"
          type="button"
          ref="activeTenantButton"
        >
          {{ tenant }}
          <i class="ion-ios-arrow-down arrow-down"></i>
          <vuestic-dropdown position="bottom">
            <template>
              <template v-for="allowedTenant in tenantList">

                <a class="dropdown-item" @click="setActiveTenant(allowedTenant)" :key="allowedTenant">
                  {{ allowedTenant }}
                </a>

              </template>
            </template>
          </vuestic-dropdown>
        </button>
          
      </template>
    </div>
  </vuestic-navbar>

</template>

<script>
import VuesticIconVuestic
  from '../../../vuestic-theme/vuestic-components/vuestic-icon/VuesticIconVuestic'
import VuesticNavbar
  from '../../../vuestic-theme/vuestic-components/vuestic-navbar/VuesticNavbar'
import HeaderSelector from './components/HeaderSelector'

import LanguageDropdown from './components/dropdowns/LanguageDropdown'
import ProfileDropdown from './components/dropdowns/ProfileDropdown'
import NotificationDropdown from './components/dropdowns/NotificationDropdown'
import MessageDropdown from './components/dropdowns/MessageDropdown'

import { mapGetters } from 'vuex'
import ApiService from '@/services/ApiService'
import mixins from '@/services/mixins'

export default {
  name: 'app-navbar',
  data () {
    return {
      tenantName: ''
    }
  },
  mixins: [mixins],
  components: {
    VuesticIconVuestic,
    VuesticNavbar,
    HeaderSelector,
    MessageDropdown,
    NotificationDropdown,
    LanguageDropdown,
    ProfileDropdown,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      'activeCluster',
      'allowedClusters',
      'test',
      'tenant',
      'email',
      'login',
      'clusterInfo',
      'privateOrg',
      'tenantList',
      'runningEnv'
    ]),
    availableClusters () {
      const availableClusters = []
      this.allowedClusters.forEach(element => {
        if (element !== this.activeCluster) {
          availableClusters.push(element)
        }
      })
      return availableClusters
    },
    isFormValid () {
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
    userInfo () {
      return `
      <p>
      <span class="tooltip-highlight">Tenant</span>
      </p>
      <p>
       ${this.tenant} 
      </p>
      <p>
      <span class="tooltip-highlight">Email</span>
      </p>
      <p>
      ${this.email}
      </p>
      `
    },
    thisClusterInfo () {
      if (this.clusterInfo.info[this.activeCluster]) {
        return this.clusterInfo.info[this.activeCluster].name
      }
    },
    valueProxy: {
      get () {
        return this.isOpen
      },
      set (opened) {
        this.$emit('toggle-menu', opened)
      },
    },
  },
  methods: {
    openTenantModal () {
      this.$refs.tenantModal.open()
    },
    setActiveCluster (cluster) {
      this.$store.dispatch('changeActiveCluster', cluster)
      // Click on dropdown to close it. Should be a better way to do this, but
      // I can't figure it out.
      const elem = this.$refs.activeClusterButton
      elem.click()
      // Trigger an update
      this.$store.dispatch('updateAll')
      // If on a detailed route, move to the non-detail page so that the page doesn't stay blank
      if (this.$route.path.includes('/admin/topic/')) {
        this.$router.push('/admin/topics')
      }
      if (this.$route.path.includes('/admin/namespace/')) {
        this.$router.push('/admin/namespaces')
      }
      if (this.$route.path.includes('/admin/functions/')) {
        this.$router.push('/admin/functions/view')
      }
      if (this.$route.path.includes('/admin/sinks/')) {
        this.$router.push('/admin/sinks/view')
      }
      if (this.$route.path.includes('/admin/sources/')) {
        this.$router.push('/admin/sources/view')
      }
    },
    async createTenant () {
      try {
        await ApiService.createTenant(this.activeCluster, this.tenantName, this.activeCluster)

        this.onSuccess('Tenant created')

        // Need to update master list of tenants
        // and grab the new stats
        this.$store.dispatch('updateAll')

        // Clear the tenant name
        this.tenantName = ''
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating tenant: ${this.tenantName}. Reason: ${reason} (${statusCode})`
        this.onError(this.errorText)
      }
    },
    setActiveTenant (tenant) {
      this.$store.commit('setTenant', tenant)
      // Click on dropdown to close it. Should be a better way to do this, but
      // I can't figure it out.
      const elem = this.$refs.activeTenantButton
      elem.click()
      // Trigger an update
      this.$store.dispatch('updateAll')
      // If on a detailed route, move to the non-detail page so that the page doesn't stay blan
      if (this.$route.path.includes('/admin/topic/')) {
        this.$router.push('/admin/topics')
      }
      if (this.$route.path.includes('/admin/namespace/')) {
        this.$router.push('/admin/namespaces')
      }
      if (this.$route.path.includes('/admin/function/')) {
        this.$router.push('/admin/function/view')
      }
      if (this.$route.path.includes('/admin/sink/')) {
        this.$router.push('/admin/sink/view')
      }
    }
  }
}
</script>

<style lang="scss">
.nav-bar-btn-right {
    float: right;
}
.tooltip-highlight {
  color: $brand-primary;
}
.tooltip {
  z-index: 500000;
}
</style>
