import {defineField, defineType} from 'sanity'
import {MdEmail} from 'react-icons/md'

export default defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  icon: MdEmail,
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Unsubscribed', value: 'unsubscribed'},
          {title: 'Bounced', value: 'bounced'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'consent',
      title: 'Consent Given',
      type: 'boolean',
      description: 'Whether the subscriber has given consent to receive emails',
      initialValue: true,
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'status',
      name: 'name',
    },
    prepare({title, subtitle, name}) {
      return {
        title,
        subtitle: `${name ? name + ' - ' : ''}${subtitle.toUpperCase()}`,
        media: MdEmail,
      }
    },
  },
})