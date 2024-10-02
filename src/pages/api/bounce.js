import { Client } from '@sendgrid/client';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const sgClient = new Client();
    sgClient.setApiKey(process.env.SENDGRID_API_KEY);

    try {
        const limit = 500;
        const offsets = [0, 500, 1000];
        let combinedData = [];

        for (const offset of offsets) {
            const [response, body] = await sgClient.request({
                method: 'GET',
                url: '/v3/suppression/bounces',
                qs: {
                    limit: limit,
                    offset: offset,
                },
            });

            if (response.statusCode === 200) {
                combinedData = combinedData.concat(body);
            } else {
                return res.status(response.statusCode).json({ message: response.body });
            }
        }

        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
