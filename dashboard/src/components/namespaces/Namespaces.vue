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
            <div slot="title">Create Namespace ({{maxNamespaces - availableNamespaces}} of {{maxNamespaces}} used)</div>
            <div>
                <fieldset v-if="availableNamespaces > 0">
                  <div class="form-group">
                      <div class="input-group">
                        <input id="namespaceName"
                          name="Namespace Name"
                          ref="namespaceName"
                          v-model="namespaceName"
                          v-validate="'required|alpha_dash|min:1'"
                          required
                        />
                        <label class="control-label" for="namespaceName">Namespace Name</label><i class="bar"></i>
                        <small v-show="errors.has('Namespace Name')"
                             class="help text-danger">
                        {{ errors.first('Namespace Name') }}
                      </small>
                      </div>
                  </div>
                </fieldset>
                <p v-else>Sorry, you cannot create more namespaces with this plan. Please upgrade your plan.</p>
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
import AjaxService from '@/services/AjaxService'
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
      maxNamespaces: 0
    }
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'namespacesConfig',
      'activeCluster',
      'tenant',
      'planInfo',
      'privateOrg'
    ]),
    isFormValid () {
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
    availableNamespaces () {
      let avail = this.maxNamespaces
      this.namespacesConfig.list.forEach(ns => {
        if (!ns.name.includes('local-') && !ns.name.includes('worldwide')) {
          avail = avail - 1
        }
      })
      if (avail < 0) {
        avail = 0
      }
      return avail
    }

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
          const storageLimit = this.namespacesConfig.data[index].backlog_quota_map.destination_storage.limit
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
      await this.getMaxNamespaces()
      this.$refs.namespaceModal.open()
    },
    async createNamespace () {
      if (this.availableNamespaces < 1) {
        this.errorText = `Creating namespace: not available namespaces left (${this.availableNamespaces})`
        this.$refs.alert.showAlert()
        return
      }
      try {
        await AjaxService.ajaxAction('add_namespace',
          {
            dataCenter: this.activeCluster,
            tenant: this.tenant,
            namespace: this.namespaceName
          })

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
    async getMaxNamespaces () {
      try {
        const resp = await AjaxService.ajaxAction('get_max_namespaces_cluster',
          {
            dataCenter: this.activeCluster,
          })

        this.maxNamespaces = resp.data.data

        console.log(this.maxNamespaces)
      } catch (error) {
        console.log('Error', error)
        console.log('Error', error.response)
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
