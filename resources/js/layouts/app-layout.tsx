import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { ToastContainer } from '@/components/toast-container';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export const AppLayout = ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
        <ToastContainer />
    </>
);

export default AppLayout;
