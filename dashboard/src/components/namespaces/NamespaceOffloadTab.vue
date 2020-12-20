<template>
    <div class="namespace-offload">

            <vuestic-widget>

                <alert ref="alert" :errorText="errorText"></alert>

                 <vuestic-modal ref="updateOffloadThresholdModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceOffloadThreshold()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Offload Threshold</div>

                  <div class="va-row">
                      <vuestic-checkbox label="Reset to default" v-model="disableOffload">
                      </vuestic-checkbox>
                    </div>
              
                  <div v-if="disableOffload === false" class="flex va-row">
                      <div class="form-group">
                        <div class="input-group">
                          <input id="offloadThreshold"
                            name="Offload Threshold"
                            ref="offloadThreshold"
                            v-model="offloadThresholdDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateOffloadThreshold"
                            required
                          />
                          <label class="control-label" for="offloadThreshold">Offload Threshold</label><i class="bar"></i>
                          <small v-show="errors.has('Offload Threshold')"
                               class="help text-danger">
                          {{ errors.first('Offload Threshold') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="Unit"
                              v-model="unit"
                              name="offload-unit"
                              :options="unitLists"
                              option-key="name"
                              v-on:input="updateOffloadThresholdDisplay"
                              ref="offload-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    
                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update offload threshold on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>



                <div class="va-row" v-if="namespacesConfig.data[$route.params.id] && namespacesConfig.data[$route.params.id].cluster === activeCluster">
                    <div class="flex md12">

                              
                                <div class="va-row">
                                    <div class="flex md4">

                                      <div v-if="namespacesConfig.data[$route.params.id]" class="va-row">
                                            <div class="flex md12">
                                                <div class="form-group with-icon-right">
                                                    <div class="input-group">
                                                        <input :value="offloadThresholdHuman" id="offload" name="offload"
                                                        class="has-value" placeholder="" readonly />
                                                        <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showOffloadThresholdModal()">
                                                        </i>
                                                        <label class="control-label" for="offload" role="button">Storage Offload Threshold</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                   
                    </div>
                </div>
                </div>
                <div class="flex md12">
                <h5>Policies</h5>
                        <div class="va-row" v-if="namespacesConfig.data[$route.params.id].offload_policies">
                                <div class="va-row">
                                    <div v-for="configKey in offloadKeys" :key="configKey" class="flex md4">
                                        <div class="form-group">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(configKey, namespacesConfig.data[$route.params.id].offload_policies[configKey])" :id="configKey" :name="configKey"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" :for="configKey" role="button">{{ convertCamelCaseToTitleCase(configKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div v-else>
                          <p>
                            System Default
                          </p>
                        </div>
                    </div>
                </div>
            </vuestic-widget>

    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import AjaxService from '@/services/AjaxService'
import ApiService from '@/services/ApiService'
import Alert from '../utils/Alert'

export default {
  name: 'NamespaceOffloadTab',
  data () {
    return {
      errorText: 'Something went wrong',
      disableOffload: false,
      offloadThresholdDisplay: 0,
      offloadThreshold: 0,
      unit: { id: 'megabytes', name: 'MB', convert: 1000000 },
      timeUnit: { id: 'seconds', name: 'Sec', convert: 1 },
      unitLists: [
        { id: 'bytes', name: 'B', convert: 1 },
        { id: 'kilobytes', name: 'KB', convert: 1000 },
        { id: 'megabytes', name: 'MB', convert: 1000000 },
        { id: 'gigabytes', name: 'GB', convert: 1000000000 }
      ],
      timeUnitList: [
        { id: 'seconds', name: 'Seconds', convert: 1 },
        { id: 'minutes', name: 'Minutes', convert: 60 },
        { id: 'hours', name: 'Hours', convert: 3600 },
        { id: 'days', name: 'Days', convert:  86400},
        { id: 'weeks', name: 'Weeks', convert: 604800 }
      ],
    }
  },
  components: {
    Alert
  },
  computed: {
    ...mapGetters([
      'namespacesConfig',
      'activeCluster',
      'planInfo',
      'tenant',
      'privateOrg',
      'isAdminUser',
    ]),
    offloadKeys () {
      if (this.namespacesConfig.data[this.$route.params.id].offload_policies) {
        return Object.keys(this.namespacesConfig.data[this.$route.params.id].offload_policies)
      } else {
        return []
      }
    },
    offloadThresholdHuman () {
      if (this.namespacesConfig.data[this.$route.params.id]) {
        const threshold = this.namespacesConfig.data[this.$route.params.id].offload_threshold

        if (threshold >= 0) {
          return this.$options.filters.humanBytes(threshold)
        } else {
          return 'System Default'
        }
      }
    },
  },
  mixins: [mixins],
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    showOffloadThresholdModal () {
      this.offloadThreshold = this.namespacesConfig.data[this.$route.params.id].offload_threshold
      if (this.offloadThreshold == -1) {
        this.unit = { id: 'bytes', name: 'B', convert: 1 }
      }
      this.updateOffloadThresholdDisplay()
      this.$refs.updateOffloadThresholdModal.open()
    },
    updateOffloadThresholdDisplay () {
      this.offloadThresholdDisplay = this.offloadThreshold / this.unit.convert
    },
    updateOffloadThreshold () {
      this.offloadThreshold = this.offloadThresholdDisplay * this.unit.convert
    },
    async updateNamespaceOffloadThreshold () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      if (this.disableOffload) {
        this.offloadThreshold = -1
      }
      try {
        await ApiService.updateNamespaceOffloadThreshold(this.activeCluster, namespacePath, this.offloadThreshold)

        this.onSuccess('Offload Threshold updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace offload threshold: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
  }
}

</script>

<style lang="scss" scoped>

.label-style {
  font-size: 0.6rem;
  color: #188FFF;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
