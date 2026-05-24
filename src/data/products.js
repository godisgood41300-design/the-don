export const vendors = [
  {
    id: "don",
    name: "The Don Jewelers & Jewelry",
    location: "By appointment",
    rating: 5,
    bio: "Luxury custom jewelry, engagement rings, chains, earrings, bracelets, and one-of-one design projects."
  }
];

export const products = [
  {
    id: "luna-solitaire",
    name: "Gold Engagement Ring Set",
    vendorId: "don",
    category: "engagement-rings",
    basePrice: 4200,
    image: "/assets/engagement-ring-feature.png",
    alt: "Radiant diamond engagement ring on hand"
  },
  {
    id: "wedding-band",
    name: "Classic Wedding Band Set",
    vendorId: "don",
    category: "wedding-bands",
    basePrice: 1800,
    image: "/assets/gold-engagement-rings.png",
    alt: "Gold wedding bands in a black jewelry box"
  },
  {
    id: "celeste-halo",
    name: "Princess Diamond Studs",
    vendorId: "don",
    category: "earrings",
    basePrice: 2250,
    image: "/assets/princess-diamond-earrings.png",
    alt: "Princess cut diamond earrings held with a white glove"
  },
  {
    id: "marquise-arc",
    name: "Red Diamond Necklace",
    vendorId: "don",
    category: "necklaces",
    basePrice: 2450,
    image: "/assets/red-diamond-necklace.png",
    alt: "Red diamond necklace pendant on a jewelry glove"
  },
  {
    id: "silver-cross-chain",
    name: "Silver Cross Chain",
    vendorId: "don",
    category: "chains",
    basePrice: 1650,
    image: "/assets/silver-cross-chain.png",
    alt: "Silver cross pendant and chain with blue stones"
  },
  {
    id: "ever-band",
    name: "Diamond Tennis Bracelet",
    vendorId: "don",
    category: "bracelets",
    basePrice: 1350,
    image: "/assets/diamond-bracelet.png",
    alt: "Diamond tennis bracelet displayed on a white glove"
  }
];

export const categoryLabels = {
  "engagement-rings": "Engagement Rings",
  "wedding-bands": "Wedding Bands",
  necklaces: "Necklaces",
  chains: "Chains",
  earrings: "Earrings",
  bracelets: "Bracelets",
  "custom-orders": "Custom Orders"
};

const ringSizes = [];
for (let size = 3; size <= 13; size += 0.5) {
  ringSizes.push(Number.isInteger(size) ? String(size) : String(size));
}

export const customizerOptions = {
  diamondSizes: ["1 carat", "1.5 carat", "2 carat", "2.5 carat", "3 carat", "3.5 carat", "4 carat", "4.5 carat", "5 carat", "5.5 carat", "6 carat"],
  earringWeights: ["1 carat", "1.5 carat", "2 carat", "2.5 carat", "3 carat", "3.5 carat", "4 carat", "4.5 carat", "5 carat", "5.5 carat", "6 carat"],
  diamondColors: ["D", "E"],
  clarity: ["VVS", "VS"],
  luxuryMetals: ["14K Yellow Gold", "14K White Gold", "14K Rose Gold", "Platinum", "Silver"],
  ringSizes,
  stoneShapes: ["Round", "Cushion", "Emerald", "Asscher", "Oval", "Pear", "Marquise", "Radiant", "Portuguese Cut", "Custom Shape"],
  earringTypes: ["Stud", "Hoop", "Drop", "Cluster", "Statement"],
  necklaceSizes: ["16 in", "18 in", "20 in", "22 in", "24 in"],
  chainSizes: ["18 in", "20 in", "22 in", "24 in", "26 in", "30 in"],
  braceletSizes: ["6 in", "6.5 in", "7 in", "7.5 in", "8 in", "8.5 in"],
  necklaceTypes: ["Pendant", "Halo Pendant", "Tennis", "Choker", "Layered"],
  chainTypes: ["Rope", "Cuban", "Tennis", "Box", "Figaro"],
  braceletTypes: ["Tennis", "Bangle", "Cuff", "Link", "Charm"]
};

export const metalModifiers = {
  "14K Yellow Gold": 0,
  "14K White Gold": 250,
  "14K Rose Gold": 220,
  Platinum: 900,
  Silver: 120
};

export const caratModifiers = {
  "1 carat": 1200,
  "1.5 carat": 2200,
  "2 carat": 3600,
  "2.5 carat": 5000,
  "3 carat": 6500,
  "3.5 carat": 8200,
  "4 carat": 9800,
  "4.5 carat": 12200,
  "5 carat": 14500,
  "5.5 carat": 16800,
  "6 carat": 19500
};

export const styleModifiers = {
  Stud: 0,
  Hoop: 250,
  Drop: 420,
  Cluster: 650,
  Statement: 900,
  Pendant: 0,
  "Halo Pendant": 600,
  Tennis: 850,
  Choker: 450,
  Layered: 500,
  Rope: 200,
  Cuban: 700,
  Box: 180,
  Figaro: 260,
  Bangle: 400,
  Cuff: 520,
  Link: 350,
  Charm: 300
};

