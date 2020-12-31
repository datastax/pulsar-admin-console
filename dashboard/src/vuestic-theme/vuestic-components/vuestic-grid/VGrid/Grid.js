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

export default function Grid (name) {
  /* @vue/component */
  return {
    name: `va-${name}`,
    functional: true,
    props: {
      id: String,
      tag: {
        type: String,
        default: 'div'
      }
    },
    render: (h, { props, data, children }) => {
      data.staticClass = (`${name} ${data.staticClass || ''}`).trim()

      if (data.attrs) {
        const classes = Object.keys(data.attrs).filter(key => {
          // TODO: Remove once resolved
          // https://github.com/vuejs/vue/issues/7841
          if (key === 'slot') return false

          const value = data.attrs[key]
          return value || typeof value === 'string'
        })

        if (classes.length) data.staticClass += ` ${classes.join(' ')}`
        delete data.attrs
      }

      if (props.id) {
        data.domProps = data.domProps || {}
        data.domProps.id = props.id
      }

      return h(props.tag, data, children)
    }
  }
}
