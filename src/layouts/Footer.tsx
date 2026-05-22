import React from 'react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = [
        { label: 'Приложение', href: 'https://site.eelepkal.com/' },
        { label: 'О нас', href: 'https://site.eelepkal.com/#about' },
        { label: 'Услуги', href: 'https://site.eelepkal.com/services-2/' },
        { label: 'Помощь', href: 'https://site.eelepkal.com/contacts/' },
        { label: 'FAQ', href: 'https://site.eelepkal.com/faq/' },
        { label: 'Контакты', href: 'https://site.eelepkal.com/contacts/' },
    ];

    return (
        <footer className="bg-brand-950 text-white pt-16 pb-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Ээлеп кал" className="w-12 h-12 rounded-2xl shadow-xl shadow-black/20" />
                        <span className="font-black text-white text-2xl tracking-tighter">Ээлеп кал</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-black text-white/90 uppercase tracking-tight leading-tight">Бронирование столиков онлайн</p>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">по всему Кыргызстану</p>
                    </div>
                </div>

                {/* Service Column */}
                <div>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-8">Сервис</h3>
                    <ul className="grid grid-cols-1 gap-y-4">
                        {links.slice(0, 4).map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-white/70 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Business Column */}
                <div>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-8">Для бизнеса</h3>
                    <ul className="grid grid-cols-1 gap-y-4">
                        {links.slice(4).map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-white/70 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a
                                href="https://site.eelepkal.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-white/70 hover:text-white transition-colors"
                            >
                                Для заведений
                            </a>
                        </li>
                    </ul>
                </div>

                {/* System Status / Support */}
                <div className="lg:text-right">
                    <div className="inline-block p-6 rounded-[2rem] bg-white/5 border border-white/10 text-left backdrop-blur-sm">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Поддержка</p>
                        <p className="text-sm font-black text-white mb-5">Нужна помощь?</p>
                        <a
                            href="https://site.eelepkal.com/contacts/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-lg shadow-black/20"
                        >
                            Связаться
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    © 2025 Ээлеп кал. Сделано с <span className="text-rose-500 mx-1">❤️</span> в Кыргызстане
                </p>
                <div className="flex gap-8">
                    <a href="https://site.eelepkal.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-white transition-colors">Политика</a>
                    <a href="https://site.eelepkal.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-white transition-colors">Оферта</a>
                </div>
            </div>
        </footer>
    );
};
