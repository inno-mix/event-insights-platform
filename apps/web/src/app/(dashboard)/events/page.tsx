'use client';

import { Plus, Zap, MousePointerClick, Eye, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useEvents } from '@/hooks/use-events';

interface EventItem {
    id: string;
    name: string;
    type: string;
    description: string | null;
    createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
    PAGE_VIEW: <Eye className="w-4 h-4 text-blue-400" />,
    CLICK: <MousePointerClick className="w-4 h-4 text-emerald-400" />,
    CONVERSION: <Zap className="w-4 h-4 text-amber-400" />,
    CUSTOM: <Settings className="w-4 h-4 text-gray-400" />,
};

const typeBadgeColors: Record<string, string> = {
    PAGE_VIEW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    CLICK: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    CONVERSION: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    CUSTOM: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

// Demo data — replaced by real API data when backend is running
const demoEvents: EventItem[] = [
    { id: '1', name: 'Homepage View', type: 'PAGE_VIEW', description: 'Tracks homepage visits', createdAt: '2026-02-20T10:00:00Z' },
    { id: '2', name: 'CTA Button Click', type: 'CLICK', description: 'Main call-to-action button', createdAt: '2026-02-20T10:30:00Z' },
    { id: '3', name: 'Signup Complete', type: 'CONVERSION', description: 'User completed registration', createdAt: '2026-02-20T11:00:00Z' },
    { id: '4', name: 'Feature Usage', type: 'CUSTOM', description: 'Custom feature tracking', createdAt: '2026-02-20T11:30:00Z' },
];

const columns = [
    { key: 'name', label: 'Event Name' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Created' },
];

export default function EventsPage() {
    const { data: events } = useEvents();
    const displayEvents: EventItem[] = events || demoEvents;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Event Definitions</h1>
                    <p className="text-gray-400 mt-1">
                        Manage your trackable event types
                    </p>
                </div>
                <Button variant="primary" size="sm">
                    <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Event
                    </span>
                </Button>
            </div>

            {/* Table */}
            <Card className="!p-0 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={displayEvents}
                    emptyMessage="No events created yet. Create your first event to start tracking."
                    renderRow={(event) => (
                        <>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    {typeIcons[event.type]}
                                    <span className="font-medium text-gray-200">
                                        {event.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeBadgeColors[event.type]}`}
                                >
                                    {event.type.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-sm">
                                {event.description || '—'}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-sm">
                                {new Date(event.createdAt).toLocaleDateString()}
                            </td>
                        </>
                    )}
                />
            </Card>
        </div>
    );
}
