import express, { Express, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes.markdown';
import { setupVite } from './vite';

// Polyfill for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express server
async function main() {
  const app: Express = express();
  
  // Parse JSON request bodies
  app.use(express.json());
  
  // Register our API routes
  const server = await registerRoutes(app);
  
  // Setup Vite development server in development mode
  if (process.env.NODE_ENV !== 'production') {
    await setupVite(app, server);
  } else {
    // Serve static client assets in production
    app.use(express.static(path.join(__dirname, '../dist/public')));
    
    // Serve index.html for all non-API routes in production
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../dist/public/index.html'));
    });
  }
  
  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });
  
  // Handle 404 errors
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  });
  
  // Return the server instance
  return server;
}

// Start the server
main()
  .then(() => console.log('[server] Server started successfully'))
  .catch((err) => console.error('[server] Failed to start server:', err));