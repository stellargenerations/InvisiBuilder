import {defineField, defineType} from 'sanity'
import {MdContactMail} from 'react-icons/md'

export default defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  icon: MdContactMail,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'In Progress', value: 'in-progress'},
          {title: 'Resolved', value: 'resolved'},
          {title: 'Spam', value: 'spam'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'subject',
      status: 'status',
      email: 'email',
    },
    prepare({title, subtitle, status, email}) {
      return {
        title,
        subtitle: `${status.toUpperCase()}: ${subtitle || '(No subject)'} - ${email}`,
        media: MdContactMail,
      }
    },
  },
})