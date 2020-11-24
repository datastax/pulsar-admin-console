<template>
    <div class="ws-pip-sample">
       
        <p>To install WebSocket client library using pip:</p>

        <div class="form-group with-icon-right">
            <pre v-highlightjs="pip1"><code></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="pip1"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

    


    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mixins from '@/services/mixins'


    export default {
        name: "WsPipSample",
        data() {
            return {
                test: ""
            }
        },
        mixins: [mixins],
        computed: {
            ...mapGetters([
                'apiVersion',
                'activeCluster',
                'allowedClusters'
            ]),
            pip1() {
                return `pip install websocket-client`
            },
        },

    }
</script>


<style lang="scss">


</style>
