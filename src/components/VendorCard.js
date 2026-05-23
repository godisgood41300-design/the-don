export function VendorCard(vendor) {
  return `
    <article class="vendor-card">
      <div class="vendor-badge" aria-hidden="true">${vendor.name.slice(0, 1)}</div>
      <div>
        <p class="eyebrow">${vendor.location} · ${vendor.rating} stars</p>
        <h3>${vendor.name}</h3>
        <p>${vendor.bio}</p>
        <a class="button button-light" href="#/vendor/${vendor.id}">View Vendor</a>
      </div>
    </article>
  `;
}
