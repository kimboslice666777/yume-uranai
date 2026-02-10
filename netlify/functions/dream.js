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

    // Logging for debugging
    console.log('Function invoked with keyword:', keyword);

    // API Key check
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
        console.error('Critical Error: CLAUDE_API_KEY is missing in environment variables.');
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Configuration Error: CLAUDE_API_KEY is not set in Netlify.',
                details: 'Please check Site Configuration > Environment variables.'
            }),
        };
    }

    try {
        console.log('Initializing Anthropic client...');
        const anthropic = new Anthropic({
            apiKey: apiKey,
        });

        console.log('Sending request to Claude API...');
        const completion = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 300,
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

        console.log('Claude API response received.');
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
        console.error('Detailed Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'AI Processing Error',
                message: error.message,
                stack: error.stack
            }),
        };
    }
};
