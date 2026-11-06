"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import "./blurred-marquee.css";

export type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

/**
 * Measures an element with ResizeObserver. Stands in for react-use-measure so the
 * marquee needs no extra dependency, and uses useEffect so server rendering
 * (the node test runner) never trips a useLayoutEffect warning.
 */
function useElementSize<T extends HTMLElement>(): [
  React.RefObject<T>,
  { width: number; height: number },
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}

type InfiniteSliderProps = {
  /** One repeat unit — the slider clones it until the row overflows. */
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  /** Scroll rightwards instead of leftwards. */
  reverse?: boolean;
  className?: string;
  /** Decorative row: excluded from the accessibility tree entirely. */
  decorative?: boolean;
};

const InfiniteSlider = memo(function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  reverse = false,
  className,
  decorative = false,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [sliderRef, { width: sliderWidth }] = useElementSize<HTMLDivElement>();
  const [unitRef, { width: unitWidth }] = useElementSize<HTMLDivElement>();
  const inView = useInView(sliderRef, { amount: 0 });
  const reducedMotion = useReducedMotion();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  // Distance one repeat unit travels before the loop restarts: the unit's own
  // width plus the track gap that separates it from the next copy.
  const period = unitWidth + gap;
  // Enough copies that the row stays fully covered through the whole travel:
  // after moving one period, (copies - 1) periods of content must still remain,
  // so no empty space can ever appear on either edge.
  const copies =
    sliderWidth > 0 && period > 0
      ? Math.max(2, Math.ceil((sliderWidth + gap) / period) + 1)
      : 2;

  useEffect(() => {
    // Reduced motion and offscreen states stay static instead of looping.
    if (reducedMotion || !inView) return;
    if (period <= 0) return;
    const from = reverse ? -period : 0;
    const to = reverse ? 0 : -period;

    let controls;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration * Math.abs((translation.get() - to) / period),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => translation.set(from),
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentDuration,
    period,
    gap,
    isTransitioning,
    reverse,
    reducedMotion,
    inView,
  ]);

  const hoverProps =
    durationOnHover && !reducedMotion
      ? {
          onHoverStart: () => {
            setIsTransitioning(true);
            setCurrentDuration(durationOnHover);
          },
          onHoverEnd: () => {
            setIsTransitioning(true);
            setCurrentDuration(duration);
          },
        }
      : {};

  return (
    <div
      ref={sliderRef}
      className={cn("bm-slider", className)}
      data-direction={reverse ? "right" : "left"}
      aria-hidden={decorative || undefined}
    >
      <motion.div
        className="bm-track"
        style={{ x: translation, gap: `${gap}px` }}
        {...hoverProps}
      >
        {Array.from({ length: copies }).map((_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? unitRef : undefined}
            className="bm-unit"
            style={{ gap: `${gap}px` }}
            aria-hidden={copy > 0 || decorative || undefined}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
});

const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 };

type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  blurIntensity?: number;
  className?: string;
} & HTMLMotionProps<"div">;

const ProgressiveBlur = memo(function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  blurIntensity = 0.25,
  className,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);
  const angle = GRADIENT_ANGLES[direction];

  return (
    <div className={cn("bm-blur", className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ]
          .map(
            (pos, posIndex) =>
              `rgba(255,255,255,${
                posIndex === 1 || posIndex === 2 ? 1 : 0
              }) ${pos * 100}%`,
          )
          .join(", ");

        const gradient = `linear-gradient(${angle}deg, ${gradientStops})`;

        return (
          <motion.div
            key={index}
            className="bm-blur-layer"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
});

const LogoImage = memo(function LogoImage({ logo }: { logo: Logo }) {
  if (!logo.src) {
    return <span className="bm-logo-text">{logo.alt}</span>;
  }

  return (
    <img
      className="bm-logo"
      src={logo.src}
      alt={logo.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      width={logo.width}
      height={logo.height}
      onError={(event) => { event.currentTarget.hidden = true; }}
    />
  );
});

export const BlurredMarquee = memo(function BlurredMarquee({
  logos,
  className,
}: {
  logos: Logo[];
  className?: string;
}) {
  if (logos.length === 0) return null;

  // The second row runs the same tools rotated half a list, so identical logos
  // never sit vertically on top of each other at rest.
  const half = Math.ceil(logos.length / 2);
  const shifted = [...logos.slice(half), ...logos.slice(0, half)];
  const row = (items: Logo[]) =>
    items.map((logo) => <LogoImage key={logo.alt} logo={logo} />);

  return (
    <div className={cn("bm-root", className)}>
      <span className="bm-rule bm-rule-top" aria-hidden="true" />

      <InfiniteSlider gap={52} reverse duration={60} durationOnHover={20}>
        {row(logos)}
      </InfiniteSlider>

      <InfiniteSlider gap={52} duration={60} durationOnHover={20} decorative>
        {row(shifted)}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="bm-blur-edge bm-blur-left"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="bm-blur-edge bm-blur-right"
        direction="right"
      />

      <span className="bm-rule bm-rule-bottom" aria-hidden="true" />

      <PlusIcon
        className="bm-plus bm-plus-tr"
        strokeWidth={1}
        aria-hidden="true"
      />
      <PlusIcon
        className="bm-plus bm-plus-bl"
        strokeWidth={1}
        aria-hidden="true"
      />
    </div>
  );
});

BlurredMarquee.displayName = "BlurredMarquee";
export default BlurredMarquee;
