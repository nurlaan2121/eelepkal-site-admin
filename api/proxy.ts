import axios from 'axios';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = 'https://eelepkal.com';

// Disable body parsing for this route to handle multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

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

        // For file uploads, we need to pipe the raw request
        if (isMultipart && req.method === 'POST') {
            return await handleMultipartUpload(req, res, targetUrl, safeHeaders, contentType);
        }

        // Regular JSON requests
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

// Handle multipart/form-data file uploads
async function handleMultipartUpload(
    req: VercelRequest,
    res: VercelResponse,
    targetUrl: string,
    safeHeaders: Record<string, string>,
    contentType: string
) {
    return new Promise<void>((resolve, reject) => {
        const chunks: Buffer[] = [];

        // Collect raw body chunks
        req.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });

        req.on('end', async () => {
            try {
                const rawBody = Buffer.concat(chunks);
                
                console.log(`File upload to ${targetUrl}, size: ${rawBody.length} bytes`);

                // Forward to backend with exact content-type (including boundary)
                const response = await axios.post(targetUrl, rawBody, {
                    headers: {
                        ...safeHeaders,
                        'host': 'eelepkal.com',
                        'content-type': contentType,
                        'Content-Length': rawBody.length.toString(),
                    },
                    responseType: 'json',
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                });

                console.log('Upload successful:', response.data);
                res.status(response.status).json(response.data);
                resolve();
            } catch (error: any) {
                console.error('File upload proxy error:', error.message);
                console.error('Error response:', error.response?.data);
                const status = error.response?.status || 500;
                const data = error.response?.data || { message: 'Upload failed' };
                res.status(status).json(data);
                resolve();
            }
        });

        req.on('error', (error) => {
            console.error('Request error:', error);
            res.status(500).json({ message: 'Request failed' });
            resolve();
        });
    });
}
