import React from 'react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-100 pt-12 pb-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                {/* Brand Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Ээлеп кал" className="w-10 h-10 rounded-xl shadow-sm" />
                        <span className="font-black text-brand-primary text-2xl tracking-tighter">Ээлеп кал</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">Бронирование столиков онлайн</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">по всему Кыргызстану</p>
                    </div>
                </div>

                {/* Service Column */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Сервис</h3>
                    <ul className="space-y-4">
                        {['Приложение', 'О нас', 'Услуги', 'Помощь'].map((link) => (
                            <li key={link}>
                                <a href="#" className="text-sm font-bold text-slate-600 hover:text-brand-primary transition-colors">
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Business Column */}
                <div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Для бизнеса</h3>
                    <ul className="space-y-4">
                        {['FAQ', 'Контакты'].map((link) => (
                            <li key={link}>
                                <a href="#" className="text-sm font-bold text-slate-600 hover:text-brand-primary transition-colors">
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* System Status / Support */}
                <div className="lg:text-right">
                    <div className="inline-block p-6 rounded-3xl bg-slate-50 border border-slate-100 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Техподдержка</p>
                        <p className="text-sm font-bold text-slate-900 mb-4">Есть вопросы?</p>
                        <button className="px-6 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-100 active:scale-95 transition-transform">
                            Связаться
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    © 2025 Ээлеп кал. Сделано с <span className="text-rose-500 mx-0.5">❤️</span> в Кыргызстане
                </p>
                <div className="flex gap-6">
                    <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary transition-colors">Политика</a>
                    <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary transition-colors">Оферта</a>
                </div>
            </div>
        </footer>
    );
};
