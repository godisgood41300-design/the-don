import { categoryLabels, formatCurrency } from "../data/products.js";

export function ProductCard(product) {
  return `
    <article class="product-card">
      <a href="#/product/${product.id}" class="product-image-link" aria-label="Customize ${product.name}">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
      </a>
      <div class="product-card-body">
        <p class="eyebrow">${categoryLabels[product.category] || "Luxury Jewelry"}</p>
        <h3>${product.name}</h3>
        <p class="muted">Starting at ${formatCurrency(product.basePrice)}</p>
        <div class="card-actions">
          <a class="button button-dark" href="#/product/${product.id}">Shop Item</a>
        </div>
      </div>
    </article>
  `;
}
