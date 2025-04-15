# Sanity Studio Setup for Invisibuilder

This document provides comprehensive instructions for setting up and using Sanity.io as the content management system for Invisibuilder.

## What is Sanity.io?

Sanity.io is a headless CMS that provides a flexible, customizable approach to content management. Unlike traditional CMS platforms, Sanity separates content from presentation, allowing developers to build applications with any frontend technology while maintaining a structured content backend.

## Prerequisites

- Node.js and npm installed
- A Sanity.io account (free tier available)
- Your Sanity Project ID and Dataset name
- For migration: a Sanity API token with write permissions

## Initial Setup

1. Create a Sanity.io account at [https://www.sanity.io/](https://www.sanity.io/)
2. Create a new project in Sanity's dashboard
3. Note your Project ID and Dataset name (usually "production")
4. Set the following environment variables in your development environment:
   ```
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=your_dataset_name
   ```

## Setting Up Sanity API Token

For content migration and management, you'll need a Sanity API token. We've created a helper script to guide you through this process:

```bash
node scripts/sanity-token-setup.js
```

This script will:
1. Verify your Sanity configuration
2. Guide you through creating and storing a Sanity API token
3. Provide options for saving the token securely
4. Offer to run the migration script if desired

## Running Sanity Studio Locally

From the project root directory, run:

```bash
./setup-sanity.sh
```

This will:
1. Export necessary environment variables
2. Install Sanity dependencies if needed
3. Start the Sanity Studio development server

The Sanity Studio will be available at: `http://localhost:3333`

## Data Migration from PostgreSQL to Sanity

To migrate your existing content from PostgreSQL to Sanity:

```bash
node scripts/migrate-to-sanity.js
```

This script will:
1. Connect to your PostgreSQL database and Sanity project
2. Export all content in the proper order to maintain relationships
3. Transform data into the appropriate Sanity document formats
4. Upload content to Sanity while preserving references
5. Save an ID mapping file for reference

Make sure you've set these environment variables before migration:
- `DATABASE_URL` - PostgreSQL connection string
- `SANITY_PROJECT_ID` - Your Sanity project ID
- `SANITY_DATASET` - Your Sanity dataset name
- `SANITY_API_TOKEN` - A token with write permissions

## Creating Sample Content in Sanity

If you'd like to generate sample content in your Sanity project:

```bash
node scripts/create-sanity-content.js
```

This will create a basic set of content including categories, articles, and sections to help you get started with Sanity.

## Switching Between PostgreSQL and Sanity

Invisibuilder is designed to work with either PostgreSQL or Sanity as its content backend. To toggle between them:

```bash
node scripts/toggle-cms.js [postgres|sanity]
```

This script will:
1. Determine which CMS you're currently using
2. Backup the current configuration
3. Switch server files to use the specified CMS
4. Restart the application

If no argument is provided, it will toggle between PostgreSQL and Sanity.

## Schema Structure

The Sanity schemas are organized as follows:

- **Article**: Main content model with rich text content, categories, and metadata
- **Category**: Content categories with slug, description, and icon
- **ContentSection**: Modular content sections for structuring articles
- **MediaFile**: Media assets including images, videos, and documents
- **Resource**: External resources and links related to articles
- **Subscriber**: Newsletter subscriber information
- **Contact**: Contact form submissions with status tracking

Each schema is defined in its own file in the `sanity/schemas` directory.

## Deployment

To deploy Sanity Studio to Sanity's hosting:

```bash
cd sanity
npm run deploy
```

After deployment, your studio will be accessible at `https://your-project-id.sanity.studio/`

## Troubleshooting

- **Environment Variables**: Make sure all required environment variables are set
- **Installation Issues**: If dependencies fail to install, try running `npm install` manually in the `sanity` directory
- **Migration Errors**: Check that your Sanity API token has write permissions
- **Schema Errors**: If you modify schemas, remember to deploy or restart Sanity Studio

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity GROQ Query Language](https://www.sanity.io/docs/groq)
- [Content Lake API Reference](https://www.sanity.io/docs/content-lake-api-rest)
- [Sanity React Hooks](https://www.sanity.io/docs/react-hooks)
- [Sanity Image URL Builder](https://www.sanity.io/docs/image-url)