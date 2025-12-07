import { create } from 'zustand'
import { createStar, getStars } from '@/app/actions'

export interface Star {
    id: string
    position: [number, number, number]
    content: string
    color: string
    createdAt: number
    embedding: number[]
}

// Initial mock data - we can keep or clear. Ideally connect to DB.
const INITIAL_STARS: Star[] = []

interface GalaxyState {
    stars: Star[]
    addStar: (star: Omit<Star, 'id' | 'createdAt' | 'embedding'>) => Promise<void>
    loadStars: () => Promise<void>
    activeStarId: string | null
    setActiveStar: (id: string | null) => void
    removeStar: (id: string) => void
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
    stars: INITIAL_STARS,
    activeStarId: null,
    setActiveStar: (id) => set({ activeStarId: id }),
    addStar: async (starInput) => {
        try {
            // Call server action to create and save
            const newStar = await createStar(
                starInput.content,
                starInput.position[0],
                starInput.position[1],
                starInput.position[2],
                starInput.color
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
    removeStar: (id) => set((state) => ({
        stars: state.stars.filter(s => s.id !== id)
    }))
}))
