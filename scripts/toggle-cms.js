#!/usr/bin/env node

/**
 * This script toggles between using the PostgreSQL database and Sanity.io for content management.
 * Usage: node scripts/toggle-cms.js [postgres|sanity]
 * 
 * If no argument is provided, it will toggle between the two.
 */

const fs = require('fs');
const path = require('path');

const POSTGRES_FILES = {
  'server/routes.ts': 'server/routes.postgres.ts',
  'server/index.ts': 'server/index.postgres.ts'
};

const SANITY_FILES = {
  'server/routes.sanity.ts': 'server/routes.ts',
  'server/index.sanity.ts': 'server/index.ts'
};

// Check which CMS is currently active
function getCurrentCMS() {
  // Check if the routes file imports from storage.ts (PostgreSQL) or sanity-api.ts (Sanity)
  try {
    const routesContent = fs.readFileSync(path.join(__dirname, '../server/routes.ts'), 'utf8');
    if (routesContent.includes('import { storage } from "./storage";')) {
      return 'postgres';
    } else if (routesContent.includes('import * as sanityApi from "./sanity-api";')) {
      return 'sanity';
    }
    return null;
  } catch (err) {
    console.error('Error determining current CMS:', err.message);
    return null;
  }
}

// Backup current files
function backupCurrentFiles(currentCMS) {
  console.log(`Backing up current ${currentCMS} files...`);
  
  const filesToBackup = currentCMS === 'postgres' ? POSTGRES_FILES : SANITY_FILES;
  
  for (const [src, dest] of Object.entries(filesToBackup)) {
    try {
      if (!fs.existsSync(path.join(__dirname, `../${dest}`))) {
        fs.copyFileSync(
          path.join(__dirname, `../${src}`),
          path.join(__dirname, `../${dest}`)
        );
        console.log(`  ✓ Backed up ${src} to ${dest}`);
      } else {
        console.log(`  ⚠️ Backup already exists for ${src}, skipping`);
      }
    } catch (err) {
      console.error(`  ✗ Error backing up ${src}:`, err.message);
    }
  }
}

// Switch to the specified CMS
function switchToCMS(targetCMS) {
  console.log(`Switching to ${targetCMS}...`);
  
  const filesToReplace = targetCMS === 'postgres' ? POSTGRES_FILES : SANITY_FILES;
  
  for (const [src, dest] of Object.entries(filesToReplace)) {
    try {
      // Make sure the source file exists
      if (!fs.existsSync(path.join(__dirname, `../${src}`))) {
        console.error(`  ✗ Source file ${src} does not exist`);
        continue;
      }
      
      // Replace the destination file with the source file
      fs.copyFileSync(
        path.join(__dirname, `../${src}`),
        path.join(__dirname, `../${dest.split('.postgres.ts')[0].split('.sanity.ts')[0]}.ts`)
      );
      console.log(`  ✓ Replaced ${dest.split('.postgres.ts')[0].split('.sanity.ts')[0]}.ts with ${src}`);
    } catch (err) {
      console.error(`  ✗ Error replacing ${dest}:`, err.message);
    }
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const targetCMS = args[0]?.toLowerCase();
  
  // Check the current CMS
  const currentCMS = getCurrentCMS();
  
  if (!currentCMS) {
    console.error('Could not determine the current CMS. Please check your files.');
    process.exit(1);
  }
  
  console.log(`Current CMS: ${currentCMS}`);
  
  // Determine the target CMS
  let newCMS;
  
  if (!targetCMS) {
    // Toggle between the two
    newCMS = currentCMS === 'postgres' ? 'sanity' : 'postgres';
    console.log(`No CMS specified, toggling to ${newCMS}`);
  } else if (['postgres', 'sanity'].includes(targetCMS)) {
    // Use the specified CMS
    newCMS = targetCMS;
    
    if (newCMS === currentCMS) {
      console.log(`Already using ${newCMS}, no changes needed.`);
      process.exit(0);
    }
  } else {
    console.error('Invalid CMS specified. Use "postgres" or "sanity".');
    process.exit(1);
  }
  
  // Backup current files
  backupCurrentFiles(currentCMS);
  
  // Switch to the new CMS
  switchToCMS(newCMS);
  
  console.log(`\nSuccessfully switched from ${currentCMS} to ${newCMS}.`);
  console.log('\nYou may need to restart your server for the changes to take effect.');
}

// Run the script
main();