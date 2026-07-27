import { Pool } from 'pg';

// Instância global para evitar múltiplas conexões em desenvolvimento
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Se o servidor exigir SSL (como Heroku, Supabase, Render), descomente as linhas abaixo:
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

export default pool;