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
} else if (process.env.KUBERNETES_SERVICE_HOST != '' && process.env.KUBERNETES_SERVICE_PORT != '') {
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
    const secrets = await client.api.v1.namespace(namespace).secrets.get();
    const secretName = secretPrefix + key
    for (let i = 0; i < secrets.body.items.length; i++) {
        let item = secrets.body.items[i]
        if (item.metadata && item.metadata.name && secretName === item.metadata.name
                && item.data && item.data.password) {
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
    const namespace = cfg.serverConfig.K8S_NAMESPACE;
    const secret = await getSecrets(namespace, username)
    cfg.L.debug('kubernetes secrete based auth ' + namespace + ' ' + username + ' ' + secret)
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
    const namespace = cfg.serverConfig.K8S_NAMESPACE;
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


