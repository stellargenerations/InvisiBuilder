#!/usr/bin/env node

/**
 * This script toggles between using the PostgreSQL database and Sanity.io for content management.
 * Usage: node scripts/toggle-cms.js [postgres|sanity]
 * 
 * If no argument is provided, it will toggle between the two.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to server files
const POSTGRES_SERVER_INDEX = path.join(__dirname, '../server/index.ts');
const SANITY_SERVER_INDEX = path.join(__dirname, '../server/index.sanity.ts');

const POSTGRES_SERVER_ROUTES = path.join(__dirname, '../server/routes.ts');
const SANITY_SERVER_ROUTES = path.join(__dirname, '../server/routes.sanity.ts');

// Backup directories
const BACKUP_DIR = path.join(__dirname, '../server/backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Get current CMS setting
function getCurrentCMS() {
  try {
    // Check if server/index.ts matches the Sanity version
    const currentServerContent = fs.readFileSync(POSTGRES_SERVER_INDEX, 'utf8');
    
    if (currentServerContent.includes('import { registerRoutes } from "./routes.sanity"')) {
      return 'sanity';
    } else {
      return 'postgres';
    }
  } catch (error) {
    console.error('Error determining current CMS:', error.message);
    return 'unknown';
  }
}

// Backup current files
function backupCurrentFiles(currentCMS) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  try {
    fs.copyFileSync(
      POSTGRES_SERVER_INDEX, 
      path.join(BACKUP_DIR, `index.${currentCMS}.${timestamp}.ts`)
    );
    
    fs.copyFileSync(
      POSTGRES_SERVER_ROUTES,
      path.join(BACKUP_DIR, `routes.${currentCMS}.${timestamp}.ts`)
    );
    
    console.log(`Backed up current ${currentCMS} files to ${BACKUP_DIR}`);
  } catch (error) {
    console.error('Error backing up files:', error.message);
  }
}

// Switch to specified CMS
function switchToCMS(targetCMS) {
  if (targetCMS === 'sanity') {
    // Switch to Sanity
    console.log('Switching to Sanity.io for content management...');
    
    // Update the server index file to use Sanity routes
    let indexContent = fs.readFileSync(POSTGRES_SERVER_INDEX, 'utf8');
    indexContent = indexContent.replace(
      'import { registerRoutes } from "./routes"',
      'import { registerRoutes } from "./routes.sanity"'
    );
    fs.writeFileSync(POSTGRES_SERVER_INDEX, indexContent);
    
    console.log('Successfully switched to Sanity.io!');
    console.log('\nIMPORTANT: Make sure you have the following environment variables set:');
    console.log('- SANITY_PROJECT_ID');
    console.log('- SANITY_DATASET');
    console.log('- SANITY_API_TOKEN (for content migration or management)');
    
  } else if (targetCMS === 'postgres') {
    // Switch to PostgreSQL
    console.log('Switching to PostgreSQL for content management...');
    
    // Update the server index file to use PostgreSQL routes
    let indexContent = fs.readFileSync(POSTGRES_SERVER_INDEX, 'utf8');
    indexContent = indexContent.replace(
      'import { registerRoutes } from "./routes.sanity"',
      'import { registerRoutes } from "./routes"'
    );
    fs.writeFileSync(POSTGRES_SERVER_INDEX, indexContent);
    
    console.log('Successfully switched to PostgreSQL!');
    console.log('\nIMPORTANT: Make sure your DATABASE_URL environment variable is set correctly.');
  }
  
  // Restart the server (uncomment if needed)
  // console.log('Restarting server...');
  // try {
  //   execSync('npm run dev');
  // } catch (error) {
  //   console.error('Error restarting server:', error.message);
  // }
}

// Main function
function main() {
  // Get the current CMS
  const currentCMS = getCurrentCMS();
  console.log(`Current CMS: ${currentCMS}`);
  
  // Determine the target CMS
  let targetCMS;
  
  if (process.argv.length > 2) {
    // Use command line argument
    targetCMS = process.argv[2].toLowerCase();
    
    if (targetCMS !== 'postgres' && targetCMS !== 'sanity') {
      console.error('Invalid CMS specified. Use "postgres" or "sanity".');
      process.exit(1);
    }
  } else {
    // Toggle between CMSes
    targetCMS = currentCMS === 'postgres' ? 'sanity' : 'postgres';
  }
  
  // If already using the target CMS, do nothing
  if (currentCMS === targetCMS) {
    console.log(`Already using ${targetCMS} for content management.`);
    return;
  }
  
  // Backup current files
  backupCurrentFiles(currentCMS);
  
  // Switch to the target CMS
  switchToCMS(targetCMS);
}

// Run the script
main();