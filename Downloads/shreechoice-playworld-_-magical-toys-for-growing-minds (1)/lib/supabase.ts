import { createClient, SupabaseClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// Please replace these placeholder values with your own Supabase project's URL and Anon Key.
// You can find these in your Supabase project settings under "API".
// The README.txt file has instructions on setting up your Supabase backend.
const supabaseUrl = 'https://givglkabwuqhrhbqnnef.supabase.co'; // e.g., 'https://givglkabwuqhrhbqnnef.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpdmdsa2Fid3VxaHJoYnFubmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDIxODMsImV4cCI6MjA4MTg3ODE4M30.z_KN9DId54wxjLpzlfbiwU11mcbrFOldHZQm8awfRBw'; // e.g., 'eyJh..._YOUR_KEY_...9uA'

// Create the Supabase client.
// If the credentials are still placeholders or invalid, Supabase's own library will handle the error, 
// which is more informative than a custom check.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
