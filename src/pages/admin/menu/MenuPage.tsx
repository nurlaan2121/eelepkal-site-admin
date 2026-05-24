import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, ArrowUpDown, Edit2, Trash2, Utensils, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminMenuService, MenuItem, MenuCategory, MenuStatus } from '../../../api/admin/adminMenuService';
import { Button } from '../../../components/ui/Button';
import { AddMenuModal } from './AddMenuModal';
import { EditMenuModal } from './EditMenuModal';
import { toast } from 'sonner';

// ─────────── Skeleton Loader ───────────
const MenuCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
        <div className="flex gap-4">
            <div className="w-24 h-24 rounded-xl bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-6 bg-slate-200 rounded w-1/4 mt-4" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            </div>
        </div>
    </div>
);

// ─────────── Empty State ───────────
const EmptyState: React.FC<{ status: MenuStatus }> = ({ status }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Utensils size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-2">
            {status === 'ACTIVE' ? 'В этой категории пока нет активных блюд' : 'В этой категории пока нет резервных блюд'}
        </h3>
        <p className="text-sm text-slate-400 font-medium max-w-xs">
            {status === 'ACTIVE' 
                ? 'Добавьте новые блюда или переместите их из резервных'
                : 'Переместите сюда блюда из активного меню'}
        </p>
    </div>
);

// ─────────── Menu Card ───────────
const MenuCard: React.FC<{
    item: MenuItem;
    onMove: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    isMoving: boolean;
    isDeleting: boolean;
}> = ({ item, onMove, onEdit, onDelete, isMoving, isDeleting }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0 ring-2 ring-white shadow-sm">
                    {item.imageUrl ? (
                        <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Utensils size={24} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <h3 className="font-black text-slate-900 text-base line-clamp-1 mb-1">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    <p className="text-xl font-black text-brand-primary">
                        {item.price} <span className="text-xs font-bold text-slate-400">с</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onMove(item.id)}
                        disabled={isMoving}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors disabled:opacity-50"
                        title="Переместить"
                    >
                        {isMoving ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ArrowUpDown size={16} />
                        )}
                    </button>
                    <button
                        onClick={() => onEdit(item.id)}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Редактировать"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        disabled={isDeleting}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Удалить"
                    >
                        {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ─────────── Main Page ───────────
export const AdminMenuPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<MenuStatus>('ACTIVE');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
    const pageSize = 10;

    // Fetch categories
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['menu-categories'],
        queryFn: adminMenuService.getCategories,
    });

    // Auto-select first category
    useEffect(() => {
        if (categories && categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories, selectedCategory]);

    // Fetch menu items
    const { data: menuData, isLoading: menuLoading } = useQuery({
        queryKey: ['menu-items', selectedCategory, activeTab, page],
        queryFn: () => adminMenuService.getAllMenus({
            categoryId: selectedCategory!,
            status: activeTab,
            page,
            pageSize,
        }),
        enabled: !!selectedCategory,
    });

    // Mutations
    const moveMutation = useMutation({
        mutationFn: ({ menuId, newStatus }: { menuId: number; newStatus: MenuStatus }) =>
            adminMenuService.updateMenuStatus(menuId, newStatus),
        onSuccess: (_, { newStatus }) => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
            queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
            const statusLabel = newStatus === 'ACTIVE' ? 'активное' : 'резервное';
            toast.success(`Блюдо перемещено в ${statusLabel} меню`);
        },
        onError: (error: any) => {
            console.error('Move error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка перемещения';
            toast.error(errorMessage);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (menuId: number) => adminMenuService.deleteMenu(menuId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
            queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
            toast.success('Блюдо удалено');
        },
        onError: (error: any) => {
            console.error('Delete error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка удаления';
            toast.error(errorMessage);
        },
    });

    const handleMove = (menuId: number) => {
        const currentStatus = activeTab;
        const newStatus = activeTab === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        
        const currentLabel = currentStatus === 'ACTIVE' ? 'активного' : 'резервного';
        const newLabel = newStatus === 'ACTIVE' ? 'активное' : 'резервное';
        
        const confirmed = window.confirm(
            `Вы уверены, что хотите переместить блюдо из ${currentLabel} меню в ${newLabel}?`
        );
        
        if (confirmed) {
            moveMutation.mutate({ menuId, newStatus });
        }
    };

    const handleDelete = (menuId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
            deleteMutation.mutate(menuId);
        }
    };

    const handleEdit = (menuId: number) => {
        setEditingMenuId(menuId);
        setIsEditModalOpen(true);
    };

    const handleAddMenu = () => {
        setIsAddModalOpen(true);
    };

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategory(categoryId);
        setPage(1);
    };

    const handleTabChange = (tab: MenuStatus) => {
        setActiveTab(tab);
        setPage(1);
    };

    const menuItems = menuData?.getMenuResponse || [];
    const totalMenus = menuData?.totalMenus || 0;
    const totalPages = Math.ceil(totalMenus / pageSize);

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Меню</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Управление блюдами и стоп-листами</p>
                </div>
                <Button 
                    onClick={handleAddMenu}
                    className="flex items-center justify-center gap-2 h-12 md:h-11 px-6 w-full md:w-auto shadow-lg shadow-brand-100 font-bold uppercase tracking-widest text-xs"
                >
                    <Plus size={20} />
                    <span>Добавить блюдо</span>
                </Button>
            </div>

            {/* Status Tabs */}
            <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm">
                <div className="grid grid-cols-2 gap-1">
                    <button
                        onClick={() => handleTabChange('ACTIVE')}
                        className={`py-3 px-4 rounded-xl text-sm font-black transition-all ${
                            activeTab === 'ACTIVE'
                                ? 'bg-brand-primary text-white shadow-md'
                                : 'bg-transparent text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        Активное
                    </button>
                    <button
                        onClick={() => handleTabChange('INACTIVE')}
                        className={`py-3 px-4 rounded-xl text-sm font-black transition-all ${
                            activeTab === 'INACTIVE'
                                ? 'bg-brand-primary text-white shadow-md'
                                : 'bg-transparent text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        Резервное
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            {categoriesLoading ? (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="px-5 py-3 rounded-2xl bg-slate-200 animate-pulse min-w-[120px]" />
                    ))}
                </div>
            ) : (
                categories && categories.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                                    selectedCategory === category.id
                                        ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-brand-200 hover:bg-brand-50'
                                }`}
                            >
                                {category.name} {category.count !== undefined && `(${category.count})`}
                            </button>
                        ))}
                    </div>
                )
            )}

            {/* Menu Items Grid */}
            {menuLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <MenuCardSkeleton key={i} />
                    ))}
                </div>
            ) : menuItems.length === 0 ? (
                <EmptyState status={activeTab} />
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {menuItems.map((item) => (
                                <MenuCard
                                    key={item.id}
                                    item={item}
                                    onMove={handleMove}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    isMoving={moveMutation.variables?.menuId === item.id && moveMutation.isPending}
                                    isDeleting={deleteMutation.variables === item.id && deleteMutation.isPending}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                Назад
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                                            page === i + 1
                                                ? 'bg-brand-primary text-white shadow-md'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                Вперед
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Add Menu Modal */}
            <AddMenuModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                defaultStatus={activeTab}
            />

            {/* Edit Menu Modal */}
            <EditMenuModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingMenuId(null);
                }}
                menuId={editingMenuId}
                menuStatus={activeTab}
            />
        </div>
    );
};
