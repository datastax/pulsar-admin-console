<!--
  Copyright 2021 DataStax, Inc. 
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  
 -->

<script>
const $root = 'vuestic-timeline-separator'

export default {
  name: $root,
  functional: true,
  props: {
    vertical: Boolean,
    active: Boolean,
    activePrevious: Boolean,
    activeNext: Boolean,
  },
  render (createElement, context) {
    return createElement(
      'div',
      {
        class: {
          [$root]: true,
          [`${$root}--vertical`]: context.props.vertical,
        },
      },
      [
        createElement('div', {
          class: {
            [`${$root}__line`]: true,
            [`${$root}__line--active`]: context.props.activePrevious,
          },
        }),
        createElement('div', {
          class: {
            [`${$root}__center`]: true,
            [`${$root}__center--active`]: context.props.active,
          },
        }),
        createElement('div', {
          class: {
            [`${$root}__line`]: true,
            [`${$root}__line--active`]: context.props.activeNext,
          },
        }),
      ],
    )
  },
}
</script>

<style lang="scss">
@import '../../vuestic-sass/resources/resources';

.vuestic-timeline-separator {
  display: flex;
  align-items: center;
  &--vertical {
    flex-direction: column;
  }
  &__line {
    transition: background-color ease .5s;
    background-color: $lighter-gray;
    &--active {
      background-color: $brand-primary;
    }
    width: .125rem;
    height: .125rem;
    flex: 1;
  }
  &__center {
    background-color: $lighter-gray;
    &--active {
      background-color: $brand-primary;
    }
    flex: 0 0 1rem;
    width: 1rem;
    height: 1rem;
    border-radius: .5rem;
  }
}
</style>
