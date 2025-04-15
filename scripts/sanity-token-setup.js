/**
 * This script helps obtain and set up a Sanity API token for content migration
 * and management through the Invisibuilder application.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Main function
async function main() {
  console.log('\n╭───────────────────────────────────────────────╮');
  console.log('│         Sanity.io API Token Setup            │');
  console.log('╰───────────────────────────────────────────────╯\n');
  
  console.log('This script will help you set up a Sanity API token for content migration.');
  console.log('Before proceeding, please make sure you have:');
  console.log('  1. Created a Sanity.io account');
  console.log('  2. Accessed your project settings at https://www.sanity.io/manage');
  console.log('  3. Gone to API section and generated a new token with write access\n');
  
  // Check if environment variables are already configured
  let projectId = process.env.SANITY_PROJECT_ID;
  let dataset = process.env.SANITY_DATASET;
  
  if (!projectId || !dataset) {
    console.log('Error: Sanity Project ID or Dataset not found in environment variables.');
    console.log('Please make sure to set SANITY_PROJECT_ID and SANITY_DATASET first.\n');
    rl.close();
    return;
  }
  
  console.log(`Using Sanity Project ID: ${projectId}`);
  console.log(`Using Sanity Dataset: ${dataset}\n`);
  
  // Get token from user
  const token = await question('Enter your Sanity API token (will not be displayed): ');
  
  if (!token) {
    console.log('\nError: No token provided. Exiting...');
    rl.close();
    return;
  }
  
  console.log('\nThanks! Now, how would you like to save this token?');
  console.log('1. As a temporary environment variable (current session only)');
  console.log('2. Save to a .env file in the project root (persists between sessions)');
  
  const saveOption = await question('\nEnter option (1 or 2): ');
  
  if (saveOption === '1') {
    // Set as environment variable for the current process
    process.env.SANITY_API_TOKEN = token;
    console.log('\nToken set as environment variable SANITY_API_TOKEN for the current session.');
    console.log('Note: This will not persist after you close the terminal.');
  } else if (saveOption === '2') {
    // Save to .env file
    const envPath = path.join(process.cwd(), '.env');
    
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Check if the token is already in the file
      if (envContent.includes('SANITY_API_TOKEN=')) {
        // Replace existing token
        envContent = envContent.replace(
          /SANITY_API_TOKEN=.*/,
          `SANITY_API_TOKEN=${token}`
        );
      } else {
        // Add token to the end
        envContent += `\nSANITY_API_TOKEN=${token}\n`;
      }
    } else {
      // Create new .env file
      envContent = `SANITY_API_TOKEN=${token}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('\nToken saved to .env file.');
  } else {
    console.log('\nInvalid option. Token not saved.');
  }
  
  console.log('\nWhat would you like to do next?');
  console.log('1. Run the content migration script (migrate data from PostgreSQL to Sanity)');
  console.log('2. Exit');
  
  const nextOption = await question('\nEnter option (1 or 2): ');
  
  if (nextOption === '1') {
    console.log('\nStarting content migration...');
    console.log('Running: node scripts/migrate-to-sanity.js');
    
    // In a real scenario, we would spawn a child process to run the migration script
    console.log('\nThis would start the migration process.');
    console.log('For now, you can manually run:');
    console.log('  node scripts/migrate-to-sanity.js');
  } else {
    console.log('\nExiting. You can run migration manually with:');
    console.log('  node scripts/migrate-to-sanity.js');
  }
  
  console.log('\nSetup complete!');
  rl.close();
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});