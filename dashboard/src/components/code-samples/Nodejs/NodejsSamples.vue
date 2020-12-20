<template>
  <div class="nodejs-samples">

    <vuestic-widget headerText="Nodejs Code Samples"
                    >
    <p>To connect to your service, use the open-source client APIs
            provided by the Apache Pulsar project. </p>
    <p>The Nodejs client APIs are distributed through <a target="_blank" :href="nodedepUrl" rel="noopener noreferrer">NPM</a>. On Linux, we recommend Node version 10+ and npm 6+. You can find document and source code for the Nodejs client library <a href="https://github.com/apache/pulsar-client-node" target="_blank" rel="noopener noreferrer">here</a>.</p>

    <p>Since the current Nodejs client library depends on the C++ client library. Please install <a href="https://archive.apache.org/dist/pulsar/" target="_blank" rel="noopener noreferrer"> the C++ library version {{ apiVersion }}</a>.</p>

      <vuestic-tabs class="tabs"
                    :names="tabNames">
        <div slot="NPM"
             class="flex justify--center">
          <node-dep-sample></node-dep-sample>
        </div>
        <div slot="Producer"
             class="flex justify--center">
          <nodejs-producer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></nodejs-producer-sample>
        </div>
        <div slot="Consumer"
             class="flex justify--center">
          <nodejs-consumer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></nodejs-consumer-sample>
        </div>
        <div slot="Reader"
             class="flex justify--center">
          <nodejs-reader-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></nodejs-reader-sample>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import NodeDepSample from "./NodeDepSample"
import NodejsProducerSample from "./NodejsProducer"
import NodejsConsumerSample from "./NodejsConsumer"
import NodejsReaderSample from "./NodejsReader"




export default {
  name: 'NodejsSamples',
  components: {
    NodeDepSample,
    NodejsProducerSample,
    NodejsConsumerSample,
    NodejsReaderSample,
  },
  data () {
    return {
      tabNames: ['NPM', 'Producer', 'Consumer', 'Reader']
    }
  },
  computed: {
    ...mapGetters([
        'topicStats',
        'activeCluster',
        'apiVersion'
    ]),
    nodedepUrl() {
        return `https://github.com/apache/pulsar-client-node`
    },
  },
  methods: {
  },
  mounted() {

    this.$store.dispatch('getClusterInfo')

    // Turn off stats polling
    this.$store.commit('setRunTimer', false)
    console.log("Stopping regular polling");


    },
    beforeDestroy() {
        // Turn on stats polling
        this.$store.commit('setRunTimer', true)
        console.log("Starting regular polling");

        // Trigger an update so we don't have to wait for the next interval
        this.$store.dispatch('updateAll')
    }
}
</script>

<style lang="scss">


@import "../../../vuestic-theme/vuestic-sass/resources/variables";

// Colors
$mf-input-color: $body-color !default;
$mf-border-color: #999 !default;
$mf-label-color: lighten($mf-border-color, 10%) !default;
$mf-active-color: darken($mf-border-color, 10%) !default;
$mf-focus-color: $brand-primary !default;
$mf-error-color: $brand-danger !default;
$mf-focus-border-color: $charcoal !default;

.input-icon {
position: absolute;
top: 0.4375rem;
color: $mf-input-color;
}
.icon-medium {
  font-size: 25px;
}
.icon-github {
  font-size: 40px;
  color: black;
}
.tabs {
  .overview-tab {
    .explore-row {
      display: none !important;
    }
  }

  .maps-tab {
    height: 500px;
  }
}
.btn-right {
  float: right ;
}
.profile-card-widget, .chat-widget {
  width: 100%;
  .widget-body {
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      width: 100%;
    }
  }
}

pre {
    background-color: #282a36;
    width: 100%;
}


.bottom-widgets {
  > div[class^='col'] {
    & > div {
      width: 100%;
    }
  }
}
</style>
