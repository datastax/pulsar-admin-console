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

import decode from 'jwt-decode'
import axios from 'axios'
import store from '../../../store/index'

// key in the local storage
const AUTH_TOKEN_KEY = 'authToken'

export function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        let url = '/api/v1/auth/token';
        return axios.post(url, {
                username: username,
                password: password,
                grant_type: 'password'
        }).then(response => {
            setAuthToken(response.data.token)
            resolve();
            console.log(`Setting user to  ${username}`)
            store.commit('setLogin', username)

        }).catch (err => {
            console.error('Caught an error during login:', err)
            reject(err);
        });
    })
}

export function logoutUser() {
    console.log("Logging out user")
    clearAuthToken()
}

export function setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    console.log('set token', token)
    localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)    
}

export function clearAuthToken() {
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isLoggedIn() {
    let authToken = getAuthToken()
    // console.log("this is token from local storage", authToken)
    return !!authToken && !isTokenExpired(authToken)
}

export function isK8sAuthRequired() {
    return globalConf.auth_mode === "k8s";
}

export function getUserInfo() {
    if (isLoggedIn()) {
        return decode(getAuthToken())
    }
}

function getTokenExpirationDate(encodedToken) {
    let token = decode(encodedToken)
    if (!token.exp) {
        return null
    }
  
    let date = new Date(0)
    date.setUTCSeconds(token.exp)
  
    return date
}
  
function isTokenExpired(token) {
    let expirationDate = getTokenExpirationDate(token)
    return expirationDate < new Date()
}
