//
//  Copyright 2021 DataStax, Inc. 
//  
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//  
//      http://www.apache.org/licenses/LICENSE-2.0
//  
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//  
//

export const breadcrumbs = {
  root: {
    name: '/',
    displayName: 'Home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
    },
    {
      name: 'clients',
      displayName: 'menu.clients',
    },
    {
      name: 'summary',
      displayName: 'menu.summary',
    },
    {
      name: 'topics',
      displayName: 'menu.topics',
      children: [
        {
          name: 'topicDetail',
          displayName: 'menu.topicDetails',
        },
      ],
    },
    {
      name: 'functionView',
      displayName: 'menu.functions',
      children: [
        {
          name: 'functionDetail',
          displayName: 'menu.functionDetails',
        },
        {
          name: 'functionAdd',
          displayName: 'menu.functionAdd',
        },
        {
          name: 'functionUpdate',
          displayName: 'menu.functionAdd',
        },
      ],
    },
    {
      name: 'sinkView',
      displayName: 'menu.sinks',
      children: [
        {
          name: 'sinkDetail',
          displayName: 'menu.sinkDetails',
        },
        {
          name: 'sinkAdd',
          displayName: 'menu.sinkAdd',
        },
        {
          name: 'sinkUpdate',
          displayName: 'menu.sinkAdd',
        },
      ],
    },
    {
      name: 'sourceView',
      displayName: 'menu.sources',
      children: [
        {
          name: 'sourceDetail',
          displayName: 'menu.sourceDetails',
        },
        {
          name: 'sourceAdd',
          displayName: 'menu.sourceAdd',
        },
        {
          name: 'sourceUpdate',
          displayName: 'menu.sourceAdd',
        },
      ],
    },
    {
      name: 'namespaces',
      displayName: 'menu.namespaces',
      children: [
        {
          name: 'namespaceDetail',
          displayName: 'menu.namespaceDetails',
        },
      ],
    },
    {
      name: 'cluster',
      displayName: 'Cluster',
      children: [
        {
          name: 'clusterDetail',
          displayName: 'Runtime Config',
        },
        {
          name: 'brokers',
          displayName: 'Brokers'
        },
        {
          name: 'clusterMonitor',
          displayName: 'menu.clusterMonitor',
        },
      ],
    },
    {
      name: 'credentials',
      displayName: 'menu.credentials',
    },
    {
      name: 'clusters',
      displayName: 'Tenant',
    },
    {
      name: 'org',
      displayName: 'menu.org',
    },
    {
      name: 'brokers',
      displayName: 'menu.brokers',
      children: [
        {
          name: 'brokerDetail',
          displayName: 'menu.brokerDetail',
        },
        {
          name: 'brokerMonitor',
          displayName: 'menu.brokerMonitor',
        },
      ],
    },
    {
      name: 'statistics',
      displayName: 'menu.statistics',
      disabled: true,
      children: [
        {
          name: 'charts',
          displayName: 'menu.charts',
        },
        {
          name: 'progress-bars',
          displayName: 'menu.progressBars',
        },
      ],
    },
    {
      name: 'code',
      displayName: 'Code Samples',
      disabled: true,
      children: [
        {
          name: 'java',
          displayName: 'Java',
        },
        {
          name: 'python',
          displayName: 'Python',
        },
        {
          name: 'nodejs',
          displayName: 'Node.js',
        },
        {
          name: 'golang',
          displayName: 'Golang',
        },
        {
          name: 'wspython',
          displayName: 'WebSocket',
        },
        {
          name: "httpclients",
          displayName: "HTTPClients",
        }
      ],
    },
    {
      name: 'plans',
      displayName: 'Plans',
      disabled: true,
      children: [
        {
          name: 'add',
          displayName: 'Add',
        },
        {
          name: 'change',
          displayName: 'menu.managePlans',
        },
        {
          name: 'billing',
          displayName: 'Billing',
        },
      ],
    },
    {
      name: 'tables',
      displayName: 'menu.tables',
    },
    {
      name: 'ui',
      displayName: 'menu.uiElements',
      disabled: true,
      children: [
        {
          name: 'typography',
          displayName: 'menu.typography',
        },
        {
          name: 'buttons',
          displayName: 'menu.buttons',
        },
        {
          name: 'collapse',
          displayName: 'menu.collapse',
        },
        {
          name: 'filters',
          displayName: 'menu.filters'
        },
        {
          name: 'color-pickers',
          displayName: 'menu.colorPickers',
        },
        {
          name: 'timelines',
          displayName: 'menu.timelines',
        },
        {
          name: 'notifications',
          displayName: 'menu.notifications',
        },
        {
          name: 'dropdowns',
          displayName: 'menu.dropdowns',
        },
        {
          name: 'icon-sets',
          displayName: 'menu.icons',
          children: [
            {
              displayName: 'concrete',
              name: 'icon-set',
            },
          ],
        },
        {
          name: 'spinners',
          displayName: 'menu.spinners',
        },
        {
          name: 'grid',
          displayName: 'menu.grid',
        },
        {
          name: 'modals',
          displayName: 'menu.modals',
        },
        {
          name: 'file-upload',
          displayName: 'menu.fileUpload',
        },
        {
          name: 'tags',
          displayName: 'menu.tags',
        },
        {
          name: 'cards',
          displayName: 'menu.cards',
        },
        {
          name: 'tree-view',
          displayName: 'menu.treeView',
        },
      ],
    },
    {
      name: 'extra',
      displayName: 'menu.extra',
    },
    {
      name: 'maps',
      displayName: 'menu.maps',
      disabled: true,
      children: [
        {
          name: 'google-maps',
          displayName: 'Google Maps',
        },
        {
          name: 'yandex-maps',
          displayName: 'Yandex Maps',
        },
        {
          name: 'leaflet-maps',
          displayName: 'Leaflet Maps',
        },
        {
          name: 'bubble-maps',
          displayName: 'Bubble Maps',
        },
        {
          name: 'line-maps',
          displayName: 'Line Maps',
        },
      ],
    },
    {
      name: 'pages',
      displayName: 'menu.pages',
      disabled: true,
      children: [
        {
          name: '404-pages',
          displayName: '404 Pages',
        },
      ],
    },
  ],
}
