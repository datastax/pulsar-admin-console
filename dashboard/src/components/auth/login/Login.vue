<template>

  <div class="login">
    <alert ref="alert" :errorText="errorText"></alert>

    <h2>{{ $t('auth.welcome') }}</h2>
    <!-- form method="post" action="/auth/login" name="login" -->
      <div class="form-group">
        <div class="input-group">
          <input type="text" id="email" required="required" v-model="email"/>
          <label class="control-label" for="email">
            Username
          </label>
          <i class="bar"/>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <input type="password" id="password" required="required" v-model="password"/>
          <label class="control-label" for="password">
            {{ $t('auth.password') }}
          </label>
          <i class="bar"/>
        </div>
      </div>
      <div class="d-flex align--center justify--space-between">
        <button class="btn btn-primary" type="submit" v-on:click="login">
          {{ $t('auth.login') }}
        </button>
      </div>
    <!-- /form -->
  </div>
</template>

<script>
    import { loginUser } from './auth'
    import Alert from '../../utils/Alert'
    import mixins from '@/services/mixins'


    export default {
        name: 'login',
        data() {
            return {
                email: '',
                password: '',
                errorText: ''
            }
        },
        mounted () {
          this.$store.dispatch('getClusterInfo')

          // Turn off stats polling
          this.$store.commit('setRunTimer', false)
          console.log('Stopping regular polling')
        },
        beforeDestroy () {
          // Turn on stats polling
          this.$store.commit('setRunTimer', true)
          console.log('Starting regular polling')

          // Trigger an update so we don't have to wait for the next interval
          this.$store.dispatch('updateAll')
        },
        mixins: [mixins],
        components: {
          Alert
        },
        methods: {
            async login() {
                try {
                    await loginUser(this.email, this.password)
                    this.$router.push('/')
                }
                catch (error) {
                      let [reason, statusCode] = this.decodeErrorObject(error)
                      this.errorText = `Login failed: ${reason} (${statusCode})`
                      this.$refs.alert.showAlert()

                }
            }
        }
    }
</script>

<style lang="scss">
.login {

  @include media-breakpoint-down(md) {
    width: 100%;
    padding-right: 2rem;
    padding-left: 2rem;
    .down-container {
      display: none;
    }
  }

  h2 {
    text-align: center;
  }
  width: 21.375rem;

  .down-container {
    margin-top: 3.125rem;
  }
}
</style>
