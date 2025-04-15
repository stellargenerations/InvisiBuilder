declare module 'nocodb' {
  interface NocoDBOptions {
    title?: string;
    baseUrl?: string;
    dbUrl: string;
    toolDir?: string;
    port?: string;
    env?: string;
    dashboardPath?: string | false;
    meta?: {
      db?: {
        client?: string;
      };
    };
  }

  interface NocoApp {
    close(): Promise<void>;
  }

  export default {
    init(options: NocoDBOptions): Promise<NocoApp>;
  };
}