import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { ProductCard } from "./components/ProductCard.js";
import { RingCustomizer } from "./components/RingCustomizer.js";
import { SelectionSummary } from "./components/SelectionSummary.js";
import { CartItem } from "./components/CartItem.js";
import { categoryLabels, estimatePrice, formatCurrency, getCategoryProducts, getProduct, getVendor, normalizeSelection, products } from "./data/products.js";

const app = document.querySelector("#app");
const cartKey = "nakama-gems-cart";
const selectionKey = "nakama-gems-selection";

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || "[]");
}

function setCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function getSelection(product) {
  const selections = JSON.parse(localStorage.getItem(selectionKey) || "{}");
  return normalizeSelection(product, selections[product.id]);
}

function setSelection(productId, selection) {
  const selections = JSON.parse(localStorage.getItem(selectionKey) || "{}");
  selections[productId] = selection;
  localStorage.setItem(selectionKey, JSON.stringify(selections));
}

function shell(content) {
  app.innerHTML = `${Header(getCart().length)}<main>${content}${AboutUs()}</main>${Footer()}`;
}

function AboutUs() {
  return `
    <section class="about-us">
      <p class="eyebrow">About Us</p>
      <h2>Made for a better jewelry search</h2>
      <p>
        At The Don Jewelers & Jewelry, we are striving to give every client the best experience possible
        while searching for a piece that feels personal, memorable, and true to them. We work hard to make
        sure you feel supported from first look to final selection, whether your new jewelry marks a special
        moment, completes a style, or becomes part of your identity.
      </p>
    </section>
  `;
}

function homePage() {
  const engagementProduct = getProduct("luna-solitaire");

  shell(`
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">Luxury engagement rings and custom jewelry</p>
        <h1>The Don Jewelers & Jewelry</h1>
        <p>Build your engagement ring, select high-end diamond jewelry, or start a one-of-one custom order with a premium client experience from first idea to final piece.</p>
        <div class="hero-actions">
          <a class="button button-gold" href="#/product/luna-solitaire">Build Your Engagement Ring</a>
          <a class="button button-ghost" href="#/custom-orders">Message Us for Custom Design</a>
        </div>
      </div>
    </section>
    <section class="section engagement-feature">
      <div>
        <p class="eyebrow">Engagement Rings</p>
        <h2>Start with the ring</h2>
        <p>Select diamond size, stone shape, color, clarity, metal, and exact ring size. Built for serious buyers who want a clear luxury quote before moving forward.</p>
        <div class="hero-actions">
          <a class="button button-gold" href="#/product/${engagementProduct.id}">Build Your Engagement Ring</a>
          <a class="button button-light" href="#/category/engagement-rings">View Engagement Rings</a>
        </div>
      </div>
      ${ProductCard(engagementProduct)}
    </section>
    <section class="section">
      <div class="section-heading">
        <p class="eyebrow">Luxury Categories</p>
        <h2>Browse by jewelry type</h2>
      </div>
      <div class="collection-grid">
        ${[
          ["Engagement Rings", "engagement-rings", "/assets/gold-engagement-rings.png"],
          ["Wedding Bands", "wedding-bands", "/assets/gold-engagement-rings.png"],
          ["Necklaces", "necklaces", "/assets/red-diamond-necklace.png"],
          ["Chains", "chains", "/assets/silver-cross-chain.png"],
          ["Earrings", "earrings", "/assets/princess-diamond-earrings.png"],
          ["Bracelets", "bracelets", "/assets/diamond-bracelet.png"],
          ["Custom Orders", "custom-orders", "/assets/don-logo.jpg"]
        ].map(([name, route, image]) => `
          <a class="collection-tile" href="#/${route === "custom-orders" ? "custom-orders" : `category/${route}`}" style="--collection-image: url('${image}')">
            <span>${name}</span>
          </a>
        `).join("")}
      </div>
    </section>
    ${customOrdersPromo()}
    <section class="trust-band" aria-label="Trust badges">
      <div><strong>Secure browsing</strong><span>Checkout handoff ready</span></div>
      <div><strong>Curated luxury pieces</strong><span>Custom options on every item</span></div>
      <div><strong>Custom sizing</strong><span>Sizes tailored by item type</span></div>
    </section>
  `);
}

