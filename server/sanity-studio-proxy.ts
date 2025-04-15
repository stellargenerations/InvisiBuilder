import { spawn } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';
import path from 'path';
import { log } from './vite';

let sanityProcess: ReturnType<typeof spawn> | null = null;

export async function setupSanityStudioProxy(app: Express): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Set up environment variables for Sanity Studio
      process.env.SANITY_STUDIO_PROJECT_ID = process.env.SANITY_PROJECT_ID;
      process.env.SANITY_STUDIO_DATASET = process.env.SANITY_DATASET || 'invisibuilder';

      log('Starting Sanity Studio server...');
      const sanityDir = path.join(process.cwd(), 'sanity');
      
      // Start Sanity Studio on port 3333
      sanityProcess = spawn('npx', ['sanity', 'dev', '--port', '3333'], {
        cwd: sanityDir,
        env: { ...process.env },
        shell: true
      });

      // Log Sanity Studio output
      sanityProcess.stdout?.on('data', (data) => {
        const outputStr = data.toString();
        log(`[Sanity Studio] ${outputStr.trim()}`);
        
        // When we see this message, the server is ready
        if (outputStr.includes('Sanity Studio') && outputStr.includes('ready')) {
          setupProxy(app);
          resolve();
        }
      });

      sanityProcess.stderr?.on('data', (data) => {
        log(`[Sanity Studio Error] ${data.toString().trim()}`);
      });

      sanityProcess.on('close', (code) => {
        if (code !== 0) {
          log(`Sanity Studio process exited with code ${code}`);
        }
      });

      // Set a timeout in case the ready message isn't detected
      setTimeout(() => {
        setupProxy(app);
        resolve();
      }, 10000);

    } catch (error) {
      log(`Error starting Sanity Studio: ${error}`);
      reject(error);
    }
  });
}

function setupProxy(app: Express) {
  // Add middleware to handle CORS and content-type issues
  app.use('/studio', (req, res, next) => {
    // Set proper CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Create a proxy for the Sanity Studio
  const sanityProxy = createProxyMiddleware({
    target: 'http://localhost:3333',
    changeOrigin: true,
    pathRewrite: {
      '^/studio': '/' // Remove /studio prefix when forwarding to Sanity
    },
    ws: true, // Enable WebSockets
    onProxyRes: function(proxyRes, req, res) {
      // Handle issues with Sanity Studio responses
      proxyRes.headers['x-frame-options'] = '';
      
      // Ensure proper content types for JS modules
      if (req.url.endsWith('.js') || req.url.includes('.js?')) {
        proxyRes.headers['content-type'] = 'application/javascript';
      }
      
      // Ensure proper content type for CSS
      if (req.url.endsWith('.css') || req.url.includes('.css?')) {
        proxyRes.headers['content-type'] = 'text/css';
      }
    }
  });

  // Mount the proxy middleware at /studio
  app.use('/studio', sanityProxy);
  log('Sanity Studio proxy is set up and running at /studio');
}

// Clean up function to terminate Sanity process on exit
export function shutdownSanityStudio() {
  if (sanityProcess) {
    log('Shutting down Sanity Studio...');
    sanityProcess.kill();
    sanityProcess = null;
  }
}