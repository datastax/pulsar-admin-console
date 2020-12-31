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
  table: {
    tableClass: 'table table-striped table-header-active',
    ascendingIcon: 'entypo entypo-up-dir',
    descendingIcon: 'entypo entypo-down-dir',
  },
  pagination: {
    wrapperClass: 'btn-group',
    activeClass: 'focus',
    disabledClass: 'disabled',
    pageClass: 'btn btn-primary hide-not-focused-btn',
    linkClass: 'btn btn-primary pagination-link-btn',
    icons: {
      first: 'fa fa-angle-double-left',
      prev: 'fa fa-angle-left',
      next: 'fa fa-angle-right',
      last: 'fa fa-angle-double-right',
    },
  },
}
