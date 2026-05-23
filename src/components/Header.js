export function Header(cartCount = 0) {
  return `
    <header class="site-header">
      <a class="brand" href="#/">
        <img class="brand-logo" src="/assets/don-logo.jpg" alt="The Don Jewelers and Jewelry logo" />
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="#/">Home</a>
        <a href="#/category/engagement-rings">Engagement Rings</a>
        <a href="#/category/wedding-bands">Wedding Bands</a>
        <a href="#/category/necklaces">Necklaces</a>
        <a href="#/category/chains">Chains</a>
        <a href="#/category/earrings">Earrings</a>
        <a href="#/category/bracelets">Bracelets</a>
        <a class="nav-highlight" href="#/custom-orders">Custom Orders</a>
        <a href="#/cart">Cart <span class="cart-pill">${cartCount}</span></a>
      </nav>
    </header>
  `;
}
