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

import axios from 'axios'
import store from '../store/index'

export default() => {
  return axios.create({
    baseURL: store.getters.apiBaseUrl,
    withCredentials: false,
    timeout: 4500,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${store.getters.clientToken}`
    }
  })
}
