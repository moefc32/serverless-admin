import { env } from 'cloudflare:workers';

const TARGET_WORKERS =
    typeof env.TARGET_WORKERS === 'string'
        ? JSON.parse(env.TARGET_WORKERS)
        : env.TARGET_WORKERS;

const query = `query GetSpecificStats($accountTag: String!, $workers: [String!], $date: String!, $limit: Int!) {
    viewer {
        accounts(filter: {accountTag: $accountTag}) {
            workersInvocationsAdaptive(
                limit: $limit,
                filter: { 
                    scriptName_in: $workers, 
                    datetime_geq: $date 
                }
            ) {
                dimensions { scriptName }
                sum { requests, errors }
                quantiles { cpuTimeP90 }
            }
        }
    }
}`;

export async function GET() {
    try {
        const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.WORKERS_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    accountTag: env.WORKERS_ACCOUNT_ID,
                    workers: TARGET_WORKERS,
                    date: new Date(Date.now() - 60 * 60 * 24 * 1000).toISOString(),
                    limit: TARGET_WORKERS.length || 1,
                },
            }),
        });

        if (!response.ok)
            throw new Error(`API error: ${response.statusText}`);

        const { data } = await response.json();
        const datasets =
            data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive || [];

        const workers = TARGET_WORKERS.map((name) => {
            const data = datasets.find((d) => d.dimensions.scriptName === name);
            if (!data) return { name, successRate: '0', cpu: 0, inactive: true };

            const rawRate =
                ((data.sum.requests - data.sum.errors) / (data.sum.requests || 1)) *
                100;

            const formattedRate =
                rawRate === 100 || rawRate === 0
                    ? rawRate.toString()
                    : rawRate.toFixed(2);

            return {
                name,
                successRate: formattedRate,
                cpu: Number(((data.quantiles.cpuTimeP90 || 0) / 1000).toFixed(3)),
                inactive: false,
            };
        });

        return new Response(JSON.stringify({
            message: 'Get data success.',
            data: {
                totalWorkers: TARGET_WORKERS.length,
                workers,
            },
        }), {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
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
