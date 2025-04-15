// ./sanity/structure.jsx
import React from 'react';
import {
  MdArticle,
  MdCategory,
  MdImage,
  MdLink,
  MdTextFields,
  MdEmail,
  MdContactMail,
} from 'react-icons/md'

export const myStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Articles
      S.listItem()
        .title('Articles')
        .icon(MdArticle)
        .child(
          S.documentTypeList('article')
            .title('All Articles')
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('article')
                .views([
                  S.view.form(),
                  S.view
                    .component(({ document }) => (
                      <div style={{ padding: '1em' }}>
                        <h2>Associated Content</h2>
                        <pre>{JSON.stringify(document.displayed, null, 2)}</pre>
                      </div>
                    ))
                    .title('JSON'),
                ])
            )
        ),

      // Categories
      S.listItem()
        .title('Categories')
        .icon(MdCategory)
        .child(S.documentTypeList('category').title('Categories')),

      // Media Files
      S.listItem()
        .title('Media Files')
        .icon(MdImage)
        .child(S.documentTypeList('mediaFile').title('Media Files')),

      // Resources
      S.listItem()
        .title('Resources')
        .icon(MdLink)
        .child(S.documentTypeList('resource').title('Resources')),

      // Content Sections
      S.listItem()
        .title('Content Sections')
        .icon(MdTextFields)
        .child(S.documentTypeList('contentSection').title('Content Sections')),

      // Subscribers
      S.listItem()
        .title('Newsletter Subscribers')
        .icon(MdEmail)
        .child(S.documentTypeList('subscriber').title('Subscribers')),

      // Contacts
      S.listItem()
        .title('Contact Submissions')
        .icon(MdContactMail)
        .child(S.documentTypeList('contact').title('Contacts')),
    ])