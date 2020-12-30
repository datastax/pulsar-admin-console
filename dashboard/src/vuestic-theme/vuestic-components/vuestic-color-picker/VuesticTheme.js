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

export const VuesticTheme = {
  Primary: 'Primary',
  Danger: 'Danger',
  Info: 'Info',
  Success: 'Success',
  Warning: 'Warning',
  White: 'White',
  Black: 'Black',
}

export const colorConfig = {
  [VuesticTheme.Primary]: '#4ae387',
  [VuesticTheme.Danger]: '#e34a4a',
  [VuesticTheme.Info]: '#4ab2e3',
  [VuesticTheme.Success]: '#db76df',
  [VuesticTheme.Warning]: '#f7cc36',
  [VuesticTheme.White]: '#fff',
  [VuesticTheme.Black]: '#000',
}

export const colorArray = Object.values(colorConfig)
