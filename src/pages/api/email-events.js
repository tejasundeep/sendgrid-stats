import { Client } from '@sendgrid/client';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const sgClient = new Client();
    sgClient.setApiKey(process.env.SENDGRID_API_KEY);

    try {
        // Send request to the Email Activity API endpoint
        const [response, body] = await sgClient.request({
            method: 'GET',
            url: '/v3/messages', // The correct endpoint for pulling messages and events
            qs: {
                limit: 100,  // Adjust the limit as needed
                query: 'event IN ("delivered", "open", "click", "bounce")' // Filter for specific event types
            }
        });

        if (response.statusCode === 200) {
            res.status(200).json(body);
        } else {
            console.error('SendGrid API error:', response.statusCode, response.body);
            res.status(response.statusCode).json({ message: response.body });
        }
    } catch (error) {
        console.error('Error fetching email events:', error.message);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
}
