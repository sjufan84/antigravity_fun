'use client'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Star, useGalaxyStore } from '@/store/useGalaxyStore'

export function StarNode({ id, position, content, color }: Star) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHover] = useState(false)
    const setActiveStar = useGalaxyStore(state => state.setActiveStar)

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2
            meshRef.current.rotation.y += delta * 0.2
        }
    })

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={(e) => { e.stopPropagation(); setActiveStar(id) }}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
            onPointerOut={() => setHover(false)}
            scale={hovered ? 1.5 : 1}
        >
            <icosahedronGeometry args={[0.5, 1]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 1} wireframe={!hovered} />
            {hovered && (
                <Html distanceFactor={10}>
                    <div className="bg-black/80 text-cyan-400 p-3 rounded-lg border border-cyan-500/50 whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.3)] select-none">
                        {content}
                    </div>
                </Html>
            )}
        </mesh>
    )
}