function productsPage(category = null) {
  const visibleProducts = category ? getCategoryProducts(category) : products;
  const title = category ? categoryLabels[category] : "All Luxury Jewelry";

  shell(`
    <section class="page-hero compact">
      <img class="page-hero-logo" src="/assets/don-logo.jpg" alt="The Don Jewelers and Jewelry logo" />
      <p class="eyebrow">Jewelry Marketplace</p>
      <h1>${category === "engagement-rings" ? "Build your engagement ring with The Don" : `Shop ${title} with The Don`}</h1>
      ${category === "engagement-rings" ? `<a class="button button-gold" href="#/product/luna-solitaire">Build Your Engagement Ring</a>` : ""}
    </section>
    <section class="product-grid">
      ${visibleProducts.map(ProductCard).join("")}
    </section>
  `);
}

function customOrdersPromo() {
  return `
    <section class="custom-order-band">
      <div>
        <p class="eyebrow">Custom Orders</p>
        <h2>Looking for something 1-of-1?</h2>
        <p>Message us for custom designs, custom stone sizes, custom shapes, and full custom jewelry projects.</p>
      </div>
      <div class="custom-order-actions">
        <a class="button button-gold" href="#/custom-orders">Start Custom Order</a>
        <a class="button button-light" href="mailto:orders@example.com?subject=Custom Jewelry Design">Message Us Directly</a>
        <a class="button button-dark" href="#/custom-orders">Request a Quote</a>
      </div>
    </section>
  `;
}

function productPage(productId) {
  const product = getProduct(productId);
  const selection = getSelection(product);
  shell(`
    <section class="product-detail-hero">
      <img src="${product.image}" alt="${product.alt}" />
      <div>
      <p class="eyebrow">${categoryLabels[product.category] || "Luxury Jewelry"}</p>
      <h1>${product.name}</h1>
        <p>Starting at ${formatCurrency(product.basePrice)} before diamond, color, size, and style modifiers.</p>
      </div>
    </section>
    ${RingCustomizer(product, selection)}
  `);
  bindCustomizer(product.id);
}

function bindCustomizer(productId) {
  document.querySelectorAll(".option-group").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-option]");
      if (!button) return;
      const product = getProduct(productId);
      const selection = getSelection(product);
      selection[group.dataset.group] = button.dataset.option;
      setSelection(productId, selection);
      productPage(productId);
    });
  });
}

function previewPage(productId) {
  const product = getProduct(productId);
  const vendor = getVendor(product.vendorId);
  const selection = getSelection(product);
  const price = estimatePrice(product, selection);
  shell(`
    <section class="preview-layout">
      <div class="preview-image">
        <img src="${product.image}" alt="${product.alt}" />
      </div>
      <div>
        <p class="eyebrow">Selection Preview</p>
        <h1>Your ${product.name}</h1>
        ${SelectionSummary(product, selection)}
        <div class="preview-actions">
          <a class="button button-gold" href="#/custom-orders">Request Quote / Message Us</a>
          <button class="button button-gold" type="button" id="add-to-cart">Add to Cart</button>
          <a class="button button-light" href="#/product/${product.id}">Edit Selection</a>
        </div>
      </div>
    </section>
  `);
  document.querySelector("#add-to-cart").addEventListener("click", () => {
    const cart = getCart();
    cart.push({ id: crypto.randomUUID(), product, vendor, selection, price });
    setCart(cart);
    location.hash = "#/cart";
  });
}

function vendorPage(vendorId) {
  const vendor = vendors.find((item) => item.id === vendorId) || vendors[0];
  const vendorProducts = products.filter((product) => product.vendorId === vendor.id);
  shell(`
    <section class="vendor-profile">
      <div class="vendor-badge large" aria-hidden="true">${vendor.name.slice(0, 1)}</div>
      <div>
        <p class="eyebrow">${vendor.location} · ${vendor.rating} stars</p>
        <h1>${vendor.name}</h1>
        <p>${vendor.bio}</p>
        <button class="button button-gold" type="button">View Jewelry</button>
      </div>
    </section>
    <section class="section">
      <div class="section-heading">
        <p class="eyebrow">Vendor Products</p>
        <h2>Available from ${vendor.name}</h2>
      </div>
      <div class="product-grid">
        ${vendorProducts.map(ProductCard).join("")}
      </div>
    </section>
  `);
}

