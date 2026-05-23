import React from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {
    Plus, Search, Store, MapPin, MoreVertical, User,
    UserCog, Settings2, CreditCard, Trash2, X, ChevronDown,
    Star, Wallet, Check
} from 'lucide-react';
import { superAdminVenueService } from '../../api/venue/superAdminVenueService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { VenueListItem, VenueCondition, PaymentDetail } from '../../types/venue';

// ─────────── Replace Admin Modal ───────────
const ReplaceAdminModal: React.FC<{ venue: VenueListItem; onClose: () => void }> = ({ venue, onClose }) => {
    const queryClient = useQueryClient();
    const [selectedAdminId, setSelectedAdminId] = React.useState<number | null>(null);

    const { data: admins = [], isLoading } = useQuery({
        queryKey: ['admins-for-replace'],
        queryFn: superAdminVenueService.getAdminsForReplace,
    });

    const mutation = useMutation({
        mutationFn: (newAdminId: number) => superAdminVenueService.replaceAdmin(venue.venueId, newAdminId),
        onSuccess: () => {
            toast.success('Администратор успешно заменён!');
            queryClient.invalidateQueries({ queryKey: ['super-admin-venues'] });
            onClose();
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Ошибка при замене'),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[85vh] flex flex-col shadow-2xl"
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Заменить администратора</h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 truncate max-w-[220px]">{venue.name}</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                        ))
                    ) : admins.length === 0 ? (
                        <div className="text-center text-slate-400 py-8 text-sm font-medium">Доступных администраторов нет</div>
                    ) : (
                        admins.map((admin) => (
                            <button
                                key={admin.adminId}
                                onClick={() => setSelectedAdminId(admin.adminId)}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${selectedAdminId === admin.adminId
                                    ? 'border-brand-primary bg-brand-50'
                                    : 'border-slate-100 hover:border-slate-200 bg-white'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-black text-sm flex-shrink-0">
                                    {admin.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-slate-900 text-sm truncate">{admin.fullName}</p>
                                    <p className="text-xs text-slate-400 truncate">{admin.email}</p>
                                </div>
                                {selectedAdminId === admin.adminId && (
                                    <div className="ml-auto w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="p-5 border-t border-slate-100">
                    <Button
                        onClick={() => selectedAdminId && mutation.mutate(selectedAdminId)}
                        disabled={!selectedAdminId || mutation.isPending}
                        className="w-full h-12 font-black text-sm"
                    >
                        {mutation.isPending ? 'Сохранение...' : 'Назначить администратора'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

// ─────────── Booking Conditions Modal ───────────
const ConditionsModal: React.FC<{ venue: VenueListItem; onClose: () => void }> = ({ venue, onClose }) => {
    const [form, setForm] = React.useState<VenueCondition>({
        venueId: venue.venueId,
        deposit: 0,
        cancelAllowed: true,
        cancellationDeadline: '03:00',
        editAllowed: true,
        editingDeadline: '05:00',
    });

    const mutation = useMutation({
        mutationFn: () => superAdminVenueService.updateVenueCondition(form),
        onSuccess: () => {
            toast.success('Условия бронирования обновлены!');
            onClose();
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Ошибка сохранения'),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[90vh] flex flex-col shadow-2xl"
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Условия бронирования</h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 truncate max-w-[220px]">{venue.name}</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Deposit */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Wallet size={16} className="text-brand-600" />
                            <p className="font-black text-slate-800 text-sm uppercase tracking-widest">Депозит</p>
                        </div>
                        <div className="flex gap-2">
                            {[0, 500, 1000, 2000].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setForm(f => ({ ...f, deposit: amt }))}
                                    className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${form.deposit === amt
                                        ? 'bg-brand-primary text-white border-brand-primary'
                                        : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                >
                                    {amt === 0 ? 'Без депозита' : `${amt} сом`}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={form.deposit}
                            onChange={(e) => setForm(f => ({ ...f, deposit: Number(e.target.value) }))}
                            className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                            placeholder="Или введите сумму"
                        />
                    </div>

                    {/* Cancellation */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="font-black text-slate-800 text-sm uppercase tracking-widest">Отмена бронирования</p>
                            </div>
                            <button
                                onClick={() => setForm(f => ({ ...f, cancelAllowed: !f.cancelAllowed, cancellationDeadline: f.cancelAllowed ? '00:00' : '03:00' }))}
                                className={`relative w-12 h-6 rounded-full transition-colors ${form.cancelAllowed ? 'bg-brand-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.cancelAllowed ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        {form.cancelAllowed && (
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-2">За сколько часов до визита</p>
                                <input
                                    type="time"
                                    value={form.cancellationDeadline}
                                    onChange={(e) => setForm(f => ({ ...f, cancellationDeadline: e.target.value }))}
                                    className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                                />
                            </div>
                        )}
                        {!form.cancelAllowed && <p className="text-xs text-slate-400 font-medium">Отмена не допускается (00:00)</p>}
                    </div>

                    {/* Editing */}
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="font-black text-slate-800 text-sm uppercase tracking-widest">Изменение бронирования</p>
                            <button
                                onClick={() => setForm(f => ({ ...f, editAllowed: !f.editAllowed, editingDeadline: f.editAllowed ? '00:00' : '05:00' }))}
                                className={`relative w-12 h-6 rounded-full transition-colors ${form.editAllowed ? 'bg-brand-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.editAllowed ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        {form.editAllowed && (
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-2">За сколько часов до визита</p>
                                <input
                                    type="time"
                                    value={form.editingDeadline}
                                    onChange={(e) => setForm(f => ({ ...f, editingDeadline: e.target.value }))}
                                    className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
                                />
                            </div>
                        )}
                        {!form.editAllowed && <p className="text-xs text-slate-400 font-medium">Изменение не допускается (00:00)</p>}
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100">
                    <Button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className="w-full h-12 font-black text-sm"
                    >
                        {mutation.isPending ? 'Сохранение...' : 'Сохранить условия'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

// ─────────── Payment Details Modal ───────────
const PaymentModal: React.FC<{ venue: VenueListItem; onClose: () => void }> = ({ venue, onClose }) => {
    const queryClient = useQueryClient();
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [editingPayment, setEditingPayment] = React.useState<PaymentDetail | null>(null);
    const [formData, setFormData] = React.useState({
        venueTitle: venue.name,
        taxIdentificationNumber: '',
        bankAccountNumber: '',
        bankName: '',
        qrCodeUrl: '',
    });
    const [qrPreview, setQrPreview] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payment-details', venue.venueId],
        queryFn: () => superAdminVenueService.getPaymentDetails(venue.venueId),
    });

    const addMutation = useMutation({
        mutationFn: () => superAdminVenueService.addPaymentDetail(venue.venueId, formData),
        onSuccess: () => {
            toast.success('Реквизиты успешно добавлены!');
            queryClient.invalidateQueries({ queryKey: ['payment-details', venue.venueId] });
            handleClose();
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Ошибка сохранения'),
    });

    const updateMutation = useMutation({
        mutationFn: (paymentId: number) => superAdminVenueService.updatePaymentDetail(paymentId, formData),
        onSuccess: () => {
            toast.success('Реквизиты успешно обновлены!');
            queryClient.invalidateQueries({ queryKey: ['payment-details', venue.venueId] });
            handleClose();
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Ошибка обновления'),
    });

    const deleteMutation = useMutation({
        mutationFn: (paymentId: number) => superAdminVenueService.deletePaymentDetail(paymentId),
        onSuccess: () => {
            toast.success('Реквизиты удалены');
            queryClient.invalidateQueries({ queryKey: ['payment-details', venue.venueId] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Ошибка удаления'),
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Пожалуйста, выберите изображение');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Размер файла не должен превышать 5MB');
            return;
        }

        // Create preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setQrPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to S3 immediately
        setIsUploading(true);
        try {
            toast.info('Загрузка QR кода...');
            const qrUrl = await superAdminVenueService.uploadFileToS3(file);
            console.log('QR code uploaded:', qrUrl);

            // Update formData with the uploaded URL
            setFormData(prev => ({ ...prev, qrCodeUrl: qrUrl }));

            toast.success('QR код загружен');
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка загрузки файла';
            toast.error(errorMessage);
            // Clear preview if upload fails
            setQrPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadAndSubmit = async () => {
        if (!formData.bankName || !formData.bankAccountNumber || !formData.taxIdentificationNumber) {
            toast.error('Заполните все обязательные поля');
            return;
        }

        // Check if file is still uploading
        if (isUploading) {
            toast.info('Дождитесь загрузки QR кода');
            return;
        }

        try {
            if (editingPayment) {
                // Update existing payment
                await updateMutation.mutateAsync(editingPayment.id);
            } else {
                // Add new payment
                await superAdminVenueService.addPaymentDetail(venue.venueId, formData);
                toast.success('Реквизиты успешно добавлены!');
                queryClient.invalidateQueries({ queryKey: ['payment-details', venue.venueId] });
            }
            handleClose();
        } catch (error: any) {
            console.error('Submit error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка сохранения';
            toast.error(errorMessage);
        }
    };

    const handleEditPayment = (payment: PaymentDetail) => {
        setEditingPayment(payment);
        setFormData({
            venueTitle: payment.venueTitle,
            taxIdentificationNumber: payment.taxIdentificationNumber,
            bankAccountNumber: payment.bankAccountNumber,
            bankName: payment.bankName,
            qrCodeUrl: payment.qrcodeUrl || '',
        });
        setQrPreview(payment.qrcodeUrl || null);
        setShowAddForm(true);
    };

    const handleDeletePayment = (paymentId: number) => {
        if (confirm('Удалить эти реквизиты?')) {
            deleteMutation.mutate(paymentId);
        }
    };

    const handleClose = () => {
        setShowAddForm(false);
        setEditingPayment(null);
        setFormData({
            venueTitle: venue.name,
            taxIdentificationNumber: '',
            bankAccountNumber: '',
            bankName: '',
            qrCodeUrl: '',
        });
        setQrPreview(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="relative bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[85vh] flex flex-col shadow-2xl"
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">
                            {editingPayment ? 'Изменить реквизиты' : showAddForm ? 'Добавить реквизиты' : 'Реквизиты для оплаты'}
                        </h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 truncate max-w-[220px]">{venue.name}</p>
                    </div>
                    <button onClick={handleClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {showAddForm ? (
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {/* Bank Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Название банка <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.bankName}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                                placeholder="Например: ОТП Банк"
                                className="w-full h-12 px-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                required
                            />
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Номер счёта <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.bankAccountNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                                placeholder="0000 0000 0000 0000"
                                className="w-full h-12 px-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                required
                            />
                        </div>

                        {/* TIN */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                ИНН <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.taxIdentificationNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, taxIdentificationNumber: e.target.value }))}
                                placeholder="0000000000"
                                className="w-full h-12 px-4 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                required
                            />
                        </div>

                        {/* QR Code Upload */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                QR код для оплаты
                            </label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-primary/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="qr-upload"
                                    disabled={isUploading}
                                />
                                <label htmlFor="qr-upload" className="cursor-pointer">
                                    {qrPreview ? (
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <img src={qrPreview} alt="QR Preview" className="w-32 h-32 mx-auto object-contain rounded-lg" />
                                                {isUploading && (
                                                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                                        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {isUploading ? 'Загрузка...' : 'Нажмите для изменения'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {isUploading ? (
                                                <>
                                                    <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                                    <p className="text-sm font-bold text-brand-600">Загрузка QR кода...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard size={32} className="mx-auto text-slate-300" />
                                                    <p className="text-sm font-bold text-slate-600">Загрузить QR код</p>
                                                    <p className="text-xs text-slate-400">PNG, JPG до 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {isLoading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                            ))
                        ) : payments.length === 0 ? (
                            <div className="text-center py-10">
                                <CreditCard size={40} className="text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium text-sm">Реквизиты не добавлены</p>
                            </div>
                        ) : (
                            payments.map((p) => (
                                <div key={p.id} className="relative bg-gradient-to-br from-brand-950 to-brand-700 rounded-2xl p-5 text-white space-y-4">
                                    {/* Action Menu */}
                                    <div className="absolute top-4 right-4">
                                        <PaymentActionMenu
                                            payment={p}
                                            onEdit={handleEditPayment}
                                            onDelete={handleDeletePayment}
                                            isDeleting={deleteMutation.isPending}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pr-10">
                                        <p className="text-xs font-black uppercase tracking-widest text-white/60">Реквизиты банка</p>
                                        <CreditCard size={20} className="text-white/60" />
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Банк</p>
                                            <p className="font-black text-white">{p.bankName || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Счёт</p>
                                            <p className="font-black text-white tracking-widest">{p.bankAccountNumber || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">ИНН</p>
                                            <p className="font-black text-white">{p.taxIdentificationNumber || '—'}</p>
                                        </div>
                                    </div>
                                    {p.qrcodeUrl && (
                                        <div className="bg-white rounded-xl p-3 flex justify-center">
                                            <img src={p.qrcodeUrl} alt="QR Code" className="w-32 h-32 object-contain" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="p-5 border-t border-slate-100 space-y-3">
                    {showAddForm ? (
                        <>
                            <Button
                                onClick={handleUploadAndSubmit}
                                disabled={isUploading || updateMutation.isPending}
                                className="w-full h-12 font-black text-sm"
                            >
                                {isUploading ? 'Загрузка QR кода...' : editingPayment ? 'Сохранить изменения' : 'Добавить реквизиты'}
                            </Button>
                            <button
                                onClick={() => {
                                    setEditingPayment(null);
                                    setShowAddForm(false);
                                }}
                                disabled={isUploading}
                                className="w-full h-12 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Отмена
                            </button>
                        </>
                    ) : (
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="w-full h-12 font-black text-sm"
                        >
                            <Plus size={18} className="mr-2" />
                            Добавить реквизиты
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ─────────── Payment Action Menu ───────────
const PaymentActionMenu: React.FC<{
    payment: PaymentDetail;
    onEdit: (payment: PaymentDetail) => void;
    onDelete: (paymentId: number) => void;
    isDeleting: boolean;
}> = ({ payment, onEdit, onDelete, isDeleting }) => {
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
                className="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:bg-white/10 active:bg-white/20 transition-colors"
            >
                <MoreVertical size={16} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-8 z-40 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                        <div className="p-1.5 space-y-0.5">
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpen(false); onEdit(payment); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            >
                                <Settings2 size={16} className="text-amber-600" />
                                <span className="text-sm font-bold text-slate-700">Изменить</span>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpen(false); onDelete(payment.id); }}
                                disabled={isDeleting}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left disabled:opacity-50"
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

// ─────────── Venue Action Menu ───────────
type ModalType = 'replace-admin' | 'conditions' | 'payment' | null;

const VenueActionMenu: React.FC<{ venue: VenueListItem; onDelete: (id: number) => void; isDeleting: boolean }> = ({
    venue, onDelete, isDeleting
}) => {
    const [open, setOpen] = React.useState(false);
    const [activeModal, setActiveModal] = React.useState<ModalType>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const actions = [
        { icon: UserCog, label: 'Заменить администратора', modal: 'replace-admin' as ModalType, color: 'text-brand-600' },
        { icon: Settings2, label: 'Условия бронирования', modal: 'conditions' as ModalType, color: 'text-amber-600' },
        { icon: CreditCard, label: 'Реквизиты оплаты', modal: 'payment' as ModalType, color: 'text-emerald-600' },
    ];

    return (
        <>
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
                            className="absolute right-0 top-10 z-40 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-1.5 space-y-0.5">
                                {actions.map((action) => (
                                    <button
                                        key={action.modal}
                                        onClick={(e) => { e.stopPropagation(); setOpen(false); setActiveModal(action.modal); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                    >
                                        <action.icon size={16} className={action.color} />
                                        <span className="text-sm font-bold text-slate-700">{action.label}</span>
                                    </button>
                                ))}
                                <div className="border-t border-slate-100 my-1" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setOpen(false); if (confirm('Удалить заведение?')) onDelete(venue.venueId); }}
                                    disabled={isDeleting}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                    <span className="text-sm font-bold text-red-500">Удалить заведение</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {activeModal === 'replace-admin' && <ReplaceAdminModal venue={venue} onClose={() => setActiveModal(null)} />}
                {activeModal === 'conditions' && <ConditionsModal venue={venue} onClose={() => setActiveModal(null)} />}
                {activeModal === 'payment' && <PaymentModal venue={venue} onClose={() => setActiveModal(null)} />}
            </AnimatePresence>
        </>
    );
};

// ─────────── Venue Card (Mobile) ───────────
const VenueCard: React.FC<{
    venue: VenueListItem;
    onDelete: (id: number) => void;
    isDeleting: boolean;
    onClick: () => void;
}> = ({
    venue, onDelete, isDeleting, onClick
}) => (
        <div
            onClick={onClick}
            className="p-4 bg-white hover:bg-slate-50 transition-all cursor-pointer group active:scale-[0.99] active:bg-slate-100"
        >
            <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0 shadow-sm">
                    {venue.firstImageUrl ? (
                        <img src={venue.firstImageUrl} alt={venue.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-400">
                            <Store size={26} />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-slate-900 text-base leading-tight truncate">{venue.name}</h3>
                        <VenueActionMenu venue={venue} onDelete={onDelete} isDeleting={isDeleting} />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[11px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                            <Star size={10} fill="currentColor" /> {venue.rating}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                            ≈ {venue.averageCheck} сом
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                    <MapPin size={13} className="flex-shrink-0 text-brand-500" />
                    <span className="text-xs font-semibold text-slate-600 line-clamp-1">{venue.address}</span>
                </div>
                <div className="flex items-center gap-2 px-1">
                    <User size={12} className="text-slate-300 flex-shrink-0" />
                    <span className="text-xs text-slate-400">
                        Администратор: <span className="text-slate-700 font-black">{venue.adminFullName}</span>
                    </span>
                </div>
            </div>
        </div>
    );

// ─────────── Main Page ───────────
export const SuperAdminVenuesPage: React.FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { ref, inView } = useInView({ threshold: 0.1 });
    const [searchTerm, setSearchTerm] = React.useState('');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['super-admin-venues'],
        queryFn: ({ pageParam = 0 }) => superAdminVenueService.getAllVenues(pageParam, 10),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === 10 ? allPages.length * 10 : undefined,
        initialPageParam: 0,
    });

    const venues = data?.pages.flatMap((page) => page || []) || [];

    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

    const deleteMutation = useMutation({
        mutationFn: (id: number) => superAdminVenueService.deleteVenue(id),
        onSuccess: () => {
            toast.success('Заведение удалено');
            queryClient.invalidateQueries({ queryKey: ['super-admin-venues'] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Ошибка удаления'),
    });

    const filteredVenues = venues.filter((v) =>
        (v.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (v.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Заведения</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{venues.length} заведений в системе</p>
                </div>
                <Button
                    onClick={() => navigate('/super-admin/venues/create')}
                    className="flex items-center justify-center gap-2 h-12 md:h-11 px-6 w-full md:w-auto shadow-lg shadow-brand-100"
                >
                    <Plus size={20} />
                    <span>Добавить заведение</span>
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input
                        type="text"
                        placeholder="Поиск по названию или адресу..."
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 rounded-xl text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Cards */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-4 border-b border-slate-50 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
                                    <div className="h-3 bg-slate-50 rounded-lg w-1/3" />
                                    <div className="h-3 bg-slate-50 rounded-lg w-full mt-3" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredVenues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Store size={48} className="text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">Заведения не найдены</p>
                        {searchTerm && <p className="text-xs text-slate-300 mt-1">Попробуйте изменить запрос</p>}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {filteredVenues.map((venue) => (
                            <VenueCard
                                key={venue.venueId}
                                venue={venue}
                                onDelete={(id) => deleteMutation.mutate(id)}
                                isDeleting={deleteMutation.isPending}
                                onClick={() => navigate(`/super-admin/venues/${venue.venueId}`)}
                            />
                        ))}
                    </div>
                )}

                {/* Infinite scroll sentinel */}
                <div ref={ref} className="py-6 flex justify-center">
                    {isFetchingNextPage && (
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                            Загрузка...
                        </div>
                    )}
                    {!hasNextPage && venues.length > 0 && !isLoading && (
                        <p className="text-slate-200 text-xs font-bold uppercase tracking-widest">Все заведения загружены</p>
                    )}
                </div>
            </div>
        </div>
    );
};
