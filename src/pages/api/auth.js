export async function POST({ request }) {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return new Response(JSON.stringify({
            message: 'All data must be filled, please try again!',
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // login sequence

        return new Response(JSON.stringify({
            message: 'Login success.',
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE() {
    try {
        // logout sequence

        return new Response(JSON.stringify({
            message: 'Logout success.',
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error(e);

        return new Response(JSON.stringify({ message: e }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
