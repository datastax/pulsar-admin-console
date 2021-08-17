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
  <vuestic-sidebar :hidden="isOpen">
    <template slot="menu">
      <sidebar-link
        :to="{ name: 'dashboard' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon vuestic-icon vuestic-icon-dashboard"></span>
          <span>{{ $t('menu.dashboard') }}</span>
        </span>
      </sidebar-link>
      <sidebar-link
        v-if="this.clientsDisabled === 'false'"
        :to="{ name: 'clients' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon iconicstroke iconicstroke-share"></span>
          <span>{{ $t('menu.clients') }}</span>
        </span>
      </sidebar-link>
      <sidebar-link
        :to="{ name: 'credentials' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon entypo entypo-key"></span>
          <span>{{ $t('menu.credentials') }}</span>
        </span>
      </sidebar-link>
      <sidebar-link-group>
        <span slot="title">
          <span class="sidebar-menu-item-icon fa fa-code"></span>
          <span>Code Samples</span>
        </span>
        <sidebar-link
          :to="{ name: 'java' }">
          <span slot="title">
            <span>Java</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'python' }">
          <span slot="title">
            <span>Python</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'golang' }">
          <span slot="title">
            <span>Golang</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'nodejs' }">
          <span slot="title">
            <span>Node.js</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'wspython' }">
          <span slot="title">
            <span>WebSocket</span>
          </span>
        </sidebar-link >
         <sidebar-link
          v-if="clusterInfo.info[activeCluster] && clusterInfo.info[activeCluster].host_override_http"
          :to="{ name: 'httpclients' }">
          <span slot="title">
            <span>HTTP</span>
          </span>
        </sidebar-link>
      </sidebar-link-group>
      <sidebar-link
        :to="{ name: 'topics' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon fa fa-folder-o"></span>
          <span>{{ $t('menu.topics') }}</span>
        </span>
      </sidebar-link>
      <sidebar-link-group v-if="featureFlags.function && this.functionsDisabled === 'false'">
        <span slot="title">
          <span class="sidebar-menu-item-icon fa fa-cogs"></span>
          <span>{{$t('menu.functions')}}</span>
        </span>
        <sidebar-link
          :to="{ name: 'functionView' }">
          <span slot="title">
            <span>{{ $t('menu.functionView') }}</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'functionAdd' }">
          <span slot="title">
            <span>{{ $t('menu.functionAdd') }}</span>
          </span>
        </sidebar-link>
      </sidebar-link-group>
      <sidebar-link-group v-if="featureFlags.sink && this.functionsDisabled === 'false'">
        <span slot="title">
          <span class="sidebar-menu-item-icon fa fa-sign-out"></span>
          <span>{{$t('menu.sinks')}}</span>
        </span>
        <sidebar-link
          :to="{ name: 'sinkView' }">
          <span slot="title">
            <span>{{ $t('menu.sinkView') }}</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'sinkAdd' }">
          <span slot="title">
            <span>{{ $t('menu.sinkAdd') }}</span>
          </span>
        </sidebar-link>
      </sidebar-link-group>
      <sidebar-link-group v-if="featureFlags.source && this.functionsDisabled === 'false'">
        <span slot="title">
          <span class="sidebar-menu-item-icon fa fa-sign-in"></span>
          <span>{{$t('menu.sources')}}</span>
        </span>
        <sidebar-link
          :to="{ name: 'sourceView' }">
          <span slot="title">
            <span>{{ $t('menu.sourceView') }}</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'sourceAdd' }">
          <span slot="title">
            <span>{{ $t('menu.sourceAdd') }}</span>
          </span>
        </sidebar-link>
      </sidebar-link-group>
      <sidebar-link
        :to="{ name: 'namespaces' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon fa fa-archive"></span>
          <span>{{ $t('menu.namespaces') }}</span>
        </span>
      </sidebar-link>
      <sidebar-link v-if="this.privateOrg !== 'true'"
        :to="{ name: 'clusters' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon fa fa-cloud"></span>
          <span>{{ $t('menu.clusters') }}</span>
        </span>
      </sidebar-link>
      <sidebar-link v-if="this.privateOrg === 'true'"
        :to="{ name: 'clusters' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon fa fa-building"></span>
          <span>Tenant</span>
        </span>
      </sidebar-link>
      <sidebar-link-group v-if="this.privateOrg === 'true'">
        <span slot="title">
          <span class="sidebar-menu-item-icon fa fa-cloud"></span>
          <span>Cluster</span>
        </span>
        <sidebar-link
          :to="{ name: 'brokers' }">
          <span slot="title">
            <span>Brokers</span>
          </span>
        </sidebar-link>
<!-- Temporarily removed becuase grafana is already externally accessible. Might permanently remove lated.
        <sidebar-link
          :to="{ name: 'clusterMonitor' }">
          <span slot="title">
            <span>Monitoring</span>
          </span>
        </sidebar-link> -->
        <sidebar-link
          :to="{ name: 'clusterDetail' }">
          <span slot="title">
            <span>Runtime Config</span>
          </span>
        </sidebar-link>
      </sidebar-link-group>
      <sidebar-link-group v-if="this.disableBilling === 'false' && this.privateOrg === 'false'">
        <span slot="title">
          <span class="sidebar-menu-item-icon fa fa-credit-card-alt"></span>
          <span>Plans</span>
        </span>
        <sidebar-link
          :to="{ name: 'change' }">
          <span slot="title">
            <span>{{$t('menu.managePlans')}}</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'add' }">
          <span slot="title">
            <span>Add</span>
          </span>
        </sidebar-link>
        <sidebar-link
          :to="{ name: 'billing' }">
          <span slot="title">
            <span>Billing</span>
          </span>
        </sidebar-link>
      </sidebar-link-group>
      <sidebar-link v-if="this.runningEnv !== 'k8s'"
        :to="{ name: 'org' }">
        <span slot="title">
          <span
            class="sidebar-menu-item-icon entypo entypo-users"></span>
          <span>{{ $t('menu.org') }}</span>
        </span>
      </sidebar-link>
    </template>

  </vuestic-sidebar>
</template>

<script>

import VuesticSidebar
  from '../../../vuestic-theme/vuestic-components/vuestic-sidebar/VuesticSidebar'
import SidebarLink from './components/SidebarLink'
import SidebarLinkGroup from './components/SidebarLinkGroup'
import { mapGetters } from 'vuex'

export default {
  name: 'app-sidebar',
  computed: {
    ...mapGetters([
      'featureFlags',
      'disableBilling',
      'privateOrg',
      'functionsDisabled',
      'clientsDisabled',
      'isAdminUser',
      'runningEnv',
      'clusterInfo',
      'activeCluster'
    ]),
  },
  components: {
    VuesticSidebar,
    SidebarLink,
    SidebarLinkGroup,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
}

</script>
