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

export const closeOverlay = {
  name: 'close-overlay',
  bind (el, binding, vnode) {
    const handler = ev => {
      let vm = vnode.componentInstance
      while ((vm = vm.$parent)) {
        const name = vm.$options.name
        if (name === 'vuestic-popup' || name === 'QModal') {
          vm.hide(ev)
          break
        }
      }
    }
    const handlerKey = ev => {
      if (ev.keyCode === 13) {
        handler(ev)
      }
    }
    el.__qclose = { handler, handlerKey }
    el.addEventListener('click', handler)
    el.addEventListener('keyup', handlerKey)
  },
  unbind (el) {
    const ctx = el.__qclose
    if (!ctx) {
      return
    }
    el.removeEventListener('click', ctx.handler)
    el.removeEventListener('keyup', ctx.handlerKey)
    delete el.__qclose
  },
}
