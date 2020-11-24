<template>
    <div class="namespace-detail">

            <vuestic-widget :headerText="pageTitle()" :class="{ globebackground: isGlobal($route.params.id)}">

                <alert ref="alert" :errorText="errorText"></alert>

                <vuestic-modal :show.sync="showDeleteModal" ref="deleteNamespaceModal"
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

                <vuestic-modal :show.sync="showPersistModal" ref="updatePersistModal"
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

                <vuestic-modal :show.sync="showCompactModal" ref="updateCompactModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceCompaction()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Compaction Threshodld</div>

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
                              :options="compactUnits"
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

                <vuestic-modal :show.sync="showSchemaModal" ref="updateSchemaModal"
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

                                        <div class="va-row">
                                            <div class="md6 flex">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="ttlHuman" id="ttl" name="ttl"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="ttl" role="button">{{'forms.inputs.ttl'
                                                        | translate}}</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex md6">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="retentionHuman" id="retention" name="retention"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="retention" role="retention">{{'forms.inputs.retentionTime'
                                                        | translate}}</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                            <div class="va-row">
                                                <div class="flex md6">
                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <input :value="namespacesConfig.data[$route.params.id].max_consumers_per_topic" id="maxconsumerstopic" name="maxconsumerstopic"
                                                            class="has-value" placeholder="" readonly />
                                                            <label class="control-label" for="maxconsumerstopic" role="button">{{'forms.inputs.maxConsumersTopic'
                                                            | translate}}</label><i class="bar"></i>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="flex md6">
                                                    <div class="form-group">
                                                        <div class="input-group">
                                                            <input :value="namespacesConfig.data[$route.params.id].max_consumers_per_subscription" id="maxconsumerssub" name="maxconsumerssub"
                                                            class="has-value" placeholder="" readonly />
                                                            <label class="control-label" for="maxconsumerssub" role="button">{{'forms.inputs.maxConsumersSub'
                                                            | translate}}</label><i class="bar"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        <div class="va-row">
                                            <div class="flex md6">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="namespacesConfig.data[$route.params.id].max_producers_per_topic" id="maxproducers" name="maxproducers"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="maxproducers" role="button">{{'forms.inputs.maxProducers'
                                                        | translate}}</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex md6">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="dedupeHuman" id="deDupe" name="deDupe"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="deDupe" role="button">{{'forms.inputs.deduplicationEnabled'
                                                        | translate}}</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="va-row">
                                            <div v-for="statKey in narrowCopyKeys" :key="statKey" class="flex md6">
                                                <div  class="form-group with-icon-right">
                                                    <div class="input-group" >
                                                    <input :value="getHumanReadable(statKey, namespacesConfig.data[$route.params.id][statKey])" :id="statKey" :name="statKey"
                                                        class="has-value" placeholder="" readonly />
                                                    <label class="control-label" :for="statKey" role="button">{{ convertUnderscoreToTitleCase(statKey) }}</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex md12">
                                                <div  class="form-group with-icon-right">
                                                    <div class="input-group" >
                                                    <input :value="currentCompatStrat" id="currentCompatStrat" name="currentCompatStrat"
                                                        class="has-value" placeholder="" readonly />
                                                    <label class="control-label" for="currentCompatStrat" role="button">Schema Compatabilty Strategy</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                                <div  class="form-group with-icon-right">
                                                    <div class="input-group" >
                                                    <input :value="humanCompactionThreshold" id="compactThreshold" name="compactThreshold"
                                                        class="has-value" placeholder="" readonly />
                                                    <label class="control-label" for="compactThresheolf" role="button">Compaction Threshold</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="flex md4">

                                        <!-- <div class="flex md12">

                                                <vuestic-widget class="info-widget">
                                                    <div class="info-widget-inner">
                                                        <div class="info-widget-inner has-chart">
                                                        <div class="stats">
                                                            <div class="stats-number">
                                                            {{ namespacesConfig.stats[$route.params.id] ? namespacesConfig.stats[$route.params.id].storage : 0 | humanBytes}}
                                                            </div>
                                                            <div class="stats-title">{{'tables.headings.storageSize' | translate}}</div>
                                                        </div>
                                                        <div class="chart-container">
                                                            <vuestic-progress-bar type="vertical" :value="calcStorePercent($route.params.id)" theme="Primary"
                                                                                backgroundTheme="White"/>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </vuestic-widget>

                                        </div> -->
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

                                        <div class="form-group">
                                            <div class="input-group">
                                                <input :value="storageLimitHuman" id="storgeLimit" name="storageLimit"
                                                class="has-value" placeholder="" readonly />
                                                <label class="control-label" for="storageLimit" role="button">Storage Limit (per topic)</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group">
                                                <input :value="storagePolicyHuman" id="storagePolicy" name="storagePolic"
                                                class="has-value" placeholder="" readonly />
                                                <label class="control-label" for="storagePolicy" role="button">{{'forms.inputs.storagePolicy'
                                                | translate}}</label><i class="bar"></i>
                                            </div>
                                        </div>

                                        <div v-if="namespacesConfig.data[$route.params.id].persistence" class="va-row">
                                            <div class="flex md6">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="namespacesConfig.data[$route.params.id].persistence.bookkeeperEnsemble" id="ensemble" name="ensemble"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="ensemble" role="button">Storage Nodes</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex md6">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="namespacesConfig.data[$route.params.id].persistence.bookkeeperWriteQuorum" id="wquorum" name="wquorum"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="wquorum" role="button">Number of Copies</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="namespacesConfig.data[$route.params.id].persistence" class="va-row">
                                            <div class="flex md6">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="namespacesConfig.data[$route.params.id].persistence.bookkeeperAckQuorum" id="ack" name="ack"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="ack" role="button">Writes Before Ack</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div v-if="namespacesConfig.data[$route.params.id]" class="va-row">
                                            <div class="flex md12">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="offloadThresholdHuman" id="offload" name="offload"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="offload" role="button">Storage Offload Threshold</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div v-if="namespacesConfig.data[$route.params.id]" class="va-row">
                                            <div class="flex md12">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="publishRateMsg" id="publishRateMsg" name="publishRateMsg"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="publishRateMsg" role="button">In Rate Limit (msg/s)</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="namespacesConfig.data[$route.params.id]" class="va-row">
                                            <div class="flex md12">
                                                <div class="form-group">
                                                    <div class="input-group">
                                                        <input :value="topicDispatchRateMsg" id="topicDispatchMsg" name="topicDispatchMsg"
                                                        class="has-value" placeholder="" readonly />
                                                        <label class="control-label" for="topicDispatchMsg" role="button">Out Rate Limit (msg/s)</label><i class="bar"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex md6">
                                            <vuestic-widget class="info-widget">
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
                                            <div class="flex md12">
                                                <button class="btn btn-primary btn-right" @click="showSchemaModal()">Schema</button>
                                            </div>
                                            <div class="flex md12">
                                                <button class="btn btn-primary btn-right" @click="updateCompact()">Compaction</button>
                                            </div>
                                            
                                            <div v-if="isAdminUser" class="flex md12">
                                                <button class="btn btn-primary btn-right" @click="confirmUpdatePersist()">Persistence</button>
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
import AjaxService from '@/services/AjaxService'
import Alert from '../utils/Alert'

