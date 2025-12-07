import { type ReactNode } from "react";

interface PokedexFrameProps {
  children: ReactNode;
}

export function PokedexFrame({ children }: PokedexFrameProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      
      <div className="w-full max-w-5xl max-h-3xl bg-primary rounded-3xl pokedex-shadow p-4 md:p-6">
        
        {/* Top decorations */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-pokedex-blue border-4 border-secondary animate-pulse-glow shadow-lg" />
          <div className="flex gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-400" />
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-400" />
          </div>
        </div>

        {/* Main screen area */}
        <div className="bg-secondary rounded-2xl p-3 md:p-4">
          <div className="bg-pokedex-screen rounded-xl p-4 screen-scanlines lcd-glow">
            {children}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between mt-4 w-full">

          {/* Analog (Left) */}
          <div className="flex justify-start flex-1 ms-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary border-4 border-muted" />
          </div>

          {/* Start + Select (Center) */}
          <div className="flex justify-center flex-1 gap-3">
            <div className="w-8 h-3 md:w-10 md:h-4 bg-pokedex-dark-red rounded-full" />
            <div className="w-8 h-3 md:w-10 md:h-4 bg-pokedex-dark-red rounded-full" />
          </div>

          {/* D-Pad (Right) */}
          <div className="flex justify-end flex-1 me-4">
            <div className="grid grid-cols-3 gap-1">
              <div />
              <div className="w-4 h-4 md:w-5 md:h-5 bg-secondary rounded" />
              <div />
              <div className="w-4 h-4 md:w-5 md:h-5 bg-secondary rounded" />
              <div className="w-4 h-4 md:w-5 md:h-5 bg-secondary rounded" />
              <div className="w-4 h-4 md:w-5 md:h-5 bg-secondary rounded" />
              <div />
              <div className="w-4 h-4 md:w-5 md:h-5 bg-secondary rounded" />
              <div />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
