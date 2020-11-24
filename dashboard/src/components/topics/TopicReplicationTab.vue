<template>
    <div>
        <div class="va-row" v-if="topicStats.data[$route.params.id]">
            <div class="flex xs12 md12" v-if="topicStats.data[$route.params.id].info.replClusters">
                <vuestic-widget >
                <div class="table-responsive">
                    <table class="table table-striped first-td-padding table-header-active">
                    <thead>
                    <tr>
                        <td>{{'tables.headings.name' | translate}}</td>
                        <td>{{'tables.headings.msgBacklog' | translate}}</td>
                        <td align="right">{{'tables.headings.replicationDelayInSeconds' | translate}}</td>
                        <td>{{'tables.headings.msgRateIn' | translate}}</td>
                        <td>{{'tables.headings.msgThroughputIn' | translate}}</td>
                        <td>{{'tables.headings.msgRateOut' | translate}}</td>
                        <td>{{'tables.headings.msgThroughputOut' | translate}}</td>
                        
                        <td align="right">{{'tables.headings.connected' | translate}}</td>
                        <td align="right">{{'tables.headings.connectedSince' | translate}}</td>
                        <td align="right">{{'tables.headings.msgRateExpired' | translate}}</td>

                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(topicStat, index) in topicStats.data[$route.params.id].stats.replication" :key="topicStat.index">
                        <td>{{ index }}
                            <i class="fa fa-clipboard pointer icon-table" 
                                v-clipboard:copy="index"
                                v-clipboard:success="onCopy" 
                                v-clipboard:error="onError">
                            </i>
                        </td>
                        <td>{{ topicStat.replicationBacklog  }}</td>
                        <td align="right">{{ topicStat.replicationDelayInSeconds }}</td>
                        <td class="no-wrap">{{ topicStat.msgRateIn | numberSeparate() }}</td>
                        <td align="right">{{ topicStat.msgThroughputIn | humanBytes }}</td>
                        <td class="no-wrap">{{ topicStat.msgRateOut | numberSeparate() }}</td>
                        <td align="right">{{ topicStat.msgThroughputOut | humanBytes}}</td>
                        
                        <td align="right">{{ topicStat.connected }}</td>
                        <td align="right">{{ topicStat.outboundConnectedSince }}</td>
                        <td align="right">{{ topicStat.msgRateExpired }}</td>

                        </tr>     
                    </tbody>
                    </table>
                </div>
                </vuestic-widget>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import mixins from '@/services/mixins'

export default {
    name: 'TopicReplicationTab',
    mixins: [mixins],
    computed: {
        ...mapGetters([
            'topicStats',
        ]),

    },
    
}
</script>

<style scoped>

</style>