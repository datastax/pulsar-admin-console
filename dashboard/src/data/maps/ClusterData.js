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

let latlong = {}

latlong['asiaeast2-gcp'] = {
  'latitude': 22.25,
  'longitude': 114.1667,
}
latlong['useast1-gcp'] = {
  'latitude': 33,
  'longitude': -80,
}

latlong['eucentral1-aws'] = {
  'latitude': 50,
  'longitude': 9,
}

let data = [{
  'code': 'asiaeast2-gcp',
  'name': 'Google Asia East (Hong Kong)',
  'value': 'asiaeast2-gcp',
  'color': '#188FFF',
}, {
  'code': 'useast1-gcp',
  'name': 'Google US East (South Carolina)',
  'value': 'useast1-gcp',
  'color': '#188FFF',
} ]

export default {
  data,
  latlong,
}