function cartPage() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  shell(`
    <section class="page-hero compact">
      <p class="eyebrow">Cart</p>
      <h1>Your saved custom jewelry</h1>
    </section>
    <section class="cart-layout">
      <div class="cart-list">
        ${cart.length ? cart.map(CartItem).join("") : `<p class="empty-state">Your cart is empty. Start with a custom jewelry piece.</p>`}
      </div>
      <aside class="summary-panel">
        <p class="eyebrow">Cart Summary</p>
        <div class="price-row"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
        <a class="button button-gold ${cart.length ? "" : "disabled"}" href="${cart.length ? "#/checkout" : "#/products"}">${cart.length ? "Checkout" : "Shop Now"}</a>
      </aside>
    </section>
  `);
  document.querySelectorAll(".remove-cart-item").forEach((button) => {
    button.addEventListener("click", () => {
      const nextCart = getCart().filter((_, index) => index !== Number(button.dataset.removeIndex));
      setCart(nextCart);
      cartPage();
    });
  });
}

function checkoutPage() {
  shell(`
    <section class="checkout-placeholder">
      <p class="eyebrow">Checkout</p>
      <h1>Checkout integration coming soon</h1>
      <p>This placeholder is ready for a real payment and vendor-order handoff.</p>
      <div class="integration-notes">
        <strong>Future integration points</strong>
        <p>Shopify Buy Button, Stripe, Snipcart, Medusa, WooCommerce API, or an independent vendor dashboard can connect here.</p>
      </div>
    </section>
  `);
  // FUTURE INTEGRATION: Create Shopify Buy Button checkout, Stripe Checkout session,
  // Snipcart item payload, Medusa cart, WooCommerce order, or vendor-dashboard order here.
}

function customOrdersPage() {
  shell(`
    <section class="page-hero compact custom-orders-hero">
      <img class="page-hero-logo" src="/assets/don-logo.jpg" alt="The Don Jewelers and Jewelry logo" />
      <p class="eyebrow">Custom Orders</p>
      <h1>Start a one-of-one jewelry project</h1>
      <p>Looking for something 1-of-1? Message us for custom designs, custom stone sizes, custom shapes, and full custom jewelry projects.</p>
    </section>
    ${customOrdersPromo()}
    <section class="custom-form-section">
      <form class="custom-order-form" aria-label="Custom order request form">
        ${[
          ["Name", "text"],
          ["Email", "email"],
          ["Phone", "tel"],
          ["Jewelry Type", "text"],
          ["Desired Stone Size", "text"],
          ["Stone Shape", "text"],
          ["Metal Type", "text"],
          ["Budget Range", "text"]
        ].map(([label, type]) => `
          <label>
            <span>${label}</span>
            <input type="${type}" name="${label.toLowerCase().replaceAll(" ", "-")}" />
          </label>
        `).join("")}
        <label class="form-wide">
          <span>Description of Custom Design</span>
          <textarea name="description" rows="5"></textarea>
        </label>
        <label class="form-wide">
          <span>Upload Inspiration Image</span>
          <input type="file" name="inspiration" accept="image/*" />
        </label>
        <button class="button button-gold form-wide" type="submit">Submit Request</button>
      </form>
    </section>
  `);
  document.querySelector(".custom-order-form").addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.insertAdjacentHTML("beforeend", `<p class="form-success">Request saved for this mockup. Message us directly to continue.</p>`);
  });
}

function route() {
  const [, page, id] = (location.hash || "#/").split("/");
  if (!page) return homePage();
  if (page === "products") return productsPage();
  if (page === "category") return productsPage(id);
  if (page === "product") return productPage(id);
  if (page === "preview") return previewPage(id);
  if (page === "custom-orders") return customOrdersPage();
  if (page === "vendor") return productsPage();
  if (page === "cart") return cartPage();
  if (page === "checkout") return checkoutPage();
  return homePage();
}

// FUTURE INTEGRATION: Replace localStorage cart with Shopify, Medusa, Snipcart,
// WooCommerce, or vendor-dashboard API persistence when the backend is selected.
window.addEventListener("hashchange", route);
route();
