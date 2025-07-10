// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Defina SUPABASE_URL e SUPABASE_ANON_KEY em .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
module.exports = supabase;
