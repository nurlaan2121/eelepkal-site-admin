import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageContainer } from '../components/ui/AppWrapper';

export const AdminLayout = () => {
    return (
        <div className="flex bg-slate-50 h-screen overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Header />
                <PageContainer className="flex-1">
                    <div className="p-4 md:p-6 lg:p-8 safe-bottom">
                        <Outlet />
                    </div>
                </PageContainer>
                <Footer />
            </div>
        </div>
    );
};
