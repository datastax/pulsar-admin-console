<template>
  <div class="welcome-gcp" style="width: 100%">
    <alert ref="alert" :errorText="errorText"></alert>
    <div class="va-row">
      <div class="flex md12">
        <vuestic-widget class="simple-vertical-wizard-widget"
                        :headerText="$t('auth.welcome')">
          <vuestic-wizard
            :steps="vsSteps"
            wizard-layout="vertical"
            wizard-type="simple"
            v-on:wizardComplete="createTenantWithPlan()"
            ref="wizard">
            <div slot="page0" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Welcome to Kesque from the GCP Marketplace! </p>
              </div>

              <div v-if="entitlementInfo.plan">
                <p>
                  You have selected the following plan. Click Next to complete the setup of your plan.
                </p>

                <div class="form-group with-icon-right">
                              <div class="input-group">
                                      <input id="plan"
                                      :value="getPlanName(entitlementInfo.plan)"
                                      class="has-value"
                                      name="selectedPlan"
                                      ref="planSelector"
                                      disabled
                                      />
                                      <label class="control-label" for="simple-input">{{'forms.inputs.selectedPlan' | translate}}</label><i class="bar"></i>
                              </div>
                </div>
              </div>
              <div v-else>
                <div style="display: inline-block;">
                  <orbit-spinner
                    :animation-duration="1200"
                    :size="25"
                    color="#C5A54E"
                  />
                </div>
                <div style="display: inline-block; margin-left: 10px">
                  Waiting for plan info from GCP
                </div>
              </div>

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

                <vuestic-checkbox
                    label='I accept the Terms and Conditions'
                    v-model="agreedToTerms"
                    v-validate="'required:true'"
                    ref="termsSelect"
                    name="termsSelect"
                    :error="errors.has('termsSelect')"
                  />

              </div>
            </div>
            <div slot="page4" class="form-wizard-tab-content">
              <h4>{{'forms.wizard.confirmSelection' | translate}}</h4>

                <div class="form-group">
                  <div class="input-group">
                      <input :value="getPlanName(entitlementInfo.plan)" id="plan-name" name="plan-name"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="plan-name" role="button">{{'forms.inputs.selectedPlan'
                                                | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input v-model="dataCenter" id="data-center" name="data-center"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="data-center" role="button">{{'forms.inputs.dataCenter'
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
  name: 'WelcomeGcp',
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
      selectedPlan: this.defaultPlan,
      planPaid: false,
      hostedPageId: '',
      userLogin: wpData.login
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
      default: 'starter',
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
    // Get the latest entitlement info for this user
    // this.$store.dispatch('getCurrentUserEntitlements')

    // In case entitlement isn't updated yet, start polling
    setTimeout(this.pollForPlan, 1000)
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
    getPlanName (plan) {
      return this.planInfo[plan] ? this.planInfo[plan].display_name : plan
    },
    async pollForPlan () {
      console.log('Polling for plan info')

      if (!this.entitlementInfo.plan) {
        try {
          this.$store.dispatch('getCurrentUserEntitlements')
        } catch (error) {
          console.log(error)
        }
        setTimeout(this.pollForPlan, 1000)
      }
    },
    letsGo () {
      // Turn off need to create plan
      this.$store.commit('setNeedToCreatePlan', 0)
      this.$store.commit('setPlanToCreate', '')
      this.$router.push('/dashboard')
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
            plan: this.entitlementInfo.plan,
            hostedPageId: this.hostedPageId,
            entitlementId: this.entitlementInfo.entitlement_id,
            cloud: this.cloudProvider(this.dataCenter)

          })
        this.waiting = false
        // Update the tenant and region in the vuex store
        console.log(resp)

        this.$store.commit('setClientToken', resp.data.data.client_token)
        this.$store.commit('setAdminToken', resp.data.data.admin_token)
        this.$store.commit('changeActiveCluster', this.dataCenter)
        this.$store.commit('setTenant', this.tenantName)
        this.$store.commit('setPlan', this.entitlementInfo.plan)

        // Update cluster information because it may have changed
        const allowClusterList = resp.data.data.cluster_list
        this.$store.commit('updateAllowedClusters', allowClusterList)
        this.$store.commit('updateNumAllowedClusters', allowClusterList.length)
        this.$store.dispatch('getClusterInfo')

        // Send email saying plan was sucessfully created
        const emailInfo = {
          subject: `New tenant and GCP plan created successfully`,
          body: `WelcomeGcp. Tenant: ${this.tenantName} Plan: ${this.entitlementInfo.plan} Data Center: ${this.dataCenter}`
        }
        this.$store.dispatch('sendEmail', emailInfo)

        return resp
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating account for tenant: ${this.tenantName}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()

        this.$refs.wizard.resetWizard()
        this.agreedToTerms = false

        // Send email saying creation failed
        const emailInfo = {
          subject: `New tenant and GCP plan creation failed`,
          body: `WelcomeGcp. Tenant: ${this.tenantName} Plan: ${this.entitlementInfo.plan} Data Center: ${this.dataCenter} Reason: ${reason} (${statusCode})`
        }
        this.$store.dispatch('sendEmail', emailInfo)
      }
    },
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'allowedClusters',
      'planInfo',
      'plan',
      'needToCreatePlan',
      'billingProvider',
      'entitlementInfo',
      'currentAvailablePlans'
    ]),
    availablePlans () {
      return this.currentAvailablePlans
    },
    availableClusters () {
      // Make sure the plan info is present before trying to retrieve it
      if (this.planInfo.free && this.entitlementInfo.plan) {
        console.log('Plan Info:')

        console.log(this.planInfo)

        console.log(this.entitlementInfo.plan)
        return this.planInfo[this.entitlementInfo.plan].allowed_clusters
      }
      return []
    },
    vsSteps () {
      return [
        {
          label: 'Plan',
          slot: 'page0',
          onNext: () => {
            // this.$validator.validate()
            // this.validateFormField('selectedPlan')

          },
          isValid: () => {
            console.log(this.isFormFieldValid('selectedPlan'))

            return this.entitlementInfo.plan
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
