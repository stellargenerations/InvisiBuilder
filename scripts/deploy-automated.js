#!/usr/bin/env node
/**
 * This script deploys Sanity Studio V3 with fully automated hostname selection
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
  
  // Convert dataset to lowercase for safety
  const dataset = process.env.SANITY_DATASET.toLowerCase();
  
  return {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset,
    deployToken: process.env.SANITY_DEPLOY_TOKEN
  };
}

// Deploy Sanity Studio using the token
function deploySanityStudio({ projectId, dataset, deployToken }) {
  console.log(`Deploying Sanity Studio for project ${projectId} and dataset ${dataset}...\n`);
  
  try {
    // Temporarily modify sanity.cli.js to ensure it uses the lowercase dataset
    const sanityPath = path.resolve(__dirname, '../sanity');
    const cliPath = path.join(sanityPath, 'sanity.cli.js');
    const configPath = path.join(sanityPath, 'sanity.config.js');
    
    // Read the current files
    const originalCliContent = fs.readFileSync(cliPath, 'utf8');
    const originalConfigContent = fs.readFileSync(configPath, 'utf8');
    
    // Create backup files
    fs.writeFileSync(`${cliPath}.bak`, originalCliContent);
    fs.writeFileSync(`${configPath}.bak`, originalConfigContent);
    
    // Create modified CLI content with hardcoded values
    const newCliContent = `import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '${projectId}',
    dataset: '${dataset}',
  },
})`;

    // Create modified config content with hardcoded values
    const newConfigContent = originalConfigContent
      .replace("process.env.SANITY_PROJECT_ID", `'${projectId}'`)
      .replace("process.env.SANITY_DATASET", `'${dataset}'`);
    
    // Write the modified files
    fs.writeFileSync(cliPath, newCliContent);
    fs.writeFileSync(configPath, newConfigContent);
    
    // Create a temporary deploy token file
    const authTokenPath = path.join(sanityPath, '.env');
    fs.writeFileSync(authTokenPath, `SANITY_AUTH_TOKEN=${deployToken}`);
    
    // Change to the Sanity directory
    process.chdir(sanityPath);
    
    // Create a sanity-deploy.json file that includes hostname selection
    // This avoids the interactive prompt
    const deployConfigPath = path.join(sanityPath, 'sanity-deploy.json');
    const deployConfig = {
      "project": {
        "name": "invisibuilder",
        "basePath": "/",
        "hostname": projectId
      }
    };
    fs.writeFileSync(deployConfigPath, JSON.stringify(deployConfig, null, 2));
    
    // Run the deploy command with explicit token and non-interactive mode
    console.log("Running deploy command...");
    execSync(`echo "${projectId}" | npx sanity deploy`, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        SANITY_AUTH_TOKEN: deployToken,
        CI: 'true'  // Set CI mode to reduce interactivity
      }
    });
    
    // Restore original files
    fs.copyFileSync(`${cliPath}.bak`, cliPath);
    fs.copyFileSync(`${configPath}.bak`, configPath);
    fs.unlinkSync(`${cliPath}.bak`);
    fs.unlinkSync(`${configPath}.bak`);
    if (fs.existsSync(deployConfigPath)) {
      fs.unlinkSync(deployConfigPath);
    }
    
    console.log(`\n✅ Studio deployed successfully!`);
    console.log(`\nYou can access Sanity Studio at: https://${projectId}.sanity.studio/`);
  } catch (error) {
    console.error(`\n❌ Deployment failed with code ${error.status || 1}`);
    console.error(error.message || error);
    console.error("\nPlease try deploying locally with:");
    console.error("1. Clone the repository locally");
    console.error("2. Run 'cd sanity && npx sanity login' to authenticate");
    console.error("3. Run 'npx sanity deploy' to deploy the studio");
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