import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { ProductCard } from "./components/ProductCard.js";
import { RingCustomizer } from "./components/RingCustomizer.js";
import { SelectionSummary } from "./components/SelectionSummary.js";
import { CartItem } from "./components/CartItem.js";
import { categoryLabels, estimatePrice, formatCurrency, getCategoryProducts, getProduct, getVendor, normalizeSelection, productVideos, products } from "./data/products.js";

const app = document.querySelector("#app");
const cartKey = "nakama-gems-cart";
const selectionKey = "nakama-gems-selection";
const videoKey = "the-don-product-videos";
const braceletRequestKey = "the-don-bracelet-requests";
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
  return getProductVideos()[productId] || productVideos[productId] || "";
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

function getBraceletRequests() {
  return JSON.parse(localStorage.getItem(braceletRequestKey) || "[]");
}

function setBraceletRequests(requests) {
  localStorage.setItem(braceletRequestKey, JSON.stringify(requests));
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

function youtubeReplayUrl(src) {
  try {
    const replayUrl = new URL(src);
    replayUrl.searchParams.set("autoplay", "1");
    replayUrl.searchParams.set("start", "0");
    replayUrl.searchParams.set("playsinline", "1");
    replayUrl.searchParams.set("replay", String(Date.now()));
    return replayUrl.toString();
  } catch {
    return src;
  }
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
        <h2>Watch Video Preview</h2>
        <p>Watch a close-up video of this diamond or jewelry piece before requesting a quote.</p>
      </div>
      <div class="diamond-video-public">
        ${videoPlayer(currentVideo, product.name)}
        ${currentVideo ? `<button class="button button-light replay-video-button" type="button">Replay Video</button>` : ""}
      </div>
    </section>
  `;
}

function adminVideoManager(selectedProductId = products[0].id) {
  const product = getProduct(selectedProductId);
  const currentVideo = getProductVideo(product.id);

  shell(`
    <section class="page-hero compact">
      <img class="page-hero-logo" src="/assets/don-logo.jpg" alt="The Don Jewelers and Jewelry logo" />
      <p class="eyebrow">Admin Video Manager</p>
      <h1>Post product videos</h1>
      <p>This hidden mock-admin page lets you save a YouTube or hosted video link for each product. Public product pages only show the video, not the editing controls.</p>
    </section>
    <section class="diamond-video-section admin-video-section">
      <div class="diamond-video-layout">
        <div class="diamond-video-player" id="diamond-video-player">
          ${videoPlayer(currentVideo, product.name)}
        </div>
        <form class="diamond-video-form" data-product-id="${product.id}" aria-label="Admin product video manager">
          <label>
            <span>Product</span>
            <select name="product-id">
              ${products.map((item) => `
                <option value="${item.id}" ${item.id === product.id ? "selected" : ""}>${item.name}</option>
              `).join("")}
            </select>
          </label>
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
          <p class="video-note">Prototype admin only. On the live site, connect this to secure login plus cloud storage or a product dashboard so updates are visible to everyone.</p>
        </form>
      </div>
    </section>
  `);
  bindVideoManager(product);
}

function shell(content) {
  app.innerHTML = `${Header(getCart().length)}<main>${content}${AboutUs()}</main>${Footer()}`;
  bindSidebar();
}

function bindSidebar() {
  const openButton = document.querySelector("#sidebar-open");
  const closeButton = document.querySelector("#sidebar-close");
  const sidebar = document.querySelector("#site-sidebar");
  const backdrop = document.querySelector("#sidebar-backdrop");
  if (!openButton || !closeButton || !sidebar || !backdrop) return;

  const openSidebar = () => {
    sidebar.classList.add("is-open");
    sidebar.setAttribute("aria-hidden", "false");
    openButton.setAttribute("aria-expanded", "true");
    backdrop.hidden = false;
    closeButton.focus();
  };

  const closeSidebar = () => {
    sidebar.classList.remove("is-open");
    sidebar.setAttribute("aria-hidden", "true");
    openButton.setAttribute("aria-expanded", "false");
    backdrop.hidden = true;
    openButton.focus();
  };

  openButton.addEventListener("click", openSidebar);
  closeButton.addEventListener("click", closeSidebar);
  backdrop.addEventListener("click", closeSidebar);
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeSidebar));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) closeSidebar();
  });
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
      <h1>${category === "engagement-rings" ? "Build your engagement ring with The Don" : category === "rings" ? "Browse all rings from The Don" : `Shop ${title} with The Don`}</h1>
      ${category === "rings" ? `<p>Explore engagement rings and wedding bands in one place. More ready-made ring photos can be added here as inventory grows.</p>` : ""}
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
        ${product.description ? `<p class="product-description">${product.description}</p>` : ""}
        ${product.specs?.length ? `
          <div class="product-specs">
            <p class="eyebrow">Specs</p>
            <ul>
              ${product.specs.map((spec) => `<li>${spec}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
        <p>Starting at ${formatCurrency(product.basePrice)} before diamond, color, size, and style modifiers.</p>
      </div>
    </section>
    ${RingCustomizer(product, selection)}
    ${product.id === "ever-band" ? tennisBraceletRequestSection(selection) : ""}
    ${diamondVideoSection(product)}
  `);
  bindCustomizer(product.id);
  if (product.id === "ever-band") bindTennisBraceletForm(selection);
  bindVideoReplay();
}

function tennisBraceletRequestSection(selection) {
  return `
    <section class="tennis-request-section" id="tennis-bracelet-request">
      <div class="section-heading">
        <p class="eyebrow">Customer Request</p>
        <h2>Submit your custom tennis bracelet request</h2>
        <p>Pricing varies depending on diamond availability, market pricing, metal weight, and selected specifications. Once your custom request is submitted, our team will personally review your selections and contact you with final pricing.</p>
      </div>
      <form class="tennis-request-form" aria-label="Custom tennis bracelet request form">
        <label>Name<input name="name" type="text" autocomplete="name" required /></label>
        <label>Email<input name="email" type="email" autocomplete="email" required /></label>
        <label>Phone Number<input name="phone" type="tel" autocomplete="tel" required /></label>
        <label>Bracelet Length<input name="braceletLength" type="text" value="${selection.size || "7 inches"}" required /></label>
        <label>Metal Type<input name="metalType" type="text" value="${selection.metal || "14K Gold"}" required /></label>
        <label>Stone Size Selection<input name="stoneSize" type="text" value="${selection.stoneSize || "10 pointers (0.10 ct)"}" required /></label>
        <label>Total Carat Weight<input name="totalCarat" type="text" value="${selection.totalCarat || "5.5 CT"}" required /></label>
        <label class="full-span">Notes / Custom Requests<textarea name="notes" rows="5" placeholder="Custom size, diamond upgrades, special stones, or one-of-one requests"></textarea></label>
        <button class="button button-gold" type="submit">Submit Custom Request</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
      <div class="custom-cta-panel">
        <p class="eyebrow">Need a fully custom build?</p>
        <h2>Contact us for custom sizes, diamond upgrades, or one-of-one projects.</h2>
        <a class="button button-light" href="#/custom-orders">Request Custom Design</a>
      </div>
    </section>
  `;
}

function bindTennisBraceletForm(selection) {
  const form = document.querySelector(".tennis-request-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const request = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      product: "Custom Tennis Bracelet Builder",
      selection,
      customer: data
    };
    setBraceletRequests([...getBraceletRequests(), request]);

    const body = [
      "Custom Tennis Bracelet Request",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Bracelet Length: ${data.braceletLength}`,
      `Metal Type: ${data.metalType}`,
      `Stone Size Selection: ${data.stoneSize}`,
      `Total Carat Weight: ${data.totalCarat}`,
      `Notes / Custom Requests: ${data.notes || "None"}`
    ].join("\n");
    const mailto = `${contactEmailHref}?subject=${encodeURIComponent("Custom Tennis Bracelet Request")}&body=${encodeURIComponent(body)}`;
    form.querySelector(".form-status").textContent = "Request received. Your selections were saved and your email app will open so the request can be sent directly.";
    window.location.href = mailto;
  });
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
  const productSelect = form.querySelector('select[name="product-id"]');
  const player = document.querySelector("#diamond-video-player");

  productSelect.addEventListener("change", () => {
    adminVideoManager(productSelect.value);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setProductVideo(product.id, urlInput.value.trim());
    adminVideoManager(product.id);
  });

  form.querySelector(".clear-video-link").addEventListener("click", () => {
    setProductVideo(product.id, "");
    adminVideoManager(product.id);
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    player.innerHTML = videoPlayer(previewUrl, product.name);
  });
}

function bindVideoReplay() {
  document.querySelectorAll(".replay-video-button").forEach((button) => {
    button.addEventListener("click", () => {
      const frame = button.closest(".diamond-video-public")?.querySelector(".diamond-video-frame");
      if (!frame) return;

      if (frame.tagName.toLowerCase() === "video") {
        frame.currentTime = 0;
        frame.play();
        return;
      }

      const src = frame.getAttribute("src");
      frame.setAttribute("src", youtubeReplayUrl(src));
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

function termsPage() {
  const terms = [
    ["Custom Jewelry Policy", "All custom jewelry projects are made-to-order and manufactured specifically for the client. Custom projects include but are not limited to engagement rings, pendants, grillz, watches, bracelets, earrings, necklaces, nameplates, custom CAD projects, and one-of-one jewelry pieces. Once CAD work, stone sourcing, manufacturing preparation, or production has begun, all deposits become non-refundable. All custom jewelry sales are final."],
    ["CAD Design Deposits", "A non-refundable CAD/design deposit may be required before any custom project begins. CAD deposits cover CAD rendering, designer labor, stone sourcing, production preparation, vendor sourcing time, and manufacturing planning. CAD deposits are credited toward the final project balance unless otherwise stated in writing. Clients are entitled to reasonable CAD revisions before final approval. Once the client approves the CAD render/design, production officially begins."],
    ["Production Timelines", "Estimated production timelines vary depending on stone availability, metal availability, vendor inventory, project complexity, hand-setting processes, casting schedules, shipping delays, and international sourcing. Simple custom pieces: 2-4 weeks. Engagement rings: 3-6 weeks. Complex custom projects: 4-8+ weeks. Watches/custom iced pieces: 6-12+ weeks. Grillz: 1-3 weeks. Production timelines are estimates only and are not guaranteed delivery dates. Rush production services may be available depending on production capacity and vendor availability. Approved rush orders are subject to an automatic additional 20% rush fee added to the total project cost. Rush fees are non-refundable once production begins."],
    ["Payment Terms", "Accepted payment methods include cash, certified check, bank wire transfer, Apple Pay, and credit/debit card payments processed securely through Stripe. Certain transactions may require identity verification, billing verification, or signed invoice approval. Custom projects require a deposit before production begins unless otherwise agreed upon in writing. Remaining balances must be paid in full before delivery, pickup, shipment, or release of the item. Chargebacks or payment disputes filed after production has begun on a custom project may be considered fraudulent and subject to legal action and collections procedures. Returned checks are subject to additional fees and may delay production or release of items."],
    ["Returns & Exchanges", "Due to the nature of custom-made jewelry, all custom projects are final sale. Non-custom items may qualify for return or exchange within 7 days of delivery if the item is unworn, undamaged, and includes original packaging and paperwork. Approved returns may be subject to inspection, restocking fees, refinishing deductions, and shipping deductions. Custom jewelry, engraved items, resized items, special-order items, personalized pieces, and rush orders are non-refundable."],
    ["Stone & Material Disclosure", "All diamonds and gemstones are sold based on available grading and certifications. Lab-grown diamonds may include IGI, GCAL, or other recognized certifications. Natural diamonds may include GIA, IGI, or other recognized laboratories. Accent stones or melee diamonds may not include individual certifications. Metal weights, stone weights, and specifications may vary slightly due to polishing and hand-finishing tolerances."],
    ["Appraisals", "Appraisals are estimates of insurance/replacement value and are not guarantees of resale value. Gold, diamond, and gemstone markets fluctuate regularly."],
    ["Shipping Policy", "All shipments require adult signature confirmation, insurance, and verified billing information. The Don Jewelers & Jewelry is not liable for incorrect addresses provided by clients, carrier delays, or lost packages marked delivered by the carrier. Risk transfers to the client upon confirmed delivery."],
    ["Warranty & Repairs", "The Don Jewelers & Jewelry offers limited workmanship coverage on manufacturing defects. Coverage does not include physical damage, neglect, bent jewelry, broken chains, chipped stones, water damage, loss/theft, or normal wear and tear. Third-party modifications void all warranty coverage."],
    ["Client Responsibility", "Clients are responsible for providing accurate ring sizing, reviewing CAD renders carefully, reviewing invoices/specifications before approval, and maintaining insurance after delivery. CAD approval serves as authorization to manufacture the final piece."],
    ["Communication & Approvals", "All approvals should be made in writing via text message, email, signed invoice, or written agreement. Verbal approvals may not be honored."],
    ["Right to Refuse Service", "The Don Jewelers & Jewelry reserves the right to refuse service, decline projects, cancel orders, refuse transactions, or refund payments before production begins at its sole discretion."],
    ["Limitation of Liability", "The Don Jewelers & Jewelry shall not be held liable for indirect damages, emotional damages, shipping delays, vendor delays, market fluctuations, or loss of profits. Liability shall never exceed the original purchase amount paid by the client."],
    ["Agreement", "By placing an order, paying a deposit, approving a CAD design, or submitting payment, the client acknowledges they have read, understood, and agreed to all Terms & Conditions listed above."]
  ];

  shell(`
    <section class="page-hero compact">
      <img class="page-hero-logo" src="/assets/don-logo.jpg" alt="The Don Jewelers and Jewelry logo" />
      <p class="eyebrow">Legal</p>
      <h1>Terms and Conditions</h1>
      <a class="button button-gold" href="/assets/The_Don_Jewelers_Terms_and_Conditions.pdf" download>Download Original PDF</a>
    </section>
    <section class="terms-viewer-section">
      <article class="terms-document">
        <p class="terms-intro">By purchasing, placing a deposit, requesting a CAD design, or entering production with The Don Jewelers & Jewelry, the client agrees to all terms and conditions listed below.</p>
        ${terms.map(([title, body], index) => `
          <section>
            <h2>${index + 1}. ${title}</h2>
            <p>${body}</p>
          </section>
        `).join("")}
      </article>
    </section>
  `);
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
  if (page === "admin-videos") return adminVideoManager(id || products[0].id);
  if (page === "terms") return termsPage();
  if (page === "vendor") return productsPage();
  if (page === "cart") return cartPage();
  if (page === "checkout") return checkoutPage();
  return homePage();
}

// FUTURE INTEGRATION: Replace localStorage cart with Shopify, Medusa, Snipcart,
// WooCommerce, or vendor-dashboard API persistence when the backend is selected.
window.addEventListener("hashchange", route);
route();
