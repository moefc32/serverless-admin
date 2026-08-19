import { env } from 'cloudflare:workers';
import model from '../../lib/server/db/model/emailBlacklist';

export async function GET() {
    try {
        const result = await model.getData(env)

        return new Response(JSON.stringify({
            message: 'Get data success.',
            data: result,
        }), {
            headers: {
                'Cache-Control': 'private, max-age=1, stale-while-revalidate=1',
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function PUT() {
    try {

    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function PATCH() {
    try {

    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function DELETE() {
    try {

    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
        });
    }
}
