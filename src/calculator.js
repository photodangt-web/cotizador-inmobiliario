export const EXCHANGE_RATE = 7.85;
export const TERMS_IN_YEARS = [5, 10, 15, 20, 25, 30];

export const BANKS = {
  Monad: {
    USD: [
      { name: "Banco Industrial", rate: 7.25 },
      { name: "BAC Credomatic", rate: 6.5 },
      { name: "BAM", rate: 6.5 },
    ],
    GTQ: [
      { name: "BAC Credomatic", rate: 7 },
      { name: "BAM", rate: 7 },
      { name: "Banrural", rate: 6 },
      { name: "Bantrab", rate: 6.5 },
      { name: "Banco Industrial", rate: 7.26 },
      { name: "BI Vivienda", rate: 7.5 },
      { name: "CHN", rate: 5.26 },
      { name: "FHA", rate: 5.44 },
      { name: "G&T", rate: 6.75 },
      { name: "VIVIBANCO", rate: 8 },
    ],
  },
  Ikonia: null,
  Neo: {
    USD: [
      { name: "BAC Credomatic", rate: 6.5 },
      { name: "BAM", rate: 6.5 },
      { name: "Banrural", rate: 5.97 },
      { name: "Banco Industrial", rate: 7.25 },
      { name: "CHN", rate: 5.22 },
      { name: "FHA", rate: 6.75 },
    ],
    GTQ: null,
  },
};

BANKS.Ikonia = BANKS.Monad;
BANKS.Neo.GTQ = BANKS.Monad.GTQ.filter((bank) => bank.name !== "VIVIBANCO");

export function convertPrice(priceInUsd, currency) {
  return currency === "GTQ" ? priceInUsd * EXCHANGE_RATE : priceInUsd;
}

export function monthlyPayment(principal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (!Number.isFinite(principal) || principal < 0 || months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;

  const factor = (1 + monthlyRate) ** months;
  return principal * ((monthlyRate * factor) / (factor - 1));
}

export function calculateQuote({ priceInUsd, currency, downPaymentPercent, annualRate }) {
  const price = convertPrice(priceInUsd, currency);
  const downPayment = price * (downPaymentPercent / 100);
  const financed = price - downPayment;

  return {
    price,
    downPayment,
    financed,
    annualRate,
    installments: TERMS_IN_YEARS.map((years) => ({
      years,
      amount: monthlyPayment(financed, annualRate, years),
    })),
  };
}
