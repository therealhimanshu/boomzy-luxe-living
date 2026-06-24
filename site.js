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
    image: "assets/curtain-detail.webp",
    detail: "assets/curated-lounge.webp",
    lead:
      "A curated showcase of exceptional design and craftsmanship, selected for trade buyers who need elegant finishes across premium projects.",
  },
  blinds: {
    title: "Blinds",
    label: "Blinds",
    image: "assets/blinds.webp",
    detail: "assets/hero-suite.webp",
    lead:
      "Refined light control solutions for commercial, residential, and showroom environments where comfort and visual polish both matter.",
  },
  upholstery: {
    title: "Upholstery",
    label: "Upholstery",
    image: "assets/upholstery.webp",
    detail: "assets/distinctive-designs.webp",
    lead:
      "Warm layered fabrics chosen for comfort, durability, and sophistication across seating, soft furnishings, and project interiors.",
  },
  wallpapers: {
    title: "Wallpapers",
    label: "Wallpapers",
    image: "assets/wallpapers.webp",
    detail: "assets/wallpapers.webp",
    lead:
      "Decorative surfaces and statement patterns that give rooms individuality, depth, and a finished premium character.",
  },
  flooring: {
    title: "Wooden Flooring",
    label: "Wooden flooring",
    image: "assets/wooden-flooring.webp",
    detail: "assets/wooden-flooring.webp",
    lead:
      "Elegant floor finishes for warm, long-lasting interiors and project installations across homes, retail, and hospitality.",
  },
};

const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("category");
const productFromUrl = params.get("product");

const setProductPage = (key) => {
  const product = products[key] || products.curtains;
  const title = document.querySelector("#productTitle");
  const lead = document.querySelector("#productLead");
  const heroImage = document.querySelector("#productImage");
  const detailImage = document.querySelector("#detailImage");
  const enquireLink = document.querySelector("#enquireLink");

  if (!title) return;

  title.textContent = product.title;
  lead.textContent = product.lead;
  heroImage.src = product.image;
  heroImage.alt = `${product.title} product image`;
  detailImage.src = product.detail;
  detailImage.alt = `${product.title} detail image`;
  enquireLink.href = `enquire.html?product=${encodeURIComponent(product.label)}`;
};

const categorySelect = document.querySelector("#categorySelect");
if (categorySelect) {
  const initial = products[categoryFromUrl] ? categoryFromUrl : "curtains";
  categorySelect.value = initial;
  setProductPage(initial);
  categorySelect.addEventListener("change", () => setProductPage(categorySelect.value));
}

const productSelect = document.querySelector("#productSelect");
if (productSelect && productFromUrl) {
  const option = Array.from(productSelect.options).find((item) => item.value === productFromUrl);
  if (option) productSelect.value = productFromUrl;
}

const enquiryForm = document.querySelector("#enquiryPageForm");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(enquiryForm).entries());
    const body = [
      `Product interest: ${data.product}`,
      `Company: ${data.company}`,
      `Contact: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email || "Not provided"}`,
      `Buyer type: ${data.buyer}`,
      `Quantity: ${data.quantity || "To discuss"}`,
      `City: ${data.city || "Not provided"}`,
      "",
      data.notes || "No additional notes.",
    ].join("\n");
    window.location.href = `mailto:luxeliving0707@gmail.com?subject=${encodeURIComponent(
      "Luxe Living B2B enquiry - " + data.product
    )}&body=${encodeURIComponent(body)}`;
  });
}
