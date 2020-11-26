'use strict';
/**
 * kubernetes client that retieves admin and user credentials
 */

const K8sClient = require('kubernetes-client').Client;
const config = require('kubernetes-client/backends/request').config;

const secretPrefix = 'dashboard-user-'
const client = new K8sClient({
    config: config.fromKubeconfig(),
    version: '1.13'
});

const cfg = require('./config.js')
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
    cfg.L.info('passwordd is ' + secret)
    if (secret && secret === password) {
        return true
    }
    return false
}

module.exports = {
    getSecrets,
    authenticate
};


