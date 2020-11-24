<template>
  <div class="show-org" style="width: 100%">
      <div class="flex md12">

        <alert ref="alert" :errorText="errorText"></alert>
        <div class="va-row" >
            <div class="flex xs12 md12" >
                <vuestic-widget headerText="Organization" >
                    <div class="table-responsive">
                      <vuestic-modal ref="orgInviteModal"
                          :okText="'modal.ok' | translate"
                          v-on:ok="sendInvite()"
                          :okDisabled="!isFormValid"
                          :cancelText="'modal.cancel' | translate">
            <div slot="title">Invite to Organization ({{ this.orgInfo.userInfo.length }} of {{ currentMaxUsers }} used)</div>
            <div v-if="!orgFull">
                <p> <span class="vue-highlighted-text"></span> Send invite through email. </p>
                <fieldset>
                  <div class="form-group">
                      <div class="input-group">
                        <input id="Email"
                        type="email"
                          name="Email"
                          ref="Email"
                          v-model="createEmailAddress"
                          v-validate="'required|email'"
                          required
                        />
                        <label class="control-label" for="email">Email address of the person you are inviting</label><i class="bar"></i>
                        <small v-show="errors.has('Email')"
                             class="help text-danger">
                        {{ errors.first('Email') }}
                      </small>
                      </div>
                  </div>
                  <div class="form-group">
                      <div class="input-group">
                        <input id="Name"
                          name="Name"
                          ref="Name"
                          v-model="createName"
                          v-validate="'required'"
                          required
                        />
                        <label class="control-label" for="topicName">Name of person you are inviting.</label><i class="bar"></i>
                      </div>
                  </div>
                </fieldset>
            </div>
            <div v-else>
              <p> You have reached the maximum number of users in your organization, upgrade your plan to add more.</p>
              <button class="btn btn-primary" @click="$router.push('/admin/plans/change')">
              <div>
               Manage Plan
              </div>
            </button>
            </div>
                                 </vuestic-modal>
                          <div
            class="flex sm6 lg6 xl3 justify--center">
            <button class="btn btn-primary" @click="openOrgInviteModal()">
               Invite to Org
            </button>
          </div>
                        <table class="table table-striped first-td-padding table-header-active">
                        <thead>
                        <tr>
                            <td>Name</td>
                            <td>Email</td>
                            <td>Date Registered</td>
                            <td>Biling Admin</td>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(orgUser, index) in orgInfo.userInfo" :key="index">
                            <td>{{ orgUser.name }} </td>
                            <td>{{ orgUser.email }} </td>
                            <td>{{ fixDate(orgUser.registered) }} </td>
                            <td>{{ isBillingEnabled(orgUser.disableBilling) }} </td>
                            </tr>
                        </tbody>
                        </table>
                                </div>
                    </vuestic-widget>
            </div>
        </div>
      </div>
      </div>
</template>

<script>
import { HollowDotsSpinner } from 'epic-spinners'
import { mapGetters } from 'vuex'
import AjaxService from '@/services/AjaxService'
import mixins from '@/services/mixins'
import Alert from '../utils/Alert'

export default {
  name: 'ShowOrg',
  data () {
    return {
      errorText: '',
      maxOrgUsers: 0,
      createName: '',
      createEmailAddress: '',
      currentMaxUsers: 0,
      currentNumUsers: 0,
      orgFull: false,
    }
  },
  async mounted () {
    const maxUsers = await this.getMaxOrgUsers()
    this.currentMaxUsers = maxUsers
  },
  components: {
    HollowDotsSpinner,
    Alert
  },
  mixins: [mixins],
  computed: {
    ...mapGetters([
      'orgInfo',
      'subscriptionInfo',
      'planInfo',
      'accountInfo',
      'activeCluster'
    ]),
    isFormValid () {
      // return this.formFields['topicName'].valid
      return Object.keys(this.formFields).every(key => this.formFields[key].valid)
    },
  },
  methods: {
    isBillingEnabled (flag) {
      if (flag === '1') {
        return 'No'
      }
      return 'Yes'
    },

    async isOrgFull () {
      const maxUsers = await this.getMaxOrgUsers()
      this.currentMaxUsers = maxUsers
      if (maxUsers <= this.orgInfo.userInfo.length) {
        return true
      }
      return false
    },

    async openOrgInviteModal () {
      this.orgFull = await this.isOrgFull()
      // console.log('is org full: ' + this.orgFull)
      this.$refs.orgInviteModal.open()
    },

    async getMaxOrgUsers () {
      try {
        const resp = await AjaxService.ajaxAction('get_max_org_users',
          {
            dataCenter: this.activeCluster,
          })

        console.log(resp)
        return resp.data.data
      } catch (error) {
        console.log('Error', error)
        console.log('Error', error.response)
        return 0
      }
    },
    fixDate (date) {
      let dateParts = date.split(' ')
      return dateParts[0]
    },
    async sendInvite () {
      const emailInfo = {
        name: this.createName,
        subject: `You have been invited to join`,
        body: `Template from sparkpost`,
        address: this.createEmailAddress
      }
      this.$store.dispatch('sendInvite', emailInfo)
      this.onSuccess('Invite sent')

    }
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
