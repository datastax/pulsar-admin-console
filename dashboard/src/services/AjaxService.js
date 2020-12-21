import AjaxBase from '@/services/AjaxBase'

export default {
  ajaxAction (action, parmObj) {

    // Need to add ability to adjust the timeout of this call
    // The default is set in AjaxBase, but it may not be sufficient
    // for long actions, such as changing a plan.

    const data = new FormData()
    data.append('action', action)
    data.append('security', globalConf.security)

    Object.keys(parmObj).forEach(key => {
      data.append(key, parmObj[key])
    })

    return AjaxBase().post('admin-ajax.php', data)
  }
}
