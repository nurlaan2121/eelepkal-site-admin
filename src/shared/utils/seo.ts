/**
 * SEO Utilities for dynamic meta tag management
 * Handles page-specific titles, descriptions, and meta tags
 */

export interface SEOConfig {
    title: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    ogType?: string;
    ogImage?: string;
    noindex?: boolean;
}

const DEFAULT_TITLE = 'Ээлеп кал — Система онлайн бронирования ресторанов и кафе в Кыргызстане';
const DEFAULT_DESCRIPTION = 'Управляйте бронированиями, столами и меню ресторана онлайн. Система бронирования для заведений Кыргызстана.';
const BASE_URL = 'https://admin.eelepkal.kg';

/**
 * Update page meta tags dynamically
 */
export const updateSEO = (config: SEOConfig): void => {
    const {
        title,
        description = DEFAULT_DESCRIPTION,
        keywords,
        canonical,
        ogType = 'website',
        ogImage = '/logo.png',
        noindex = false,
    } = config;

    // Update title
    document.title = title;

    // Update meta description
    updateMetaTag('name', 'description', description);
    
    // Update keywords if provided
    if (keywords) {
        updateMetaTag('name', 'keywords', keywords);
    }

    // Update canonical URL
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : window.location.href;
    updateCanonical(canonicalUrl);

    // Update robots meta for noindex pages
    if (noindex) {
        updateMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
        updateMetaTag('name', 'robots', 'index, follow');
    }

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:locale', 'ru_RU');

    // Update Twitter tags
    updateMetaTag('property', 'twitter:title', title);
    updateMetaTag('property', 'twitter:description', description);
    updateMetaTag('property', 'twitter:url', canonicalUrl);
    updateMetaTag('property', 'twitter:image', ogImage);
};

/**
 * Helper to update or create meta tag
 */
function updateMetaTag(attrName: string, attrValue: string, content: string): void {
    let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
}

/**
 * Update canonical link
 */
function updateCanonical(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    
    link.href = url;
}

/**
 * Pre-configured SEO for common pages
 */
export const PAGE_SEO = {
    login: {
        title: 'Вход в систему | Ээлеп кал — онлайн бронирование заведений',
        description: 'Войдите в систему Ээлеп кал для управления заведением, бронированиями и онлайн-заявками.',
        keywords: 'вход в систему, авторизация, Ээлеп кал, бронирование ресторанов',
        canonical: '/auth/login',
    } as SEOConfig,
    
    register: {
        title: 'Регистрация заведения | Ээлеп кал — подключите ресторан к онлайн-бронированию',
        description: 'Подключите своё заведение к онлайн-бронированию в Кыргызстане. Управляйте столами, бронированиями и меню.',
        keywords: 'регистрация ресторана, подключить заведение, онлайн бронирование, Кыргызстан',
        canonical: '/auth/register',
    } as SEOConfig,
    
    adminDashboard: {
        title: 'Панель управления | Ээлеп кал',
        description: 'Управление бронированиями и столами ресторана',
        noindex: true,
    } as SEOConfig,
    
    superAdminDashboard: {
        title: 'Панель супер-администратора | Ээлеп кал',
        description: 'Управление всеми заведениями системы Ээлеп кал',
        noindex: true,
    } as SEOConfig,
};
