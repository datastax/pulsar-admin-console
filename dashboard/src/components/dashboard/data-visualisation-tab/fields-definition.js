export default {
  tableFields: [
    {
      name: '__component:badge-column',
      title: '',
      dataClass: 'text-center',
    },
    {
      name: 'name',
      title: 'topic',
      sortField: 'name',
    },
    {
      name: 'namespace',
      title: 'namespace',
      sortField: 'namespace'
    },
  ],
  sortFunctions: {
    'name': function (item1, item2) {
      return item1 >= item2 ? 1 : -1
    },
    'namespace': function (item1, item2) {
      return item1 >= item2 ? 1 : -1
    },
  },
}
