'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useGalaxyStore } from '@/store/useGalaxyStore'
import * as THREE from 'three'
import { easing } from 'maath'

export function CameraController() {
    const { camera, controls } = useThree()
    const activeStarId = useGalaxyStore(state => state.activeStarId)
    const stars = useGalaxyStore(state => state.stars)

    useFrame((state, delta) => {
        const activeStar = stars.find(s => s.id === activeStarId)

        if (activeStar) {
            // Target position: slightly offset from the star to look at it
            // The star is at activeStar.position [x, y, z]
            // We want the camera to be close, say 2 units away on Z or similar vector

            const starPos = new THREE.Vector3(...activeStar.position)

            // Calculate a nice offset position. 
            // Simple approach: maintain current direction but move closer?
            // Or just fixed offset z+4?
            const targetCamPos = starPos.clone().add(new THREE.Vector3(0, 0, 8))

            // Smoothly move camera
            easing.damp3(camera.position, targetCamPos, 0.25, delta)

            // Smoothly make controls look at the star
            // @ts-ignore
            if (controls && 'target' in controls) {
                // @ts-ignore
                easing.damp3((controls as any).target, starPos, 0.25, delta)
            }
        } else {
            // When no star is selected, return focus to center of galaxy
            // This gives a sense of "zooming out" or "resetting" context
            // @ts-ignore
            if (controls && 'target' in controls) {
                // @ts-ignore
                easing.damp3((controls as any).target, [0, 0, 0], 0.5, delta)
            }
        }
    })

    return null
}
