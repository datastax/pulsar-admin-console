<template>
    <div class="billing" style="width: 100%">
        <div class="flex md12">
            <div v-if="portalRetrieved">

                <iframe v-if="portalUrl" :src="portalUrl" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:800px;width:100%" height="100%" width="100%"></iframe>
                <div v-else>
                    <vuestic-widget style="text-align: center;">
                    <p>Billing account not yet created. Change an existing plan to paid or add a paid plan to create an account.</p>
                    <button  class="btn btn-primary btn-micro" @click="$router.push('/admin/plans/change')">Manage Plans</button>
                    <button  class="btn btn-primary btn-micro" @click="$router.push('/admin/plans/add')">Add Plan</button>
                    </vuestic-widget>

                </div>

            </div>
        </div>
    </div>
</template>

<script>

import AjaxService from '@/services/AjaxService'

    export default {
        name: 'Billing',
        data () {
            return {
                portalUrl: '',
                portalRetrieved: false
            }
        },
        mounted() {

            this.getPortalUrl()
        },
        methods: {
            async getPortalUrl() {
                console.log("Getting Portal URL");
                
                try {
                    const resp = await AjaxService.ajaxAction('get_port_url', {})
                    console.log(resp.data.data)
                    this.portalUrl = resp.data.data
                    this.portalRetrieved = true
                } catch (error) {
                    console.log('Ajax error', error)
                }
            },
        }

    }
</script>

<style lang="scss" scoped>

</style>