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

  bind: function (el, binding) {
    let navbar = el.querySelector('.vuestic-navbar')
    let sidebar = el.querySelector('.vuestic-sidebar')

    const mobileWidth = 415

    el.resizeWindow = (evt) => {
      setTimeout(function () {
        let openedDropdown = navbar.querySelector('.show')
        let selector = navbar.querySelector('.header-selector')
        if (openedDropdown && document.documentElement.clientWidth < mobileWidth &&
          !evt.target.classList.contains('header-selector')) {
          sidebar.classList.add('sidebar-hidden')
          selector.classList.remove('i-menu-expanded')
          selector.classList.add('i-menu-collapsed')
        }
        if (evt.target.classList.contains('header-selector')) {
          sidebar.classList.toggle('sidebar-hidden')
          selector.classList.toggle('i-menu-expanded')
          selector.classList.toggle('i-menu-collapsed')
        }
      }, 0)
    }

    navbar.addEventListener('click', el.resizeWindow)

    sidebar.addEventListener('click', () => {
      if (document.documentElement.clientWidth < mobileWidth) {
        sidebar.classList.add('sidebar-hidden')
      }
    })
  },
  unbind: (el) => {
    el.removeEventListener('click', el.resizeWindow)
  },
}
