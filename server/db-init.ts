import { db } from './db';

export async function initializeDatabase() {
  try {
    console.log('Creating database schema...');
    
    await db.execute(`
      -- Create tables if they don't exist
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT NOT NULL,
        article_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT,
        featured_image TEXT NOT NULL,
        published_date TIMESTAMP DEFAULT NOW(),
        updated_date TIMESTAMP DEFAULT NOW(),
        category_id INTEGER,
        category TEXT,
        read_time TEXT DEFAULT '5 min',
        tags TEXT[],
        featured BOOLEAN DEFAULT FALSE,
        status TEXT DEFAULT 'published',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS media_files (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        thumbnail TEXT,
        duration TEXT,
        article_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        url TEXT NOT NULL,
        type TEXT NOT NULL,
        article_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS content_sections (
        id SERIAL PRIMARY KEY,
        title TEXT,
        content TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        article_id INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        consent BOOLEAN DEFAULT TRUE,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('Database schema created successfully!');
    
    // Insert sample data for categories
    const sampleCategories = [
      {
        name: 'Web Development',
        description: 'Articles about modern web development techniques and best practices',
        slug: 'web-development',
        icon: 'code'
      },
      {
        name: 'Design',
        description: 'Articles about UI/UX design principles and tools',
        slug: 'design',
        icon: 'paint-brush'
      },
      {
        name: 'Business',
        description: 'Articles about entrepreneurship and business strategies',
        slug: 'business',
        icon: 'briefcase'
      }
    ];
    
    // Check if categories already exist
    const existingCategories = await db.execute(
      'SELECT COUNT(*) as count FROM categories'
    );
    
    // Extract count from result - PostgreSQL returns count as string
    const count = parseInt(existingCategories.rows[0].count as string, 10);
    
    if (count === 0) {
      console.log('Inserting sample categories...');
      
      for (const category of sampleCategories) {
        await db.execute(
          `INSERT INTO categories (name, description, slug, icon) 
           VALUES ('${category.name}', '${category.description}', '${category.slug}', '${category.icon}')`
        );
      }
      
      console.log('Sample categories inserted successfully!');
    } else {
      console.log('Categories already exist, skipping sample data insertion.');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}