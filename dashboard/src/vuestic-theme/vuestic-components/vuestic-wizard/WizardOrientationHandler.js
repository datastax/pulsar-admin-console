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

export default {
  bind (el, binding, vnode) {
    const HORIZONTAL_LAYOUT = 'horizontal'
    const VERTICAL_LAYOUT = 'vertical'
    const initialLayout = binding.value.layout
    const breakpoint = binding.value.breakPoint

    let wizardLayout = initialLayout

    const handleResize = () => {
      let width = window.innerWidth
      let layout = width <= breakpoint ? HORIZONTAL_LAYOUT : VERTICAL_LAYOUT
      if (wizardLayout !== layout) {
        wizardLayout = layout
        vnode.context.$emit('wizardLayoutChange', wizardLayout)
      }
    }

    if (initialLayout === VERTICAL_LAYOUT) {
      handleResize()
      window.addEventListener('resize', handleResize)
    }
  },
}
