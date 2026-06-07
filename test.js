import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const url = urlMatch[1].replace(/['"]/g, '').trim();
const key = keyMatch[1].replace(/['"]/g, '').trim();

fetch(url + '/rest/v1/customer_debts?limit=1', { headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } })
  .then(res => res.json())
  .then(data => {
    console.log("customer_debts:", data);
  });
