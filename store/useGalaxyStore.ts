import { create } from 'zustand'
import { generateEmbedding } from '@/app/actions'

export interface Star {
    id: string
    position: [number, number, number]
    content: string
    color: string
    createdAt: number
    embedding: number[]
}

// Initial mock data for startup
const INITIAL_STARS: Star[] = [
    { id: '1', position: [0, 0, 0], content: 'Welcome to Nebula', color: '#00ffff', createdAt: Date.now(), embedding: [0.9, 0.1, 0.1] },
    { id: '2', position: [5, 2, -5], content: 'Thoughts are stars', color: '#ff00ff', createdAt: Date.now(), embedding: [0.1, 0.9, 0.1] },
    { id: '3', position: [-5, -2, -5], content: 'Connect the constellations', color: '#ffff00', createdAt: Date.now(), embedding: [0.1, 0.1, 0.9] },
    { id: '4', position: [2, 4, 2], content: 'React Three Fiber', color: '#00ffff', createdAt: Date.now(), embedding: [0.9, 0.1, 0.1] },
    { id: '5', position: [-2, -4, -2], content: 'The nature of consciousness', color: '#ff00ff', createdAt: Date.now(), embedding: [0.1, 0.9, 0.1] },
]

interface GalaxyState {
    stars: Star[]
    addStar: (star: Omit<Star, 'id' | 'createdAt' | 'embedding'>) => Promise<void>
    activeStarId: string | null
    setActiveStar: (id: string | null) => void
    removeStar: (id: string) => void
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
    stars: INITIAL_STARS,
    activeStarId: null,
    setActiveStar: (id) => set({ activeStarId: id }),
    addStar: async (star) => {
        try {
            const embedding = await generateEmbedding(star.content)
            set((state) => ({
                stars: [...state.stars, {
                    ...star,
                    id: Math.random().toString(36).substring(7),
                    createdAt: Date.now(),
                    embedding: embedding
                }]
            }))
        } catch (error) {
            console.error("Failed to add star:", error)
        }
    },
    removeStar: (id) => set((state) => ({
        stars: state.stars.filter(s => s.id !== id)
    }))
}))
