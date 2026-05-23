import { estimatePrice, formatCurrency, getCustomizerSections, getProductConfig } from "../data/products.js";

export function SelectionSummary(product, selection) {
  const config = getProductConfig(product);
  const price = estimatePrice(product, selection);
  return `
    <aside class="summary-panel" aria-label="${config.summaryAria}">
      <p class="eyebrow">Live Selection</p>
      <h2>${product.name}</h2>
      <dl class="summary-list">
        ${getCustomizerSections(product).map(([key, label]) => `
          <div><dt>${label}</dt><dd>${selection[key]}</dd></div>
        `).join("")}
      </dl>
      <p class="quote-note">Request Quote / Message Us</p>
      <div class="price-row">
        <span>Estimated price</span>
        <strong>${formatCurrency(price)}</strong>
      </div>
    </aside>
  `;
}
