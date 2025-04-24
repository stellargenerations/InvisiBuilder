#!/usr/bin/env node

// This script properly builds the server with ESM and __dirname polyfill
import { build } from 'esbuild';
import fs from 'fs';

async function buildServer() {
  try {
    console.log('Building server...');
    
    // Ensure the dist directory exists
    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist', { recursive: true });
    }
    
    // Build with esbuild
    const result = await build({
      entryPoints: ['server/index.ts'],
      platform: 'node',
      packages: 'external',
      bundle: true,
      format: 'esm',
      outdir: 'dist',
      banner: {
        js: `
          import { createRequire } from 'module';
          import path from 'path';
          import { fileURLToPath } from 'url';
          
          const require = createRequire(import.meta.url);
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
        `
      }
    });
    
    console.log('Server build completed successfully');
    return result;
  } catch (error) {
    console.error('Error building server:', error);
    process.exit(1);
  }
}

buildServer();