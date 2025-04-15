export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'articleCount',
      title: 'Article Count',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    }
  }
}