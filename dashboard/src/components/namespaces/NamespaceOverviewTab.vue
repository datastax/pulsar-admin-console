<template>
    <div class="namespace-detail">

            <vuestic-widget>

                <alert ref="alert" :errorText="errorText"></alert>

                <vuestic-modal ref="deleteNamespaceModal"
                            :okText="'modal.confirm' | translate"
                            v-on:ok="deleteNamespace()"
                            :cancelText="'modal.cancel' | translate">

                <div slot="title">Delete Namespace</div>

                <p style="color: red;">
                                      WARNING: This will delete all topics in the namespace.
                </p>
                <div v-if="namespacesConfig.data[$route.params.id]">
                    Are you sure you want to delete namespace {{ namespacesConfig.data[$route.params.id].name }} and all its topics?
                </div>
                </vuestic-modal>

                <vuestic-modal ref="updatePersistModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespacePersistence()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Persistence</div>

                    <div class="form-group">
                      <div class="input-group">
                        <input id="ensembleConfig"
                          name="Ensemble"
                          ref="ensemble"
                          v-model="ensembleQ"
                          v-validate="'required|numeric'"
                          required
                        />
                        <label class="control-label" for="Ensemble">Ensemble</label><i class="bar"></i>
                        <small v-show="errors.has('Ensemble')"
                             class="help text-danger">
                        {{ errors.first('Ensemble') }}
                      </small>
                      </div>
                  </div>

                  <div class="form-group">
                      <div class="input-group">
                        <input id="writeQ"
                          name="Write"
                          ref="write"
                          v-model="writeQ"
                          v-validate="'required|numeric'"
                          required
                        />
                        <label class="control-label" for="Write">Write Quorum</label><i class="bar"></i>
                        <small v-show="errors.has('Write')"
                             class="help text-danger">
                        {{ errors.first('Write') }}
                      </small>
                      </div>
                  </div>

                  <div class="form-group">
                      <div class="input-group">
                        <input id="ackQ"
                          name="Ack"
                          ref="ack"
                          v-model="ackQ"
                          v-validate="'required|numeric'"
                          required
                        />
                        <label class="control-label" for="Write">Ack Quorum</label><i class="bar"></i>
                        <small v-show="errors.has('Ack')"
                             class="help text-danger">
                        {{ errors.first('Ack') }}
                      </small>
                      </div>
                  </div>

                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update persistence settings on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>


                <vuestic-modal  ref="updateCompactModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceCompaction()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Compaction Threshold</div>

                  <div class="flex va-row">
                      <div class="form-group">
                        <div class="input-group">
                          <input id="compactionThreshold"
                            name="Compaction Threshold"
                            ref="compactionThreshold"
                            v-model="compactionThresholdDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateCompactThreshold"
                            required
                          />
                          <label class="control-label" for="namespaceName">Compaction Threshold</label><i class="bar"></i>
                          <small v-show="errors.has('Compaction Threshold')"
                               class="help text-danger">
                          {{ errors.first('Compaction Threshold') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="Unit"
                              v-model="unit"
                              name="compact-unit"
                              :options="unitLists"
                              option-key="name"
                              v-on:input="updateCompactThresholdDisplay"
                              ref="compact-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update compaction thresholds on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <vuestic-modal ref="updateSchemaModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceSchema()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Schema Settings</div>

                  <div class="va-row">
                    <div class="flex md6">
                      <div class="label-style">Auto Update of Schema</div>
                      <fieldset>
                        <vuestic-radio-button
                          option="true"
                          v-model="autoUpdateSchema"
                          label="Enabled"
                        />
                        <vuestic-radio-button
                          option="false"
                          v-model="autoUpdateSchema"
                          label="Disabled"
                        />
                      </fieldset>
                    </div>
                    <div class="flex md6">
                      <div class="label-style">Enforce Schema Validation</div>
                      <fieldset>
                        <vuestic-radio-button
                          option="true"
                          v-model="enforceValidation"
                          label="Enabled"
                        />
                        <vuestic-radio-button
                          option="false"
                          v-model="enforceValidation"
                          label="Disabled"
                        />
                      </fieldset>
                    </div>
                  </div>

                  <vuestic-simple-select
                            label="Compatability Check Strategy"
                            v-model="compatCheck"
                            name="compat-check"
                            :options="compatSelect"
                            option-key="name"
                            ref="compat-check"
                            :clearable="false"
                            >
                  </vuestic-simple-select>

                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update the schema settings on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <vuestic-modal ref="updateDedupeModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceDedupe()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Deduplication Settings</div>

                  <div class="va-row">
                    <div class="flex md6">
                      <div class="label-style">Deduplication</div>
                      <fieldset>
                        <vuestic-radio-button
                          option="true"
                          v-model="dedupe"
                          label="Enabled"
                        />
                        <vuestic-radio-button
                          option="false"
                          v-model="dedupe"
                          label="Disabled"
                        />
                      </fieldset>
                    </div>
                  </div>

                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update the deduplication settings on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <div class="va-row" v-if="namespacesConfig.data[$route.params.id] && namespacesConfig.data[$route.params.id].cluster === activeCluster">
                    <div class="flex md12">
                        <vuestic-widget  >

                                <div class="va-row">
                                    <div class="flex md4">
                                        <div class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="namespacesConfig.data[$route.params.id].name" id="namespace-name" name="namespace-name"
                                                class="has-value" placeholder="" readonly />
                                                <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="namespacesConfig.data[$route.params.id].name"
                                                v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                </i>
                                                <label class="control-label" for="namespace-name" role="button">{{'forms.inputs.name'
                                                | translate}}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="namespacesConfig.data[$route.params.id].cluster" id="cluster" name="cluster"
                                                class="has-value" placeholder="" readonly />
                                                <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="namespacesConfig.data[$route.params.id].cluster"
                                                v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                </i>
                                                <label class="control-label" for="cluster" role="button">{{'forms.inputs.cluster'
                                                | translate}}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="tenant" id="tenant" name="tenant"
                                                class="has-value" placeholder="" readonly />
                                                <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="tenant"
                                                v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                </i>
                                                <label class="control-label" for="tenant" role="button">Tenant</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div  class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="namespacesConfig.data[$route.params.id].path" id="path" name="path"
                                                class="has-value" placeholder="" readonly />
                                                <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="namespacesConfig.data[$route.params.id].path"
                                                v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                </i>
                                                <label class="control-label" for="path" role="button">{{'forms.inputs.topicPath'
                                                | translate}}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div v-if="privateOrg === 'false'" class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="planType" id="plan" name="plan"
                                                class="has-value" placeholder="" readonly />
                                                <i class="fa fa-clipboard icon-right input-icon pointer" v-clipboard:copy="planType"
                                                v-clipboard:success="onCopy" v-clipboard:error="onError">
                                                </i>
                                                <label class="control-label" for="plan" role="button">Plan</label><i class="bar"></i>
                                            </div>
                                        </div>

                                        <div class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="dedupeHuman" id="deDupe" name="deDupe"
                                                class="has-value" placeholder="" readonly />
                                                <i v-if="isAdminUser"  class="fa fa-external-link icon-right input-icon pointer" @click="showDedupeModal()">
                                                </i>
                                                <label class="control-label" for="deDupe" role="button">{{'forms.inputs.deduplicationEnabled'
                                                | translate}}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div  v-for="statKey in schemaKeys" :key="statKey" class="form-group with-icon-right">
                                            <div class="input-group" >
                                            <input :value="getHumanReadable(statKey, namespacesConfig.data[$route.params.id][statKey])" :id="statKey" :name="statKey"
                                                class="has-value" placeholder="" readonly />
                                                <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showSchemaModal()">
                                                </i>
                                            <label class="control-label" :for="statKey" role="button">{{ convertUnderscoreToTitleCase(statKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div  class="form-group with-icon-right">
                                            <div class="input-group" >
                                            <input :value="currentCompatStrat" id="currentCompatStrat" name="currentCompatStrat"
                                                class="has-value" placeholder="" readonly />
                                                <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showSchemaModal()">
                                                </i>
                                            <label class="control-label" for="currentCompatStrat" role="button">Schema Compatabilty Strategy</label><i class="bar"></i>
                                            </div>
                                        </div>
                                                

                                    </div>
                                    <div class="flex md4">

                                        <div class="flex md12">

                                                <vuestic-widget class="info-widget">
                                                    <div class="info-widget-inner">
                                                        <div class="info-widget-inner">
                                                        <div class="stats">
                                                            <div class="stats-number">
                                                            {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].storage : 0 | humanBytes}}
                                                            </div>
                                                            <div class="stats-title">{{'tables.headings.storageSize' | translate}}</div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </vuestic-widget>

                                        </div>
                                        <div class="flex md12" @click="goToTopics()" style="cursor: pointer">
                                            <vuestic-widget  class="info-widget">
                                            <div class="info-widget-inner">
                                                <div class="stats">
                                                <div class="stats-number">

                                                    {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.numTopics[$route.params.id] : 0}}
                                                </div>
                                                <div class="stats-title">{{'tables.headings.topics' | translate}}</div>

                                                </div>
                                            </div>
                                            </vuestic-widget>
                                        </div>

                                        <div  class="form-group with-icon-right">
                                            <div class="input-group" >
                                            <input :value="humanCompactionThreshold" id="compactThreshold" name="compactThreshold"
                                                class="has-value" placeholder="" readonly />
                                              <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="updateCompact()">
                                                </i>
                                            <label class="control-label" for="compactThresheolf" role="button">Compaction Threshold</label><i class="bar"></i>
                                            </div>
                                        </div>


                                        <div class="va-row">
                                            <div class="flex md4">
                                                <div class="form-group with-icon-right">
                                                    <div class="input-group">
                                                        <input :value="bookkeeperEnsemble" id="ensemble" name="ensemble"
                                                        class="has-value" placeholder="" readonly />
                                                        <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="confirmUpdatePersist()">
                                                        </i>
                                                        <label class="control-label" for="ensemble" role="button">Ensemble</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex md4">
                                                <div class="form-group with-icon-right">
                                                    <div class="input-group">
                                                        <input :value="bookkeeperWriteQuorum" id="wquorum" name="wquorum"
                                                        class="has-value" placeholder="" readonly />
                                                        <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="confirmUpdatePersist()">
                                                        </i>
                                                        <label class="control-label" for="wquorum" role="button">Write</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex md4">
                                                <div class="form-group with-icon-right">
                                                    <div class="input-group">
                                                        <input :value="bookkeeperAckQuorum" id="ack" name="ack"
                                                        class="has-value" placeholder="" readonly />
                                                        <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="confirmUpdatePersist()">
                                                        </i>
                                                        <label class="control-label" for="ack" role="button">Ack</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        

                                    </div>
                                    <div class="flex md4">

                                        <div class="va-row">
                                            <div class="flex md6">
                                                <vuestic-widget class="vuestic-widget info-widget brand-info">
                                                <div class="info-widget-inner">
                                                    <div class="info-widget-inner">
                                                    <div class="stats">
                                                        <div class="stats-number no-wrap">
                                                        {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].inRate : 0 | numberSeparate() }}
                                                        </div>
                                                        <div class="stats-title">Msg/s In</div>
                                                    </div>
                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>

                                            <div class="flex md6">
                                                <vuestic-widget class="vuestic-widget">
                                                <div class="info-widget-inner">
                                                    <div class="info-widget-inner">
                                                    <div class="stats">
                                                        <div class="stats-number">
                                                        {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].inTput : 0 | humanBytes('0.0', 'number') }}
                                                        </div>
                                                        <div class="stats-title">{{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].inTput: 0 | humanBytes('0.0', 'unit') }} In</div>
                                                    </div>
                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>

                                            <div class="flex md6 ">
                                                <vuestic-widget class="vuestic-widget info-widget brand-info">
                                                <div class="info-widget-inner">
                                                    <div class="info-widget-inner">
                                                    <div class="stats">
                                                        <div class="stats-number no-wrap">
                                                        {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].outRate : 0 | numberSeparate() }}
                                                        </div>
                                                        <div class="stats-title">Msg/s Out</div>
                                                    </div>
                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>

                                            <div class="flex md6 ">
                                                <vuestic-widget class="vuestic-widget ">
                                                <div class="info-widget-inner">
                                                    <div class="info-widget-inner">
                                                    <div class="stats">
                                                        <div class="stats-number">
                                                        {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].outTput : 0| humanBytes('0.0', 'number') }}
                                                        </div>
                                                        <div class="stats-title">{{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].outTput : 0| humanBytes('0.0', 'unit') }} Out</div>
                                                    </div>
                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>

                                        </div>

                                        <div class="va-row">
                                            <div class="flex md6">
                                                <vuestic-widget class="info-widget">
                                                <div class="info-widget-inner">
                                                    <div class="stats">
                                                    <div class="stats-number">

                                                        {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].producers : 0}}
                                                    </div>
                                                    <div class="stats-title">{{'topicDetail.producers' | translate}}</div>

                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>
                                            <div class="flex md6">
                                                <vuestic-widget class="info-widget">
                                                <div class="info-widget-inner">
                                                    <div class="stats">
                                                    <div class="stats-number">
                                                        {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].subscriptions : 0}}
                                                    </div>
                                                    <div class="stats-title">{{'topicDetail.subscriptions' | translate}}</div>
                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>
                                            <div class="flex md6">
                                                <vuestic-widget class="info-widget">
                                                <div class="info-widget-inner">
                                                    <div class="stats">
                                                    <div class="stats-number">
                                                        {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].consumers : 0}}
                                                    </div>
                                                    <div class="stats-title">{{'topicDetail.consumers' | translate}}</div>
                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>
                                            <div v-if="namespacesConfig.data[$route.params.id]" class="flex md6">
                                                <vuestic-widget class="info-widget">
                                                <div class="info-widget-inner">
                                                    <div class="stats">
                                                    <div class="stats-number">
                                                        {{ namespacesConfig.data[$route.params.id].replication_clusters.length }}
                                                    </div>
                                                    <div class="stats-title">{{'topicDetail.replClusters' | translate}}</div>
                                                    </div>
                                                </div>
                                                </vuestic-widget>
                                            </div>

                                            <div class="flex md12">
                                                <button :disabled="isDeleted" class="btn btn-primary btn-right" @click="confirmDeleteNamespace()">Delete</button>
                                            </div>
                                            <div v-if="isAdminUser" class="flex md12">
                                              <button :disabled="unloading" class="btn btn-primary btn-right" @click="unloadNamespace()">Unload</button>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                        </vuestic-widget>
                    </div>
                </div>
            </vuestic-widget>

    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import ApiService from '@/services/ApiService'
