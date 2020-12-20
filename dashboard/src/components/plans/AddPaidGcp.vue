<template>
  <div class="add-paid-gcp" style="width: 100%">
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
            v-on:wizardComplete="addPlan()"
            ref="wizard">
            <div slot="plan" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>You have added a plan to your account in GCP Marketplace.</p>

               <p>
                  Click Next to complete the setup of your plan.
                </p>
                <div class="form-group with-icon-right"
                              :class="{'has-error': errors.has('selectedPlan'), 'valid': isFormFieldValid('selectedPlan')}">
                              <div class="input-group">
                                      <input id="plan"
                                      :value="getPlanName(entitlementInfo.plan)"
                                      class="has-value"
                                      v-validate="'required'"
                                      name="selectedPlan"
                                      data-vv-as="Plan"
                                      ref="planSelector"
                                      disabled
                                      />
                                      <i
                                      class="fa fa-exclamation-triangle error-icon icon-right input-icon icon-medium"></i>
                                      <label class="control-label" for="simple-input">{{'forms.inputs.selectedPlan' | translate}}</label><i class="bar"></i>
                              </div>
                </div>
              </div>

            </div>

            <div slot="dataCenter" class="form-wizard-tab-content">
              <div class="form-wizard-tab-content-text">
                <p>Pick the data center where you would like to create your plan. </p>

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
                      <input :value="getPlanName(entitlementInfo.plan)" id="plan-name" name="plan-name"
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
  name: 'AddPaidGcp',
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
      // selectedPlan: this.defaultPlan,
      planPaid: false,
      hostedPageId: '',
      userLogin: wpData.login,
      cancelRoute: '/plans?action=change'
    }
  },
  components: {
    OrbitSpinner,
    Alert
  },
  props: {
    defaultPlan: {
      type: String,
      default: 'starter',
    },
  },
  mounted () {
    // Get the latest plan info for this user
    this.$store.dispatch('getCurrentUserSubscriptions')
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
    letsGo () {
      // Turn off need to create plan
      this.$store.commit('setNeedToCreatePlan', 0)
      // this.$store.commit('setPlanToCreate', '')
      this.$router.push('/admin/dashboard')
    },
    validateFormField (fieldName) {
      this.$validator.validate(fieldName, this[fieldName])
    },
    async addPlan () {
      this.waiting = true

      try {
        const resp = await AjaxService.ajaxAction('add_plan',
          {
            dataCenter: this.dataCenter,
            plan: this.entitlementInfo.plan,
            entitlementId: this.entitlementInfo.entitlement_id,
            cloud: this.cloudProvider(this.dataCenter)
          })
        this.waiting = false
        console.log(resp)

        this.$store.commit('changeActiveCluster', this.dataCenter)
        this.$store.commit('setPlan', this.entitlementInfo.plan)

        // Update cluster information because it may have changed
        const allowClusterList = resp.data.data.cluster_list
        this.$store.commit('updateAllowedClusters', allowClusterList)
        this.$store.commit('updateNumAllowedClusters', allowClusterList.length)
        this.$store.dispatch('getClusterInfo')

        // Cancel the need to create a plan in the store
        // The add_plan will cancel it in the backend
        this.$store.commit('setPlanToCreate', '')
        this.$store.commit('setNeedToCreatePlan', 0)

        // Send email saying plan was sucessfully created
        const emailInfo = {
          subject: `New GCP plan created successfully`,
          body: `AddPlanGCP. Plan: ${this.entitlementInfo.plan} Data Center: ${this.dataCenter}`
        }
        this.$store.dispatch('sendEmail', emailInfo)

        return resp
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Creating plan: ${this.entitlementInfo.plan}. Reason: ${reason} (${statusCode})`

        this.$refs.alert.showAlert()

        this.$refs.wizard.resetWizard()
        this.agreedToTerms = false

        // Send email saying plan was sucessfully created
        const emailInfo = {
          subject: `Error creating new GCP plan`,
          body: `AddPlanGCP. Plan: ${this.entitlementInfo.plan} Data Center: ${this.dataCenter} Reason: ${reason} (${statusCode})`
        }
        this.$store.dispatch('sendEmail', emailInfo)
      }
    },
    getPlanName (plan) {
      return this.planInfo[plan] ? this.planInfo[plan].display_name : plan
    }
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'allowedClusters',
      'planInfo',
      'plan',
      'needToCreatePlan',
      'subscriptionInfo',
      'entitlementInfo',
      'currentAvailablePlans'
    ]),
    availablePlans () {
      return this.currentAvailablePlans
    },
    availableClusters () {
      // Make sure the plan info is present before trying to retrieve it
      if (this.planInfo.free && this.entitlementInfo) {
        console.log(this.planInfo)
        var allClusters = this.planInfo[this.entitlementInfo.plan].allowed_clusters

        console.log(allClusters)

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
            this.$validator.validate()
          },
          isValid: () => {
            return this.isFormFieldValid('selectedPlan')
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
