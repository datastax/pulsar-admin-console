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

const fs = require('fs');
const axios = require('axios');
const {start, shutdown, getServer, getConfig} = require('../server');
const defaultConfig = require("../../config/default.json");
const globalConf = require("../../config/default.json");
const jwt = require('jsonwebtoken');

jest.mock('../config.js', () => {
    const {createLogger, format, transports} = require('winston');
    const globalConf = require("../../config/default.json");
    globalConf.server_config.port = 0
    globalConf.auth_mode = "user"
    globalConf.server_config.user_auth.username = "username1"
    globalConf.server_config.user_auth.password = "password1"


    return {
        L: createLogger({
            level: 'debug',
            format: format.combine(format.timestamp(), format.colorize(), format.simple()),
            transports: [
                new transports.Console({})
            ]
        }),
        globalConf
    }
});

let client

beforeEach(() => {
    start()
    client = axios.create({
        baseURL: "http://localhost:" + getServer().address().port
    })
})


test('generateJWTSymmetric', async () => {
    return client.post('/api/v1/auth/token', {
        username: "username1",
        password: "password1"
    })
        .then(function (response) {
            expect(response.status).toBe(200)
            expect(response.data.access_token).not.toBeUndefined()
            return new Promise((resolve, reject) => {
                jwt.verify(response.data.access_token, "default-secret", {
                    algorithms: ['HS256'],
                    sub: "username1",
                    maxAge: "12h"
                }, function (err, decoded) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })

            })

        })
});


test('generateJWTAsymmetric', async () => {
    getConfig().globalConf.server_config.token_options = {
        algorithm: "RS256",
        expires_in: "1d",
        claim: "user",
        private_key_path: "__tests__/test-private-key-rsa-pkcs8.key",
    }
    return client.post('/api/v1/auth/token', {
        username: "username1",
        password: "password1"
    })
        .then(function (response) {
            expect(response.status).toBe(200)
            expect(response.data.access_token).not.toBeUndefined()
            return new Promise((resolve, reject) => {
                jwt.verify(response.data.access_token, fs.readFileSync("__tests__/test-private-key-rsa-pkcs8.pem"), {
                    algorithms: ['RS256'],
                    user: "username1",
                    maxAge: "1d"
                }, function (err, decoded) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })

            })

        })
});

afterEach(() => {
    shutdown()
})