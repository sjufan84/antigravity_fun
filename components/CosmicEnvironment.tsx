'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export function CosmicEnvironment() {
    const nebulaRef = useRef<THREE.Points>(null)

    useFrame((state) => {
        if (nebulaRef.current) {
            nebulaRef.current.rotation.y += 0.0001
            nebulaRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
        }
    })

    return (
        <group>
            {/* Cosmic dust - distant sparkles */}
            <Sparkles
                count={200}
                scale={[60, 60, 60]}
                size={1.5}
                speed={0.1}
                opacity={0.3}
                color="#4a5568"
            />

            {/* Nebula clouds - closer, more vibrant */}
            <Sparkles
                ref={nebulaRef}
                count={100}
                scale={[40, 40, 40]}
                size={3}
                speed={0.05}
                opacity={0.2}
                color="#667eea"
            />

            {/* Cyan accent particles */}
            <Sparkles
                count={50}
                scale={[30, 30, 30]}
                size={2}
                speed={0.15}
                opacity={0.4}
                color="#00ffff"
            />
        </group>
    )
}
