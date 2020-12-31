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
    <div class="source-instances">
        <alert ref="alert" :errorText="errorText"></alert>
        <vuestic-modal ref="stopInstanceModal"
                        :okText="'modal.confirm' | translate"
                        v-on:ok="stopInstance()"
                        v-on:cancel="instanceToChange=''"
                        :cancelText="'modal.cancel' | translate">
            <div slot="title">Stop Instance</div>
            <div>
                Are you sure you want to stop instance {{ instanceToChange }}?
            </div>
        </vuestic-modal>
        <vuestic-modal ref="startInstanceModal"
                        :okText="'modal.confirm' | translate"
                        v-on:ok="startInstance()"
                        v-on:cancel="instanceToChange=''"
                        :cancelText="'modal.cancel' | translate">
            <div slot="title">Start Instance</div>
            <div>
                Are you sure you want to start instance {{ instanceToChange }}?
            </div>
        </vuestic-modal>
        <vuestic-modal ref="restartInstanceModal"
                        :okText="'modal.confirm' | translate"
                        v-on:ok="restartInstance()"
                        v-on:cancel="instanceToChange=''"
                        :cancelText="'modal.cancel' | translate">
            <div slot="title">Restart Instance</div>
            <div>
                Are you sure you want to restart instance {{ instanceToChange }}?
            </div>
        </vuestic-modal>
        <vuestic-modal ref="stopAllInstancesModal"
                        :okText="'modal.confirm' | translate"
                        v-on:ok="stopAllInstances()"
                        :cancelText="'modal.cancel' | translate">
            <div slot="title">Stop All Instances</div>
            <div>
                Are you sure you want to stop all instances?
            </div>
        </vuestic-modal>
        <vuestic-modal ref="startAllInstancesModal"
                        :okText="'modal.confirm' | translate"
                        v-on:ok="startAllInstances()"
                        :cancelText="'modal.cancel' | translate">
            <div slot="title">Start All Instances</div>
            <div>
                Are you sure you want to start all instances?
            </div>
        </vuestic-modal>
        <vuestic-modal ref="restartAllInstancesModal"
                        :okText="'modal.confirm' | translate"
                        v-on:ok="restartAllInstances()"
                        :cancelText="'modal.cancel' | translate">
            <div slot="title">Restart All Instances</div>
            <div>
                Are you sure you want to restart all instances?
            </div>
        </vuestic-modal>
        <div class="va-row">
            <div class="flex md12">
                <vuestic-widget v-if="sourcesData.status[$route.params.id]">
                    <div class="va-row">
                        <div class="flex md12">
                            <div class="va-row">
                                <div v-for="statKey in narrowCopyKeys" :key="statKey" class="flex md6">
                                    <div  class="form-group with-icon-right">
                                        <div class="input-group" >
                                        <input :value="getHumanReadable(statKey, sourcesData.status[$route.params.id][statKey])" :id="'source-'+statKey" :name="'source-'+statKey"
                                            class="has-value" placeholder="" readonly />
                                        <label class="control-label" :for="'source-'+statKey" role="button">{{ convertCamelCaseToTitleCase(statKey) }}</label><i class="bar"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="va-row">
                                <button class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmStopAllInstances()">Stop All</button>
                                <button class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmStartAllInstances()">Start All</button>
                                <button class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmRestartAllInstances()">Restart All</button>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-striped first-td-padding table-header-active">
                                    <thead>
                                    <tr>
                                        <td></td>
                                        <td>Instance ID</td>
                                        <td v-for="cell in instanceStatusKeys" :key="cell">
                                                    {{ convertCamelCaseToTitleCase(cell)}}
                                        </td>

                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr v-for="(inputInfo, index) in sourcesData.status[$route.params.id].instances" :key="inputInfo.instanceId">
                                               <td>
                                                    <button v-show="sourcesData.status[$route.params.id].instances[index].status.running" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmStopInstance(inputInfo.instanceId)">Stop</button>
                                                    <button v-show="!sourcesData.status[$route.params.id].instances[index].status.running" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmStartInstance(inputInfo.instanceId)">Start</button>
                                                    <button v-show="sourcesData.status[$route.params.id].instances[index].status.running" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmRestartInstance(inputInfo.instanceId)">Restart</button>
                                               </td>
                                                <td>{{inputInfo.instanceId}}
                                                </td>
                                                <td v-for="cell in instanceStatusKeys" :key="cell">
                                                    {{ getHumanReadable(cell, inputInfo.status[cell])}}
                                                </td>
                                            </tr>
                                    </tbody>
                                </table>
                            </div>
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
  name: 'SourceInstances',
  mixins: [mixins],
  data () {
    return {
      errorText: '',
      instanceToChange: '',
      instanceStatusKeys: [
        'running',
        'error',
        'numRestarts',
        'numReceivedFromSource',
        'numSystemExceptions',
        'latestSystemExceptions',
        'latestSourceExceptions',
        'numSourceExceptions',
        'numWritten',
        'lastReceivedTime',
        'workerId'
      ],
      narrowCopyKeys: [
        'numInstances',
        'numRunning',
      ],
    }
  },
  computed: {
    ...mapGetters([
      'sourcesData'
    ]),
  },
  components: {
    Alert,
  },
  mounted () {
  },
  methods: {
    confirmStopInstance (instance) {
      this.instanceToChange = instance
      this.$refs.stopInstanceModal.open()
    },
    confirmStartInstance (instance) {
      this.instanceToChange = instance
      this.$refs.startInstanceModal.open()
    },
    confirmRestartInstance (instance) {
      this.instanceToChange = instance
      this.$refs.restartInstanceModal.open()
    },
    confirmStopAllInstances () {
      this.$refs.stopAllInstancesModal.open()
    },
    confirmStartAllInstances () {
      this.$refs.startAllInstancesModal.open()
    },
    confirmRestartAllInstances () {
      this.$refs.restartAllInstancesModal.open()
    },
    async stopInstance () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      const instanceId = this.instanceToChange
      const sourcePath = this.sourcesData.data[this.$route.params.id].path
      const cluster = this.sourcesData.data[this.$route.params.id].cluster
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.stopSourceInstance(cluster, sourcePath, instanceId)
        // Force an update to the topic immediately
        this.$store.dispatch('updateSource', this.sourcesData.data[this.$route.params.id])

        this.onSuccess('Stopped instance')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Stopping instance: ${instanceId}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = ''
        this.subToDelete = ''
      }
    },
    async startInstance () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      const instanceId = this.instanceToChange
      const sourcePath = this.sourcesData.data[this.$route.params.id].path
      const cluster = this.sourcesData.data[this.$route.params.id].cluster
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.startSourceInstance(cluster, sourcePath, instanceId)
        // Not going to force an update because the state is temporarily messed up while starting
        // this.$store.dispatch('updateSource', this.sourcesData.data[this.$route.params.id])

        this.onSuccess('Started instance')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Starting instance: ${instanceId}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = ''
        this.subToDelete = ''
      }
    },
    async restartInstance () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      const instanceId = this.instanceToChange
      const sourcePath = this.sourcesData.data[this.$route.params.id].path
      const cluster = this.sourcesData.data[this.$route.params.id].cluster
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.restartSourceInstance(cluster, sourcePath, instanceId)
        // Not going to force an update because the state is temporarily messed up while starting
        // this.$store.dispatch('updateSource', this.sourcesData.data[this.$route.params.id])

        this.onSuccess('Restarted instance')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Restarting instance: ${instanceId}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = ''
        this.subToDelete = ''
      }
    },
    async stopAllInstances () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      const sourcePath = this.sourcesData.data[this.$route.params.id].path
      const cluster = this.sourcesData.data[this.$route.params.id].cluster
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.stopAllSourceInstances(cluster, sourcePath)
        // Force an update to the topic immediately
        this.$store.dispatch('updateSource', this.sourcesData.data[this.$route.params.id])

        this.onSuccess('Stopped instances')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Stopping all instances. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = ''
        this.subToDelete = ''
      }
    },
    async startAllInstances () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      const sourcePath = this.sourcesData.data[this.$route.params.id].path
      const cluster = this.sourcesData.data[this.$route.params.id].cluster
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.startAllSourceInstances(cluster, sourcePath)
        // Force an update to the topic immediately
        this.$store.dispatch('updateSource', this.sourcesData.data[this.$route.params.id])

        this.onSuccess('Started instances')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Starting all instances. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = ''
        this.subToDelete = ''
      }
    },
    async restartAllInstances () {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      const sourcePath = this.sourcesData.data[this.$route.params.id].path
      const cluster = this.sourcesData.data[this.$route.params.id].cluster
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.restartAllSourceInstances(cluster, sourcePath)
        // Force an update to the topic immediately
        this.$store.dispatch('updateSource', this.sourcesData.data[this.$route.params.id])
        this.onSuccess('Restarted instances')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Restarting all instances. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
        // If the call fails, release the delete button
        this.isDeleted = ''
        this.subToDelete = ''
      }
    },
  }
}
</script>

<style scoped>

</style>
