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
    <div class="namespace-bundles">

        <alert ref="alert" :errorText="errorText"></alert>

        <div class="va-row" v-if="namespacesConfig.data[$route.params.id]">

            <div class="flex xs12 md12">
                <vuestic-widget>

                  <div class="va-row">
                            <div class="flex md3">
                                <div class="form-group">
                                    <div class="input-group">
                                        <input v-model="namespacesConfig.data[$route.params.id].bundles.numBundles" id="num-bundles" name="num-bundles"
                                        class="has-value" placeholder="" readonly />
                                        <label class="control-label" for="numBunles" role="button">Number of Bundles</label><i class="bar"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <div class="table-responsive">
                        <table class="table table-striped first-td-padding table-header-active">
                        <thead>
                        <tr>
                            <td>Bundle</td>
                            <td></td>
                          
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(bundle) in sortedList" :key="bundle">
                            <td>{{ bundle }}
                                <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="bundle"
                            v-clipboard:success="onCopy" v-clipboard:error="onError">
                            </i>
                            </td>
                            <td>
                                <button :disabled="unloading === bundle" class="btn btn-primary btn-micro btn-bottom-margin" @click="unloadBundle(bundle)">Unload</button>
                                <button :disabled="splitting === bundle" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmSplitBundle(bundle)">Split</button>
                                <button v-if="enableDelete" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmDeleteBundle(bundle)">Delete</button>
                            </td>
            
                            </tr>
                        </tbody>
                        </table>
                        <v-page
                            :total-row="totalRow"
                            v-model="currentPage"
                            align="center"
                            :pageSizeMenu="pageSizeMenu"
                            @page-change="pageChange"
                        ></v-page>

                    </div>
                    <vuestic-modal ref="splitBundleModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="splitBundle()"
                                            v-on:cancel="bundleToOperateOn=''"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Split Bundle</div>

                                <vuestic-simple-select
                                  label="Split Strategy"
                                  v-model="splitStrategy"
                                  name="split-strategy"
                                  :options="splitStrategyList"
                                  option-key="name"
                                  ref="split-strategy"
                                  :clearable="false"
                                  >
                                </vuestic-simple-select>
                                <div  class="va-row">
                                  <vuestic-checkbox label="Unload After Split" v-model="unloadAfterSplit">
                                  </vuestic-checkbox>
                                </div>

                                <div>
                                    Are you sure you want to split bundle {{ bundleToOperateOn }}?
                                </div>
                    </vuestic-modal>
                    <vuestic-modal ref="deleteBundleModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="deleteBundle()"
                                            v-on:cancel="bundleToOperateOn=''"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Delete Bundle</div>

                                <div>
                                    Are you sure you want to delete bundle {{ bundleToOperateOn }}?
                                </div>
                    </vuestic-modal>
                    </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApiService from '@/services/ApiService'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import lodash from 'lodash'
import FilterBar
  from '../../vuestic-theme/vuestic-components/vuestic-datatable/datatable-components/FilterBar.vue'

