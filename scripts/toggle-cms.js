const fs = require('fs');
const path = require('path');

/**
 * This script toggles between using Sanity.io and Markdown files for content management.
 * Usage: node scripts/toggle-cms.js [sanity|markdown]
 * 
 * If no argument is provided, it will toggle between the two.
 */

// File paths
const serverIndexPath = path.join(process.cwd(), 'server', 'index.ts');
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Backup directories
const backupDir = path.join(process.cwd(), 'server', 'backups');
const sanityBackupDir = path.join(backupDir, 'sanity');
const markdownBackupDir = path.join(backupDir, 'markdown');

// Ensure backup directories exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}
if (!fs.existsSync(sanityBackupDir)) {
  fs.mkdirSync(sanityBackupDir);
}
if (!fs.existsSync(markdownBackupDir)) {
  fs.mkdirSync(markdownBackupDir);
}

// Function to determine current CMS
function getCurrentCMS() {
  const serverIndexContent = fs.readFileSync(serverIndexPath, 'utf8');
  
  if (serverIndexContent.includes('./routes.sanity') || serverIndexContent.includes('./routes')) {
    return 'sanity';
  } else if (serverIndexContent.includes('./routes.markdown')) {
    return 'markdown';
  } else {
    console.error('Cannot determine current CMS. Server index file might be corrupted.');
    process.exit(1);
  }
}

// Function to backup current files
function backupCurrentFiles(currentCMS) {
  const backupDirPath = currentCMS === 'sanity' ? sanityBackupDir : markdownBackupDir;
  
  // Backup server/index.ts
  fs.copyFileSync(
    serverIndexPath,
    path.join(backupDirPath, 'index.ts')
  );
  
  console.log(`Backed up current ${currentCMS} files.`);
}

// Function to switch to a specific CMS
function switchToCMS(targetCMS) {
  // Update server/index.ts
  const sourcePath = targetCMS === 'sanity' 
    ? path.join(sanityBackupDir, 'index.ts') 
    : path.join(process.cwd(), 'server', 'index.markdown.ts');
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    process.exit(1);
  }
  
  fs.copyFileSync(sourcePath, serverIndexPath);
  
  // Update package.json to use the correct dev script
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Update dev script if needed
  if (targetCMS === 'sanity' && packageJson.scripts.dev !== 'tsx server/index.ts') {
    packageJson.scripts.dev = 'tsx server/index.ts';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } else if (targetCMS === 'markdown' && packageJson.scripts.dev !== 'tsx server/index.ts') {
    packageJson.scripts.dev = 'tsx server/index.ts';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  
  console.log(`Switched to ${targetCMS} CMS successfully.`);
}

// Main function
function main() {
  // Get the current CMS
  const currentCMS = getCurrentCMS();
  console.log(`Current CMS: ${currentCMS}`);
  
  // Determine target CMS from arguments or toggle
  let targetCMS = process.argv[2];
  
  if (!targetCMS) {
    // Toggle between the two
    targetCMS = currentCMS === 'sanity' ? 'markdown' : 'sanity';
  }
  
  // Validate target CMS
  if (targetCMS !== 'sanity' && targetCMS !== 'markdown') {
    console.error('Invalid CMS specified. Use "sanity" or "markdown".');
    process.exit(1);
  }
  
  // If already using the target CMS, exit
  if (currentCMS === targetCMS) {
    console.log(`Already using ${targetCMS} CMS.`);
    process.exit(0);
  }
  
  // Backup current files
  backupCurrentFiles(currentCMS);
  
  // Switch to target CMS
  switchToCMS(targetCMS);
  
  console.log(`
===================================================
CMS switched from ${currentCMS} to ${targetCMS}.
Restart your development server to apply changes.
===================================================
`);
}

// Run the main function
main();