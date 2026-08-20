import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function writeStrict(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 20) {
    console.warn(`WARNING: ${filePath} has ${lines.length} lines!`);
  }
  fs.writeFileSync(filePath, trimmed, 'utf8');
}

// -------------------------------------------------------------
// 1. CAROUSEL
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/components/ui/carousel/carouselTypes.ts'), `
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";

export type CarouselApi = UseEmblaCarouselType[1];
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = UseCarouselParameters[1];
export type CarouselProps = {
  opts?: CarouselOptions; plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical"; setApi?: (api: CarouselApi) => void;
};
export type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]; api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void; scrollNext: () => void; canScrollPrev: boolean; canScrollNext: boolean;
} & CarouselProps;
`);

writeStrict(path.join(root, 'src/components/ui/carousel/carouselContext.tsx'), `
import * as React from "react";
import type { CarouselContextProps } from "./carouselTypes";

export const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}
`);

writeStrict(path.join(root, 'src/components/ui/carousel/useCarouselHandlers.ts'), `
import * as React from "react";
import type { CarouselApi } from "./carouselTypes";

export function useCarouselHandlers(api: CarouselApi) {
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const onSelect = React.useCallback((a: CarouselApi) => { if (!a) return; setCanScrollPrev(a.canScrollPrev()); setCanScrollNext(a.canScrollNext()); }, []);
  const scrollPrev = React.useCallback(() => { api?.scrollPrev(); }, [api]);
  const scrollNext = React.useCallback(() => { api?.scrollNext(); }, [api]);
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollPrev(); } else if (e.key === "ArrowRight") { e.preventDefault(); scrollNext(); }
  }, [scrollPrev, scrollNext]);
  return { canScrollPrev, canScrollNext, onSelect, scrollPrev, scrollNext, handleKeyDown };
}
`);

writeStrict(path.join(root, 'src/components/ui/carousel/carouselRoot.tsx'), `
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import type { CarouselProps } from "./carouselTypes";
import { CarouselContext } from "./carouselContext";
import { useCarouselHandlers } from "./useCarouselHandlers";

export const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel({ ...opts, axis: orientation === "horizontal" ? "x" : "y" }, plugins);
    const { canScrollPrev, canScrollNext, onSelect, scrollPrev, scrollNext, handleKeyDown } = useCarouselHandlers(api);
    React.useEffect(() => { if (!api || !setApi) return; setApi(api); }, [api, setApi]);
    React.useEffect(() => { if (!api) return; onSelect(api); api.on("reInit", onSelect); api.on("select", onSelect); return () => { api?.off("select", onSelect); }; }, [api, onSelect]);
    return (
      <CarouselContext.Provider value={{ carouselRef, api, opts, orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"), scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
        <div ref={ref} onKeyDownCapture={handleKeyDown} className={cn("relative", className)} role="region" aria-roledescription="carousel" {...props}>{children}</div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";
`);

writeStrict(path.join(root, 'src/components/ui/carousel/carouselContentItem.tsx'), `
import * as React from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carouselContext";

export const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)} {...props} />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (<div ref={ref} role="group" aria-roledescription="slide" className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)} {...props} />);
});
CarouselItem.displayName = "CarouselItem";
`);

writeStrict(path.join(root, 'src/components/ui/carousel/carouselButtons.tsx'), `
import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCarousel } from "./carouselContext";

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button ref={ref} variant={variant} size={size} className={cn("absolute h-8 w-8 rounded-full", orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className)} disabled={!canScrollPrev} onClick={scrollPrev} {...props}><ArrowLeft className="h-4 w-4" /><span className="sr-only">Previous slide</span></Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button ref={ref} variant={variant} size={size} className={cn("absolute h-8 w-8 rounded-full", orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className)} disabled={!canScrollNext} onClick={scrollNext} {...props}><ArrowRight className="h-4 w-4" /><span className="sr-only">Next slide</span></Button>
  );
});
CarouselNext.displayName = "CarouselNext";
`);

writeStrict(path.join(root, 'src/components/ui/carousel.tsx'), `
export type { CarouselApi, CarouselProps } from "./carousel/carouselTypes";
export { CarouselContext, useCarousel } from "./carousel/carouselContext";
export { Carousel } from "./carousel/carouselRoot";
export { CarouselContent, CarouselItem } from "./carousel/carouselContentItem";
export { CarouselPrevious, CarouselNext } from "./carousel/carouselButtons";
`);

console.log('Modularized carousel.tsx successfully!');
