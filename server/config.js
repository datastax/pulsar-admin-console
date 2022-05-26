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
const { globalConf } = require('../dashboard/public/config.js')

const L = createLogger({
    level: process.env.LOG_LEVEL || globalConf.server_config.log_level || 'info',
    format: format.combine(format.timestamp(), format.colorize(), format.simple() ),
    transports: [
        new transports.Console({})
    ]
});
/*
 * All dashboard and node server config is sourced from environment variables at runtime 
 **/
let dashboardConfig = {
    'token_path': globalConf.token_path,
    'auth_mode': globalConf.auth_mode,
}

let serverConfig = {
    'PORT': globalConf.server_config.port,
    'LOG_LEVEL': globalConf.server_config.log_level,
    'K8S_NAMESPACE': globalConf.server_config.k8s_namespace
}

const reconcileConfig = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
        if (process.env[key]) {
            obj[key] = process.env[key]
        }
    }
}

const config = (indexHtml) => {
    reconcileConfig(serverConfig)
    reconcileConfig(dashboardConfig)
    generateIndexHtml(indexHtml)
}
const fs = require('fs');

const generateIndexHtml = (indexHtml) => {

    let overrideConfig = {}

    if (dashboardConfig.token_path && (dashboardConfig.auth_mode === 'none' || dashboardConfig.auth_mode === 'k8s')) {
        
        const token = fs.readFileSync(dashboardConfig.token_path, "utf8")
        overrideConfig.admin_token = token.trim()
        overrideConfig.client_token = token.trim()
        
    }

    const data = '<div id=wp-vue-app></div><script type=\'text/javascript\' id=\'chunk-index-js-extra\'> /* <![CDATA[ */'
           + 'let overrideConf = ' + JSON.stringify(overrideConfig)
           + '/* ]]> */</script>';

    fs.readFile(indexHtml+'.template', 'utf8', function (err,fileData) {
        if (err) {
            L.error(err);
            return
        }
        var result = fileData.replace(/<div id="wp-vue-app"><\/div>/g, data);
        
        fs.writeFile(indexHtml, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
    
}

module.exports = {
    L,
    config,
    dashboardConfig,
    serverConfig
};
