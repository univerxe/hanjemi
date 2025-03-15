import { cn } from "@/lib/utils"
import Image from "next/image"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-10 w-10 overflow-hidden rounded-md">
        {/* Logo image */}
        <Image 
          src="/logo_dark.png" 
          alt="Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">HanJaemi 한재미</h1>
    </div>
  )
}

