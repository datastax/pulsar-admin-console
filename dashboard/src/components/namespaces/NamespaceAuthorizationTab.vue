<template>
    <div class="namespace-authorization">

            <vuestic-widget>

                <alert ref="alert" :errorText="errorText"></alert>

                <div class="va-row" v-if="namespacesConfig.data[$route.params.id] && namespacesConfig.data[$route.params.id].cluster === activeCluster">
                  
                    <div class="flex md12">

                              <div class="va-row">
                                                        <div class="flex md4">
                                                            <div class="form-group with-icon-right">
                                                                    <div class="input-group">
                                                                    <input v-model="role" id="user-key" name="user-key"/>
                                                                    <label class="control-label" for="user-key" role="button">Role</label><i class="bar"></i>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex md4">
                                                          <vuestic-multi-select
                                                            label="Allowed Actions"
                                                            v-model="selectedActions"
                                                            option-key="name"
                                                            v-bind:options="actionList"
                                                          />
                                                        </div>

                                                        <div class="flex md4">
                                                            <button :disabled="!role || !selectedActions" class="btn btn-micro" @click="addNamespaceRole()">Add/Update Role</button>
                                                        </div>
                                                        <div class="table-responsive">
                                                            <table class="table table-striped first-td-padding table-header-active">
                                                            <thead>
                                                            <tr>
                                                                <td></td>
                                                                <td>Role</td>
                                                                <td>Actions</td>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(item, index) in namespacesConfig.data[$route.params.id].auth_policies.namespace_auth" :key="index">
                                                                    <td>
                                                                        <i class="fa fa-times pointer"
                                                                                    @click="deleteNamespaceRole(index)"></i>
                                                                    </td>
                                                                    <td>
                                                                        {{ index}}
                                                                    </td>
                                                                    <td>
                                                                        {{ item }}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                
                </div>
                </div>
            </vuestic-widget>

    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import mixins from '@/services/mixins'
import AjaxService from '@/services/AjaxService'
import ApiService from '@/services/ApiService'
import Alert from '../utils/Alert'

export default {
  name: 'NamespaceAuthorizationTab',
  data () {
    return {
      errorText: 'Something went wrong',
      role: '',
      selectedActions: [],
      actionList: [ 
        { id: 'produce', name: 'produce' },
        { id: 'consume', name: 'consume' },
        { id: 'functions', name: 'functions' },
        { id: 'sources', name: 'sources'},
        { id: 'sinks', name: 'sinks'}
      ]
    }
  },
  components: {
    Alert
  },
  computed: {
    ...mapGetters([
      'namespacesConfig',
      'activeCluster',
      'planInfo',
      'tenant',
      'privateOrg',
      'isAdminUser',
    ]),
    offloadThresholdHuman () {
      if (this.namespacesConfig.data[this.$route.params.id]) {
        const threshold = this.namespacesConfig.data[this.$route.params.id].offload_threshold

        if (threshold >= 0) {
          return this.$options.filters.humanBytes(threshold)
        } else {
          return 'System Default'
        }
      }
    },
  },
  mixins: [mixins],
  beforeDestroy () {
    // Trigger an update so we don't have to wait for the next interval
    this.$store.dispatch('updateAll')
  },
  methods: {
    showOffloadThresholdModal () {
      this.offloadThreshold = this.namespacesConfig.data[this.$route.params.id].offload_threshold
      if (this.offloadThreshold == -1) {
        this.unit = { id: 'bytes', name: 'B', convert: 1 }
      }
      this.updateOffloadThresholdDisplay()
      this.$refs.updateOffloadThresholdModal.open()
    },
    addKeyValue () {
    },
    removeKeyValue (key) {
    },
    updateOffloadThresholdDisplay () {
      this.offloadThresholdDisplay = this.offloadThreshold / this.unit.convert
    },
    updateOffloadThreshold () {
      this.offloadThreshold = this.offloadThresholdDisplay * this.unit.convert
    },
    async deleteNamespaceRole (role) {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      try {
        await ApiService.deleteNamespaceRole(this.activeCluster, namespacePath, role)

        this.onSuccess('Role Deleted')
        this.$store.dispatch('getNamespacesInfo')
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Deleting role: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
    async addNamespaceRole () {
      const namespaceName = this.namespacesConfig.data[this.$route.params.id].name
      const namespacePath = this.tenant + '/' + namespaceName

      console.log(this.role)
      console.log(this.selectedActions)
      let actionList = []
      this.selectedActions.forEach(element => {
        actionList.push(element.id)
        
      });

      console.log(actionList)

      try {
        await ApiService.addNamespaceRole(this.activeCluster, namespacePath, this.role, actionList)

        this.onSuccess('Role Added')
        this.$store.dispatch('getNamespacesInfo')
        
      } catch (error) {
        let [reason, statusCode] = this.decodeErrorObject(error)
        this.errorText = `Adding role: ${namespaceName}. Reason: ${reason} (${statusCode})`
        this.$refs.alert.showAlert()
      }
    },
  }
}

</script>

<style lang="scss" scoped>

.label-style {
  font-size: 0.6rem;
  color: #C5A54E;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
