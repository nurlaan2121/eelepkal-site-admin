import React from 'react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-6 px-8 border-t border-slate-100 bg-white text-slate-500 text-sm flex flex-col sm:flex-row items-center justify-between">
            <p>© {currentYear} Ээлеп кал. Все права защищены.</p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                <a href="#" className="hover:text-brand-primary transition-colors">Поддержка</a>
                <a href="#" className="hover:text-brand-primary transition-colors">Политика конфиденциальности</a>
                <span className="text-slate-300">v1.0.0</span>
            </div>
        </footer>
    );
};
