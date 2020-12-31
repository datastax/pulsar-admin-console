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

import Platform from '../plugins/platform'

let handlers = []

export default {
  __installed: false,
  __install () {
    this.__installed = true
    window.addEventListener('keyup', evt => {
      if (handlers.length === 0) {
        return
      }

      if (evt.which === 27 || evt.keyCode === 27) {
        handlers[handlers.length - 1]()
      }
    })
  },

  register (handler) {
    if (Platform.is.desktop) {
      if (!this.__installed) {
        this.__install()
      }

      handlers.push(handler)
    }
  },

  pop () {
    if (Platform.is.desktop) {
      handlers.pop()
    }
  },
}
