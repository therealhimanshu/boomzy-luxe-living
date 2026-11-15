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
  },
  blinds: {
    title: "Blinds",
    label: "Blinds",
    image: "assets/mein-zimmer-pin",
    detail: "assets/mein-zimmer-pin",
    lead:
      "Elegant Venetian blinds with crisp horizontal slats, precise light control, and a refined finish for bedrooms, living rooms, and home offices.",
  },
  upholstery: {
    title: "Upholstery",
    label: "Upholstery",
    image: "assets/brochure/upholstery-sofa-card",
    detail: "assets/brochure/upholstery-sofa-detail",
    lead:
      "Sofa-led upholstery in warm, tactile fabrics chosen for comfort, durability, and sophistication in the rooms you live in most.",
  },
  wallpapers: {
    title: "Wallpapers",
    label: "Wallpapers",
    image: "assets/brochure/wallpapers-card",
    detail: "assets/brochure/wallpapers-detail",
    lead:
      "Decorative surfaces and statement patterns that give rooms individuality, depth, and a finished premium character.",
  },
  flooring: {
    title: "Wooden Flooring",
    label: "Wooden flooring",
    image: "assets/brochure/flooring-card",
    detail: "assets/brochure/flooring-detail",
    lead:
      "Elegant floor finishes for warm, inviting rooms that look beautiful for years to come.",
  },
};

const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("category");


const setProductPage = (key) => {
  const product = products[key] || products.curtains;
  const detailImage = document.querySelector("#detailImage");
  const detailSource = document.querySelector("#detailSource");

  if (!detailImage) return;

  if (detailSource) detailSource.srcset = `${product.detail}.avif`;
  detailImage.src = `${product.detail}.webp`;
  detailImage.alt = `${product.title} detail image`;
};

const categorySelect = document.querySelector("#categorySelect");
if (categorySelect) {
  const initial = products[categoryFromUrl] ? categoryFromUrl : "curtains";
  categorySelect.value = initial;
  setProductPage(initial);
  categorySelect.addEventListener("change", () => setProductPage(categorySelect.value));
}
