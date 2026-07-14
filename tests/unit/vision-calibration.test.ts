/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: TDD verification of vision calibration formulas and FSM transitions prior to implementation.

import { describe, expect, it } from "vitest";
import {
  computeWristVelocity,
  convertNormalizedToPixel,
  evaluatePunchState,
  PunchState,
  type Point2D,
} from "@/lib/vision-calibration";
import { APP_CONFIG } from "@/config/app.config";

describe("Vision Calibration Unit Tests", () => {
  it("should convert normalized coordinates to pixel coordinates accurately", () => {
    const pt: Point2D = convertNormalizedToPixel(0.5, 0.25, 640, 480);
    expect(pt.x).toBe(320);
    expect(pt.y).toBe(120);
  });

  it("should compute exponential moving average velocity cleanly without lag", () => {
    const prev: Point2D = { x: 100, y: 100 };
    const curr: Point2D = { x: 130, y: 140 };
    const dt = 0.016; // ~60 FPS
    const alpha = APP_CONFIG.calibration.velocitySmoothingAlpha;
    const speed = computeWristVelocity(curr, prev, dt, alpha, 100);
    expect(speed).toBeGreaterThan(100);
  });

  it("should decay velocity cleanly when hand is not detected", () => {
    const dt = 0.016;
    const alpha = 0.68;
    const speed = computeWristVelocity(null, null, dt, alpha, 500);
    expect(speed).toBeLessThan(500);
  });

  it("should transition from IDLE to LAUNCH when speed exceeds threshold", () => {
    const transition = evaluatePunchState(1200, PunchState.IDLE, 0, 1150, true);
    expect(transition.nextState).toBe(PunchState.LAUNCH);
    expect(transition.peakSpeed).toBe(1200);
  });

  it("should transition from LAUNCH to COOLDOWN when speed drops below 60% of threshold and emit event", () => {
    const transition = evaluatePunchState(600, PunchState.LAUNCH, 1400, 1150, true);
    expect(transition.nextState).toBe(PunchState.COOLDOWN);
    expect(transition.emittedEvent).toEqual({ type: "punch", peakSpeed: 1400 });
  });

  it("should return to IDLE when cooldown has expired", () => {
    const transition = evaluatePunchState(100, PunchState.COOLDOWN, 0, 1150, true);
    expect(transition.nextState).toBe(PunchState.IDLE);
    expect(transition.peakSpeed).toBe(0);
  });
});
