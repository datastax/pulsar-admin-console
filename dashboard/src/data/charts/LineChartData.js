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

import utils from 'services/utils'
import store from 'vuex-store'

let palette = store.getters.palette

const generateValue = () => {
  return Math.floor(Math.random() * 100)
}

const generateYLabels = () => {
  const flip = !!Math.floor(Math.random() * 2)
  return flip ? ['Debit', 'Credit'] : ['Credit', 'Debit']
}

const generateArray = (length) => {
  return Array.from(Array(length), generateValue)
}

const getSize = () => {
  const minSize = 4
  return minSize + Math.floor(Math.random() * 3)
}

export const getLineChartData = () => {
  const size = getSize()
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  const yLabels = generateYLabels()

  return {
    labels: months.splice(0, size),
    datasets: [
      {
        label: yLabels[0],
        backgroundColor: utils.hex2rgb(palette.primary, 0.6).css,
        borderColor: palette.transparent,
        data: generateArray(size),
      },
      {
        label: yLabels[1],
        backgroundColor: utils.hex2rgb(palette.info, 0.6).css,
        borderColor: palette.transparent,
        data: generateArray(size),
      },
    ],
  }
}
