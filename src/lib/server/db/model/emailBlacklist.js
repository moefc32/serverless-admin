import { drizzle } from 'drizzle-orm/d1';
import { asc, desc, eq } from 'drizzle-orm';
import * as schema from '../schema';

const { EmailBlacklist } = schema;

export default {
    getData: async (env) => {
        try {
            const db = drizzle(env.D1_EMAIL, { schema });
            const result = await db
                .select({
                    address: EmailBlacklist.address,
                    hit: EmailBlacklist.hit,
                    note: EmailBlacklist.note,
                })
                .from(EmailBlacklist)
                .orderBy(
                    desc(EmailBlacklist.hit),
                    asc(EmailBlacklist.address)
                );

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when getting data!');
        }
    },
    createData: async (env, data) => {
        try {
            const db = drizzle(env.D1_EMAIL, { schema });
            const [result] = await db
                .insert(EmailBlacklist)
                .values({
                    address: data,
                })
                .returning();

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when creating data!');
        }
    },
    editData: async (env, data, address) => {
        try {
            const db = drizzle(env.D1_EMAIL, { schema });
            const [result] = await db
                .update(EmailBlacklist)
                .set({
                    address: data.address ?? undefined,
                    hit: data.hit ?? undefined,
                    note: data.note ?? undefined,
                })
                .where(eq(EmailBlacklist.address, address))
                .returning();

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when updating data!');
        }
    },
    deleteData: async (env, address) => {
        try {
            const db = drizzle(env.D1_EMAIL, { schema });
            const result = await db
                .delete(EmailBlacklist)
                .where(eq(EmailBlacklist.address, address));

            return result;
        } catch (e) {
            console.error(e);
            throw new Error('Error when deleting data!');
        }
    },
}
