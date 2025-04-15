# Sanity Studio Setup for Invisibuilder

This document provides instructions for setting up and using Sanity Studio with Invisibuilder.

## Initial Setup

1. Create a Sanity.io account at [https://www.sanity.io/](https://www.sanity.io/)
2. Create a new project in Sanity
3. Note your Project ID and Dataset name (usually "production")
4. Update the following files with your Project ID and Dataset:
   - `sanity/.env`
   - `sanity/sanity.cli.js`
   - `sanity/sanity.config.js`

## Running Sanity Studio

From the project root directory, run:

```bash
node scripts/start-sanity-studio.js
```

This will:
1. Check your configuration
2. Install dependencies if needed
3. Start the Sanity Studio development server

The Sanity Studio will be available at: `http://localhost:3333`

## Deployment

To deploy Sanity Studio to Sanity's hosting:

```bash
cd sanity
npm run deploy
```

After deployment, your studio will be accessible at `https://your-project-id.sanity.studio/`

## Data Migration

To migrate existing data from PostgreSQL to Sanity:

```bash
node scripts/migrate-to-sanity.js
```

Make sure you've set the following environment variables first:
- `DATABASE_URL`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_TOKEN` (with write permissions)

## Switching Between PostgreSQL and Sanity

To toggle between using PostgreSQL and Sanity for data storage:

```bash
node scripts/toggle-cms.js [postgres|sanity]
```

If no argument is provided, it will toggle between the two.

## Schema Structure

The Sanity schemas are organized as follows:

- **Article**: Main content model with rich text content
- **Category**: Categories for organizing articles
- **ContentSection**: Modular content sections for articles
- **MediaFile**: Images, videos, and other media files
- **Resource**: External resources and links
- **Subscriber**: Newsletter subscribers
- **Contact**: Contact form submissions

Each schema is defined in its own file in the `sanity/schemas` directory.

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity GROQ Query Language](https://www.sanity.io/docs/groq)
- [Content Lake API Reference](https://www.sanity.io/docs/content-lake-api-rest)