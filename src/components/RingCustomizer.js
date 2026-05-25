import { OptionButton } from "./OptionButton.js";
import { SelectionSummary } from "./SelectionSummary.js";
import { getCustomizerSections, getOptionDetail, getProductConfig } from "../data/products.js";

export function RingCustomizer(product, selection) {
  const config = getProductConfig(product);
  const sections = getCustomizerSections(product);

  return `
    <section class="customizer-layout">
      <div class="customizer-panel">
        <p class="eyebrow">Custom Jewelry Builder</p>
        <h1>${product.name}</h1>
        <p class="lede">${config.intro}</p>
        ${product.id === "luna-solitaire" ? `<p class="video-preview-note">Look below for video preview.</p>` : ""}
        ${sections
          .map(([key, title, options]) => `
            <fieldset class="option-group" data-group="${key}">
              <legend>${title}</legend>
              <div class="option-grid">
                ${options.map((option) => OptionButton({ label: option, selected: selection[key] === option, onClick: getOptionDetail(key, option, product) })).join("")}
              </div>
            </fieldset>
          `)
          .join("")}
        <div class="builder-actions">
          <a class="button button-gold preview-button" href="#/preview/${product.id}">${config.previewCta}</a>
          <a class="button button-light preview-button" href="#/custom-orders">${config.customCta}</a>
          ${product.id === "silver-cross-chain" ? `<a class="button button-dark preview-button" href="#/custom-orders">Contact and Make a Special Request</a>` : ""}
        </div>
      </div>
      ${SelectionSummary(product, selection)}
    </section>
  `;
}
