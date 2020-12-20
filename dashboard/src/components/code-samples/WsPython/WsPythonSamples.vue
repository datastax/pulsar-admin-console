<template>
  <div class="ws-python-samples">

    <vuestic-widget headerText="WebSocket (Python) Code Samples"
                    >
    <p>To connect to your service, you can use a standard WebSocket client library. These examples use the Python WebSocket client library (Python 3). You can find the documentation for the Pulsar WebSocket interface <a href="http://pulsar.apache.org/docs/en/client-libraries-websocket/" target="_blank" rel="noopener noreferrer">here</a>.</p> 
    
        

      <vuestic-tabs class="tabs"
                    :names="tabNames">
        <div slot="Pip"
             class="flex justify--center">
          <ws-pip-sample></ws-pip-sample>
        </div>
        <div slot="Producer"
             class="flex justify--center">
          <ws-python-producer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></ws-python-producer-sample>
        </div>
        <div slot="Consumer"
             class="flex justify--center">
          <ws-python-consumer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></ws-python-consumer-sample>
        </div>
        <div slot="Reader"
             class="flex justify--center">
          <ws-python-reader-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></ws-python-reader-sample>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import WsPipSample from "./WsPipSample"
import WsPythonProducerSample from "./WsPythonProducer"
import WsPythonConsumerSample from "./WsPythonConsumer"
import WsPythonReaderSample from "./WsPythonReader"




export default {
  name: 'WsPythonSamples',
  components: {
    WsPipSample,
    WsPythonProducerSample,
    WsPythonConsumerSample,
    WsPythonReaderSample,
  },
  data () {
    return {
      tabNames: ['Pip', 'Producer', 'Consumer', 'Reader']
    }
  },
  computed: {
    ...mapGetters([
        'topicStats',
        'activeCluster',
        'apiVersion'
    ]),
    pypiUrl() {
        return `https://pypi.org/project/pulsar-client/`
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
