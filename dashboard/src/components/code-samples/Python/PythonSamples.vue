<template>
  <div class="python-samples">

    <vuestic-widget headerText="Python Code Samples"
                    >
    <p>Kesque is powered by <a href="http://pulsar.apache.org" target="_blank" rel="noopener noreferrer">Apache Pulsar</a>. To connect to your service, use the open-source client APIs
            provided by the Apache Pulsar project. </p>
    <p>The Python client APIs are distributed through <a target="_blank" :href="pypiUrl" rel="noopener noreferrer">Python Package Index (PyPi)</a>. On Linux, the Python version 2.7 and versions 3.4 to 3.7 are supported. On MacOS versions 2.7 and 3.7 are supported. You can find the documentation for the Python client <a href="https://pulsar.apache.org/docs/en/client-libraries-python/" target="_blank" rel="noopener noreferrer">here</a>.</p>

    <p>Kesque is running Pulsar version {{ apiVersion }}. You should use this API version or higher. </p>    

      <vuestic-tabs class="tabs"
                    :names="tabNames">
        <div slot="Pip"
             class="flex justify--center">
          <pip-sample></pip-sample>
        </div>
        <div slot="Producer"
             class="flex justify--center">
          <python-producer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></python-producer-sample>
        </div>
        <div slot="Consumer"
             class="flex justify--center">
          <python-consumer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></python-consumer-sample>
        </div>
        <div slot="Reader"
             class="flex justify--center">
          <python-reader-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></python-reader-sample>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import PipSample from "./PipSample"
import PythonProducerSample from "./PythonProducer"
import PythonConsumerSample from "./PythonConsumer"
import PythonReaderSample from "./PythonReader"




export default {
  name: 'PythonSamples',
  components: {
    PipSample,
    PythonProducerSample,
    PythonConsumerSample,
    PythonReaderSample,
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
