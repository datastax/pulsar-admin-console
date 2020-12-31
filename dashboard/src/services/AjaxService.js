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

import AjaxBase from '@/services/AjaxBase'

export default {
  ajaxAction (action, parmObj) {

    // Need to add ability to adjust the timeout of this call
    // The default is set in AjaxBase, but it may not be sufficient
    // for long actions, such as changing a plan.

    const data = new FormData()
    data.append('action', action)
    data.append('security', globalConf.security)

    Object.keys(parmObj).forEach(key => {
      data.append(key, parmObj[key])
    })

    return AjaxBase().post('admin-ajax.php', data)
  }
}
