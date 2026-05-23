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
        const safeHeaders: Record<string, string> = { ...req.headers } as any;
        delete safeHeaders.origin;
        delete safeHeaders.referer;
        delete safeHeaders.host;
        delete safeHeaders.connection;

        // Ensure Authorization header is passed even if lowercase/uppercase issues occur
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader) {
            safeHeaders['authorization'] = authHeader;
        }

        // Check if this is a multipart/form-data request (file upload)
        const contentType = req.headers['content-type'] || '';
        const isMultipart = contentType.includes('multipart/form-data');

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

        // For multipart uploads, preserve the original content-type with boundary
        if (isMultipart) {
            config.headers['content-type'] = contentType;
            // Don't parse the body, send it as-is
            config.data = req.body;
        }

        // Remove path from params to avoid sending it to backend
        delete config.params.path;

        const response = await axios(config);

        // Forward headers from backend
        Object.entries(response.headers).forEach(([key, value]) => {
            if (value) res.setHeader(key, value);
        });

        return res.status(response.status).json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const data = error.response?.data || {};

        console.error(`Proxy Error [${req.method}] ${path}:`, {
            status,
            message: error.message,
            data
        });

        return res.status(status).json({
            ...data,
            proxyError: true,
            originalStatus: status,
            targetPath: path
        });
    }
}
