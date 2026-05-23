import { formatCurrency, getCustomizerSections } from "../data/products.js";

export function CartItem(item, index) {
  const summary = getCustomizerSections(item.product)
    .map(([key, label]) => `${label}: ${item.selection[key]}`)
    .join(" · ");

  return `
    <article class="cart-item">
      <img src="${item.product.image}" alt="${item.product.alt}" />
      <div class="cart-item-details">
        <p class="eyebrow">${item.vendor.name}</p>
        <h3>${item.product.name}</h3>
        <p>${summary}</p>
      </div>
      <strong>${formatCurrency(item.price)}</strong>
      <button class="icon-button remove-cart-item" type="button" aria-label="Remove ${item.product.name} from cart" data-remove-index="${index}">Remove</button>
    </article>
  `;
}
