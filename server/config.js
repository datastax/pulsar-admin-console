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
const confFile = process.env.CONFIG_FILE_OVERRIDE || 'config.js';
const { globalConf } = require(`../config/${confFile}`)

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
        (globalConf.auth_mode === 'none' || globalConf.auth_mode === 'k8s')) {
    L.info("Setting tokens from path: " + globalConf.server_config.token_path)
    const token = fs.readFileSync(globalConf.server_config.token_path, "utf8")
    globalConf.admin_token = token.trim()
    globalConf.client_token = token.trim()
}


module.exports = {
    L,
    globalConf,
};