import Alert from '../utils/Alert'

export default {
  name: 'NamespaceOverviewTab',
  data () {
    return {
      errorText: 'Something went wrong',
      showDeleteModal: false,
      showPersistModal: false,
      showCompactModal: false,
      isDeleted: false,
      ensembleQ: 1,
      ackQ: 1,
      writeQ: 1,
      unloading: false,
      compactionThreshold: 0,
      compactionThresholdDisplay: 0,
      autoUpdateSchema: 'true',
      enforceValidation: 'false',
      dedupe: 'false',
      unit: { id: 'megabytes', name: 'MB', convert: 1000000 },
      timeUnit: { id: 'seconds', name: 'Sec', convert: 1 },
      compatCheck: { id: 'FULL', name: 'Full' },
      compatSelect: [
        { id: 'ALWAYS_COMPATIBLE', name: 'Always Compatible' },
        { id: 'ALWAYS_INCOMPATIBLE', name: 'Always Incompatible' },
        { id: 'BACKWARD', name: 'Backward' },
        { id: 'BACKWARD_TRANSITIVE', name: 'Backward Transitive' },
        { id: 'FORWARD', name: 'Forward' },
        { id: 'FORWARD_TRANSITIVE', name: 'Forward Transitive' },
        { id: 'FULL', name: 'Full' },
        { id: 'FULL_TRANSITIVE', name: 'Full Transitive' },
      ],
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
      schemaKeys: [
        'is_allow_auto_update_schema',
        'schema_validation_enforced',
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
      'runningEnv'
    ]),
    currentCompatStrat () {
      if (this.namespacesConfig.data[this.$route.params.id]) {
        const oldStrat = this.namespacesConfig.data[this.$route.params.id].schema_auto_update_compatibility_strategy
        const newStrat = this.namespacesConfig.data[this.$route.params.id].schema_compatibility_strategy

        if (!newStrat || newStrat === 'UNDEFINED') {
          return oldStrat.toUpperCase()
        }
        return newStrat
      }
    },
    bookkeeperEnsemble () {
      if (this.namespacesConfig.data[this.$route.params.id].persistence) {
        return this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperEnsemble
      } else {
        return "System default"
      }
    },
    bookkeeperWriteQuorum () {
      if (this.namespacesConfig.data[this.$route.params.id].persistence) {
        return this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperWriteQuorum
      } else {
        return "System default"
      }
    },
    bookkeeperAckQuorum () {
      if (this.namespacesConfig.data[this.$route.params.id].persistence) {
        return this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperAckQuorum
      } else {
        return "System default"
      }
    },
    ttlHuman () {
      if (this.namespacesConfig.data[this.$route.params.id].message_ttl_in_seconds > 0) {
        return this.$options.filters.humanSeconds(this.namespacesConfig.data[this.$route.params.id].message_ttl_in_seconds)
      }
      return 'Forever'
    },
    humanCompactionThreshold () {
      const thresh = this.namespacesConfig.data[this.$route.params.id].compaction_threshold
      if (thresh === 0) {
        return 'Disabled'
      } else {
        return this.$options.filters.humanBytes(thresh)
      }
    },
    storageLimitHuman () {
      if (this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage) {
        const limit = this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage.limit
        // console.log(limit)
        if (limit >= 0) {
          return this.$options.filters.humanBytes(limit)
        }
        return 'Unlimited'
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
    dedupeHuman () {
      if (this.namespacesConfig.data[this.$route.params.id].deduplicationEnabled) {
        return 'Enabled'
      }
      return 'Disabled'
    },
    storagePolicyHuman () {
      if (this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage) {
        const policy = this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage.policy
        const humanName = this.$options.filters.camelcase(policy.replace('_', ' '))
        return humanName
      }
    },
    planType () {
      if (this.namespacesConfig.data[this.$route.params.id]) {
        const policies = this.namespacesConfig.data[this.$route.params.id].auth_policies.namespace_auth
        const roles = Object.keys(policies)
        let plan = 'free'
        roles.forEach(role => {
          if (role.includes('plan-')) {
            plan = role.replace('plan-', '')
          }
        })

        const planName = this.planInfo[plan] ? this.planInfo[plan].display_name : plan

        return planName
      }
    },

  },
  mixins: [mixins],
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    isGlobal (index) {
      if (this.namespacesConfig.data[index] && this.namespacesConfig.data[index].replication_clusters.length > 1) {
        return true
      }
      return false
    },
    confirmDeleteNamespace () {
      this.$refs.deleteNamespaceModal.open()
    },
    async unloadNamespace () {
      this.unloading = true

      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName

      try {
        await ApiService.unloadNamespace(this.activeCluster, namespacePath)
        this.onSuccess('Namespace unloaded')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Unloading namespace: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      } finally {
        this.unloading = false
      }
    },
    showSchemaModal () {
      this.autoUpdateSchema = this.namespacesConfig.data[this.$route.params.id].is_allow_auto_update_schema.toString()
      this.enforceValidation = this.namespacesConfig.data[this.$route.params.id].schema_validation_enforced.toString()
      this.compatCheck = this.compatSelect.find(o => o.id === this.currentCompatStrat)

      this.$refs.updateSchemaModal.open()
    },
    showDedupeModal () {

      if (this.dedupe = this.namespacesConfig.data[this.$route.params.id].deduplicationEnabled) {
        this.dedupe = this.namespacesConfig.data[this.$route.params.id].deduplicationEnabled.toString()
      } else {
        this.dedupe = 'false'
      }

      this.$refs.updateDedupeModal.open()
    },
    goToTopics (value) {
      this.$store.commit('setFilterObject', { key: 'topicNamespace', value: this.namespacesConfig.data[this.$route.params.id].name })
      this.$router.push('/admin/topics/')

    },
    showOffloadThresholdModal () {
      this.offloadThreshold = this.namespacesConfig.data[this.$route.params.id].offload_threshold
      if (this.offloadThreshold == -1) {
        this.unit = { id: 'bytes', name: 'B', convert: 1 }
      }
      this.updateOffloadThresholdDisplay()
      this.$refs.updateOffloadThresholdModal.open()
    },
    confirmUpdatePersist () {
      // Default values to 2 if no configuration is specified on the namespace
      this.ensembleQ = this.namespacesConfig.data[this.$route.params.id].persistence ? this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperEnsemble : 2
      this.ackQ = this.namespacesConfig.data[this.$route.params.id].persistence ? this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperAckQuorum : 2
      this.writeQ = this.namespacesConfig.data[this.$route.params.id].persistence ? this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperWriteQuorum : 2
      this.$refs.updatePersistModal.open()
    },
    updateCompact () {
      this.compactionThreshold = this.namespacesConfig.data[this.$route.params.id].compaction_threshold
      this.updateCompactThresholdDisplay()
      this.$refs.updateCompactModal.open()
    },
    updateCompactThresholdDisplay () {
      this.compactionThresholdDisplay = this.compactionThreshold / this.unit.convert
    },
    updateCompactThreshold () {
      this.compactionThreshold = this.compactionThresholdDisplay * this.unit.convert
    },
    pageTitle () {
      if (this.namespacesConfig.data[this.$route.params.id]) {
        return this.namespacesConfig.data[this.$route.params.id].name
      }
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
    async deleteNamespace () {
      // Disabled the delete button
      this.isDeleted = true
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName


      try {
        await ApiService.deleteNamespace(this.activeCluster, namespacePath)

        this.onSuccess('Namespace deleted')
        // Need to update master list of topics
        this.$store.dispatch('getNamespaces')

        // Redirect to the namespace summary page
        setTimeout(() => {
          // Wait a bit to let the data update
          this.$router.push('/admin/namespaces')
        }, 1000)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting namespace: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = false
      }
    },
    async updateNamespaceDedupe() {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

    
      try {
        await ApiService.updateDedupe(this.activeCluster, namespacePath, this.dedupe)
    
        this.onSuccess('Deduplication updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace deduplication: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }

    },
    async updateNamespacePersistence () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName

      try {
        await ApiService.updateNamespacePersistence(this.activeCluster,namespacePath, this.ensembleQ,this.ackQ, this.writeQ)
        this.onSuccess('Persistence updated')
        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace persistence: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    async updateNamespaceCompaction () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName

      try {
        await ApiService.updateNamespaceCompactionThreshold(this.activeCluster,namespacePath, this.compactionThreshold)
        this.onSuccess('Threshold updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace compaction: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    
    
    async updateNamespaceSchema () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName

      try {
        await ApiService.updateNamespaceSchemaAutoUpdate(this.activeCluster,namespacePath, this.autoUpdateSchema)
        await ApiService.updateNamespaceSchemaValidationEnforced(this.activeCluster,namespacePath, this.enforceValidation)
        await ApiService.updateNamespaceSchemaCompatabilityStrategy(this.activeCluster,namespacePath, this.compatCheck.id)
        this.onSuccess('Schema updated')
        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace schema: ${namespaceName}. Reason: ${reason} (${statusCode})`
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
