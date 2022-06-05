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

'use strict';
/**
 * kubernetes client that retieves admin and user credentials
 */

const cfg = require('./config.js');
const fs = require('fs');
const K8sClient = require('kubernetes-client').Client;
const Request = require('kubernetes-client/backends/request');
const config = require('kubernetes-client/backends/request').config;
const kubeConfigFile = process.env.HOME + '/.kube/config';

const secretPrefix = 'dashboard-user-'
// kubernetes clientset configuration
let k8sClientConfig = null;
if (fs.existsSync(kubeConfigFile)) {
  cfg.L.info('set up kubernetes cluster dev local access');
  k8sClientConfig = {
    config: config.fromKubeconfig(),
    version: '1.13'
  }
} else if (
  (process.env.KUBERNETES_SERVICE_HOST != '' || cfg.globalConf.server_config.kubernetes.kubernetes_service_host != '') &&
  (process.env.KUBERNETES_SERVICE_PORT != '' || cfg.globalConf.server_config.kubernetes.kubernetes_service_port != '')
) {
  k8sClientConfig = new Request(Request.config.getInCluster()); 
  cfg.L.info('set up kubernetes in-cluster access');
} else {
  cfg.L.error("no kubernetes cluster access ")
}
const client = new K8sClient(k8sClientConfig);
/**
 * Get secret from the key
 * @param {*} namespace 
 * @param {*} key 
 */
const getSecrets = async (namespace, key) => {
    await client.loadSpec()
    const secrets = await client.api.v1.namespace(namespace).secrets.get();
    const secretName = secretPrefix + key
    for (let i = 0; i < secrets.body.items.length; i++) {
        let item = secrets.body.items[i]
        if (item.metadata && item.metadata.name && secretName === item.metadata.name
                && item.data && item.data.password) {
                  console.log("Found matching secret " + secretName)
            let buff = Buffer.from(item.data.password, 'base64')
            return buff.toString('ascii')
        }
    }
    return null
};

/**
 * authenticate against k82 secret
 * @param {*} username
 * @param {*} password 
 */
const authenticate = async (username, password) => {
    const namespace = cfg.globalConf.server_config.kubernetes.k8s_namespace;
    const secret = await getSecrets(namespace, username)
    cfg.L.debug('kubernetes secret based auth namespace ' + namespace + ' ' + username + ' ' + secret)
    if (secret && secret === password) {
        return true
    }
    return false
}
/**
 * 
 * @param {*} username 
 */
const matchUser = async (username) => {
    const namespace = cfg.globalConf.server_config.kubernetes.k8s_namespace;
    const secret = await getSecrets(namespace, username)
    cfg.L.debug('kubernetes secrete based auth ' + namespace + ' ' + username)
    if (secret) {
        return true
    }
    return false
}
module.exports = {
    getSecrets,
    matchUser,
    authenticate
};


