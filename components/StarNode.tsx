import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Star, useGalaxyStore } from '@/store/useGalaxyStore'
import { incrementStarVisits } from '@/app/actions'
import { galaxySynth } from '@/lib/audio'

export function StarNode({ id, position, content, color, visits, category }: Star) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHover] = useState(false)
    const setActiveStar = useGalaxyStore(state => state.setActiveStar)
    const incrementVisits = useGalaxyStore(state => state.incrementVisits)

    // Base scale calculated from visits
    const baseScale = 1 + Math.log(visits + 1) * 0.5

    // Random offset so they don't all pulse in sync
    const timeOffset = useRef(Math.random() * 100)

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2
            meshRef.current.rotation.y += delta * 0.2

            // Breathing animation
            // Speed increases slightly with visits (capped)
            const speed = 1.5 + Math.min(visits * 0.1, 2)
            const time = state.clock.elapsedTime + timeOffset.current

            // Gentle scale oscillation
            const breathingScale = baseScale * (1 + Math.sin(time * speed) * 0.05)
            // Apply scale (hover overrides breathing)
            const finalScale = hovered ? baseScale * 1.5 : breathingScale
            meshRef.current.scale.setScalar(finalScale)

            // Pulse emissive intensity
            // Material is accessed via the mesh's material property
            const material = meshRef.current.material as THREE.MeshStandardMaterial
            if (material) {
                const pulse = 1 + Math.sin(time * speed) * 0.5
                material.emissiveIntensity = hovered ? 2 : 0.5 + pulse * 0.5
            }
        }
    })

    const handleClick = (e: any) => {
        e.stopPropagation()
        setActiveStar(id)
        incrementVisits(id)
        incrementStarVisits(id) // Server action
        galaxySynth.playStarSound(category, visits, position)
        triggerEcho()
    }

    // Visual Echo Logic
    const [echoes, setEchoes] = useState<{ id: number, time: number }[]>([])

    const triggerEcho = () => {
        setEchoes(prev => [...prev, { id: Date.now(), time: 0 }])
    }

    // Cleanup old echoes
    useFrame((state, delta) => {
        if (echoes.length > 0) {
            setEchoes(prev => prev.filter(e => Date.now() - e.id < 1000))
        }

        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2
            meshRef.current.rotation.y += delta * 0.2

            // Breathing animation
            // Speed increases slightly with visits (capped)
            const speed = 1.5 + Math.min(visits * 0.1, 2)
            const time = state.clock.elapsedTime + timeOffset.current

            // Gentle scale oscillation
            const breathingScale = baseScale * (1 + Math.sin(time * speed) * 0.05)
            // Apply scale (hover overrides breathing)
            const finalScale = hovered ? baseScale * 1.5 : breathingScale
            meshRef.current.scale.setScalar(finalScale)

            // Pulse emissive intensity
            // Material is accessed via the mesh's material property
            const material = meshRef.current.material as THREE.MeshStandardMaterial
            if (material) {
                const pulse = 1 + Math.sin(time * speed) * 0.5
                material.emissiveIntensity = hovered ? 2 : 0.5 + pulse * 0.5
            }
        }
    })

    return (
        <group>
            <mesh
                ref={meshRef}
                position={position}
                onClick={handleClick}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHover(true)
                    galaxySynth.playHoverSound()
                }}
                onPointerOut={() => setHover(false)}
            // scale is handled in useFrame now
            >
                <icosahedronGeometry args={[0.5, 1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 1} wireframe={!hovered} />
                {hovered && (
                    <Html distanceFactor={8} position={[0, 1.5, 0]}>
                        <div className="bg-slate-950/90 text-cyan-200 p-4 rounded-xl border border-cyan-400/50 whitespace-nowrap backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.3)] select-none pointer-events-none transform -translate-x-1/2 -translate-y-[20px]">
                            <div className="text-xs text-cyan-400/80 mb-2 flex items-center gap-2 font-mono tracking-widest uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                {visits} visits
                            </div>
                            <div className="text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] max-w-[300px] overflow-hidden text-ellipsis">
                                {content}
                            </div>
                        </div>
                    </Html>
                )}
            </mesh>
            {echoes.map(echo => (
                <VisualEcho key={echo.id} position={position} color={color} />
            ))}
        </group>
    )
}

function VisualEcho({ position, color }: { position: [number, number, number], color: string }) {
    const ref = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        if (ref.current) {
            const material = ref.current.material as THREE.MeshBasicMaterial
            ref.current.scale.multiplyScalar(1.0 + delta * 5)
            material.opacity = Math.max(0, material.opacity - delta * 1.5)
        }
    })

    return (
        <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 0.9, 32]} />
            <meshBasicMaterial color={color} transparent opacity={1} side={THREE.DoubleSide} />
        </mesh>
    )
}
