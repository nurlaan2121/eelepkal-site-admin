import axios from 'axios';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'https://eelepkal.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { path } = req.query;

    if (!path || typeof path !== 'string') {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    const targetUrl = `${BACKEND_URL}/${path}`;

    try {
        // Filter out headers that could trigger CORS or cause issues
        const safeHeaders = { ...req.headers };
        delete safeHeaders.origin;
        delete safeHeaders.referer;
        delete safeHeaders.host;
        delete safeHeaders.connection;

        // Ensure Authorization header is passed even if lowercase/uppercase issues occur
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader) {
            safeHeaders['authorization'] = authHeader;
        }

        const config = {
            method: req.method,
            url: targetUrl,
            headers: {
                ...safeHeaders,
                host: 'eelepkal.com',
            },
            data: req.body,
            params: { ...req.query },
        };

        // Remove path from params to avoid sending it to backend
        delete config.params.path;

        const response = await axios(config);

        // Forward headers from backend
        Object.entries(response.headers).forEach(([key, value]) => {
            if (value) res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error('Proxy error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
