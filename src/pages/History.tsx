import { useState, useEffect } from "react";
import { fetchHistory, toggleStar } from "../api";
import { useTheme } from "../context/ThemeContext";
import type { Generation } from "../types";

export default function History() {
    const { theme } = useTheme();
    const [history, setHistory] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<Generation | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadHistory();
    }, [page, searchQuery]);

    const loadHistory = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchHistory(page, searchQuery);
            setHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const copyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
    };

    const handleToggleStar = async (id: number, currentStarred: boolean) => {
        try {
            await toggleStar(id, !currentStarred);
            // Refresh the history to show updated star status and reorder
            loadHistory();
        } catch (err) {
            console.error("Failed to toggle star:", err);
        }
    };

    return (
        <div className="min-h-screen p-6 transition-colors duration-300"
            style={{
                background: theme === 'dark'
                    ? 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-via), var(--bg-gradient-to))'
                    : 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-via), var(--bg-gradient-to))'
            }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Generation History
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>View your past code generations</p>

                    {/* Search Bar */}
                    <div className="mt-4">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Search by prompt or code..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1); // Reset to first page on search
                                }}
                                className="w-full px-4 py-2 pl-10 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                    borderColor: 'var(--border-primary)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                                style={{ color: 'var(--text-tertiary)' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
                                style={{ borderColor: 'var(--text-primary)' }}></div>
                            <p style={{ color: 'var(--text-secondary)' }}>Loading history...</p>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="backdrop-blur-lg rounded-2xl p-12 border text-center"
                        style={{
                            backgroundColor: 'var(--card-bg)',
                            borderColor: 'var(--card-border)'
                        }}>
                        <svg className="mx-auto h-16 w-16 mb-4" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            No History Yet
                        </h3>
                        <p style={{ color: 'var(--text-tertiary)' }}>
                            Start generating code to see your history here
                        </p>
                    </div>
                ) : (
                    <>
                        {/* History Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className="backdrop-blur-lg rounded-xl p-5 border transition-all cursor-pointer hover:scale-[1.02] shadow-lg"
                                    style={{
                                        backgroundColor: 'var(--card-bg)',
                                        borderColor: 'var(--card-border)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--card-hover-border)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--card-border)';
                                    }}
                                >
                                    {/* Header with Star Button */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold"
                                                style={{
                                                    backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                                                    color: theme === 'dark' ? '#93c5fd' : '#1e40af',
                                                    border: `1px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'}`
                                                }}>
                                                {item.language.name}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStar(item.id, item.starred);
                                                }}
                                                className="text-lg hover:scale-125 transition-transform"
                                                style={{
                                                    color: item.starred ? '#fbbf24' : 'var(--text-tertiary)'
                                                }}
                                                title={item.starred ? "Remove from favorites" : "Add to favorites"}
                                            >
                                                {item.starred ? "★" : "☆"}
                                            </button>
                                        </div>
                                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>

                                    {/* Prompt */}
                                    <p className="font-medium mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                                        {item.prompt}
                                    </p>

                                    {/* Code Preview */}
                                    <pre className="p-3 rounded-lg text-xs overflow-hidden line-clamp-3 font-mono"
                                        style={{
                                            backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.5)' : 'rgba(0, 0, 0, 0.05)',
                                            color: 'var(--text-secondary)'
                                        }}>
                                        {item.code}
                                    </pre>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded-lg disabled:cursor-not-allowed transition-all"
                                style={{
                                    backgroundColor: page === 1 ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                                    borderColor: 'var(--card-border)',
                                    color: page === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)'
                                }}
                            >
                                ← Previous
                            </button>
                            <span style={{ color: 'var(--text-primary)' }}>Page {page}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={history.length < 10}
                                className="px-4 py-2 border rounded-lg disabled:cursor-not-allowed transition-all"
                                style={{
                                    backgroundColor: history.length < 10 ? 'var(--bg-tertiary)' : 'var(--card-bg)',
                                    borderColor: 'var(--card-border)',
                                    color: history.length < 10 ? 'var(--text-tertiary)' : 'var(--text-primary)'
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}

                {/* Modal for Selected Item */}
                {selectedItem && (
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <div
                            className="rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto border"
                            style={{
                                backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                                borderColor: 'var(--card-border)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                        {selectedItem.language.name}
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                                        {formatDate(selectedItem.createdAt)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="text-2xl hover:opacity-70 transition-opacity"
                                    style={{ color: 'var(--text-tertiary)' }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Prompt */}
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
                                    PROMPT
                                </h4>
                                <p className="p-4 rounded-lg border"
                                    style={{
                                        backgroundColor: 'var(--card-bg)',
                                        borderColor: 'var(--border-secondary)',
                                        color: 'var(--text-primary)'
                                    }}>
                                    {selectedItem.prompt}
                                </p>
                            </div>

                            {/* Code */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                                        GENERATED CODE
                                    </h4>
                                    <button
                                        onClick={() => copyCode(selectedItem.code)}
                                        className="px-3 py-1 border rounded-lg text-sm transition-all"
                                        style={{
                                            backgroundColor: 'var(--card-bg)',
                                            borderColor: 'var(--card-border)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                                <pre className="p-4 rounded-lg overflow-auto max-h-96 border font-mono text-sm"
                                    style={{
                                        backgroundColor: 'var(--code-bg)',
                                        borderColor: 'var(--code-border)',
                                        color: 'var(--text-primary)'
                                    }}>
                                    <code>{selectedItem.code}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
