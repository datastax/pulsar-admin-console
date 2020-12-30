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

import { isSSR } from './plugins/platform'

export default {
  __history: [],
  add: () => {
  },
  remove: () => {
  },

  install ($q, cfg) {
    if (isSSR || !$q.platform.is.cordova) {
      return
    }

    this.add = definition => {
      this.__history.push(definition)
    }
    this.remove = definition => {
      const index = this.__history.indexOf(definition)
      if (index >= 0) {
        this.__history.splice(index, 1)
      }
    }

    const exit = cfg.cordova === void 0 || cfg.cordova.backButtonExit !== false

    document.addEventListener('deviceready', () => {
      document.addEventListener('backbutton', () => {
        if (this.__history.length) {
          this.__history.pop().handler()
        } else if (exit && window.location.hash === '#/') {
          navigator.app.exitApp()
        } else {
          window.history.back()
        }
      }, false)
    })
  },
}
