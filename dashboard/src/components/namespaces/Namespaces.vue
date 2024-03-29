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
  <div class="namespaces">
    <vuestic-widget>
      <div class="va-row">
          <alert ref="alert" :errorText="errorText"></alert>
          <vuestic-modal :show.sync="showNamespaceModal" ref="namespaceModal"
                          :okText="'modal.ok' | translate"
                          v-on:ok="createNamespace()"
                          :okDisabled="!isFormValid"
                          :cancelText="'modal.cancel' | translate">
            <div slot="title">Create Namespace</div>
            <div>
                <fieldset>
                  <div class="form-group">
                      <div class="input-group">
                        <input id="namespaceName"
                          name="Namespace Name"
                          ref="namespaceName"
                          v-model="namespaceName"
                          v-validate="namedEntityValidationRegex"
                          required
                        />
                        <label class="control-label" for="namespaceName">Namespace Name</label><i class="bar"></i>
                        <small v-show="errors.has('Namespace Name')"
                             class="help text-danger">
                        {{ errors.first('Namespace Name') ? namedEntityValidationError : '' }}
                      </small>
                      </div>
                  </div>
                </fieldset>
            </div>
          </vuestic-modal>
          <div
            class="flex sm6 lg6 xl3 justify--center">
            <button class="btn btn-primary btn-with-icon" @click="openNamespaceModal()">
              <div class="btn-with-icon-content">
                <i class="ion-md-add ion"></i>
                Namespace
              </div>
            </button>
          </div>
      </div>
    </vuestic-widget>

    <div v-for="(namespace, index) in namespacesConfig.data" :key="index">

      <vuestic-widget :headerText="headerText(index, namespace.name)" v-if="namespacesConfig.data[index].cluster === activeCluster" :class="{ globebackground: isGlobal(index) }">
        <div class="va-row" >

          <div class="flex md4">
            <vuestic-widget class="info-widget">
              <div class="info-widget-inner">
                <div class="info-widget-inner">
                  <div class="stats">
                    <div class="stats-number">
                      {{ namespacesConfig.stats[index] ? namespacesConfig.stats[index].storage : 0 | humanBytes}}
                    </div>
                    <div class="stats-title">{{'tables.headings.storageSize' | translate}}</div>
                  </div>
                </div>
              </div>
            </vuestic-widget>
            <div class="form-group with-icon-right">
                <div class="input-group">
                    <input v-model="namespacesConfig.data[index].cluster" :id="'cluster' + index" :name="'cluster' + index"
                    class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="namespacesConfig.data[index].cluster"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" :for="'cluster' + index" role="button">{{'forms.inputs.cluster'
                    | translate}}</label><i class="bar"></i>
                </div>
            </div>
            <div class="form-group with-icon-right">
                <div class="input-group">
                    <input :value="tenant" :id="'tenant' + index" :name="'tenant' + index"
                    class="has-value" placeholder="" readonly />
                    <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="tenant"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
                    <label class="control-label" for="'tenant' + index" role="button">Tenant</label><i class="bar"></i>
                </div>
            </div>
          </div>

          <div class="flex md4">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ namespacesConfig.data[index].replication_clusters.length}}
                      </div>
                      <div class="stats-title">{{'tables.headings.clusters' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>

              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ namespacesConfig.numTopics[index]}}
                      </div>
                      <div class="stats-title">{{'tables.headings.topics' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>

              <div class="flex md6">
                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number">
                        {{ namespacesConfig.stats[index] ? namespacesConfig.stats[index].subscriptions : 0}}
                      </div>
                      <div class="stats-title">{{'topicDetail.subscriptions' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>

          </div>

          <div class="flex md4">
            <div class="va-row">
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number no-wrap">
                        {{ namespacesConfig.stats[index] ? namespacesConfig.stats[index].inRate : 0 | numberSeparate()}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateIn' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
              <div class="flex md6">
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="stats">
                      <div class="stats-number no-wrap">
                        {{ namespacesConfig.stats[index] ? namespacesConfig.stats[index].outRate : 0 | numberSeparate()}}
                      </div>
                      <div class="stats-title">{{'tables.headings.msgRateOut' | translate}}</div>
                    </div>
                  </div>
                </vuestic-widget>
              </div>
            </div>

              <div class="va-row">

                <div class="flex md12">
                  <button class="btn btn-primary btn-right" @click="updateNav(index)">Details</button>
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

import Alert from '../utils/Alert'

export default {
  name: 'Namespaces',
  components: {
    Alert
  },
  data () {
    return {
      animated: true,
      errorText: 'Something went wrong',
      showNamespaceModal: false,
      required: true,
      clearable: false,
      namespaceName: '',
    }
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'namespacesConfig',
      'activeCluster',
      'tenant',
      'planInfo',
      'privateOrg',
      'runningEnv'
    ]),
    isFormValid () {
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },

  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    updateNav (namespace) {
      this.$router.push('/admin/namespace/' + namespace)
    },
    headerText (idx, name) {
      const policies = this.namespacesConfig.data[idx].auth_policies.namespace_auth
      const roles = Object.keys(policies)
      let plan = 'free'
      roles.forEach(role => {
        if (role.includes('plan-')) {
          plan = role.replace('plan-', '')
        }
      })
      const planName = this.planInfo[plan] ? this.planInfo[plan].display_name : plan
      if (this.privateOrg === 'true') {
        return name
      }
      return name + ' (' + planName + ')'
    },
    isGlobal (index) {
      if (this.namespacesConfig.data[index].replication_clusters.length > 1) {
        return true
      }
      return false
    },
    calcStorePercent (index) {
      if (this.namespacesConfig.stats[index]) {
        if (this.namespacesConfig.data[index].backlog_quota_map.destination_storage) {
          const currentStorage = this.namespacesConfig.stats[index].storage
          if (this.namespacesConfig.data[index].backlog_quota_map.destination_storage.limit) {
            const storageLimit = this.namespacesConfig.data[index].backlog_quota_map.destination_storage.limit
          } else {
            const storageLimit = this.namespacesConfig.data[index].backlog_quota_map.destination_storage.limitSize
          }
          if (storageLimit > 0) {
            return Math.round((currentStorage / storageLimit) * 100)
          }
          return 0
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    async openNamespaceModal () {
      this.$refs.namespaceModal.open()
    },
    async createNamespace () {
      try {
        await ApiService.createNamespace(this.activeCluster, this.tenant + "/" + this.namespaceName)

        this.onSuccess('Namespace created')

        // Need to update master list of namespaces
        this.$store.dispatch('getNamespaces')

        // Clear the namespace name
        this.namespaceName = ''
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating namespace: ${this.namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
  }
}
</script>

<style lang="scss" scoped>

btn-right {
  float: right;
}

</style>
