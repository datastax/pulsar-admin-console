<template>
    <div class="go-dep-sample">
       
        <p>To do a native install using go get:</p>

        <div class="form-group with-icon-right">
            <pre v-highlightjs="goget1"><code></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="goget1"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

    


    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mixins from '@/services/mixins'


    export default {
        name: "GoDepSample",
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
            goget1() {
                return `go get -u github.com/apache/pulsar/pulsar-client-go/pulsar`
            },
        },

    }
</script>


<style lang="scss">


</style>