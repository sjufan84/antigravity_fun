import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { useGalaxyStore } from '@/store/useGalaxyStore'
import * as THREE from 'three'

// Helper to calculate cosine similarity
// Since our mock vectors are roughly unit length, dot product is a good enough proxy for now.
// For real embeddings, ensure you normalize them first.
function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
}

export function ConstellationLines() {
    const stars = useGalaxyStore(state => state.stars)

    const connections = useMemo(() => {
        const lines: { start: [number, number, number], end: [number, number, number], id: string }[] = []
        const threshold = 0.5 // Lowered threshold to allow more organic connections

        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const starA = stars[i]
                const starB = stars[j]

                // Skip if either star lacks an embedding (legacy stars etc)
                if (!starA.embedding || !starB.embedding) continue

                const similarity = cosineSimilarity(starA.embedding, starB.embedding)

                if (similarity > threshold) {
                    lines.push({
                        id: `${starA.id}-${starB.id}`,
                        start: starA.position,
                        end: starB.position
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
                    color="rgba(200, 200, 255, 0.2)"
                    lineWidth={1}
                    dashed={true}
                    dashScale={2}
                    dashSize={1}
                    gapSize={2}
                    opacity={0.3}
                    transparent
                />
            ))}
        </group>
    )
}
