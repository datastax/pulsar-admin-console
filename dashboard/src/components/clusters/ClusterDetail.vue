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
    <div class="cluster-details" id="cluster-details">
        <div class="va-row">
            <div class="flex xs12 md12">
            <div class="flex md12">
                <button class="btn btn-micro btn-right">
                <span
                    class="fa fa-refresh"
                    style="`font-size: 30px`"
                    aria-hidden="true"
                    @click="getData()"
                />
                </button>
            </div>
                <alert ref="alert" :errorText="errorText"></alert>

                <vuestic-widget headerText="Runtime Configuration">
                    <div class="flex md12">
                        <div class="va-row" v-if="clusterConfig.dispatchThrottlingRatePerTopicInMsg">
                                <div class="va-row">
                                    <div v-for="statKey in clusterConfigKeys" :key="statKey" class="flex md3">
                                        <div class="form-group">
                                            <div class="input-group">
                                            <input :value="getHumanReadable(statKey, clusterConfig[statKey])" :id="statKey" :name="statKey"
                                                class="has-value" placeholder="" readonly />
                                            <label class="control-label" :for="statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div v-else>
                          Loading...
                        </div>
                    </div>

                </vuestic-widget>
    </div>
</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import ApiService from '@/services/ApiService'

export default {
  name: 'ClusterDetails',
  mixins: [mixins],
  data () {
    return {
      errorText: 'Something went wrong',
      clusterConfig: {},
      // clusterConfigKeys: [
      //     'dispatchThrottlingRatePerTopicInMsg',
      // ],
    }
  },
  computed: {
    ...mapGetters([
      'isAdminUser',
      'activeCluster'
    ]),
    clusterConfigKeys () {
      return Object.keys(this.clusterConfig)
    }
  },
  components: {
    Alert,
  },
  mounted () {
    this.getData()
  },
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    onLoad () {

    },
    getData () {
      if (this.isAdminUser) {
        this.getClusterConfig()
      }
    },
    async getClusterConfig () {
      let cluster = this.activeCluster

      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        const response = await ApiService.getClusterConfig(cluster)

        if (response) {
          this.clusterConfig = response.data
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Retrieving running cluster config: ${cluster}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    }
  }
}
</script>

<style>

</style>
