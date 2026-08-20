import { drizzle } from 'drizzle-orm/d1';
import { asc, desc, eq } from 'drizzle-orm';
import * as schema from '../schema';

const { UrlShortener } = schema;

export default {
    getData: async (env) => {
        try {
            const db = drizzle(env.D1_DATABASE, { schema });
            const result = await db
                .select({
                    title: UrlShortener.title,
                    shortUrl: UrlShortener.shortUrl,
                    longUrl: UrlShortener.longUrl,
                    hit: UrlShortener.hit,
                })
                .from(UrlShortener)
                .orderBy(
                    asc(UrlShortener.title),
                    asc(UrlShortener.shortUrl)
                );

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (env, data) => {
        try {
            const db = drizzle(env.D1_DATABASE, { schema });
            const [result] = await db
                .insert(UrlShortener)
                .values({
                    title: data.title,
                    shortUrl: data.shortUrl,
                    longUrl: data.longUrl,
                })
                .returning();

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    editData: async (env, data, shortUrl) => {
        try {
            const db = drizzle(env.D1_DATABASE, { schema });
            const [result] = await db
                .update(UrlShortener)
                .set({
                    title: data.title ?? undefined,
                    shortUrl: data.shortUrl ?? undefined,
                    longUrl: data.longUrl ?? undefined,
                })
                .where(eq(UrlShortener.shortUrl, shortUrl))
                .returning();

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when updating data!');
        }
    },
    deleteData: async (env, shortUrl) => {
        try {
            const db = drizzle(env.D1_DATABASE, { schema });
            const result = await db
                .delete(UrlShortener)
                .where(eq(UrlShortener.shortUrl, shortUrl));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
