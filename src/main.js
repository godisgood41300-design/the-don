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
const videoKey = "the-don-product-videos";
const contactPhone = "(484) 761-2008";
const contactPhoneHref = "tel:+14847612008";
const contactEmail = "Thedonjewelersandjewelry@gmail.com";
const contactEmailHref = `mailto:${contactEmail}`;

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

function getProductVideos() {
  return JSON.parse(localStorage.getItem(videoKey) || "{}");
}

function getProductVideo(productId) {
  return getProductVideos()[productId] || "";
}

function setProductVideo(productId, url) {
  const videos = getProductVideos();
  if (url) {
    videos[productId] = url;
  } else {
    delete videos[productId];
  }
  localStorage.setItem(videoKey, JSON.stringify(videos));
}

function youtubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const watchId = parsed.searchParams.get("v");
      if (watchId) return `https://www.youtube.com/embed/${watchId}`;
      const shortMatch = parsed.pathname.match(/\/shorts\/([^/]+)/);
      if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
      const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
      if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
    }
  } catch {
    return "";
  }
  return "";
}

function videoPlayer(url, productName) {
  if (!url) {
    return `
      <div class="video-empty">
        <p>No video posted for this diamond yet.</p>
      </div>
    `;
  }

  const youtubeUrl = youtubeEmbedUrl(url);
  if (youtubeUrl) {
    return `
      <iframe
        class="diamond-video-frame"
        src="${youtubeUrl}"
        title="${productName} diamond video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  }

  return `
    <video class="diamond-video-frame" src="${url}" controls playsinline>
      Your browser does not support video playback.
    </video>
  `;
}

function diamondVideoSection(product) {
  const currentVideo = getProductVideo(product.id);

  return `
    <section class="diamond-video-section">
      <div class="section-heading">
        <p class="eyebrow">Diamond Video</p>
        <h2>Show this diamond on video</h2>
        <p>Paste a YouTube link or hosted video link for this exact piece. For personal videos, upload a preview here during the demo or host the video later and paste the link.</p>
      </div>
      <div class="diamond-video-layout">
        <div class="diamond-video-player" id="diamond-video-player">
          ${videoPlayer(currentVideo, product.name)}
        </div>
        <form class="diamond-video-form" data-product-id="${product.id}" aria-label="Product video manager">
          <label>
            <span>YouTube or hosted video link</span>
            <input type="url" name="video-url" placeholder="https://youtube.com/watch?v=..." value="${currentVideo}" />
          </label>
          <div class="video-form-actions">
            <button class="button button-gold" type="submit">Save Video Link</button>
            <button class="button button-light clear-video-link" type="button">Remove Video</button>
          </div>
          <label>
            <span>Preview a personal video file</span>
            <input type="file" name="video-file" accept="video/*" />
          </label>
          <p class="video-note">Mock upload preview only. For the live site, connect this field to cloud storage or a product dashboard.</p>
        </form>
      </div>
    </section>
  `;
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
          <a class="button button-ghost" href="${contactEmailHref}?subject=Custom%20Jewelry%20Design">Message Us for Custom Design</a>
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
          ["Engagement Rings", "engagement-rings", "/assets/engagement-ring-feature.png"],
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
        <p>Message us for custom designs, custom stone sizes, custom shapes, and full custom jewelry projects. For quotes or additional questions, call or text ${contactPhone} or email ${contactEmail}.</p>
      </div>
      <div class="custom-order-actions">
        <a class="button button-gold" href="#/custom-orders">Start Custom Order</a>
        <a class="button button-light" href="${contactEmailHref}?subject=Custom%20Jewelry%20Design">Message Us Directly</a>
        <a class="button button-dark" href="${contactEmailHref}?subject=Jewelry%20Quote%20Request">Request a Quote</a>
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
    ${diamondVideoSection(product)}
  `);
  bindCustomizer(product.id);
  bindVideoManager(product);
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

function bindVideoManager(product) {
  const form = document.querySelector(".diamond-video-form");
  if (!form) return;

  const urlInput = form.querySelector('input[name="video-url"]');
  const fileInput = form.querySelector('input[name="video-file"]');
  const player = document.querySelector("#diamond-video-player");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setProductVideo(product.id, urlInput.value.trim());
    productPage(product.id);
  });

  form.querySelector(".clear-video-link").addEventListener("click", () => {
    setProductVideo(product.id, "");
    productPage(product.id);
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    player.innerHTML = videoPlayer(previewUrl, product.name);
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
          <a class="button button-gold" href="${contactEmailHref}?subject=Jewelry%20Quote%20Request">Request Quote / Message Us</a>
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
      <p>Looking for something 1-of-1? Message us for custom designs, custom stone sizes, custom shapes, and full custom jewelry projects. Call or text ${contactPhone}, or email ${contactEmail}, for direct quote support.</p>
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
    event.currentTarget.insertAdjacentHTML("beforeend", `<p class="form-success">Request saved for this mockup. Call or text ${contactPhone}, or email ${contactEmail}, to continue.</p>`);
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
