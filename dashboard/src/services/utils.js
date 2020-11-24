export default {
  hex2rgb (hex, opacity) {
    hex = (hex + '').trim()

    let rgb = null
    let match = hex.match(/^#?(([0-9a-zA-Z]{3}){1,3})$/)

    if (!match) {
      return null
    }

    rgb = {}

    hex = match[1]

    if (hex.length === 6) {
      rgb.r = parseInt(hex.substring(0, 2), 16)
      rgb.g = parseInt(hex.substring(2, 4), 16)
      rgb.b = parseInt(hex.substring(4, 6), 16)
    } else if (hex.length === 3) {
      rgb.r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16)
      rgb.g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16)
      rgb.b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16)
    }

    rgb.css = 'rgb' + (opacity ? 'a' : '') + '('
    rgb.css += rgb.r + ',' + rgb.g + ',' + rgb.b
    rgb.css += (opacity ? ',' + opacity : '') + ')'

    return rgb
  },
  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  array_diff (a1, a2) {
    var a = []
    var diff = []

    for (let i = 0; i < a1.length; i++) {
      a[a1[i]] = true
    }

    for (let i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]]
      } else {
        a[a2[i]] = true
      }
    }

    for (var k in a) {
      diff.push(k)
    }

    return diff
  }
}
