export default {
  name: 'contact',
  title: 'Contact Form Submission',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'submittedAt',
      title: 'Submitted At',
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
          { title: 'New', value: 'new' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Archived', value: 'archived' }
        ]
      },
      initialValue: 'new',
      validation: Rule => Rule.required()
    },
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'text'
    }
  ],
  preview: {
    select: {
      title: 'subject',
      subtitle: 'email'
    }
  },
  orderings: [
    {
      title: 'Submission Date, New',
      name: 'submittedAtDesc',
      by: [
        {field: 'submittedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Status',
      name: 'status',
      by: [
        {field: 'status', direction: 'asc'},
        {field: 'submittedAt', direction: 'desc'}
      ]
    }
  ]
}