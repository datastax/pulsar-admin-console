<template>
    <div class="httpclients-consumer">
        <h5>HTTP SSE CURL Consumer</h5>
        <p>This sample waits for the next message by listening HTTP SSE stream.</p>

        <div class="va-row">
            <div class="flex md9">
                <div class="va-row">
                    <div class="flex md3">
                        <vuestic-simple-select
                        label="Cluster"
                        v-model="currentCluster"
                        option-key="id"
                        :options="clusterSelect"
                        :clearable="clearable"
                        v-on:input="updateNsSelect()"
                        />
                    </div>
                    <div class="flex md3">
                        <vuestic-simple-select
                        label="Namespace"
                        v-model="currentNamespace"
                        option-key="id"
                        :options="namespaceSelect"
                        ref="nsSelect"
                        :clearable="clearable"
                        />
                    </div>

                    <div class="flex md3">
                        <div class="form-group with-icon-right"
                            :class="{'has-error': errors.has('currentTopic'), 'valid': isFormFieldValid('currentTopic')}">
                            <div class="input-group">
                                    <input id="topic-input"
                                    v-model="currentTopic"
                                    class="has-value"
                                    v-validate="'required|alpha_dash'"
                                    name="currentTopic"
                                    data-vv-as="Produce Topic"
                                    />
                                    <i
                                    class="fa fa-exclamation-triangle error-icon icon-right input-icon icon-medium"></i>
                                    <label class="control-label" for="simple-input">Topic</label><i class="bar"></i>
                            </div>
                        </div>
                    </div>
                    <div class="flex md3">
                        <div class="form-group with-icon-right"
                            :class="{'has-error': errors.has('currentSubscription'), 'valid': isFormFieldValid('currentSubscription')}">
                            <div class="input-group">
                                    <input id="subscription-input"
                                    v-model="currentSubscription"
                                    class="has-value"
                                    v-validate="'required|alpha_dash'"
                                    name="currentSubscription"
                                    data-vv-as="Subscription"
                                    />
                                    <i
                                    class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                                    <label class="control-label" for="simple-input">Subscription</label><i class="bar"></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="flex md3">
                <a href="https://github.com/kafkaesque-io/sample-pulsar-node-client/blob/master/src/sse/sse.js" style="float: right;" target="_blank" rel="noopener noreferrer">
                    Full project on GitHub
                    <span class="fa fa-github icon-github" ></span>
                </a>
            </div>
        </div>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="simpleConsumer"><code class="golang"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="simpleConsumer"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'

export default {
  name: 'HttpClientsConsumer',
  data () {
    return {
      currentTopic: 'test-topic',
      currentSubscription: 'my-subscription',
      currentCluster: { id: this.cluster, description: this.cluster },
      currentNamespace: { id: this.namespace, description: this.namespace },
      clearable: false
    }
  },
  mixins: [mixins],
  methods: {
    updateNsSelect () {
      this.currentNamespace = ''

      Object.keys(this.namespacesConfig.data).forEach(key => {
        if (this.namespacesConfig.data[key].name === 'local-' + this.currentCluster.id) {
          this.$refs.nsSelect.selectOption({ id: 'local-' + this.currentCluster.id, description: 'local-' + this.currentCluster.id })
        }
      })
    },
    isFormFieldValid (field) {
      let isValid = false
      if (this.formFields[field]) {
        isValid = this.formFields[field].validated && this.formFields[field].valid
      }
      return isValid
    },
  },
  props: {
    cluster: {
      type: String,
      default: 'useast1-gcp',
    },
    namespace: {
      type: String,
      default: 'worldwide',
    },
  },
  computed: {
    ...mapGetters([
      'apiVersion',
      'activeCluster',
      'clientToken',
      'allowedClusters',
      'tenant',
      'namespacesConfig',
      'clusterInfo'
    ]),
    clusterSelect () {
      const options = []

      this.allowedClusters.forEach(cluster => {
        options.push({
          id: cluster,
          description: cluster
        })
      })

      return options
    },
    namespaceSelect () {
      const options = []
      // Get the namespace data if we have it
      Object.keys(this.namespacesConfig.data).forEach(key => {
        if (this.namespacesConfig.data[key].cluster === this.currentCluster.id) {
          options.push({
            id: this.namespacesConfig.data[key].name,
            description: this.namespacesConfig.data[key].name
          })
        }
      })

      return options
    },
    serviceUrl() {
        if (this.clusterInfo.info[this.currentCluster.id] && this.clusterInfo.info[this.currentCluster.id].host_override_http) {
            return this.clusterInfo.info[this.currentCluster.id].host_override_http
        }
        return "https://"+this.currentCluster.id.replace(/-/g,".")+".kafkaesque.io:8085"
    },
    simpleConsumer () {
      return `curl -X GET -H "Authorization: Bearer ${this.clientToken}" \
${this.serviceUrl}/v2/sse/p/${this.tenant}/${this.currentNamespace.id}/${this.currentTopic}?SubscriptionName=${this.currentSubscription}&SubscriptionType=exclusive
`
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
