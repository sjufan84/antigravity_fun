import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Star, useGalaxyStore } from '@/store/useGalaxyStore'
import { incrementStarVisits } from '@/app/actions'

export function StarNode({ id, position, content, color, visits }: Star) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHover] = useState(false)
    const setActiveStar = useGalaxyStore(state => state.setActiveStar)
    const incrementVisits = useGalaxyStore(state => state.incrementVisits)

    // Calculate scale based on visits. Base scale 1, max scale 3.
    // Logarithmic growth so it doesn't get huge too fast.
    const size = 1 + Math.log(visits + 1) * 0.5

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2
            meshRef.current.rotation.y += delta * 0.2
        }
    })

    const handleClick = (e: any) => {
        e.stopPropagation()
        setActiveStar(id)
        incrementVisits(id)
        incrementStarVisits(id) // Server action
    }

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={handleClick}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
            onPointerOut={() => setHover(false)}
            scale={hovered ? size * 1.5 : size}
        >
            <icosahedronGeometry args={[0.5, 1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 1} wireframe={!hovered} />
            {hovered && (
                <Html distanceFactor={10}>
                    <div className="bg-black/80 text-cyan-400 p-3 rounded-lg border border-cyan-500/50 whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.3)] select-none">
                        <div className="text-xs text-white/50 mb-1 flex items-center gap-2">
                            {visits} visits
                        </div>
                        {content}
                    </div>
                </Html>
            )}
        </mesh>
    )
}
