import {drizzle} from 'drizzle-orm/neon-serverless';
import {Pool} from '@neondatabase/serverless';
import * as Schema from './schema';

if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in the environment variables');
}

const pool=new Pool({connectionString:process.env.DATABASE_URL});

let schema=Schema;
export const db=drizzle(pool,{schema: schema});