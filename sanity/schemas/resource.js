import {defineField, defineType} from 'sanity'
import {MdLink} from 'react-icons/md'

export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  icon: MdLink,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'resourceType',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          {title: 'Website', value: 'website'},
          {title: 'Article', value: 'article'},
          {title: 'Video', value: 'video'},
          {title: 'Course', value: 'course'},
          {title: 'Book', value: 'book'},
          {title: 'Tool', value: 'tool'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name from Lucide icons (e.g., "link", "globe", "book", "video")',
    }),
    defineField({
      name: 'article',
      title: 'Related Article',
      type: 'reference',
      to: [{type: 'article'}],
      description: 'Link this resource to an article',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
      resourceType: 'resourceType',
    },
    prepare({title, subtitle, resourceType}) {
      return {
        title,
        subtitle: `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}: ${subtitle}`,
        media: MdLink,
      }
    },
  },
})