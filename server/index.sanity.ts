import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { resolve } from "path";
import { log, setupVite, serveStatic } from "./vite";
import { registerRoutes } from "./routes.sanity";
import { config } from "dotenv";

// Initialize environment variables
config();

async function main() {
  // Create Express app
  const app: Express = express();

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files
  serveStatic(app);

  // Register API routes
  const server = await registerRoutes(app);

  // Setup Vite dev server or serve static assets in production
  await setupVite(app, server);

  // Generic error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    log(`Error ${statusCode}: ${message}`, "express");
    
    res.status(statusCode).json({
      error: {
        message,
        statusCode,
      },
    });
  });

  // Catch-all route handler
  app.use((req: Request, res: Response) => {
    // Serve the index.html for client-side routing
    res.sendFile(resolve("dist/client/index.html"));
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`, "express");
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});