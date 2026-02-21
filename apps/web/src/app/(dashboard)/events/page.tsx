'use client';

import { useState } from 'react';
import { Plus, Zap, MousePointerClick, Eye, Settings, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useEvents, useCreateEvent } from '@/hooks/use-events';

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

const columns = [
    { key: 'name', label: 'Event Name' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Created' },
];

export default function EventsPage() {
    const { data: events } = useEvents();
    const { mutateAsync: createEvent, isPending } = useCreateEvent();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('CUSTOM');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const displayEvents: EventItem[] = events || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Event name is required');
            return;
        }

        try {
            await createEvent({ name, type, description });
            setIsModalOpen(false);
            setName('');
            setType('CUSTOM');
            setDescription('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Event Definitions</h1>
                    <p className="text-gray-400 mt-1">
                        Manage your trackable event types
                    </p>
                </div>
                <Button variant="primary" size="sm" className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
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
                                    {typeIcons[event.type] || typeIcons['CUSTOM']}
                                    <span className="font-medium text-gray-200">
                                        {event.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeBadgeColors[event.type] || typeBadgeColors['CUSTOM']}`}
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

            {/* Create Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md">
                        <div className="glass-card relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-6">
                                <h2 className="text-xl font-bold text-white mb-1">Create New Event</h2>
                                <p className="text-sm text-gray-400 mb-6">Define a new event to track in your analytics.</p>

                                <form onSubmit={handleCreate} className="space-y-4">
                                    {error && (
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Event Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="input-field"
                                            placeholder="e.g., Homepage View"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Event Type
                                        </label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="input-field !pr-10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-no-repeat bg-[right_1rem_center]"
                                        >
                                            <option value="PAGE_VIEW" className="bg-surface">Page View</option>
                                            <option value="CLICK" className="bg-surface">Click</option>
                                            <option value="CONVERSION" className="bg-surface">Conversion</option>
                                            <option value="CUSTOM" className="bg-surface">Custom</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description <span className="text-gray-500">(Optional)</span>
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="input-field min-h-[100px] resize-y"
                                            placeholder="Describe what this event tracks..."
                                        />
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 bg-surface-overlay/50 border border-white/5"
                                            onClick={() => setIsModalOpen(false)}
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="flex-1"
                                            disabled={isPending}
                                        >
                                            {isPending ? 'Creating...' : 'Create Event'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