const categoryConfig = {
  "engagement-rings": {
    label: "Engagement Ring",
    intro: "Select a diamond size, stone shape, diamond color, clarity, metal, and exact ring size. Your luxury engagement ring summary updates instantly.",
    previewCta: "Request Quote / Message Us",
    customCta: "Message Us for Custom Design / Custom Stone Size",
    summaryAria: "Live engagement ring selection summary",
    sections: [
      ["carat", "Diamond Size", customizerOptions.diamondSizes],
      ["shape", "Stone Shape", customizerOptions.stoneShapes],
      ["color", "Diamond Color", customizerOptions.diamondColors],
      ["clarity", "Clarity", customizerOptions.clarity],
      ["metal", "Metal", customizerOptions.luxuryMetals],
      ["size", "Ring Size", customizerOptions.ringSizes]
    ]
  },
  "wedding-bands": {
    label: "Wedding Band",
    intro: "Choose your band metal, ring size, diamond color, clarity, and diamond size for a clean custom wedding band request.",
    previewCta: "Request Quote / Message Us",
    customCta: "Message Us for Custom Band Design",
    summaryAria: "Live wedding band selection summary",
    sections: [
      ["metal", "Metal", customizerOptions.luxuryMetals],
      ["size", "Ring Size", customizerOptions.ringSizes],
      ["carat", "Diamond Size", customizerOptions.diamondSizes],
      ["color", "Diamond Color", customizerOptions.diamondColors],
      ["clarity", "Clarity", customizerOptions.clarity],
      ["shape", "Stone Shape", customizerOptions.stoneShapes]
    ]
  },
  earrings: {
    label: "Earrings",
    intro: "Select total diamond weight, diamond color, clarity, metal, and earring type for a premium earring quote.",
    previewCta: "Request Quote / Message Us",
    customCta: "Message Us for Custom Earrings",
    summaryAria: "Live earring selection summary",
    sections: [
      ["carat", "Total Diamond Weight", customizerOptions.earringWeights],
      ["color", "Diamond Color", customizerOptions.diamondColors],
      ["clarity", "Clarity", customizerOptions.clarity],
      ["metal", "Metal", customizerOptions.luxuryMetals],
      ["style", "Type of Earring", customizerOptions.earringTypes]
    ]
  },
  necklaces: {
    label: "Necklace",
    intro: "Choose necklace size, metal, stone size, diamond color, clarity, and necklace style for your custom necklace request.",
    previewCta: "Request Quote / Message Us",
    customCta: "Message Us for Custom Necklace Design",
    summaryAria: "Live necklace selection summary",
    sections: [
      ["size", "Necklace Size", customizerOptions.necklaceSizes],
      ["metal", "Metal", customizerOptions.luxuryMetals],
      ["carat", "Diamond Size", customizerOptions.diamondSizes],
      ["color", "Diamond Color", customizerOptions.diamondColors],
      ["clarity", "Clarity", customizerOptions.clarity],
      ["style", "Necklace Style", customizerOptions.necklaceTypes]
    ]
  },
  chains: {
    label: "Chain",
    intro: "Choose chain size, metal, diamond size, diamond color, clarity, and chain style for a luxury chain request.",
    previewCta: "Request Quote / Message Us",
    customCta: "Message Us for Custom Chain Design",
    summaryAria: "Live chain selection summary",
    sections: [
      ["size", "Chain Size", customizerOptions.chainSizes],
      ["metal", "Metal", customizerOptions.luxuryMetals],
      ["carat", "Diamond Size", customizerOptions.diamondSizes],
      ["color", "Diamond Color", customizerOptions.diamondColors],
      ["clarity", "Clarity", customizerOptions.clarity],
      ["style", "Chain Style", customizerOptions.chainTypes]
    ]
  },
  bracelets: {
    label: "Bracelet",
    intro: "Choose bracelet size, metal, diamond size, diamond color, clarity, and bracelet style for a custom bracelet quote.",
    previewCta: "Request Quote / Message Us",
    customCta: "Message Us for Custom Bracelet Design",
    summaryAria: "Live bracelet selection summary",
    sections: [
      ["size", "Bracelet Size", customizerOptions.braceletSizes],
      ["metal", "Metal", customizerOptions.luxuryMetals],
      ["carat", "Diamond Size", customizerOptions.diamondSizes],
      ["color", "Diamond Color", customizerOptions.diamondColors],
      ["clarity", "Clarity", customizerOptions.clarity],
      ["style", "Bracelet Style", customizerOptions.braceletTypes]
    ]
  }
};

export function getVendor(vendorId) {
  return vendors.find((vendor) => vendor.id === vendorId) || vendors[0];
}

export function getProduct(productId) {
  return products.find((product) => product.id === productId) || products[0];
}

export function getCategoryProducts(category) {
  return products.filter((product) => product.category === category);
}

export function getProductConfig(product) {
  return categoryConfig[product.category] || categoryConfig["engagement-rings"];
}

export function getCustomizerSections(product) {
  return getProductConfig(product).sections;
}

export function getDefaultSelection(product) {
  return getCustomizerSections(product).reduce((selection, [key, , options]) => {
    selection[key] = options[0];
    return selection;
  }, {});
}

export function normalizeSelection(product, selection = {}) {
  const defaults = getDefaultSelection(product);
  return getCustomizerSections(product).reduce((nextSelection, [key, , options]) => {
    nextSelection[key] = options.includes(selection[key]) ? selection[key] : defaults[key];
    return nextSelection;
  }, {});
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

export function estimatePrice(product, selection) {
  return (
    product.basePrice +
    (metalModifiers[selection.metal] || 0) +
    (caratModifiers[selection.carat] || 0) +
    (styleModifiers[selection.style] || 0)
  );
}
