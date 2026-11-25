/**
 * components/loader/RunnerLegs.tsx — SVG sprinting legs animation.
 *
 * Purpose: Renders a stylised pair of running legs (thigh + shin + foot per leg)
 * drawn as simple confident strokes. Each segment is drawn starting at its pivot
 * point (local 0,0) and positioned via wrapper <g> transforms, making GSAP
 * rotation around hip/knee trivial with transformOrigin: "0 0".
 *
 * Props:
 *   - containerRef: ref to the parent for GSAP scoping
 *   - timelineRef: mutable ref that receives the run-cycle timeline (so parent
 *     can control timeScale)
 *
 * Connected to: Loader.tsx (parent), motion.config.ts (tunables)
 *
 * Tweakables: Stroke width, segment lengths, rotation ranges, and stride duration
 * are in LOADER config or tunable here via constants.
 */

"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LOADER, COLORS } from "@/lib/motion.config";

// ─── Segment lengths (px in SVG viewBox coordinates) ─────────────────────────
const THIGH_LEN = 38;
const SHIN_LEN = 36;
const FOOT_LEN = 12;
const STROKE_W = 5;
const HIP_Y = 0; // hip is at local 0,0 of the runner group

export interface RunnerLegsHandle {
  timeline: gsap.core.Timeline | null;
}

export const RunnerLegs = forwardRef<RunnerLegsHandle>(function RunnerLegs(_, ref) {
  const svgRef = useRef<SVGGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Expose the timeline so the parent can adjust timeScale
  useImperativeHandle(ref, () => ({
    get timeline() {
      return tlRef.current;
    },
  }));

  useGSAP(
    () => {
      if (!svgRef.current) return;

      const leftThigh = svgRef.current.querySelector("[data-left-thigh]") as SVGGElement;
      const leftShin = svgRef.current.querySelector("[data-left-shin]") as SVGGElement;
      const leftFoot = svgRef.current.querySelector("[data-left-foot]") as SVGGElement;
      const rightThigh = svgRef.current.querySelector("[data-right-thigh]") as SVGGElement;
      const rightShin = svgRef.current.querySelector("[data-right-shin]") as SVGGElement;
      const rightFoot = svgRef.current.querySelector("[data-right-foot]") as SVGGElement;
      const bobGroup = svgRef.current.querySelector("[data-bob]") as SVGGElement;

      if (!leftThigh || !rightThigh) return;

      // Set transformOrigin at pivot (0,0) for all rotating groups
      gsap.set(
        [leftThigh, leftShin, leftFoot, rightThigh, rightShin, rightFoot],
        { transformOrigin: "0 0" }
      );

      const half = LOADER.strideDuration / 2;
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "sine.inOut" },
      });

      // ── Left leg keyframes ─────────────────────────────────────────────
      // Thigh: -35° (back) ↔ +55° (forward drive)
      tl.fromTo(leftThigh, { rotation: -35 }, { rotation: 55, duration: half }, 0);
      tl.fromTo(leftThigh, { rotation: 55 }, { rotation: -35, duration: half }, half);

      // Shin: 0° on drive, -105° on recovery
      tl.fromTo(leftShin, { rotation: -105 }, { rotation: 0, duration: half }, 0);
      tl.fromTo(leftShin, { rotation: 0 }, { rotation: -105, duration: half }, half);

      // Foot: ±15° flick
      tl.fromTo(leftFoot, { rotation: 15 }, { rotation: -15, duration: half }, 0);
      tl.fromTo(leftFoot, { rotation: -15 }, { rotation: 15, duration: half }, half);

      // ── Right leg keyframes (offset by half cycle) ─────────────────────
      tl.fromTo(rightThigh, { rotation: 55 }, { rotation: -35, duration: half }, 0);
      tl.fromTo(rightThigh, { rotation: -35 }, { rotation: 55, duration: half }, half);

      tl.fromTo(rightShin, { rotation: 0 }, { rotation: -105, duration: half }, 0);
      tl.fromTo(rightShin, { rotation: -105 }, { rotation: 0, duration: half }, half);

      tl.fromTo(rightFoot, { rotation: -15 }, { rotation: 15, duration: half }, 0);
      tl.fromTo(rightFoot, { rotation: 15 }, { rotation: -15, duration: half }, half);

      // ── Vertical bob (double stride frequency = period of half strideDuration) ──
      if (bobGroup) {
        gsap.to(bobGroup, {
          y: -LOADER.bobAmplitude,
          duration: LOADER.strideDuration / 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      tlRef.current = tl;
    },
    { scope: svgRef }
  );

  const stroke = COLORS.accent;

  return (
    <g ref={svgRef}>
      <g data-bob>
        {/* ── Left leg ──────────────────────────────────────────── */}
        <g data-left-thigh transform={`translate(0, ${HIP_Y})`}>
          <line
            x1={0} y1={0} x2={0} y2={THIGH_LEN}
            stroke={stroke} strokeWidth={STROKE_W} strokeLinecap="round"
          />
          {/* Knee joint → shin */}
          <g data-left-shin transform={`translate(0, ${THIGH_LEN})`}>
            <line
              x1={0} y1={0} x2={0} y2={SHIN_LEN}
              stroke={stroke} strokeWidth={STROKE_W - 1} strokeLinecap="round"
            />
            {/* Ankle → foot */}
            <g data-left-foot transform={`translate(0, ${SHIN_LEN})`}>
              <line
                x1={0} y1={0} x2={FOOT_LEN} y2={0}
                stroke={stroke} strokeWidth={STROKE_W - 2} strokeLinecap="round"
              />
            </g>
          </g>
        </g>

        {/* ── Right leg ─────────────────────────────────────────── */}
        <g data-right-thigh transform={`translate(0, ${HIP_Y})`}>
          <line
            x1={0} y1={0} x2={0} y2={THIGH_LEN}
            stroke={stroke} strokeWidth={STROKE_W} strokeLinecap="round"
            opacity={0.7}
          />
          <g data-right-shin transform={`translate(0, ${THIGH_LEN})`}>
            <line
              x1={0} y1={0} x2={0} y2={SHIN_LEN}
              stroke={stroke} strokeWidth={STROKE_W - 1} strokeLinecap="round"
              opacity={0.7}
            />
            <g data-right-foot transform={`translate(0, ${SHIN_LEN})`}>
              <line
                x1={0} y1={0} x2={FOOT_LEN} y2={0}
                stroke={stroke} strokeWidth={STROKE_W - 2} strokeLinecap="round"
                opacity={0.7}
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
});
