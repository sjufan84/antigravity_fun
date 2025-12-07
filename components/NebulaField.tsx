'use client'

import { useGalaxyStore } from '@/store/useGalaxyStore'
import { Cloud, Text } from '@react-three/drei'
import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { synthesizeCluster } from '@/app/actions'

interface Cluster {
    id: string
    position: [number, number, number]
    stars: string[] // star IDs
    starContents: string[]
    color: string
}

const GRID_SIZE = 12 // Check for stars within 12 units (Stricter clustering)

export function NebulaField() {
    const stars = useGalaxyStore(state => state.stars)
    const setSynthesisResult = useGalaxyStore(state => state.setSynthesisResult)
    const setIsSynthesizing = useGalaxyStore(state => state.setIsSynthesizing)
    const showNebula = useGalaxyStore(state => state.showNebula)

    const [hoveredCluster, setHoveredCluster] = useState<string | null>(null)

    // Simple grid-based clustering
    const clusters = useMemo(() => {
        if (!showNebula) return [] // Hide clouds if toggled off

        const grid: Record<string, { stars: typeof stars, colorSum: number[] }> = {}

        stars.forEach(star => {
            // Quantize position to grid
            const gx = Math.floor(star.position[0] / GRID_SIZE)
            const gy = Math.floor(star.position[1] / GRID_SIZE)
            const gz = Math.floor(star.position[2] / GRID_SIZE)
            const key = `${gx},${gy},${gz}`

            if (!grid[key]) {
                grid[key] = { stars: [], colorSum: [0, 0, 0] }
            }
            grid[key].stars.push(star)

            // Accumulate color for averaging
            const color = new THREE.Color(star.color)
            grid[key].colorSum[0] += color.r
            grid[key].colorSum[1] += color.g
            grid[key].colorSum[2] += color.b
        })

        const result: Cluster[] = []

        Object.entries(grid).forEach(([key, data]) => {
            // Only make a unique cloud if enough stars are present
            // Threshold: 3 stars (More robust connections)
            if (data.stars.length >= 3) {
                const count = data.stars.length

                // Average position
                const avgPos = data.stars.reduce(
                    (acc, s) => [acc[0] + s.position[0], acc[1] + s.position[1], acc[2] + s.position[2]],
                    [0, 0, 0]
                ).map(v => v / count) as [number, number, number]

                // Average color
                const avgColor = new THREE.Color(
                    data.colorSum[0] / count,
                    data.colorSum[1] / count,
                    data.colorSum[2] / count
                ).getStyle()

                result.push({
                    id: `cluster-${key}`,
                    position: avgPos,
                    stars: data.stars.map(s => s.id),
                    starContents: data.stars.map(s => s.content),
                    color: avgColor
                })
            }
        })

        return result
    }, [stars, showNebula])

    const synthesisCache = useGalaxyStore(state => state.synthesisCache)
    const addToSynthesisCache = useGalaxyStore(state => state.addToSynthesisCache)

    const handleClusterClick = async (cluster: Cluster) => {
        console.log("Synthesizing cluster:", cluster.id)

        // Caching Logic
        const starIds = cluster.stars.slice().sort().join(',')

        if (synthesisCache[starIds]) {
            console.log("Found cached synthesis")
            setSynthesisResult({
                ...synthesisCache[starIds],
                stars: cluster.stars // Ensure we pass current star IDs
            })
            return
        }

        setIsSynthesizing(true)
        setSynthesisResult(null) // Reset previous

        // Optimistic/Loading UI handled by setIsSynthesizing
        // We rely on InterfaceOverlay to show the waiting state

        try {
            const result = await synthesizeCluster(cluster.starContents)

            // Save to Cache
            addToSynthesisCache(starIds, result)

            // Set Result with star IDs
            setSynthesisResult({
                ...result,
                stars: cluster.stars
            })
        } catch (e) {
            console.error(e)
            setSynthesisResult({ name: "Error", description: "Failed to synthesize constellation.", stars: [] })
        } finally {
            setIsSynthesizing(false)
        }
    }

    return (
        <group>
            {clusters.map(cluster => (
                <group key={cluster.id} position={cluster.position}>
                    {/* Interactive invisible box for better click targeting */}
                    <mesh

                        onClick={(e) => {
                            e.stopPropagation()
                            handleClusterClick(cluster)
                        }}
                        onPointerOver={() => setHoveredCluster(cluster.id)}
                        onPointerOut={() => setHoveredCluster(null)}
                    >
                        <boxGeometry args={[12, 12, 12]} />
                        <meshBasicMaterial transparent opacity={0.1} depthWrite={false} color={cluster.color} visible={hoveredCluster === cluster.id} />
                    </mesh>

                    {/* The Cloud Visual */}
                    <Cloud
                        opacity={0.5}
                        speed={0.1} // Slow rotation
                        bounds={[12, 8, 12]}
                        segments={15} // Particles
                        color={cluster.color}
                    />

                    {/* Hover Label */}
                    {hoveredCluster === cluster.id && (
                        <Text
                            position={[0, 8, 0]}
                            fontSize={2}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.1}
                            outlineColor="black"
                        >
                            Nebula Group
                        </Text>
                    )}
                </group>
            ))}
        </group>
    )
}
