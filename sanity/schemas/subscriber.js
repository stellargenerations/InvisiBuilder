export default {
  name: 'subscriber',
  title: 'Newsletter Subscriber',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'subscriptionDate',
      title: 'Subscription Date',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      readOnly: true
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Unsubscribed', value: 'unsubscribed' },
          { title: 'Bounced', value: 'bounced' }
        ]
      },
      initialValue: 'active',
      validation: Rule => Rule.required()
    },
    {
      name: 'preferences',
      title: 'Content Preferences',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'lastEmailSent',
      title: 'Last Email Sent',
      type: 'datetime'
    }
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'status'
    }
  },
  orderings: [
    {
      title: 'Subscription Date, New',
      name: 'subscriptionDateDesc',
      by: [
        {field: 'subscriptionDate', direction: 'desc'}
      ]
    }
  ]
}