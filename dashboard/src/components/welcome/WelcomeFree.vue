<template>
  <div class="welcome-free" style="width: 100%">
    <alert ref="alert" :errorText="errorText"></alert>
    <div class="va-row">
      <div class="flex md12">
        <vuestic-widget class="simple-vertical-wizard-widget"
                        :headerText="$t('auth.welcome')">
          <vuestic-wizard
            :steps="vsSteps"
            wizard-layout="vertical"
            wizard-type="simple"
            v-on:wizardComplete="processNewPlan()"
            ref="wizard">
            <div slot="page1" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Welcome to Kesque! </p>
                <p>Let's get you started with our free plan. To start with one of our paid plans, go <a href="/signup-for-plan?plantocreate=starter">here</a>.
                </p>
                <p>
                  Before you begin, you need to pick a tenant name. We've created
                  a default name, but you change it to what you want (as long as no one else is already using it).
                </p>
              </div>
              <div class="form-group with-icon-right"
                   :class="{'has-error': errors.has('tenantName'), 'valid': isFormFieldValid('tenantName')}">
                <div class="input-group">
                  <input
                    name="tenantName"
                    data-vv-as="Tenant Name"
                    v-model="tenantName"
                    ref="tenantNameSelect"
                    v-validate="'required|alpha_dash|uniqueTenant'"
                    required title=""/>
                  <i
                    class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                  <i class="fa fa-check valid-icon icon-right input-icon"></i>
                  <label class="control-label">{{'forms.wizard.name' |
                    translate}}</label><i class="bar"></i>
                  <small v-show="errors.has('tenantName')" class="help text-danger">
                    {{ errors.first('tenantName') }}
                  </small>
                </div>
              </div>
              <div class="form-wizard-tab-content-text"></div>

            </div>
            <div v-if="planInfo[this.selectedPlan] && planInfo[this.selectedPlan].geo_replicated" slot="page2" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Kesque operates in multiple data centers around the world. Your free plan has access
                  to all these data centers. However, you need to pick a default data center. Typically you will
                  want to pick the data center closest to where you will run your applications.
                </p>
              </div>
              <vuestic-simple-select
                label="Select data center"
                v-model="dataCenter"
                name="Data Center"
                :required="true"
                ref="dataCenterSelect"
                v-bind:options="availableClusters">
              </vuestic-simple-select>
            </div>
            <div v-else slot="page2" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Pick the data center where you would like to create your plan. Typically you will
                  want to pick the data center where you will run your applications or one that is close by.
                </p>
              </div>
              <div class="form-group">
                <div class="va-row">
                  <div class="md4">
                    <vuestic-simple-select
                      label="Select data center"
                      v-model="dataCenter"
                      name="Data Center"
                      :required="true"
                      ref="dataCenterSelect"
                      v-bind:options="availableClusters">
                    </vuestic-simple-select>
                  </div>
                  <div class="md6">
                    <div class="input-group">
                        <input :value="cloudProvider(dataCenter)" id="cloud-provider" name="cloud-provider"
                        class="has-value" placeholder="" disabled />
                        <label class="control-label" for="cloud-provider" role="button">Cloud Provider</label><i class="bar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div slot="page3" class="form-wizard-tab-content">
              <h4>Terms and Conditions</h4>
              <div class="form-wizard-tab-content-text">

                <p>Please review and accept the <a target="_blank" href="/wpautoterms/terms-and-conditions/">terms and conditions.</a> </p>

              </div>
                <vuestic-checkbox
                    label='I accept the Terms and Conditions'
                    v-model="agreedToTerms"
                    v-validate="'required:true'"
                    ref="termsSelect"
                    name="termsSelect"
                    :error="errors.has('termsSelect')"
                  />
              <div class="form-wizard-tab-content-text"></div>

            </div>
            <div slot="page4" class="form-wizard-tab-content">
              <h4>{{'forms.wizard.confirmSelection' | translate}}</h4>

                <div class="form-group">
                  <div class="input-group">
                      <input v-model="planDisplayName" id="plan-name" name="plan-name"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="plan-name" role="button">{{'forms.inputs.selectedPlan'
                                                | translate}}</label><i class="bar"></i>
                  </div>
                </div>

                <div class="form-group">
                  <div class="input-group">
                      <input v-model="tenantName" id="tenant-name" name="tenant-name"
                      class="has-value" placeholder="" readonly />
                      <label class="control-label" for="tenant-name" role="button">{{'forms.inputs.tenantName'
                                                | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input v-model="dataCenter" id="data-center" name="data-center"
                      class="has-value" placeholder="" readonly />
                      <label v-if="planInfo[this.selectedPlan] && planInfo[this.selectedPlan].geo_replicated"
                      class="control-label" for="data-center" role="button">Default Data Center</label>
                      <label v-else
                      class="control-label" for="data-center" role="button">Data Center</label>
                      <i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input :value="cloudProvider(dataCenter)" id="cloud-data" name="cloud-data"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="cloud-data" role="button">Cloud Provider</label><i class="bar"></i>
                  </div>
                </div>
                <vuestic-checkbox
                    label='I accept the Terms and Conditions'
                    v-model="agreedToTerms"
                    :readonly="readonly"
                    name="readonlyTerms"
                    ref="readonlyTerms"
                    :disabled="readonly"
                  />

              <div class="form-wizard-tab-content-text">
                <p>Are these the values you want to use for your account?</p>

              </div>

            </div>
            <div slot="wizardCompleted" class="form-wizard-tab-content">

               <orbit-spinner
                v-if="waiting"
                :animation-duration="1200"
                :size="55"
                color="#C5A54E"
              />
              <h4 v-else>{{'forms.wizard.completed' | translate}}</h4>
              <div class="form-wizard-tab-content-text">

                <p v-if="waiting">We are working on creating your account. It should only take a few seconds.</p>

                <p v-else>Your Kesque account is ready to use! Get ready to start
                  building applications using the best cloud-native, geo-replicated, messaging
                  available.
                </p>
                <button v-if="!waiting" class="btn btn-primary" @click="letsGo()">
                  Let's Go
                </button>
              </div>
            </div>
          </vuestic-wizard>
        </vuestic-widget>
      </div>
    </div>
  </div>
</template>

<script>
import AjaxService from '@/services/AjaxService'
import { OrbitSpinner } from 'epic-spinners'
import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'

export default {
  name: 'WelcomeFree',
  data () {
    return {
      agreedToTerms: false,
      hsName: '',
      hsCountry: '',
      hrName: '',
      hrCountry: '',
      vrName: '',
      vrCountry: '',
      tenantName: this.defaultTenantName,
      errorText: 'Something went wrong',
      dataCenter: '',
      email: '',
      waiting: true,
      chosenCountry: '',
      readonly: true,
      selectedPlan: this.defaultPlan,
    }
  },
  components: {
    OrbitSpinner,
    Alert
  },
  props: {
    defaultTenantName: {
      type: String,
      default: '',
    },
    defaultPlan: {
      type: String,
      default: 'free2',
    },
  },
  created: function () {
    this.$validator.extend('falsy', (value) => !value)

    this.$validator.extend('uniqueTenant', {
      getMessage: field => 'Sorry, that tenant already exists.',
      immediate: false,
      validate: async value => {
        // console.log('Checking tenant name');

        try {
          await AjaxService.ajaxAction('unique_tenant',
            {
              tenant: this.tenantName,
              dataCenter: this.dataCenter
            })
          // console.log(resp);

          return true
        } catch (error) {
          let [reason, statusCode] = this.decodeErrorObject(error)

          return false
        }
      }
    })
  },
  methods: {
    isFormFieldValid (field) {
      let isValid = false
      if (this.formFields[field]) {
        // isValid = this.formFields[field].validated && this.formFields[field].valid
        isValid = this.formFields[field].valid
      }
      return isValid
    },
    processNewPlan () {
      console.log('Creating the tenant')
      this.createTenant()
    },
    validateFormField (fieldName) {
      this.$validator.validate(fieldName, this[fieldName])
    },
    async createTenant () {
      this.waiting = true

      try {
        const resp = await AjaxService.ajaxAction('initialize_tenant',
          {
            tenant: this.tenantName,
            dataCenter: this.dataCenter,
            plan: this.selectedPlan,
            agreedToTerms: this.agreedToTerms,
            cloud: this.cloudProvider(this.dataCenter)
          })
        this.waiting = false
        // Update the tenant and region in the vuex store
        // console.log(resp);

        this.$store.commit('setClientToken', resp.data.data.client_token)
        this.$store.commit('setAdminToken', resp.data.data.admin_token)
        this.$store.commit('changeActiveCluster', this.dataCenter)
        this.$store.commit('setTenant', this.tenantName)

        const allowClusterList = resp.data.data.cluster_list

        this.$store.commit('updateAllowedClusters', allowClusterList)
        this.$store.commit('updateNumAllowedClusters', allowClusterList.length)

        // Send email saying plan was sucessfully created
        const emailInfo = {
          subject: `New tenant and free plan created successfully`,
          body: `WelcomeFree. Tenant: ${this.tenantName} Plan: ${this.selectedPlan} Data Center: ${this.dataCenter}`
        }
        this.$store.dispatch('sendEmail', emailInfo)

        return resp
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating account for tenant: ${this.tenantName}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()

        this.$refs.wizard.resetWizard()
        this.agreedToTerms = false

        // Send email saying plan failed
        const emailInfo = {
          subject: `New tenant and free plan creation failed`,
          body: `WelcomeFree. Tenant: ${this.tenantName} Plan: ${this.selectedPlan} Data Center: ${this.dataCenter} Reason: ${reason} (${statusCode})`
        }
        this.$store.dispatch('sendEmail', emailInfo)
      }
    },
    letsGo () {
      // Turn off need to create plan
      this.$store.commit('setNeedToCreatePlan', 0)
      this.$store.commit('setPlanToCreate', '')
      this.$router.push('/dashboard')
    },
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'allowedClusters',
      'planInfo'
    ]),
    availableClusters () {
      // Make sure the plan info is present before trying to retrieve it
      if (this.planInfo.free) {
        // console.log(this.planInfo);
        // console.log(this.selectedPlan);

        return this.planInfo[this.selectedPlan].allowed_clusters
      }
      return []
    },
    planDisplayName () {
      return this.planInfo[this.selectedPlan] ? this.planInfo[this.selectedPlan].display_name : this.selectedPlan
    },
    vsSteps () {
      return [
        {
          label: 'Tenant Name',
          slot: 'page1',
          onNext: () => {
            this.validateFormField('tenantName')
            // this.$refs.tenantNameSelect.validate()
          },
          isValid: () => {
            return this.isFormFieldValid('tenantName')
            // return this.$refs.tenantNameSelect.isValid()
          },
        },
        {
          label: 'Data Center',
          slot: 'page2',
          onNext: () => {
            this.$refs.dataCenterSelect.validate()
          },
          isValid: () => {
            console.log(this.$refs.dataCenterSelect.isValid())

            return this.$refs.dataCenterSelect.isValid()
          },
        },
        {
          label: 'Terms and Conditions',
          slot: 'page3',
          onNext: () => {
            this.validateFormField('termsSelect')
          },
          isValid: () => {
            return this.isFormFieldValid('termsSelect')
          },
        },
        {
          label: 'Confirm',
          slot: 'page4',
          onNext: () => {

          },
          isValid: () => {
          },
          onBack: () => {
            this.agreedToTerms = false
          }
        },
      ]
    },
  }
}
</script>

<style lang="scss">
.signup {
  @include media-breakpoint-down(md) {
    width: 100%;
    padding-right: 2rem;
    padding-left: 2rem;
  }

  h2 {
    text-align: center;
  }
  width: 21.375rem;

  .down-container {
    margin-top: 2.6875rem;
  }
  .highlight {
    color: $brand-primary;
  }
}
</style>
