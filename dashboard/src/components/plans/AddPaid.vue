<template>
  <div class="add-paid" style="width: 100%">
    <alert ref="alert" :errorText="errorText"></alert>

    <div class="va-row">
      <div class="flex md12">
        <vuestic-widget class="simple-vertical-wizard-widget"
                        :headerText="$t('auth.addPlan')">
          <vuestic-wizard
            :steps="vsSteps"
            wizard-layout="vertical"
            wizard-type="simple"
            v-on:cancel="clearPlanSession()"
            cancelRoute="/admin/plans/change"
            v-on:wizardComplete="processNewPlan()"
            ref="wizard">
            <div slot="plan" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>You want to add a plan to your account? That's great.</p>

                <div v-if="false">
                  <p>Here are the current plans in your account:</p>

                  <div class="table-responsive">
                          <table class="table table-striped first-td-padding table-header-active">
                          <thead>
                          <tr>
                              <td>Data Center</td>
                              <td>Plan</td>
                              <td>Cloud</td>
                          </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(subscription, index) in subscriptionInfo" :key="index">

                              <td>{{ subscription.data_center }} </td>
                              <td>{{ subscription.plan }}</td>
                              <td>{{ subscription.cloud }} </td>
                              </tr>
                          </tbody>
                          </table>
                  </div>
                  <p>
                  For details on the plans and their prices, go <a target="_blank" href="/pricing">here</a>.</p>

                </div>
                <div v-else>
                  <p>To activate a paid plan for the first time, you will need to provide payment details.
                  For details on the plans and their prices, go <a target="_blank" href="/pricing">here</a>.</p>
                </div>
                  <p>
                  What plan do you want to add?
                  </p>
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
            <div slot="dataCenter" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Pick the data center where you would like to create your plan. </p>

                  <p>
                    You can
                    only add plans to data centers that don't already have a plan. If you want to
                    upgrade an existing plan, go <a href="/dashboard/#/plans?action=change">here</a>.
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
                        <input :value="cloudProvider(dataCenter)" id="cloud" name="cloud"
                        class="has-value" placeholder="" disabled />
                        <label class="control-label" for="cloud" role="button">Cloud Provider</label><i class="bar"></i>
                    </div>
                  </div>
                </div>
              </div>
                            <div class="form-wizard-tab-content-text"></div>

            </div>
            <div slot="confirm" class="form-wizard-tab-content">
              <h4>{{'forms.wizard.confirmSelection' | translate}}</h4>

                <div class="form-group">
                  <div class="input-group">
                      <input v-model="selectedPlan.name" id="plan-name" name="plan-name"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="plan-name" role="button">{{'forms.inputs.selectedPlan'
                                                | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input v-model="dataCenter" id="data" name="data"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="data" role="button">{{'forms.inputs.dataCenter'
                                                | translate}}</label><i class="bar"></i>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                      <input :value="cloudProvider(dataCenter)" id="cloud-provider" name="cloud-provider"
                      class="has-value" placeholder="" disabled />
                      <label class="control-label" for="cloud-provider" role="button">Cloud Provider</label><i class="bar"></i>
                  </div>
                </div>

                <p v-if="isPaymentRequired(selectedPlan.id)"><span class="vue-highlighted-text">Note:</span> Payment required to activate this plan.</p>

              <div class="form-wizard-tab-content-text">
                <p>Are these the values you want to use for your new plan?</p>

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

                <p v-if="waiting">We are working on creating your plan. It should only take a few seconds.</p>

                <p v-else>Your new Kesque plan is ready to use!
                </p>
                <button v-if="!waiting" class="btn btn-primary" @click="$router.push('dashboard')">
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
  name: 'AddPaid',
  data () {
    return {
      agreedToTerms: false,
      hsName: '',
      hsCountry: '',
      hrName: '',
      hrCountry: '',
      vrName: '',
      vrCountry: '',
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
      userLogin: wpData.login,
      cancelRoute: '/plans?action=change'
    }
  },
  watch: {
    planInfo: function (val) {
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
    defaultPlan: {
      type: String,
      default: 'starter'
    },
  },
  mounted () {
    // Get the latest plan info for this user
    this.$store.dispatch('getCurrentUserSubscriptions')

    if (this.planInfo[this.selectedPlan.id]) {
      this.selectedPlan = {
        id: this.selectedPlan.id,
        name: this.planInfo[this.selectedPlan.id].display_name
      }
    }
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
    isPaymentRequired (plan) {
      console.log(plan)
      console.log(this.planInfo)

      if (!this.planInfo[plan]) {
        return true
      }
      if (this.planInfo[plan].paid === '1') {
        return true
      } else {
        return false
      }
    },
    storeHostedPageId (hostedPageId) {
      console.log(`Storing ${hostedPageId}`)
    },
    processNewPlan () {
      if (this.isPaymentRequired(this.selectedPlan.id) && (this.planPaid === false)) {
        this.openCheckout()
      } else {
        this.addPlan()
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
          // We will discuss on how to implement this end point in the next step.
          return axios.post('/wp-json/billing/generate_hp_url/',
            {
              'invoiceNotes': invoiceNotes,
              'userLogin': this.userLogin,
              'billingPlan': billingPlan,
              'dataCenter': this.dataCenter
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
            this.addPlan()
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
    async clearPlanSession () {
      console.log('Clearing session plan to create')
      this.$store.commit('setPlanToCreate', '')
      this.$store.commit('setNeedToCreatePlan', 0)
      try {
        const resp = await AjaxService.ajaxAction('clear_session', {})
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        errorText = `Error clearing session. Reason: ${reason} (${statusCode})`
        console.log(errorText)
      }
    },
    async addPlan () {
      this.waiting = true

      try {
        const resp = await AjaxService.ajaxAction('add_plan',
          {
            dataCenter: this.dataCenter,
            plan: this.selectedPlan.id,
            hostedPageId: this.hostedPageId,
            cloud: this.cloudProvider(this.dataCenter)
          })
        this.waiting = false
        console.log(resp)

        this.$store.commit('changeActiveCluster', this.dataCenter)
        this.$store.commit('setPlan', this.selectedPlan.id)

        // Update cluster information because it may have changed
        const allowClusterList = resp.data.data.cluster_list
        this.$store.commit('updateAllowedClusters', allowClusterList)
        this.$store.commit('updateNumAllowedClusters', allowClusterList.length)
        this.$store.dispatch('getClusterInfo')

        // Cancel the need to create a plan in the store
        // The add_plan will cancel it in the backend
        this.$store.commit('setPlanToCreate', '')
        this.$store.commit('setNeedToCreatePlan', 0)

        // Update the namespaces
        this.$store.dispatch('getNamespaces')

        // Send email saying plan was sucessfully created
        const emailInfo = {
          subject: `New plan created successfully`,
          body: `AddPlan. Plan: ${this.selectedPlan.id} Data Center: ${this.dataCenter}`
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
        this.errorText = `Creating plan: ${this.selectedPlan.name}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()

        this.$refs.wizard.resetWizard()
        this.agreedToTerms = false

        // Send email saying plan failed
        const emailInfo = {
          subject: `New plan creation failed`,
          body: `AddPlan. Plan: ${this.selectedPlan.id} Data Center: ${this.dataCenter} Reason: ${reason} (${statusCode})`
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
      'planToCreate',
      'needToCreatePlan',
      'subscriptionInfo',
      'chargebeeSite',
      'entitlementInfo',
      'currentAvailablePlans'
    ]),
    availablePlans () {
      var plansObjectList = []
      this.currentAvailablePlans.forEach(plan => {
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
        console.log(this.selectedPlan.id)

        var allClusters = this.planInfo[this.selectedPlan.id].allowed_clusters

        var existingClusters = []

        if (this.subscriptionInfo) {
          this.subscriptionInfo.forEach(subscription => {
            existingClusters.push(subscription.data_center)
          })
        }

        console.log(existingClusters)

        // Remove clusters that are already available
        var filtered = allClusters.filter(function (value, index, arr) {
          return existingClusters.indexOf(value) === -1
        })

        return filtered
      }
      return []
    },
    vsSteps () {
      return [
        {
          label: 'Plan',
          slot: 'plan',
          onNext: () => {
            this.$refs.planSelect.validate()
          },
          isValid: () => {
            return this.$refs.planSelect.isValid()
          },
        },
        {
          label: 'Data Center',
          slot: 'dataCenter',
          onNext: () => {
            this.$refs.dataCenterSelect.validate()
          },
          isValid: () => {
            return this.$refs.dataCenterSelect.isValid()
          },
        },
        {
          label: 'Confirm',
          slot: 'confirm',
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
