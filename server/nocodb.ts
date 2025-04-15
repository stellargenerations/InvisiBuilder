import { Express } from 'express';
import { log } from './vite';
import * as nocodb from 'nocodb';

let nocoApp: any = null;

export async function setupNocoDB(app: Express) {
  try {
    log('Initializing NocoDB...', 'nocodb');
    
    // Initialize NocoDB with our PostgreSQL database
    nocoApp = await Noco.init({
      title: 'Invisibuilder CMS',
      baseUrl: '/nc',
      dbUrl: process.env.DATABASE_URL!,
      toolDir: './.nocodb',
      port: process.env.PORT || '5000',
      env: process.env.NODE_ENV || 'development',
      // Disable dashboard creation by default during production
      dashboardPath: process.env.NODE_ENV === 'production' ? false : '/nc',
      // Additional NocoDB config
      meta: {
        db: {
          client: 'pg', // PostgreSQL client
        },
      },
    });
    
    log('NocoDB initialized successfully', 'nocodb');
    
    // Mount the NocoDB app
    app.use(nocoApp);
    
    log('NocoDB mounted at /nc', 'nocodb');
    return true;
  } catch (err) {
    log(`Error initializing NocoDB: ${err}`, 'nocodb');
    console.error('Failed to initialize NocoDB:', err);
    return false;
  }
}

export async function shutdownNocoDB() {
  if (nocoApp) {
    try {
      await nocoApp.close();
      log('NocoDB shutdown successfully', 'nocodb');
    } catch (err) {
      log(`Error shutting down NocoDB: ${err}`, 'nocodb');
    }
  }
}