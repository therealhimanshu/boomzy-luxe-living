document.querySelectorAll(".menu-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const nav = button.closest(".nav");
    const isOpen = nav.classList.toggle("nav-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    const nav = link.closest(".nav");
    const button = nav.querySelector(".menu-toggle");
    nav.classList.remove("nav-open");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
    }
  });
});

const products = {
  curtains: {
    title: "Curtains & Drapes",
    label: "Curtains and drapes",
    image: "assets/brochure/curtains-living-room",
    detail: "assets/brochure/curtains-living-room",
    lead:
      "A curated showcase of exceptional design and craftsmanship, chosen to bring elegant finishes to every room of your home.",
    gallery: [
      { src: "assets/brochure/curtains-living-room", avif: true },
      { src: "assets/brochure/curtains-luxe-detail" },
      { src: "assets/brochure/curtains-detail" },
      { src: "assets/brochure/curtains-card" },
      { src: "assets/brochure/contact-hero" },
      { src: "assets/brochure/showroom-curated" },
      { src: "assets/hero-suite" },
      { src: "assets/curated-lounge" },
    ],
  },
  blinds: {
    title: "Blinds",
    label: "Blinds",
    image: "assets/mein-zimmer-pin",
    detail: "assets/mein-zimmer-pin",
    lead:
      "Elegant Venetian blinds with crisp horizontal slats, precise light control, and a refined finish for bedrooms, living rooms, and home offices.",
    gallery: [
      { src: "assets/mein-zimmer-pin", avif: true },
      { src: "assets/brochure/venetian-blinds-detail" },
      { src: "assets/brochure/blinds-detail" },
      { src: "assets/blinds" },
    ],
  },
  upholstery: {
    title: "Upholstery",
    label: "Upholstery",
    image: "assets/brochure/upholstery-sofa-card",
    detail: "assets/brochure/upholstery-sofa-detail",
    lead:
      "Sofa-led upholstery in warm, tactile fabrics chosen for comfort, durability, and sophistication in the rooms you live in most.",
    gallery: [
      { src: "assets/brochure/upholstery-sofa-detail", avif: true },
      { src: "assets/brochure/upholstery-detail" },
      { src: "assets/brochure/showroom-vision" },
    ],
  },
  wallpapers: {
    title: "Wallpapers",
    label: "Wallpapers",
    image: "assets/brochure/wallpapers-card",
    detail: "assets/brochure/wallpapers-detail",
    lead:
      "Decorative surfaces and statement patterns that give rooms individuality, depth, and a finished premium character.",
    gallery: [
      { src: "assets/brochure/wallpapers-detail", avif: true },
      { src: "assets/brochure/wallpapers-card" },
      { src: "assets/wallpaper-study" },
    ],
  },
  flooring: {
    title: "Wooden Flooring",
    label: "Wooden flooring",
    image: "assets/brochure/flooring-card",
    detail: "assets/brochure/flooring-detail",
    lead:
      "Elegant floor finishes for warm, inviting rooms that look beautiful for years to come.",
    gallery: [
      { src: "assets/brochure/flooring-detail", avif: true },
      { src: "assets/brochure/flooring-card" },
    ],
  },
};

const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("category");

const setDetailImage = (item, alt) => {
  const detailImage = document.querySelector("#detailImage");
  const detailSource = document.querySelector("#detailSource");

  if (!detailImage) return;

  if (detailSource) {
    if (item.avif) {
      detailSource.srcset = `${item.src}.avif`;
    } else {
      detailSource.removeAttribute("srcset");
    }
  }
  detailImage.src = `${item.src}.webp`;
  detailImage.alt = alt;
};

const renderGallery = (product) => {
  const grid = document.querySelector("#galleryGrid");
  if (!grid) return;

  grid.innerHTML = "";
  product.gallery.forEach((item, index) => {
    const alt = `${product.label} catalogue photo ${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-thumb";
    button.setAttribute("aria-label", `View ${alt} in the showcase`);

    const img = document.createElement("img");
    img.src = `${item.src}.webp`;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";

    button.appendChild(img);
    button.addEventListener("click", () => {
      setDetailImage(item, alt);
      grid.querySelectorAll(".gallery-thumb").forEach((thumb) => thumb.classList.remove("active"));
      button.classList.add("active");
      if (window.innerWidth < 1000) {
        const panel = document.querySelector(".product-image");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    grid.appendChild(button);
  });
};

const setProductPage = (key) => {
  const product = products[key] || products.curtains;

  setDetailImage(
    { src: product.detail, avif: true },
    `${product.title} detail image`
  );

  const title = document.querySelector("#productTitle");
  const lead = document.querySelector("#productLead");
  if (title) title.textContent = product.title;
  if (lead) lead.textContent = product.lead;

  renderGallery(product);
};

const categorySelect = document.querySelector("#categorySelect");
if (categorySelect) {
  const initial = products[categoryFromUrl] ? categoryFromUrl : "curtains";
  categorySelect.value = initial;
  setProductPage(initial);
  categorySelect.addEventListener("change", () => setProductPage(categorySelect.value));
}
