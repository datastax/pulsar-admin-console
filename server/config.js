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
/*
 * a logger
 */
const { createLogger, format, transports } = require('winston');

const L = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(format.timestamp(), format.colorize(), format.simple() ),
    transports: [
        new transports.Console({})
    ]
});
/*
 * All dashboard and node server config is sourced from environment variables at runtime 
 **/
let dashboardConfig = {
    'token_path': '',
    'auth_mode': 'none'
}

let serverConfig = {
    'PORT': '6454',
    'LOG_LEVEL': 'info',
    'K8S_NAMESPACE': 'pulsar'
}

const reconcileConfig = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
        if (process.env[key]) {
            obj[key] = process.env[key]
        }
    }
}

const config = () => {
    reconcileConfig(serverConfig)
    reconcileConfig(dashboardConfig)

    if (dashboardConfig.token_path && (dashboardConfig.auth_mode === 'none' || dashboardConfig.auth_mode === 'k8s')) {
        console.log("Using override for token from topic_path")
        const token = fs.readFileSync(dashboardConfig.token_path, "utf8")
        dashboardConfig.admin_token = token.trim()
        dashboardConfig.client_token = token.trim()
    }

}
const fs = require('fs');


module.exports = {
    L,
    config,
    dashboardConfig,
    serverConfig
};
