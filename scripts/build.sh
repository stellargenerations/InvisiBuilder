#!/bin/bash

# Build the client
echo "Building client..."
npx vite build

# Build the server with our custom script
echo "Building server..."
node scripts/build-server.js

echo "Build completed successfully!"