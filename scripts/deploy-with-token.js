#!/usr/bin/env node
/**
 * This script deploys Sanity Studio using a deployment token
 * Prerequisites:
 * - SANITY_PROJECT_ID environment variable
 * - SANITY_DATASET environment variable (usually "invisibuilder")
 * - SANITY_DEPLOY_TOKEN environment variable (with deploy permissions)
 */
import { execSync } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check the required environment variables
function checkEnvironment() {
  const requiredVars = ['SANITY_PROJECT_ID', 'SANITY_DATASET', 'SANITY_DEPLOY_TOKEN'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('\nMake sure these are set in your environment or .env file.');
    process.exit(1);
  }
  
  return {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET.toLowerCase(),
    deployToken: process.env.SANITY_DEPLOY_TOKEN
  };
}

// Deploy Sanity Studio using the token
function deploySanityStudio({ projectId, deployToken }) {
  console.log(`Deploying Sanity Studio for project ${projectId}...\n`);
  
  try {
    // Create temporary sanity.json with auth token
    const sanityPath = path.resolve(__dirname, '../sanity');
    const tempConfigPath = path.join(sanityPath, 'sanity.deploy.json');
    
    // Read the current config
    const sanityConfig = JSON.parse(fs.readFileSync(path.join(sanityPath, 'sanity.json'), 'utf8'));
    
    // Add the auth token
    sanityConfig.auth = {
      token: deployToken
    };
    
    // Write the temporary config
    fs.writeFileSync(tempConfigPath, JSON.stringify(sanityConfig, null, 2));
    
    // Use the temporary config for deployment
    process.chdir(sanityPath);
    execSync(`npx sanity deploy --config=${tempConfigPath}`, { stdio: 'inherit' });
    
    // Clean up temporary file
    fs.unlinkSync(tempConfigPath);
    
    console.log(`\n✅ Studio deployed successfully!`);
    console.log(`\nYou can access Sanity Studio at: https://${projectId}.sanity.studio/`);
  } catch (error) {
    console.error(`\n❌ Deployment failed with code ${error.status || 1}`);
    console.error(error.message || error);
    process.exit(1);
  }
}

// Main execution
try {
  const config = checkEnvironment();
  deploySanityStudio(config);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}