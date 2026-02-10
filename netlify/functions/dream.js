const { Anthropic } = require('@anthropic-ai/sdk');

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
        console.error('CLAUDE_API_KEY is not set');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error' }),
        };
    }

    try {
        const anthropic = new Anthropic({
            apiKey: apiKey,
        });

        const completion = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1000,
            temperature: 0.7,
            system: `あなたは夢占いの専門家です。ユーザーから提供された夢のキーワードや状況に基づいて、その夢の意味、運勢（1〜5の星評価）、そしてアドバイスを提供してください。
      
      レスポンスは必ず以下のJSON形式で返してください。余計な説明は不要です。
      
      {
        "meaning": "夢の意味を200文字以内で、神秘的かつ分かりやすく。",
        "fortune": 3, // 1〜5の整数
        "advice": "具体的なアドバイスを100文字以内で。",
        "category": "AI診断"
      }`,
            messages: [
                {
                    "role": "user",
                    "content": `夢のキーワード: ${keyword}`
                }
            ]
        });

        const content = completion.content[0].text;

        // Parse JSON from Claude's response to ensure it's valid
        // Note: Claude typically returns pure JSON as requested, but sometimes adds markdown blocks
        const jsonStr = content.replace(/```json\n|\n```/g, '').trim();
        const result = JSON.parse(jsonStr);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        };

    } catch (error) {
        console.error('Error calling Claude API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to interpret dream' }),
        };
    }
};
