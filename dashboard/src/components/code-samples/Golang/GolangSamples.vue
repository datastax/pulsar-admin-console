<template>
  <div class="golang-samples">

    <vuestic-widget headerText="Golang Code Samples"
                    >
    <p>To connect to your service, use the open-source client APIs
            provided by the Apache Pulsar project. </p>
    <p>The Golang client APIs are distributed through <a target="_blank" :href="godepUrl" rel="noopener noreferrer">Golang Package Dependency</a>. On Linux and MacOS, the Golang version 1.10 and above are supported. You can find the documentation for the Golang client <a href="https://godoc.org/github.com/apache/incubator-pulsar/pulsar-client-go/pulsar" target="_blank" rel="noopener noreferrer">here</a>.</p>

    <p>Kesqeu is running Pulsar version {{ apiVersion }}. You should use this API version or higher. Since the current Golang client library depends on the C++ client library. Please install <a href="https://pulsar.apache.org/docs/en/client-libraries-cpp/" target="_blank" rel="noopener noreferrer"> the C++ library version {{ apiVersion }}</a>.</p>

      <vuestic-tabs class="tabs"
                    :names="tabNames">
        <div slot="Dep"
             class="flex justify--center">
          <go-dep-sample></go-dep-sample>
        </div>
        <div slot="Producer"
             class="flex justify--center">
          <golang-producer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></golang-producer-sample>
        </div>
        <div slot="Consumer"
             class="flex justify--center">
          <golang-consumer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></golang-consumer-sample>
        </div>
        <div slot="Reader"
             class="flex justify--center">
          <golang-reader-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></golang-reader-sample>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import GoDepSample from "./GoDepSample"
import GolangProducerSample from "./GolangProducer"
import GolangConsumerSample from "./GolangConsumer"
import GolangReaderSample from "./GolangReader"




export default {
  name: 'GolangSamples',
  components: {
    GoDepSample,
    GolangProducerSample,
    GolangConsumerSample,
    GolangReaderSample,
  },
  data () {
    return {
      tabNames: ['Dep', 'Producer', 'Consumer', 'Reader']
    }
  },
  computed: {
    ...mapGetters([
        'topicStats',
        'activeCluster',
        'apiVersion'
    ]),
    godepUrl() {
        return `https://github.com/apache/pulsar/tree/master/pulsar-client-go`
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
