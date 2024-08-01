// app/api/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Substitua com sua URL e chave de API
const supabaseUrl = 'https://tdnqkioohwizztcbmxqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbnFraW9vaHdpenp0Y2JteHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1NDY0MDIsImV4cCI6MjAzODEyMjQwMn0.BFrYaHF_V958vVm8n_D-JztF0Qvuv_hR_cJT0RZYK5Q';

const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;
