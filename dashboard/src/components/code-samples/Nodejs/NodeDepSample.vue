<!--
  Copyright 2021 DataStax, Inc. 
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  
 -->

<template>
    <div class="node-dep-sample">
       
        <p>Since Node.js npm package depends on C++ Pulsar library, please install C++ library as prerequisite. For Ubuntu based deb package, to install: </p>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="ubuntuGet"><code class="bash"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="ubuntuGet"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

        <p>For Centos/RHEL based rpm package, to install: </p>
        <div class="form-group with-icon-right">
            <pre v-highlightjs="centosGet"><code></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="centosGet"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

        <p>To install Node.js package from npm:</p>

        <div class="form-group with-icon-right">
            <pre v-highlightjs="nodeget1"><code class="bash"></code></pre>
            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="nodeget1"
                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                    </i>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import mixins from '@/services/mixins'


    export default {
        name: "NodeDepSample",
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
            nodeget1() {
                return `npm install pulsar-client`
            },
            ubuntuGet() {
                return `wget https://archive.apache.org/dist/pulsar/pulsar-${this.apiVersion}/DEB/apache-pulsar-client.deb
wget https://archive.apache.org/dist/pulsar/pulsar-${this.apiVersion}/DEB/apache-pulsar-client-dev.deb

sudo apt install -y ./apache-pulsar-client.deb
sudo apt install -y ./apache-pulsar-client-dev.deb

sudo ldconfig`
            },
            centosGet() {
                return `wget https://archive.apache.org/dist/pulsar/pulsar-${this.apiVersion}/RPMS/apache-pulsar-client-${this.apiVersion}-1.x86_64.rpm
wget https://archive.apache.org/dist/pulsar/pulsar-${this.apiVersion}/RPMS/apache-pulsar-client-devel-${this.apiVersion}-1.x86_64.rpm

sudo rpm -i ./apache-pulsar-client-${this.apiVersion}-1.x86_64.rpm
sudo rpm -i ./apache-pulsar-client-devel-${this.apiVersion}-1.x86_64.rpm

sudo ldconfig`
            }
        },

    }
</script>


<style lang="scss">


</style>