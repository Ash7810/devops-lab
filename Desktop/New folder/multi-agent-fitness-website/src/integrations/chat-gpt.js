// This file integrates with the ChatGPT API for conversational capabilities.

const axios = require('axios');

const CHAT_GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

async function getChatGPTResponse(prompt) {
    try {
        const response = await axios.post(CHAT_GPT_API_URL, {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        throw error;
    }
}

module.exports = {
    getChatGPTResponse,
};