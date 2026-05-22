import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Search, Shield, Mail, Phone, MapPin, MoreVertical, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { superAdminService, AdminPersonal } from '../../../api/admin/superAdminService';
import { AddAdminModal } from './AddAdminModal';

// ─── Admin Action Menu ───
const AdminActionMenu: React.FC<{ admin: AdminPersonal; onDelete: (id: number) => void; isDeleting: boolean }> = ({
    admin, onDelete, isDeleting
}) => {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
                <MoreVertical size={18} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-10 z-40 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="p-1.5">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(false);
                                    if (confirm(`Удалить администратора ${admin.fullName}?`)) onDelete(admin.id);
                                }}
                                disabled={isDeleting}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
                            >
                                <Trash2 size={16} className="text-red-500" />
                                <span className="text-sm font-bold text-red-500">Удалить</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Admin Card ───
const AdminCard: React.FC<{ admin: AdminPersonal; onDelete: (id: number) => void; isDeleting: boolean }> = ({
    admin, onDelete, isDeleting
}) => {
    const initials = admin.fullName
        .split(' ')
        .map(n => n.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const colors = [
        'from-brand-700 to-brand-950',
        'from-violet-600 to-purple-900',
        'from-emerald-600 to-teal-900',
        'from-amber-500 to-orange-800',
        'from-rose-600 to-pink-900',
    ];
    const colorClass = colors[admin.id % colors.length];

    return (
        <div className="p-4 bg-white">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm`}>
                    {initials || <Shield size={22} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-black text-slate-900 text-base leading-tight truncate">{admin.fullName}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-100 uppercase tracking-widest">
                                    Администратор
                                </span>
                            </div>
                        </div>
                        <AdminActionMenu admin={admin} onDelete={onDelete} isDeleting={isDeleting} />
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                    <Mail size={13} className="flex-shrink-0 text-brand-500" />
                    <span className="text-xs font-semibold text-slate-600 truncate">{admin.email}</span>
                </div>
                {admin.phoneNumber && (
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                        <Phone size={13} className="flex-shrink-0 text-emerald-500" />
                        <span className="text-xs font-semibold text-slate-600">{admin.phoneNumber}</span>
                    </div>
                )}
                {admin.workAddress && (
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                        <MapPin size={13} className="flex-shrink-0 text-amber-500" />
                        <span className="text-xs font-semibold text-slate-600 line-clamp-1">{admin.workAddress}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Skeleton ───
const AdminSkeleton = () => (
    <div className="p-4 animate-pulse">
        <div className="flex gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
                <div className="h-3 bg-slate-50 rounded-lg w-1/4" />
            </div>
        </div>
        <div className="mt-3 space-y-2">
            <div className="h-9 bg-slate-50 rounded-xl" />
            <div className="h-9 bg-slate-50 rounded-xl" />
        </div>
    </div>
);

// ─── Main Page ───
export const SuperAdminAdminsPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

    const { data: admins = [], isLoading } = useQuery({
        queryKey: ['super-admin-admins'],
        queryFn: superAdminService.getAdmins,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => superAdminService.deleteAdmin(id),
        onSuccess: () => {
            toast.success('Администратор удалён');
            queryClient.invalidateQueries({ queryKey: ['super-admin-admins'] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Ошибка удаления'),
    });

    const filtered = admins.filter(a =>
        (a.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (a.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (a.workAddress?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Администраторы</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{admins.length} администраторов в системе</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 h-12 px-6 w-full md:w-auto bg-gradient-to-r from-brand-700 to-brand-900 hover:from-brand-600 hover:to-brand-800 text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-900/30 active:scale-95 transition-all border-2 border-brand-600"
                >
                    <UserPlus size={18} />
                    <span>Добавить администратора</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input
                        type="text"
                        placeholder="Поиск по имени, email или адресу..."
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Cards */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="divide-y divide-slate-50">
                        {Array.from({ length: 4 }).map((_, i) => <AdminSkeleton key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Shield size={48} className="text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">Администраторы не найдены</p>
                        {searchTerm && <p className="text-xs text-slate-300 mt-1">Попробуйте изменить запрос</p>}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        <AnimatePresence>
                            {filtered.map((admin) => (
                                <motion.div
                                    key={admin.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AdminCard
                                        admin={admin}
                                        onDelete={(id) => deleteMutation.mutate(id)}
                                        isDeleting={deleteMutation.isPending}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Add Admin Modal */}
            <AddAdminModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['super-admin-admins'] });
                }}
            />
        </div>
    );
};
