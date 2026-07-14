/**
 * @vitest-environment jsdom
 * @license MIT
 * LEGAL NOTICE:
 * This software is provided "as is", without warranty of any kind.
 */

// COMPLIANCE REQUIREMENT: TDD verification of 3D spatial feature engineering and ML classification model behavior prior to business logic implementation.

import { describe, expect, it } from "vitest";
import {
  computeElbowAngle,
  computeHandClosure,
  extractKinematicFeatureVector,
  classifyPunchML,
  PunchMLClass,
  type Landmark3D,
  type KinematicFeatureVector,
} from "@/lib/vision-ml-classifier";

describe("Vision ML Classifier Unit Tests", () => {
  it("should calculate exact 3D elbow angle in degrees using Law of Cosines", () => {
    const shoulder: Landmark3D = { x: 0, y: 0, z: 0 };
    const elbow: Landmark3D = { x: 1, y: 0, z: 0 };
    const wrist: Landmark3D = { x: 1, y: 1, z: 0 }; // 90 degree bend at (1,0,0)
    const angle = computeElbowAngle(shoulder, elbow, wrist);
    expect(angle).toBeCloseTo(90, 1);
  });

  it("should calculate hand closure metric indicating a closed fist vs open hand", () => {
    const wrist: Landmark3D = { x: 0.5, y: 0.5, z: 0 };
    // Closed fist: fingertips right next to wrist/palm center (~0.05 distance)
    const closedFingertips: Landmark3D[] = [
      { x: 0.52, y: 0.48, z: 0 },
      { x: 0.51, y: 0.49, z: 0 },
      { x: 0.5, y: 0.48, z: 0 },
      { x: 0.49, y: 0.49, z: 0 },
      { x: 0.48, y: 0.5, z: 0 },
    ];
    const closureScore = computeHandClosure(wrist, closedFingertips);
    expect(closureScore).toBeLessThan(0.35);
  });

  it("should extract full 7-dimensional kinematic feature vector cleanly", () => {
    const features: KinematicFeatureVector = extractKinematicFeatureVector({
      velocityZ: -950,
      accelerationNorm: 4500,
      extensionRatio: 0.92,
      elbowAngleDegrees: 162,
      handClosureMetric: 0.22,
      guardSymmetryScore: 0.15,
      horizontalTrajectoryVariance: 0.04,
    });
    expect(features.velocityZ).toBe(-950);
    expect(features.elbowAngleDegrees).toBe(162);
  });

  it("should classify a rapid forward closed fist straight strike as a JAB", () => {
    const features: KinematicFeatureVector = {
      velocityZ: -1250,
      accelerationNorm: 5200,
      extensionRatio: 0.94,
      elbowAngleDegrees: 165,
      handClosureMetric: 0.21,
      guardSymmetryScore: 0.1,
      horizontalTrajectoryVariance: 0.03,
    };
    const prediction = classifyPunchML(features);
    expect(prediction.punchClass).toBe(PunchMLClass.JAB);
    expect(prediction.confidence).toBeGreaterThanOrEqual(0.8);
    expect(prediction.isValidStrike).toBe(true);
  });

  it("should reject an open-hand rapid wave as an INVALID strike even if speed is high", () => {
    const features: KinematicFeatureVector = {
      velocityZ: -1300, // fast forward speed
      accelerationNorm: 5000,
      extensionRatio: 0.88,
      elbowAngleDegrees: 155,
      handClosureMetric: 0.78, // OPEN HAND SLAP / WAVE (> 0.65)
      guardSymmetryScore: 0.1,
      horizontalTrajectoryVariance: 0.05,
    };
    const prediction = classifyPunchML(features);
    expect(prediction.isValidStrike).toBe(false);
    expect(prediction.rejectionReason).toBe("OPEN_HAND_DETECTED");
  });

  it("should classify dual raised symmetric fists as defensive BLOCK state", () => {
    const features: KinematicFeatureVector = {
      velocityZ: -50,
      accelerationNorm: 100,
      extensionRatio: 0.35,
      elbowAngleDegrees: 55,
      handClosureMetric: 0.25,
      guardSymmetryScore: 0.92, // High guard symmetry near chin
      horizontalTrajectoryVariance: 0.01,
    };
    const prediction = classifyPunchML(features);
    expect(prediction.punchClass).toBe(PunchMLClass.BLOCK);
  });
});