export default {
  name: 'TopicSubscriptionTab',
  mixins: [mixins],
  components: {
    FilterBar,
    Alert
  },
  computed: {
    ...mapGetters([
      'namespacesConfig',
      'tenant',
      'activeCluster'
    ]),
    isFormValid () {
      // return Object.keys(this.formFields).every(key => this.formFields[key].valid);
      return Object.keys(this.formKeysToValidate).every(key => this.formFields[key].valid)
    },
    isCreateFormValid () {
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
    sortedList () {

      let bundleList = new Array()

      let begin = ''
      let end = ''

      const boundaries = this.namespacesConfig.data[this.$route.params.id].bundles.boundaries

      // Create bundles from the boundaries
      boundaries.forEach(boundary => {
        
        if (begin === '') {
          begin = boundary
        } else if (end === '') {
          end = boundary
        }

        if (begin !== '' && end !== '') {
          bundleList.push(begin + "_" + end)
          begin = end
          end = ''
        }
      });

      this.totalRow = bundleList.length

        return bundleList.sort((a,b) => {
                let modifier = 1
                if(this.sortDir === 'desc') modifier = -1
                let c = a[this.sortBy]
                let d = b[this.sortBy]
                // Treat nulls as empty string 
                if (c===null || c === undefined) c=''
                if (d===null || d === undefined) d=''
                if(c < d) return -1 * modifier
                if(c > d) return 1 * modifier
                return 0
            }).filter((row, index) => {
                let start = (this.currentPage-1)*this.pageSize;
                let end = this.currentPage*this.pageSize;
                if(index >= start && index < end) return true;
            })
    }
  },
  data () {
    return {
      isDeleted: '',
      errorText: 'Something went wrong',
      showBundleModal: false,
      bundleToOperateOn: '',
      unloading: '',
      splitting: '',
      sortBy: 'subscriptionName',
      sortDir: 'asc',
      pageSize: 10,
      pageSizeMenu: [10, 20, 50, 100],
      currentPage: 1,
      totalRow: 0,
      enableDelete: false,
      unloadAfterSplit: false,
      splitStrategy: { id: 'range_equally_divide', name: 'Range Equally Divide' },
      splitStrategyList: [
        { id: 'range_equally_divide', name: 'Range Equally Divide'},
        { id: 'topic_count_equally_divide', name: 'Topic Count Equally Divide'},
      ],
    }
  },
  methods: {
    clearAll () {
      this.nameFilter = ''
      this.typeFilter = ''
    },
    sort (s) {
        //if s == current sort, reverse
        if(s === this.sortBy) {
        this.sortDir = this.sortDir==='asc'?'desc':'asc';
        }
        this.sortBy = s;
    },
    addSortClass (field) {
        let classArray = [ 'sortable']
        if (this.sortBy === field) {
            classArray.push('sortField')
            if (this.sortDir === 'desc') {
                classArray.push('headerSortDown')
            } else {
                classArray.push('headerSortUp')
            }
        }
        return classArray
    },
    pageChange(pInfo) {
        this.currentPage = pInfo.pageNumber
        this.pageSize = pInfo.pageSize
    },
    confirmSplitBundle (bundle) {
      this.bundleToOperateOn = bundle
      this.$refs.splitBundleModal.open()
    },
    confirmDeleteBundle (bundle) {
      this.bundleToOperateOn = bundle
      this.$refs.deleteBundleModal.open()
    },
    showBundle (subscription, namespaceInfo) {
      let showBundle = true

      if (this.nameFilter) {
        if (subscription.toUpperCase().search(this.nameFilter.toUpperCase()) === -1) {
          showBundle = false
        }
      }

      if (this.typeFilter) {
        if (namespaceInfo.type !== this.typeFilter) {
          showBundle = false
        }
      }

      return showBundle
    },
    async unloadBundle (bundle) {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      this.unloading = bundle

      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName    
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.unloadBundle(this.activeCluster, namespacePath, bundle)
        this.onSuccess('Unloaded bundle')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Unloading bundle: ${this.bundleToOperateOn}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()
      } finally {
        this.unloading = ''
      }
    },
    async splitBundle (bundle) {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      this.splitting = this.bundleToOperateOn

      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName    
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.splitBundle(this.activeCluster, namespacePath, this.bundleToOperateOn, this.splitStrategy.id, this.unloadAfterSplit)
        this.onSuccess('Split bundle')
        // Update namespace info
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Splitting bundle: ${this.bundleToOperateOn}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()
      } finally {
        this.splitting = ''
      }
    },
    async deleteBundle (bundle) {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()

      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + "/" + namespaceName    
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.deleteBundle(this.activeCluster, namespacePath, this.bundleToOperateOn)
        this.onSuccess('Delete bundle')
        // Update namespace info
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Delete bundle: ${this.bundleToOperateOn}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
  }
}
</script>

<style lang='scss'>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.btn-bottom-margin {
    margin-bottom: 10px;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
{
  opacity: 0
}

.filters-page {
  &__tags {
    display: flex;
  }
  &__filter-bar {
    width: 300px;
  }
  &__filter-bar-container {
    margin: 0;
    justify-content: space-between;
  }
  &__table-heading {
    color: $brand-primary
  }
  &__collapse {
    .vuestic-collapse__body {
      background-color: white;
    }
  }
  &__clear-all-text {
    cursor: pointer;
    color: $brand-primary;
    margin-top: 0.3rem;
  }
}

input[type=text] {
    background: transparent;
}

.sortField {
    background-color: #eff4f5;
}
.sortable {
    text-decoration: underline;
}
.headerSortDown:after,
.headerSortUp:after{
    content: ' ';
    position: relative;
    left: 10px;
    border: 7px solid transparent;
}
.headerSortDown:after{
    top: 10px;
    border-top-color: silver;
}
.headerSortUp:after{
    bottom: 15px;
    border-bottom-color: silver;
}
.headerSortDown,
.headerSortUp{
    padding-left: 20px;
}
</style>
