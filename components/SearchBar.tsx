'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { searchStars } from '@/app/actions'
import { useGalaxyStore } from '@/store/useGalaxyStore'

export function SearchBar() {
    const [query, setQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const setActiveStar = useGalaxyStore(state => state.setActiveStar)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsSearching(true)
        try {
            // Using searchStars from server action
            const results = await searchStars(query)

            if (results && results.length > 0) {
                // Fly to the top match
                const bestMatch = results[0].star
                console.log("Flying to:", bestMatch.content)
                setActiveStar(bestMatch.id)
            } else {
                console.log("No matches found")
                // Could show a toast or shake animation here
            }
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <form onSubmit={handleSearch} className="pointer-events-auto">
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search the galaxy..."
                    className="w-64 bg-black/50 backdrop-blur-md border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:w-80 transition-all duration-300"
                    disabled={isSearching}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-cyan-400 transition-colors"
                >
                    {isSearching ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Search size={16} />
                    )}
                </button>
            </div>
        </form>
    )
}
