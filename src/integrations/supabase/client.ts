// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gziglizaelkrnrlaxeux.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aWdsaXphZWxrcm5ybGF4ZXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTM5OTIsImV4cCI6MjA1MzQ2OTk5Mn0.xNGgi0JNJeO8KRli9MXvOQJasQWJAIPY5dGm2D-0_fI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);