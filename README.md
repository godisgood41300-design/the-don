# The Don Jewelers & Jewelry

A polished proxy/mock jewelry e-commerce website for custom ring selection, diamond options, independent vendors, preview, cart, and checkout placeholder flow.

This prototype is intentionally not Shopify-based. The data, cart, and checkout boundaries are structured so Shopify Buy Button, Stripe, Snipcart, Medusa, WooCommerce API, or a future vendor dashboard can be connected later.

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://localhost:4173
```

If `npm` is not available, run directly with Node:

```bash
node server.js
```

## Deploy Live

Recommended path: push this folder to a GitHub repository, then connect that repo to Vercel or Render.

Current deployment package marker: `v68-render-live-fix`.

After deploying, check the live footer. It should say:

```text
Updated Render build v68 - rings and videos included
```

If it does not, Render is still serving an older deploy, or the project files were uploaded into a nested folder instead of the repository root.

### 1. Create a GitHub repo

From this project folder:

```bash
git init
git add .
git commit -m "Launch The Don Jewelers website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

If Git is not installed on this computer, install Git for Windows or use GitHub Desktop, then publish this folder as a new repository.

### 2. Deploy on Vercel

Vercel is the simplest option for this current static-style site.

1. Go to Vercel and choose **Add New Project**.
2. Import the GitHub repository.
3. Keep the framework preset as **Other** if asked.
4. Leave build command blank unless Vercel fills one automatically.
5. Deploy.

The included `vercel.json` keeps the single-page app routing working and prevents stale cached files while you are still editing.

### 3. Deploy on Render

Render is also ready for this repo as a Node web service.

1. Go to Render and choose **New Web Service**.
2. Connect the GitHub repository.
3. Use:
   - Build command: `npm install`
   - Start command: `npm start`
4. Deploy.

The included `render.yaml` and `server.js` use Render's `PORT` environment variable automatically.

For stubborn old content on Render, open the service dashboard and run **Manual Deploy** with **Clear build cache & deploy** after pushing the newest GitHub files.

### 4. Add a domain later

Both Vercel and Render will give you a temporary live URL first. Later, connect your personal domain in the platform dashboard by adding their DNS records at your domain registrar.

## Structure

```text
index.html
server.js
src/
  main.js
  styles.css
  data/
    products.js
  components/
    CartItem.js
    Footer.js
    Header.js
    OptionButton.js
    ProductCard.js
    RingCustomizer.js
    SelectionSummary.js
    VendorCard.js
```

## Prototype Features

- Homepage with luxury hero, CTAs, featured collections, vendor spotlight, and trust badges
- Product listing with vendor-linked jewelry cards
- Product detail/customizer with keyboard-accessible option buttons
- Dynamic mock pricing using base ring, metal, carat, and band modifiers
- Selection preview with add-to-cart, edit, and contact vendor actions
- Vendor profile pages with vendor bio and product listings
- Cart stored in `localStorage`
- Checkout placeholder page for future integration
- Public product video previews, with admin-only upload/link controls on hidden admin routes

Admin video links saved in the browser use `localStorage`, which is only for local editing. To make a video appear on Render for all customers, add that YouTube link to `productVideos` in `src/data/products.js` before deploying.

## Future Integration Notes

Look for `FUTURE INTEGRATION` comments in the source near cart and checkout logic. Those are the natural connection points for:

- Shopify Buy Button
- Stripe Checkout or Payment Intents
- Snipcart
- Medusa
- WooCommerce REST API
- Independent vendor dashboard workflows
