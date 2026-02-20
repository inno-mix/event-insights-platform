interface DataTableProps<T> {
    columns: { key: string; label: string }[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;
    emptyMessage?: string;
}

export function DataTable<T>({
    columns,
    data,
    renderRow,
    emptyMessage = 'No data available',
}: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/5">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-8 text-center text-gray-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, i) => (
                            <tr
                                key={i}
                                className="hover:bg-surface-overlay/50 transition-colors"
                            >
                                {renderRow(item)}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
