import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.SENDGRID_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'SendGrid API key is not set in environment' });
        }

        const startTime = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000); // 7 days ago in UNIX timestamp

        // Construct the query payload with valid parameters only
        let queryParams = {
            limit: 10,
            query: "event=delivered", // Example query for delivered emails
            start_time: startTime,
        };

        // Ensure that no invalid or unwanted parameters are sent
        const validQueryKeys = ['limit', 'query', 'start_time'];
        queryParams = Object.keys(queryParams)
            .filter(key => validQueryKeys.includes(key))
            .reduce((obj, key) => {
                obj[key] = queryParams[key];
                return obj;
            }, {});

        // Make the API request to SendGrid
        const response = await axios.get('https://api.sendgrid.com/v3/messages', {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            params: queryParams,
        });

        if (response.status === 200) {
            return res.status(200).json(response.data);
        } else {
            console.error('SendGrid API error:', response.status, response.data);
            return res.status(response.status).json({ message: 'Error fetching email events' });
        }
    } catch (error) {
        if (error.response) {
            // Log the error response details from SendGrid
            console.error('Error details:', error.response.data);
            return res.status(error.response.status).json({ error: error.response.data });
        } else {
            // Handle other errors (network, etc.)
            console.error('Error message:', error.message);
            return res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}
