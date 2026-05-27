import { OptionButton } from "./OptionButton.js";
import { SelectionSummary } from "./SelectionSummary.js";
import { getCustomizerSections, getOptionDetail, getProductConfig } from "../data/products.js";

function TennisBraceletInfo(selection) {
  return `
    <div class="tennis-builder-info">
      <div>
        <p class="eyebrow">Default Length</p>
        <strong>7 inches</strong>
      </div>
      <div>
        <p class="eyebrow">Approximate Finished Weight</p>
        <strong>6g-30g</strong>
      </div>
      <p>Approximate finished weight varies depending on selected carat weight and stone size.</p>
      <div class="stone-preview-row" aria-label="Stone size preview">
        ${["10", "15", "20", "25", "30", "35", "40"].map((size, index) => `
          <span class="stone-preview ${selection.stoneSize?.startsWith(size) ? "selected" : ""}" style="--stone-scale: ${0.7 + index * 0.09}">
            ${size}
          </span>
        `).join("")}
      </div>
    </div>
  `;
}

export function RingCustomizer(product, selection) {
  const config = getProductConfig(product);
  const sections = getCustomizerSections(product);
  const isTennisBracelet = product.id === "ever-band";

  return `
    <section class="customizer-layout">
      <div class="customizer-panel">
        <p class="eyebrow">Custom Jewelry Builder</p>
        <h1>${product.name}</h1>
        <p class="lede">${config.intro}</p>
        ${product.id === "luna-solitaire" ? `<p class="video-preview-note">Look below for video preview.</p>` : ""}
        ${isTennisBracelet ? TennisBraceletInfo(selection) : ""}
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
          <a class="button button-gold preview-button" href="${isTennisBracelet ? "#tennis-bracelet-request" : `#/preview/${product.id}`}">${config.previewCta}</a>
          <a class="button button-light preview-button" href="#/custom-orders">${config.customCta}</a>
          ${product.id === "silver-cross-chain" ? `<a class="button button-dark preview-button" href="#/custom-orders">Contact and Make a Special Request</a>` : ""}
        </div>
      </div>
      ${SelectionSummary(product, selection)}
    </section>
  `;
}
