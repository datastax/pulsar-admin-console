<template>
    <div class="credentials">
        <vuestic-widget headerText="Credentials">
            <alert ref="alert" :errorText="errorText"></alert>
            <div>
                <h5>Connect token</h5>
                <p>When connecting clients, you need provide your connect token to identify your account. In all the Pulsar APIs,
                    you specify the token when creating the client object. The token is your password to your account, so keep it safe.</p>

                        <div v-if="useTokenList !== 'true'">
                            <p>The code samples automatically add your client token as part of the source code for convenience. However, a more secure practice would
                                be to read the token from an environment variable or a file.</p>
                            <p>Here is your connect token (click to show):</p>
                            <div class="form-group with-icon-right display-block">
                                <vuestic-collapse>
                                    <span slot="header">Click to show connect token</span>
                                    <div slot="body">
                                    <div class="va-row">
                                        <div class="flex md12">
                                        <div class="collapse-page__content">
                                            <div class="token">
                                            {{ clientToken}}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </vuestic-collapse>
                                <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="clientToken"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                            </div>
                        </div>
                        <div v-else>
                            <p>The code samples automatically add the default client token as part of the source code for convenience. However, a more secure practice would
                                be to read the token from an environment variable or a file.</p>
                            <p>Here are your connect tokens (click to show):</p>
                            
                            <div v-for="tokenInfo in tokenList" :key="tokenInfo.role" class="form-group with-icon-right display-block">
                                <vuestic-collapse>
                                    <span slot="header">Click to show connect token: {{tokenInfo.label}}</span>
                                    <div slot="body">
                                    <div class="va-row">
                                        <div class="flex md12">
                                        <div class="collapse-page__content">
                                            <div class="token">
                                            {{ tokenInfo.token}}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </vuestic-collapse>
                                <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="tokenInfo.token"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                            </div>
                        </div>
                        <div v-if="isAdminUser" class="flex md6">
                            <button class="btn btn-micor" @click="openTokenModal()">Create New Token</button>
                        </div>

                <h5>CA Certificate</h5>

                        <p>The clsuter may be using certificates signed by trusted certicate authorities, for example, Let's Encrypt. That means that you
                            can use the default set of certificate authorities in your environment. The path to the default CA bundle
                            varies by environment. For example:
                        </p>
                        <div class="flex md6">
                            <ul>
                                <li>{{rhelCaBundle}} (RHEL/CentOS)
                                    <i class="fa fa-clipboard icon-table pointer" v-clipboard:copy="rhelCaBundle"
                            v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                                </li>
                                <li>{{ubuntuCaBundle}} (Debian/Ubuntu)
                                    <i class="fa fa-clipboard icon-table pointer" v-clipboard:copy="ubuntuCaBundle"
                            v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                                </li>
                            </ul>
                        </div>

                        <p>On OSX run this command to export the default certificates to a file:</p>

                        <div class="form-group with-icon-right">
                            <pre v-highlightjs="osxCommand"><code class="java"></code></pre>
                            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="osxCommand"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                        </div>
                        <p>
                            If the cluster is not using a public certificate authority, here is the private CA certificate:
                        </p>
                        <div class="form-group with-icon-right display-block">
                            <vuestic-collapse>
                                <span slot="header">Click to show CA certificate</span>
                                <div slot="body">
                                <div class="va-row">
                                    <div class="flex md12">
                                    <div class="collapse-page__content">
                                        <div class="pre">{{ caCertificate}}</div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </vuestic-collapse>
                            <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="caCertificate"
                                  v-clipboard:success="onCopy" v-clipboard:error="onError">
                                </i>
                        </div>
                        <p>Most Pulsar APIs can be configured to skip certificate validation, but this is not recommended. </p>
            </div>
            <vuestic-modal ref="tokenModal"
                      :okText="'modal.ok' | translate"
                      v-on:ok="resetToken()"
                      v-on:cancel="resetToken()"
                      :cancelText="'modal.cancel' | translate">
                    <div slot="title">Create Token</div>
                    <div>
                        <div class="form-group with-icon-right">
                            <div class="input-group">
                            <input v-model="newSubject" 
                                id="subject"
                                v-validate="'required|alpha_dash|min:1'"
                                name="subject"/>
                            <label class="control-label" for="subject" role="button">Subject</label><i class="bar"></i>
                            <small v-show="errors.has('subject')"
                                    class="help text-danger">
                                {{ errors.first('subject') }}
                            </small>
                            <i class="fa fa-times icon-right input-icon pointer"
                                            @click="clear('subject')"></i>
                            </div>
                        </div>
                        
                        <div class="flex md12">
                            <button :disabled="this.newSubject === '' || errors.has('subject')" class="btn btn-micro" @click="createToken()">Create Token</button>
                        </div>

                     
                        <div v-if="generatedSubject" class="form-group with-icon-right" style="padding-top: 50px;">
                
                            <div  class="input-group">
                            <input :value="generatedSubject" id="generatedSubject" name="generatedSubject" readonly class="has-value" />
                            <label class="control-label" for="generatedSubject" role="button">Token Subject</label><i class="bar"></i>
                            </div>
                        </div>

                    
                        <div v-if="generatedToken" class="form-group with-icon-right display-block">
                                
                                <vuestic-collapse>
                                    <span slot="header">Click to show token</span>
                                    <div slot="body">
                                        
                                    <div class="va-row">
                                        <div class="flex md12">
                                        <div class="collapse-page__content">
                                            <div class="token">
                                            {{ generatedToken }}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </vuestic-collapse>
                                <i class="fa fa-clipboard icon-right input-icon pointer icon-medium" v-clipboard:copy="generatedToken"
                                    v-clipboard:success="onCopy" v-clipboard:error="onError">
                                    </i>
                        </div>

                    </div>
                </vuestic-modal>

        </vuestic-widget>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'
