import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const EmailBlacklist = sqliteTable('Email_Blacklist', {
	address: text('address').notNull().primaryKey(),
	hit: integer('hit').notNull().default(0),
	note: text('note'),
});

export const UrlShortener = sqliteTable('URL_Shortener', {
	shortUrl: text('short_url').notNull().primaryKey(),
	longUrl: text('long_url').notNull(),
	title: text('title'),
	hit: integer('hit').notNull().default(0),
});
