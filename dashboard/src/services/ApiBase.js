import axios from 'axios'
import store from '../store/index'

export default() => {
  const adminToken = store.getters.adminToken
  return axios.create({
    baseURL: store.getters.apiBaseUrl,
    withCredentials: false,
    timeout: 4500,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  })
}
