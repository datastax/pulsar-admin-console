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

<template>
  <div class="vuestic-chat">
    <div class="chat-body" :style="{'height': height}"
         v-sticky-scroll="{animate: true, duration: 500}">
      <div
        class="chat-message"
        v-for="(message, index) in value"
        :key="index"
        :class="{'yours': message.yours, 'alien': !message.yours}"
      >
        {{message.text}}
      </div>
    </div>
    <div class="chat-controls">
      <fieldset>
        <div class="form-group form-group-w-btn">
          <div class="input-group">
            <input @keypress="keyHandler($event)" v-model="inputMessage"
                   required title=""/>
            <label class="control-label">Your message</label><i class="bar"></i>
          </div>
          <div class="btn btn-sm btn-primary" :disabled="!canSend" @click="sendMessage()">Send</div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
import StickyScroll from 'vuestic-directives/StickyScroll'

export default {
  name: 'vuestic-chat',

  directives: { StickyScroll },

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    height: {
      default: '20rem',
    },
    canSend: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      inputMessage: '',
    }
  },

  methods: {
    keyHandler (event) {
      if (event.keyCode === 13) {
        this.sendMessage()
      }
    },

    sendMessage () {
      if (this.inputMessage && this.canSend) {
        this.$emit('input', this.value.concat({
          text: this.inputMessage,
          yours: true,
        }))
        this.inputMessage = ''
      }
    },
  },

  mounted () {
    // this.$emit('input', this.value)
  },
}
</script>

<style lang='scss' scoped>
$chat-body-min-height: 18.75rem;
$chat-body-mb: 1.5rem;
$chat-message-mb: 0.625rem;
$chat-message-py: 0.657rem;
$chat-message-px: 1.375rem;
$chat-message-br: 0.875rem;

.vuestic-chat {
  width: 100%;
}

.chat-body {
  min-height: $chat-body-min-height;
  display: flex;
  flex-direction: column;
  margin-bottom: $chat-body-mb;
  overflow: auto;
}

.chat-message {
  padding: $chat-message-py $chat-message-px;
  margin-bottom: $chat-message-mb;
  border-radius: $chat-message-br;
  max-width: 70%;
  overflow-wrap: break-word;

  &:last-child {
    margin-bottom: 0;
  }

  &.alien {
    align-self: flex-start;
    border-top-left-radius: 0;
    background-color: $light-gray2;
  }

  &.yours {
    align-self: flex-end;
    border-top-right-radius: 0;
    background-color: $brand-primary;
  }

  .chat-message-input {
    resize: vertical !important;
  }
}

</style>