export default {
  name: 'NamespaceDetail',
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
      unit: { id: 'kilobytes', name: 'KB', convert: 1000 },
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
      compactUnits: [
        { id: 'bytes', name: 'B', convert: 1 },
        { id: 'kilobytes', name: 'KB', convert: 1000 },
        { id: 'megabytes', name: 'MB', convert: 1000000 },
      ],
      narrowCopyKeys: [
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
      'isAdminUser'
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
    otherClusters () {
      const allClusters = this.namespacesConfig.data[this.$route.params.id].replication_clusters
      var otherClusters = []
      allClusters.forEach(cluster => {
        if (cluster !== this.activeCluster) {
          otherClusters.push(cluster)
        }
      })
      return otherClusters
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
    retentionHuman () {
      if (this.namespacesConfig.data[this.$route.params.id].retention_policies) {
        const retentionTime = this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionTimeInMinutes
        const retentionSize = this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionSizeInMB

        if (retentionTime > 0) {
          // If a time is specified, return that
          // N, anything case
          return this.$options.filters.humanSeconds(this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionTimeInMinutes, 'minutes')
        } else if (retentionTime === 0) {
          if (retentionSize > 0) {
            // 0, N case
            return retentionSize + ' MB'
          } else if (retentionSize === 0) {
            // 0,0 case
            return 'Until Acknowledged'
          } else {
          }
        } else {
          // Time is -1
          if (retentionSize > 0) {
            // -1, N case
            return retentionSize + ' MB'
          } else if (retentionSize === 0) {
            // -1, 0 case
            return 'Until Acknowledged'
          } else {
            // -1, -1 case
            return 'Forever'
          }
        }
      }
      return 'Until Acknowledged'
    },
    storageLimitHuman () {
      if (this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage) {
        const limit = this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage.limit
        // console.log(limit)
        if (limit > 0) {
          return this.$options.filters.humanBytes(limit)
        }
        return 'Unlimited'
      }
    },
    offloadThresholdHuman () {
      if (this.namespacesConfig.data[this.$route.params.id]) {
        const threshold = this.namespacesConfig.data[this.$route.params.id].offload_threshold

        if (threshold > 0) {
          return this.$options.filters.humanBytes(threshold)
        } else if (threshold === 0) {
          return 'ASAP'
        } else {
          return 'Disabled'
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
    topicDispatchRateMsg () {
      const cluster = this.activeCluster
      let rate = 0
      let interval = 1
      // Check for a topic dispatch rate
      if (this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[cluster]) {
        rate = this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[cluster].dispatchThrottlingRateInMsg
        interval = this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[cluster].ratePeriodInSecond
      }

      // If no topic dispatch rate, check for subscription dispatch rate
      if (rate === 0 && this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster]) {
        rate = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster].dispatchThrottlingRateInMsg
        interval = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster].ratePeriodInSecond
      }

      if (rate > 0) {
        return Math.round(rate / interval)
      } else {
        return 'Unlimited'
      }
    },
    publishRateMsg () {
      const cluster = this.activeCluster
      if (this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[cluster]) {
        const rate = this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[cluster].publishThrottlingRateInMsg
        return rate
      } else {
        return 'Unlimited'
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

      try {
        await AjaxService.ajaxAction('unload_namespace',
          {
            dataCenter: this.activeCluster,
            tenant: this.tenant,
            namespace: namespaceName,
          })
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
    confirmUpdatePersist () {
      this.ensembleQ = this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperEnsemble
      this.ackQ = this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperAckQuorum
      this.writeQ = this.namespacesConfig.data[this.$route.params.id].persistence.bookkeeperWriteQuorum
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
    // dispatchRateMsg () {
    //   const cluster = this.activeCluster
    //   if (this.namespacesConfig.data[this.$route.params.id].clusterDispatchRate[cluster]) {
    //     const rate = this.namespacesConfig.data[this.$route.params.id].clusterDispatchRate[cluster].dispatchThrottlingRateInMsg
    //     const interval = this.namespacesConfig.data[this.$route.params.id].clusterDispatchRate[cluster].ratePeriodInSecond
    //     return Math.round(rate / interval)
    //   }
    // },
    // subscriptionRateMsg (cluster) {
    //   if (this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster]) {
    //     const rate = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster].dispatchThrottlingRateInMsg
    //     const interval = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster].ratePeriodInSecond
    //     return Math.round(rate / interval)
    //   }
    // },
    // dispatchRateByte (cluster) {
    //   if (this.namespacesConfig.data[this.$route.params.id].clusterDispatchRate[cluster]) {
    //     const rate = this.namespacesConfig.data[this.$route.params.id].clusterDispatchRate[cluster].dispatchThrottlingRateInByte
    //     const interval = this.namespacesConfig.data[this.$route.params.id].clusterDispatchRate[cluster].ratePeriodInSecond
    //     return this.$options.filters.humanBytes(rate / interval)
    //   }
    // },
    // subscriptionRateByte (cluster) {
    //   if (this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster]) {
    //     const rate = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster].dispatchThrottlingRateInByte
    //     const interval = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[cluster].ratePeriodInSecond
    //     return this.$options.filters.humanBytes(rate / interval)
    //   }
    // },
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

      try {
        await AjaxService.ajaxAction('delete_namespace',
          {
            dataCenter: this.activeCluster,
            tenant: this.tenant,
            namespace: namespaceName
          })

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
    async updateNamespacePersistence () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name

      try {
        await AjaxService.ajaxAction('update_namespace_persistence',
          {
            dataCenter: this.activeCluster,
            tenant: this.tenant,
            namespace: namespaceName,
            ensembleQ: this.ensembleQ,
            ackQ: this.ackQ,
            writeQ: this.writeQ
          })
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

      try {
        await AjaxService.ajaxAction('update_namespace_compaction',
          {
            dataCenter: this.activeCluster,
            tenant: this.tenant,
            namespace: namespaceName,
            threshold: this.compactionThreshold,
          })

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
      console.log(this.autoUpdateSchema)
      console.log(this.compatCheck)
      console.log(this.enforceValidation)
      try {
        await AjaxService.ajaxAction('update_namespace_schema',
          {
            dataCenter: this.activeCluster,
            tenant: this.tenant,
            namespace: namespaceName,
            autoUpdateSchema: this.autoUpdateSchema,
            compatCheck: this.compatCheck.id,
            enforceValidation: this.enforceValidation,
          })

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
  color: #C5A54E;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
