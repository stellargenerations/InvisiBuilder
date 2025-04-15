export default {
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      })
    },
    {
      name: 'resourceType',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          { title: 'Link', value: 'link' },
          { title: 'Download', value: 'download' },
          { title: 'External Tool', value: 'external-tool' },
          { title: 'Reference', value: 'reference' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name from Lucide icons'
    },
    {
      name: 'article',
      title: 'Associated Article',
      type: 'reference',
      to: [{ type: 'article' }]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      readOnly: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'resourceType'
    }
  }
}