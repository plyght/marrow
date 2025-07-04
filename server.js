import { createClient } from '@supabase/supabase-js';
import { file } from 'bun';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Handle API routes
    if (url.pathname === '/api/waitlist') {
      if (req.method === 'POST') {
        try {
          if (!isSupabaseConfigured()) {
            return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const { email } = await req.json();

          if (!email || typeof email !== 'string') {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ error: 'Invalid email format' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Insert into waitlist
          const { data, error } = await supabase
            .from('waitlist_users')
            .insert([{ email, source: 'landing_page' }])
            .select();

          if (error) {
            // Check if it's a duplicate email error
            if (error.code === '23505') {
              return new Response(JSON.stringify({ error: 'Email already registered' }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            throw error;
          }

          return new Response(JSON.stringify({ 
            message: 'Successfully added to waitlist',
            user: data[0]
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Waitlist signup error:', error);
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      if (req.method === 'GET') {
        try {
          if (!isSupabaseConfigured()) {
            return new Response(JSON.stringify({ count: 0 }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const { count, error } = await supabase
            .from('waitlist_users')
            .select('*', { count: 'exact', head: true });

          if (error) {
            throw error;
          }

          return new Response(JSON.stringify({ count: count || 0 }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Waitlist count error:', error);
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // Serve static files
    let filePath = url.pathname;
    if (filePath === '/') {
      filePath = '/index.html';
    }

    // Try to serve from current directory first
    let fullPath = '.' + filePath;
    
    try {
      let staticFile = file(fullPath);
      if (await staticFile.exists()) {
        return new Response(staticFile);
      }
      
      // If not found, try public directory
      fullPath = './public' + filePath;
      staticFile = file(fullPath);
      if (await staticFile.exists()) {
        return new Response(staticFile);
      }
    } catch (error) {
      console.error('Error serving file:', error);
    }

    // 404 for everything else
    return new Response('Not found', { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);