"use client";

import { appConfig } from "@unitforge/config";
import { cn } from "@unitforge/ui";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { SignInForm } from "./sign-in-form";

interface LampLoginShellProps {
  next?: string;
}

const CORD_PULL_THRESHOLD = 56;
const MAX_CORD_PULL = 96;

export function LampLoginShell({ next }: LampLoginShellProps) {
  const [isLampOn, setIsLampOn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cordOffset, setCordOffset] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const latestCordOffsetRef = useRef(0);

  useEffect(() => {
    latestCordOffsetRef.current = cordOffset;
  }, [cordOffset]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  }, []);

  const toggleLamp = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => undefined);
    }

    setIsLampOn((currentState) => !currentState);
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      if (dragStartYRef.current === null) {
        return;
      }

      const nextOffset = Math.max(0, Math.min(MAX_CORD_PULL, event.clientY - dragStartYRef.current));
      latestCordOffsetRef.current = nextOffset;
      setCordOffset(nextOffset);
    }

    function handlePointerRelease() {
      setIsDragging(false);
      dragStartYRef.current = null;

      const crossedThreshold = latestCordOffsetRef.current >= CORD_PULL_THRESHOLD;
      latestCordOffsetRef.current = 0;
      setCordOffset(0);

      if (crossedThreshold) {
        toggleLamp();
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerRelease);
    window.addEventListener("pointercancel", handlePointerRelease);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerRelease);
      window.removeEventListener("pointercancel", handlePointerRelease);
    };
  }, [isDragging, toggleLamp]);

  function handleCordPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    dragStartYRef.current = event.clientY;
    latestCordOffsetRef.current = 0;
    setIsDragging(true);
  }

  function handleCordClick(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail !== 0) {
      return;
    }

    setCordOffset(0);
    toggleLamp();
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#171a20] text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_32%),linear-gradient(180deg,#171a20_0%,#151921_56%,#12151b_100%)]" />
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isLampOn ? "opacity-100 delay-[70ms]" : "opacity-0 delay-0",
        )}
        style={{
          background:
            "radial-gradient(circle at 34% 31%, rgba(255, 242, 205, 0.18), transparent 9%), radial-gradient(circle at 35% 37%, rgba(242, 207, 119, 0.3), transparent 18%), radial-gradient(circle at 39% 44%, rgba(213, 159, 52, 0.16), transparent 34%), radial-gradient(circle at 48% 52%, rgba(199, 145, 51, 0.1), transparent 70%)",
        }}
      />
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isLampOn ? "opacity-100 delay-[140ms]" : "opacity-0 delay-0",
        )}
        style={{
          background:
            "radial-gradient(circle at 36% 41%, rgba(255, 237, 190, 0.1), transparent 22%), radial-gradient(circle at 60% 44%, rgba(226, 182, 89, 0.08), transparent 34%), radial-gradient(circle at 50% 72%, rgba(142, 96, 24, 0.08), transparent 30%), linear-gradient(180deg, rgba(49, 40, 24, 0.15), rgba(17, 21, 27, 0.03) 50%, rgba(17, 21, 27, 0))",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.02fr,0.88fr] lg:items-center lg:px-14">
        <div className="flex flex-col items-center justify-center gap-8 lg:items-start">
          <div className="space-y-4 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-stone-400/75">Protected access</p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-stone-100 sm:text-5xl">Light up the workspace.</h1>
              <p className="max-w-md text-sm leading-6 text-stone-400 sm:text-base">Reveal the Unitforge sign-in form.</p>
            </div>
          </div>

          <div className="relative flex h-[360px] w-full max-w-[420px] items-center justify-center sm:h-[420px]">
            <div
              className={cn(
                "absolute left-1/2 top-[82px] h-[232px] w-[232px] -translate-x-1/2 rounded-full blur-[62px] transition-all duration-[860ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-[100px] sm:h-[272px] sm:w-[272px]",
                isLampOn ? "bg-[#f8e7b4]/90 opacity-100 delay-[60ms]" : "bg-[#f8e7b4]/0 opacity-0 delay-0",
              )}
            />
            <div
              className={cn(
                "absolute left-1/2 top-[128px] h-[256px] w-[344px] -translate-x-1/2 rounded-full blur-[96px] transition-all duration-[980ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-[150px] sm:h-[312px] sm:w-[404px]",
                isLampOn ? "bg-[#d4a248]/32 opacity-100 delay-[120ms]" : "bg-[#d4a248]/0 opacity-0 delay-0",
              )}
            />
            <div
              className={cn(
                "absolute left-1/2 top-[156px] h-[236px] w-[296px] -translate-x-1/2 rounded-[50%] blur-[102px] transition-all duration-[1120ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:top-[188px] sm:h-[296px] sm:w-[356px]",
                isLampOn ? "bg-[#94661d]/18 opacity-100 delay-[180ms]" : "bg-[#94661d]/0 opacity-0 delay-0",
              )}
            />

            <div className="relative h-[280px] w-[260px] sm:h-[320px] sm:w-[300px]">
              <div
                className={cn(
                  "absolute left-1/2 top-0 h-[92px] w-[212px] -translate-x-1/2 rounded-[110px_110px_22px_22px] bg-[#f2eadc] shadow-[inset_0_-10px_24px_rgba(106,94,76,0.15)] transition-all duration-700 sm:h-[106px] sm:w-[234px]",
                  isLampOn && "shadow-[0_0_72px_rgba(246,224,168,0.35),inset_0_-10px_24px_rgba(106,94,76,0.12)]",
                )}
              />
              <div className="absolute left-1/2 top-[92px] h-[168px] w-7 -translate-x-1/2 rounded-full bg-[#d8d1c6] sm:top-[106px] sm:h-[192px]" />
              <div className="absolute left-1/2 top-[248px] h-5 w-[112px] -translate-x-1/2 rounded-full bg-[#d8d1c6] sm:top-[286px] sm:w-[126px]" />

              <div className="absolute left-1/2 top-[92px] translate-x-[50px] sm:top-[106px] sm:translate-x-[58px]">
                <div
                  className={cn(
                    "mx-auto w-px bg-stone-500/70",
                    isDragging
                      ? "transition-none"
                      : "transition-[height] duration-[620ms] ease-[cubic-bezier(0.18,0.94,0.28,1)]",
                  )}
                  style={{ height: `${96 + cordOffset}px` }}
                />
                <button
                  aria-describedby="lamp-cord-help"
                  aria-label={isLampOn ? "Turn lamp off" : "Turn lamp on"}
                  aria-pressed={isLampOn}
                  className={cn(
                    "absolute left-1/2 top-[96px] h-7 w-7 -translate-x-1/2 transform-gpu rounded-full bg-[#d8a15f] shadow-[0_10px_24px_rgba(0,0,0,0.35)] outline-none touch-none select-none",
                    isDragging
                      ? "transition-none"
                      : "transition-transform duration-[620ms] ease-[cubic-bezier(0.18,0.94,0.28,1.04)]",
                    "focus-visible:ring-2 focus-visible:ring-[#f0cf7a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#171a20]",
                  )}
                  style={{ transform: `translate(-50%, ${cordOffset}px)` }}
                  type="button"
                  onClick={handleCordClick}
                  onPointerDown={handleCordPointerDown}
                >
                  <span className="sr-only">Pull the lamp cord to reveal the sign-in form</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <SignInForm enabled={isLampOn} next={next} />
        </div>
      </div>

      <audio ref={audioRef} className="hidden" preload="auto" src="/sounds/lamp-toggle.wav" />
      <p className="sr-only" id="lamp-cord-help">
        Drag the cord down, or focus it and press Enter or Space to toggle the lamp.
      </p>
      <div className="pointer-events-none absolute left-6 top-6 text-xs font-medium uppercase tracking-[0.34em] text-stone-400/55 sm:left-10 sm:top-8 lg:left-14">
        {appConfig.name}
      </div>
    </section>
  );
}
