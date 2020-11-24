<template>
    <div>
        <div class="va-row" v-if="topicStats.data[$route.params.id]">
            <div class="flex xs12 md12" v-if="topicStats.data[$route.params.id].info.producers">
                <vuestic-widget>

                        <div class="va-row">
                            <div class="flex md3">
                                <div class="form-group">
                                    <div class="input-group">
                                        <input v-model="topicsConfig.data[$route.params.id].maxProducers" id="max-producers" name="max-producers"
                                        class="has-value" placeholder="" readonly />
                                        <label class="control-label" for="max-producers" role="button">{{'forms.inputs.maxProducers'
                                        | translate}}</label><i class="bar"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                <div class="table-responsive">
                    <table class="table table-striped first-td-padding table-header-active">
                    <thead>
                    <tr>
                        <td @click="sort('producerName')" :class="addSortClass('producerName')">{{'tables.headings.name' | translate}}</td>
                        <td @click="sort('averageMsgSize')" :class="addSortClass('averageMsgSize')">{{'tables.headings.averageMsgSize' | translate}}</td>
                        <td @click="sort('producerId')" :class="addSortClass('producerId')">{{'tables.headings.producerId' | translate}}</td>
                        <td @click="sort('msgRateIn')" :class="addSortClass('msgRateIn')">{{'tables.headings.msgRateIn' | translate}}</td>
                        <td @click="sort('msgThroughputIn')" :class="addSortClass('msgThroughputIn')">{{'tables.headings.msgThroughputIn' | translate}}</td>
                        <td @click="sort('msgDropRate')" :class="addSortClass('msgDropRate')" v-if="topicStats.data[$route.params.id].info.type === 'non-persistent'" align="right">{{'tables.headings.msgDropRate' | translate}}</td>
                        <td @click="sort('clientVersion')" :class="addSortClass('clientVersion')">{{'tables.headings.clientVersion' | translate}}</td>
                        <td @click="sort('connectedSince')" :class="addSortClass('connectedSince')">{{'tables.headings.connectedSince' | translate}}</td>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(topicStat, index) in sortedList" :key="index">
                        <td>{{ topicStat.producerName }}
                            <i class="fa fa-clipboard pointer icon-table"
                                v-clipboard:copy="topicStat.producerName"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError">
                            </i>
                        </td>
                        <td align="right">{{ topicStat.averageMsgSize | humanBytes }}</td>
                        <td align="right">{{ topicStat.producerId }}</td>
                        <td class="no-wrap" align="right">{{ topicStat.msgRateIn | numberSeparate() }}</td>
                        <td align="right">{{ topicStat.msgThroughputIn | humanBytes }}</td>
                        <td v-if="topicStats.data[$route.params.id].info.type === 'non-persistent'" align="right" class="no-wrap">{{ topicStat.msgDropRate | numberSeparate() }}</td>
                        <td>{{ topicStat.clientVersion  }}</td>
                        <td>{{ topicStat.connectedSince | date('%c') }}</td>
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
import mixins from '@/services/mixins'

export default {
  name: 'TopicProducersTab',
  mixins: [mixins],
  data() {
      return {
          sortBy: 'producerName',
          sortDir: 'asc',
          pageSize: 10,
          pageSizeMenu: [10, 20, 50, 100],
          currentPage: 1,
          totalRow: 0
      }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'topicsConfig'
    ]),
    sortedList () {
        this.totalRow = this.topicStats.data[this.$route.params.id].stats.publishers.length
        return this.topicStats.data[this.$route.params.id].stats.publishers.sort((a,b) => {
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
  methods: {
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
  }


}
</script>

<style scoped>
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
