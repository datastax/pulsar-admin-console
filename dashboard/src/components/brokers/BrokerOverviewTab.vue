<template>
    <div class="broker-overview">


        <alert ref="alert" :errorText="errorText"></alert>

        <div class="va-row">

           <div class="flex xs12 md12">
                <vuestic-widget>

                   <div class="va-row">
                        <div class="flex md4">
                          <div class="form-group">
                                <div class="input-group">
                                    <input :value="this.brokerLoadData[this.$route.params.id].data.brokerVersionString" id="broker-ver" name="broker-ver"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="broker-ver" role="button">Broker Version</label><i class="bar"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="this.brokerLoadData[this.$route.params.id].data.bandwidthIn.limit | humanBytes" id="bw-in-limit" name="bw-in-limit"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="bw-in-limit" role="button">Bandwidth In Limit</label><i class="bar"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="this.brokerLoadData[this.$route.params.id].data.bandwidthOut.limit | humanBytes" id="bw-out-limit" name="bw-out-limit"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="bw-out-limit" role="button">Bandwidth Out Limit</label><i class="bar"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="this.brokerLoadData[this.$route.params.id].data.cpu.limit + '%'" id="cpu-limit" name="cpu-limit"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="cpu-limit" role="button">CPU Limit</label><i class="bar"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="this.brokerLoadData[this.$route.params.id].data.memory.limit * 1000 * 1000| humanBytes" id="mem-limit" name="mem-limit"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="mem-limit" role="button">Memory Limit</label><i class="bar"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <input :value="this.brokerLoadData[this.$route.params.id].data.directMemory.limit *1000 *1000 | humanBytes" id="dir-mem-limit" name="dir-mem-limit"
                                    class="has-value" placeholder="" readonly />
                                    <label class="control-label" for="dir-mem-limit" role="button">Direct Memory Limit</label><i class="bar"></i>
                                </div>
                            </div>
                            
                        </div>
            <div class="flex md4">
              
              
                  

                

                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner has-chart">
                      <div class="stats">
                        <div class="stats-number">
                          {{ brokerLoadData[this.$route.params.id].data.cpu.usage | numberSeparate }}%
                        </div>
                        <div class="stats-title">CPU</div>
                      </div>
                      <div class="chart-container">
                        <vuestic-progress-bar type="vertical" :value="Math.round(brokerLoadData[this.$route.params.id].data.cpu.usage/brokerLoadData[this.$route.params.id].data.cpu.limit * 100)" :animated="animated" theme="Primary"
                                              backgroundTheme="White"/>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>

                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner has-chart">
                      <div class="stats">
                        <div class="stats-number">
                          {{ brokerLoadData[this.$route.params.id].data.memory.usage * 1000 * 1000| humanBytes }}
                        </div>
                        <div class="stats-title">Memory</div>
                      </div>
                      <div class="chart-container">
                        <vuestic-progress-bar type="vertical" :value="Math.round(brokerLoadData[this.$route.params.id].data.memory.usage/brokerLoadData[this.$route.params.id].data.memory.limit * 100)" :animated="animated" theme="Primary"
                                              backgroundTheme="White"/>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>


                <vuestic-widget class="info-widget">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner has-chart">
                      <div class="stats">
                        <div class="stats-number">
                          {{ brokerLoadData[this.$route.params.id].data.directMemory.usage * 1000 * 1000 | humanBytes }}
                        </div>
                        <div class="stats-title">Direct Memory</div>
                      </div>
                      <div class="chart-container">
                        <vuestic-progress-bar type="vertical" :value="Math.round(brokerLoadData[this.$route.params.id].data.directMemory.usage/brokerLoadData[this.$route.params.id].data.directMemory.limit * 100)" :animated="animated" theme="Primary"
                                              backgroundTheme="White"/>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>
                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner has-chart">
                      <div class="stats">
                        <div class="stats-number">
                          {{ brokerLoadData[this.$route.params.id].data.bandwidthIn.usage | humanBytes }}
                        </div>
                        <div class="stats-title">In (/s) </div>
                      </div>
                      <div class="chart-container">
                        <vuestic-progress-bar type="vertical" :value="Math.round(brokerLoadData[this.$route.params.id].data.bandwidthIn.usage/brokerLoadData[this.$route.params.id].data.bandwidthIn.limit * 100)" :animated="animated" theme="Primary"
                                              backgroundTheme="White"/>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>

                <vuestic-widget class="info-widget brand-info">
                  <div class="info-widget-inner">
                    <div class="info-widget-inner has-chart">
                      <div class="stats">
                        <div class="stats-number">
                          {{ brokerLoadData[this.$route.params.id].data.bandwidthOut.usage | humanBytes }}
                        </div>
                        <div class="stats-title">Out (/s) </div>
                      </div>
                      <div class="chart-container">
                        <vuestic-progress-bar type="vertical" :value="Math.round(brokerLoadData[this.$route.params.id].data.bandwidthOut.usage/brokerLoadData[this.$route.params.id].data.bandwidthOut.limit * 100)" :animated="animated" theme="Primary"
                                              backgroundTheme="White"/>
                      </div>
                    </div>
                  </div>
                </vuestic-widget>

            
                
              </div>


              <div class="flex md4">
               

            <div class="va-row">
              <div class="flex md6">
                      <vuestic-widget class="info-widget">
                        <div class="info-widget-inner">
                          <div class="stats">
                            <div class="stats-number">
                              {{ brokerLoadData[this.$route.params.id].data.numProducers}}
                            </div>
                            <div class="stats-title">Producers</div>
                          </div>
                        </div>
                      </vuestic-widget>
                       <vuestic-widget class="info-widget">
                      <div class="info-widget-inner">
                        <div class="stats">
                          <div class="stats-number">
                            {{ brokerLoadData[this.$route.params.id].data.numBundles}}
                          </div>
                          <div class="stats-title">Bundles</div>
                        </div>
                      </div>
                    </vuestic-widget>
              </div>
                    <div class="flex md6">
                      <vuestic-widget class="info-widget">
                      <div class="info-widget-inner">
                        <div class="stats">
                          <div class="stats-number">
                            {{ brokerLoadData[this.$route.params.id].data.numConsumers}}
                          </div>
                          <div class="stats-title">Consumers</div>
                        </div>
                      </div>
                    </vuestic-widget>
                   
                    </div>
            </div>

             <vuestic-widget class="info-widget brand-info">
                <div class="info-widget-inner">
                  <div class="stats">
                    <div class="stats-number">
                      {{ brokerLoadData[this.$route.params.id].data.msgRateIn |  numberSeparate()}}
                    </div>
                    <div class="stats-title">Rate In (msg/s)</div>
                  </div>
                </div>
              </vuestic-widget>
              <vuestic-widget class="info-widget brand-info">
              <div class="info-widget-inner">
                <div class="stats">
                  <div class="stats-number">
                    {{ brokerLoadData[this.$route.params.id].data.msgRateOut |  numberSeparate()}}
                  </div>
                  <div class="stats-title">Rate Out (msg/s)</div>
                </div>
              </div>
            </vuestic-widget>


              </div>

        </div>

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
  name: 'BrokerOverviewTab',
  mixins: [mixins],
  components: {
    FilterBar,
    Alert
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig',
      'brokerLoadData',
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

      const brokerDataList =  this.brokerLoadData[this.$route.params.id].data.bundleStats
      console.log("Broker data List")
      console.log(brokerDataList)

      let bundleList = new Array

      const brokerKeys = Object.keys(brokerDataList)
      brokerKeys.forEach(element => {
        let bundleInfo =  brokerDataList[element]
        bundleInfo.name = element
        bundleList.push(bundleInfo)
        
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
    },
  },
  data () {
    return {
      errorText: 'Something went wrong',
      sortBy: 'name',
      sortDir: 'asc',
      pageSize: 10,
      pageSizeMenu: [10, 20, 50, 100],
      currentPage: 1,
      totalRow: 0,
      unloading: '',
      splitting: '',
      animated: true,
      bundleToOperateOn: '',
      bundlePath: '',
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
    confirmSplitBundle (bundlePath) {
      const bundleParts = bundlePath.split('/')
      this.bundlePath = bundleParts[0] + "/" + bundleParts[1]    
      this.bundleToOperateOn = bundleParts[2]
      this.$refs.splitBundleModal.open()
    },
    async unloadBundle (bundlePath) {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      this.unloading = bundlePath

      const bundleParts = bundlePath.split('/')
      const namespacePath = bundleParts[0] + "/" + bundleParts[1]    
      const bundle = bundleParts[2]
      // Wait for the API call to return, then update the topic so the user gets feedback
      try {
        await ApiService.unloadBundle(this.activeCluster, namespacePath, bundle)
        this.onSuccess('Unloaded bundle')
        this.$store.dispatch('getBrokerLoadReport')

      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Unloading bundle: ${this.bundleToOperateOn}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()
      } finally {
        this.unloading = ''
      }
    },
    async splitBundle (bundlePath) {
      // If alert is shown, hide it
      this.$refs.alert.hideAlert()
      this.splitting = bundlePath

      try {
        await ApiService.splitBundle(this.activeCluster, this.bundlePath, this.bundleToOperateOn, this.splitStrategy.id, this.unloadAfterSplit)
        this.onSuccess('Split bundle')
        // Update namespace info
        this.$store.dispatch('getBrokerLoadReport')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Splitting bundle: ${this.bundleToOperateOn}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()
      } finally {
        this.splitting = ''
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
