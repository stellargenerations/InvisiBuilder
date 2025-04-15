export default {
  name: 'mediaFile',
  title: 'Media File',
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
      name: 'fileType',
      title: 'File Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Audio', value: 'audio' },
          { title: 'Document', value: 'document' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'file',
      title: 'File',
      type: 'file',
      validation: Rule => Rule.required()
    },
    {
      name: 'altText',
      title: 'Alternative Text',
      type: 'string',
      description: 'Important for SEO and accessibility'
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
      subtitle: 'fileType',
      media: 'file'
    }
  }
}