import decode from 'jwt-decode'
import axios from 'axios'
import store from '../../../store/index'

// key in the local storage
const AUTH_TOKEN_KEY = 'authToken'

export function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        let url = store.getters.backendUrl + '/api/v1/auth/token';
        return axios.post(url, {
                username: username,
                password: password,
                grant_type: 'password'
        }).then(response => {
            setAuthToken(response.data.token)
            resolve();
        }).catch (err => {
            console.error('Caught an error during login:', err)
            reject(err);
        });
    })
}

export function logoutUser() {
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
    console.log("this is token from local storage", authToken)
    return !!authToken && !isTokenExpired(authToken)
}

export function isK8sAuthRequired() {
    return store.getters.authMode === "k8s";
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
