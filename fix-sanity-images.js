// fix-sanity-images.js
import { createClient } from '@sanity/client';

// Make sure dataset is lowercase
const dataset = (process.env.SANITY_DATASET || 'invisibuilder').toLowerCase();

// Configure client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'o5jvy5xl',
  dataset: dataset,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-03-04',
  useCdn: false,
});

async function fixArticleImages() {
  try {
    // Find all articles with featuredImage matching our problematic URL
    const query = `*[_type == "article" && featuredImage == "https://source.unsplash.com/random/1200x630?website"]`;
    const articles = await client.fetch(query);
    
    console.log(`Found ${articles.length} articles with invalid image references`);
    
    // Loop through each article and fix it
    for (const article of articles) {
      console.log(`Fixing article: ${article.title} (ID: ${article._id})`);
      
      // Create a proper image object structure
      // Remove the featuredImage property entirely - let it be added in the studio
      const { featuredImage, ...updatedArticle } = article;
      
      // Patch the document
      await client.patch(article._id)
        .unset(['featuredImage'])  // Remove the problematic field
        .commit();
      
      console.log(`Updated article: ${article.title}`);
    }
    
    console.log('All articles fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing images:', error.message);
  }
}

// Run the function
fixArticleImages();