export function Header(cartCount = 0) {
  const links = `
    <a href="#/">Home</a>
    <a href="#/category/rings">Rings</a>
    <a href="#/category/engagement-rings">Engagement Rings</a>
    <a href="#/category/wedding-bands">Wedding Bands</a>
    <a href="#/category/necklaces">Necklaces</a>
    <a href="#/category/chains">Chains</a>
    <a href="#/category/earrings">Earrings</a>
    <a href="#/category/bracelets">Bracelets</a>
    <a class="nav-highlight" href="#/custom-orders">Custom Orders</a>
    <a href="#/cart">Cart <span class="cart-pill">${cartCount}</span></a>
  `;

  return `
    <header class="site-header">
      <button class="brand brand-menu-button" type="button" id="sidebar-open" aria-label="Open site menu" aria-controls="site-sidebar" aria-expanded="false">
        <span class="brand-mark" aria-hidden="true">TD</span>
        <span>
          <strong>The Don</strong>
          <small>Jewelers & Jewelry</small>
        </span>
      </button>
      <nav class="nav-links" aria-label="Primary navigation">
        ${links}
      </nav>
    </header>
    <div class="sidebar-backdrop" id="sidebar-backdrop" hidden></div>
    <aside class="site-sidebar" id="site-sidebar" aria-label="Site menu" aria-hidden="true">
      <div class="sidebar-head">
        <span>
          <strong>The Don</strong>
          <small>Jewelers & Jewelry</small>
        </span>
        <button class="sidebar-close" type="button" id="sidebar-close" aria-label="Close site menu">Close</button>
      </div>
      <nav class="sidebar-links" aria-label="Sidebar navigation">
        ${links}
      </nav>
    </aside>
  `;
}
