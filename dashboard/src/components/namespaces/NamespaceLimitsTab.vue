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
    <div class="namespace-limits">

            <vuestic-widget>

                <alert ref="alert" :errorText="errorText"></alert>

                <vuestic-modal ref="updateProdConLimitsModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateProdConLimits()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Producer and Consumer Limits</div>

                    <p>Set value to 0 for unlimited.</p>

                    <div class="form-group">
                      <div class="input-group">
                        <input id="maxProducers"
                          name="maxProducers"
                          ref="maxProducers"
                          v-model="maxProducers"
                          v-validate="'required|numeric'"
                          required
                        />
                        <label class="control-label" for="maxProducers">Maximum Producers Per Topic</label><i class="bar"></i>
                        <small v-show="errors.has('maxProducers')"
                             class="help text-danger">
                        {{ errors.first('maxProducers') }}
                      </small>
                      </div>
                  </div>

                  <div class="form-group">
                      <div class="input-group">
                        <input id="maxConsTopic"
                          name="maxConsTopic"
                          ref="maxConsTopic"
                          v-model="maxConsTopic"
                          v-validate="'required|numeric'"
                          required
                        />
                        <label class="control-label" for="Write">Maximum Consumers Per Topics</label><i class="bar"></i>
                        <small v-show="errors.has('maxConsTopic')"
                             class="help text-danger">
                        {{ errors.first('maxConsTopic') }}
                      </small>
                      </div>
                  </div>

                  <div class="form-group">
                      <div class="input-group">
                        <input id="maxConsSub"
                          name="maxConsSub"
                          ref="maxConsSub"
                          v-model="maxConsSub"
                          v-validate="'required|numeric'"
                          required
                        />
                        <label class="control-label" for="Write">Maximum Consumers Per Subscription</label><i class="bar"></i>
                        <small v-show="errors.has('maxConsSub')"
                             class="help text-danger">
                        {{ errors.first('maxConsSub') }}
                      </small>
                      </div>
                  </div>

                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update producer and consumer limits on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <vuestic-modal  ref="updateTopicDispatchModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceTopicDispatchRate()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Topic Dispatch Rate</div>

                  <p>
                    You can limit topic dispatch by message rate, byte rate, or both. Set to 0 to disable dispatch by message rate or byte rate. To completely disable topic dispatch limiting, select the checkbox.
                  </p>
                  <div  class="va-row">
                      <vuestic-checkbox label="Disable Topic Dispatch Limiting" v-model="disableTopicDispatch">
                      </vuestic-checkbox>
                    </div>

                  <div v-if="disableTopicDispatch === false" class="va-row">
                    <div class="form-group">
                        <div class="input-group">
                          <input id="topicDispatchMsgInput"
                            name="topicDispatchMsg"
                            ref="topicDispatchMsg"
                            v-model="topicDispatchMsg"
                            v-validate="'required|integer'"
                            required
                          />
                          <label class="control-label" for="Write">Message Rate</label><i class="bar"></i>
                          <small v-show="errors.has('topicDispatchMsg')"
                               class="help text-danger">
                          {{ errors.first('topicDispatchMsg') }}
                        </small>
                        </div>
                    </div>
                  </div>
                  <div v-if="disableTopicDispatch === false" class="flex va-row">
                      <div class="form-group">
                        
                        <div class="input-group">
                          <input id="topicDispatch"
                            name="Topic Dispatch"
                            ref="topicDispatch"
                            v-model="topicDispatchByteDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateTopicDispatchByte"
                            required
                          />
                          <label class="control-label" for="namespaceName">Byte Rate</label><i class="bar"></i>
                          <small v-show="errors.has('Topic Dispatch')"
                               class="help text-danger">
                          {{ errors.first('Topic Dispatch') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="Unit"
                              v-model="unit"
                              name="topic-dispatch-unit"
                              :options="unitLists"
                              option-key="name"
                              v-on:input="updateTopicDispatchByteDisplay"
                              ref="topic-dispatch-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update topic dispatch rate on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>



                   <vuestic-modal  ref="updateSubscriptionDispatchModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceSubscriptionDispatchRate()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Subscription Dispatch Rate</div>

                  <p>
                    You can limit subscription dispatch by message rate, byte rate, or both. Set to 0 to disable dispatch by message rate or byte rate. To completely disable subscription dispatch limiting, select the checkbox.
                  </p>
                  <div  class="va-row">
                      <vuestic-checkbox label="Disable Subscription Dispatch Limiting" v-model="disableSubscriptionDispatch">
                      </vuestic-checkbox>
                    </div>

                  <div v-if="disableSubscriptionDispatch === false" class="va-row">
                    <div class="form-group">
                        <div class="input-group">
                          <input id="subscriptionDispatchMsgInput"
                            name="subscriptionDispatchMsg"
                            ref="subscriptionDispatchMsg"
                            v-model="subscriptionDispatchMsg"
                            v-validate="'required|integer'"
                            required
                          />
                          <label class="control-label" for="Write">Message Rate</label><i class="bar"></i>
                          <small v-show="errors.has('subscriptionDispatchMsg')"
                               class="help text-danger">
                          {{ errors.first('subscriptionDispatchMsg') }}
                        </small>
                        </div>
                    </div>
                  </div>
                  <div v-if="disableSubscriptionDispatch === false" class="flex va-row">
                      <div class="form-group">
                        
                        <div class="input-group">
                          <input id="subscriptionDispatch"
                            name="Subscription Dispatch"
                            ref="subscriptionDispatch"
                            v-model="subscriptionDispatchByteDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateSubscriptionDispatchByte"
                            required
                          />
                          <label class="control-label" for="namespaceName">Byte Rate</label><i class="bar"></i>
                          <small v-show="errors.has('Subscription Dispatch')"
                               class="help text-danger">
                          {{ errors.first('Subscription Dispatch') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="Unit"
                              v-model="unit"
                              name="subscription-dispatch-unit"
                              :options="unitLists"
                              option-key="name"
                              v-on:input="updateSubscriptionDispatchByteDisplay"
                              ref="subscription-dispatch-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update subscription dispatch rate on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <vuestic-modal  ref="updateProducerRateModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceProducerRate()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Producer Rate</div>

                  <p>
                    You can limit producers by message rate, byte rate, or both. Set to 0 to disable dispatch by message rate or byte rate. To completely disable producer rate limiting, select the checkbox.
                  </p>
                  <div  class="va-row">
                      <vuestic-checkbox label="Disable Producer Rate Limiting" v-model="disableProducerRate">
                      </vuestic-checkbox>
                    </div>

                  <div v-if="disableProducerRate === false" class="va-row">
                    <div class="form-group">
                        <div class="input-group">
                          <input id="producerRateMsgInput"
                            name="producerRateMsg"
                            ref="producerRateMsg"
                            v-model="producerRateMsg"
                            v-validate="'required|integer'"
                            required
                          />
                          <label class="control-label" for="Write">Message Rate</label><i class="bar"></i>
                          <small v-show="errors.has('producerRateMsg')"
                               class="help text-danger">
                          {{ errors.first('producerRateMsg') }}
                        </small>
                        </div>
                    </div>
                  </div>
                  <div v-if="disableProducerRate === false" class="flex va-row">
                      <div class="form-group">
                        
                        <div class="input-group">
                          <input id="producerRate"
                            name="Producer Rate"
                            ref="producerRate"
                            v-model="producerRateByteDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateProducerRateByte"
                            required
                          />
                          <label class="control-label" for="namespaceName">Byte Rate</label><i class="bar"></i>
                          <small v-show="errors.has('Producer Rate')"
                               class="help text-danger">
                          {{ errors.first('Producer Rate') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="Unit"
                              v-model="unit"
                              name="producer-rate-unit"
                              :options="unitLists"
                              option-key="name"
                              v-on:input="updateProducerRateByteDisplay"
                              ref="producer-rate-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update producer rate on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <vuestic-modal  ref="updateTtlModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceTtl()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Time To Live</div>

                  <div  class="va-row">
                      <vuestic-checkbox label="Disable TTL" v-model="disableTtl">
                      </vuestic-checkbox>
                    </div>

                  <div v-if="disableTtl === false" class="flex va-row">
                      <div class="form-group">
                        <div class="input-group">
                          <input id="ttlInput"
                            name="TTL"
                            ref="ttl"
                            v-model="ttlDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateTtlValue"
                            required
                          />
                          <label class="control-label" for="ttl">TTL</label><i class="bar"></i>
                          <small v-show="errors.has('TTL')"
                               class="help text-danger">
                          {{ errors.first('TTL') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="timeUnit"
                              v-model="timeUnit"
                              name="ttl-unit"
                              :options="timeUnitList"
                              option-key="name"
                              v-on:input="updateTtlDisplay"
                              ref="ttl-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    <div>
                        Are you sure you want to update TTL on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <vuestic-modal  ref="updateRetentionModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="updateNamespaceRetention()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Retention</div>

                  <p>
                    You can retain messages by time, size, or both. Set to 0 to disable retention by time or by size. Set to -1 to keep messages forever.
                    To completely disable retention or enable infinite retention, select the appropriate checkbox.
                  </p>
                  <p>
                    <em>Note:</em> To retain messages by only size or time, make sure to set the other dimension to -1. For example, to 
                    retain messages for 1 day, set retention time to 1 day and retention size to -1. Setting either time or size to 0 disables retention.
                  </p>
                  <div v-if="!infiniteRetention" class="va-row">
                    <vuestic-checkbox label="Disable Retention Completely (message are kept until acknowledged)" v-model="disableRetention">
                    </vuestic-checkbox>
                  </div>
                  <div v-if="!disableRetention"  class="va-row">
                    <vuestic-checkbox label="Infinite Retention" v-model="infiniteRetention">
                    </vuestic-checkbox>
                  </div>


                  <div v-if="disableRetention === false && infiniteRetention === false" class="flex va-row">
                      <div class="form-group">
                        <div class="input-group">
                          <input id="retentionInput"
                            name="Retention"
                            ref="retention"
                            v-model="retentionTimeDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateRetentionTime"
                            required
                          />
                          <label class="control-label" for="retention">Retention Time</label><i class="bar"></i>
                          <small v-show="errors.has('Retention')"
                               class="help text-danger">
                          {{ errors.first('Retention') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="timeUnit"
                              v-model="timeUnit"
                              name="retention-unit"
                              :options="timeUnitList"
                              option-key="name"
                              v-on:input="updateRetentionTimeDisplay"
                              ref="retention-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                  <div v-if="disableRetention == false && infiniteRetention === false" class="flex va-row">
                      <div class="form-group">
                        <div class="input-group">
                          <input id="retention-size"
                            name="Retention Size"
                            ref="retentionSize"
                            v-model="retentionSizeDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateRetentionSize"
                            required
                          />
                          <label class="control-label" for="retentionSize">Retention Size</label><i class="bar"></i>
                          <small v-show="errors.has('Backlog Limit')"
                               class="help text-danger">
                          {{ errors.first('Retention Size') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="Unit"
                              v-model="unit"
                              name="retention-size-unit"
                              :options="unitLists"
                              option-key="name"
                              v-on:input="updateRetentionSizeDisplay"
                              ref="retention-size-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    <div>
                        Are you sure you want to update retention on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>

                <vuestic-modal ref="updateBacklogModal"
                                :okText="'modal.confirm' | translate"
                                v-on:ok="changeNamespaceBacklog()"
                                :cancelText="'modal.cancel' | translate">

                    <div slot="title">Update Namespace Backlog Settings</div>

                  <div v-if="disableBacklogLimit === false" class="va-row">
                      <vuestic-checkbox label="Reset backlog limit to global default" v-model="deleteBacklogLimit">
                      </vuestic-checkbox>
                    </div>
                     <div v-if="deleteBacklogLimit === false" class="va-row">
                      <vuestic-checkbox label="Disable backlog limit" v-model="disableBacklogLimit">
                      </vuestic-checkbox>
                    </div>
                  <div v-if="deleteBacklogLimit === false && disableBacklogLimit === false" class="flex va-row">
                      <div class="form-group">
                        <div class="input-group">
                          <input id="backlogLimit"
                            name="Backlog Limit"
                            ref="backlogLimit"
                            v-model="backlogLimitDisplay"
                            v-validate="'required|decimal'"
                            v-on:input="updateBacklogLimit"
                            required
                          />
                          <label class="control-label" for="backlogLimit">Backlog Limit</label><i class="bar"></i>
                          <small v-show="errors.has('Backlog Limit')"
                               class="help text-danger">
                          {{ errors.first('Backlog Limit') }}
                        </small>
                        </div>
                      </div>
                    <vuestic-simple-select
                              label="Unit"
                              v-model="unit"
                              name="backlog-unit"
                              :options="unitLists"
                              option-key="name"
                              v-on:input="updateBacklogLimitDisplay"
                              ref="backlog-unit"
                              :clearable="false"
                              >
                    </vuestic-simple-select>
                  </div>
                    <div class="va-row" v-if="deleteBacklogLimit === false && disableBacklogLimit === false">
                      <vuestic-simple-select
                                label="Backlog Exceed Policy"
                                v-model="backlogPolicy"
                                name="backlog-policy"
                                :options="backlogPolicyList"
                                option-key="name"
                                ref="backlog-policy"
                                :clearable="false"
                                >
                      </vuestic-simple-select>
                    </div>
                    
                    <div v-if="namespacesConfig.data[$route.params.id]">
                        Are you sure you want to update backlog settings on namespace {{ namespacesConfig.data[$route.params.id].name }}?
                    </div>
                </vuestic-modal>



                <div class="va-row" v-if="namespacesConfig.data[$route.params.id] && namespacesConfig.data[$route.params.id].cluster === activeCluster">
                    <div class="flex md12">

                                <div class="va-row">
                                    <div class="flex md4">

                                              <div class="form-group with-icon-right">
                                                  <div class="input-group">
                                                      <input :value="ttlHuman" id="ttl" name="ttl"
                                                      class="has-value" placeholder="" readonly />
                                                      <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showTtlModal()"></i>
                                                      <label class="control-label" for="ttl" role="button">{{'forms.inputs.ttl'
                                                      | translate}}</label><i class="bar"></i>
                                                  </div>
                                              </div>
                                                <div class="form-group with-icon-right">
                                                    <div class="input-group">
                                                        <input :value="retentionHuman" id="retention" name="retention"
                                                        class="has-value" placeholder="" readonly />
                                                        <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showRetentionModal()"></i>
                                                        <label class="control-label" for="retention" role="retention">{{'forms.inputs.retention'
                                                        | translate}}</label><i class="bar"></i>
                                                    </div>
                                                </div>

                                        <div class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="storageLimitHuman" id="storgeLimit" name="storageLimit"
                                                class="has-value" placeholder="" readonly />
                                                <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="updateBacklog()">
                                                        </i>
                                                <label class="control-label" for="storageLimit" role="button">Backlog Limit</label><i class="bar"></i>
                                            </div>
                                        </div>
                                        <div class="form-group with-icon-right">
                                            <div class="input-group">
                                                <input :value="storagePolicyHuman" id="storagePolicy" name="storagePolic"
                                                class="has-value" placeholder="" readonly />
                                                <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="updateBacklog()">
                                                        </i>
                                                <label class="control-label" for="storagePolicy" role="button">Backlog Exceed Policy</label><i class="bar"></i>
                                            </div>
                                        </div>

                                           

                                    </div>
                                    <div class="flex md4">

                                          <div class="form-group with-icon-right">
                                              <div class="input-group">
                                                  <input :value="namespacesConfig.data[$route.params.id].max_consumers_per_topic | zeroIsUnlimited " id="maxconsumerstopic" name="maxconsumerstopic"
                                                  class="has-value" placeholder="" readonly />
                                                  <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showProdConLimitsModal()">
                                              </i>
                                                  <label class="control-label" for="maxconsumerstopic" role="button">{{'forms.inputs.maxConsumersTopic'
                                                  | translate}}</label><i class="bar"></i>
                                              </div>
                                          </div>

                                          <div class="form-group with-icon-right">
                                              <div class="input-group">
                                                  <input :value="namespacesConfig.data[$route.params.id].max_consumers_per_subscription | zeroIsUnlimited" id="maxconsumerssub" name="maxconsumerssub"
                                                  class="has-value" placeholder="" readonly />
                                                  <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showProdConLimitsModal()">
                                              </i>
                                                  <label class="control-label" for="maxconsumerssub" role="button">{{'forms.inputs.maxConsumersSub'
                                                  | translate}}</label><i class="bar"></i>
                                              </div>
                                          </div>

                                          <div class="form-group with-icon-right">
                                              <div class="input-group">
                                                  <input :value="namespacesConfig.data[$route.params.id].max_producers_per_topic | zeroIsUnlimited" id="maxproducers" name="maxproducers"
                                                  class="has-value" placeholder="" readonly />
                                                    <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showProdConLimitsModal()">
                                                  </i>
                                                  <label class="control-label" for="maxproducers" role="button">{{'forms.inputs.maxProducers'
                                                  | translate}}</label><i class="bar"></i>
                                              </div>
                                          </div>
                                  </div>

                                        

                                        
                                    <div class="flex md4">

                                      <div v-if="namespacesConfig.data[$route.params.id]" class="form-group with-icon-right">
                                          <div class="input-group">
                                              <input :value="humanProducerRate" id="producerRateMsg" name="producerRateMsg"
                                              class="has-value" placeholder="" readonly />
                                              <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showProducerRateModal()">
                                              </i>
                                              <label class="control-label" for="producerRateMsg" role="button">Producer Rate Limit</label><i class="bar"></i>
                                          </div>
                                      </div>

                                      <div v-if="namespacesConfig.data[$route.params.id]" class="form-group with-icon-right">
                                          <div class="input-group">
                                              <input :value="humanTopicDispatchRate" id="topicDispatchMsg" name="topicDispatchMsg"
                                              class="has-value" placeholder="" readonly />
                                              <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showTopicDispatchModal()">
                                              </i>
                                              <label class="control-label" for="topicDispatchMsg" role="button">Topic Out Rate Limit</label><i class="bar"></i>
                                          </div>
                                      </div>

                                      <div v-if="namespacesConfig.data[$route.params.id]" class="form-group with-icon-right">
                                          <div class="input-group">
                                              <input :value="humanSubscriptionDispatchRate" id="subscriptionDispatchMsg" name="subscriptionDispatchMsg"
                                              class="has-value" placeholder="" readonly />
                                              <i v-if="isAdminUser" class="fa fa-external-link icon-right input-icon pointer" @click="showSubscriptionDispatchModal()">
                                              </i>
                                              <label class="control-label" for="subscriptionDispatchMsg" role="button">Subscription Out Rate Limit</label><i class="bar"></i>
                                          </div>
                                      </div>

                                    </div>
                                </div>

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
  name: 'NamespaceLimitsTab',
  data () {
    return {
      errorText: 'Something went wrong',
      showPersistModal: false,
      showCompactModal: false,
      compactionThreshold: 0,
      compactionThresholdDisplay: 0,
      ttl: 0,
      ttlDisplay: 0,
      retentionTime: 0,
      retentionSize: 0,
      retentionTimeDisplay: 0,
      retentionSizeDisplay: 0,
      disableRetention: false,
      topicDispatchMsg: 0,
      topicDispatchMsgDisplay: 0,
      disableTopicDispatch: false,
      topicDispatchByteDisplay: 0,
      subscriptionDispatchMsg: 0,
      subscriptionDispatchMsgDisplay: 0,
      disableSubscriptionDispatch: false,
      subscriptionDispatchByteDisplay: 0,
      producerRateMsg: 0,
      producerRateMsgDisplay: 0,
      disableProducerRate: false,
      producerRateByteDisplay: 0,
      infiniteRetention: false,
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
      backlogLimit: 0,
      backlogLimitDisplay: 0,
      maxProducers: 0,
      maxConsTopic: 0,
      maxConsSub: 0,
      deleteBacklogLimit: false,
      disableBacklogLimit: false,
      disableTtl: false,
      backlogPolicy: { id: 'producer_request_hold', name: 'Producer request hold' },
      backlogPolicyList: [
        { id: 'producer_request_hold', name: 'Producer request hold'},
        { id: 'producer_exception', name: 'Producer exception'},
        { id: 'consumer_backlog_eviction', name: 'Consumer backlog eviction'},
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

      let retentionSize = 0
      let retentionTime = 0
      if (this.namespacesConfig.data[this.$route.params.id].retention_policies) {
        retentionSize = this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionSizeInMB
        retentionTime = this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionTimeInMinutes
      }

      // If either time or size is 0, then retention is disabled
      if (retentionTime === 0 || retentionSize === 0) {return "Until Acknowledged"}

      // If both are -1, infinite
       if (retentionTime === -1 && retentionSize === -1 ) {return "Forever"}

      // If time is -1, return size
      if (retentionTime === -1) {return this.$options.filters.humanBytes(retentionSize*1000*1000)}

      // If size is -1, return time
      if (retentionSize === -1 ) {return this.$options.filters.humanSeconds(retentionTime*60)}

      return this.$options.filters.humanBytes(retentionSize*1000*1000) + " or " + this.$options.filters.humanSeconds(retentionTime*60)

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
    storagePolicyHuman () {
      if (this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage) {
        const policy = this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage.policy
        const humanName = this.$options.filters.camelcase(policy.replace('_', ' '))
        return humanName
      }
    },
    humanTopicDispatchRate () {
      let msgRate = -1
      let interval = 1
      let byteRate = -1
      // Check for a topic dispatch rate
      if (this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[this.activeCluster]) {
        msgRate = this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[this.activeCluster].dispatchThrottlingRateInMsg
        byteRate = this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[this.activeCluster].dispatchThrottlingRateInByte
        interval = Math.abs(this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[this.activeCluster].ratePeriodInSecond)
      }

      if (msgRate <= 0 && byteRate <= 0) {
        return 'Unlimited'
      }

      let outArray = new Array()

      if (msgRate > 0) {
        outArray.push( Math.round(msgRate / interval) + ' msg/s' ) 
      } 
      if (byteRate > 0) {
        outArray.push( this.$options.filters.humanBytes(Math.round(byteRate / interval)) + '/s' ) 
      } 

      return outArray.join(' or ')

    },
    humanSubscriptionDispatchRate () {
      let msgRate = -1
      let interval = 1
      let byteRate = -1
      // Check for a subscription dispatch rate
      if (this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[this.activeCluster]) {
        msgRate = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[this.activeCluster].dispatchThrottlingRateInMsg
        byteRate = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[this.activeCluster].dispatchThrottlingRateInByte
        interval = Math.abs(this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[this.activeCluster].ratePeriodInSecond)
      }

      if (msgRate <= 0 && byteRate <= 0) {
        return 'Unlimited'
      }

      let outArray = new Array()

      if (msgRate > 0) {
        outArray.push( Math.round(msgRate / interval) + ' msg/s' ) 
      } 
      if (byteRate > 0) {
        outArray.push( this.$options.filters.humanBytes(Math.round(byteRate / interval)) + '/s' ) 
      } 

      return outArray.join(' or ')

    },
    humanProducerRate () {
      let msgRate = -1
      let byteRate = -1
      if (this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[this.activeCluster]) {
        msgRate = this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[this.activeCluster].publishThrottlingRateInMsg
        byteRate = this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[this.activeCluster].publishThrottlingRateInByte
      }

      if (msgRate <= 0 && byteRate <= 0) {
        return 'Unlimited'
      }

      let outArray = new Array()

      if (msgRate > 0) {
        outArray.push( msgRate + ' msg/s' ) 
      } 
      if (byteRate > 0) {
        outArray.push( this.$options.filters.humanBytes(byteRate) + '/s' ) 
      } 

      return outArray.join(' or ')

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
    showProdConLimitsModal () {
      this.maxProducers = this.namespacesConfig.data[this.$route.params.id].max_producers_per_topic
      this.maxConsTopic = this.namespacesConfig.data[this.$route.params.id].max_consumers_per_topic
      this.maxConsSub = this.namespacesConfig.data[this.$route.params.id].max_consumers_per_subscription
      this.$refs.updateProdConLimitsModal.open ()
    },
    showTtlModal () {
      this.ttl = this.namespacesConfig.data[this.$route.params.id].message_ttl_in_seconds
      this.updateTtlDisplay()
      this.$refs.updateTtlModal.open()
    },
    showRetentionModal () {
      if (this.namespacesConfig.data[this.$route.params.id].retention_policies) {
        if (this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionTimeInMinutes >= 0) {
          this.retentionTime = this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionTimeInMinutes * 60
        } else {
          this.retentionTime = -1
          this.timeUnit =  { id: 'seconds', name: 'Sec', convert: 1 }
        }

        if (this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionSizeInMB >= 0) {
          this.retentionSize = this.namespacesConfig.data[this.$route.params.id].retention_policies.retentionSizeInMB * 1000 * 1000
        } else {
          this.retentionSize = -1
          this.unit =  { id: 'bytes', name: 'Bytes', convert: 1 }
        }

      } else {
        this.retentionTime = 0
        this.retentionSize = 0
      }
      this.updateRetentionTimeDisplay()
      this.updateRetentionSizeDisplay()
      this.$refs.updateRetentionModal.open()
    },
    showTopicDispatchModal () {
      if (this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[this.activeCluster]) {
        this.topicDispatchMsg = this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[this.activeCluster].dispatchThrottlingRateInMsg
        this.topicDispatchByte = this.namespacesConfig.data[this.$route.params.id].topicDispatchRate[this.activeCluster].dispatchThrottlingRateInByte

      } else {
        this.topicDispatchMsg = -1
        this.topicDispatchByte = -1
        this.interval = 1
      }
      if (this.topicDispatchByte === -1 ) {
        this.unit =  { id: 'bytes', name: 'Bytes', convert: 1 }
      }
      this.updateTopicDispatchByteDisplay()
      this.$refs.updateTopicDispatchModal.open()
    },
    showSubscriptionDispatchModal () {
      if (this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[this.activeCluster]) {
        this.subscriptionDispatchMsg = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[this.activeCluster].dispatchThrottlingRateInMsg
        this.subscriptionDispatchByte = this.namespacesConfig.data[this.$route.params.id].subscriptionDispatchRate[this.activeCluster].dispatchThrottlingRateInByte

      } else {
        this.subscriptionDispatchMsg = -1
        this.subscriptionDispatchByte = -1
        this.interval = 1
      }
      if (this.subscriptionDispatchByte === -1 ) {
        this.unit =  { id: 'bytes', name: 'Bytes', convert: 1 }
      }
      this.updateSubscriptionDispatchByteDisplay()
      this.$refs.updateSubscriptionDispatchModal.open()
    },
    showProducerRateModal () {
      if (this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[this.activeCluster]) {
        this.producerRateMsg = this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[this.activeCluster].publishThrottlingRateInMsg
        this.producerRateByte = this.namespacesConfig.data[this.$route.params.id].publishMaxMessageRate[this.activeCluster].publishThrottlingRateInByte

      } else {
        this.producerRateMsg = -1
        this.producerRateByte = -1
      }
      if (this.producerRateByte === -1 ) {
        this.unit =  { id: 'bytes', name: 'Bytes', convert: 1 }
      }
      this.updateProducerRateByteDisplay()
      this.$refs.updateProducerRateModal.open()
    },
    updateBacklog () {
      this.backlogLimit = this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage.limit

      // Find current policy on list
      this.backlogPolicy = this.backlogPolicyList.filter(obj => {
        return obj.id === this.namespacesConfig.data[this.$route.params.id].backlog_quota_map.destination_storage.policy
      })[0]
      this.updateBacklogLimitDisplay()
      this.disableBacklogLimit = false
      this.deleteBacklogLimit = false
      this.$refs.updateBacklogModal.open()
    },
    updateCompactThresholdDisplay () {
      this.compactionThresholdDisplay = this.compactionThreshold / this.unit.convert
    },
    updateTopicDispatchByteDisplay () {
      this.topicDispatchByteDisplay = this.topicDispatchByte / this.unit.convert
    },
    updateTopicDispatchByte () {
      this.topicDispatchByte = this.topicDispatchByteDisplay * this.unit.convert
    },
    updateSubscriptionDispatchByteDisplay () {
      this.subscriptionDispatchByteDisplay = this.subscriptionDispatchByte / this.unit.convert
    },
    updateSubscriptionDispatchByte () {
      this.subscriptionDispatchByte = this.subscriptionDispatchByteDisplay * this.unit.convert
    },
    updateProducerRateByteDisplay () {
      this.producerRateByteDisplay = this.producerRateByte / this.unit.convert
    },
    updateProducerRateByte () {
      this.producerRateByte = this.producerRateByteDisplay * this.unit.convert
    },
    updateOffloadThresholdDisplay () {
      this.offloadThresholdDisplay = this.offloadThreshold / this.unit.convert
    },
    updateTtlDisplay () {
      this.ttlDisplay = this.ttl / this.timeUnit.convert
    },
    updateTtlValue () {
      this.ttl = this.ttlDisplay * this.timeUnit.convert
    },
    updateRetentionTimeDisplay () {
      this.retentionTimeDisplay = this.retentionTime / this.timeUnit.convert
    },
    updateRetentionTime () {
      this.retentionTime = this.retentionTimeDisplay * this.timeUnit.convert
    },
    updateRetentionSizeDisplay () {
      this.retentionSizeDisplay = this.retentionSize / this.unit.convert
      console.log(`time: ${this.retentionTime} size: ${this.retentionSize}`)
    },
    updateRetentionSize () {
      this.retentionSize = this.retentionSizeDisplay * this.unit.convert
      console.log(`time: ${this.retentionTime} size: ${this.retentionSize}`)
    },
    updateBacklogLimitDisplay () {
      this.backlogLimitDisplay = this.backlogLimit / this.unit.convert
    },
    updateCompactThreshold () {
      this.compactionThreshold = this.compactionThresholdDisplay * this.unit.convert
    },
    updateOffloadThreshold () {
      this.offloadThreshold = this.offloadThresholdDisplay * this.unit.convert
    },
    updateBacklogLimit () {
      this.backlogLimit = this.backlogLimitDisplay * this.unit.convert
    },
    async updateProdConLimits() {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName
      try {
        await ApiService.updateMaxProducers(this.activeCluster, namespacePath, this.maxProducers)
        await ApiService.updateMaxConsTopic(this.activeCluster, namespacePath, this.maxConsTopic)
        await ApiService.updateMaxConsSub(this.activeCluster, namespacePath, this.maxConsSub)

        this.onSuccess('Backlog updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace backlog: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }

    },
    async updateNamespaceTtl() {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      if (this.disableTtl) {
        this.ttl = 0
      }
      try {
        await ApiService.updateTtl(this.activeCluster, namespacePath, this.ttl)
    
        this.onSuccess('TTL updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace TTL: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }

    },
    async updateNamespaceRetention() {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      console.log(`time: ${this.retentionTime} size: ${this.retentionSize}`)

      let size = this.retentionSize /1000 / 1000
      let time = this.retentionTime/60
      if (this.disableRetention) {
        size = 0
        time = 0
      } else if (this.infiniteRetention) {
        size = -1
        time = -1
      }

      if (size < 0) {size = -1}
      if (time < 0) {time = -1}
      try {
        await ApiService.updateRetention(this.activeCluster, namespacePath, size, time)
    
        this.onSuccess('Retention updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace retention: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }

    },
    
    changeNamespaceBacklog() {
      if (this.deleteBacklogLimit) {
        this.deleteNamespaceBacklog()
      } else if (this.disableBacklogLimit) {
        this.backlogLimit = -1
        this.updateNamespaceBacklog()
      } else {
        this.updateNamespaceBacklog()
      }
    },
    async updateNamespaceBacklog () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName
      try {
        await ApiService.updateNamespaceBacklog(this.activeCluster, namespacePath, this.backlogLimit, this.backlogPolicy.id)

        this.onSuccess('Backlog updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace backlog: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
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
    async updateNamespaceTopicDispatchRate () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      if (this.disableTopicDispatch) {
        this.topicDispatchMsg = -1
        this.topicDispatchByte = -1
        this.interval = -1
      }
      try {
        await ApiService.updateNamespaceTopicDispatchRate(this.activeCluster, namespacePath, this.topicDispatchMsg, this.topicDispatchByte, this.interval)

        this.onSuccess('Topic Dispatch Rate Updated')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace topic dispatch rate: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    async updateNamespaceSubscriptionDispatchRate () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      if (this.disableSubscriptionDispatch) {
        this.subscriptionDispatchMsg = -1
        this.subscriptionDispatchByte = -1
        this.interval = -1
      }
      try {
        await ApiService.updateNamespaceSubscriptionDispatchRate(this.activeCluster, namespacePath, this.subscriptionDispatchMsg, this.subscriptionDispatchByte, this.interval)

        this.onSuccess('Subscription Dispatch Rate Updated')

        // Need to update master list of subscriptions
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace subscription dispatch rate: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    async updateNamespaceProducerRate () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      if (this.disableProducerRate) {
        this.producerRateMsg = -1
        this.producerRateByte = -1
      }
      try {
        await ApiService.updateNamespaceProducerRate(this.activeCluster, namespacePath, this.producerRateMsg, this.producerRateByte)

        this.onSuccess('Producer Rate Updated')

        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Updating namespace producer rate: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    async deleteNamespaceBacklog () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName
      try {
        console.log("In here")
        await ApiService.deleteNamespaceBacklog(this.activeCluster, namespacePath)

        this.onSuccess('Backlog deleted')

        // Need to update master list of topics
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting namespace backlog: ${namespaceName}. Reason: ${reason} (${statusCode})`
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
