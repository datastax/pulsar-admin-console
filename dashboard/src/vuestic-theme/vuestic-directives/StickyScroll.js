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
  bind: (el, binding) => {
    let duration = binding.value.duration || 500
    let isAnimated = binding.value.animate

    let observer = new MutationObserver(scrollToBottom)
    let config = { childList: true }
    observer.observe(el, config)

    function animateScroll (duration) {
      let start = el.scrollTop
      let end = el.scrollHeight
      let change = end - start
      let increment = 20

      function easeInOut (currentTime, start, change, duration) {
        currentTime /= duration / 2
        if (currentTime < 1) {
          return change / 2 * currentTime * currentTime + start
        }
        currentTime -= 1
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start
      }

      function animate (elapsedTime) {
        elapsedTime += increment
        var position = easeInOut(elapsedTime, start, change, duration)
        el.scrollTop = position

        if (elapsedTime < duration) {
          setTimeout(function () {
            animate(elapsedTime)
          }, increment)
        }
      }

      animate(0)
    }

    function scrollToBottom () {
      if (isAnimated) {
        animateScroll(duration)
      } else {
        el.scrollTop = el.scrollHeight
      }
    }
  },
}
