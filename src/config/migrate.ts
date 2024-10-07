import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgresdb,{client} from './db';

async function migrateData(){

  await migrate(postgresdb, { migrationsFolder: './drizzle' });
  console.log('Migration Done')
  await client.end();
}

migrateData().catch((error)=>{
  console.log(error)
  process.exit(0)
})

