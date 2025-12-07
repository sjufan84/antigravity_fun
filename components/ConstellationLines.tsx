import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { useGalaxyStore } from '@/store/useGalaxyStore'
import * as THREE from 'three'

// Helper to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
}

// Map similarity score to opacity (0.7-1.0 → 0.2-0.8)
function similarityToOpacity(similarity: number): number {
    if (similarity >= 0.95) return 0.8  // Very strong
    if (similarity >= 0.85) return 0.6  // Strong
    if (similarity >= 0.75) return 0.4  // Moderate
    return 0.2  // Weak
}

// Map similarity to line width
function similarityToLineWidth(similarity: number): number {
    if (similarity >= 0.95) return 2.5
    if (similarity >= 0.85) return 2.0
    if (similarity >= 0.75) return 1.5
    return 1.0
}

// Blend two hex colors
function blendColors(color1: string, color2: string): string {
    const c1 = new THREE.Color(color1)
    const c2 = new THREE.Color(color2)
    const blended = new THREE.Color()
    blended.r = (c1.r + c2.r) / 2
    blended.g = (c1.g + c2.g) / 2
    blended.b = (c1.b + c2.b) / 2
    return `#${blended.getHexString()}`
}

interface Connection {
    id: string
    start: [number, number, number]
    end: [number, number, number]
    color: string
    opacity: number
    lineWidth: number
}

export function ConstellationLines() {
    const stars = useGalaxyStore(state => state.stars)

    const connections = useMemo(() => {
        const lines: Connection[] = []
        const threshold = 0.7 // Raised from 0.5 to show only meaningful connections

        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const starA = stars[i]
                const starB = stars[j]

                // Skip if either star lacks an embedding
                if (!starA.embedding || !starB.embedding) continue

                const similarity = cosineSimilarity(starA.embedding, starB.embedding)

                if (similarity > threshold) {
                    lines.push({
                        id: `${starA.id}-${starB.id}`,
                        start: starA.position,
                        end: starB.position,
                        color: blendColors(starA.color, starB.color),
                        opacity: similarityToOpacity(similarity),
                        lineWidth: similarityToLineWidth(similarity)
                    })
                }
            }
        }
        return lines
    }, [stars])

    return (
        <group>
            {connections.map(conn => (
                <Line
                    key={conn.id}
                    points={[conn.start, conn.end]}
                    color={conn.color}
                    lineWidth={conn.lineWidth}
                    opacity={conn.opacity}
                    transparent
                />
            ))}
        </group>
    )
}
