'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useGalaxyStore } from '@/store/useGalaxyStore'
import { StarNode } from './StarNode'

import { ConstellationLines } from './ConstellationLines'
import { CameraController } from './CameraController'

import { useEffect } from 'react'

export function GalaxyScene() {
    const stars = useGalaxyStore(state => state.stars)
    const loadStars = useGalaxyStore(state => state.loadStars)

    useEffect(() => {
        loadStars()
    }, [loadStars])

    return (
        <div className="absolute inset-0 z-0 bg-black w-full h-full">
            <Canvas camera={{ position: [0, 0, 22], fov: 60 }}>
                <color attach="background" args={['#02020a']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />

                <group>
                    <ConstellationLines />
                    {stars.map(star => (
                        <StarNode key={star.id} {...star} />
                    ))}
                </group>

                <OrbitControls enablePan={true} enableZoom={true} minDistance={5} maxDistance={50} makeDefault />
                <CameraController />
            </Canvas>
        </div>
    )
}
