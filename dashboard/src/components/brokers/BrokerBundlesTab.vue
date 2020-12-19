<template>
    <div class="broker-bundles">


        <alert ref="alert" :errorText="errorText"></alert>
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

        <div class="va-row">

           <div class="flex xs12 md12">
                <vuestic-widget>

                   <div class="va-row">
                        <div class="flex md3">
                            <div class="form-group">
                                <div class="input-group">
                                    <input v-model="this.brokerLoadData[this.$route.params.id].data.numBundles" id="num-bundles" name="num-bundles"
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
                            <td></td>
                            <td @click="sort('name')" :class="addSortClass('name')">{{'tables.headings.name' | translate}}</td>
                            <td @click="sort('cacheSize')" :class="addSortClass('cacheSize')">Cache Size</td>
                            <td @click="sort('consumerCount')" :class="addSortClass('consumerCount')">Consumer Count</td>
                            <td @click="sort('msgRateIn')" :class="addSortClass('msgRateIn')">Msg/s In</td>
                            <td @click="sort('msgRateOut')" :class="addSortClass('msgRateOut')">Msg/s Out</td>
                            <td @click="sort('msgThroughputIn')" :class="addSortClass('msgThroughputIn')" align="right">Rate In</td>
                            <td @click="sort('msgThroughputOut')" :class="addSortClass('msgThroughputOut')" align="right">Rate Out</td>
                            <td @click="sort('producerCount')" :class="addSortClass('producerCount')" align="right">Producers</td>
                            <td @click="sort('topics')" :class="addSortClass('topics')" align="right">Topics</td>

                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(bundleStat, index) in sortedList" :key="index">
                            <td>
                                <button :disabled="unloading === bundleStat.name" class="btn btn-primary btn-micro btn-bottom-margin" @click="unloadBundle(bundleStat.name)">Unload</button>
                                <button class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmSplitBundle(bundleStat.name)">Split</button>
                            </td>
                            <td>{{ bundleStat.name }}
                                <i class="fa fa-clipboard pointer icon-table" v-clipboard:copy="index"
                            v-clipboard:success="onCopy" v-clipboard:error="onError">
                            </i>
                            </td>
                            <td>{{ bundleStat.cacheSize }}</td>
                            <td>{{ bundleStat.consumerCount }}</td>
                            <td class="right">{{ bundleStat.msgRateIn | numberSeparate()}}</td>
                            <td align="right">{{ bundleStat.msgRateOut | numberSeparate() }}</td>
                            <td align="right">{{ bundleStat.msgThroughputIn | humanBytes }}</td>
                            <td align="right">{{ bundleStat.msgThroughputOut | humanBytes}}</td>
                            <td align="right">{{ bundleStat.producerCount }}</td>
                            <td class="no-wrap" align="right">{{ bundleStat.topics }}</td>
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
  name: 'BrokerBundlesTab',
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
