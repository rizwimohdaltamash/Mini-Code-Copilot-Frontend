import { useState } from "react";
import { generateCode, toggleStar } from "../api";
import { useTheme } from "../context/ThemeContext";

const LANGUAGES = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
];

// Keywords that suggest a coding-related question
const CODING_KEYWORDS = [
    'function', 'class', 'method', 'variable', 'array', 'loop', 'if', 'else',
    'code', 'program', 'algorithm', 'data structure', 'implement', 'create',
    'write', 'develop', 'build', 'make', 'generate', 'return', 'print',
    'calculate', 'sort', 'search', 'parse', 'validate', 'convert', 'format',
    'api', 'database', 'query', 'component', 'module', 'package', 'import'
];

export default function Generator() {
    const { theme } = useTheme();
    const [prompt, setPrompt] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [generatedId, setGeneratedId] = useState<number | null>(null);
    const [isStarred, setIsStarred] = useState(false);

    const validatePrompt = (text: string): boolean => {
        const lowerText = text.toLowerCase();
        return CODING_KEYWORDS.some(keyword => lowerText.includes(keyword));
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt");
            return;
        }

        // Validate if the prompt is coding-related
        if (!validatePrompt(prompt)) {
            setShowWarning(true);
            return;
        }

        setLoading(true);
        setError("");
        setOutput("");

        try {
            const data = await generateCode(prompt, language);
            setOutput(data.code);
            setGeneratedId(data.id);
            setIsStarred(data.starred || false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate code");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleGenerate();
        }
    };

    const handleToggleStar = async () => {
        if (generatedId === null) return;

        try {
            const newStarred = !isStarred;
            await toggleStar(generatedId, newStarred);
            setIsStarred(newStarred);
        } catch (err) {
            console.error("Failed to toggle star:", err);
        }
    };

    const selectedLang = LANGUAGES.find(l => l.value === language) || LANGUAGES[0];

    return (
        <div className="min-h-screen p-6 transition-colors duration-300"
            style={{
                background: theme === 'dark'
                    ? 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-via), var(--bg-gradient-to))'
                    : 'linear-gradient(to bottom right, var(--bg-gradient-from), var(--bg-gradient-via), var(--bg-gradient-to))'
            }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                        Mini Code Copilot
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Generate code with AI assistance</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="backdrop-blur-lg rounded-2xl p-6 border shadow-2xl transition-all"
                        style={{
                            backgroundColor: 'var(--card-bg)',
                            borderColor: 'var(--card-border)'
                        }}>
                        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Input</h2>

                        {/* Language Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Language
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between"
                                    style={{
                                        backgroundColor: 'var(--card-bg)',
                                        borderColor: 'var(--card-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <span>{selectedLang.label}</span>
                                    <svg className="w-5 h-5 transition-transform" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-2 rounded-lg border shadow-xl max-h-60 overflow-y-auto"
                                        style={{
                                            backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                                            borderColor: 'var(--card-border)'
                                        }}>
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.value}
                                                onClick={() => {
                                                    setLanguage(lang.value);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full p-3 text-left transition-all"
                                                style={{
                                                    backgroundColor: language === lang.value ? 'var(--accent-primary)' : 'transparent',
                                                    color: language === lang.value ? '#ffffff' : 'var(--text-primary)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (language !== lang.value) {
                                                        e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (language !== lang.value) {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prompt Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Prompt
                                <span className="text-xs ml-2" style={{ color: 'var(--text-tertiary)' }}>(Ctrl+Enter to generate)</span>
                            </label>
                            <textarea
                                className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                                style={{
                                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                    borderColor: 'var(--border-primary)',
                                    color: 'var(--text-primary)'
                                }}
                                rows={8}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g., Create a function to reverse a string..."
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </span>
                            ) : (
                                "✨ Generate Code"
                            )}
                        </button>
                    </div>

                    {/* Output Section */}
                    <div className="backdrop-blur-lg rounded-2xl p-6 border shadow-2xl transition-all"
                        style={{
                            backgroundColor: 'var(--card-bg)',
                            borderColor: 'var(--card-border)'
                        }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Output</h2>
                            {output && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleToggleStar}
                                        className="px-3 py-1 border rounded-lg text-sm transition-all hover:scale-105"
                                        style={{
                                            backgroundColor: isStarred ? '#fbbf24' : 'var(--card-bg)',
                                            borderColor: isStarred ? '#f59e0b' : 'var(--card-border)',
                                            color: isStarred ? '#000' : 'var(--text-primary)'
                                        }}
                                        title={isStarred ? "Remove from favorites" : "Add to favorites"}
                                    >
                                        {isStarred ? "★ Starred" : "☆ Star"}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="px-3 py-1 border rounded-lg text-sm transition-all"
                                        style={{
                                            backgroundColor: 'var(--card-bg)',
                                            borderColor: 'var(--card-border)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        {copied ? "✓ Copied!" : "📋 Copy"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: 'var(--text-primary)' }}></div>
                                    <p style={{ color: 'var(--text-secondary)' }}>Generating your code...</p>
                                </div>
                            </div>
                        ) : output ? (
                            <pre className="p-4 rounded-lg overflow-auto h-96 border font-mono text-sm leading-relaxed"
                                style={{
                                    backgroundColor: 'var(--code-bg)',
                                    borderColor: 'var(--code-border)',
                                    color: 'var(--text-primary)'
                                }}>
                                <code>{output}</code>
                            </pre>
                        ) : (
                            <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg"
                                style={{ borderColor: 'var(--border-primary)' }}>
                                <div className="text-center" style={{ color: 'var(--text-tertiary)' }}>
                                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    <p>Your generated code will appear here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setShowWarning(false)}>
                    <div className="rounded-2xl p-6 max-w-md w-full border shadow-2xl"
                        style={{
                            backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                            borderColor: 'var(--card-border)'
                        }}
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                ⚠️ Warning
                            </h3>
                        </div>
                        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                            Please ask questions related to <strong>code generation</strong> only.
                            Your prompt doesn't seem to be about programming or coding.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowWarning(false)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                            >
                                Got it
                            </button>
                            <button
                                onClick={() => {
                                    setShowWarning(false);
                                    setPrompt("");
                                }}
                                className="flex-1 border font-semibold py-2 px-4 rounded-lg transition-all"
                                style={{
                                    borderColor: 'var(--card-border)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                Clear Prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
