import { describe, it, expect } from "vitest";
import { calcPayment } from "./calcMath";

/**
 * Three verified amortisation cases.
 * Formula: P = principal × r(1+r)^n / ((1+r)^n − 1), rounded to whole dollars.
 */
describe("calcPayment – monthly frequency", () => {
  it("case 1: $100 000 / 12 mo / 12% APR → $8 885/mo", () => {
    // r = 0.12/12 = 0.01, n = 12
    // P = 100000 × 0.01 × 1.01^12 / (1.01^12 − 1) = 8 884.88 → 8885
    const { payment, totalRepayment, totalCost, numPeriods } = calcPayment(
      100_000,
      12,
      12,
      "Monthly",
    );
    expect(payment).toBe(8_885);
    expect(numPeriods).toBe(12);
    expect(totalRepayment).toBe(8_885 * 12);
    expect(totalCost).toBe(totalRepayment - 100_000);
  });

  it("case 2: $50 000 / 24 mo / 24% APR → $2 644/mo", () => {
    // r = 0.24/12 = 0.02, n = 24
    // P = 50000 × 0.02 × 1.02^24 / (1.02^24 − 1) = 2 643.56 → 2644
    const { payment } = calcPayment(50_000, 24, 24, "Monthly");
    expect(payment).toBe(2_644);
  });

  it("case 3: $200 000 / 60 mo / 0% APR → $3 333/mo (interest-free path)", () => {
    // r = 0 → payment = principal / n = 200000 / 60 = 3333.33 → 3333
    const { payment } = calcPayment(200_000, 60, 0, "Monthly");
    expect(payment).toBe(3_333);
  });
});
