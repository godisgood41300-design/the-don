import { OptionButton } from "./OptionButton.js";
import { SelectionSummary } from "./SelectionSummary.js";
import { getCustomizerSections, getProductConfig } from "../data/products.js";

export function RingCustomizer(product, selection) {
  const config = getProductConfig(product);
  const sections = getCustomizerSections(product);

  return `
    <section class="customizer-layout">
      <div class="customizer-panel">
        <p class="eyebrow">Custom Jewelry Builder</p>
        <h1>${product.name}</h1>
        <p class="lede">${config.intro}</p>
        ${sections
          .map(([key, title, options]) => `
            <fieldset class="option-group" data-group="${key}">
              <legend>${title}</legend>
              <div class="option-grid">
                ${options.map((option) => OptionButton({ label: option, selected: selection[key] === option })).join("")}
              </div>
            </fieldset>
          `)
          .join("")}
        <div class="builder-actions">
          <a class="button button-gold preview-button" href="#/preview/${product.id}">${config.previewCta}</a>
          <a class="button button-light preview-button" href="#/custom-orders">${config.customCta}</a>
        </div>
      </div>
      ${SelectionSummary(product, selection)}
    </section>
  `;
}
