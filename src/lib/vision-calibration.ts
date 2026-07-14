/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement.
 */

// COMPLIANCE REQUIREMENT: All vision math functions must expose strictly typed interfaces and adhere to TDD specifications without inline implementation commentary.

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export enum PunchState {
  IDLE = "IDLE",
  LAUNCH = "LAUNCH",
  COOLDOWN = "COOLDOWN",
}

export interface PunchEvent {
  readonly type: "punch";
  readonly peakSpeed: number;
}

export interface PunchStateTransition {
  readonly nextState: PunchState;
  readonly peakSpeed: number;
  readonly emittedEvent: PunchEvent | null;
}

export function convertNormalizedToPixel(
  normX: number,
  normY: number,
  width: number,
  height: number,
): Point2D {
  return {
    x: Math.round(normX * width),
    y: Math.round(normY * height),
  };
}

export function computeWristVelocity(
  currentPos: Point2D | null,
  prevPos: Point2D | null,
  dtSeconds: number,
  alpha: number,
  prevSmoothed: number,
): number {
  if (currentPos === null) {
    return prevSmoothed * (1 - alpha);
  }
  if (prevPos === null || dtSeconds <= 0) {
    return 0;
  }
  const dx = currentPos.x - prevPos.x;
  const dy = currentPos.y - prevPos.y;
  const rawDistance = Math.hypot(dx, dy);
  const rawSpeed = rawDistance / Math.max(dtSeconds, 1e-3);
  return alpha * rawSpeed + (1 - alpha) * prevSmoothed;
}

export function evaluatePunchState(
  currentSpeed: number,
  state: PunchState,
  peakSpeed: number,
  threshold: number,
  isCooldownExpired: boolean,
): PunchStateTransition {
  if (state === PunchState.IDLE) {
    if (currentSpeed > threshold) {
      return {
        nextState: PunchState.LAUNCH,
        peakSpeed: currentSpeed,
        emittedEvent: null,
      };
    }
    return {
      nextState: PunchState.IDLE,
      peakSpeed: 0,
      emittedEvent: null,
    };
  }

  if (state === PunchState.LAUNCH) {
    const nextPeak = Math.max(peakSpeed, currentSpeed);
    if (currentSpeed < threshold * 0.6) {
      return {
        nextState: PunchState.COOLDOWN,
        peakSpeed: nextPeak,
        emittedEvent: { type: "punch", peakSpeed: nextPeak },
      };
    }
    return {
      nextState: PunchState.LAUNCH,
      peakSpeed: nextPeak,
      emittedEvent: null,
    };
  }

  if (state === PunchState.COOLDOWN) {
    if (isCooldownExpired) {
      return {
        nextState: PunchState.IDLE,
        peakSpeed: 0,
        emittedEvent: null,
      };
    }
    return {
      nextState: PunchState.COOLDOWN,
      peakSpeed: 0,
      emittedEvent: null,
    };
  }

  return {
    nextState: PunchState.IDLE,
    peakSpeed: 0,
    emittedEvent: null,
  };
}
