# Working with Sanity Studio for Invisibuilder

Sanity Studio is the content management interface for your Invisibuilder website. This guide will help you access and use Sanity Studio to manage your content.

## Accessing Sanity Studio

There are two main ways to access Sanity Studio:

### Option 1: Use the Sanity-hosted version (Recommended)

Sanity.io provides a hosted version of Sanity Studio at:

```
https://[your-project-id].sanity.studio/
```

In your case, this would be:
```
https://o5jvy5xl.sanity.studio/
```

This is the easiest way to access and use Sanity Studio as it's always available, automatically updated, and doesn't require any setup on your part.

### Option 2: Deploy Sanity Studio yourself

If you want to deploy Sanity Studio yourself, you can run:

```bash
node scripts/deploy-sanity-studio.js
```

This will build and deploy Sanity Studio to Sanity's servers.

## Creating Content in Sanity

Once you've accessed Sanity Studio, you can:

1. **Create Categories**: These organize your content by topic or type
2. **Create Articles**: The main content pieces in Invisibuilder 
3. **Add Media Files**: Images or other media to enhance your articles
4. **Add Resources**: External links and resources related to your articles
5. **Add Content Sections**: Organize article content into manageable sections

## Using the Create Sample Content Script

For testing or demonstration purposes, you can populate Sanity with sample content using:

```bash
export SANITY_DATASET=invisibuilder && node scripts/create-sanity-content.js
```

This script creates sample categories, articles, content sections, and resources to help you get started quickly.

## Troubleshooting

If you encounter issues:

1. Ensure your environment variables are correctly set:
   - `SANITY_PROJECT_ID` (should be o5jvy5xl)
   - `SANITY_DATASET` (should be invisibuilder - all lowercase)
   - `SANITY_API_TOKEN` (a valid token with write permissions)

2. Try rebuilding and redeploying Sanity Studio:
   ```bash
   cd sanity
   npx sanity build
   npx sanity deploy
   ```

3. Contact Sanity support if you continue experiencing issues.