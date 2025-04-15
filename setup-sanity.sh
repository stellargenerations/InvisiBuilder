#!/bin/bash

# Export the environment variables
export SANITY_STUDIO_PROJECT_ID=$SANITY_PROJECT_ID
export SANITY_STUDIO_DATASET=$SANITY_DATASET

echo "Using Sanity Project ID: $SANITY_STUDIO_PROJECT_ID"
echo "Using Sanity Dataset: $SANITY_STUDIO_DATASET"

# Navigate to the Sanity directory
cd sanity

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing Sanity dependencies..."
  npm install
fi

# Start the Sanity Studio
echo "Starting Sanity Studio..."
npm run dev