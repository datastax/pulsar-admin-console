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
