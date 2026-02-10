const https = require('https');

exports.handler = async (event, context) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    const keyword = event.queryStringParameters.keyword;

    if (!keyword) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Keyword is required' }),
        };
    }

    // API Key check
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
        console.error('Critical Error: CLAUDE_API_KEY is missing.');
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Configuration Error: CLAUDE_API_KEY is not set in Netlify.'
            }),
        };
    }

    const requestBody = JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        temperature: 0.7,
        system: `あなたは夢占いの専門家です。簡潔に JSON で答えてください。
    {
      "meaning": "夢の意味（500文字程度で詳しく）",
      "fortune": 3,
      "advice": "アドバイス（100文字程度）",
      "category": "AI診断"
    }`,
        messages: [
            {
                "role": "user",
                "content": `キーワード: ${keyword}`
            }
        ]
    });

    const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(requestBody)
        },
        timeout: 9000 // 9s timeout
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const chunks = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', async () => {
                const data = Buffer.concat(chunks).toString();
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsedData = JSON.parse(data);
                        const content = parsedData.content[0].text;
                        const jsonStr = content.replace(/```json\n|\n```/g, '').trim();
                        const result = JSON.parse(jsonStr);

                        // Log to Supabase (Fire and forget, or await if critical)
                        // We await to ensure it sends before function freezes, but catch errors to not break user flow
                        if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
                            await logToSupabase(keyword, result).catch(err => console.error("Supabase Log Error:", err));
                        }

                        resolve({
                            statusCode: 200,
                            headers,
                            body: JSON.stringify(result)
                        });
                    } catch (e) {
                        console.error('JSON Parse Error:', e);
                        resolve({
                            statusCode: 500,
                            headers,
                            body: JSON.stringify({ error: 'JSON Parse Error', details: e.message, raw: data })
                        });
                    }
                } else {
                    console.error(`API Error: ${res.statusCode}`, data);
                    resolve({
                        statusCode: res.statusCode,
                        headers,
                        body: JSON.stringify({ error: `API Error: ${res.statusCode}`, details: data })
                    });
                }
            });
        });

        req.on('error', (error) => {
            console.error('Network Error:', error);
            console.error('Network Error:', error);
            resolve({
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Network Error', details: error.message })
            });
        });

        req.on('timeout', () => {
            req.destroy();
            console.error('Request Timeout');
            console.error('Request Timeout');
            resolve({
                statusCode: 504,
                headers,
                body: JSON.stringify({ error: 'Request Timeout', details: 'Claude API took too long to respond.' })
            });
        });

        req.write(requestBody);
        req.end();
    });
};

async function logToSupabase(query, result) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) return;

    const url = new URL(`${supabaseUrl}/rest/v1/dream_logs`);
    const data = JSON.stringify({
        query: query,
        result: result
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal' // Don't need the inserted row back
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve();
            } else {
                // Consume response data to free memory
                res.resume();
                reject(new Error(`Supabase Status: ${res.statusCode}`));
            }
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}
