import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './app/App';
import './index.css';

// Prevent browser translation
const preventTranslation = () => {
    // Add notranslate class to all elements
    document.body.classList.add('notranslate');
    
    // Set google translate meta
    const meta = document.createElement('meta');
    meta.name = 'google';
    meta.content = 'notranslate';
    document.head.appendChild(meta);
    
    // Add translate="no" to root element
    const root = document.getElementById('root');
    if (root) {
        root.setAttribute('translate', 'no');
        root.classList.add('notranslate');
    }
};

preventTranslation();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});




ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
