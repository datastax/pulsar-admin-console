<template>
  <div class="change-plan" style="width: 100%">
      <div class="flex md12">

        <alert ref="alert" :errorText="errorText"></alert>

        <div class="va-row" >

            <div class="flex xs12 md12" >
                <vuestic-widget :headerText="$t('menu.managePlans') + ' Plans'">

                    <h5>Current Subscriptions</h5>
                    <div class="table-responsive">
                        <table class="table table-striped first-td-padding table-header-active">
                        <thead>
                        <tr>
                            <td>Data Center</td>
                            <td>Plan</td>
                            <td>Cloud</td>
                            <td>Namespaces</td>
                            <td>Functions/<br>Sinks/<br>Sources</td>
                            <td>Users</td>
                            <td v-show="false">Sub ID</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(subscription, index) in subscriptionInfo" :key="index">

                            <td>{{ subscription.data_center }} </td>
                            <td v-if="indexToSpin === index && showSpinner">
                              <hollow-dots-spinner
                                :animation-duration="1500"
                                :dot-size="10"
                                color="#C5A54Eb"
                                />

                              </td>
                            <td v-else>{{ getPlanDisplayName(subscription.plan)}}</td>
                            <td>{{ subscription.cloud }} </td>
                            <td v-if="planInfo[subscription.plan]">{{ planInfo[subscription.plan].max_namespaces }} </td>
                            <td v-if="planInfo[subscription.plan]">{{ planInfo[subscription.plan].max_functions }} </td>
                            <td v-if="planInfo[subscription.plan]">{{ planInfo[subscription.plan].max_org_users }} </td>
                        <td v-else></td>
                            <td v-show="false">{{ subscription.subscription_id }}</td>
                            <td v-if="billingProvider === 'gcp'">
                                Go to <a target="_blank" :href="gcpMarketplaceLink">GCP Marketplace</a> to change your plan.
                            </td>
                            <td v-else>
                                <button :disabled="isPrivatePlan(subscription.plan)" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmChange(index)">Change</button>
                                <button  :disabled="isPrivatePlan(subscription.plan)" class="btn btn-primary btn-micro btn-bottom-margin" @click="confirmDelete(index)" >Delete</button>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>

                    <vuestic-modal :show.sync="showDeleteModal" ref="deleteModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="deleteSubscription()"
                                            v-on:cancel="subscriptionToChange=''"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Delete Subscription</div>

                                <div>
                                    <div class="form-group">
                                      <div class="input-group">
                                          <input :value="getPlanDisplayName(oldPlan)" id="old-plan-name" name="old-plan-name"
                                          class="has-value" placeholder="" readonly />
                                          <label class="control-label" for="old-plan-name" role="button">Plan</label><i class="bar"></i>
                                      </div>
                                    </div>
                                    <div class="form-group">
                                      <div class="input-group">
                                          <input v-model="dataCenter" id="data-center" name="data-center"
                                          class="has-value" placeholder="" readonly />
                                          <label class="control-label" for="data-center" role="button">Data Center</label><i class="bar"></i>
                                      </div>
                                    </div>

                                    <p style="color: red;">
                                      WARNING: This will delete all topics and namespaces associated with this plan.
                                    </p>

                                    <p>

                                    Are you sure you want to delete your subscription to this plan?
                                    </p>
                                </div>
                    </vuestic-modal>
                    <vuestic-modal :show.sync="showChangeModal" ref="changeModal"
                                            :okText="'modal.confirm' | translate"
                                            v-on:ok="processPlanChange()"
                                            v-on:cancel="subToChange=''"
                                            :cancelText="'modal.cancel' | translate">

                                <div slot="title">Change Subscription</div>
                                <div>

                                    <div class="form-group">
                                      <div class="input-group">
                                          <input v-model="dataCenter" id="data" name="data"
                                          class="has-value" placeholder="" readonly />
                                          <label class="control-label" for="data" role="button">Data Center</label><i class="bar"></i>
                                      </div>
                                    </div>

                                    <div class="form-group">
                                      <div class="input-group">
                                          <input :value="getPlanDisplayName(oldPlan)" id="plan-name" name="plan-name"
                                          class="has-value" placeholder="" readonly />
                                          <label class="control-label" for="plan-name" role="button">Current Plan</label><i class="bar"></i>
                                      </div>
                                    </div>

                                    <p>Select the new plan for your subscription:
                                    </p>
                                    <vuestic-simple-select
                                      label="Select new plan"
                                      v-model="newPlan"
                                      name="Selected Plan"
                                      :required="true"
                                      :clearable="false"
                                      ref="planSelect"
                                      optionKey="name"
                                      v-bind:options="availablePlans">
                                    </vuestic-simple-select>
                                    <p v-if="subscriptionToChange.includes('free-')">
                                    <span class="vue-highlighted-text">Note:</span> This change requires a billing account to be created. You will prompted for payment information.
                                    </p>
                                    <p v-else>
                                    This change will modify the charges to your account. See <a href="/pricing">pricing</a> for details.
                                    </p>
                                     <p>
                                    Are you sure you want to make this change?
                                    </p>
                                </div>
                      </vuestic-modal>
                    </vuestic-widget>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
