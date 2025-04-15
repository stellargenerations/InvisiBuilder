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
  // Create a proxy for the Sanity Studio
  const sanityProxy = createProxyMiddleware({
    target: 'http://localhost:3333',
    changeOrigin: true,
    pathRewrite: {
      '^/studio': '/' // Remove /studio prefix when forwarding to Sanity
    },
    ws: true, // Enable WebSockets
    onProxyRes: (proxyRes: any, req: any, res: any) => {
      // Handle issues with Sanity Studio responses
      proxyRes.headers['x-frame-options'] = '';
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