/**
 * useSEO Hook
 * React hook for managing page SEO
 * Usage: useSEO({ title: 'Page Title', description: 'Description' })
 */

import { useEffect } from 'react';
import { updateSEO, SEOConfig } from '../utils/seo';

export const useSEO = (config: SEOConfig) => {
    useEffect(() => {
        updateSEO(config);
    }, [config]);
};
