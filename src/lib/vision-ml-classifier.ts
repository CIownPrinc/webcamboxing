/**
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement.
 */

// COMPLIANCE REQUIREMENT: Machine learning classifier functions must adhere strictly to declared TypeScript interfaces without inline implementation commentary.

export interface Landmark3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface KinematicFeatureVector {
  readonly velocityZ: number;
  readonly accelerationNorm: number;
  readonly extensionRatio: number;
  readonly elbowAngleDegrees: number;
  readonly handClosureMetric: number;
  readonly guardSymmetryScore: number;
  readonly horizontalTrajectoryVariance: number;
}

export enum PunchMLClass {
  IDLE = "IDLE",
  JAB = "JAB",
  CROSS = "CROSS",
  HOOK = "HOOK",
  UPPERCUT = "UPPERCUT",
  BLOCK = "BLOCK",
}

export interface PunchMLPrediction {
  readonly punchClass: PunchMLClass;
  readonly confidence: number;
  readonly isValidStrike: boolean;
  readonly rejectionReason?: string;
  readonly kineticImpactScore: number;
}

export function computeElbowAngle(
  shoulder: Landmark3D,
  elbow: Landmark3D,
  wrist: Landmark3D,
): number {
  const ux = shoulder.x - elbow.x;
  const uy = shoulder.y - elbow.y;
  const uz = shoulder.z - elbow.z;

  const vx = wrist.x - elbow.x;
  const vy = wrist.y - elbow.y;
  const vz = wrist.z - elbow.z;

  const dot = ux * vx + uy * vy + uz * vz;
  const normU = Math.hypot(ux, uy, uz);
  const normV = Math.hypot(vx, vy, vz);

  if (normU === 0 || normV === 0) {
    return 180;
  }

  const cosTheta = Math.max(-1, Math.min(1, dot / (normU * normV)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
}

export function computeHandClosure(wrist: Landmark3D, fingertips: readonly Landmark3D[]): number {
  if (fingertips.length === 0) {
    return 1.0;
  }
  let totalDist = 0;
  for (const tip of fingertips) {
    const dx = tip.x - wrist.x;
    const dy = tip.y - wrist.y;
    const dz = tip.z - wrist.z;
    totalDist += Math.hypot(dx, dy, dz);
  }
  return totalDist / fingertips.length;
}

export function extractKinematicFeatureVector(
  features: KinematicFeatureVector,
): KinematicFeatureVector {
  return {
    velocityZ: features.velocityZ,
    accelerationNorm: Math.max(0, features.accelerationNorm),
    extensionRatio: Math.max(0, Math.min(2, features.extensionRatio)),
    elbowAngleDegrees: Math.max(0, Math.min(180, features.elbowAngleDegrees)),
    handClosureMetric: Math.max(0, features.handClosureMetric),
    guardSymmetryScore: Math.max(0, Math.min(1, features.guardSymmetryScore)),
    horizontalTrajectoryVariance: Math.max(0, features.horizontalTrajectoryVariance),
  };
}

export function classifyPunchML(features: KinematicFeatureVector): PunchMLPrediction {
  const f = extractKinematicFeatureVector(features);

  if (f.guardSymmetryScore >= 0.7 && f.elbowAngleDegrees < 110) {
    return {
      punchClass: PunchMLClass.BLOCK,
      confidence: Math.min(0.99, 0.7 + f.guardSymmetryScore * 0.25),
      isValidStrike: false,
      kineticImpactScore: 0,
    };
  }

  if (f.handClosureMetric > 0.4) {
    return {
      punchClass: PunchMLClass.IDLE,
      confidence: 0.88,
      isValidStrike: false,
      rejectionReason: "OPEN_HAND_DETECTED",
      kineticImpactScore: 0,
    };
  }

  if (f.velocityZ > -600 && f.accelerationNorm < 1500) {
    return {
      punchClass: PunchMLClass.IDLE,
      confidence: 0.92,
      isValidStrike: false,
      kineticImpactScore: 0,
    };
  }

  const kineticImpact = Math.round(Math.abs(f.velocityZ) * 0.6 + f.accelerationNorm * 0.1);

  if (f.horizontalTrajectoryVariance > 0.035) {
    return {
      punchClass: PunchMLClass.HOOK,
      confidence: 0.84,
      isValidStrike: true,
      kineticImpactScore: kineticImpact,
    };
  }

  return {
    punchClass: PunchMLClass.JAB,
    confidence: Math.min(0.98, 0.75 + Math.abs(f.velocityZ) / 5000),
    isValidStrike: true,
    kineticImpactScore: kineticImpact,
  };
}
