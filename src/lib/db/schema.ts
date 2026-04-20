import {pgTable,serial,text,timestamp} from "drizzle-orm/pg-core";


export const healthCheck=pgTable('health_check',{
    id:serial('id').primaryKey(),
    message:text('message').notNull(),
    createAt:timestamp('created_at').defaultNow().notNull(),
});