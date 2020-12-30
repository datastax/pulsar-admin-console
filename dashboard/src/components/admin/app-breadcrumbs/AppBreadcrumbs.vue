<template>
  <div class="va-row">
    <div class="flex md12 xs12">
      <transition name="fade">
          <div class='vuestic-alert alert alert-info' v-if="noticeText">
            <span class="badge badge-pill badge-info">NOTICE</span>
            {{ noticeText }}
          </div>
          <div v-if="debugInfo">
            T: {{ runTimer }} F: {{ runFunctionTimer }} Si: {{ runSinkTimer }}
          </div>
      </transition>
      <vuestic-widget class="no-padding no-v-padding">
        <vuestic-breadcrumbs
          :breadcrumbs="breadcrumbs"
          :currentRouteName="currentRouteName"
        />
      
      </vuestic-widget>
    </div>
  </div>
</template>

<script>
import { breadcrumbs } from './Breadcrumbs'
import { mapGetters } from 'vuex'

export default {
  name: 'app-breadcrumbs',
  data () {
    return {
      breadcrumbs: breadcrumbs,
      debugInfo: false
    }
  },
  computed: {
    ...mapGetters([
      'noticeText',
      'runTimer',
      'runFunctionTimer',
      'runSinkTimer'
    ]),
    currentRouteName () {
      return this.$route.name
    },
  },
}

</script>
