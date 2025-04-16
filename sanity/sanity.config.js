import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {myStructure} from './structure.jsx'
import {table} from '@sanity/table'

export default defineConfig({
  name: 'invisibuilder',
  title: 'Invisibuilder CMS',

  projectId: 'o5jvy5xl',
  dataset: 'invisibuilder',
  
  // CORS Origins allow Sanity Studio to be accessible from different domains
  cors: {
    allowOrigins: ['https://o5jvy5xl.sanity.studio', 'http://localhost:3000', '*'],
    allowCredentials: true,
  },

  plugins: [
    deskTool({
      structure: myStructure
    }),
    visionTool({
      defaultApiVersion: 'v2023-03-04',
      defaultDataset: process.env.SANITY_DATASET,
    }),
    table(),
  ],

  schema: {
    types: schemaTypes,
  },
  
  document: {
    // Actions are configurable by document type
    actions: (prev, { schemaType }) => {
      // Show all actions for all document types
      return prev
    },
  },
})