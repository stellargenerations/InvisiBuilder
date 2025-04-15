export default {
  name: 'contentSection',
  title: 'Content Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'articleId',
      title: 'Article',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'position',
      title: 'Position',
      type: 'number',
      validation: Rule => Rule.required().integer().positive()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'}
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'}
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              options: {
                isHighlighted: true
              }
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
              options: {
                isHighlighted: true
              }
            }
          ]
        },
        {
          name: 'code',
          title: 'Code Block',
          type: 'object',
          fields: [
            {
              name: 'language',
              title: 'Language',
              type: 'string'
            },
            {
              name: 'code',
              title: 'Code',
              type: 'text'
            }
          ]
        },
        {
          name: 'callout',
          title: 'Callout',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'text'
            },
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Info', value: 'info' },
                  { title: 'Warning', value: 'warning' },
                  { title: 'Success', value: 'success' },
                  { title: 'Error', value: 'error' }
                ]
              }
            }
          ]
        }
      ],
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'position'
    }
  },
  orderings: [
    {
      title: 'Position',
      name: 'position',
      by: [
        {field: 'position', direction: 'asc'}
      ]
    }
  ]
}