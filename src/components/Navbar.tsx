import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const currentPage = location.pathname === "/history" ? "history" : "generator";

    return (
        <nav className="fixed top-0 left-0 right-0 backdrop-blur-lg border-b z-40"
            style={{
                backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderColor: 'var(--border-secondary)'
            }}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{"</>"}</span>
                        </div>
                        <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                            Mini Copilot
                        </span>
                    </Link>

                    {/* Navigation Links & Theme Toggle */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === "generator"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "hover:bg-opacity-10"
                                }`}
                            style={currentPage !== "generator" ? { color: 'var(--text-secondary)' } : {}}
                        >
                            ✨ Generator
                        </Link>
                        <Link
                            to="/history"
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === "history"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "hover:bg-opacity-10"
                                }`}
                            style={currentPage !== "history" ? { color: 'var(--text-secondary)' } : {}}
                        >
                            📚 History
                        </Link>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg transition-all hover:scale-110 active:scale-95"
                            style={{
                                backgroundColor: 'var(--card-bg)',
                                borderColor: 'var(--card-border)',
                                border: '1px solid'
                            }}
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" style={{ color: 'var(--text-primary)' }} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

