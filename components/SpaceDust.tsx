import { Sparkles } from '@react-three/drei'

export function SpaceDust() {
    return (
        <Sparkles
            count={2000}
            scale={50}
            size={2}
            speed={0.2}
            opacity={0.3}
            color="#ffffff"
        />
    )
}
