import "./styles.css";
import { BANKS, TERMS_IN_YEARS, calculateQuote } from "./calculator.js";

const elements = {
  modal: document.querySelector("#myModal"),
  openButton: document.querySelector("#open-quote"),
  closeButton: document.querySelector(".close"),
  project: document.querySelector("#project"),
  apartmentType: document.querySelector("#apartment-type"),
  propertyPrice: document.querySelector("#property-price"),
  quoteProject: document.querySelector("#quote-project"),
  pdfProperty: document.querySelector("#pdf-property"),
  currencyInputs: [...document.querySelectorAll('[name="currency"]')],
  priceSymbol: document.querySelector("#price-symbol"),
  displayPrice: document.querySelector("#display-price"),
  downPayment: document.querySelector("#down-payment"),
  downPaymentPercent: document.querySelector("#down-payment-percent"),
  bank: document.querySelector("#bank"),
  calculateButton: document.querySelector("#calculate"),
  downloadButton: document.querySelector("#download-button"),
  resultPrice: document.querySelector("#result-price"),
  resultDownPayment: document.querySelector("#result-down-payment"),
  resultFinanced: document.querySelector("#result-financed"),
  resultRate: document.querySelector("#result-rate"),
  installments: document.querySelector("#installments"),
  quotePdf: document.querySelector("#quote-pdf"),
  toast: document.querySelector("#toast"),
};

let hasCalculated = false;

function selectedCurrency() {
  return elements.currencyInputs.find((input) => input.checked).value;
}

function currencySymbol(currency = selectedCurrency()) {
  return currency === "GTQ" ? "Q" : "$";
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function fillBanks() {
  const banks = BANKS[elements.project.value][selectedCurrency()];
  elements.bank.replaceChildren(
    ...banks.map((bank) => {
      const option = document.createElement("option");
      option.value = String(bank.rate);
      option.textContent = bank.name;
      option.dataset.bank = bank.name;
      return option;
    }),
  );
}

function currentQuote() {
  return calculateQuote({
    priceInUsd: Number(elements.propertyPrice.value),
    currency: selectedCurrency(),
    downPaymentPercent: Number(elements.downPayment.value),
    annualRate: Number(elements.bank.value),
  });
}

function updatePreview() {
  fillBanks();
  const quote = currentQuote();
  const symbol = currencySymbol();

  elements.priceSymbol.textContent = symbol;
  elements.displayPrice.textContent = formatAmount(quote.price);
  elements.downPaymentPercent.textContent = `${elements.downPayment.value} %`;
  elements.quoteProject.textContent = elements.project.value;
  elements.pdfProperty.textContent = `${elements.project.value} · ${elements.apartmentType.value}`;
  renderSummary(quote, false);
}

function renderSummary(quote, includeInstallments = true) {
  const symbol = currencySymbol();
  elements.resultPrice.textContent = `${symbol} ${formatAmount(quote.price)}`;
  elements.resultDownPayment.textContent = `${symbol} ${formatAmount(quote.downPayment)}`;
  elements.resultFinanced.textContent = `${symbol} ${formatAmount(quote.financed)}`;
  elements.resultRate.textContent = `${quote.annualRate.toFixed(2)} %`;

  if (includeInstallments) {
    const cells = quote.installments.map(({ years, amount }) => {
      const cell = document.createElement("span");
      cell.setAttribute("role", "cell");
      cell.dataset.years = String(years);
      cell.textContent = `${symbol} ${formatAmount(amount)}`;
      return cell;
    });
    elements.installments.replaceChildren(...cells);
  } else if (!hasCalculated) {
    elements.installments.replaceChildren(
      ...TERMS_IN_YEARS.map(() => {
        const cell = document.createElement("span");
        cell.setAttribute("role", "cell");
        cell.textContent = "---";
        return cell;
      }),
    );
  }
}

function calculate() {
  const quote = currentQuote();
  renderSummary(quote);
  hasCalculated = true;
  elements.downloadButton.disabled = false;
  showToast("Cotización actualizada");
}

function openModal() {
  if (!elements.propertyPrice.reportValidity()) return;
  hasCalculated = false;
  elements.downloadButton.disabled = true;
  updatePreview();
  elements.modal.classList.add("is-open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  elements.closeButton.focus();
}

function closeModal() {
  elements.modal.classList.remove("is-open");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  elements.openButton.focus();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1800);
}

async function exportPdf() {
  elements.downloadButton.disabled = true;
  elements.downloadButton.textContent = "Generando PDF...";
  elements.quotePdf.classList.add("is-exporting");

  try {
    const { default: html2pdf } = await import("html2pdf.js");
    await html2pdf()
      .set({
        margin: 0.35,
        filename: `cotizacion-inmobiliaria-${elements.project.value.toLowerCase()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      })
      .from(elements.quotePdf)
      .save();
    showToast("PDF descargado correctamente");
  } catch (error) {
    console.error(error);
    showToast("No fue posible generar el PDF");
  } finally {
    elements.quotePdf.classList.remove("is-exporting");
    elements.downloadButton.disabled = false;
    elements.downloadButton.textContent = "Exportar PDF";
  }
}

elements.openButton.addEventListener("click", openModal);
elements.closeButton.addEventListener("click", closeModal);
elements.calculateButton.addEventListener("click", calculate);
elements.downloadButton.addEventListener("click", exportPdf);
elements.downPayment.addEventListener("input", () => {
  elements.downPaymentPercent.textContent = `${elements.downPayment.value} %`;
  if (hasCalculated) calculate();
});
elements.bank.addEventListener("change", () => hasCalculated && calculate());
elements.currencyInputs.forEach((input) => input.addEventListener("change", () => {
  hasCalculated = false;
  elements.downloadButton.disabled = true;
  updatePreview();
}));
elements.modal.addEventListener("click", (event) => {
  if (event.target === elements.modal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.modal.classList.contains("is-open")) closeModal();
});

updatePreview();
