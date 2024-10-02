import { Client } from '@sendgrid/client';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const sgClient = new Client();
    sgClient.setApiKey(process.env.SENDGRID_API_KEY);

    try {
        const [response, body] = await sgClient.request({
            method: 'GET',
            url: '/v3/suppression/bounces',
            qs: {
                limit: 100,
            },
        });

        if (response.statusCode === 200) {
            res.status(200).json(body);
        } else {
            res.status(response.statusCode).json({ message: response.body });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