import ApiService from '@/services/ApiService'

export default {
  name: 'Credentials',
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'clientToken',
      'activeCluster',
      'caCertificate',
      'useTokenList',
      'tokenList',
      'isAdminUser'
    ]),
  },
  components: {
      Alert
  },
  data () {
    return {
      rhelCaBundle: '/etc/ssl/certs/ca-bundle.crt',
      ubuntuCaBundle: '/etc/ssl/certs/ca-certificates.crt',
      osxCommand: 'security find-certificate -a -p /System/Library/Keychains/SystemCACertificates.keychain > ca-certificates.crt',
      newSubject: '',
      generatedSubject: '',
      generatedToken: '',
      errorText: ''
    }
  },
  mounted () {
    // Turn off stats polling
    this.$store.commit('setRunTimer', false)
    console.log('Stopping regular polling')
    console.log('Use Token List ' + this.useTokenList)
    if (this.useTokenList === 'true') {
        this.$store.dispatch('getTokenList')
    }
  },
  beforeDestroy () {
    // Turn on stats polling
    this.$store.commit('setRunTimer', true)
    console.log('Starting regular polling')

    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    openTokenModal () {
      this.$refs.tokenModal.open()
    },
    resetToken () {
        this.generatedSubject = ''
        this.generatedToken = ''
        this.newSubject = ''
    },
    async createToken () {

      try {
        const response = await ApiService.generateToken(this.activeCluster, this.newSubject)

        console.log(response)
        this.generatedSubject = response.data.subject
        this.generatedToken = response.data.token

      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Generating token. Reason: ${reason} (${statusCode})`

        // If something goes wrong, close the modal so the user can see the alert
        this.$refs.tokenModal.close()
        this.resetToken
        this.$refs.alert.showAlert()
      }
    }
  }

}
</script>

<style scoped>

.display-block {
    display: block
}

.icon-medium {
  font-size: 25px;
}

.token {
    overflow-wrap: break-word
}
.pre {
    display: block;
    unicode-bidi: embed;
    font-family: monospace;
    white-space: pre;
}

</style>
