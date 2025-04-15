#!/usr/bin/env node

/**
 * This script deploys Sanity Studio to Sanity's hosted version
 * Prerequisites:
 * - SANITY_PROJECT_ID environment variable
 * - SANITY_DATASET environment variable (usually "invisibuilder")
 * - SANITY_API_TOKEN environment variable (with write permissions)
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Sanity Studio directory
const SANITY_DIR = path.join(__dirname, '../sanity');

// Check if we have the necessary environment variables
function checkEnvironment() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token = process.env.SANITY_API_TOKEN;
  
  if (!projectId) {
    console.error('Error: Missing Sanity project ID');
    console.log('Please make sure SANITY_PROJECT_ID environment variable is set');
    process.exit(1);
  }
  
  if (!dataset) {
    console.error('Error: Missing Sanity dataset name');
    console.log('Please make sure SANITY_DATASET environment variable is set');
    process.exit(1);
  }
  
  if (!token) {
    console.error('Error: Missing Sanity API token');
    console.log('Please make sure SANITY_API_TOKEN environment variable is set');
    process.exit(1);
  }

  return { projectId, dataset, token };
}

// Deploy Sanity Studio
function deploySanityStudio({ projectId }) {
  console.log(`Deploying Sanity Studio for project ${projectId}...`);
  
  const deployProcess = spawn('npx', ['sanity', 'deploy'], {
    cwd: SANITY_DIR,
    stdio: 'inherit',
    shell: true,
    env: process.env
  });
  
  deployProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Sanity Studio deployed successfully!');
      console.log(`\nYou can now access Sanity Studio at: https://${projectId}.sanity.studio/`);
      console.log('\nLogin with your Sanity account to manage content.');
    } else {
      console.error(`\n❌ Deployment failed with code ${code}`);
      console.log('\nTry the following:');
      console.log('1. Make sure you have the correct SANITY_API_TOKEN with write permissions');
      console.log('2. Try running "cd sanity && npx sanity deploy" manually');
    }
  });
}

// Main function
(async () => {
  try {
    // Check environment
    const { projectId } = checkEnvironment();
    
    // Deploy Sanity Studio
    deploySanityStudio({ projectId });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();