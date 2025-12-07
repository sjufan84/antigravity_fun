import { GalaxyScene } from '@/components/GalaxyScene'
import { InterfaceOverlay } from '@/components/InterfaceOverlay'

export default function Home() {
  return (
    <main className="w-full h-screen relative overflow-hidden bg-black">
      <GalaxyScene />
      <InterfaceOverlay />
    </main>
  )
}
