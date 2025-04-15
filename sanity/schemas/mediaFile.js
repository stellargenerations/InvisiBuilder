import {defineField, defineType} from 'sanity'
import {MdImage} from 'react-icons/md'

export default defineType({
  name: 'mediaFile',
  title: 'Media File',
  type: 'document',
  icon: MdImage,
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
      name: 'fileType',
      title: 'File Type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
          {title: 'Audio', value: 'audio'},
          {title: 'Document', value: 'document'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        storeOriginalFilename: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alternative Text',
      type: 'string',
      description: 'Important for SEO and accessibility',
    }),
    defineField({
      name: 'article',
      title: 'Related Article',
      type: 'reference',
      to: [{type: 'article'}],
      description: 'Link this media to an article',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'file',
      fileType: 'fileType',
    },
    prepare({title, media, fileType}) {
      return {
        title,
        subtitle: fileType.charAt(0).toUpperCase() + fileType.slice(1),
        media: media || MdImage,
      }
    },
  },
})