'use client'

import { useGalaxyStore } from "@/store/useGalaxyStore"

export function NebulaSynthesisModal() {
    const synthesisResult = useGalaxyStore(state => state.synthesisResult)
    const isSynthesizing = useGalaxyStore(state => state.isSynthesizing)
    const setSynthesisResult = useGalaxyStore(state => state.setSynthesisResult)

    const stars = useGalaxyStore(state => state.stars)
    const setActiveStar = useGalaxyStore(state => state.setActiveStar)

    if (!isSynthesizing && !synthesisResult) return null

    // Find star objects if IDs are provided
    const constellationStars = synthesisResult?.stars
        ? stars.filter(s => synthesisResult.stars?.includes(s.id))
        : []

    const handleStarClick = (starId: string) => {
        setSynthesisResult(null) // Close modal
        setActiveStar(starId) // Fly to star
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl max-w-lg w-full pointer-events-auto animate-in fade-in zoom-in duration-500 shadow-[0_0_100px_rgba(100,200,255,0.15)] relative overflow-hidden">

                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                <div className="absolute -top-[200px] -left-[200px] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {isSynthesizing ? (
                    <div className="text-center space-y-6 py-10">
                        <div className="relative inline-block">
                            <div className="text-6xl animate-pulse">✨</div>
                            <div className="absolute inset-0 animate-ping opacity-50">✨</div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-light text-cyan-200 tracking-wide">Consulting the Stars...</h2>
                            <p className="text-white/40 text-sm mt-2 font-mono">Synthesizing nebular meaning</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 text-center relative z-10">
                        {/* Title Section */}
                        <div>
                            <div className="text-6xl mb-6 mx-auto w-20 h-20 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/5">
                                🌌
                            </div>
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-purple-200 drop-shadow-sm">
                                {synthesisResult?.name}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                            <p className="text-lg text-cyan-100/90 leading-relaxed italic font-light">
                                "{synthesisResult?.description}"
                            </p>
                        </div>

                        {/* Participating Stars */}
                        {constellationStars.length > 0 && (
                            <div className="text-left">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 pl-1">Constituent Thoughts</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {constellationStars.map(star => (
                                        <button
                                            key={star.id}
                                            onClick={() => handleStarClick(star.id)}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-cyan-200/70 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95 text-left max-w-full truncate"
                                            style={{ borderColor: `${star.color}30`, color: star.color }}
                                            title="Fly to this star"
                                        >
                                            {star.content.length > 25 ? star.content.slice(0, 25) + '...' : star.content}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer / Close */}
                        <div className="pt-4">
                            <button
                                onClick={() => setSynthesisResult(null)}
                                className="group relative px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full sm:w-auto"
                            >
                                <span className="relative z-10 text-white group-hover:tracking-widest transition-all uppercase text-xs font-bold">Close Transmission</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
