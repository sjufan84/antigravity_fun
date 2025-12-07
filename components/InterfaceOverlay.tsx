'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useGalaxyStore } from '@/store/useGalaxyStore'
import { SearchBar } from './SearchBar'

export function InterfaceOverlay() {
    const stars = useGalaxyStore(state => state.stars)
    const addStar = useGalaxyStore(state => state.addStar)
    const activeStarId = useGalaxyStore(state => state.activeStarId)
    const setActiveStar = useGalaxyStore(state => state.setActiveStar)

    const [isOpen, setIsOpen] = useState(false)
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const activeStar = stars.find(s => s.id === activeStarId)

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

            // Random vibrant color
            const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00']
            const color = colors[Math.floor(Math.random() * colors.length)]

            await addStar({ content, position, color })
            setContent('')
            setIsOpen(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-8 left-8 pointer-events-auto">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    NEBULA
                </h1>
                <p className="text-cyan-200/50 text-sm tracking-widest mt-1">THOUGHT GALAXY</p>
            </div>

            <div className="absolute top-8 right-8 pointer-events-auto">
                <SearchBar />
            </div>

            {/* Deep Dive Panel */}
            {activeStar && (
                <div className="absolute inset-0 z-20 flex items-center justify-center p-12 pointer-events-none">
                    <div className="bg-black/90 backdrop-blur-3xl border border-cyan-500/30 p-8 rounded-2xl max-w-4xl w-full shadow-[0_0_100px_rgba(0,255,255,0.2)] pointer-events-auto relative animate-in zoom-in-95 duration-500">
                        <button
                            onClick={() => setActiveStar(null)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-bold text-cyan-400 mb-2">Star Details</h2>
                        <div className="text-white/80 text-lg leading-relaxed h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                            <p>{activeStar.content}</p>
                            <div className="mt-8 text-sm text-white/30 border-t border-white/10 pt-4 flex gap-4">
                                <span>ID: {activeStar.id}</span>
                                <span>•</span>
                                <span>Signal Detected: {new Date(activeStar.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-8 right-8 pointer-events-auto flex flex-col items-end gap-4">
                {isOpen && (
                    <form onSubmit={handleAdd} className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl w-80 shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-500 min-h-[100px] resize-none"
                            autoFocus
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-end mt-3 gap-2">
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
