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

'use strict'
process.env["NODE_CONFIG_DIR"] = __dirname + "/../config/";

// Using the node-config library to handle configuration files
// The base file name is default.json and it contains all the configuration
// parameters. Other files can be added to the directory (ex: default-development.json, local.json)
// to override on a parameter by parameter basis (useful for development environments.
// 
// For more options, see https://github.com/node-config/node-config/wiki/Configuration-Files
//
const globalConf = require('config')
console.log('NODE_CONFIG_DIR: ' + globalConf.util.getEnv('NODE_CONFIG_DIR'));
console.log('NODE_ENV: ' + globalConf.util.getEnv('NODE_ENV'));

/*
 * a logger
 */
const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const L = createLogger({
    level: process.env.LOG_LEVEL || globalConf.server_config.log_level || 'info',
    format: format.combine(format.timestamp(), format.colorize(), format.simple() ),
    transports: [
        new transports.Console({})
    ]
});


// If token path is specified, read the cluster token from file and update
// token parameters
if (globalConf.server_config.token_path && 
        (globalConf.auth_mode === 'k8s' || globalConf.auth_mode === 'user')) {
    L.info("Setting tokens from path: " + globalConf.server_config.token_path)
    const token = fs.readFileSync(globalConf.server_config.token_path, "utf8")
    globalConf.server_config.admin_token = token.trim()
}

// Set derived config
globalConf.home_cluster = globalConf.cluster_name
globalConf.cluster_list = [globalConf.cluster_name]


// Add required properties to globalConf
globalConf.api_base_url = '/api/v1'
globalConf.user_role = 'administrator'
globalConf.feature_flags = {
    "function": true,
    "sink": true,
    "source": true,
    "tenantStats": false
}
globalConf.private_org = 'true'
globalConf.use_token_list = 'false'
globalConf.running_env ='k8s'


// Add deprecated properties to globalConf
globalConf.ajax_url = ''
globalConf.wss_url = ''
globalConf.disable_billing = ''
globalConf.login = 'admin'
globalConf.email = 'admin@example.com'
globalConf.client_role = ''
globalConf.plan = ''
globalConf.need_to_create_plan = ''
globalConf.plan_to_create = ''
globalConf.admin_role = ''
globalConf.default_plan = ''
globalConf.security = ''
globalConf.chargebee_site = ''
globalConf.billing_provider = ''
globalConf.multi_user_org = ''

module.exports = {
    L,
    globalConf,
};
