import axios from 'axios'

export default() => {
  const baseUrl = wpData.ajax_url.replace('admin-ajax.php', '')

  return axios.create({
    baseURL: baseUrl,
    timeout: 60000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}
