import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-10 w-10 overflow-hidden rounded-md">
        {/* Replace with your actual logo */}
        <div className="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground font-bold text-xl">
          H
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">HanJaemi</h1>
    </div>
  )
}

