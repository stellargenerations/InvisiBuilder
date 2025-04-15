# Setting Up Sanity.io for Invisibuilder

This guide will walk you through setting up Sanity.io as the content management system for Invisibuilder.

## Prerequisites

- Node.js and npm installed
- Sanity CLI installed globally (`npm install -g @sanity/cli`)
- A Sanity.io account (you can create one at [sanity.io/signup](https://www.sanity.io/signup))

## Step 1: Create a Sanity Project

1. Log in to Sanity from the command line:
   ```bash
   sanity login
   ```

2. Initialize a new Sanity project:
   ```bash
   cd sanity
   sanity init
   ```

3. During the initialization:
   - Create a new project or select an existing one
   - Set the dataset name (usually "production")
   - Choose the "Clean project with no predefined schemas" option

4. Make note of your project ID - it will be visible in the `sanity.config.js` file

## Step 2: Update Configuration Files

1. Update `sanity/sanity.config.js` with your actual project ID.

2. Update the client configuration in `client/src/lib/sanity.ts` with your actual project ID.

3. Add environment variables to your Replit project:
   - `SANITY_PROJECT_ID`: Your Sanity project ID
   - `SANITY_DATASET`: Your dataset name (usually "production")
   - `SANITY_API_TOKEN`: A token with read/write permissions (for the backend)

## Step 3: Start the Sanity Studio

1. Launch the Sanity Studio:
   ```bash
   cd sanity
   sanity start
   ```

2. The studio will be available at http://localhost:3333

## Step 4: Deploy the Sanity Studio (Optional)

To make the Sanity Studio accessible online:

```bash
cd sanity
sanity deploy
```

This will deploy your studio to a URL like `https://your-project-name.sanity.studio`

## Step 5: Content Migration

If you have existing content in your PostgreSQL database, you'll need to migrate it to Sanity. We've provided a script to help with this:

```bash
node scripts/migrate-to-sanity.js
```

## Using Sanity.io in the Application

### In the Frontend

Use the helper functions in `client/src/lib/sanity.ts` to fetch data from Sanity. For example:

```typescript
import { getArticles, urlFor } from '@/lib/sanity';

// In a React component
const { data: articles } = useQuery({
  queryKey: ['articles'],
  queryFn: () => getArticles({ limit: 10 })
});

// For images
<img src={urlFor(article.mainImage).width(800).url()} alt={article.mainImage.alt} />
```

### In the Backend

The server now uses Sanity.io as the data source instead of PostgreSQL. All API endpoints remain the same, but internally they call Sanity's API through the functions in `server/sanity-api.ts`.

## Helpful Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity React Hooks](https://www.sanity.io/docs/react-hooks)
- [Content Modelling](https://www.sanity.io/docs/content-modelling)