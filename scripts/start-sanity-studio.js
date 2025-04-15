#!/usr/bin/env node

/**
 * This script initializes and starts Sanity Studio.
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Sanity Studio directory
const SANITY_DIR = path.join(__dirname, '../sanity');

// Check if we have a Sanity project ID environment variable
function checkSanityConfig() {
  // Check if environment variables are set
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET;
  
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

  return projectId;
}

// Initialize Sanity Studio if needed
function initializeSanityStudio() {
  console.log('Initializing Sanity Studio...');
  
  // Check if node_modules exists in Sanity directory
  const nodeModulesPath = path.join(SANITY_DIR, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('Installing Sanity Studio dependencies...');
    
    const installProcess = spawn('npm', ['install'], {
      cwd: SANITY_DIR,
      stdio: 'inherit',
      shell: true
    });
    
    return new Promise((resolve, reject) => {
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Dependencies installed successfully');
          resolve();
        } else {
          console.error(`Error installing dependencies, exit code: ${code}`);
          reject(new Error('Failed to install dependencies'));
        }
      });
    });
  }
  
  return Promise.resolve();
}

// Start Sanity Studio
function startSanityStudio() {
  console.log('Starting Sanity Studio...');
  
  const studioProcess = spawn('npm', ['run', 'dev'], {
    cwd: SANITY_DIR,
    stdio: 'inherit',
    shell: true
  });
  
  studioProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Sanity Studio exited with code ${code}`);
    }
  });
}

// Main function
async function main() {
  try {
    // Export environment variables to be used by Sanity
    process.env.SANITY_STUDIO_PROJECT_ID = process.env.SANITY_PROJECT_ID;
    process.env.SANITY_STUDIO_DATASET = process.env.SANITY_DATASET;
    
    // Check Sanity configuration
    const projectId = checkSanityConfig();
    console.log(`Using Sanity project ID: ${projectId}`);
    
    // Initialize Sanity Studio
    await initializeSanityStudio();
    
    // Start Sanity Studio
    startSanityStudio();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();