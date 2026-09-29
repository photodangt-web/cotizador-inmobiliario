import { describe, expect, it } from "vitest";
import { calculateQuote, convertPrice, monthlyPayment } from "./calculator.js";

describe("financial calculations", () => {
  it("converts dollars to quetzales using the configured rate", () => {
    expect(convertPrice(100, "GTQ")).toBe(785);
    expect(convertPrice(100, "USD")).toBe(100);
  });

  it("calculates the standard fixed-rate monthly payment", () => {
    expect(monthlyPayment(100000, 6.5, 30)).toBeCloseTo(632.07, 2);
  });

  it("returns a complete quote for every supported term", () => {
    const quote = calculateQuote({
      priceInUsd: 150000,
      currency: "USD",
      downPaymentPercent: 10,
      annualRate: 7.25,
    });

    expect(quote.downPayment).toBe(15000);
    expect(quote.financed).toBe(135000);
    expect(quote.installments).toHaveLength(6);
    expect(quote.installments.every(({ amount }) => amount > 0)).toBe(true);
  });

  it("supports zero-interest financing", () => {
    expect(monthlyPayment(12000, 0, 1)).toBe(1000);
  });
});
