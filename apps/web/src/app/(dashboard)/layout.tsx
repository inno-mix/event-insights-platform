'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar currentPath={pathname} />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
    );
}
