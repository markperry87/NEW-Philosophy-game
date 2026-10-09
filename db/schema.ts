// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const saves=sqliteTable('game_saves',{owner:text('owner').primaryKey(),state:text('state').notNull(),revision:integer('revision').notNull().default(1),updatedAt:integer('updated_at').notNull(),activeSession:text('active_session').notNull().default(''),lastWrite:text('last_write').notNull().default('')});
