import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const EmailBlacklist = sqliteTable('Email_Blacklist', {
	address: text('address').primaryKey(),
	hit: integer('hit').notNull().default(0),
	note: text('note'),
});
