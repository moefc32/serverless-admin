export async function DELETE({ request }) {
    const body = await request.json();
    const { worker } = body;

    if (!worker) {
        return new Response(JSON.stringify({
            message: 'Valid worker must be provided, please try again!',
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // clear the worker cache

        return new Response(JSON.stringify({
            message: 'Delete worker cache success.',
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
