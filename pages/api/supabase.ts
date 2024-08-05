// app/api/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tdnqkioohwizztcbmxqg.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbnFraW9vaHdpenp0Y2JteHFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjU0NjQwMiwiZXhwIjoyMDM4MTIyNDAyfQ.uk5hxJ-zFWQVCH7FmwuwY-iTRFwcOJcrOpx8PaHnVqs';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabase;
