import { describe, it, expect } from "vitest";
import { calcPayment, PERIODS_PER_YEAR } from "./calcMath";

describe("payment frequency periods", () => {
  it("uses 26 periods per year for Bi-weekly", () => {
    expect(PERIODS_PER_YEAR["Bi-weekly"]).toBe(26);
    expect(calcPayment(26_000, 12, 0, "Bi-weekly").numPeriods).toBe(26);
  });
});

/**
 * Amortisation cases verified against the formula:
 *   P = principal × r(1+r)^n / ((1+r)^n − 1)
 * where r = APR / periodsPerYear, n = round(termMonths × periodsPerYear / 12).
 * Results rounded to whole dollars.
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

describe("calcPayment – bi-weekly frequency (26 periods/year)", () => {
  it("case 1: $52 000 / 24 mo / 0% APR → $1 000/biweekly (interest-free path)", () => {
    // n = round(24 × 26/12) = 52, payment = 52000/52 = 1000 exactly
    const { payment, numPeriods } = calcPayment(52_000, 24, 0, "Bi-weekly");
    expect(numPeriods).toBe(52);
    expect(payment).toBe(1_000);
  });

  it("case 2: $100 000 / 12 mo / 12% APR → $4 090/biweekly", () => {
    // r = 0.12/26 ≈ 0.004615, n = 26
    // pow = (1.004615)^26 ≈ 1.12719
    // P = 100000 × 0.004615 × 1.12719 / (1.12719 − 1) ≈ 4090
    const { payment, numPeriods } = calcPayment(100_000, 12, 12, "Bi-weekly");
    expect(numPeriods).toBe(26);
    expect(payment).toBe(4_090);
  });

  it("case 3: $13 000 / 12 mo / 0% APR → $500/biweekly (interest-free path)", () => {
    // n = 26, payment = 13000/26 = 500 exactly
    const { payment } = calcPayment(13_000, 12, 0, "Bi-weekly");
    expect(payment).toBe(500);
  });
});
