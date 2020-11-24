<template>
  <div class="httpclient-samples">

    <vuestic-widget headerText="HTTP Client Code Samples">
    <p>Kafkaesque is powered by <a href="http://pulsar.apache.org" target="_blank" rel="noopener noreferrer">Apache Pulsar.</a> HTTP interface is supported by <a href="https://github.com/kafkaesque-io/pulsar-beam" target="_blank" rel="noopener noreferrer"> Pulsar Beam</a>. </p>
    <p>These examples use HTTP Post method to publish messages and HTTP SSE to receive messages.</p>
    <p>HTTP client has no dependencies on any Pulsar client.</p>

      <vuestic-tabs class="tabs"
                    :names="tabNames">
        <div slot="Node.js Producer"
             class="flex justify--center">
          <http-clients-producer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></http-clients-producer-sample>
        </div>
        <div slot="Node.js Consumer"
             class="flex justify--center">
          <http-clients-consumer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></http-clients-consumer-sample>
        </div>
        <div slot="Curl Consumer"
             class="flex justify--center">
          <curl-consumer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></curl-consumer-sample>
        </div>
        <div slot="Curl Producer"
             class="flex justify--center">
          <curl-producer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></curl-producer-sample>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HttpClientsProducerSample from './HttpClientsProducer'
import HttpClientsConsumerSample from './HttpClientsConsumer'
import CurlConsumerSample from './CurlConsumer'
import CurlProducerSample from './CurlProducer'

export default {
  name: 'HttpClientsSamples',
  components: {
    HttpClientsProducerSample,
    HttpClientsConsumerSample,
    CurlConsumerSample,
    CurlProducerSample,
  },
  data () {
    return {
      tabNames: ['Node.js Producer', 'Node.js Consumer', 'Curl Producer', 'Curl Consumer']
    }
  },
  computed: {
    ...mapGetters([
      'topicStats',
      'activeCluster',
      'apiVersion'
    ]),
  },
  methods: {
  },
  mounted () {

    this.$store.dispatch('getClusterInfo')

    // Turn off stats polling
    this.$store.commit('setRunTimer', false)
    console.log('Stopping regular polling')
  },
  beforeDestroy () {
    // Turn on stats polling
    this.$store.commit('setRunTimer', true)
    console.log('Starting regular polling')

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
