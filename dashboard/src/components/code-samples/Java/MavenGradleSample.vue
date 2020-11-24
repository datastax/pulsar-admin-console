<template>
    <div class="maven-gradle-sample">
        <h5>Maven</h5>
        <p>If you are using Maven in your project, add this to the &#60;properties&#62; section of your <span class="vue-highlighted-text">pom.xml</span> file:</p>

        <div class="form-group with-icon-right">
            <pre v-highlightjs="pom1"><code></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="pom1"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

        <p>And add the following to the &#60;dependencies&#62; section:</p>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="pom2"><code></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="pom2"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>
        <h5>Gradle</h5>
        <p>If you are using Gradle, add this to your <span class="vue-highlighted-text">build.gradle</span> file:</p>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="gradle"><code></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="gradle"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>


    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mixins from '@/services/mixins'


    export default {
        name: "MavenGradleSample",
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
            mavenUrl() {
                return `http://search.maven.org/artifact/org.apache.pulsar/pulsar-client/${this.apiVersion}/jar`
            },
            pom1() {
                return `<pulsar.version>${this.apiVersion}</pulsar.version>`
            },
            pom2(){
                return `<dependency>
  <groupId>org.apache.pulsar</groupId>
  <artifactId>pulsar-client</artifactId>
  <version>\x24{pulsar.version}</version>
</dependency>`
            },
            gradle() {
                return `def pulsarVersion = '${this.apiVersion}'

dependencies {
    compile group: 'org.apache.pulsar', name: 'pulsar-client', version: pulsarVersion
}`
            }
        },

    }
</script>


<style lang="scss">


</style>