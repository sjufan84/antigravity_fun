import { create } from 'zustand'
import { createStar, getStars, deleteStar } from '@/app/actions'

export interface Star {
    id: string
    position: [number, number, number]
    content: string
    color: string
    category: string
    visits: number
    createdAt: number
    embedding: number[]
}

// Initial mock data - we can keep or clear. Ideally connect to DB.
const INITIAL_STARS: Star[] = []

interface GalaxyState {
    stars: Star[]

    // Nebula Visibility
    showNebula: boolean
    setShowNebula: (show: boolean) => void

    addStar: (star: Omit<Star, 'id' | 'createdAt' | 'embedding' | 'visits'>) => Promise<void>
    loadStars: () => Promise<void>
    activeStarId: string | null
    setActiveStar: (id: string | null) => void
    removeStar: (id: string) => Promise<void>
    incrementVisits: (id: string) => void // Optimistic update
    // Update result type to include participating stars
    synthesisResult: { name: string; description: string; stars?: string[] } | null
    setSynthesisResult: (result: { name: string; description: string; stars?: string[] } | null) => void

    // Cache: key = sorted star IDs joined by comma
    synthesisCache: Record<string, { name: string; description: string }>
    addToSynthesisCache: (key: string, result: { name: string; description: string }) => void

    isSynthesizing: boolean
    setIsSynthesizing: (isSynthesizing: boolean) => void
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
    stars: INITIAL_STARS,
    activeStarId: null,
    setActiveStar: (id) => set({ activeStarId: id }),

    showNebula: true,
    setShowNebula: (show) => set({ showNebula: show }),

    synthesisResult: null,
    setSynthesisResult: (result) => set({ synthesisResult: result }),

    synthesisCache: {},
    addToSynthesisCache: (key, result) => set((state) => ({
        synthesisCache: { ...state.synthesisCache, [key]: result }
    })),

    isSynthesizing: false,
    setIsSynthesizing: (isSynthesizing) => set({ isSynthesizing }),

    incrementVisits: (id) => set((state) => ({
        stars: state.stars.map(s => s.id === id ? { ...s, visits: s.visits + 1 } : s)
    })),
    addStar: async (starInput) => {
        try {
            // Call server action to create and save
            const newStar = await createStar(
                starInput.content,
                starInput.position[0],
                starInput.position[1],
                starInput.position[2],
                starInput.color,
                starInput.category
            )

            set((state) => ({
                stars: [...state.stars, newStar]
            }))
        } catch (error) {
            console.error("Failed to add star:", error)
        }
    },
    loadStars: async () => {
        try {
            const stars = await getStars()
            set({ stars })
        } catch (error) {
            console.error("Failed to load stars:", error)
        }
    },
    removeStar: async (id) => {
        try {
            const result = await deleteStar(id)
            if (result.success) {
                set((state) => ({
                    stars: state.stars.filter(s => s.id !== id),
                    activeStarId: state.activeStarId === id ? null : state.activeStarId
                }))
            } else {
                console.error('Failed to delete star:', result.error)
            }
        } catch (error) {
            console.error('Error deleting star:', error)
        }
    }
}))
