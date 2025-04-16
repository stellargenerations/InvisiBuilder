#!/bin/bash

echo "Starting Sanity Studio on http://0.0.0.0:3333"
echo "This will allow you to create and edit tables in your content"
cd sanity && npx sanity dev --host=0.0.0.0 --port=3333