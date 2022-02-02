<!--
  Copyright 2021 DataStax, Inc. 
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  
 -->

<template>
  <div class="clusters">
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
                    v-validate="namedEntityValidationRegex()"
                    required
                  />
                  <label class="control-label" for="tenantName">Tenant Name</label><i class="bar"></i>
                  <small v-show="errors.has('Tenant Name')"
                        class="help text-danger">
                  {{ errors.first('Tenant Name') ? namedEntityValidationError() : '' }}
                </small>
                </div>
            </div>
          </fieldset>
      </div>
    </vuestic-modal>
    <vuestic-widget>
      <div
              class="flex sm6 lg6 xl3 justify--center">
              <button class="btn btn-primary btn-with-icon" @click="openTenantModal()">
                <div class="btn-with-icon-content">
                  <i class="ion-md-add ion"></i>
                  Tenant
                </div>
              </button>
      </div>
    </vuestic-widget>
    <div v-for="index in clusterList" :key="index">
      <vuestic-widget :headerText="tenant" >
        <div class="va-row" v-if="index === activeCluster">
          <div class="flex md6">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner">
                      <div class="stats">
                        <div class="stats-number">
                          {{ clustersConfig.stats[index] ? clustersConfig.stats[index].storage : 0 | humanBytes}}
                        </div>
                        <div class="stats-title">{{'tables.headings.storageSize' | translate}}</div>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ namespacesConfig.num ? namespacesConfig.num : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.namespaces' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div v-if="runningEnv ==='web'" class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ numAdditionalNS }}
                      </div>
                      <div class="stats-title">{{'tables.headings.namespaces' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].numTopics : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.topics' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            <div class="va-row">
              <div class="flex md4">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].producers : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.producers' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md4">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].subscriptions : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.subscriptions' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md4">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].consumers : 0 }}
                      </div>
                      <div class="stats-title">{{'tables.headings.consumers' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            </div>
          <div class="flex md6">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number no-wrap">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].inRate : 0 | numberSeparate()}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateIn' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="vuestic-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].inTput : 0 | humanBytes}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgThroughputIn' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number no-wrap">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].outRate : 0 | numberSeparate()}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateOut' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
               <div class="flex md6">
                <vuestic-widget class="vuestic-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ clustersConfig.stats[index] ? clustersConfig.stats[index].outTput : 0 | humanBytes}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgThroughputOut' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>
            </div>

        </div>
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import ApiService from '@/services/ApiService'

export default {
  name: 'clusters',
  components: {
  },
  data () {
    return {
      animated: true,
      tenantName: ''
    }
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'clustersConfig',
      'activeCluster',
      'allowedClusters',
      'clusterInfo',
      'namespacesConfig',
      'isAdminUser',
      'runningEnv',
      'tenant'
    ]),
    clusterList () {
      return [this.activeCluster]
    },
    numAdditionalNS () {
      let count = 0
      this.namespacesConfig.list.forEach(nsObj => {
        console.log(nsObj.name)
        if (!(
          nsObj.name.match('^local-') ||
            nsObj.name.match('^worldwide')
        )) {
          count++
        }
      })

      return count
    },
  },
  methods: {
    updateNav (cluster) {
      this.$router.push('/admin/cluster/' + cluster)
    },
    openTenantModal () {
      this.$refs.tenantModal.open()
    },
    goToMonitorIframe (cluster) {
      this.$router.push('/admin/clusterMonitor/' + cluster)
    },
    getClusterName (index) {
    },
    isFormValid () {
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
    async createTenant () {
      try {
        await ApiService.createTenant(this.activeCluster, this.tenantName, this.activeCluster)

        this.onSuccess('Tenant created')

        // Need to update master list of tenants
        // and grab the new stats
        this.$store.dispatch('updateAll')
        this.$store.commit('setTenant', this.tenantName)

        // Clear the tenant name
        this.tenantName = ''
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating tenant: ${this.tenantName}. Reason: ${reason} (${statusCode})`
        this.onError(this.errorText)
      }
    },
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  }
}
</script>

<style lang="scss" scoped>

</style>