import AjaxService from '@/services/AjaxService'
import { HollowDotsSpinner } from 'epic-spinners'
import { mapGetters } from 'vuex'
import axios from 'axios'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'

export default {
  name: 'ChangePlan',
  data () {
    return {
      tenantName: this.defaultTenantName,
      errorText: 'Something went wrong',
      dataCenter: '',
      showChangeModal: false,
      showDeleteModal: false,
      showAddModal: false,
      existingPlans: [],
      subscriptionToChange: '',
      addPlan: 'starter',
      dataCenterToAdd: '',
      indexToSpin: 0,
      showSpinner: false,
      oldPlan: '',
      newPlan: {},
      newHostedPageId: '',
      availablePlans: [],
      paymentRequired: true,
      planPaid: false,
      userLogin: wpData.login,
    }
  },
  components: {
    HollowDotsSpinner,
    Alert
  },
  mounted () {
    // Get the latest plan info for this user
    this.$store.dispatch('getCurrentUserSubscriptions')
  },
  methods: {
    confirmChange (subscriptionIdx) {
      this.subscriptionToChange = this.subscriptionInfo[subscriptionIdx].subscription_id
      this.oldPlan = this.subscriptionInfo[subscriptionIdx].plan
      this.dataCenter = this.subscriptionInfo[subscriptionIdx].data_center
      this.updateAvailablePlans(this.oldPlan)
      this.indexToSpin = subscriptionIdx
      this.$refs.changeModal.open()
    },
    getPlanDisplayName (plan) {
      const planName = this.planInfo[plan] ? this.planInfo[plan].display_name : plan
      return planName
    },
    isPrivatePlan (plan) {
      if (this.planInfo[plan]) {
        if (this.planInfo[plan].not_self_serve === '1') {
          return true
        } else {
          return false
        }
      }
      return true
    },
    openCheckout () {
      let chargebeeInstance = Chargebee.getInstance()
      let billingPlan = this.newPlan.id + '-' + this.cloudProvider(this.dataCenter).toLowerCase()
      let invoiceNotes = this.newPlan.id.charAt(0).toUpperCase() + this.newPlan.id.slice(1) +
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
            this.$refs.changeModal.close()
          } else {
            this.$refs.changeModal.close()
            this.changePlan()
          }
        },
        success: (hostedPageId) => {
          console.log(hostedPageId)
          console.log(this.planPaid)

          this.planPaid = true
          this.newHostedPageId = hostedPageId

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
          this.$refs.changeModal.close()
        }
      })
    },
    confirmDelete (subscriptionIdx) {
      this.subscriptionToChange = this.subscriptionInfo[subscriptionIdx].subscription_id
      this.oldPlan = this.subscriptionInfo[subscriptionIdx].plan
      this.dataCenter = this.subscriptionInfo[subscriptionIdx].data_center
      this.indexToSpin = subscriptionIdx
      this.$refs.deleteModal.open()
    },
    confirmAdd () {
      this.dataCenter = this.availableClusters[0]
      this.$refs.addModal.open()
    },
    checkIsValid () {
      console.log('Running CheckIsValid')

      this.$refs.dataCenterSelect.validate()
      if (this.$refs.dataCenterSelect.isValid()) {
        this.$refs.addModal.inputValid()
      } else {
        this.$refs.addModal.inputInvalid()
      }
    },
    async addNewPlan () {

    },
    processPlanChange () {
      if (this.paymentRequired && this.subscriptionToChange.includes('free-')) {
        // If there isn't a valid subscription ID yet, need to get one
        this.planPaid = false
        this.openCheckout()
      } else {
        this.changePlan()
      }
    },
    async changePlan () {
      // Start spinner
      this.showSpinner = true

      try {
        await AjaxService.ajaxAction('change_plan',
          {
            subscription: this.subscriptionToChange,
            oldPlan: this.oldPlan,
            newPlan: this.newPlan.id,
            dataCenter: this.dataCenter,
            cloud: this.cloudProvider(this.dataCenter),
            newHostedPageId: this.newHostedPageId
          })

        // Reset the new hosted page ID now that it has been saved
        this.newHostedPageId = ''
        // Get the updated plan info for this user
        this.$store.dispatch('getCurrentUserSubscriptions')
        // Update the namespaces
        this.$store.dispatch('getNamespaces')

        setTimeout(() => {
          // Stop spinner
          this.showSpinner = false
        }, 1000)

        // Send email saying plan was sucessfully changed
        const emailInfo = {
          subject: `Plan changed successfully`,
          body: `ChangePlan. Old Plan: ${this.oldPlan} New Plan: ${this.newPlan.id} Data Center: ${this.dataCenter}`
        }
        this.$store.dispatch('sendEmail', emailInfo)
        try {
          // Record a conversion in Google Ads
          let value = '0'
          if (this.newPlan.id.includes('dedicated')) {
            value = '349.0'
          } else if (this.newPlan.id.includes('production')) {
            value = '599.0'
          } else if (this.newPlan.id.includes('starter')) {
            value = '59.0'
          }
          if (value !== '0') {
          // eslint-disable-next-line no-undef
            gtag_report_paid_conversion(value, url)
          }
        } catch (error) {
          console.log('Error recording conversion in Google Ads')
        }
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)

        // Make sure the plan info is up to date
        this.$store.dispatch('getCurrentUserSubscriptions')

        setTimeout(() => {
          // Stop spinner
          this.showSpinner = false
        }, 1000)

        this.errorText = `Changing plan from ${this.oldPlan} to ${this.newPlan.id} in ${this.dataCenter}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()

        // Send email saying plan change failed
        const emailInfo = {
          subject: `Plan change failed`,
          body: `ChangePlan. Old Plan: ${this.oldPlan} New Plan: ${this.newPlan.id} Data Center: ${this.dataCenter} Reason: ${reason} (${statusCode})`
        }
        this.$store.dispatch('sendEmail', emailInfo)
      }
    },
    async deleteSubscription () {
      // Start spinner
      this.showSpinner = true

      try {
        const resp = await AjaxService.ajaxAction('delete_plan',
          {
            subscription: this.subscriptionToChange,
            plan: this.oldPlan,
            dataCenter: this.dataCenter,
            cloud: this.cloudProvider(this.dataCenter)
          })

        // Get the updated plan info for this user
        this.$store.dispatch('getCurrentUserSubscriptions')

        // Update cluster information because it may have changed
        const allowClusterList = resp.data.data.cluster_list
        this.$store.commit('updateAllowedClusters', allowClusterList)
        this.$store.commit('updateNumAllowedClusters', allowClusterList.length)
        this.$store.dispatch('getClusterInfo')

        // Update the namespaces
        this.$store.dispatch('getNamespaces')

        setTimeout(() => {
          // Stop spinner
          this.showSpinner = false
        }, 1000)

        // Send email saying plan was sucessfully deleted
        const emailInfo = {
          subject: `Plan deleted successfully`,
          body: `ChangePlan. Plan: ${this.oldPlan} Data Center: ${this.dataCenter}`
        }
        this.$store.dispatch('sendEmail', emailInfo)
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)

        setTimeout(() => {
          // Stop spinner
          this.showSpinner = false
        }, 1000)

        this.errorText = `Deleting plan ${this.oldPlan} in ${this.dataCenter}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()

        // Send email saying plan deletion failed
        const emailInfo = {
          subject: `Plan deletion failed`,
          body: `ChangePlan. Plan: ${this.oldPlan} Data Center: ${this.dataCenter} Reason: ${reason} (${statusCode})`
        }
        this.$store.dispatch('sendEmail', emailInfo)
      }
    },
    updateAvailablePlans (oldPlan) {
      var allPlans = this.currentAvailablePlans
      var filtered = allPlans.filter(function (value, index, arr) {
        return value !== oldPlan
      })
      var plansObjectList = []
      this.currentAvailablePlans.forEach(plan => {
        console.log(plan)
        var planName = this.planInfo[plan] ? this.planInfo[plan].display_name : 'unknown'
        if (plan !== oldPlan) {
          plansObjectList.push({
            id: plan,
            name: planName
          })
        }
      })

      this.availablePlans = plansObjectList
      this.newPlan = plansObjectList[0]
    },
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'allowedClusters',
      'planInfo',
      'plan',
      'subscriptionInfo',
      'runTimer',
      'currentAvailablePlans',
      'billingProvider',
      'gcpMarketplaceLink'
    ]),
    availableClusters () {
      // Make sure the plan info is present before trying to retrieve it
      if (this.planInfo.free) {
        console.log(this.planInfo)
        var allClusters = this.planInfo[this.addPlan].allowed_clusters

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
