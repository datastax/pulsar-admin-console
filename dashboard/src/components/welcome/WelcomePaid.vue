<template>
  <div class="welcome-paid" style="width: 100%">
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
            <div slot="page0" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Welcome to Kesque! </p>
                <p>
                  Before we continue, let's confirm your plan selection.
                </p>
                <p>Note that to activate a plan, you will need to provide payment details. To start with the free plan instead, go <a href="/signup-for-plan">here</a>.
                 For details on the plans and their prices, go <a href="/pricing">here</a>.</p>
              </div>
              <vuestic-simple-select
                label="Select plan"
                v-model="selectedPlan"
                name="Selected Plan"
                :required="true"
                :clearable="false"
                ref="planSelect"
                optionKey="name"
                v-bind:options="availablePlans">
              </vuestic-simple-select>
              <div class="form-wizard-tab-content-text"></div>

            </div>
            <div slot="page1" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Pick the data center where you would like to create your plan. Typically you will
                  want to pick the data center where you will run your applications or one that is close by.
                </p>
                <!-- <p>
                  Note that the suffix incates the cloud provider. Data centers that end in 'gcp' are in
                  Google Cloud Platform. Data centers that end in 'aws' are in Amazon Web Services.
                </p> -->
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
                        <input :value="cloudProvider(dataCenter)" id="cloud-data" name="cloud-data"
                        class="has-value" placeholder="" disabled />
                        <label class="control-label" for="cloud-data" role="button">Cloud Provider</label><i class="bar"></i>
                    </div>
                  </div>
                </div>
              </div>
                            <div class="form-wizard-tab-content-text"></div>

            </div>
            <div slot="page2" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>
                  You need to pick a tenant name. This name will be part of the full topic name. We've created
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
                      <input v-model="selectedPlan.name" id="selected-plan" name="selected-plan"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="selected-plan" role="button">{{'forms.inputs.selectedPlan'
                                                | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input v-model="dataCenter" id="datacenter" name="datacenter"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="datacenter" role="button">{{'forms.inputs.dataCenter'
                                                | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input :value="cloudProvider(dataCenter)" id="cloud-provider-data" name="cloud-provider-data"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="cloud-provider-data" role="button">Cloud Provider</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input v-model="tenantName" id="tenant-name" name="tenant-name"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="tenant-name" role="button">{{'forms.inputs.tenantName'
                                                | translate}}</label><i class="bar"></i>
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
                color="#188FFF"
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
import axios from 'axios'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'

export default {
  name: 'WelcomePaid',
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
      paymentRequired: true,
      dataCenter: '',
      email: '',
      waiting: true,
      chosenCountry: '',
      readonly: true,
      selectedPlan: {
        id: this.defaultPlan,
        name: ''
      },
      planPaid: false,
      hostedPageId: '',
      userLogin: wpData.login
    }
  },
  watch: {
    planInfo: function (val) {
      console.log('Plan info changed')
      this.selectedPlan = {
        id: this.selectedPlan.id,
        name: this.planInfo[this.selectedPlan.id].display_name
      }
    },
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
      default: 'starter'
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
  mounted () {
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
    storeHostedPageId (hostedPageId) {
      console.log(`Storing ${hostedPageId}`)
    },
    processNewPlan () {
      if (this.paymentRequired && (this.planPaid === false)) {
        this.openCheckout()
      } else {
        this.createTenantWithPlan()
      }
    },
    openCheckout () {
      let chargebeeInstance = Chargebee.getInstance()

      let billingPlan = this.selectedPlan.id + '-' + this.cloudProvider(this.dataCenter).toLowerCase()

      let invoiceNotes = this.selectedPlan.id.charAt(0).toUpperCase() + this.selectedPlan.id.slice(1) +
                          ' Plan in ' + this.cloudProvider(this.dataCenter) + ' ' + this.dataCenter

      console.log(billingPlan)

      chargebeeInstance.openCheckout({
        // This function returns a promise that resolves a hosted page object.
        // If the library that you use for making ajax calls, can return a promise, you can directly return that

        hostedPage: () => {
          return axios.post('/wp-json/billing/generate_hp_url/',
            {
              'userLogin': this.userLogin,
              'billingPlan': billingPlan,
              'dataCenter': this.dataCenter,
              'invoiceNotes': invoiceNotes
            })
            .then((response) => response.data)
        },
        loaded: () => {
          console.log('checkout opened')
        },
        close: () => {
          this.loading = false
          console.log('checkout closed')
          console.log(this.planPaid)
          if (!this.planPaid) {
            this.$refs.wizard.unCompleteWizard()
          } else {
            this.createTenantWithPlan()
          }
        },
        success: (hostedPageId) => {
          console.log(hostedPageId)
          console.log(this.planPaid)

          this.planPaid = true
          this.hostedPageId = hostedPageId

          // Hosted page id will be unique token for the checkout that happened
          // You can pass this hosted page id to your backend
          // and then call our retrieve hosted page api to get subscription details
          // https://apidocs.chargebee.com/docs/api/hosted_pages#retrieve_a_hosted_page
        },
        step: (value) => {
          // value -> which step in checkout
          console.log(value)
        },
        error: (error) => {
          this.errorText = `Getting billing page. ${error}`
          this.$refs.alert.showAlert()

          this.$refs.wizard.unCompleteWizard()
        }
      })
    },
    validateFormField (fieldName) {
      this.$validator.validate(fieldName, this[fieldName])
    },
    async createTenantWithPlan () {
      this.waiting = true

      try {
        const resp = await AjaxService.ajaxAction('initialize_tenant',
          {
            tenant: this.tenantName,
            dataCenter: this.dataCenter,
            agreedToTerms: this.agreedToTerms,
            plan: this.selectedPlan.id,
            hostedPageId: this.hostedPageId,
            cloud: this.cloudProvider(this.dataCenter)

          })
        this.waiting = false
        // Update the tenant and region in the vuex store
        console.log(resp)

        this.$store.commit('setClientToken', resp.data.data.client_token)
        this.$store.commit('setAdminToken', resp.data.data.admin_token)
        this.$store.commit('changeActiveCluster', this.dataCenter)
        this.$store.commit('setTenant', this.tenantName)
        this.$store.commit('setPlan', this.selectedPlan.id)

        // Update cluster information because it may have changed
        const allowClusterList = resp.data.data.cluster_list
        this.$store.commit('updateAllowedClusters', allowClusterList)
        this.$store.commit('updateNumAllowedClusters', allowClusterList.length)
        this.$store.dispatch('getClusterInfo')

        // Send email saying plan was sucessfully created
        const emailInfo = {
          subject: `New tenant and paid plan created successfully`,
          body: `WelcomePaid. Tenant: ${this.tenantName} Plan: ${this.selectedPlan.id} Data Center: ${this.dataCenter}`
        }
        this.$store.dispatch('sendEmail', emailInfo)

        try {
          // Record a conversion in Google Ads
          let value = '0'
          if (this.selectedPlan.id.includes('dedicated')) {
            value = '349.0'
          } else if (this.selectedPlan.id.includes('production')) {
            value = '599.0'
          } else if (this.selectedPlan.id.includes('starter')) {
            value = '59.0'
          }
          if (value !== '0') {
          // eslint-disable-next-line no-undef
            gtag_report_paid_conversion(value, url)
          }
        } catch (error) {
          console.log('Error recording conversion in Google Ads')
        }

        return resp
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating account for tenant: ${this.tenantName}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()

        this.$refs.wizard.resetWizard()
        this.agreedToTerms = false

        // Send email saying plan failed
        const emailInfo = {
          subject: `New tenant and paid plan creation failed`,
          body: `WelcomePaid. Tenant: ${this.tenantName} Plan: ${this.selectedPlan.id} Data Center: ${this.dataCenter} Reason: ${reason} (${statusCode})`
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
      'planInfo',
      'plan',
      'planToCreate',
      'needToCreatePlan',
      'chargebeeSite',
      'currentPaidPlans'
    ]),
    availablePlans () {
      var plansObjectList = []
      this.currentPaidPlans.forEach(plan => {
        console.log(plan)
        var planName = this.planInfo[plan] ? this.planInfo[plan].display_name : 'unknown'
        plansObjectList.push({
          id: plan,
          name: planName
        })
      })

      return plansObjectList
    },
    availableClusters () {
      // Make sure the plan info is present before trying to retrieve it
      if (this.planInfo.free) {
        console.log(this.planInfo)
        return this.planInfo[this.selectedPlan.id].allowed_clusters
      }
      return []
    },
    vsSteps () {
      return [
        {
          label: 'Plan',
          slot: 'page0',
          onNext: () => {
            this.$refs.planSelect.validate()
          },
          isValid: () => {
            return this.$refs.planSelect.isValid()
          },
        },
        {
          label: 'Data Center',
          slot: 'page1',
          onNext: () => {
            this.$refs.dataCenterSelect.validate()
          },
          isValid: () => {
            return this.$refs.dataCenterSelect.isValid()
          },
        },
        {
          label: 'Tenant Name',
          slot: 'page2',
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
