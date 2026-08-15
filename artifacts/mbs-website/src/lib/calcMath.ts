export type Frequency = "Daily" | "Weekly" | "Monthly";

/** Business-day periods per year by payment frequency */
export const PERIODS_PER_YEAR: Record<Frequency, number> = {
  Monthly: 12,
  Weekly: 52,
  Daily: 252,
};

export interface CalcResult {
  /** Periodic payment, rounded to whole dollars */
  payment: number;
  /** payment × numPeriods */
  totalRepayment: number;
  /** totalRepayment − principal */
  totalCost: number;
  /** Total number of payment periods */
  numPeriods: number;
}

/**
 * Standard amortising payment formula.
 *   P = principal × r(1+r)^n / ((1+r)^n − 1)
 * where:
 *   r = APR / periodsPerYear
 *   n = termMonths converted to periods (Monthly=1×, Weekly=52/12×, Daily=252/12×)
 *
 * Handles r = 0 (interest-free) and n = 0 gracefully.
 */
export function calcPayment(
  principal: number,
  termMonths: number,
  aprPct: number,
  frequency: Frequency,
): CalcResult {
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const r = aprPct / 100 / periodsPerYear;
  const n = Math.round(termMonths * (periodsPerYear / 12));

  let payment: number;
  if (n === 0) {
    payment = 0;
  } else if (r === 0) {
    payment = Math.round(principal / n);
  } else {
    const pow = Math.pow(1 + r, n);
    payment = Math.round((principal * r * pow) / (pow - 1));
  }

  const totalRepayment = payment * n;
  const totalCost = totalRepayment - principal;

  return { payment, totalRepayment, totalCost, numPeriods: n };
}
