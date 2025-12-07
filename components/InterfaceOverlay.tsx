'use client'
import { useState } from 'react'
import { Plus, X, Trash2, Cloud, CloudOff } from 'lucide-react'
import { useGalaxyStore } from '@/store/useGalaxyStore'
import { SearchBar } from './SearchBar'
import { NebulaSynthesisModal } from './NebulaSynthesisModal'

export function InterfaceOverlay() {
    const stars = useGalaxyStore(state => state.stars)
    const addStar = useGalaxyStore(state => state.addStar)
    const activeStarId = useGalaxyStore(state => state.activeStarId)
    const setActiveStar = useGalaxyStore(state => state.setActiveStar)
    const removeStar = useGalaxyStore(state => state.removeStar)
    const showNebula = useGalaxyStore(state => state.showNebula)
    const setShowNebula = useGalaxyStore(state => state.setShowNebula)

    const [isOpen, setIsOpen] = useState(false)
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('idea')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const activeStar = stars.find(s => s.id === activeStarId)

    const handleDelete = async () => {
        if (!activeStar || isDeleting) return

        if (window.confirm(`Are you sure you want to delete this star?\n\n"${activeStar.content.substring(0, 100)}${activeStar.content.length > 100 ? '...' : ''}"`)) {
            setIsDeleting(true)
            try {
                await removeStar(activeStar.id)
            } catch (error) {
                console.error('Error deleting star:', error)
                alert('Failed to delete star. Please try again.')
            } finally {
                setIsDeleting(false)
            }
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            // Random position within -10 to 10 range
            const position: [number, number, number] = [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            ]

            // Color based on category
            const categoryColors: Record<string, string> = {
                'idea': '#00ffff',      // Cyan
                'task': '#ff0000',      // Red
                'question': '#ff00ff',  // Magenta
                'person': '#00ff00',    // Green
                'resource': '#ffff00'   // Yellow
            }
            const color = categoryColors[category] || '#ffffff'

            await addStar({ content, position, color, category })
            setContent('')
            setCategory('idea')
            setIsOpen(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Header / Logo */}
            <div className="absolute top-8 left-8 pointer-events-auto flex items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        NEBULA
                    </h1>
                    <p className="text-cyan-200/50 text-sm tracking-widest mt-1">THOUGHT GALAXY</p>
                </div>

                {/* Nebula Toggle */}
                <button
                    onClick={() => setShowNebula(!showNebula)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all hover:scale-105 active:scale-95 group"
                    title={showNebula ? "Hide Clouds" : "Show Clouds"}
                >
                    {showNebula ? (
                        <Cloud size={20} className="text-cyan-400 group-hover:text-cyan-300" />
                    ) : (
                        <CloudOff size={20} className="text-white/30 group-hover:text-white/60" />
                    )}
                </button>
            </div>

            {/* Top Right: Search */}
            <div className="absolute top-4 right-4 pointer-events-auto flex items-start gap-4">
                <SearchBar />
            </div>

            {/* Center: Synthesis Modal */}
            <NebulaSynthesisModal />

            {/* Deep Dive Panel - Right Sidebar */}
            {activeStar && (
                <div className="absolute top-0 right-0 bottom-0 z-20 w-[450px] pointer-events-none flex flex-col justify-end sm:justify-start">
                    <div className="bg-slate-950/30 backdrop-blur-3xl border-l border-white/10 h-full w-full shadow-[-20px_0_40px_rgba(0,0,0,0.5)] pointer-events-auto relative animate-in slide-in-from-right duration-500 flex flex-col overflow-hidden supports-[backdrop-filter]:bg-slate-950/10">
                        {/* Geometric Decoration */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                        {/* Header */}
                        <div className="p-8 border-b border-white/5 shrink-0 relative z-10 bg-gradient-to-b from-white/5 to-transparent">
                            <button
                                onClick={() => setActiveStar(null)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-cyan-400">Star Details</h2>
                            </div>
                            <span
                                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-block"
                                style={{
                                    borderColor: activeStar.color,
                                    color: activeStar.color,
                                    backgroundColor: `${activeStar.color}20`
                                }}
                            >
                                {activeStar.category}
                            </span>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
                            <div className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap font-light tracking-wide selection:bg-cyan-500/30">
                                {activeStar.content}
                            </div>
                        </div>

                        {/* Footer / Metadata */}
                        <div className="p-8 border-t border-white/5 shrink-0 bg-black/40 relative z-10 backdrop-blur-sm">
                            <div className="text-sm text-slate-400 flex flex-col gap-3 mb-6 font-mono">
                                <div className="flex justify-between">
                                    <span>ID</span>
                                    <span className="font-mono text-white/50">{activeStar.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Created</span>
                                    <span>{new Date(activeStar.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Visits</span>
                                    <span className="text-cyan-400 font-bold text-lg">{activeStar.visits}</span>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <div className="mt-6 pt-6 border-t border-red-500/20">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]"
                                >
                                    <Trash2 size={18} />
                                    {isDeleting ? 'Deleting Star...' : 'Delete Star'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Right: Add Star Button & Form */}
            <div className={`absolute bottom-8 right-8 pointer-events-auto flex flex-col items-end gap-4 transition-transform duration-500 ${activeStar ? '-translate-x-[450px]' : ''}`}>
                {isOpen && (
                    <form onSubmit={handleAdd} className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl w-80 shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-500 min-h-[100px] resize-none mb-3"
                            autoFocus
                            disabled={isSubmitting}
                        />

                        {/* Category Selector */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                            {['idea', 'task', 'question', 'person'].map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border capitalize ${category === cat
                                        ? 'bg-white/20 border-white text-white'
                                        : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white/80'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 text-xs text-white/50 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/50 px-4 py-1.5 rounded-md text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Ignition...' : 'Launch Star'}
                            </button>
                        </div>
                    </form>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-sm border transition-all duration-300 shadow-[0_0_30px_rgba(0,255,255,0.2)] ${isOpen ? 'bg-red-500/20 border-red-500/50 text-red-500 rotate-45' : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:scale-110 hover:shadow-[0_0_50px_rgba(0,255,255,0.4)]'}`}
                >
                    <Plus size={24} />
                </button>
            </div>
        </div>
    )
}
