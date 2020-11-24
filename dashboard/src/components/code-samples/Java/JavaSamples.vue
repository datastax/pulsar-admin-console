<template>
  <div class="java-samples">

    <vuestic-widget headerText="Java Code Samples"
                    >
    <p>Kesque is powered by <a href="http://pulsar.apache.org" target="_blank" rel="noopener noreferrer">Apache Pulsar</a>. To connect to your service, use the open-source client APIs
            provided by the Apache Pulsar project. </p>
    <p>The Java client APIs are distributed through <a target="_blank" :href="mavenUrl" rel="noopener noreferrer">Maven Central</a>. They require Java version 8. You can find the Javadocs <a href="https://pulsar.apache.org/api/client/" target="_blank" rel="noopener noreferrer">here</a>.</p>

            <p>Kesque is running Pulsar version {{ apiVersion }}. You should use this API version or higher. </p>    


      <vuestic-tabs class="tabs"
                    :names="tabNames">
        <div slot="Maven/Gradle"
             class="flex justify--center">
          <maven-gradle-sample></maven-gradle-sample>
        </div>
        <div slot="Producer"
             class="flex justify--center">
          <java-producer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></java-producer-sample>
        </div>
        <div slot="Consumer"
             class="flex justify--center">
          <java-consumer-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></java-consumer-sample>
        </div>
        <div slot="Reader"
             class="flex justify--center">
          <java-reader-sample :cluster="activeCluster" :namespace="'local-'+activeCluster"></java-reader-sample>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import MavenGradleSample from "./MavenGradleSample"
import JavaProducerSample from "./JavaProducer"
import JavaConsumerSample from "./JavaConsumer"
import JavaReaderSample from "./JavaReader"


export default {
  name: 'JavaSamples',
  components: {
    MavenGradleSample,
    JavaProducerSample,
    JavaConsumerSample,
    JavaReaderSample,
  },
  data () {
    return {
      tabNames: ['Maven/Gradle', 'Producer', 'Consumer', 'Reader']
    }
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
    },
  computed: {
    ...mapGetters([
        'topicStats',
        'activeCluster',
        'apiVersion'
    ]),
    mavenUrl() {
        return `http://search.maven.org/artifact/org.apache.pulsar/pulsar-client/${this.apiVersion}/jar`
    },
  },
  methods: {
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
