const https = require('https');

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
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
        max_tokens: 1000,
        temperature: 0.7,
        system: `あなたは夢占いの専門家です。簡潔に JSON で答えてください。
    {
      "meaning": "夢の意味（100文字以内）",
      "fortune": 3,
      "advice": "アドバイス（50文字以内）",
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
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsedData = JSON.parse(data);
                        const content = parsedData.content[0].text;
                        const jsonStr = content.replace(/```json\n|\n```/g, '').trim();
                        const result = JSON.parse(jsonStr);

                        resolve({
                            statusCode: 200,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(result)
                        });
                    } catch (e) {
                        console.error('JSON Parse Error:', e);
                        resolve({
                            statusCode: 500,
                            body: JSON.stringify({ error: 'JSON Parse Error', details: e.message, raw: data })
                        });
                    }
                } else {
                    console.error(`API Error: ${res.statusCode}`, data);
                    resolve({
                        statusCode: res.statusCode,
                        body: JSON.stringify({ error: `API Error: ${res.statusCode}`, details: data })
                    });
                }
            });
        });

        req.on('error', (e) => {
            console.error('Network Error:', e);
            resolve({
                statusCode: 500,
                body: JSON.stringify({ error: 'Network Error', details: e.message })
            });
        });

        req.on('timeout', () => {
            req.destroy();
            console.error('Request Timeout');
            resolve({
                statusCode: 504,
                body: JSON.stringify({ error: 'Request Timeout', details: 'Claude API took too long to respond.' })
            });
        });

        req.write(requestBody);
        req.end();
    });
};
